// /t/[slug] — PUBLIC team profile (root-level).
//
// - slug = squad.id lowercased (URL-friendly, still unique).
// - Public-by-default. Anyone can read the roster + status + progress.
// - This page only DISPLAYS. All internal controls (invite link, join-request
//   management, member removal, danger-zone dismantle, team editing) live on
//   the gated /t/[slug]/settings page — leader-only.
// - Clean single-column layout (no bento boxes): meta → progress → members →
//   about → review. The review CTA sits at the very end and greys out until the
//   team meets the criteria.

import { notFound } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import RoughButton from "@/components/RoughButton";
import RegisterShell from "@/components/register/RegisterShell";
import SubmitForReview from "@/components/register/SubmitForReview";
import PayButton from "@/components/profile/PayButton";
import { getDB } from "@/lib/db";
import { getSessionUser } from "@/lib/auth/server";
import { reconcileUserPayments } from "@/lib/pay/sync";
import {
  REGISTRATION_EVENTS,
  userUrl,
  teamUrl,
  isPaidEvent,
} from "@/lib/registration/events";

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
    title: `Team ${squad.name} · HexaFalls Teams`,
    description:
      squad.tagline ??
      `A ${cfg?.label ?? squad.event} team at HexaFalls 2026, JIS University.`,
  };
}

const STATUS_COLOR = {
  // canonical machine: registered → under_review → shortlisted → approved
  registered:   "#66FCF1",
  under_review: "#D4AF37",
  shortlisted:  "#A78BFA",
  approved:     "#4ade80",
  rejected:     "#EF4444",
  // legacy synonyms (back-compat with existing rows)
  forming:      "#66FCF1",
  submitted:    "#D4AF37",
  fees_settled: "#4ade80",
  locked:       "#A78BFA",
};

const SQUAD_SELECT = `SELECT id, event, name, tagline, description, leader_id,
              invite_token, min_members, max_members, status, paid,
              details_json, submitted_at, reviewed_at, review_notes, created_at
         FROM squads WHERE id = ?`;

