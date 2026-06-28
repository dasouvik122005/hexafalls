// POST /api/pay/checkout
//   body: { event, squadId? }
//
// Starts (or resumes) the fee payment for the caller's seat in a paid event.
// - Requires session + GDG verification.
// - Rejects free events (400 event_not_paid).
// - Authz: the caller must actually be a member of `squadId` for that event.
// - Idempotent: a 'paid' row → 409 already_paid; a 'pending' row is reused.
// - Amount is set SERVER-SIDE from event config (never from client input).
// - Returns { checkoutUrl, paymentId }.

import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/server";
import { getDB } from "@/lib/db";
import { generateId } from "@/lib/ids";
import { REGISTRATION_EVENTS, isPaidEvent, isPayableNow, teamUrl, payTierFor } from "@/lib/registration/events";
import { createCheckoutSession } from "@/lib/pay/elixpo";


const CURRENCY = "INR";

export async function POST(req) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!user.gdg_verified) {
    return NextResponse.json({ error: "gdg_required" }, { status: 403 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const { event, squadId } = body ?? {};

  if (!REGISTRATION_EVENTS[event] || !isPaidEvent(event)) {
    return NextResponse.json({ error: "event_not_paid" }, { status: 400 });
  }
  if (typeof squadId !== "string" || !squadId) {
    return NextResponse.json({ error: "invalid_squad" }, { status: 400 });
  }

  const db = getDB();

  // Authz: caller must be a member of this squad AND the squad must be for the
  // claimed event. One query covers membership + event match + leader id.
  const membership = await db
    .prepare(
      `SELECT s.id AS squad_id, s.status AS status, s.leader_id AS leader_id
         FROM squad_members sm
         JOIN squads s ON s.id = sm.squad_id
        WHERE sm.user_id = ? AND s.id = ? AND s.event = ?
        LIMIT 1`,
    )
    .bind(user.id, squadId, event)
    .first();
  if (!membership) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  // Only the team leader pays — a single payment locks in the whole squad's
  // seats. Other members can't initiate checkout.
  if (membership.leader_id !== user.id) {
    return NextResponse.json({ error: "leader_only" }, { status: 403 });
  }

  // Enforce payment timing: hackathon/gaming pay only after approval;
  // hardware-competition pays at registration.
  if (!isPayableNow(event, membership.status)) {
    return NextResponse.json({ error: "not_payable_yet" }, { status: 409 });
  }

  // Idempotency on (user_id, event) — the payments table enforces it too.
  const existing = await db
    .prepare(`SELECT id, status FROM payments WHERE user_id = ? AND event = ? LIMIT 1`)
    .bind(user.id, event)
    .first();

  if (existing?.status === "paid") {
    return NextResponse.json({ error: "already_paid" }, { status: 409 });
  }

  const amount = (REGISTRATION_EVENTS[event].pricePerPerson ?? 0) * 100; // paise
  const idempotencyKey = `${user.id}:${event}`;

  let paymentId = existing?.id;
  if (!paymentId) {
    paymentId = generateId("payment");
    const ins = await db
      .prepare(
        `INSERT INTO payments
           (id, user_id, squad_id, event, amount, currency, status, idempotency_key)
         VALUES (?, ?, ?, ?, ?, ?, 'pending', ?)`,
      )
      .bind(paymentId, user.id, squadId, event, amount, CURRENCY, idempotencyKey)
      .run();
    if (!ins.success) {
      return NextResponse.json({ error: "db_failure" }, { status: 500 });
    }
  } else {
    // Resume a pending row: keep amount/squad in sync with current config.
    const upd = await db
      .prepare(
        `UPDATE payments
            SET squad_id = ?, amount = ?, currency = ?, updated_at = datetime('now')
          WHERE id = ?`,
      )
      .bind(squadId, amount, CURRENCY, paymentId)
      .run();
    if (!upd.success) {
      return NextResponse.json({ error: "db_failure" }, { status: 500 });
    }
  }

  const origin = new URL(req.url).origin;
  const team = teamUrl(event, squadId);

  // Amount is NOT sent to Pay — it resolves the price from our catalog (the
  // buyer can't tamper with it). We keep `amount` locally only for our payments
  // row + the team's progress bar.
  const session = await createCheckoutSession({
    userId: user.id,
    event,
    squadId,
    email: user.email,
    currency: CURRENCY,
    tier: payTierFor(event),
    successUrl: `${origin}${team}?paid=1`,
  });

  if (session.error || !session.checkoutUrl) {
    return NextResponse.json({ error: "checkout_failed" }, { status: 502 });
  }

  // Record the provider order id for webhook reconciliation (best-effort).
  if (session.orderId) {
    await db
      .prepare(
        `UPDATE payments SET elixpo_order_id = ?, updated_at = datetime('now') WHERE id = ?`,
      )
      .bind(session.orderId, paymentId)
      .run();
  }

  return NextResponse.json({ checkoutUrl: session.checkoutUrl, paymentId });
}
