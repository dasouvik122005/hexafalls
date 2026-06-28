// DELETE /api/team/[id]/members/[uid]
//
// Leader-only. Removes member `uid` from squad `id`.
// - Caller MUST be the squad's leader (re-checked against the session, never
//   trusted from the client) — guards against IDOR via the URL params.
// - Cannot remove the leader (409 cannot_remove_leader).
// - Only allowed while the squad is still editable (forming|registered).
// - Notifies the removed user (kind: member_removed).
// Returns { ok: true }.

import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/server";
import { getDB } from "@/lib/db";
import { notify } from "@/lib/notifications";
import { teamUrl } from "@/lib/registration/events";


const EDITABLE = new Set(["forming", "registered"]);

export async function DELETE(req, { params }) {
  const { id: squadId, uid } = await params;
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  if (!uid) {
    return NextResponse.json({ error: "invalid_user" }, { status: 400 });
  }

  const db = getDB();
  const squad = await db
    .prepare(`SELECT id, event, name, leader_id, status FROM squads WHERE id = ?`)
    .bind(squadId)
    .first();
  if (!squad) return NextResponse.json({ error: "not_found" }, { status: 404 });

  // Authorization: only the squad leader may remove members. Re-checked
  // against the DB row, never a client-supplied flag.
  if (squad.leader_id !== user.id) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  // Can't remove the leader (that's a dismantle, not a remove).
  if (uid === squad.leader_id) {
    return NextResponse.json({ error: "cannot_remove_leader" }, { status: 409 });
  }

  if (!EDITABLE.has(squad.status)) {
    return NextResponse.json(
      { error: "squad_locked", status: squad.status },
      { status: 409 },
    );
  }

  // Target must actually be a (non-leader) member of this squad.
  const member = await db
    .prepare(
      `SELECT role FROM squad_members WHERE squad_id = ? AND user_id = ?`,
    )
    .bind(squadId, uid)
    .first();
  if (!member) return NextResponse.json({ error: "not_a_member" }, { status: 404 });
  if (member.role === "leader") {
    return NextResponse.json({ error: "cannot_remove_leader" }, { status: 409 });
  }

  const r = await db
    .prepare(
      `DELETE FROM squad_members WHERE squad_id = ? AND user_id = ? AND role != 'leader'`,
    )
    .bind(squadId, uid)
    .run();
  if (!r.success) {
    return NextResponse.json({ error: "db_failure" }, { status: 500 });
  }

  await notify(uid, {
    kind: "member_removed",
    title: `Removed from ${squad.name}`,
    body: `You were removed from the squad "${squad.name}".`,
    link: teamUrl(squad.event, squad.id),
  });

  return NextResponse.json({ ok: true });
}
