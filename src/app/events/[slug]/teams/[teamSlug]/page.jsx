// /events/[slug]/teams/[teamSlug] — public team / individual profile.
//
// - Slug = squad.id lowercased (URL-friendly, still unique).
// - Public-by-default. Anyone can read the roster + status.
// - Leader sees the invite-link panel + "Submit for review" CTA.
// - Once submitted, leader sees the status; admin review UI ships under
//   /admin in a follow-up PR.
//
// The route's [slug] (= /events parent) must match the squad's parentEvent,
// or we 404 — keeps shareable URLs from rendering the wrong context.

import { notFound } from "next/navigation";
import Link from "next/link";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import RoughFrame from "@/components/RoughFrame";
import RegisterShell from "@/components/register/RegisterShell";
import InviteLink from "@/components/register/InviteLink";
import SubmitForReview from "@/components/register/SubmitForReview";
import { getDB } from "@/lib/db";
import { getSessionUser } from "@/lib/auth/server";
import { REGISTRATION_EVENTS } from "@/lib/registration/events";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug, teamSlug } = await params;
  const squad = await getDB()
    .prepare(`SELECT name, tagline, event FROM squads WHERE id = ?`)
    .bind(teamSlug.toUpperCase())
    .first();
  if (!squad) return { title: "Team · HexaFalls" };
  const cfg = REGISTRATION_EVENTS[squad.event];
  if (cfg?.parentEvent && cfg.parentEvent !== slug) {
    return { title: "Team · HexaFalls" };
  }
  return {
    title: `${squad.name} · HexaFalls Teams`,
    description:
      squad.tagline ??
      `A ${cfg?.label ?? squad.event} team at HexaFalls 2026, JIS University.`,
  };
}

const STATUS_COLOR = {
  forming:   "#66FCF1",
  submitted: "#D4AF37",
  approved:  "#4ade80",
  rejected:  "#EF4444",
  locked:    "#A78BFA",
};

