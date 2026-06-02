// /register/squad/[id] — public squad profile.
//
// - Anyone can view the page (name, tagline, description, member list,
//   seat count).
// - Only the squad leader sees the invite link panel.
// - Squad members can leave (future PR).
//
// We mark force-dynamic because the data is per-user (the leader sees an
// extra panel) and reads from D1.

import { notFound } from "next/navigation";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import RoughFrame from "@/components/RoughFrame";
import RegisterShell from "@/components/register/RegisterShell";
import InviteLink from "@/components/register/InviteLink";
import { getDB } from "@/lib/db";
import { getSessionUser } from "@/lib/auth/server";
import { REGISTRATION_EVENTS } from "@/lib/registration/events";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const db = getDB();
  const squad = await db
    .prepare(`SELECT name, tagline, event FROM squads WHERE id = ?`)
    .bind(id)
    .first();
  if (!squad) return { title: "Squad · HexaFalls" };
  const cfg = REGISTRATION_EVENTS[squad.event];
  return {
    title: `${squad.name} · HexaFalls`,
    description:
      squad.tagline ??
      `A ${cfg?.label ?? squad.event} squad at HexaFalls 2026, JIS University.`,
  };
}

export default async function SquadProfilePage({ params }) {
  const { id } = await params;
  const db = getDB();
  const me = await getSessionUser();

  const squad = await db
    .prepare(
      `SELECT id, event, name, tagline, description, leader_id,
              invite_token, min_members, max_members, status, created_at
         FROM squads WHERE id = ?`,
    )
    .bind(id)
    .first();
  if (!squad) notFound();

  const members = await db
    .prepare(
      `SELECT sm.role, sm.joined_at, u.id, u.username, u.display_name
         FROM squad_members sm
         JOIN users u ON u.id = sm.user_id
        WHERE sm.squad_id = ?
        ORDER BY CASE sm.role WHEN 'leader' THEN 0 ELSE 1 END,
                 sm.joined_at`,
    )
    .bind(id)
    .all();

  const memberRows = members.results ?? [];
  const seatsLeft = squad.max_members - memberRows.length;
  const isLeader = me?.id === squad.leader_id;
  const isMember = memberRows.some((m) => m.id === me?.id);
  const cfg = REGISTRATION_EVENTS[squad.event];

  return (
    <main className="flex-1">
      <TopBar />
      <RegisterShell
        eyebrow={`${cfg?.label ?? squad.event} · Squad`}
        title="The"
        accent={squad.name}
      >
        <div className="flex flex-col gap-6">
          {squad.tagline && (
            <p className="font-wizard italic text-silver-hp/80 text-base sm:text-lg text-center">
              {squad.tagline}
            </p>
          )}

          {/* Squad meta */}
          <RoughFrame
            seed={59}
            stroke="#D4AF37"
            mistColor="#D4AF37"
            strokeWidth={1.4}
            padding={22}
            className="w-full bg-slate-hp/35 backdrop-blur-sm"
            inner="grid gap-4 sm:grid-cols-3 text-center sm:text-left"
          >
            <Meta label="Squad ID" value={squad.id} mono />
            <Meta
              label="Seats"
              value={`${memberRows.length} / ${squad.max_members}`}
            />
            <Meta label="Status" value={squad.status} />
          </RoughFrame>

          {squad.description && (
            <RoughFrame
              seed={67}
              stroke="#66FCF1"
              mistColor="#66FCF1"
              strokeWidth={1.3}
              padding={20}
              className="w-full bg-slate-hp/30 backdrop-blur-sm"
            >
              <p className="font-wizard text-silver-hp/85 text-base leading-relaxed whitespace-pre-wrap">
                {squad.description}
              </p>
            </RoughFrame>
          )}

          {/* Members */}
          <div>
            <h2 className="mb-3 font-display tracking-[0.3em] uppercase text-sm text-gold-hp hp-glow-gold">
              Members
            </h2>
            <ul className="flex flex-col gap-2">
              {memberRows.map((m) => (
                <li
                  key={m.id}
                  className="flex items-center justify-between gap-3 rounded-sm border border-cyan-hp/20 bg-slate-hp/30 px-4 py-3"
                >
                  <span className="flex items-center gap-3">
                    <span className="font-display text-[9px] uppercase tracking-[0.35em] text-gold-hp/80 rounded-full border border-gold-hp/50 bg-gold-hp/10 px-2 py-0.5">
                      {m.role}
                    </span>
                    <span className="font-mono text-sm text-silver-hp">
                      {m.username ?? m.display_name ?? "(pending)"}
                    </span>
                  </span>
                  <span className="font-mono text-xs text-silver-hp/55">
                    {m.id}
                  </span>
                </li>
              ))}
              {Array.from({ length: seatsLeft }).map((_, i) => (
                <li
                  key={`seat-${i}`}
                  className="flex items-center gap-3 rounded-sm border border-dashed border-silver-hp/15 bg-slate-hp/15 px-4 py-3 font-wizard italic text-silver-hp/40 text-sm"
                >
                  open seat · awaiting wizard
                </li>
              ))}
            </ul>
          </div>

          {/* Leader-only invite link */}
          {isLeader && seatsLeft > 0 && squad.status === "forming" && (
            <RoughFrame
              seed={73}
              stroke="#D4AF37"
              mistColor="#D4AF37"
              strokeWidth={1.4}
              padding={20}
              className="w-full bg-slate-hp/35 backdrop-blur-sm"
            >
              <InviteLink
                url={absoluteUrl(`/register/join/${squad.invite_token}`)}
                remainingSeats={seatsLeft}
              />
            </RoughFrame>
          )}

          {/* Not signed in / not a member CTA */}
          {!me && (
            <p className="font-wizard italic text-silver-hp/60 text-center text-sm">
              Sign in with Elixpo to join a squad. Use the link a leader
              sent you.
            </p>
          )}
          {me && !isMember && squad.status === "forming" && seatsLeft > 0 && (
            <p className="font-wizard italic text-silver-hp/60 text-center text-sm">
              Got an invite link? Open it to join.
            </p>
          )}
        </div>
      </RegisterShell>
      <Footer />
    </main>
  );
}

function Meta({ label, value, mono }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-display text-[9px] uppercase tracking-[0.4em] text-cyan-hp/80">
        {label}
      </span>
      <span
        className={
          mono
            ? "font-mono text-sm text-silver-hp"
            : "font-display text-sm text-silver-hp"
        }
      >
        {value}
      </span>
    </div>
  );
}

// Build an absolute URL. The site URL env is set; fall back to the request
// origin via headers if not, but we use the static SITE_URL since this
// page is server-rendered with stable origin.
function absoluteUrl(path) {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL || "https://hexafalls.org";
  return `${base}${path}`;
}
