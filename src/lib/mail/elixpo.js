// Elixpo Mails transactional client (docs/mails_elixpo.md).
//
// Every trigger is an HMAC-SHA256-signed POST to
//   https://mails.elixpo.com/v1/hooks/<endpoint_key>
// Header: X-Elixpo-Signature: t=<unix>,v1=<hex>
// Signed payload string is `${t}.${rawBody}` over the EXACT bytes sent.
//
// Best-effort: never throws into the caller's happy path. With placeholder
// keys the send fails and is logged; it must not roll back a registration or
// a payment. Replace ELIXPO_MAILS_* in .env.local to go live.

import { env } from "@/lib/db";

const MAILS_BASE = "https://mails.elixpo.com";

// Allow .env.local to hold either the bare endpoint_key or the full hook URL
// (…/v1/hooks/<endpoint_key>) — return just the key segment, trimmed.
function normalizeEndpointKey(raw) {
  if (!raw) return raw;
  const v = String(raw).trim().replace(/\/+$/, "");
  if (!v) return "";
  return v.includes("/") ? v.slice(v.lastIndexOf("/") + 1) : v;
}

async function hmacHex(secret, message) {
  // Web Crypto (Workers + Node 19+). Returns lowercase hex.
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

// Low-level send. `endpointKey` selects the template webhook; `to` + `variables`
// fill the template. Returns { ok, status, id?, error? } and never throws.
export async function sendMail({ endpointKey, to, variables = {}, idempotencyKey } = {}) {
  const secret = env("ELIXPO_MAILS_PRODUCT_SECRET");
  // Accept either a bare endpoint_key or a full hook URL pasted into .env.local —
  // normalize to just the trailing key segment.
  const key = normalizeEndpointKey(endpointKey ?? env("ELIXPO_MAILS_ENDPOINT_KEY"));

  if (!secret || !key || String(secret).startsWith("PLACEHOLDER") || String(key).startsWith("PLACEHOLDER")) {
    console.warn(`[mail] skipped (placeholder/missing keys): to=${to} key=${key ?? ""}`);
    return { ok: false, status: "skipped", error: "missing_keys" };
  }
  if (!to) return { ok: false, status: "skipped", error: "missing_recipient" };

  // Build the JSON string ONCE and sign the exact bytes (re-serializing breaks
  // the signature — see docs).
  const payload = JSON.stringify(
    idempotencyKey ? { to, variables, idempotency_key: idempotencyKey } : { to, variables },
  );
  const t = Math.floor(Date.now() / 1000);
  const v1 = await hmacHex(secret, `${t}.${payload}`);

  try {
    const res = await fetch(`${MAILS_BASE}/v1/hooks/${key}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Elixpo-Signature": `t=${t},v1=${v1}`,
      },
      body: payload,
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok || json.ok === false) {
      console.warn(`[mail] send not ok: to=${to} status=${json.status ?? res.status} err=${json.error ?? ""}`);
    }
    return { ok: !!json.ok, status: json.status ?? String(res.status), id: json.id, error: json.error };
  } catch (e) {
    console.warn(`[mail] send threw: to=${to} ${e?.message ?? e}`);
    return { ok: false, status: "error", error: String(e?.message ?? e) };
  }
}
