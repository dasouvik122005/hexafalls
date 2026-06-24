// POST /api/register/squad
//   body: { event, squadName, tagline?, description?, username }
//
// - Requires session + GDG verification.
// - Sets the user's username (if first time).
// - Creates the squad, makes the caller the leader, mints invite token.
// - Returns { squadId, inviteToken, inviteUrl }.

import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/server";
import { getDB } from "@/lib/db";
import { generateId, generateInviteToken } from "@/lib/ids";
import {
  REGISTRATION_EVENTS,
  isSquadEvent,
  teamUrl,
} from "@/lib/registration/events";
import { grantEventRole } from "@/lib/roles";
import { sendTeamCreated } from "@/lib/mail/triggers";

export const runtime = "edge";

const USERNAME_RE = /^[a-z][a-z0-9_-]{2,23}$/;
const SQUAD_NAME_RE = /^.{2,48}$/;

export async function POST(req) {
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

  const { event, squadName, tagline, description, username } = body ?? {};

  if (!isSquadEvent(event)) {
    return NextResponse.json({ error: "event_not_squad" }, { status: 400 });
  }
  if (!SQUAD_NAME_RE.test(squadName ?? "")) {
    return NextResponse.json({ error: "invalid_squad_name" }, { status: 400 });
  }

  const config = REGISTRATION_EVENTS[event];
  const db = getDB();

  // Set username on first registration.
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

  // Block double-registration for the same event.
  const already = await db
    .prepare(
      `SELECT s.id FROM squad_members sm
         JOIN squads s ON s.id = sm.squad_id
        WHERE sm.user_id = ? AND s.event = ? LIMIT 1`,
    )
    .bind(user.id, event)
    .first();
  if (already) {
    return NextResponse.json(
      { error: "already_in_squad", squadId: already.id },
      { status: 409 },
    );
  }

  const squadId = generateId(config.squadKind);
  const inviteToken = generateInviteToken();

  const batch = await db.batch([
    db
      .prepare(
        `INSERT INTO squads
           (id, event, name, tagline, description, leader_id,
            invite_token, min_members, max_members)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        squadId,
        event,
        squadName.trim(),
        tagline?.trim() ?? null,
        description?.trim() ?? null,
        user.id,
        inviteToken,
        config.minMembers,
        config.maxMembers,
      ),
    db
      .prepare(
        `INSERT INTO squad_members (squad_id, user_id, role)
         VALUES (?, ?, 'leader')`,
      )
      .bind(squadId, user.id),
  ]);

  if (batch.some((r) => !r.success)) {
    return NextResponse.json({ error: "db_failure" }, { status: 500 });
  }

  const url = new URL(req.url);
  const teamPath = teamUrl(event, squadId);

  // Grant the dynamic team_<event> role; team creation is a "big event" → email
  // the leader. Side-effects are best-effort: never fail the registration if a
  // role grant / email hiccups.
  try {
    await grantEventRole(user.id, event, { db });
    await sendTeamCreated({
      to: user.email,
      leaderName: user.display_name ?? user.username,
      teamName: squadName.trim(),
      event: config.label,
      teamUrl: `${url.origin}${teamPath}`,
      idempotencyKey: `team_created:${squadId}`,
    });
  } catch (e) {
    console.warn(`[register/squad] post-create side-effect failed: ${e?.message ?? e}`);
  }

  return NextResponse.json({
    squadId,
    inviteToken,
    inviteUrl: `${url.origin}/register/join/${inviteToken}`,
    teamUrl: teamPath,
  });
}
