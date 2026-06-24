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
import { settleSquadIfComplete } from "@/lib/pay/settle";

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
      const origin = (() => {
        try {
          return new URL(req.url).origin;
        } catch {
          return "";
        }
      })();
      await settleSquadIfComplete(db, { squadId, event, origin });
    } catch (e) {
      // Rollup side-effects (notifications/email) are best-effort and must not
      // make the provider retry a payment we already recorded.
      console.warn(`[pay] rollup failed squad=${squadId}: ${e?.message ?? e}`);
    }
  }

  return NextResponse.json({ ok: true });
}
