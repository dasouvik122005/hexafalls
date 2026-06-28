// Squad fee rollup — shared by the inbound webhook (api/callback/payouts) and
// the reconciliation sync (api/cron/sync-payments) so both settle a team the
// exact same way.
//
// One-time season passes: a member's fee, once 'paid', stays paid forever. This
// helper only ever moves a squad FORWARD to fees_settled; it never downgrades.

import { REGISTRATION_EVENTS, teamUrl } from "@/lib/registration/events";
import { notify, notifyMany, notifyAdmins } from "@/lib/notifications";
import { sendPaymentComplete, sendPaymentReceived } from "@/lib/mail/triggers";

// Side-effects when a SINGLE member's fee is recorded paid (distinct from the
// whole-team settle below). Notifies the paying member + every admin/organizer
// and sends the member their own payment confirmation through Elixpo Mails (the
// provider receipt is suppressed). Best-effort — callers wrap in try/catch and
// must only invoke this on a real pending→paid transition (so it fires once).
export async function recordMemberPaymentPaid(db, { userId, event, squadId, origin = "" } = {}) {
  if (!userId || !event) return;

  const member = await db
    .prepare(`SELECT email, display_name, username FROM users WHERE id = ? LIMIT 1`)
    .bind(userId)
    .first();
  const squad = squadId
    ? await db.prepare(`SELECT name FROM squads WHERE id = ? LIMIT 1`).bind(squadId).first()
    : null;

  const eventLabel = REGISTRATION_EVENTS[event]?.label ?? event;
  const amount = (REGISTRATION_EVENTS[event]?.pricePerPerson ?? 0) * 100; // paise
  const rupees = (amount / 100).toFixed(0);
  const team = squadId ? teamUrl(event, squadId) : null;
  const teamLink = team ? (origin ? `${origin}${team}` : team) : "";
  const who = member?.display_name ?? (member?.username ? `@${member.username}` : "A member");

  // 1) Member in-profile notification.
  await notify(
    userId,
    {
      kind: "payment",
      title: "Payment received",
      body: `Your ₹${rupees} entry fee for ${eventLabel}${squad?.name ? ` (${squad.name})` : ""} is settled.`,
      link: team,
    },
    { db },
  );

  // 2) Admins / organizers.
  await notifyAdmins(
    {
      kind: "payment",
      title: "Entry fee paid",
      body: `${who} paid the ₹${rupees} ${eventLabel} fee${squad?.name ? ` for ${squad.name}` : ""}.`,
      link: team,
    },
    { db },
  );

  // 3) Member's own confirmation email (replaces the provider receipt). Stable
  // idempotency key so retries / a later cron run never double-send.
  if (member?.email) {
    await sendPaymentReceived({
      to: member.email,
      name: member.display_name ?? member.username,
      teamName: squad?.name,
      event: eventLabel,
      amount,
      teamUrl: teamLink,
      idempotencyKey: `payment_received:${userId}:${event}`,
    });
  }
}

// Team-pays model: the LEADER pays a single entry fee that locks in the whole
// squad. So a squad settles as soon as the leader's payment is 'paid' (not when
// every member has an individual payment). If settled and not already flagged,
// flip it to fees_settled and fire the one-time notifications + leader email.
// Idempotent via the fees_settled_at guard and a stable email idempotencyKey,
// so concurrent webhook + cron runs can't double-settle or double-send.
//
// `origin` is the absolute site origin (e.g. https://hexafalls.org) used to
// build an absolute team link for the email; pass "" to fall back to the path.
export async function settleSquadIfComplete(db, { squadId, event, origin = "" } = {}) {
  if (!squadId) return { settled: false };

  const row = await db
    .prepare(
      `SELECT s.leader_id AS leader_id,
              (SELECT COUNT(*) FROM payments p
                 WHERE p.squad_id = ? AND p.event = ?
                   AND p.user_id = s.leader_id AND p.status = 'paid') AS leader_paid
         FROM squads s WHERE s.id = ? LIMIT 1`,
    )
    .bind(squadId, event, squadId)
    .first();

  // Not settled until the leader's fee is paid.
  if (!row || Number(row.leader_paid ?? 0) < 1) return { settled: false };

  // The leader's fee is in. A SHORTLISTED team becomes APPROVED (seats locked);
  // any other status just records the payment without moving backward. Idempotent
  // via the fees_settled_at guard.
  const upd = await db
    .prepare(
      `UPDATE squads
          SET status = CASE WHEN status = 'shortlisted' THEN 'approved' ELSE status END,
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
  const memberCount = memberIds.length;

  const team = teamUrl(event, squadId);
  const teamLink = origin ? `${origin}${team}` : team;

  // In-profile notifications to every member.
  await notifyMany(memberIds, {
    kind: "payment",
    title: "Seats locked in",
    body: `${squad.name ?? "Your team"}'s entry fee is paid — your seats are locked in.`,
    link: team,
  });

  // Email the leader (one of the four "big events"). Stable idempotencyKey so
  // retries / a later cron run never double-send.
  const leader = await db
    .prepare(`SELECT email, display_name FROM users WHERE id = ? LIMIT 1`)
    .bind(squad.leader_id)
    .first();
  if (leader?.email) {
    const amount = (REGISTRATION_EVENTS[event]?.pricePerPerson ?? 0) * 100 * memberCount;
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
