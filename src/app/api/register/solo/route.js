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
import { REGISTRATION_EVENTS, isSoloEvent, soloUrl } from "@/lib/registration/events";
import { hasHardwareConflict } from "@/lib/registration/conflicts";


const USERNAME_RE = /^[a-z][a-z0-9_-]{2,23}$/;

const HANDLE_MAX = 64;
const TEXT_MAX = 120;
const DETAILS_MAX = 1000;

function cleanStr(v, max) {
  if (typeof v !== "string") return "";
  return v.trim().slice(0, max);
}

// fetch with an abort timeout — never hangs the request handler.
async function fetchTimeout(url, opts = {}, ms = 6000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    return await fetch(url, { ...opts, signal: ctrl.signal });
  } finally {
    clearTimeout(t);
  }
}

// True unless the profile URL DEFINITIVELY doesn't exist (404). Our own errors
// (timeout, bot-block 403/429) fail OPEN so a flaky check never blocks a valid
// handle — only a confirmed 404 rejects.
async function profileExists(url) {
  try {
    const r = await fetchTimeout(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; HexaFallsBot/1.0)" },
      redirect: "follow",
    });
    return r.status !== 404;
  } catch {
    return true;
  }
}

// Codeforces has an official API — use it (reliable OK/FAILED).
async function codeforcesExists(handle) {
  try {
    const r = await fetchTimeout(
      `https://codeforces.com/api/user.info?handles=${encodeURIComponent(handle)}`,
      { headers: { "User-Agent": "HexaFalls" } },
    );
    if (r.status === 404) return false;
    const j = await r.json().catch(() => null);
    if (j && j.status === "FAILED") return false;
    return true;
  } catch {
    return true;
  }
}

// Verify every provided CP handle resolves to a real profile (in parallel).
// Returns the first failing platform's error code, or null if all are fine.
async function verifyCpHandles(handles) {
  const checks = [];
  if (handles.codeforces) {
    checks.push(
      codeforcesExists(handles.codeforces).then((ok) => (ok ? null : "codeforces_not_found")),
    );
  }
  if (handles.leetcode) {
    checks.push(
      profileExists(`https://leetcode.com/u/${encodeURIComponent(handles.leetcode)}/`).then(
        (ok) => (ok ? null : "leetcode_not_found"),
      ),
    );
  }
  if (handles.codechef) {
    checks.push(
      profileExists(`https://www.codechef.com/users/${encodeURIComponent(handles.codechef)}`).then(
        (ok) => (ok ? null : "codechef_not_found"),
      ),
    );
  }
  const results = await Promise.all(checks);
  return results.find(Boolean) ?? null;
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

  // CP: every supplied handle must resolve to a real profile before we register.
  if (event === "cp") {
    const bad = await verifyCpHandles(validation.cleaned.platformHandles);
    if (bad) {
      return NextResponse.json({ error: bad }, { status: 400 });
    }
  }

  const db = getDB();

  // Hardware: a user may register for Competition OR Exhibition, not both.
  if (await hasHardwareConflict(db, user.id, event)) {
    return NextResponse.json({ error: "hardware_other_mode" }, { status: 409 });
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

  // Solo entries enter the same review lifecycle as teams: they start
  // UNDER_REVIEW (admins shortlist → approve), not instantly confirmed.
  const r = await db
    .prepare(
      `INSERT INTO solo_registrations (id, user_id, event, details_json, status)
       VALUES (?, ?, ?, ?, 'under_review')`,
    )
    .bind(registrationId, user.id, event, JSON.stringify(validation.cleaned))
    .run();

  if (!r.success) {
    return NextResponse.json({ error: "db_failure" }, { status: 500 });
  }

  const submissionUrl = soloUrl(registrationId);
  await grantEventRole(user.id, event);
  await notify(user.id, {
    kind: "registration",
    title: `Registered for ${REGISTRATION_EVENTS[event].label}`,
    body: "Your entry is under review — track its status here.",
    link: submissionUrl,
  });

  return NextResponse.json({
    ok: true,
    registrationId,
    submissionUrl,
    profileUrl: `/u/${user.elixpo_id}`,
  });
}
