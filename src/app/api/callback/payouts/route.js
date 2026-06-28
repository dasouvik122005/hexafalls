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
import { verifyWebhookSignature, parsePayUid } from "@/lib/pay/elixpo";
import { settleSquadIfComplete, recordMemberPaymentPaid } from "@/lib/pay/settle";

export const runtime = "edge";

export async function POST(req) {
  // 1) Raw body + signature — verify before doing ANYTHING with the contents.
  // Docs: X-Elixpo-Pay-Signature: sha256=<hmac of `${timestamp}.${rawBody}`>,
  // timestamp in X-Elixpo-Pay-Timestamp.
  const rawBody = await req.text();
  const signature = req.headers.get("x-elixpo-pay-signature");
  const timestamp = req.headers.get("x-elixpo-pay-timestamp");

  const ok = await verifyWebhookSignature(rawBody, signature, timestamp);
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

  const type = evt?.type ?? req.headers.get("x-elixpo-pay-event") ?? null;
  const data = evt?.data ?? {};

  // We only fulfill on a granted entitlement. `entitlement.updated` is the
  // required event; payment.captured is optional/analytics. `active` already
  // accounts for expiry on Pay's side.
  if (type !== "entitlement.updated" || data?.active === false) {
    return NextResponse.json({ ok: true });
  }
  const statusOk = data?.active === true || data?.status === "active";
  if (!statusOk) {
    return NextResponse.json({ ok: true });
  }

  // The payload carries { app, uid, tier, status, active, expires_at }. Our uid
  // is `${userId}:${event}` — parse it back to locate the exact payment row.
  const { userId, event } = parsePayUid(data?.uid);
  if (!userId || !event) {
    return NextResponse.json({ ok: true });
  }
  const entitlementId = data?.version != null ? `${data.tier}:v${data.version}` : null;

  const db = getDB();

  const payment = await db
    .prepare(
      `SELECT id, user_id, squad_id, event, status FROM payments
        WHERE user_id = ? AND event = ? LIMIT 1`,
    )
    .bind(userId, event)
    .first();

  // No matching payment — verified but nothing to reconcile. Ack.
  if (!payment) {
    return NextResponse.json({ ok: true });
  }

  const origin = (() => {
    try {
      return new URL(req.url).origin;
    } catch {
      return "";
    }
  })();

  // 4) Idempotently mark paid. The guard makes duplicate deliveries no-ops;
  // `flipped` is true only on the real pending→paid transition.
  let flipped = false;
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
    flipped = (upd.meta?.changes ?? 0) > 0;
  }

  // 4a) Per-member side-effects (member + admin notifications, buyer email).
  // Only on the real transition so duplicate deliveries don't re-notify.
  if (flipped) {
    try {
      await recordMemberPaymentPaid(db, {
        userId,
        event,
        squadId: payment.squad_id,
        origin,
      });
    } catch (e) {
      console.warn(`[pay] member side-effects failed ${userId}:${event}: ${e?.message ?? e}`);
    }
  }

  // 5) Squad rollup → fees_settled when every member has paid.
  const squadId = payment.squad_id;
  if (squadId) {
    try {
      await settleSquadIfComplete(db, { squadId, event, origin });
    } catch (e) {
      // Rollup side-effects (notifications/email) are best-effort and must not
      // make the provider retry a payment we already recorded.
      console.warn(`[pay] rollup failed squad=${squadId}: ${e?.message ?? e}`);
    }
  }

  return NextResponse.json({ ok: true });
}