export default async function TeamProfilePage({ params, searchParams }) {
  const { slug } = await params;
  const sp = (await searchParams) ?? {};
  const db = getDB();
  const me = await getSessionUser();

  const squadId = slug.toUpperCase();
  let squad = await db.prepare(SQUAD_SELECT).bind(squadId).first();
  if (!squad) notFound();

  // Returning from checkout (?paid=1) as the leader: the payment only flips on
  // the async webhook, so reconcile the leader's entitlement now, then re-read
  // the squad so the page shows "approved / paid" immediately. Best-effort.
  if (sp.paid === "1" && me?.id === squad.leader_id) {
    try {
      const h = await headers();
      const host = h.get("x-forwarded-host") ?? h.get("host");
      const proto = h.get("x-forwarded-proto") ?? "https";
      const origin = host ? `${proto}://${host}` : "";
      await reconcileUserPayments(db, { userId: me.id, origin });
      squad = (await db.prepare(SQUAD_SELECT).bind(squadId).first()) ?? squad;
    } catch {
      // ignore — render with current DB state
    }
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

  const memberRows  = members.results ?? [];
  const seatsLeft   = squad.max_members - memberRows.length;
  const isLeader    = me?.id === squad.leader_id;
  const cfg         = REGISTRATION_EVENTS[squad.event];
  const paidEvent   = isPaidEvent(squad.event);
  const pricePerPerson = cfg?.pricePerPerson ?? 0;

  // CP (team-of-1) carries the coder's platform handles in details_json.
  let cpHandles = null;
  if (squad.event === "cp" && squad.details_json) {
    try {
      cpHandles = JSON.parse(squad.details_json)?.platformHandles ?? null;
    } catch {
      cpHandles = null;
    }
  }

  const totalMembers = memberRows.length;
  // Team-pays model: the squad's fee is settled once the leader has paid.
  const feesSettled  = squad.paid === 1 || squad.status === "fees_settled";

  // Lifecycle: registered → under_review → shortlisted → approved (+ rejected).
  const isForming    = squad.status === "registered" || squad.status === "forming";
  const isUnderRev   = squad.status === "under_review" || squad.status === "submitted";
  const shortlisted  = squad.status === "shortlisted";
  const approved     = squad.status === "approved" || squad.status === "fees_settled";
  const canSubmit    =
    isLeader &&
    (isForming || squad.status === "rejected") &&
    memberRows.length >= squad.min_members;

  // Editing is locked once submitted for review — only pre-review.
  const canEdit      = isLeader && (isForming || squad.status === "rejected");
  // Team-pays model: the leader pays one fee covering every seat.
  const teamTotal    = totalMembers * pricePerPerson;
  // Shortlisted paid teams owe the entry fee (until the leader pays).
  const needsPayment = shortlisted && paidEvent && !feesSettled;

  return (
    <main className="flex-1">
      <TopBar />
      <RegisterShell
        eyebrow={`${cfg?.label ?? squad.event} · Team`}
        title="Team"
        accent={squad.name}
        wide
      >
        <div className="mx-auto flex w-full max-w-3xl flex-col">
          {/* Tagline / sub-heading — directly under the team name. */}
          {squad.tagline && (
            <p className="-mt-4 text-center font-wizard italic text-silver-hp/75 text-base sm:text-lg">
              {squad.tagline}
            </p>
          )}

          {/* Meta row — inline, no box. Leader gets the edit-team action here. */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 border-y border-cyan-hp/10 py-4">
            <StatusPill status={squad.status} />
            <span className="font-mono text-xs text-silver-hp/55">{squad.id}</span>
            <span className="font-display text-[10px] uppercase tracking-[0.4em] text-silver-hp/55">
              {memberRows.length} / {squad.max_members} seats
            </span>
            {canEdit && (
              <RoughButton
                as="link"
                href={`${teamUrl(squad.event, squad.id)}/settings`}
                color="#66FCF1"
                fill={false}
                seed={37}
                className="ml-auto px-6 py-2 text-[10px] tracking-[0.35em]"
              >
                EDIT TEAM ↗
              </RoughButton>
            )}
          </div>

          {/* Progress — clean bars, no surrounding card. */}
          <div className="mt-8 flex flex-col gap-6">
            <ProgressBar
              label="Seats filled"
              value={`${memberRows.length} / ${squad.max_members}`}
              pct={Math.round((memberRows.length / Math.max(squad.max_members, 1)) * 100)}
              color="#66FCF1"
            />
            {paidEvent && (
              <PaymentProgress
                total={totalMembers}
                pricePerPerson={pricePerPerson}
                feesSettled={feesSettled}
              />
            )}
          </div>

          {/* Members. */}
          <section className="mt-12">
            <SectionHeading>Members</SectionHeading>
            <ul className="flex flex-col gap-2">
              {memberRows.map((m) => (
                <li key={m.id}>
                  <Link
                    href={m.elixpo_id ? userUrl(m.elixpo_id) : "#"}
                    className="flex items-center justify-between gap-3 rounded-sm border border-cyan-hp/15 bg-slate-hp/20 px-4 py-3 transition hover:bg-slate-hp/40"
                  >
                    <span className="flex items-center gap-3 min-w-0">
                      <span className="font-display text-[9px] uppercase tracking-[0.35em] text-gold-hp/80 rounded-full border border-gold-hp/50 bg-gold-hp/10 px-2 py-0.5">
                        {m.role}
                      </span>
                      <span className="flex min-w-0 flex-col">
                        <span className="font-display text-sm text-silver-hp truncate">
                          {m.display_name ?? (m.username ? `@${m.username}` : "(pending)")}
                        </span>
                        {m.display_name && m.username && (
                          <span className="font-mono text-[11px] text-silver-hp/55 truncate">@{m.username}</span>
                        )}
                      </span>
                    </span>
                    <span className="font-mono text-xs text-silver-hp/55 shrink-0">{m.id}</span>
                  </Link>
                </li>
              ))}
              {Array.from({ length: seatsLeft }).map((_, i) => (
                <li
                  key={`seat-${i}`}
                  className="flex items-center gap-3 rounded-sm border border-dashed border-silver-hp/15 bg-midnight/20 px-4 py-3 font-wizard italic text-silver-hp/40 text-sm"
                >
                  open seat
                </li>
              ))}
            </ul>
          </section>

          {/* CP handles — the team-of-1's competitive-programming profiles. */}
          {cpHandles && (
            <section className="mt-12">
              <SectionHeading>Handles</SectionHeading>
              <ul className="flex flex-col gap-2">
                {cpHandles.codeforces && (
                  <HandleRow label="Codeforces" href={`https://codeforces.com/profile/${cpHandles.codeforces}`} handle={cpHandles.codeforces} />
                )}
                {cpHandles.leetcode && (
                  <HandleRow label="LeetCode" href={`https://leetcode.com/u/${cpHandles.leetcode}`} handle={cpHandles.leetcode} />
                )}
                {cpHandles.codechef && (
                  <HandleRow label="CodeChef" href={`https://www.codechef.com/users/${cpHandles.codechef}`} handle={cpHandles.codechef} />
                )}
              </ul>
            </section>
          )}

          {/* About — plain, only when there's a description. */}
          {squad.description && (
            <section className="mt-12">
              <SectionHeading>About</SectionHeading>
              <p className="font-wizard text-silver-hp/80 text-sm leading-relaxed whitespace-pre-wrap">
                {squad.description}
              </p>
            </section>
          )}

          {/* Review → Payment. Pre-approval shows the review CTA; once approved
              and fees are due, the slot turns into the payment action (leader
              pays for the whole team; members wait). */}
          <section className="mt-14 flex flex-col items-center gap-3 border-t border-cyan-hp/10 pt-10 text-center">
            <SectionHeading center>
              {needsPayment || feesSettled ? "Entry fee" : "Review"}
            </SectionHeading>

            {isLeader && (isForming || squad.status === "rejected") ? (
              <SubmitForReview
                squadId={squad.id}
                canSubmit={canSubmit}
                minMembers={squad.min_members}
                currentCount={memberRows.length}
                rejectedNotes={squad.status === "rejected" ? squad.review_notes : null}
              />
            ) : isUnderRev ? (
              <p className="font-wizard italic text-silver-hp/75 text-sm">
                Submitted for review — admins reply within 48 hours.
              </p>
            ) : feesSettled ? (
              <p className="font-wizard italic text-emerald-300/85 text-sm">
                Fees paid — your team&apos;s seats are locked in. ✓
              </p>
            ) : needsPayment ? (
              isLeader ? (
                <div className="flex flex-col items-center gap-2">
                  <p className="font-wizard text-silver-hp/80 text-sm">
                    Your team is shortlisted. Pay the ₹{teamTotal} entry fee to lock in
                    {totalMembers > 1 ? " everyone's seats." : " your seat."}
                  </p>
                  <PayButton
                    event={squad.event}
                    squadId={squad.id}
                    price={teamTotal}
                    label={`PAY ₹${teamTotal} & LOCK SEATS ↗`}
                  />
                </div>
              ) : (
                <p className="font-wizard italic text-gold-hp/85 text-sm">
                  Shortlisted — waiting for the team leader to pay the ₹{teamTotal}{" "}
                  entry fee and lock in the seats.
                </p>
              )
            ) : approved ? (
              <p className="font-wizard italic text-emerald-300/85 text-sm">
                Approved — this team&apos;s seats are locked in.
              </p>
            ) : (
              <p className="font-wizard italic text-silver-hp/55 text-sm">
                This team is {squad.status}.
              </p>
            )}
          </section>
        </div>
      </RegisterShell>
      <Footer />
    </main>
  );
}

function HandleRow({ label, href, handle }) {
  return (
    <li className="flex items-center justify-between gap-3 rounded-sm border border-cyan-hp/15 bg-slate-hp/20 px-4 py-3">
      <span className="font-display text-[10px] uppercase tracking-[0.35em] text-cyan-hp/80">
        {label}
      </span>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="font-mono text-sm text-silver-hp hover:text-cyan-hp"
      >
        @{handle} ↗
      </a>
    </li>
  );
}

function SectionHeading({ children, center = false }) {
  return (
    <h2
      className={`mb-4 font-display text-[11px] uppercase tracking-[0.4em] text-gold-hp/80 ${
        center ? "text-center" : ""
      }`}
    >
      {children}
    </h2>
  );
}

function ProgressBar({ label, value, pct, color }) {
  const clamped = Math.max(0, Math.min(100, pct));
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-display text-[10px] uppercase tracking-[0.4em] text-cyan-hp/80">
          {label}
        </span>
        <span className="font-display text-[11px] tracking-[0.3em] text-silver-hp">
          {value}
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-hp/50">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${clamped}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

function PaymentProgress({ total, pricePerPerson, feesSettled }) {
  // Team-pays model: one fee covers the whole squad — show it as paid/due,
  // not a per-member tally. Total = members × per-person price.
  const rupees = total * pricePerPerson;
  const c = feesSettled ? "#4ade80" : "#D4AF37";
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-display text-[10px] uppercase tracking-[0.4em] text-gold-hp/80">
          Entry fee
        </span>
        <span className="font-display text-[11px] tracking-[0.3em] text-silver-hp">
          {feesSettled ? "Paid ✓" : "Due"}
          <span className="text-silver-hp/55"> · ₹{rupees}</span>
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-hp/50">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: feesSettled ? "100%" : "0%", backgroundColor: c }}
        />
      </div>
    </div>
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
