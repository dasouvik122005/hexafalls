// POST /api/admin/squads/[id]/review
//
// Admin / organizer signs off (or rejects) a submitted squad.
// body: { decision: 'approve' | 'reject', notes?: string }
//
// Only role IN ('admin','organizer') may call this.

import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/server";
import { getDB } from "@/lib/db";
import { notifyMany } from "@/lib/notifications";
import { sendTeamApproved } from "@/lib/mail/triggers";
import { REGISTRATION_EVENTS, teamUrl, isPaidEvent } from "@/lib/registration/events";

export const runtime = "edge";

const ADMIN_ROLES = new Set(["admin", "organizer"]);
// Statuses an admin may act on (canonical + legacy synonyms). fees_settled is
// included so a team that has paid can be given final approval.
const REVIEWABLE = new Set(["submitted", "under_review", "fees_settled"]);

export async function POST(req, { params }) {
  const { id: squadId } = await params;
  const me = await getSessionUser();
  if (!me) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!ADMIN_ROLES.has(me.role)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  const decision = body?.decision;
  const notes = typeof body?.notes === "string" ? body.notes.slice(0, 1000) : null;
  if (decision !== "approve" && decision !== "reject") {
    return NextResponse.json({ error: "invalid_decision" }, { status: 400 });
  }

  const db = getDB();
  const squad = await db
    .prepare(`SELECT id, event, name, leader_id, status, paid FROM squads WHERE id = ?`)
    .bind(squadId)
    .first();
  if (!squad) return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (!REVIEWABLE.has(squad.status)) {
    return NextResponse.json(
      { error: "wrong_status", status: squad.status },
      { status: 409 },
    );
  }

  // A paid event must have its fees settled before final approval — a paid team
  // cannot be confirmed for free. (Free events skip the payment step.)
  if (
    decision === "approve" &&
    isPaidEvent(squad.event) &&
    squad.status !== "fees_settled" &&
    squad.paid !== 1
  ) {
    return NextResponse.json({ error: "fees_not_settled" }, { status: 409 });
  }

  const nextStatus = decision === "approve" ? "approved" : "rejected";

  const r = await db
    .prepare(
      `UPDATE squads
          SET status        = ?,
              review_notes  = ?,
              reviewed_at   = datetime('now'),
              reviewed_by   = ?,
              updated_at    = datetime('now')
        WHERE id = ?`,
    )
    .bind(nextStatus, notes, me.id, squadId)
    .run();

  if (!r.success) {
    return NextResponse.json({ error: "db_failure" }, { status: 500 });
  }

  // Notify the team. Approval is a "big event" → email the leader; rejection is
  // in-profile only. Best-effort, never fails the review write.
  try {
    const memRes = await db
      .prepare(
        `SELECT u.id, u.email, u.display_name, u.username, sm.role
           FROM squad_members sm JOIN users u ON u.id = sm.user_id
          WHERE sm.squad_id = ?`,
      )
      .bind(squadId)
      .all();
    const members = memRes.results ?? [];
    const eventLabel = REGISTRATION_EVENTS[squad.event]?.label ?? squad.event;
    const teamPath = teamUrl(squad.event, squadId);

    if (decision === "approve") {
      await notifyMany(
        members.map((m) => m.id),
        {
          kind: "team_approved",
          title: `${squad.name} is approved`,
          body: `Your ${eventLabel} team has been approved. Your seat is locked in.`,
          link: teamPath,
        },
        { db },
      );
      const leader = members.find((m) => m.role === "leader");
      if (leader?.email) {
        await sendTeamApproved({
          to: leader.email,
          name: leader.display_name ?? leader.username,
          teamName: squad.name,
          event: eventLabel,
          teamUrl: teamPath,
          idempotencyKey: `team_approved:${squadId}`,
        });
      }
    } else {
      await notifyMany(
        members.map((m) => m.id),
        {
          kind: "team_rejected",
          title: `${squad.name} needs changes`,
          body: notes ? `Reviewer notes: ${notes}` : "Your team was sent back for changes.",
          link: teamPath,
        },
        { db },
      );
    }
  } catch (e) {
    console.warn(`[admin/review] notify side-effect failed: ${e?.message ?? e}`);
  }

  return NextResponse.json({ ok: true, status: nextStatus });
}
