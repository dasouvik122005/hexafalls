// /api/team/[id]
//
// Leader-only team metadata editing for squad `id`.
//
//   PATCH { name?, tagline?, description? }
//          → updates the squad's display fields. Only the fields present in the
//            body are touched. Validates + length-caps every input.
//          → { ok: true, name, tagline, description }
//
// The caller MUST be the squad's leader (verified against the DB row, never a
// client flag). Guards against IDOR: `id` comes from the URL and is always
// re-checked against the session user. Editing is only allowed while the squad
// is still in an editable status (forming / registered / rejected) — once it is
// under review / fees settled / approved the metadata is frozen.

import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/server";
import { getDB } from "@/lib/db";

export const runtime = "edge";

// Editable statuses (canonical + legacy synonyms).
const EDITABLE = new Set(["forming", "registered", "rejected"]);

// Mirror the limits enforced at squad-create time.
const NAME_MIN = 2;
const NAME_MAX = 48;
const TAGLINE_MAX = 120;
const DESCRIPTION_MAX = 800;

export async function PATCH(req, { params }) {
  const { id: squadId } = await params;
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const db = getDB();

  // Authorization: re-verify leadership against the DB row, never the client.
  const squad = await db
    .prepare(`SELECT id, leader_id, status FROM squads WHERE id = ?`)
    .bind(squadId)
    .first();
  if (!squad) return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (squad.leader_id !== user.id) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  if (!EDITABLE.has(squad.status)) {
    return NextResponse.json(
      { error: "squad_locked", status: squad.status },
      { status: 409 },
    );
  }

  // Build the SET clause only from the fields the client actually sent.
  const sets = [];
  const binds = [];

  if (body?.name !== undefined) {
    if (typeof body.name !== "string") {
      return NextResponse.json({ error: "invalid_name" }, { status: 400 });
    }
    const name = body.name.trim();
    if (name.length < NAME_MIN || name.length > NAME_MAX) {
      return NextResponse.json({ error: "invalid_name" }, { status: 400 });
    }
    sets.push("name = ?");
    binds.push(name);
  }

  if (body?.tagline !== undefined) {
    if (body.tagline !== null && typeof body.tagline !== "string") {
      return NextResponse.json({ error: "invalid_tagline" }, { status: 400 });
    }
    const t = body.tagline == null ? "" : body.tagline.trim();
    if (t.length > TAGLINE_MAX) {
      return NextResponse.json({ error: "invalid_tagline" }, { status: 400 });
    }
    sets.push("tagline = ?");
    binds.push(t || null);
  }

  if (body?.description !== undefined) {
    if (body.description !== null && typeof body.description !== "string") {
      return NextResponse.json({ error: "invalid_description" }, { status: 400 });
    }
    const d = body.description == null ? "" : body.description.trim();
    if (d.length > DESCRIPTION_MAX) {
      return NextResponse.json({ error: "invalid_description" }, { status: 400 });
    }
    sets.push("description = ?");
    binds.push(d || null);
  }

  if (sets.length === 0) {
    return NextResponse.json({ error: "nothing_to_update" }, { status: 400 });
  }

  // The trailing leader_id guard makes the write itself IDOR-proof.
  const r = await db
    .prepare(
      `UPDATE squads SET ${sets.join(", ")} WHERE id = ? AND leader_id = ?`,
    )
    .bind(...binds, squadId, user.id)
    .run();
  if (!r.success) {
    return NextResponse.json({ error: "db_failure" }, { status: 500 });
  }

  const updated = await db
    .prepare(`SELECT name, tagline, description FROM squads WHERE id = ?`)
    .bind(squadId)
    .first();

  return NextResponse.json({
    ok: true,
    name: updated?.name ?? null,
    tagline: updated?.tagline ?? null,
    description: updated?.description ?? null,
  });
}
