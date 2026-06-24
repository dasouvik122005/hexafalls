// In-profile notification helper (migration 0003 `notifications` table).
//
// Everything that is NOT a "big event" (team creation / approval / deletion /
// full payment → email) lands here and is rendered on the user's /u profile.
//
// Usage:  await notify(userId, { kind, title, body, link });

import { getDB } from "@/lib/db";
import { generateId } from "@/lib/ids";

// Insert a single notification. Best-effort: never throw into the caller's
// happy path (a failed notification must not roll back a registration/payment).
export async function notify(userId, { kind, title, body = null, link = null } = {}, { db = getDB() } = {}) {
  if (!userId || !kind || !title) return null;
  const id = generateId("notification");
  // Cap every stored field so a long upstream value can't bloat the row.
  const safeBody = body == null ? null : String(body).slice(0, 1000);
  const safeLink = link == null ? null : String(link).slice(0, 512);
  try {
    await db
      .prepare(
        `INSERT INTO notifications (id, user_id, kind, title, body, link)
         VALUES (?, ?, ?, ?, ?, ?)`,
      )
      .bind(id, userId, kind, String(title).slice(0, 200), safeBody, safeLink)
      .run();
    return id;
  } catch {
    return null;
  }
}

// Fan a notification out to several users (e.g. all squad members).
export async function notifyMany(userIds, payload, opts = {}) {
  const ids = [];
  for (const uid of userIds ?? []) {
    ids.push(await notify(uid, payload, opts));
  }
  return ids.filter(Boolean);
}

export async function listNotifications(userId, { db = getDB(), limit = 50 } = {}) {
  const r = await db
    .prepare(
      `SELECT id, kind, title, body, link, read, created_at
         FROM notifications WHERE user_id = ?
        ORDER BY created_at DESC LIMIT ?`,
    )
    .bind(userId, limit)
    .all();
  return r.results ?? [];
}

export async function markRead(userId, ids, { db = getDB() } = {}) {
  if (!ids?.length) {
    await db.prepare(`UPDATE notifications SET read = 1 WHERE user_id = ?`).bind(userId).run();
    return;
  }
  const placeholders = ids.map(() => "?").join(",");
  await db
    .prepare(`UPDATE notifications SET read = 1 WHERE user_id = ? AND id IN (${placeholders})`)
    .bind(userId, ...ids)
    .run();
}
