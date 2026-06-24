// POST /api/register/solo
//   body: { event, username?, details }
//
// - Requires session + GDG verification.
// - Sets the user's username (if first time).
// - Validates event-specific `details` server-side (authoritative), stores a
//   whitelisted + length-capped object as JSON in solo_registrations.
// - Grants the dynamic team_<event> role + notifies the user.
// - Returns { ok, registrationId, profileUrl }.

import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/server";
import { getDB } from "@/lib/db";
import { generateId } from "@/lib/ids";
import { grantEventRole } from "@/lib/roles";
import { notify } from "@/lib/notifications";
import { REGISTRATION_EVENTS, isSoloEvent } from "@/lib/registration/events";

export const runtime = "edge";

const USERNAME_RE = /^[a-z][a-z0-9_-]{2,23}$/;

const HANDLE_MAX = 64;
const TEXT_MAX = 120;
const DETAILS_MAX = 1000;

function cleanStr(v, max) {
  if (typeof v !== "string") return "";
  return v.trim().slice(0, max);
}

// Build the whitelisted, length-capped details object per event.
// Returns { ok: true, cleaned } or { ok: false, error }.
function validateDetails(event, details) {
  const d = details ?? {};
  if (typeof d !== "object" || Array.isArray(d)) {
    return { ok: false, error: "invalid_details" };
  }

  if (event === "cp") {
    const platformHandles = {};
    for (const key of ["codeforces", "leetcode", "codechef"]) {
      const v = cleanStr(d.platformHandles?.[key] ?? d[key], HANDLE_MAX);
      if (v) platformHandles[key] = v;
    }
    if (Object.keys(platformHandles).length === 0) {
      return { ok: false, error: "platform_handle_required" };
    }
    return { ok: true, cleaned: { platformHandles } };
  }

  if (event === "hardware-exhibition") {
    if (d.isHighSchool !== true) {
      return { ok: false, error: "high_school_required" };
    }
    const schoolName = cleanStr(d.schoolName, TEXT_MAX);
    const exhibitTitle = cleanStr(d.exhibitTitle, TEXT_MAX);
    if (!schoolName || !exhibitTitle) {
      return { ok: false, error: "missing_fields" };
    }
    const cleaned = { schoolName, exhibitTitle, isHighSchool: true };
    const schoolId = cleanStr(d.schoolId, TEXT_MAX);
    const schoolDetails = cleanStr(d.schoolDetails, DETAILS_MAX);
    if (schoolId) cleaned.schoolId = schoolId;
    if (schoolDetails) cleaned.schoolDetails = schoolDetails;
    return { ok: true, cleaned };
  }

  return { ok: false, error: "event_not_solo" };
}

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

  const { event, username, details } = body ?? {};

  if (!isSoloEvent(event)) {
    return NextResponse.json({ error: "event_not_solo" }, { status: 400 });
  }

  const validation = validateDetails(event, details);
  if (!validation.ok) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

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
      `SELECT id FROM solo_registrations
        WHERE user_id = ? AND event = ? LIMIT 1`,
    )
    .bind(user.id, event)
    .first();
  if (already) {
    return NextResponse.json(
      { error: "already_registered", registrationId: already.id },
      { status: 409 },
    );
  }

  const registrationId = generateId("solo_registration");

  const r = await db
    .prepare(
      `INSERT INTO solo_registrations (id, user_id, event, details_json, status)
       VALUES (?, ?, ?, ?, 'registered')`,
    )
    .bind(registrationId, user.id, event, JSON.stringify(validation.cleaned))
    .run();

  if (!r.success) {
    return NextResponse.json({ error: "db_failure" }, { status: 500 });
  }

  await grantEventRole(user.id, event);
  await notify(user.id, {
    kind: "registration",
    title: `Registered for ${REGISTRATION_EVENTS[event].label}`,
    link: `/u/${user.elixpo_id}`,
  });

  return NextResponse.json({
    ok: true,
    registrationId,
    profileUrl: `/u/${user.elixpo_id}`,
  });
}
