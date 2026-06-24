// /api/team/[id]/requests
//
// Leader-only join-request management for squad `id`.
//
//   GET  → list pending join_requests (with requester identity).
//          → { requests: [{ id, user_id, message, created_at,
//                           username, elixpo_id, display_name }] }
//
//   POST { requestId, decision: "approve" | "deny" }
//          approve → re-check capacity + editable status, then atomically
//                    insert squad_member(role 'member') + mark request approved.
//          deny    → mark request denied.
//          → { ok: true, status }
//
// The caller MUST be the squad's leader (verified against the DB row, never a
// client flag). Guards against IDOR: `id` comes from the URL and is always
// re-checked against the session user.

import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/server";
import { getDB } from "@/lib/db";
import { notify } from "@/lib/notifications";
import { teamUrl } from "@/lib/registration/events";

export const runtime = "edge";

const EDITABLE = new Set(["forming", "registered"]);

async function loadLeaderSquad(db, squadId, userId) {
  const squad = await db
    .prepare(`SELECT id, event, name, leader_id, status, max_members FROM squads WHERE id = ?`)
    .bind(squadId)
    .first();
  if (!squad) return { error: "not_found", status: 404 };
  if (squad.leader_id !== userId) return { error: "forbidden", status: 403 };
  return { squad };
}

export async function GET(req, { params }) {
  const { id: squadId } = await params;
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const db = getDB();
  const { squad, error, status } = await loadLeaderSquad(db, squadId, user.id);
  if (error) return NextResponse.json({ error }, { status });

  const rows = await db
    .prepare(
      `SELECT jr.id, jr.user_id, jr.message, jr.created_at,
              u.username, u.elixpo_id, u.display_name
         FROM join_requests jr
         JOIN users u ON u.id = jr.user_id
        WHERE jr.squad_id = ? AND jr.status = 'pending'
        ORDER BY jr.created_at ASC`,
    )
    .bind(squad.id)
    .all();

  return NextResponse.json({ requests: rows.results ?? [] });
}

export async function POST(req, { params }) {
  const { id: squadId } = await params;
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  const requestId = body?.requestId;
  const decision = body?.decision;
  if (!requestId || (decision !== "approve" && decision !== "deny")) {
    return NextResponse.json({ error: "invalid_decision" }, { status: 400 });
  }

  const db = getDB();
  const { squad, error, status } = await loadLeaderSquad(db, squadId, user.id);
  if (error) return NextResponse.json({ error }, { status });

  // The request must belong to THIS squad and still be pending.
  const jr = await db
    .prepare(
      `SELECT id, squad_id, user_id, status FROM join_requests WHERE id = ?`,
    )
    .bind(requestId)
    .first();
  if (!jr || jr.squad_id !== squad.id) {
    return NextResponse.json({ error: "request_not_found" }, { status: 404 });
  }
  if (jr.status !== "pending") {
    return NextResponse.json(
      { error: "already_decided", status: jr.status },
      { status: 409 },
    );
  }

  if (decision === "deny") {
    const r = await db
      .prepare(
        `UPDATE join_requests
            SET status = 'denied', decided_by = ?, decided_at = datetime('now')
          WHERE id = ? AND status = 'pending'`,
      )
      .bind(user.id, requestId)
      .run();
    if (!r.success) {
      return NextResponse.json({ error: "db_failure" }, { status: 500 });
    }
    await notify(jr.user_id, {
      kind: "join_request",
      title: `Request to join ${squad.name} declined`,
      body: `Your request to join "${squad.name}" was not accepted.`,
      link: teamUrl(squad.event, squad.id),
    });
    return NextResponse.json({ ok: true, status: "denied" });
  }

  // --- approve path ---
  if (!EDITABLE.has(squad.status)) {
    return NextResponse.json(
      { error: "squad_locked", status: squad.status },
      { status: 409 },
    );
  }

  // Re-check capacity at decision time.
  const countRow = await db
    .prepare(`SELECT COUNT(*) AS n FROM squad_members WHERE squad_id = ?`)
    .bind(squad.id)
    .first();
  if ((countRow?.n ?? 0) >= squad.max_members) {
    return NextResponse.json({ error: "squad_full" }, { status: 409 });
  }

  // Guard: the requester must not already be in a squad for this event.
  const dup = await db
    .prepare(
      `SELECT 1 FROM squad_members sm
         JOIN squads s ON s.id = sm.squad_id
        WHERE sm.user_id = ? AND s.event = ? LIMIT 1`,
    )
    .bind(jr.user_id, squad.event)
    .first();
  if (dup) {
    return NextResponse.json({ error: "already_in_squad" }, { status: 409 });
  }

  // Atomic: add the member + mark the request approved.
  const batch = await db.batch([
    db
      .prepare(
        `INSERT INTO squad_members (squad_id, user_id, role)
         VALUES (?, ?, 'member')`,
      )
      .bind(squad.id, jr.user_id),
    db
      .prepare(
        `UPDATE join_requests
            SET status = 'approved', decided_by = ?, decided_at = datetime('now')
          WHERE id = ? AND status = 'pending'`,
      )
      .bind(user.id, requestId),
  ]);
  if (batch.some((r) => !r.success)) {
    return NextResponse.json({ error: "db_failure" }, { status: 500 });
  }

  await notify(jr.user_id, {
    kind: "join_request",
    title: `You're in ${squad.name}!`,
    body: `Your request to join "${squad.name}" was approved.`,
    link: teamUrl(squad.event, squad.id),
  });

  return NextResponse.json({ ok: true, status: "approved" });
}
