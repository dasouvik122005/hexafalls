// POST /api/register/squad/[id]/join
//   body: { inviteToken, username? }
//
// Accepts a squad invite. Requires session + GDG verification.
// `id` is the squad id; we double-check it matches the token.

import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/server";
import { getDB } from "@/lib/db";
import { teamUrl } from "@/lib/registration/events";

export const runtime = "edge";

const USERNAME_RE = /^[a-z][a-z0-9_-]{2,23}$/;

export async function POST(req, { params }) {
  const { id: squadId } = await params;
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!user.gdg_verified) {
    return NextResponse.json({ error: "gdg_required" }, { status: 403 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  const { inviteToken, username } = body ?? {};
  if (!inviteToken) {
    return NextResponse.json({ error: "missing_token" }, { status: 400 });
  }

  const db = getDB();
  const squad = await db
    .prepare(
      `SELECT id, event, invite_token, max_members, status FROM squads
        WHERE id = ?`,
    )
    .bind(squadId)
    .first();
  if (!squad || squad.invite_token !== inviteToken) {
    return NextResponse.json({ error: "invalid_invite" }, { status: 404 });
  }
  if (squad.status !== "forming") {
    return NextResponse.json({ error: "squad_locked" }, { status: 409 });
  }

  // Block joining a second squad in the same event.
  const dup = await db
    .prepare(
      `SELECT 1 FROM squad_members sm
         JOIN squads s ON s.id = sm.squad_id
        WHERE sm.user_id = ? AND s.event = ? LIMIT 1`,
    )
    .bind(user.id, squad.event)
    .first();
  if (dup) {
    return NextResponse.json(
      { error: "already_in_squad" },
      { status: 409 },
    );
  }

  // Membership cap.
  const countRow = await db
    .prepare(
      `SELECT COUNT(*) AS n FROM squad_members WHERE squad_id = ?`,
    )
    .bind(squadId)
    .first();
  if ((countRow?.n ?? 0) >= squad.max_members) {
    return NextResponse.json({ error: "squad_full" }, { status: 409 });
  }

  // Username (first-time only).
  if (!user.username) {
    if (!USERNAME_RE.test(username ?? "")) {
      return NextResponse.json({ error: "invalid_username" }, { status: 400 });
    }
    const taken = await db
      .prepare(`SELECT 1 FROM users WHERE username = ? LIMIT 1`)
      .bind(username)
      .first();
    if (taken) {
      return NextResponse.json({ error: "username_taken" }, { status: 409 });
    }
    await db
      .prepare(`UPDATE users SET username = ? WHERE id = ?`)
      .bind(username, user.id)
      .run();
  }

  const r = await db
    .prepare(
      `INSERT INTO squad_members (squad_id, user_id, role)
       VALUES (?, ?, 'member')`,
    )
    .bind(squadId, user.id)
    .run();

  if (!r.success) {
    return NextResponse.json({ error: "db_failure" }, { status: 500 });
  }
  return NextResponse.json({
    ok: true,
    squadId,
    teamUrl: teamUrl(squad.event, squadId),
  });
}
