// POST /api/register/squad/[id]/join
//   body: { inviteToken, username? }
//
// Accept a squad invite. Requires session + GDG verification. `id` is the squad
// id; we double-check it matches the token.
//
// IMPORTANT: holding the invite link does NOT grant instant membership. Like the
// "request to join" path, it files a pending join_request that the squad
// leader/admin must approve from the notifications / members panel. The invite
// link only pre-selects WHICH squad the request targets.

import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/server";
import { getDB } from "@/lib/db";
import { generateId } from "@/lib/ids";
import { teamUrl } from "@/lib/registration/events";
import { hasHardwareConflict } from "@/lib/registration/conflicts";
import { notify } from "@/lib/notifications";

export const runtime = "edge";

const USERNAME_RE = /^[a-z][a-z0-9_-]{2,23}$/;
const OPEN = new Set(["forming", "registered"]);

export async function POST(req, { params }) {
  const { id: squadId } = await params;
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!user.gdg_verified) {
    return NextResponse.json({ error: "gdg_required" }, { status: 403 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  const { inviteToken, username } = body ?? {};
  if (!inviteToken) {
    return NextResponse.json({ error: "missing_token" }, { status: 400 });
  }

  const db = getDB();
  const squad = await db
    .prepare(
      `SELECT id, event, name, leader_id, invite_token, max_members, status FROM squads
        WHERE id = ?`,
    )
    .bind(squadId)
    .first();
  if (!squad || squad.invite_token !== inviteToken) {
    return NextResponse.json({ error: "invalid_invite" }, { status: 404 });
  }
  // Requests are only accepted while the team is still forming.
  if (!OPEN.has(squad.status)) {
    return NextResponse.json({ error: "squad_locked" }, { status: 409 });
  }

  // Already a member of THIS squad?
  const isMember = await db
    .prepare(`SELECT 1 FROM squad_members WHERE squad_id = ? AND user_id = ? LIMIT 1`)
    .bind(squadId, user.id)
    .first();
  if (isMember) {
    return NextResponse.json({ error: "already_member" }, { status: 409 });
  }

  // Block requesting a second squad in the same event.
  const dup = await db
    .prepare(
      `SELECT 1 FROM squad_members sm
         JOIN squads s ON s.id = sm.squad_id
        WHERE sm.user_id = ? AND s.event = ? LIMIT 1`,
    )
    .bind(user.id, squad.event)
    .first();
  if (dup) {
    return NextResponse.json({ error: "already_in_squad" }, { status: 409 });
  }

  // Hardware: can't join Competition if already in Exhibition (and vice-versa).
  if (await hasHardwareConflict(db, user.id, squad.event)) {
    return NextResponse.json({ error: "hardware_other_mode" }, { status: 409 });
  }

  // Membership cap (a full squad can't take new requests).
  const countRow = await db
    .prepare(`SELECT COUNT(*) AS n FROM squad_members WHERE squad_id = ?`)
    .bind(squadId)
    .first();
  if ((countRow?.n ?? 0) >= squad.max_members) {
    return NextResponse.json({ error: "squad_full" }, { status: 409 });
  }

  // Username (first-time only) — still set it now so the leader sees a handle
  // in the pending-requests list.
  if (!user.username) {
    if (!USERNAME_RE.test(username ?? "")) {
      return NextResponse.json({ error: "invalid_username" }, { status: 400 });
    }
    const taken = await db
      .prepare(`SELECT 1 FROM users WHERE username = ? LIMIT 1`)
      .bind(username)
      .first();
    if (taken) {
      return NextResponse.json({ error: "username_taken" }, { status: 409 });
    }
    await db
      .prepare(`UPDATE users SET username = ? WHERE id = ?`)
      .bind(username, user.id)
      .run();
  }

  // Upsert a pending join_request (UNIQUE(squad_id, user_id) → at most one row).
  const existing = await db
    .prepare(`SELECT id, status FROM join_requests WHERE squad_id = ? AND user_id = ?`)
    .bind(squadId, user.id)
    .first();
  if (existing?.status === "pending") {
    return NextResponse.json(
      { ok: true, pending: true, requestId: existing.id },
    );
  }

  let requestId;
  if (existing) {
    requestId = existing.id;
    const r = await db
      .prepare(
        `UPDATE join_requests
            SET status = 'pending', message = NULL, decided_by = NULL,
                decided_at = NULL, created_at = datetime('now')
          WHERE id = ?`,
      )
      .bind(requestId)
      .run();
    if (!r.success) {
      return NextResponse.json({ error: "db_failure" }, { status: 500 });
    }
  } else {
    requestId = generateId("join_request");
    const r = await db
      .prepare(
        `INSERT INTO join_requests (id, squad_id, user_id, message, status)
         VALUES (?, ?, ?, NULL, 'pending')`,
      )
      .bind(requestId, squadId, user.id)
      .run();
    if (!r.success) {
      return NextResponse.json({ error: "db_failure" }, { status: 500 });
    }
  }

  // Notify the leader (in-profile; a join request is not a "big event").
  try {
    const who = user.username ? `@${user.username}` : user.display_name ?? "Someone";
    await notify(
      squad.leader_id,
      {
        kind: "join_request",
        title: `${who} wants to join ${squad.name}`,
        body: `${who} used your invite link and is waiting for your approval.`,
        link: teamUrl(squad.event, squadId),
      },
      { db },
    );
  } catch (e) {
    console.warn(`[register/squad/join] notify failed: ${e?.message ?? e}`);
  }

  return NextResponse.json({ ok: true, pending: true, requestId });
}
