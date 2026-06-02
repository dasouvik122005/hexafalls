// POST /api/admin/squads/[id]/review
//
// Admin / organizer signs off (or rejects) a submitted squad.
// body: { decision: 'approve' | 'reject', notes?: string }
//
// Only role IN ('admin','organizer') may call this.

import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/server";
import { getDB } from "@/lib/db";

export const runtime = "edge";

const ADMIN_ROLES = new Set(["admin", "organizer"]);

export async function POST(req, { params }) {
  const { id: squadId } = await params;
  const me = await getSessionUser();
  if (!me) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!ADMIN_ROLES.has(me.role)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  const decision = body?.decision;
  const notes = typeof body?.notes === "string" ? body.notes.slice(0, 1000) : null;
  if (decision !== "approve" && decision !== "reject") {
    return NextResponse.json({ error: "invalid_decision" }, { status: 400 });
  }

  const db = getDB();
  const squad = await db
    .prepare(`SELECT id, status FROM squads WHERE id = ?`)
    .bind(squadId)
    .first();
  if (!squad) return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (squad.status !== "submitted") {
    return NextResponse.json(
      { error: "wrong_status", status: squad.status },
      { status: 409 },
    );
  }

  const nextStatus = decision === "approve" ? "approved" : "rejected";

  const r = await db
    .prepare(
      `UPDATE squads
          SET status        = ?,
              review_notes  = ?,
              reviewed_at   = datetime('now'),
              reviewed_by   = ?,
              updated_at    = datetime('now')
        WHERE id = ?`,
    )
    .bind(nextStatus, notes, me.id, squadId)
    .run();

  if (!r.success) {
    return NextResponse.json({ error: "db_failure" }, { status: 500 });
  }
  return NextResponse.json({ ok: true, status: nextStatus });
}
