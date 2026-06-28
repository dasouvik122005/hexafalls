// PATCH /api/me/profile
//
// Update the signed-in user's profile. Verification lives here: a user becomes
// gdg_verified once the profile is COMPLETE (college, year, gdg_email).
// GitHub, LinkedIn, bio and portfolio are optional.
//
// On SAVE we REACHABILITY-CHECK the optional fields that changed:
//   - portfolio→ if given, the URL must return 200 OK
//   - gdg_email→ if it differs from the Elixpo account email, its domain must
//                be able to receive mail (DNS-over-HTTPS MX/A lookup)
// Checks run in parallel with short timeouts and fail OPEN on our own network
// errors (so a flaky check never blocks a legitimate save); only a DEFINITIVE
// negative (404 / non-200 / no mail records) rejects.
//
// body: { bio?, college?, year?, github?, linkedin?, portfolio?, gdg_email? }
// → { ok: true, gdg_verified: 0|1 }

import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/server";
import { getDB } from "@/lib/db";


const HANDLE_RE = /^[A-Za-z0-9_-]{0,39}$/;          // GitHub-style cap
const URL_RE    = /^https?:\/\/.{4,250}$/i;
const EMAIL_RE  = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(v, max = 280) {
  if (typeof v !== "string") return undefined;
  const t = v.trim();
  return t.length === 0 ? null : t.slice(0, max);
}

function isComplete(p) {
  return Boolean(
    p.college &&
      Number.isInteger(p.year) &&
      p.gdg_email,
  );
}

// fetch with an abort timeout — never hangs the request handler.
async function fetchTimeout(url, opts = {}, ms = 5000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    return await fetch(url, { ...opts, signal: ctrl.signal });
  } finally {
    clearTimeout(t);
  }
}

// Definitive-negative checks: return false ONLY when we're sure it's invalid.
// Our own errors (timeout, rate-limit, bot-block) fail open → true.
async function urlReturns200(url) {
  try {
    const r = await fetchTimeout(url, { method: "GET", redirect: "follow" }, 6000);
    return r.ok; // 200–299
  } catch {
    return false; // unreachable → the user asked us to require 200
  }
}

async function emailDomainReal(email) {
  const domain = email.split("@")[1];
  if (!domain) return false;
  const doh = async (type) => {
    try {
      const r = await fetchTimeout(
        `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=${type}`,
        { headers: { Accept: "application/dns-json" } },
        4000,
      );
      if (!r.ok) return null; // ambiguous
      const j = await r.json();
      return Array.isArray(j.Answer) ? j.Answer : [];
    } catch {
      return null; // ambiguous
    }
  };
  const mx = await doh("MX");
  if (mx === null) return true; // couldn't check → fail open
  if (mx.length > 0) return true;
  const a = await doh("A");
  if (a === null) return true;
  return a.length > 0; // some domains accept mail with just an A record
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
  const cGdgEmail  = clean(body.gdg_email, 200);
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
  if (cGdgEmail !== undefined) {
    if (cGdgEmail && !EMAIL_RE.test(cGdgEmail)) {
      return NextResponse.json({ error: "invalid_gdg_email" }, { status: 400 });
    }
    updates.gdg_email = cGdgEmail;
  }

  const db = getDB();

  // Current row — to merge for completeness AND to know which fields changed
  // (so we only pay for reachability checks on changed values).
  const current = await db
    .prepare(
      `SELECT email, college, year, github, linkedin, bio, gdg_email
         FROM users WHERE id = ?`,
    )
    .bind(user.id)
    .first();
  const cur = current ?? {};

  // Merge the incoming changes over the current row to evaluate verification.
  const merged = { ...cur, ...updates };
  const willBeComplete = isComplete(merged);

  // VERIFICATION GATE: a profile becomes verified ONLY when it's complete AND
  // every link resolves. So when this save would complete the profile, we
  // reachability-check ALL links (github + linkedin must exist, portfolio — if
  // given — must return 200, and a custom GDG email's domain must accept mail).
  // Any failure → 400 and the profile is NOT verified/marked complete.
  if (willBeComplete) {
    const checks = [];
    if (merged.portfolio) {
      checks.push(urlReturns200(merged.portfolio).then((ok) => (ok ? null : "portfolio_unreachable")));
    }
    if (merged.gdg_email && merged.gdg_email !== cur.email) {
      checks.push(emailDomainReal(merged.gdg_email).then((ok) => (ok ? null : "gdg_email_unreal")));
    }
    const firstError = (await Promise.all(checks)).find(Boolean);
    if (firstError) {
      return NextResponse.json({ error: firstError, gdg_verified: 0 }, { status: 400 });
    }
  }

  const verified = willBeComplete ? 1 : 0;
  updates.gdg_verified = verified;

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
  return NextResponse.json({ ok: true, gdg_verified: verified });
}