export default async function TeamProfilePage({ params }) {
  const { slug, teamSlug } = await params;
  const db = getDB();
  const me = await getSessionUser();

  const squadId = teamSlug.toUpperCase();
  const squad = await db
    .prepare(
      `SELECT id, event, name, tagline, description, leader_id,
              invite_token, min_members, max_members, status,
              submitted_at, reviewed_at, review_notes, created_at
         FROM squads WHERE id = ?`,
    )
    .bind(squadId)
    .first();
  if (!squad) notFound();

  // Guard: the squad's parent event must match the URL's /events slug.
  const cfgForGuard = REGISTRATION_EVENTS[squad.event];
  if (cfgForGuard?.parentEvent && cfgForGuard.parentEvent !== slug) {
    notFound();
  }

  const members = await db
    .prepare(
      `SELECT sm.role, sm.joined_at, u.id, u.username, u.display_name
         FROM squad_members sm
         JOIN users u ON u.id = sm.user_id
        WHERE sm.squad_id = ?
        ORDER BY CASE sm.role WHEN 'leader' THEN 0 ELSE 1 END,
                 sm.joined_at`,
    )
    .bind(squadId)
    .all();

  const memberRows  = members.results ?? [];
  const seatsLeft   = squad.max_members - memberRows.length;
  const isLeader    = me?.id === squad.leader_id;
  const cfg         = REGISTRATION_EVENTS[squad.event];
  const canInvite   = squad.status === "forming" && seatsLeft > 0;
  const canSubmit   =
    isLeader &&
    (squad.status === "forming" || squad.status === "rejected") &&
    memberRows.length >= squad.min_members;

  return (
    <main className="flex-1">
      <TopBar />
      <RegisterShell
        eyebrow={`${cfg?.label ?? squad.event} · Team`}
        title=""
        accent={squad.name}
      >
        <div className="flex flex-col gap-6">
          {/* Status + meta in one tight strip */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <StatusPill status={squad.status} />
            <span className="font-mono text-xs text-silver-hp/70">{squad.id}</span>
            <span className="font-display text-[10px] uppercase tracking-[0.4em] text-silver-hp/60">
              {memberRows.length} / {squad.max_members} seats
            </span>
          </div>

          {squad.tagline && (
            <p className="font-wizard italic text-silver-hp/85 text-base sm:text-lg text-center">
              {squad.tagline}
            </p>
          )}

          {/* Leader actions: invite + submit */}
          {isLeader && (
            <RoughFrame
              seed={73}
              stroke="#D4AF37"
              mistColor="#D4AF37"
              strokeWidth={1.4}
              padding={20}
              className="w-full bg-slate-hp/35 backdrop-blur-sm"
              inner="flex flex-col gap-5"
            >
              {canInvite && (
                <InviteLink
                  url={absoluteUrl(`/register/join/${squad.invite_token}`)}
                  remainingSeats={seatsLeft}
                />
              )}
              {(squad.status === "forming" || squad.status === "rejected") && (
                <SubmitForReview
                  squadId={squad.id}
                  canSubmit={canSubmit}
                  minMembers={squad.min_members}
                  currentCount={memberRows.length}
                  rejectedNotes={
                    squad.status === "rejected" ? squad.review_notes : null
                  }
                />
              )}
              {squad.status === "submitted" && (
                <p className="font-wizard italic text-silver-hp/75 text-sm">
                  Submitted for review. Admins will get back within 48 hours.
                </p>
              )}
              {squad.status === "approved" && (
                <p className="font-wizard italic text-emerald-300/85 text-sm">
                  Approved — your seat is locked in.
                </p>
              )}
            </RoughFrame>
          )}

          {/* Members */}
          <div>
            <h2 className="mb-3 font-display tracking-[0.3em] uppercase text-sm text-gold-hp hp-glow-gold">
              Members
            </h2>
            <ul className="flex flex-col gap-2">
              {memberRows.map((m) => (
                <li key={m.id}>
                  <Link
                    href={m.username ? `/register/u/${m.username}` : "#"}
                    className="flex items-center justify-between gap-3 rounded-sm border border-cyan-hp/20 bg-slate-hp/30 px-4 py-3 transition hover:bg-slate-hp/50"
                  >
                    <span className="flex items-center gap-3 min-w-0">
                      <span className="font-display text-[9px] uppercase tracking-[0.35em] text-gold-hp/80 rounded-full border border-gold-hp/50 bg-gold-hp/10 px-2 py-0.5">
                        {m.role}
                      </span>
                      <span className="font-mono text-sm text-silver-hp truncate">
                        {m.username ? `@${m.username}` : m.display_name ?? "(pending)"}
                      </span>
                    </span>
                    <span className="font-mono text-xs text-silver-hp/55 shrink-0">
                      {m.id}
                    </span>
                  </Link>
                </li>
              ))}
              {Array.from({ length: seatsLeft }).map((_, i) => (
                <li
                  key={`seat-${i}`}
                  className="flex items-center gap-3 rounded-sm border border-dashed border-silver-hp/15 bg-slate-hp/15 px-4 py-3 font-wizard italic text-silver-hp/40 text-sm"
                >
                  open seat
                </li>
              ))}
            </ul>
          </div>

          {/* Description (if leader wrote one) */}
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
        </div>
      </RegisterShell>
      <Footer />
    </main>
  );
}

function StatusPill({ status }) {
  const c = STATUS_COLOR[status] ?? "#C5C6C7";
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full border px-3 py-1 font-display text-[10px] uppercase tracking-[0.45em]"
      style={{
        borderColor: `${c}80`,
        color: c,
        backgroundColor: `${c}1a`,
      }}
    >
      <span className="relative flex h-1.5 w-1.5">
        <span
          className="absolute inline-flex h-full w-full rounded-full opacity-70 animate-ping"
          style={{ backgroundColor: c }}
        />
        <span
          className="relative inline-flex h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: c }}
        />
      </span>
      {status}
    </span>
  );
}

function absoluteUrl(path) {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL || "https://hexafalls.org";
  return `${base}${path}`;
}
