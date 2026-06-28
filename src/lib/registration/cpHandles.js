// Competitive-Programming platform handles — shared validation + reachability
// checks, used by the squad registration route (CP is a team-of-1 squad).
//
// Handles are stored on the squad as details_json: { platformHandles: { ... } }.
// At least one of codeforces / leetcode / codechef is required. Each supplied
// handle is reachability-checked: a DEFINITIVE 404 rejects; our own errors
// (timeout, bot-block) fail OPEN so a flaky check never blocks a valid handle.

const HANDLE_MAX = 64;

export const CP_PLATFORMS = ["codeforces", "leetcode", "codechef"];

function cleanStr(v, max = HANDLE_MAX) {
  if (typeof v !== "string") return "";
  return v.trim().slice(0, max);
}

// Whitelist + length-cap the platform handles out of a free-form details object.
// Accepts either { platformHandles: {…} } or the bare { codeforces, … } shape.
// Returns { ok, platformHandles } or { ok: false, error }.
export function cleanCpHandles(details) {
  const d = details ?? {};
  if (typeof d !== "object" || Array.isArray(d)) {
    return { ok: false, error: "invalid_details" };
  }
  const platformHandles = {};
  for (const key of CP_PLATFORMS) {
    const v = cleanStr(d.platformHandles?.[key] ?? d[key]);
    if (v) platformHandles[key] = v;
  }
  if (Object.keys(platformHandles).length === 0) {
    return { ok: false, error: "platform_handle_required" };
  }
  return { ok: true, platformHandles };
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
// (timeout, bot-block 403/429) fail OPEN.
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
export async function verifyCpHandles(handles) {
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
