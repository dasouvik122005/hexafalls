// POST /api/team/[id]/dismantle
//
// Leader-only. Dismantles the squad entirely (leader "leaving" == dismantle;
// there is no plain leave for the leader).
//
// - Caller MUST be the squad's leader (verified against the DB row).
// - Gather every member's user_id + email + the squad name/event FIRST, THEN
//   delete the squad. FK ON DELETE CASCADE removes squad_members + join_requests
//   + payments.
// - notifyMany the ex-members (kind: team_deleted).
// - sendTeamDeleted email to each member (best-effort) with an idempotencyKey.
// Returns { ok: true }.

import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/server";
import { getDB } from "@/lib/db";
import { notifyMany } from "@/lib/notifications";
import { sendTeamDeleted } from "@/lib/mail/triggers";


export async function POST(req, { params }) {
  const { id: squadId } = await params;
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const db = getDB();
  const squad = await db
    .prepare(`SELECT id, event, name, leader_id, status, paid FROM squads WHERE id = ?`)
    .bind(squadId)
    .first();
  if (!squad) return NextResponse.json({ error: "not_found" }, { status: 404 });

  // Authorization: only the leader may dismantle. DB-verified, never trusted
  // from the client.
  if (squad.leader_id !== user.id) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  // Once fees are settled or the team is approved, dismantling would cascade-
  // delete paid `payments` rows and orphan co-members who paid. Block it — these
  // teams must be unwound by an admin (with refund handling).
  if (squad.status === "fees_settled" || squad.status === "approved" || squad.paid === 1) {
    return NextResponse.json({ error: "team_locked" }, { status: 409 });
  }

  // Snapshot members BEFORE deletion (cascade will wipe squad_members).
  const memberRows = await db
    .prepare(
      `SELECT u.id, u.email, u.display_name
         FROM squad_members sm
         JOIN users u ON u.id = sm.user_id
        WHERE sm.squad_id = ?`,
    )
    .bind(squadId)
    .all();
  const members = memberRows.results ?? [];

  // Delete the squad — FK cascade removes squad_members + join_requests + payments.
  const r = await db
    .prepare(`DELETE FROM squads WHERE id = ? AND leader_id = ?`)
    .bind(squadId, user.id)
    .run();
  if (!r.success) {
    return NextResponse.json({ error: "db_failure" }, { status: 500 });
  }

  // In-profile notifications for everyone (including the leader).
  await notifyMany(
    members.map((m) => m.id),
    {
      kind: "team_deleted",
      title: `${squad.name} was dismantled`,
      body: `The squad "${squad.name}" has been dismantled by its leader.`,
    },
  );

  // Best-effort email to each member (idempotent per-member).
  await Promise.allSettled(
    members
      .filter((m) => m.email)
      .map((m) =>
        sendTeamDeleted({
          to: m.email,
          name: m.display_name,
          teamName: squad.name,
          event: squad.event,
          idempotencyKey: `team_deleted:${squad.id}:${m.id}`,
        }),
      ),
  );

  return NextResponse.json({ ok: true });
}
