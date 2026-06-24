// POST /api/cron/sync-payments
//
// Reconciliation entrypoint for the GitHub-Actions cron. Pulls the truth from
// Elixpo Pay (`/v1/sync`) and marks any payment whose webhook we missed, then
// rolls affected squads up to fees_settled. Strictly additive (season passes).
//
// AUTH: caller must present `Authorization: Bearer <token>` matching CRON_SECRET
// (preferred, if set) or ELIXPO_PAY_API_KEY. Constant-time compared. The token
// is never echoed. The Action authenticates with the ELIXPO_PAY_API_KEY repo
// secret (the only secret the cron needs).

import { NextResponse } from "next/server";
import { getDB, env } from "@/lib/db";
import { reconcilePayments } from "@/lib/pay/sync";

export const runtime = "edge";

// Constant-time string compare (no early-out, no length leak beyond equality).
function safeEqual(a, b) {
  const x = new TextEncoder().encode(a ?? "");
  const y = new TextEncoder().encode(b ?? "");
  let diff = x.length ^ y.length;
  const n = Math.max(x.length, y.length);
  for (let i = 0; i < n; i++) diff |= (x[i] ?? 0) ^ (y[i] ?? 0);
  return diff === 0;
}

function isPlaceholder(v) {
  return !v || String(v).startsWith("PLACEHOLDER");
}

export async function POST(req) {
  // The accepted credential: a dedicated CRON_SECRET if configured, otherwise
  // the Pay API key (what the user sets in GitHub secrets).
  const cronSecret = env("CRON_SECRET");
  const apiKey = env("ELIXPO_PAY_API_KEY");
  const expected = !isPlaceholder(cronSecret) ? cronSecret : apiKey;
  if (isPlaceholder(expected)) {
    // No usable credential configured → refuse rather than run unauthenticated.
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const auth = req.headers.get("authorization") ?? "";
  const presented = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
  if (!presented || !safeEqual(presented, expected)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const origin = (() => {
    try {
      return new URL(req.url).origin;
    } catch {
      return "";
    }
  })();

  try {
    const summary = await reconcilePayments(getDB(), { origin });
    return NextResponse.json({ ok: true, ...summary });
  } catch (e) {
    console.warn(`[cron/sync-payments] failed: ${e?.message ?? e}`);
    return NextResponse.json({ error: "sync_failed" }, { status: 500 });
  }
}
