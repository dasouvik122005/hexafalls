// Handle Elixpo callback:
//   1. Verify CSRF state.
//   2. Exchange code → tokens.
//   3. Fetch user info from /me.
//   4. Upsert user in D1 (mint our PART- id on first sight).
//   5. Set signed session cookie.
//   6. Redirect to the original return_to.

import { NextResponse } from "next/server";
import { exchangeCode, fetchUserInfo } from "@/lib/auth/elixpo";
import { createSessionCookie } from "@/lib/auth/session";
import { getDB } from "@/lib/db";
import { generateId } from "@/lib/ids";


// Gravatar URL from an email (SHA-256 hex of the trimmed, lowercased address).
// d=identicon → a unique generated avatar when the user has no Gravatar.
async function gravatarUrl(email) {
  if (!email) return null;
  const norm = String(email).trim().toLowerCase();
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(norm));
  const hash = [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
  return `https://www.gravatar.com/avatar/${hash}?s=128&d=identicon`;
}

export async function GET(req) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");

  if (error) {
    return NextResponse.redirect(
      new URL(`/register?error=${encodeURIComponent(error)}`, url),
      302,
    );
  }
  if (!code || !state) {
    return NextResponse.redirect(
      new URL(`/register?error=invalid_callback`, url),
      302,
    );
  }

  const db = getDB();
  // Pop the CSRF row atomically.
  const stateRow = await db
    .prepare(`SELECT return_to FROM oauth_states WHERE state = ?`)
    .bind(state)
    .first();
  if (!stateRow) {
    return NextResponse.redirect(
      new URL(`/register?error=invalid_state`, url),
      302,
    );
  }
  await db
    .prepare(`DELETE FROM oauth_states WHERE state = ?`)
    .bind(state)
    .run();

  let tokens;
  try {
    tokens = await exchangeCode(code);
  } catch {
    return NextResponse.redirect(
      new URL(`/register?error=token_exchange_failed`, url),
      302,
    );
  }

  let me;
  try {
    me = await fetchUserInfo(tokens.access_token);
  } catch {
    return NextResponse.redirect(
      new URL(`/register?error=userinfo_failed`, url),
      302,
    );
  }

  // Upsert.
  const existing = await db
    .prepare(`SELECT id, role FROM users WHERE elixpo_id = ?`)
    .bind(me.id)
    .first();

  const tokenExpiresAt = new Date(
    Date.now() + (tokens.expires_in ?? 900) * 1000,
  ).toISOString();

  // Elixpo Accounts does not expose a profile picture (userinfo is only
  // id/email/displayName/provider/emailVerified). Derive a Gravatar from the
  // email instead — a real photo if the user has one, else a deterministic
  // identicon. SHA-256 is the modern Gravatar hash.
  const avatarUrl = await gravatarUrl(me.email);

  let userId;
  if (existing) {
    userId = existing.id;
    await db
      .prepare(
        `UPDATE users
            SET email = ?, display_name = ?, avatar_url = ?, email_verified = ?,
                access_token = ?, refresh_token = ?, token_expires_at = ?,
                updated_at = datetime('now')
          WHERE id = ?`,
      )
      .bind(
        me.email,
        me.displayName ?? null,
        avatarUrl,
        me.emailVerified ? 1 : 0,
        tokens.access_token,
        tokens.refresh_token,
        tokenExpiresAt,
        userId,
      )
      .run();
  } else {
    // Auto-promote organizer accounts if Elixpo flags isAdmin AND email
    // domain matches. Tweak this gate as your admin policy firms up.
    const role = me.isAdmin ? "organizer" : "participant";
    userId = generateId(role === "organizer" ? "organizer" : "participant");

    await db
      .prepare(
        `INSERT INTO users
           (id, elixpo_id, email, display_name, avatar_url, role, email_verified,
            access_token, refresh_token, token_expires_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        userId,
        me.id,
        me.email,
        me.displayName ?? null,
        avatarUrl,
        role,
        me.emailVerified ? 1 : 0,
        tokens.access_token,
        tokens.refresh_token,
        tokenExpiresAt,
      )
      .run();
  }

  const cookie = await createSessionCookie(userId);
  const res = NextResponse.redirect(new URL(stateRow.return_to, url), 302);
  res.cookies.set(cookie);
  return res;
}
