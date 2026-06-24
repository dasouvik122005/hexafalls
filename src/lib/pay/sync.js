// Payment reconciliation — the safety net behind the inbound webhook.
//
// A webhook can be missed (deploy window, transient 5xx, provider hiccup). The
// GitHub-Actions cron calls api/cron/sync-payments, which calls this, which
// pulls the truth from Elixpo Pay (`/v1/sync`) and marks any still-'pending'
// payment 'paid' if Pay shows an active entitlement for it — then rolls the
// squad up to fees_settled.
//
// One-time season passes: this is STRICTLY ADDITIVE. It only moves payments
// forward (pending → paid) and squads forward (→ fees_settled). It never
// downgrades a paid member or un-settles a team.

import { fetchSyncEntitlements, fetchEntitlements } from "@/lib/pay/elixpo";
import { settleSquadIfComplete } from "@/lib/pay/settle";

// Tolerant view of one entitlement row from /v1/sync (or /v1/entitlements).
function normalize(row) {
  if (!row || typeof row !== "object") return null;
  const meta = row.metadata ?? row.meta ?? {};
  const status = String(row.status ?? row.state ?? "").toLowerCase();
  const granted =
    row.active === true ||
    ["active", "paid", "granted", "completed", "succeeded", "success"].includes(status);
  // active === false explicitly means revoked/expired → not granted.
  const isGranted = row.active === false ? false : granted;
  return {
    orderId:
      row.order_id ?? row.session_id ?? row.checkout_session_id ?? row.orderId ?? row.id ?? null,
    uid: row.uid ?? row.user_id ?? meta.uid ?? null,
    event: meta.event ?? row.event ?? null,
    entitlementId: row.entitlement_id ?? row.entitlement?.id ?? row.id ?? null,
    isGranted,
  };
}

// Mark a single payment paid (idempotent). Returns true if it flipped now.
async function markPaid(db, paymentId, entitlementId) {
  const upd = await db
    .prepare(
      `UPDATE payments
          SET status = 'paid', entitlement_id = COALESCE(?, entitlement_id),
              updated_at = datetime('now')
        WHERE id = ? AND status != 'paid'`,
    )
    .bind(entitlementId ?? null, paymentId)
    .run();
  return upd.success && (upd.meta?.changes ?? 0) > 0;
}

// Locate the still-unpaid payment an entitlement belongs to: prefer the stored
// provider order id, fall back to (uid, event) from metadata.
async function findPendingPayment(db, ent) {
  if (ent.orderId) {
    const byOrder = await db
      .prepare(
        `SELECT id, squad_id, event, status FROM payments WHERE elixpo_order_id = ? LIMIT 1`,
      )
      .bind(ent.orderId)
      .first();
    if (byOrder) return byOrder;
  }
  if (ent.uid && ent.event) {
    const byUser = await db
      .prepare(
        `SELECT id, squad_id, event, status FROM payments WHERE user_id = ? AND event = ? LIMIT 1`,
      )
      .bind(ent.uid, ent.event)
      .first();
    if (byUser) return byUser;
  }
  return null;
}

// Reconcile all payments against Elixpo Pay. `origin` is the absolute site
// origin used to build email links. Returns a summary for logging.
export async function reconcilePayments(db, { origin = "" } = {}) {
  const summary = { source: "sync", scanned: 0, markedPaid: 0, squadsSettled: 0, errors: [] };
  const affected = new Map(); // squadId -> event (dedupe rollups)

  const bulk = await fetchSyncEntitlements();

  if (!bulk.error) {
    for (const raw of bulk.entitlements) {
      const ent = normalize(raw);
      summary.scanned++;
      if (!ent || !ent.isGranted) continue;
      const payment = await findPendingPayment(db, ent);
      if (!payment) continue;
      if (payment.status !== "paid") {
        try {
          if (await markPaid(db, payment.id, ent.entitlementId)) summary.markedPaid++;
        } catch (e) {
          summary.errors.push(`mark ${payment.id}: ${e?.message ?? e}`);
          continue;
        }
      }
      if (payment.squad_id) affected.set(payment.squad_id, payment.event);
    }
  } else {
    // Bulk endpoint unavailable → fall back to a per-pending-payment pull.
    summary.source = "fallback";
    summary.bulkError = bulk.error;
    const pendingRes = await db
      .prepare(
        `SELECT id, user_id, squad_id, event FROM payments WHERE status != 'paid'`,
      )
      .all();
    const pending = pendingRes.results ?? [];
    for (const p of pending) {
      summary.scanned++;
      const res = await fetchEntitlements({ uid: p.user_id });
      if (res?.error) continue;
      const rows = Array.isArray(res)
        ? res
        : res.entitlements ?? res.data ?? res.results ?? [];
      const granted = (rows || [])
        .map(normalize)
        .some((e) => e && e.isGranted && (!e.event || e.event === p.event));
      if (!granted) continue;
      try {
        if (await markPaid(db, p.id, null)) summary.markedPaid++;
      } catch (e) {
        summary.errors.push(`mark ${p.id}: ${e?.message ?? e}`);
        continue;
      }
      if (p.squad_id) affected.set(p.squad_id, p.event);
    }
  }

  // Roll up every squad a newly-paid member belongs to.
  for (const [squadId, event] of affected) {
    try {
      const r = await settleSquadIfComplete(db, { squadId, event, origin });
      if (r?.settled) summary.squadsSettled++;
    } catch (e) {
      summary.errors.push(`settle ${squadId}: ${e?.message ?? e}`);
    }
  }

  return summary;
}
