// PATCH /api/me/profile
//
// Update the signed-in user's public profile fields. Everything is
// optional; only provided keys are updated.
//
// body: {
//   bio?: string, college?: string, year?: number,
//   github?: string, linkedin?: string, portfolio?: string
// }

import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/server";
import { getDB } from "@/lib/db";

export const runtime = "edge";

const HANDLE_RE   = /^[A-Za-z0-9_-]{0,39}$/;          // GitHub-style cap
const URL_RE      = /^https?:\/\/.{4,250}$/i;

function clean(v, max = 280) {
  if (typeof v !== "string") return undefined;
  const t = v.trim();
  return t.length === 0 ? null : t.slice(0, max);
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
    return NextResponse.json({ ok: true, noChange: true });
  }

  const cols = Object.keys(updates);
  const sql = `UPDATE users SET ${cols.map((c) => `${c} = ?`).join(", ")},
               updated_at = datetime('now') WHERE id = ?`;
  const r = await getDB()
    .prepare(sql)
    .bind(...cols.map((c) => updates[c]), user.id)
    .run();

  if (!r.success) {
    return NextResponse.json({ error: "db_failure" }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
