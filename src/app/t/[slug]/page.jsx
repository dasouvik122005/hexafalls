// /t/[slug] — public team profile (root-level).
//
// - slug = squad.id lowercased (URL-friendly, still unique).
// - Public-by-default. Anyone can read the roster + status.
// - Leader sees the invite-link panel + "Submit for review" CTA.

import { notFound } from "next/navigation";
import Link from "next/link";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import RoughFrame from "@/components/RoughFrame";
import RegisterShell from "@/components/register/RegisterShell";
import InviteLink from "@/components/register/InviteLink";
import SubmitForReview from "@/components/register/SubmitForReview";
import TeamSettings from "@/components/team/TeamSettings";
import { getDB } from "@/lib/db";
import { getSessionUser } from "@/lib/auth/server";
import { REGISTRATION_EVENTS, userUrl, isPaidEvent } from "@/lib/registration/events";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const squad = await getDB()
    .prepare(`SELECT name, tagline, event FROM squads WHERE id = ?`)
    .bind(slug.toUpperCase())
    .first();
  if (!squad) return { title: "Team · HexaFalls" };
  const cfg = REGISTRATION_EVENTS[squad.event];
  return {
    title: `${squad.name} · HexaFalls Teams`,
    description:
      squad.tagline ??
      `A ${cfg?.label ?? squad.event} team at HexaFalls 2026, JIS University.`,
  };
}

const STATUS_COLOR = {
  // canonical machine: registered → under_review → fees_settled → approved
  registered:   "#66FCF1",
  under_review: "#D4AF37",
  fees_settled: "#A78BFA",
  approved:     "#4ade80",
  rejected:     "#EF4444",
  // legacy synonyms (back-compat with existing rows)
  forming:      "#66FCF1",
  submitted:    "#D4AF37",
  locked:       "#A78BFA",
};

export default async function TeamProfilePage({ params }) {
  const { slug } = await params;
  const db = getDB();
  const me = await getSessionUser();

  const squadId = slug.toUpperCase();
  const squad = await db
    .prepare(
      `SELECT id, event, name, tagline, description, leader_id,
              invite_token, min_members, max_members, status, paid,
              submitted_at, reviewed_at, review_notes, created_at
         FROM squads WHERE id = ?`,
    )
    .bind(squadId)
    .first();
  if (!squad) notFound();

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

  const memberRows  = members.results ?? [];
  const seatsLeft   = squad.max_members - memberRows.length;
  const isLeader    = me?.id === squad.leader_id;
  const cfg         = REGISTRATION_EVENTS[squad.event];
  const paidEvent   = isPaidEvent(squad.event);

  // Payment progress (paid events only): how many members have a 'paid' row.
  let collected = 0;
  if (paidEvent) {
    const payRes = await db
      .prepare(
        `SELECT COUNT(*) AS n FROM payments
          WHERE squad_id = ? AND status = 'paid'`,
      )
      .bind(squadId)
      .first();
    collected = payRes?.n ?? 0;
  }
  const totalMembers = memberRows.length;
  const feesSettled  = squad.status === "fees_settled" || squad.paid === 1;

  // Pending join requests (leader sees these in TeamSettings).
  let pendingRequests = [];
  if (isLeader) {
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
    pendingRequests = reqRes.results ?? [];
  }
  // Normalize legacy ↔ canonical status synonyms.
  const isForming   = squad.status === "registered" || squad.status === "forming";
  const isUnderRev  = squad.status === "under_review" || squad.status === "submitted";
  const canInvite   = isForming && seatsLeft > 0;
  const canSubmit   =
    isLeader &&
    (isForming || squad.status === "rejected") &&
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

          {/* Payment progress (paid events only) */}
          {paidEvent && (
            <PaymentProgress
              collected={collected}
              total={totalMembers}
              feesSettled={feesSettled}
            />
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
              {(isForming || squad.status === "rejected") && (
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
              {isUnderRev && (
                <p className="font-wizard italic text-silver-hp/75 text-sm">
                  Submitted for review. Admins will get back within 48 hours.
                </p>
              )}
              {squad.status === "fees_settled" && (
                <p className="font-wizard italic text-violet-300/85 text-sm">
                  Fees settled — awaiting final approval.
                </p>
              )}
              {squad.status === "approved" && (
                <p className="font-wizard italic text-emerald-300/85 text-sm">
                  Approved — your seat is locked in.
                </p>
              )}
            </RoughFrame>
          )}

          {/* Team settings — roster management, requests, invite (leader). */}
          <TeamSettings
            squadId={squad.id}
            event={squad.event}
            inviteToken={squad.invite_token}
            isLeader={isLeader}
            members={memberRows}
            requests={pendingRequests}
            maxMembers={squad.max_members}
          />

          {/* Members */}
          <div>
            <h2 className="mb-3 font-display tracking-[0.3em] uppercase text-sm text-gold-hp hp-glow-gold">
              Members
            </h2>
            <ul className="flex flex-col gap-2">
              {memberRows.map((m) => (
                <li key={m.id}>
                  <Link
                    href={m.elixpo_id ? userUrl(m.elixpo_id) : "#"}
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

function PaymentProgress({ collected, total, feesSettled }) {
  const safeTotal = Math.max(total, 1);
  const pct = feesSettled ? 100 : Math.round((collected / safeTotal) * 100);
  const rupees = (total * 10000) / 100; // members × ₹100 (paise → ₹)
  const c = feesSettled ? "#4ade80" : "#D4AF37";
  return (
    <RoughFrame
      seed={89}
      stroke={feesSettled ? "#4ade80" : "#D4AF37"}
      mistColor={feesSettled ? "#4ade80" : "#D4AF37"}
      strokeWidth={1.3}
      padding={18}
      className="w-full bg-slate-hp/30 backdrop-blur-sm"
      inner="flex flex-col gap-3"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-display text-[10px] uppercase tracking-[0.4em] text-gold-hp/80">
          {feesSettled ? "Fees settled ✓" : "Entry fees"}
        </span>
        <span className="font-display text-[11px] tracking-[0.3em] text-silver-hp">
          {feesSettled
            ? `${total}/${total} members paid`
            : `${collected}/${total} members paid`}
          <span className="text-silver-hp/55"> · ₹{rupees}</span>
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-hp/60">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, backgroundColor: c }}
        />
      </div>
    </RoughFrame>
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
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://hexafalls.org";
  return `${base}${path}`;
}
