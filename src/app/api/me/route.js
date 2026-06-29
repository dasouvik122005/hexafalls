// GET /api/me — the current signed-in user (or null). Used by the navbar chip.
// Returns only safe, public-ish identity fields; never tokens.

import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/server";


export async function GET() {
  const u = await getSessionUser();
  if (!u) {
    return NextResponse.json(
      { user: null },
      { headers: { "Cache-Control": "no-store" } },
    );
  }
  return NextResponse.json(
    {
      user: {
        id: u.id,
        elixpoId: u.elixpo_id,
        email: u.email,
        displayName: u.display_name,
        username: u.username,
        role: u.role,
        avatarUrl: u.avatar_url ?? null,
      },
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
