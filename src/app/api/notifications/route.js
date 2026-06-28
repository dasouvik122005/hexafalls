// /api/notifications — the in-profile "Owl Post" feed.
//
//   GET  → { notifications: [{ id, kind, title, body, link, read, created_at }],
//            unread: <count> }
//   POST { ids?: string[] } → marks the given notifications read; an empty or
//          missing `ids` marks ALL of the caller's notifications read.
//          → { ok: true }
//
// Both routes require a signed-in session. Cheap + uncached (edge runtime).

import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/server";
import { listNotifications, markRead } from "@/lib/notifications";


export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const notifications = await listNotifications(user.id);
  const unread = notifications.reduce((n, x) => n + (x.read ? 0 : 1), 0);

  return NextResponse.json({ notifications, unread });
}

export async function POST(req) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  let body = {};
  try {
    const text = await req.text();
    if (text) body = JSON.parse(text);
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const { ids } = body ?? {};
  if (ids != null) {
    if (!Array.isArray(ids) || !ids.every((id) => typeof id === "string")) {
      return NextResponse.json({ error: "invalid_ids" }, { status: 400 });
    }
  }

  await markRead(user.id, ids);
  return NextResponse.json({ ok: true });
}
