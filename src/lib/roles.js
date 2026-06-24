// Multi-role helpers backed by the `user_roles` table (migration 0003).
//
// `users.role` stays the PRIMARY role (participant|admin|organizer|…).
// `user_roles` carries additional roles:
//   - fixed   hexafalls_* — granted manually by admins
//   - dynamic team_*       — granted when a user registers for an event
//
// Import the db handle from the caller; these take a D1 binding so they work
// inside batches/route handlers without re-resolving the Cloudflare context.

import { getDB } from "@/lib/db";
import { FIXED_ROLES, teamRoleFor } from "@/lib/registration/events";

export { FIXED_ROLES, teamRoleFor };

// Grant a role (idempotent — INSERT OR IGNORE on the (user_id, role) PK).
// `source` is 'fixed' for hexafalls_* (admin-assigned) or 'dynamic' for team_*.
export async function grantRole(userId, role, { source = "dynamic", grantedBy = null, db = getDB() } = {}) {
  await db
    .prepare(
      `INSERT OR IGNORE INTO user_roles (user_id, role, source, granted_by)
       VALUES (?, ?, ?, ?)`,
    )
    .bind(userId, role, source, grantedBy)
    .run();
}

export async function revokeRole(userId, role, { db = getDB() } = {}) {
  await db
    .prepare(`DELETE FROM user_roles WHERE user_id = ? AND role = ?`)
    .bind(userId, role)
    .run();
}

export async function getUserRoles(userId, { db = getDB() } = {}) {
  const r = await db
    .prepare(`SELECT role, source FROM user_roles WHERE user_id = ?`)
    .bind(userId)
    .all();
  return r.results ?? [];
}

export async function userHasRole(userId, role, { db = getDB() } = {}) {
  const row = await db
    .prepare(`SELECT 1 FROM user_roles WHERE user_id = ? AND role = ? LIMIT 1`)
    .bind(userId, role)
    .first();
  return !!row;
}

// Grant the dynamic team_<event> role for a registration. No-op if the event
// key is unknown.
export async function grantEventRole(userId, eventKey, opts = {}) {
  const role = teamRoleFor(eventKey);
  if (!role) return;
  await grantRole(userId, role, { ...opts, source: "dynamic" });
}
