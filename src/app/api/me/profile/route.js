// PATCH /api/me/profile
//
// Update the signed-in user's profile. Saving is never gated — any signed-in
// user can register; the profile is just personal info (college, year, GitHub,
// LinkedIn, bio, portfolio).
//
// On SAVE we reachability-check the portfolio (if given): the URL must return
// 200 OK. The check has a short timeout and fails OPEN on our own network
// errors, so a flaky check never blocks a legitimate save — only a definitive
// non-200 rejects.
//
// body: { bio?, college?, year?, github?, linkedin?, portfolio? }
// → { ok: true, complete: boolean }   (complete = college + year on file)

import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/server";
import { getDB } from "@/lib/db";


const HANDLE_RE = /^[A-Za-z0-9_-]{0,39}$/;          // GitHub-style cap
const URL_RE    = /^https?:\/\/.{4,250}$/i;

function clean(v, max = 280) {
  if (typeof v !== "string") return undefined;
  const t = v.trim();
  return t.length === 0 ? null : t.slice(0, max);
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

// True unless the URL definitively fails to return 200.
async function urlReturns200(url) {
  try {
    const r = await fetchTimeout(url, { method: "GET", redirect: "follow" }, 6000);
    return r.ok; // 200–299
  } catch {
    return false; // unreachable → reject
  }
}

export async function PATCH(req) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const updates = {};
  const cBio       = clean(body.bio, 280);
  const cCollege   = clean(body.college, 120);
  const cGithub    = clean(body.github, 40);
  const cLinkedin  = clean(body.linkedin, 100);
  const cPortfolio = clean(body.portfolio, 250);
  const cYear      = Number.isInteger(body.year) ? body.year : undefined;

  if (cBio !== undefined)      updates.bio = cBio;
  if (cCollege !== undefined)  updates.college = cCollege;
  if (cYear !== undefined) {
    if (cYear < 1 || cYear > 4) {
      return NextResponse.json({ error: "invalid_year" }, { status: 400 });
    }
    updates.year = cYear;
  }
  if (cGithub !== undefined) {
    if (cGithub && !HANDLE_RE.test(cGithub)) {
      return NextResponse.json({ error: "invalid_github" }, { status: 400 });
    }
    updates.github = cGithub;
  }
  if (cLinkedin !== undefined) {
    if (cLinkedin && !HANDLE_RE.test(cLinkedin)) {
      return NextResponse.json({ error: "invalid_linkedin" }, { status: 400 });
    }
    updates.linkedin = cLinkedin;
  }
  if (cPortfolio !== undefined) {
    if (cPortfolio && !URL_RE.test(cPortfolio)) {
      return NextResponse.json({ error: "invalid_portfolio" }, { status: 400 });
    }
    updates.portfolio = cPortfolio;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "no_fields" }, { status: 400 });
  }

  const db = getDB();

  // Merge incoming changes over the current row to evaluate completeness and to
  // know which fields actually changed (so we only check a new portfolio link).
  const current = await db
    .prepare(`SELECT college, year, portfolio FROM users WHERE id = ?`)
    .bind(user.id)
    .first();
  const cur = current ?? {};
  const merged = { ...cur, ...updates };

  // Reachability-check the portfolio only when it's newly set/changed.
  if (merged.portfolio && merged.portfolio !== cur.portfolio) {
    const ok = await urlReturns200(merged.portfolio);
    if (!ok) {
      return NextResponse.json({ error: "portfolio_unreachable" }, { status: 400 });
    }
  }

  const cols = Object.keys(updates);
  const sql = `UPDATE users SET ${cols.map((c) => `${c} = ?`).join(", ")},
               updated_at = datetime('now') WHERE id = ?`;
  const r = await db
    .prepare(sql)
    .bind(...cols.map((c) => updates[c]), user.id)
    .run();

  if (!r.success) {
    return NextResponse.json({ error: "db_failure" }, { status: 500 });
  }

  const complete = Boolean(merged.college && Number.isInteger(merged.year));
  return NextResponse.json({ ok: true, complete });
}
