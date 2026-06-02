// Server-side helpers used by route handlers + server components.
//
//   const user = await requireSession();        // throws Redirect to /login
//   const user = await requireGdg();             // additionally requires gdg_verified=1
//   const user = await getSessionUser();         // null if not signed in
//
// All three pull from the signed cookie + look the user up in D1.

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { readSession, SESSION_COOKIE_NAME } from "./session";
import { getDB } from "@/lib/db";

export async function getSessionUser() {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const session = await readSession(cookie);
  if (!session) return null;

  const db = getDB();
  const row = await db
    .prepare(
      `SELECT id, elixpo_id, email, display_name, username, role,
              gdg_verified, email_verified
         FROM users WHERE id = ?`,
    )
    .bind(session.userId)
    .first();
  return row ?? null;
}

export async function requireSession(returnTo = "/register") {
  const user = await getSessionUser();
  if (!user) {
    const dest = `/api/auth/login?return_to=${encodeURIComponent(returnTo)}`;
    redirect(dest);
  }
  return user;
}

export async function requireGdg(returnTo = "/register") {
  const user = await requireSession(returnTo);
  if (!user.gdg_verified) {
    redirect(`/register?step=gdg&return_to=${encodeURIComponent(returnTo)}`);
  }
  return user;
}
