// Begin OAuth: persist CSRF state in D1, then 302 to Elixpo.

import { NextResponse } from "next/server";
import { buildAuthorizeUrl } from "@/lib/auth/elixpo";
import { getDB } from "@/lib/db";


export async function GET(req) {
  const url = new URL(req.url);
  const returnTo = url.searchParams.get("return_to") ?? "/register";

  const state = crypto.randomUUID();
  await getDB()
    .prepare(`INSERT INTO oauth_states (state, return_to) VALUES (?, ?)`)
    .bind(state, returnTo)
    .run();

  const authorizeUrl = buildAuthorizeUrl({ state });
  return NextResponse.redirect(authorizeUrl, { status: 302 });
}
