// POST /api/register/squad
//   body: { event, squadName, tagline?, description?, username }
//
// - Requires a signed-in session.
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
import { hasHardwareConflict } from "@/lib/registration/conflicts";
import { validateSquadName } from "@/lib/registration/squadName";
import { cleanCpHandles, verifyCpHandles } from "@/lib/registration/cpHandles";
import { sendTeamCreated } from "@/lib/mail/triggers";


const USERNAME_RE = /^[a-z][a-z0-9_-]{2,23}$/;

export async function POST(req) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const { event, squadName, tagline, description, username, details } = body ?? {};

  if (!isSquadEvent(event)) {
    return NextResponse.json({ error: "event_not_squad" }, { status: 400 });
  }
  // Naming convention (no spaces / NSFW / leading-trailing digit-or-symbol …).
  const nameCheck = validateSquadName((squadName ?? "").trim());
  if (!nameCheck.ok) {
    return NextResponse.json({ error: nameCheck.error }, { status: 400 });
  }
  const cleanName = squadName.trim();

  // Some squad events carry extra details on the squad (validated + whitelisted
  // server-side, stored as details_json).
  let detailsJson = null;
  // CP is a team-of-1: the coder's platform handles ride along on the squad.
  if (event === "cp") {
    const cleanHandles = cleanCpHandles(details);
    if (!cleanHandles.ok) {
      return NextResponse.json({ error: cleanHandles.error }, { status: 400 });
    }
    // Every supplied handle must resolve to a real profile (404 = reject).
    const bad = await verifyCpHandles(cleanHandles.platformHandles);
    if (bad) {
      return NextResponse.json({ error: bad }, { status: 400 });
    }
    detailsJson = JSON.stringify({ platformHandles: cleanHandles.platformHandles });
  }
  if (event === "hardware-exhibition") {
    const d = details ?? {};
    if (d.isHighSchool !== true) {
      return NextResponse.json({ error: "high_school_required" }, { status: 400 });
    }
    const schoolName = typeof d.schoolName === "string" ? d.schoolName.trim().slice(0, 120) : "";
    const exhibitTitle = typeof d.exhibitTitle === "string" ? d.exhibitTitle.trim().slice(0, 120) : "";
    if (!schoolName || !exhibitTitle) {
      return NextResponse.json({ error: "missing_fields" }, { status: 400 });
    }
    const cleaned = { schoolName, exhibitTitle, isHighSchool: true };
    const schoolId = typeof d.schoolId === "string" ? d.schoolId.trim().slice(0, 120) : "";
    const schoolDetails = typeof d.schoolDetails === "string" ? d.schoolDetails.trim().slice(0, 1000) : "";
    if (schoolId) cleaned.schoolId = schoolId;
    if (schoolDetails) cleaned.schoolDetails = schoolDetails;
    detailsJson = JSON.stringify(cleaned);
  }

  const config = REGISTRATION_EVENTS[event];
  const db = getDB();

  // Hardware: a user may register for Competition OR Exhibition, not both.
  if (await hasHardwareConflict(db, user.id, event)) {
    return NextResponse.json({ error: "hardware_other_mode" }, { status: 409 });
  }

  // Squad names are globally unique (case-insensitive) — pre-check for a clean
  // message; the UNIQUE index (migration 0005) is the real backstop.
  const nameTaken = await db
    .prepare(`SELECT 1 FROM squads WHERE name = ? COLLATE NOCASE LIMIT 1`)
    .bind(cleanName)
    .first();
  if (nameTaken) {
    return NextResponse.json({ error: "name_taken" }, { status: 409 });
  }

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

  let batch;
  try {
    batch = await db.batch([
      db
        .prepare(
          `INSERT INTO squads
             (id, event, name, tagline, description, leader_id,
              invite_token, min_members, max_members, details_json)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        )
        .bind(
          squadId,
          event,
          cleanName,
          tagline?.trim() ?? null,
          description?.trim() ?? null,
          user.id,
          inviteToken,
          config.minMembers,
          config.maxMembers,
          detailsJson,
        ),
      db
        .prepare(
          `INSERT INTO squad_members (squad_id, user_id, role)
           VALUES (?, ?, 'leader')`,
        )
        .bind(squadId, user.id),
    ]);
  } catch (e) {
    // UNIQUE index race — another squad grabbed the name between check + insert.
    if (/UNIQUE|constraint/i.test(String(e?.message ?? e))) {
      return NextResponse.json({ error: "name_taken" }, { status: 409 });
    }
    throw e;
  }

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
      teamName: cleanName,
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
