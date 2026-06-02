// /register/join/[token]
//
//   not signed in       → render "sign in to accept" panel (returnTo this URL)
//   signed in, no GDG   → render <GdgGate /> (returns here after)
//   signed in, GDG ok   → render <JoinSquadForm /> with the squad context
//
// The token never leaves the URL; the POST to /api/register/squad/:id/join
// re-validates it.

import { notFound } from "next/navigation";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import RoughFrame from "@/components/RoughFrame";
import RoughButton from "@/components/RoughButton";
import RegisterShell from "@/components/register/RegisterShell";
import GdgGate from "@/components/register/GdgGate";
import JoinSquadForm from "@/components/register/JoinSquadForm";
import { getDB } from "@/lib/db";
import { getSessionUser } from "@/lib/auth/server";
import { REGISTRATION_EVENTS } from "@/lib/registration/events";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Accept Squad Invite · HexaFalls",
  description:
    "Accept your invite to a HexaFalls squad. Sign in with Elixpo and lock your seat.",
  robots: { index: false, follow: false },
};

export default async function JoinPage({ params }) {
  const { token } = await params;
  const db = getDB();

  const squad = await db
    .prepare(
      `SELECT id, event, name, status, max_members
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
  const returnTo = `/register/join/${token}`;

  return (
    <main className="flex-1">
      <TopBar />
      <RegisterShell
        eyebrow="Invite to a squad"
        title="Join"
        accent={squad.name}
      >
        <div className="flex flex-col gap-6">
          <p className="font-wizard italic text-silver-hp/75 text-center text-sm">
            {cfg?.label ?? squad.event} · {filled} of {squad.max_members} seats
            filled
          </p>

          {squad.status !== "forming" && (
            <RoughFrame
              seed={61}
              stroke="#EF4444"
              mistColor="#EF4444"
              padding={20}
              className="w-full bg-slate-hp/35 backdrop-blur-sm"
            >
              <p className="font-wizard text-red-300/85 text-base">
                This squad is no longer accepting members.
              </p>
            </RoughFrame>
          )}

          {squad.status === "forming" && seatsLeft <= 0 && (
            <RoughFrame
              seed={63}
              stroke="#EF4444"
              mistColor="#EF4444"
              padding={20}
              className="w-full bg-slate-hp/35 backdrop-blur-sm"
            >
              <p className="font-wizard text-red-300/85 text-base">
                The squad is full. Ask the leader to make room or open a
                new one.
              </p>
            </RoughFrame>
          )}

          {squad.status === "forming" && seatsLeft > 0 && (
            <>
              {!me && (
                <RoughFrame
                  seed={65}
                  stroke="#66FCF1"
                  mistColor="#66FCF1"
                  padding={22}
                  className="w-full bg-slate-hp/40 backdrop-blur-sm"
                  inner="flex flex-col gap-4 items-center text-center"
                >
                  <p className="font-wizard text-silver-hp/85 text-base">
                    Sign in with Elixpo Accounts to accept this invite.
                  </p>
                  <RoughButton
                    as="a"
                    href={`/api/auth/login?return_to=${encodeURIComponent(returnTo)}`}
                    color="#D4AF37"
                    glow="rgba(212,175,55,0.40)"
                    shimmer
                    seed={19}
                    className="px-10 sm:px-12 py-4 text-[13px] sm:text-[14px] tracking-[0.4em]"
                  >
                    SIGN IN WITH ELIXPO ↗
                  </RoughButton>
                </RoughFrame>
              )}
              {me && !me.gdg_verified && <GdgGate returnTo={returnTo} />}
              {me && me.gdg_verified && (
                <JoinSquadForm
                  squadId={squad.id}
                  inviteToken={token}
                  squadName={squad.name}
                  eventLabel={cfg?.label ?? squad.event}
                  hasUsername={Boolean(me.username)}
                />
              )}
            </>
          )}
        </div>
      </RegisterShell>
      <Footer />
    </main>
  );
}
