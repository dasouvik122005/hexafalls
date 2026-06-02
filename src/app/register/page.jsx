// /register — the front door of registration.
//
//   not signed in       → render the "begin" panel + login CTA
//   signed in, no GDG   → render <GdgGate />
//   signed in, GDG ok   → render the event picker
//
// All redirects are link-based (no JS); pages render server-side.

import Link from "next/link";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import RoughFrame from "@/components/RoughFrame";
import RoughButton from "@/components/RoughButton";
import RegisterShell from "@/components/register/RegisterShell";
import GdgGate from "@/components/register/GdgGate";
import { getSessionUser } from "@/lib/auth/server";
import { REGISTRATION_EVENTS } from "@/lib/registration/events";

export const metadata = {
  title: "Register · HexaFalls Techfest",
  description:
    "Register for HexaFalls 2026. Pick your event, form your squad and lock your seat at the wizarding hackathon at JIS University.",
};

export const dynamic = "force-dynamic";

export default async function RegisterPage({ searchParams }) {
  const params = (await searchParams) ?? {};
  const user = await getSessionUser();

  return (
    <main className="flex-1">
      <TopBar />
      <RegisterShell
        eyebrow="Sign the scroll"
        title="Register for"
        accent="HexaFalls"
      >
        {!user && <BeginPanel returnTo="/register" />}
        {user && !user.gdg_verified && <GdgGate returnTo="/register" />}
        {user && user.gdg_verified && <EventPicker user={user} flash={params} />}
      </RegisterShell>
      <Footer />
    </main>
  );
}

function BeginPanel({ returnTo }) {
  return (
    <RoughFrame
      seed={71}
      stroke="#66FCF1"
      mistColor="#66FCF1"
      strokeWidth={1.4}
      padding={26}
      className="w-full bg-slate-hp/40 backdrop-blur-sm"
      inner="flex flex-col gap-5 items-center text-center"
    >
      <h2 className="font-display tracking-[0.3em] uppercase text-sm text-cyan-hp">
        Sign in to begin
      </h2>
      <RoughButton
        as="a"
        href={`/api/auth/login?return_to=${encodeURIComponent(returnTo)}`}
        color="#D4AF37"
        glow="rgba(212,175,55,0.40)"
        shimmer
        seed={17}
        className="px-10 sm:px-12 py-4 text-[13px] sm:text-[14px] tracking-[0.4em]"
      >
        SIGN IN WITH ELIXPO ↗
      </RoughButton>
      <p className="font-wizard italic text-silver-hp/55 text-xs">
        Powered by accounts.elixpo.com · OAuth 2.0
      </p>
    </RoughFrame>
  );
}

function EventPicker({ user, flash }) {
  const entries = Object.entries(REGISTRATION_EVENTS);
  return (
    <div className="flex flex-col gap-6">
      <RoughFrame
        seed={89}
        stroke="#D4AF37"
        mistColor="#D4AF37"
        strokeWidth={1.4}
        padding={20}
        className="w-full bg-slate-hp/30 backdrop-blur-sm"
        inner="flex flex-col gap-2"
      >
        <span className="font-display tracking-[0.3em] uppercase text-[10px] text-gold-hp/80">
          Signed in as
        </span>
        <span className="font-mono text-base text-silver-hp">
          {user.username ?? "(handle pending)"}{" "}
          <span className="text-silver-hp/55 text-sm">· {user.id}</span>
        </span>
        <div className="mt-2 flex flex-wrap items-center gap-4 font-display text-[10px] uppercase tracking-[0.35em]">
          {user.username && (
            <Link
              href={`/register/u/${user.username}`}
              className="text-gold-hp/80 hover:text-gold-hp underline underline-offset-4"
            >
              view profile ↗
            </Link>
          )}
          <Link
            href="/register/me"
            className="text-cyan-hp/85 hover:text-cyan-hp underline underline-offset-4"
          >
            edit profile
          </Link>
          <Link
            href="/api/auth/logout"
            className="text-silver-hp/60 hover:text-silver-hp underline underline-offset-4"
          >
            sign out
          </Link>
        </div>
      </RoughFrame>

      <h2 className="font-display tracking-[0.3em] uppercase text-sm text-gold-hp hp-glow-gold">
        Pick your event
      </h2>

      {flash.error && (
        <p className="font-wizard italic text-red-300 text-sm">
          {String(flash.error)}
        </p>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        {entries.map(([key, cfg]) => (
          <Link
            key={key}
            href={`/register/${key}`}
            className="group"
            aria-label={`Register for ${cfg.label}`}
          >
            <RoughFrame
              seed={103 + key.length * 7}
              stroke="#66FCF1"
              mistColor="#66FCF1"
              strokeWidth={1.3}
              padding={18}
              className="h-full bg-slate-hp/30 backdrop-blur-sm transition group-hover:bg-slate-hp/50"
              inner="flex h-full flex-col gap-2"
            >
              <span className="font-display tracking-[0.3em] uppercase text-[10px] text-cyan-hp/80">
                {cfg.mode === "squad" ? "Squad event" : "Solo event"}
              </span>
              <span className="font-display text-base sm:text-lg text-silver-hp">
                {cfg.label}
              </span>
              {cfg.mode === "squad" && (
                <span className="font-wizard text-xs text-silver-hp/65">
                  Min {cfg.minMembers} · Max {cfg.maxMembers}
                </span>
              )}
              <span className="mt-auto font-display text-[10px] uppercase tracking-[0.35em] text-gold-hp/80 group-hover:translate-x-0.5 transition">
                Open the scroll →
              </span>
            </RoughFrame>
          </Link>
        ))}
      </div>
    </div>
  );
}
