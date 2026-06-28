// Mark the signed-in user as GDG-verified.
// V1 = honour system: user confirms they joined the chapter, we set the
// flag. A future check can call the chapter API here before flipping it.

import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/server";
import { getDB } from "@/lib/db";


export async function POST() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  await getDB()
    .prepare(
      `UPDATE users SET gdg_verified = 1, updated_at = datetime('now')
        WHERE id = ?`,
    )
    .bind(user.id)
    .run();
  return NextResponse.json({ ok: true });
}
