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

export const runtime = "edge";

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

  let userId;
  if (existing) {
    userId = existing.id;
    await db
      .prepare(
        `UPDATE users
            SET email = ?, display_name = ?, email_verified = ?,
                access_token = ?, refresh_token = ?, token_expires_at = ?,
                updated_at = datetime('now')
          WHERE id = ?`,
      )
      .bind(
        me.email,
        me.displayName ?? null,
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
           (id, elixpo_id, email, display_name, role, email_verified,
            access_token, refresh_token, token_expires_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        userId,
        me.id,
        me.email,
        me.displayName ?? null,
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
