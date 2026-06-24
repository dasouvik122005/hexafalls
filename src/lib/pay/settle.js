// Squad fee rollup — shared by the inbound webhook (api/callback/payouts) and
// the reconciliation sync (api/cron/sync-payments) so both settle a team the
// exact same way.
//
// One-time season passes: a member's fee, once 'paid', stays paid forever. This
// helper only ever moves a squad FORWARD to fees_settled; it never downgrades.

import { REGISTRATION_EVENTS, teamUrl } from "@/lib/registration/events";
import { notifyMany } from "@/lib/notifications";
import { sendPaymentComplete } from "@/lib/mail/triggers";

// Count members vs paid payments for the squad+event. If every member has paid
// AND the squad isn't already settled, flip it to fees_settled and fire the
// one-time notifications + leader email. Idempotent via the fees_settled_at
// guard and a stable email idempotencyKey, so concurrent webhook + cron runs
// can't double-settle or double-send.
//
// `origin` is the absolute site origin (e.g. https://hexafalls.org) used to
// build an absolute team link for the email; pass "" to fall back to the path.
export async function settleSquadIfComplete(db, { squadId, event, origin = "" } = {}) {
  if (!squadId) return { settled: false };

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
  if (members === 0 || paid < members) return { settled: false };

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

  // If nothing changed, another delivery/run already settled it — don't re-notify.
  if (!upd.success || (upd.meta && upd.meta.changes === 0)) return { settled: false };

  const squad = await db
    .prepare(`SELECT id, name, event, leader_id FROM squads WHERE id = ? LIMIT 1`)
    .bind(squadId)
    .first();
  if (!squad) return { settled: true };

  const memberRows = await db
    .prepare(`SELECT user_id FROM squad_members WHERE squad_id = ?`)
    .bind(squadId)
    .all();
  const memberIds = (memberRows.results ?? []).map((r) => r.user_id);

  const team = teamUrl(event, squadId);
  const teamLink = origin ? `${origin}${team}` : team;

  // In-profile notifications to every member.
  await notifyMany(memberIds, {
    kind: "payment",
    title: "Fees settled",
    body: `All members of ${squad.name ?? "your team"} have paid. Your team is fees-settled.`,
    link: team,
  });

  // Email the leader (one of the four "big events"). Stable idempotencyKey so
  // retries / a later cron run never double-send.
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

  return { settled: true };
}
