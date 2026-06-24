// POST /api/callback/payouts
//
// Inbound Elixpo Pay webhook (entitlement.updated / successful payment).
// This path matches ELIXPO_PAY_WEBHOOK_URL configured in the Pay dashboard.
//
// SECURITY: the raw body is read and its signature verified BEFORE we parse or
// act on anything. We NEVER trust the payload before the HMAC check. Processing
// is idempotent so duplicate/replayed deliveries are no-ops. Once verified we
// always return 200 (even for no-ops) so the provider stops retrying; we only
// return 500 on a genuine DB failure.

import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { verifyWebhookSignature } from "@/lib/pay/elixpo";
import { REGISTRATION_EVENTS, teamUrl } from "@/lib/registration/events";
import { notifyMany } from "@/lib/notifications";
import { sendPaymentComplete } from "@/lib/mail/triggers";

export const runtime = "edge";

// Header Elixpo Pay sends the signature in. We accept the canonical name and a
// couple of common variants so a minor naming difference still verifies.
function readSignatureHeader(req) {
  return (
    req.headers.get("x-elixpo-signature") ??
    req.headers.get("x-elixpo-pay-signature") ??
    req.headers.get("elixpo-signature") ??
    null
  );
}

export async function POST(req) {
  // 1) Raw body + signature — verify before doing ANYTHING with the contents.
  const rawBody = await req.text();
  const signature = readSignatureHeader(req);

  const ok = await verifyWebhookSignature(rawBody, signature);
  if (!ok) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // 2) Now it's safe to parse.
  let evt;
  try {
    evt = JSON.parse(rawBody);
  } catch {
    // Verified but unparseable — nothing to do; ack so it stops retrying.
    return NextResponse.json({ ok: true });
  }

  const type = evt?.type ?? evt?.event ?? null;
  const data = evt?.data ?? evt?.object ?? evt ?? {};

  // We only act on a granted entitlement / successful payment.
  const active = data?.active ?? data?.entitlement?.active;
  const isGrant =
    type === "entitlement.updated" ||
    type === "checkout.session.completed" ||
    type === "payment.succeeded";
  if (!isGrant || active === false) {
    return NextResponse.json({ ok: true });
  }

  // Identifiers we can use to locate the payment row.
  const orderId =
    data?.order_id ?? data?.session_id ?? data?.checkout_session_id ?? data?.id ?? null;
  const meta = data?.metadata ?? {};
  const uid = data?.uid ?? data?.user_id ?? meta?.uid ?? null;
  const metaEvent = meta?.event ?? data?.event ?? null;
  const entitlementId =
    data?.entitlement_id ?? data?.entitlement?.id ?? data?.id ?? null;

  const db = getDB();

  // 3) Locate the payment: prefer the provider order id, fall back to
  // (uid, event) from metadata.
  let payment = null;
  if (orderId) {
    payment = await db
      .prepare(
        `SELECT id, user_id, squad_id, event, status FROM payments WHERE elixpo_order_id = ? LIMIT 1`,
      )
      .bind(orderId)
      .first();
  }
  if (!payment && uid && metaEvent) {
    payment = await db
      .prepare(
        `SELECT id, user_id, squad_id, event, status FROM payments WHERE user_id = ? AND event = ? LIMIT 1`,
      )
      .bind(uid, metaEvent)
      .first();
  }

  // No matching payment — verified but nothing to reconcile. Ack.
  if (!payment) {
    return NextResponse.json({ ok: true });
  }

  // 4) Idempotently mark paid. The guard makes duplicate deliveries no-ops.
  if (payment.status !== "paid") {
    const upd = await db
      .prepare(
        `UPDATE payments
            SET status = 'paid', entitlement_id = ?, updated_at = datetime('now')
          WHERE id = ? AND status != 'paid'`,
      )
      .bind(entitlementId, payment.id)
      .run();
    if (!upd.success) {
      return NextResponse.json({ error: "db_failure" }, { status: 500 });
    }
  }

  // 5) Squad rollup → fees_settled when every member has paid.
  const squadId = payment.squad_id;
  const event = payment.event;
  if (squadId) {
    try {
      await settleSquadIfComplete(db, { squadId, event, req });
    } catch (e) {
      // Rollup side-effects (notifications/email) are best-effort and must not
      // make the provider retry a payment we already recorded.
      console.warn(`[pay] rollup failed squad=${squadId}: ${e?.message ?? e}`);
    }
  }

  return NextResponse.json({ ok: true });
}

// Count members vs paid payments for the squad+event. If all members have paid
// AND the squad isn't already settled, flip it to fees_settled and fire the
// one-time notifications + leader email (idempotent via fees_settled_at guard
// and a stable email idempotencyKey).
async function settleSquadIfComplete(db, { squadId, event, req }) {
  const counts = await db
    .prepare(
      `SELECT
         (SELECT COUNT(*) FROM squad_members sm WHERE sm.squad_id = ?) AS members,
         (SELECT COUNT(*) FROM payments p
            WHERE p.squad_id = ? AND p.event = ? AND p.status = 'paid') AS paid`,
    )
    .bind(squadId, squadId, event)
    .first();

  const members = Number(counts?.members ?? 0);
  const paid = Number(counts?.paid ?? 0);
  if (members === 0 || paid < members) return;

  // Flip to settled only if not already settled (idempotent guard).
  const upd = await db
    .prepare(
      `UPDATE squads
          SET status = 'fees_settled',
              paid = 1,
              fees_settled_at = datetime('now'),
              updated_at = datetime('now')
        WHERE id = ? AND (fees_settled_at IS NULL)`,
    )
    .bind(squadId)
    .run();

  // If nothing changed, another delivery already settled it — don't re-notify.
  if (!upd.success || (upd.meta && upd.meta.changes === 0)) return;

  // Squad + leader details for notifications / email.
  const squad = await db
    .prepare(`SELECT id, name, event, leader_id FROM squads WHERE id = ? LIMIT 1`)
    .bind(squadId)
    .first();
  if (!squad) return;

  const memberRows = await db
    .prepare(`SELECT user_id FROM squad_members WHERE squad_id = ?`)
    .bind(squadId)
    .all();
  const memberIds = (memberRows.results ?? []).map((r) => r.user_id);

  const team = teamUrl(event, squadId);
  const origin = (() => {
    try {
      return new URL(req.url).origin;
    } catch {
      return "";
    }
  })();
  const teamLink = origin ? `${origin}${team}` : team;

  // In-profile notifications to every member.
  await notifyMany(memberIds, {
    kind: "payment",
    title: "Fees settled",
    body: `All members of ${squad.name ?? "your team"} have paid. Your team is fees-settled.`,
    link: team,
  });

  // Email the leader (one of the four "big events"). Stable idempotencyKey so
  // webhook retries never double-send.
  const leader = await db
    .prepare(`SELECT email, display_name FROM users WHERE id = ? LIMIT 1`)
    .bind(squad.leader_id)
    .first();
  if (leader?.email) {
    const amount = (REGISTRATION_EVENTS[event]?.pricePerPerson ?? 0) * 100 * members;
    await sendPaymentComplete({
      to: leader.email,
      name: leader.display_name,
      teamName: squad.name,
      event,
      amount,
      teamUrl: teamLink,
      idempotencyKey: `fees_settled:${squadId}`,
    });
  }
}
