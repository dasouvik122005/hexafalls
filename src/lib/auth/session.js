// HMAC-signed session cookie.
//
// Payload: base64url JSON { uid, exp }
// Cookie : `${payload}.${signature}` where signature = HMAC-SHA256(payload).
//
// On every request we recompute the signature and compare; tampered or
// expired cookies are rejected. No DB lookup needed to read the user_id.

import { env } from "@/lib/db";

const COOKIE_NAME = "hf_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 14; // 14 days

function need(name) {
  const v = env(name);
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

const b64uEncode = (bytes) =>
  btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

const b64uDecode = (str) => {
  const pad = str.length % 4 ? "=".repeat(4 - (str.length % 4)) : "";
  const bin = atob(str.replace(/-/g, "+").replace(/_/g, "/") + pad);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
};

async function importKey() {
  const secret = new TextEncoder().encode(need("SESSION_SECRET"));
  return crypto.subtle.importKey(
    "raw",
    secret,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

async function sign(payloadB64) {
  const key = await importKey();
  const sig = new Uint8Array(
    await crypto.subtle.sign(
      "HMAC",
      key,
      new TextEncoder().encode(payloadB64),
    ),
  );
  return b64uEncode(sig);
}

async function verify(payloadB64, sigB64) {
  const key = await importKey();
  const sig = b64uDecode(sigB64);
  return crypto.subtle.verify(
    "HMAC",
    key,
    sig,
    new TextEncoder().encode(payloadB64),
  );
}

export async function createSessionCookie(userId) {
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE_SECONDS;
  const payload = b64uEncode(
    new TextEncoder().encode(JSON.stringify({ uid: userId, exp })),
  );
  const sig = await sign(payload);
  return {
    name: COOKIE_NAME,
    value: `${payload}.${sig}`,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  };
}

export function clearSessionCookie() {
  return {
    name: COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  };
}

export async function readSession(cookieValue) {
  if (!cookieValue) return null;
  const [payloadB64, sigB64] = cookieValue.split(".");
  if (!payloadB64 || !sigB64) return null;
  const ok = await verify(payloadB64, sigB64).catch(() => false);
  if (!ok) return null;
  try {
    const { uid, exp } = JSON.parse(
      new TextDecoder().decode(b64uDecode(payloadB64)),
    );
    if (!uid || !exp || exp * 1000 < Date.now()) return null;
    return { userId: uid, expiresAt: exp * 1000 };
  } catch {
    return null;
  }
}

export const SESSION_COOKIE_NAME = COOKIE_NAME;
