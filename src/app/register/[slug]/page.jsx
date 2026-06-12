// /register/[slug] — event-specific entry.
//
// - Validates slug against REGISTRATION_EVENTS.
// - Gates on session + GDG (server-side redirects via the auth helpers).
// - Squad events render <SquadCreateForm />.
// - Solo events render a placeholder until the solo flow lands.

import { notFound } from "next/navigation";
import Link from "next/link";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import RoughFrame from "@/components/RoughFrame";
import RoughButton from "@/components/RoughButton";
import RegisterShell from "@/components/register/RegisterShell";
import SquadCreateForm from "@/components/register/SquadCreateForm";
import GdgGate from "@/components/register/GdgGate";
import { getSessionUser } from "@/lib/auth/server";
import {
  REGISTRATION_EVENTS,
  isSquadEvent,
  teamUrl,
} from "@/lib/registration/events";
import { getDB } from "@/lib/db";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return Object.keys(REGISTRATION_EVENTS).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const cfg = REGISTRATION_EVENTS[slug];
  if (!cfg) return { title: "Register · HexaFalls" };
  return {
    title: `Register · ${cfg.label} · HexaFalls`,
    description: `Register for ${cfg.label} at HexaFalls 2026.`,
  };
}

export default async function EventRegisterPage({ params }) {
  const { slug } = await params;
  const cfg = REGISTRATION_EVENTS[slug];
  if (!cfg) notFound();

  const returnTo = `/register/${slug}`;
  const user = await getSessionUser();

  // If a squad event and the caller is already in one, jump straight to it.
  let existingSquadId = null;
  if (user && isSquadEvent(slug)) {
    const row = await getDB()
      .prepare(
        `SELECT s.id FROM squad_members sm
           JOIN squads s ON s.id = sm.squad_id
          WHERE sm.user_id = ? AND s.event = ? LIMIT 1`,
      )
      .bind(user.id, slug)
      .first();
    existingSquadId = row?.id ?? null;
  }

  return (
    <main className="flex-1">
      <TopBar />
      <RegisterShell
        eyebrow={`Sign on · ${cfg.label}`}
        title="Register for"
        accent={cfg.label}
      >
        {!user && <SignInPanel returnTo={returnTo} />}
        {user && !user.gdg_verified && <GdgGate returnTo={returnTo} />}
        {user && user.gdg_verified && existingSquadId && (
          <AlreadyInSquad
            href={teamUrl(slug, existingSquadId)}
            eventLabel={cfg.label}
          />
        )}
        {user && user.gdg_verified && !existingSquadId && (
          isSquadEvent(slug) ? (
            <SquadCreateForm
              event={slug}
              eventLabel={cfg.label}
              hasUsername={Boolean(user.username)}
            />
          ) : (
            <SoloStub eventLabel={cfg.label} />
          )
        )}
      </RegisterShell>
      <Footer />
    </main>
  );
}

function SignInPanel({ returnTo }) {
  return (
    <RoughFrame
      seed={47}
      stroke="#66FCF1"
      mistColor="#66FCF1"
      padding={22}
      className="w-full bg-slate-hp/40 backdrop-blur-sm"
      inner="flex flex-col gap-4 items-center text-center"
    >
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
  );
}

function AlreadyInSquad({ href, eventLabel }) {
  void eventLabel;
  return (
    <RoughFrame
      seed={59}
      stroke="#D4AF37"
      mistColor="#D4AF37"
      padding={22}
      className="w-full bg-slate-hp/35 backdrop-blur-sm"
      inner="flex flex-col gap-4 items-center text-center"
    >
      <h2 className="font-display tracking-[0.3em] uppercase text-sm text-gold-hp hp-glow-gold">
        Already signed on
      </h2>
      <RoughButton
        as="link"
        href={href}
        color="#D4AF37"
        glow="rgba(212,175,55,0.40)"
        shimmer
        seed={21}
        className="px-10 sm:px-12 py-4 text-[13px] sm:text-[14px] tracking-[0.4em]"
      >
        OPEN MY SQUAD ↗
      </RoughButton>
    </RoughFrame>
  );
}

function SoloStub({ eventLabel }) {
  return (
    <RoughFrame
      seed={41}
      stroke="#66FCF1"
      mistColor="#66FCF1"
      padding={22}
      className="w-full bg-slate-hp/35 backdrop-blur-sm"
      inner="flex flex-col gap-4 items-center text-center"
    >
      <span className="font-display tracking-[0.3em] uppercase text-[10px] text-gold-hp/80">
        Solo · {eventLabel}
      </span>
      <h2 className="font-display tracking-tight text-xl text-silver-hp">
        Form coming soon
      </h2>
      <p className="font-wizard text-silver-hp/75 text-base">
        The solo registration form is being inked. You are signed in and
        GDG-verified — you will register here when it opens.
      </p>
      <Link
        href="/register"
        className="font-display text-[10px] uppercase tracking-[0.35em] text-cyan-hp/85 hover:text-cyan-hp underline underline-offset-4"
      >
        ← back to event picker
      </Link>
    </RoughFrame>
  );
}
