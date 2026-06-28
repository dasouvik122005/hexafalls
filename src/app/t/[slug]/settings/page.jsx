// /t/[slug]/settings — GATED internal team management (leader-only).
//
// - slug = squad.id lowercased.
// - Access is leader-only: getSessionUser() must match squad.leader_id.
//   Non-leaders (and signed-out viewers) are redirected to the public profile;
//   a missing squad → notFound().
// - Hosts everything internal: the Edit-Team form, the invite link, pending
//   join-request approve/deny, the members list + removal, and the danger-zone
//   dismantle. None of these appear on the public /t/[slug] page anymore.

import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import RegisterShell from "@/components/register/RegisterShell";
import TeamSettings from "@/components/team/TeamSettings";
import EditTeamForm from "@/components/team/EditTeamForm";
import { getDB } from "@/lib/db";
import { getSessionUser } from "@/lib/auth/server";
import { REGISTRATION_EVENTS, teamUrl } from "@/lib/registration/events";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const squad = await getDB()
    .prepare(`SELECT name FROM squads WHERE id = ?`)
    .bind(slug.toUpperCase())
    .first();
  return { title: squad ? `Manage Team ${squad.name} · HexaFalls` : "Team Settings · HexaFalls" };
}

export default async function TeamSettingsPage({ params }) {
  const { slug } = await params;
  const db = getDB();
  const me = await getSessionUser();

  const squadId = slug.toUpperCase();
  const squad = await db
    .prepare(
      `SELECT id, event, name, tagline, description, leader_id,
              invite_token, min_members, max_members, status, paid
         FROM squads WHERE id = ?`,
    )
    .bind(squadId)
    .first();
  if (!squad) notFound();

  // Gate: leader-only. Re-checked against the DB row (never a client flag).
  if (!me || me.id !== squad.leader_id) {
    redirect(teamUrl(squad.event, squad.id));
  }

  const members = await db
    .prepare(
      `SELECT sm.role, sm.joined_at, u.id, u.elixpo_id, u.username, u.display_name
         FROM squad_members sm
         JOIN users u ON u.id = sm.user_id
        WHERE sm.squad_id = ?
        ORDER BY CASE sm.role WHEN 'leader' THEN 0 ELSE 1 END,
                 sm.joined_at`,
    )
    .bind(squadId)
    .all();
  const memberRows = members.results ?? [];

  const reqRes = await db
    .prepare(
      `SELECT jr.id, jr.user_id, jr.message,
              u.username, u.display_name, u.elixpo_id
         FROM join_requests jr
         JOIN users u ON u.id = jr.user_id
        WHERE jr.squad_id = ? AND jr.status = 'pending'
        ORDER BY jr.created_at`,
    )
    .bind(squadId)
    .all();
  const pendingRequests = reqRes.results ?? [];

  const cfg = REGISTRATION_EVENTS[squad.event];

  return (
    <main className="flex-1">
      <TopBar />
      <RegisterShell
        eyebrow={`${cfg?.label ?? squad.event} · Manage`}
        title="Manage"
        accent={squad.name}
        wide
      >
        <div className="mb-6 flex justify-center">
          <Link
            href={teamUrl(squad.event, squad.id)}
            className="font-display text-[10px] uppercase tracking-[0.4em] text-cyan-hp/70 transition hover:text-cyan-hp"
          >
            ← Back to team profile
          </Link>
        </div>

        <div className="flex flex-col gap-4">
          {/* Edit team metadata */}
          <EditTeamForm
            squadId={squad.id}
            name={squad.name}
            tagline={squad.tagline}
            description={squad.description}
          />

          {/* Invite / requests / members / danger zone */}
          <TeamSettings
            squadId={squad.id}
            event={squad.event}
            inviteToken={squad.invite_token}
            isLeader={true}
            members={memberRows}
            requests={pendingRequests}
            maxMembers={squad.max_members}
          />
        </div>
      </RegisterShell>
      <Footer />
    </main>
  );
}
