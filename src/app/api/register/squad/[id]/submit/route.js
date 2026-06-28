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

  const detailsJson = sanitizeDetails(body?.detailsJson);

  // Atomic guard: only transition from an editable/rejected state. The WHERE
  // predicate prevents a concurrent admin review from being clobbered (TOCTOU).
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
        WHERE id = ?
          AND status IN ('forming','registered','rejected')`,
    )
    .bind(detailsJson, squadId)
    .run();

  if (!r.success) {
    return NextResponse.json({ error: "db_failure" }, { status: 500 });
  }
  if ((r.meta?.changes ?? 0) === 0) {
    return NextResponse.json({ error: "wrong_status" }, { status: 409 });
  }
  return NextResponse.json({ ok: true, status: "submitted" });
}

// Whitelist the per-event payload into a bounded, flat object: only
// string/number/boolean values, capped key count + string + serialized length.
// Never persist an arbitrary client blob (mass-assignment / storage DoS).
function sanitizeDetails(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) return null;
  const out = {};
  let n = 0;
  for (const [k, v] of Object.entries(input)) {
    if (n >= 20) break;
    if (typeof k !== "string" || k.length > 64) continue;
    if (typeof v === "string") out[k] = v.slice(0, 500);
    else if (typeof v === "number" && Number.isFinite(v)) out[k] = v;
    else if (typeof v === "boolean") out[k] = v;
    else continue;
    n++;
  }
  if (n === 0) return null;
  const json = JSON.stringify(out);
  return json.length > 4000 ? json.slice(0, 4000) : json;
}
