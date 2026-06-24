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

// Product tier we sell for event fees.
const PRODUCT = "member";

// Reject webhooks whose timestamp is older than this (replay window).
const SIGNATURE_TOLERANCE_SECONDS = 5 * 60;

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

// Create a hosted checkout session.
//
// ASSUMPTION: the docs describe "your server creates a checkout session" but do
// not pin the exact path. Best guess per the docs' REST style (matching the
// /v1/entitlements pull endpoint) is POST https://payouts.elixpo.com/v1/checkout/sessions.
// Body field names mirror the documented vocabulary (app / product / uid /
// amount / currency / success_url / cancel_url / metadata / idempotency_key).
// Response is assumed to carry the hosted-checkout URL and an order id; we read
// several plausible field names so a minor naming difference still works.
//
// Returns { checkoutUrl, orderId } or { error }.
export async function createCheckoutSession({
  uid,
  event,
  squadId,
  amount,
  currency,
  successUrl,
  cancelUrl,
  idempotencyKey,
} = {}) {
  const apiKey = env("ELIXPO_PAY_API_KEY");
  const app = env("ELIXPO_PAY_APP_ID");

  if (isPlaceholder(apiKey) || isPlaceholder(app)) {
    console.warn("[pay] checkout skipped (placeholder/missing keys)");
    return { error: "missing_keys" };
  }

  const body = JSON.stringify({
    app,
    product: PRODUCT,
    uid,
    amount, // minor units (paise)
    currency,
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: { event, squadId },
    idempotency_key: idempotencyKey,
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
    const checkoutUrl =
      json.checkout_url ?? json.url ?? json.checkoutUrl ?? json.hosted_url ?? null;
    const orderId =
      json.order_id ?? json.id ?? json.session_id ?? json.orderId ?? null;
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

// Verify an inbound webhook signature.
//
// ASSUMPTION: Elixpo Pay signs webhooks the same way Elixpo Mails does —
// header `t=<unix>,v1=<hex>` where the signed string is `${t}.${rawBody}`,
// HMAC-SHA256 with ELIXPO_PAY_WEBHOOK_SECRET. As a fallback we also accept a
// bare hex signature (HMAC over the raw body alone) when no `t=`/`v1=` parts
// are present.
//
// MUST be called on the RAW body before parsing/acting on it. Returns true only
// when the signature matches AND (for the timestamped form) the timestamp is
// within SIGNATURE_TOLERANCE_SECONDS.
export async function verifyWebhookSignature(rawBody, signatureHeader) {
  const secret = env("ELIXPO_PAY_WEBHOOK_SECRET");
  if (isPlaceholder(secret) || !signatureHeader || rawBody == null) return false;

  // Parse `t=<unix>,v1=<hex>` (order/extra-part tolerant).
  let t = null;
  let v1 = null;
  for (const part of String(signatureHeader).split(",")) {
    const idx = part.indexOf("=");
    if (idx === -1) continue;
    const k = part.slice(0, idx).trim();
    const val = part.slice(idx + 1).trim();
    if (k === "t") t = val;
    else if (k === "v1") v1 = val;
  }

  if (t != null && v1 != null) {
    // Reject replays / stale deliveries outside the tolerance window.
    const ts = Number(t);
    if (!Number.isFinite(ts)) return false;
    const ageSeconds = Math.abs(Math.floor(Date.now() / 1000) - ts);
    if (ageSeconds > SIGNATURE_TOLERANCE_SECONDS) return false;

    const expected = await hmacHex(secret, `${t}.${rawBody}`);
    return timingSafeEqualHex(expected, v1);
  }

  // Fallback: bare hex signature over the raw body. No timestamp to bound, so
  // idempotent processing downstream is what guards against replays here.
  const bare = String(signatureHeader).trim();
  if (/^[0-9a-f]+$/i.test(bare)) {
    const expected = await hmacHex(secret, rawBody);
    return timingSafeEqualHex(expected, bare.toLowerCase());
  }

  return false;
}

// Pull endpoint: current entitlements for a uid in our app.
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
