// Payment reconciliation — the safety net behind the inbound webhook.
//
// A webhook can be missed (deploy window, transient 5xx, provider hiccup). The
// GitHub-Actions cron calls api/cron/sync-payments → this. For every payment
// that isn't 'paid' yet, we ask Elixpo Pay's entitlements endpoint whether that
// (user, event) buyer holds an active entitlement; if so we mark it paid and
// roll the squad up to fees_settled.
//
// One-time season passes: STRICTLY ADDITIVE. Only moves payments forward
// (pending → paid) and squads forward (→ fees_settled). Never downgrades.

import { fetchEntitlements, payUid } from "@/lib/pay/elixpo";
import { settleSquadIfComplete } from "@/lib/pay/settle";

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

// Reconcile all not-yet-paid payments against Elixpo Pay. `origin` is the
// absolute site origin used to build email links. Returns a summary.
export async function reconcilePayments(db, { origin = "" } = {}) {
  const summary = { scanned: 0, markedPaid: 0, squadsSettled: 0, errors: [] };
  const affected = new Map(); // squadId -> event (dedupe rollups)

  const pendingRes = await db
    .prepare(`SELECT id, user_id, squad_id, event FROM payments WHERE status != 'paid'`)
    .all();
  const pending = pendingRes.results ?? [];

  for (const p of pending) {
    summary.scanned++;
    const ent = await fetchEntitlements({ uid: payUid(p.user_id, p.event) });
    if (!ent || ent.error) continue;
    // `active` already accounts for expiry on Pay's side.
    if (ent.active !== true) continue;
    try {
      const entId = ent.version != null ? `${ent.tier}:v${ent.version}` : null;
      if (await markPaid(db, p.id, entId)) summary.markedPaid++;
    } catch (e) {
      summary.errors.push(`mark ${p.id}: ${e?.message ?? e}`);
      continue;
    }
    if (p.squad_id) affected.set(p.squad_id, p.event);
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
