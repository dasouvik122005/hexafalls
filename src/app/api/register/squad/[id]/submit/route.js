// POST /api/register/squad/[id]/submit
//
// Leader hits "Submit for review" once the squad is at >= min_members.
// Transitions status `forming` → `submitted`. Admin/organizer review then
// flips it to `approved` (or `rejected` with notes).
//
// body: { detailsJson?: object }  — extra event-specific payload to persist
//                                   alongside the squad (project idea, etc).

import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/server";
import { getDB } from "@/lib/db";

export const runtime = "edge";

export async function POST(req, { params }) {
  const { id: squadId } = await params;
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  let body = {};
  try {
    body = (await req.json()) ?? {};
  } catch {
    /* empty body is fine */
  }

  const db = getDB();
  const squad = await db
    .prepare(
      `SELECT id, leader_id, status, min_members FROM squads WHERE id = ?`,
    )
    .bind(squadId)
    .first();
  if (!squad) return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (squad.leader_id !== user.id) {
    return NextResponse.json({ error: "not_leader" }, { status: 403 });
  }
  if (
    squad.status !== "forming" &&
    squad.status !== "registered" &&
    squad.status !== "rejected"
  ) {
    return NextResponse.json(
      { error: "wrong_status", status: squad.status },
      { status: 409 },
    );
  }

  const countRow = await db
    .prepare(`SELECT COUNT(*) AS n FROM squad_members WHERE squad_id = ?`)
    .bind(squadId)
    .first();
  if ((countRow?.n ?? 0) < squad.min_members) {
    return NextResponse.json(
      { error: "below_min_members", required: squad.min_members },
      { status: 409 },
    );
  }

  const detailsJson =
    body && typeof body.detailsJson === "object" && body.detailsJson !== null
      ? JSON.stringify(body.detailsJson)
      : null;

  const r = await db
    .prepare(
      `UPDATE squads
          SET status = 'submitted',
              submitted_at = datetime('now'),
              details_json = COALESCE(?, details_json),
              review_notes = NULL,
              reviewed_at  = NULL,
              reviewed_by  = NULL,
              updated_at   = datetime('now')
        WHERE id = ?`,
    )
    .bind(detailsJson, squadId)
    .run();

  if (!r.success) {
    return NextResponse.json({ error: "db_failure" }, { status: 500 });
  }
  return NextResponse.json({ ok: true, status: "submitted" });
}
