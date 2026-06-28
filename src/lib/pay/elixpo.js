// Elixpo Pay client (docs/payments_elixpo.md).
//
// Your server creates a hosted checkout session with the secret API key and
// redirects the buyer to Elixpo Pay's hosted checkout. The provider (Razorpay
// for INR) charges the card; Elixpo grants an entitlement and notifies us two
// ways: a signed `entitlement.updated` webhook AND a pull endpoint
// `GET /v1/entitlements?app=&uid=`.
//
// Secrets (never leaked in responses/logs):
//   ELIXPO_PAY_API_KEY         — Bearer token for server→Elixpo calls
//   ELIXPO_PAY_APP_ID          — the `app` (project) under our merchant
//   ELIXPO_PAY_WEBHOOK_SECRET  — HMAC secret for inbound webhook verification
//
// Best-effort: createCheckoutSession / fetchEntitlements never throw — they
// return `{ error }` on failure and log (no secret in the log).

import { env } from "@/lib/db";

const PAY_BASE = "https://payouts.elixpo.com";

// Default catalog tier for a standard ₹100 seat. Most paid events share it; an
// event with a different price (e.g. CP at ₹70) passes its own `tier` so Pay
// resolves the right amount from the catalog. The buyer is namespaced per
// (user, event) via `uid`, so each fee stays a distinct entitlement regardless
// of tier. See payouts.catalog.json.
const TIER = "member";

// Reject webhooks whose timestamp is older than this (replay window).
const SIGNATURE_TOLERANCE_SECONDS = 5 * 60;

// Buyer id in OUR namespace = `${userId}:${event}`. Encodes which event the
// payment is for, since Elixpo entitlements key on (app, uid, tier) and our
// tier is constant. `userId` (PART-…) and `event` keys never contain ':'.
export function payUid(userId, event) {
  return `${userId}:${event}`;
}

export function parsePayUid(uid) {
  const s = String(uid ?? "");
  const i = s.indexOf(":");
  return i === -1 ? { userId: s, event: null } : { userId: s.slice(0, i), event: s.slice(i + 1) };
}

function isPlaceholder(v) {
  return !v || String(v).startsWith("PLACEHOLDER");
}

// Web Crypto HMAC-SHA256 → lowercase hex (Workers + Node 19+). Same primitive
// the Elixpo Mails client uses.
async function hmacHex(secret, message) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Constant-time compare of two hex strings. Length mismatch → false, but we
// still walk the longer string so timing doesn't leak the prefix length.
function timingSafeEqualHex(a, b) {
  const aBuf = new TextEncoder().encode(a ?? "");
  const bBuf = new TextEncoder().encode(b ?? "");
  let diff = aBuf.length ^ bBuf.length;
  const n = Math.max(aBuf.length, bBuf.length);
  for (let i = 0; i < n; i++) {
    diff |= (aBuf[i] ?? 0) ^ (bBuf[i] ?? 0);
  }
  return diff === 0;
}

// Create a hosted checkout session (docs: Checkout sessions).
//
//   POST /v1/checkout/sessions
//   { tier, currency, customer: { uid, email }, success_url, metadata }
//
// We NEVER send the amount — Elixpo Pay resolves the active price for
// (tier, currency) from our catalog, so the buyer can't tamper with it. The
// `uid` is namespaced per (user, event). Response (201):
//   { id: "cs_…", url, amount, currency, tier, expires_at }
//
// Returns { checkoutUrl, orderId } or { error }.
export async function createCheckoutSession({
  userId,
  event,
  squadId,
  email,
  currency,
  successUrl,
  tier = TIER,
} = {}) {
  const apiKey = env("ELIXPO_PAY_API_KEY");

  if (isPlaceholder(apiKey)) {
    console.warn("[pay] checkout skipped (placeholder/missing keys)");
    return { error: "missing_keys" };
  }

  const body = JSON.stringify({
    tier,
    currency,
    customer: { uid: payUid(userId, event), email: email ?? undefined },
    success_url: successUrl,
    // We send our own confirmation via Elixpo Mails (payment_received), so ask
    // the provider to suppress its buyer receipt. NOTE: this is only a hint
    // echoed on the session — the receipt must ALSO be disabled in the Elixpo
    // Pay dashboard for this app. See docs/issues/payments-join-ux.md.
    send_receipt: false,
    metadata: { event, squadId, send_receipt: false },
  });

  try {
    const res = await fetch(`${PAY_BASE}/v1/checkout/sessions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body,
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.warn(`[pay] checkout not ok: status=${res.status} err=${json?.error ?? ""}`);
      return { error: json?.error ?? `http_${res.status}` };
    }
    const checkoutUrl = json.url ?? json.checkout_url ?? null;
    const orderId = json.id ?? json.session_id ?? null;
    if (!checkoutUrl) {
      console.warn("[pay] checkout response missing url");
      return { error: "no_checkout_url" };
    }
    return { checkoutUrl, orderId };
  } catch (e) {
    console.warn(`[pay] checkout threw: ${e?.message ?? e}`);
    return { error: "request_failed" };
  }
}

// Verify an inbound webhook signature (docs: Webhooks).
//
//   X-Elixpo-Pay-Timestamp: <unix seconds>
//   X-Elixpo-Pay-Signature: sha256=<hex HMAC of `${timestamp}.${rawBody}`>
//   HMAC-SHA256 with ELIXPO_PAY_WEBHOOK_SECRET.
//
// MUST be called on the RAW body before parsing/acting on it. Returns true only
// when the signature matches AND the timestamp is within the replay window.
export async function verifyWebhookSignature(rawBody, signatureHeader, timestampHeader) {
  const secret = env("ELIXPO_PAY_WEBHOOK_SECRET");
  if (isPlaceholder(secret) || !signatureHeader || rawBody == null) return false;

  const ts = Number(timestampHeader);
  if (!Number.isFinite(ts)) return false;
  // Reject replays / stale deliveries outside the tolerance window.
  const ageSeconds = Math.abs(Math.floor(Date.now() / 1000) - ts);
  if (ageSeconds > SIGNATURE_TOLERANCE_SECONDS) return false;

  // Signature header is `sha256=<hex>`; tolerate a bare hex too.
  const sig = String(signatureHeader).trim().replace(/^sha256=/i, "").toLowerCase();
  if (!/^[0-9a-f]+$/.test(sig)) return false;

  const expected = await hmacHex(secret, `${timestampHeader}.${rawBody}`);
  return timingSafeEqualHex(expected, sig);
}

// Pull endpoint: current entitlement for a uid in our app.
// GET /v1/entitlements?app=&uid=  → returns parsed JSON or { error }.
export async function fetchEntitlements({ uid } = {}) {
  const apiKey = env("ELIXPO_PAY_API_KEY");
  const app = env("ELIXPO_PAY_APP_ID");

  if (isPlaceholder(apiKey) || isPlaceholder(app)) {
    console.warn("[pay] entitlements skipped (placeholder/missing keys)");
    return { error: "missing_keys" };
  }

  const url = `${PAY_BASE}/v1/entitlements?app=${encodeURIComponent(app)}&uid=${encodeURIComponent(uid ?? "")}`;
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.warn(`[pay] entitlements not ok: status=${res.status}`);
      return { error: json?.error ?? `http_${res.status}` };
    }
    return json;
  } catch (e) {
    console.warn(`[pay] entitlements threw: ${e?.message ?? e}`);
    return { error: "request_failed" };
  }
}
