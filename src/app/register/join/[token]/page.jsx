// /register/join/[token]
//
//   not signed in        → "sign in to accept" panel (returnTo this URL)
//   already a member     → "you're already in this squad" + link to the team
//   in another squad     → "you're already in a squad for this event"
//   signed in            → <JoinSquadForm /> with the squad context
//
// The token never leaves the URL; the POST to /api/register/squad/:id/join
// re-validates it, then the client navigates to the team profile URL.

import { notFound } from "next/navigation";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import RoughFrame from "@/components/RoughFrame";
import RoughButton from "@/components/RoughButton";
import PageBackdrop from "@/components/PageBackdrop";
import JoinSquadForm from "@/components/register/JoinSquadForm";
import { getDB } from "@/lib/db";
import { getSessionUser } from "@/lib/auth/server";
import { REGISTRATION_EVENTS, teamUrl } from "@/lib/registration/events";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Join Squad · HexaFalls",
  description:
    "Accept your invite to a HexaFalls squad. Sign in with Elixpo and lock your seat. Co-developed by Ayushman Bhattacharya.",
  robots: { index: false, follow: false },
};

const OPEN = new Set(["forming", "registered"]);

export default async function JoinPage({ params }) {
  const { token } = await params;
  const db = getDB();

  const squad = await db
    .prepare(
      `SELECT id, event, name, tagline, status, max_members
         FROM squads WHERE invite_token = ?`,
    )
    .bind(token)
    .first();
  if (!squad) notFound();

  const countRow = await db
    .prepare(`SELECT COUNT(*) AS n FROM squad_members WHERE squad_id = ?`)
    .bind(squad.id)
    .first();
  const filled = countRow?.n ?? 0;
  const seatsLeft = squad.max_members - filled;

  const me = await getSessionUser();
  const cfg = REGISTRATION_EVENTS[squad.event];
  const eventLabel = cfg?.label ?? squad.event;
  const returnTo = `/register/join/${token}`;
  const teamHref = teamUrl(squad.event, squad.id);

  // Is the caller already a member here, or in another squad for this event?
  let alreadyMember = false;
  let otherSquadId = null;
  if (me) {
    const m = await db
      .prepare(`SELECT 1 FROM squad_members WHERE squad_id = ? AND user_id = ? LIMIT 1`)
      .bind(squad.id, me.id)
      .first();
    alreadyMember = !!m;
    if (!alreadyMember) {
      const other = await db
        .prepare(
          `SELECT s.id FROM squad_members sm JOIN squads s ON s.id = sm.squad_id
            WHERE sm.user_id = ? AND s.event = ? LIMIT 1`,
        )
        .bind(me.id, squad.event)
        .first();
      otherSquadId = other?.id ?? null;
    }
  }

  const isOpen = OPEN.has(squad.status);

  return (
    <main className="flex-1">
      <TopBar />
      <section className="relative isolate overflow-hidden min-h-screen px-6 pt-28 pb-24">
        <PageBackdrop />
        <div className="mx-auto w-full max-w-2xl">
          <div className="mb-8 flex flex-col items-center gap-1.5 text-center">
            <span className="font-display text-[10px] uppercase tracking-[0.45em] text-cyan-hp/70">
              Squad invite
            </span>
            <h1 className="font-display text-2xl sm:text-3xl tracking-tight text-silver-hp">
              Join {squad.name}
            </h1>
          </div>
          <div className="flex flex-col gap-6">
          {/* Which team, which event */}
          <RoughFrame
            seed={57}
            stroke="#66FCF1"
            mistColor="#66FCF1"
            strokeWidth={1.4}
            padding={22}
            className="w-full bg-slate-hp/35 backdrop-blur-sm"
            inner="flex flex-col items-center gap-2 text-center"
          >
            <span className="font-display text-[10px] uppercase tracking-[0.4em] text-cyan-hp/75">
              {eventLabel}
            </span>
            <h2 className="font-display text-xl sm:text-2xl text-silver-hp">{squad.name}</h2>
            {squad.tagline && (
              <p className="font-wizard italic text-silver-hp/70 text-sm">{squad.tagline}</p>
            )}
            <span className="mt-1 font-display text-[10px] uppercase tracking-[0.35em] text-gold-hp/80">
              {filled} / {squad.max_members} seats · {Math.max(0, seatsLeft)} open
            </span>
          </RoughFrame>

          {/* Already a member of THIS squad */}
          {alreadyMember && (
            <Notice stroke="#4ade80">
              <p className="font-wizard text-emerald-200/90 text-base text-center">
                You&apos;re already a member of this squad.
              </p>
              <CenterBtn href={teamHref} label="VISIT YOUR TEAM ↗" />
            </Notice>
          )}

          {/* In a different squad for this event */}
          {!alreadyMember && otherSquadId && (
            <Notice stroke="#D4AF37">
              <p className="font-wizard text-silver-hp/85 text-base text-center">
                You&apos;re already in another {eventLabel} squad — you can only
                join one per event.
              </p>
              <CenterBtn href={teamUrl(squad.event, otherSquadId)} label="GO TO MY SQUAD ↗" />
            </Notice>
          )}

          {/* Squad not open */}
          {!alreadyMember && !otherSquadId && !isOpen && (
            <Notice stroke="#EF4444">
              <p className="font-wizard text-red-300/85 text-base text-center">
                This squad is no longer accepting members.
              </p>
            </Notice>
          )}

          {/* Open but full */}
          {!alreadyMember && !otherSquadId && isOpen && seatsLeft <= 0 && (
            <Notice stroke="#EF4444">
              <p className="font-wizard text-red-300/85 text-base text-center">
                The squad is full. Ask the leader to make room or open a new one.
              </p>
            </Notice>
          )}

          {/* Joinable */}
          {!alreadyMember && !otherSquadId && isOpen && seatsLeft > 0 && (
            <>
              {!me && (
                <Notice stroke="#66FCF1">
                  <p className="font-wizard text-silver-hp/85 text-base text-center">
                    Sign in with Elixpo to accept this invite.
                  </p>
                  <CenterBtn
                    as="a"
                    href={`/api/auth/login?return_to=${encodeURIComponent(returnTo)}`}
                    label="SIGN IN WITH ELIXPO ↗"
                  />
                </Notice>
              )}
              {me && <JoinSquadForm
                squadId={squad.id}
                inviteToken={token}
                squadName={squad.name}
                eventLabel={eventLabel}
                hasUsername={Boolean(me.username)}
              />}
            </>
          )}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}

function Notice({ children, stroke }) {
  return (
    <RoughFrame
      seed={65}
      stroke={stroke}
      mistColor={stroke}
      padding={22}
      className="w-full bg-slate-hp/35 backdrop-blur-sm"
      inner="flex flex-col gap-4 items-center"
    >
      {children}
    </RoughFrame>
  );
}

function CenterBtn({ href, label, as = "link" }) {
  return (
    <RoughButton
      as={as}
      href={href}
      color="#D4AF37"
      glow="rgba(212,175,55,0.35)"
      fill={false}
      seed={19}
      className="px-9 sm:px-11 py-3.5 leading-none text-[12px] sm:text-[13px] tracking-[0.35em]"
    >
      {label}
    </RoughButton>
  );
}
