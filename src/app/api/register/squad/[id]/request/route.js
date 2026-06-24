// POST /api/register/squad/[id]/request
//   body: { message? }
//
// Approval-based "request to join" path (distinct from the instant invite-link
// join). A signed-in + GDG-verified user asks to join squad `id`; the squad
// leader approves/denies via /api/team/[id]/requests.
//
// Validations:
//   - squad exists + editable status (forming|registered)
//   - caller is not already a member of this squad
//   - caller is not already in another squad for this event
//   - squad not full
//   - no existing pending request (409)
// Upserts a join_requests row (status pending) and notifies the leader.
// Returns { ok: true, requestId }.

import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/server";
import { getDB } from "@/lib/db";
import { generateId } from "@/lib/ids";
import { notify } from "@/lib/notifications";
import { teamUrl } from "@/lib/registration/events";

export const runtime = "edge";

const EDITABLE = new Set(["forming", "registered"]);

export async function POST(req, { params }) {
  const { id: squadId } = await params;
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!user.gdg_verified) {
    return NextResponse.json({ error: "gdg_required" }, { status: 403 });
  }

  let body = {};
  try {
    body = (await req.json()) ?? {};
  } catch {
    // message is optional — tolerate an empty/invalid body.
    body = {};
  }
  const message =
    typeof body.message === "string" ? body.message.slice(0, 500) : null;

  const db = getDB();
  const squad = await db
    .prepare(
      `SELECT id, event, name, leader_id, status, max_members FROM squads WHERE id = ?`,
    )
    .bind(squadId)
    .first();
  if (!squad) return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (!EDITABLE.has(squad.status)) {
    return NextResponse.json(
      { error: "squad_locked", status: squad.status },
      { status: 409 },
    );
  }

  // Already a member of THIS squad?
  const isMember = await db
    .prepare(`SELECT 1 FROM squad_members WHERE squad_id = ? AND user_id = ? LIMIT 1`)
    .bind(squadId, user.id)
    .first();
  if (isMember) {
    return NextResponse.json({ error: "already_member" }, { status: 409 });
  }

  // Already in a squad for this event (same dup check as the join route)?
  const dup = await db
    .prepare(
      `SELECT 1 FROM squad_members sm
         JOIN squads s ON s.id = sm.squad_id
        WHERE sm.user_id = ? AND s.event = ? LIMIT 1`,
    )
    .bind(user.id, squad.event)
    .first();
  if (dup) {
    return NextResponse.json({ error: "already_in_squad" }, { status: 409 });
  }

  // Capacity.
  const countRow = await db
    .prepare(`SELECT COUNT(*) AS n FROM squad_members WHERE squad_id = ?`)
    .bind(squadId)
    .first();
  if ((countRow?.n ?? 0) >= squad.max_members) {
    return NextResponse.json({ error: "squad_full" }, { status: 409 });
  }

  // Existing request? UNIQUE(squad_id, user_id) means at most one row.
  const existing = await db
    .prepare(
      `SELECT id, status FROM join_requests WHERE squad_id = ? AND user_id = ?`,
    )
    .bind(squadId, user.id)
    .first();
  if (existing?.status === "pending") {
    return NextResponse.json(
      { error: "request_pending", requestId: existing.id },
      { status: 409 },
    );
  }

  let requestId;
  if (existing) {
    // Re-open a previously decided (approved/denied) request.
    requestId = existing.id;
    const r = await db
      .prepare(
        `UPDATE join_requests
            SET status = 'pending', message = ?, decided_by = NULL,
                decided_at = NULL, created_at = datetime('now')
          WHERE id = ?`,
      )
      .bind(message, requestId)
      .run();
    if (!r.success) {
      return NextResponse.json({ error: "db_failure" }, { status: 500 });
    }
  } else {
    requestId = generateId("join_request");
    const r = await db
      .prepare(
        `INSERT INTO join_requests (id, squad_id, user_id, message, status)
         VALUES (?, ?, ?, ?, 'pending')`,
      )
      .bind(requestId, squadId, user.id, message)
      .run();
    if (!r.success) {
      return NextResponse.json({ error: "db_failure" }, { status: 500 });
    }
  }

  const who = user.username ? `@${user.username}` : user.display_name ?? "Someone";
  await notify(squad.leader_id, {
    kind: "join_request",
    title: `${who} wants to join ${squad.name}`,
    body: message || `${who} requested to join your squad.`,
    link: teamUrl(squad.event, squad.id),
  });

  return NextResponse.json({ ok: true, requestId });
}
