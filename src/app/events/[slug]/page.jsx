// /events/[slug] — slim, action-first event page.
//
// Layout:  eyebrow → headline → 1-line context → REGISTER CTA(s) → back.
// No extra prose, no whisper. Hackathon and the solo tracks each have one
// CTA pointing at our internal /register/[event] flow. Hardware is one
// event with two registration modes (exhibition + competition), so it
// renders two CTAs side by side.

import { notFound } from "next/navigation";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import HeroVideoBg from "@/components/HeroVideoBg";
import Sparkles from "@/components/Sparkles";
import RoughFrame from "@/components/RoughFrame";
import RoughButton from "@/components/RoughButton";
import RoughDivider from "@/components/RoughDivider";
import HackathonDetails from "@/components/HackathonDetails";
import HardwareDetails from "@/components/HardwareDetails";
import { EVENTS } from "@/lib/routes";
import { getDB } from "@/lib/db";
import { getSessionUser } from "@/lib/auth/server";
import { teamUrl } from "@/lib/registration/events";

export const dynamic = "force-dynamic";

// /events slug → the registration event key(s) that count as "registered".
const EVENT_KEYS = {
  hackathon: ["hackathon"],
  cp: ["cp"],
  gaming: ["gaming"],
  hardware: ["hardware-competition", "hardware-exhibition"],
};

// Returns { href, label } if the signed-in user is already registered for this
// event (squad membership or solo entry), else null.
async function getRegistration(slug) {
  const keys = EVENT_KEYS[slug];
  if (!keys) return null;
  const user = await getSessionUser();
  if (!user) return null;
  const db = getDB();
  const ph = keys.map(() => "?").join(",");

  const squad = await db
    .prepare(
      `SELECT s.id, s.event FROM squad_members sm JOIN squads s ON s.id = sm.squad_id
        WHERE sm.user_id = ? AND s.event IN (${ph}) LIMIT 1`,
    )
    .bind(user.id, ...keys)
    .first();
  if (squad) return { href: teamUrl(squad.event, squad.id), label: "VIEW MY TEAM" };

  const solo = await db
    .prepare(`SELECT id FROM solo_registrations WHERE user_id = ? AND event IN (${ph}) LIMIT 1`)
    .bind(user.id, ...keys)
    .first();
  if (solo) return { href: `/u/${user.elixpo_id}`, label: "VIEW MY ENTRY" };

  return null;
}

// Map an /events slug → one or more register CTAs (now events-scoped).
// Each entry: { label, href, primary? } — only one entry is "primary"
// (rendered as the big gold shimmer button).
const REGISTRATION_PATHS = {
  hackathon: [
    { label: "REGISTER · HACKATHON", href: "/events/hackathon/register", primary: true },
  ],
  hardware: [
    { label: "COMPETITION (TEAM 2–4)", href: "/events/hardware/register?mode=competition", primary: true },
    { label: "EXHIBITION (SCHOOL · SOLO)", href: "/events/hardware/register?mode=exhibition" },
  ],
  cp: [
    { label: "REGISTER · COMPETITIVE PROGRAMMING", href: "/events/cp/register", primary: true },
  ],
  gaming: [
    { label: "REGISTER · GAMING ARENA", href: "/events/gaming/register", primary: true, soon: true },
  ],
};

// One-line context strings — that's the entire writeup.
const CONTEXT = {
  hackathon: "58 hours of pure spellwork. Squads of 2–4.",
  hardware:  "Build the magic you can hold. Compete as a team of 2–4, or exhibit solo (high-school).",
  cp:        "Duels of logic. Solo entry, fastest hand wins.",
  gaming:    "Controller in hand, glory on the line. Squads of 2–4.",
};

export function generateStaticParams() {
  return EVENTS.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const event = EVENTS.find((e) => e.slug === slug);
  if (!event) return { title: "Event · HexaFalls Techfest" };
  if (event.slug === "hackathon") {
    return {
      title: "Software Hackathon — Judging Rubric · HexaFalls Techfest",
      description:
        "58-hour software hackathon judging rubric, scoring criteria, hackathon tracks, bonus points, and submission requirements at HexaFalls. Co-developed by Ayushman Bhattacharya.",
    };
  }
  if (event.slug === "hardware") {
    return {
      title: "Hardware Hack — Tracks · HexaFalls Techfest",
      description:
        "Hardware hackathon tracks including Exhibition, Robo Sumo, Robo Soccer, Robo Terrence, and Line Follower at HexaFalls. Co-developed by Ayushman Bhattacharya.",
    };
  }
  return {
    title: `${event.name} · HexaFalls Techfest`,
    description: `${event.name} at HexaFalls 2026, JIS University. ${CONTEXT[slug] ?? ""} Register now. Co-developed by Ayushman Bhattacharya.`,
  };
}

export default async function EventPage({ params }) {
  const { slug } = await params;
  const event = EVENTS.find((e) => e.slug === slug);
  if (!event) notFound();

  const paths = REGISTRATION_PATHS[slug] ?? [];
  const context = CONTEXT[slug] ?? "";
  const accent = event.name.replace(/^The\s+/i, "");
  const isHackathon = event.slug === "hackathon";
  const isHardware = event.slug === "hardware";
  const comingSoon = paths.some((p) => p.soon);
  const registered = await getRegistration(slug);

  return (
    <main className="flex-1">
      <TopBar />
      {isHackathon ? (
        <HackathonDetails registered={registered} />
      ) : isHardware ? (
        <HardwareDetails registered={registered} />
      ) : (
      <section className="relative isolate overflow-hidden min-h-screen pt-28 pb-24 px-6 flex flex-col items-center">
        <HeroVideoBg />
        <div aria-hidden="true" className="absolute inset-0 -z-20 hp-scrim pointer-events-none" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 pointer-events-none">
          <Sparkles count={18} />
        </div>

        {/* Eyebrow */}
        <div
          className="mx-auto mb-6 flex max-w-3xl items-center justify-center gap-3 text-[11px] uppercase tracking-[0.5em] font-display text-center"
          style={{ color: event.color, opacity: 0.85 }}
        >
          <RoughDivider width={48} height={20} color={event.color} seed={3} />
          Track · {event.name}
          <RoughDivider width={48} height={20} color={event.color} seed={5} />
        </div>

        {/* Headline */}
        <h1
          aria-label={event.name}
          className="font-display font-black tracking-tight text-silver-hp leading-[1.05] text-balance text-center hp-glow"
          style={{ fontSize: "clamp(2.4rem, 9vw, 5.5rem)", letterSpacing: "0.01em" }}
        >
          The{" "}
          <span
            style={{
              color: event.color,
              textShadow: `0 0 8px ${event.color}b3, 0 0 24px ${event.glow}`,
            }}
          >
            {accent}
          </span>
        </h1>

        {/* One-line context */}
        {context && (
          <p className="mt-6 max-w-2xl text-center font-wizard text-silver-hp/85 text-base sm:text-lg">
            {context}
          </p>
        )}

        {/* Live indicator / already-registered badge */}
        {registered ? (
          <span className="mt-8 inline-flex items-center gap-2 rounded-full border border-emerald-400/50 bg-emerald-400/10 px-3 py-1 font-display text-[10px] uppercase tracking-[0.4em] text-emerald-300">
            <span aria-hidden="true">✓</span> You&apos;re registered
          </span>
        ) : (
          <span
            className="mt-8 inline-flex items-center gap-2 rounded-full border px-3 py-1 font-display text-[10px] uppercase tracking-[0.4em]"
            style={{
              borderColor: `${event.color}80`,
              color: event.color,
              backgroundColor: `${event.color}1a`,
            }}
          >
            {comingSoon ? (
              <>Registrations opening soon</>
            ) : (
              <>
                <span className="relative flex h-1.5 w-1.5">
                  <span
                    className="absolute inline-flex h-full w-full rounded-full opacity-70 animate-ping"
                    style={{ backgroundColor: event.color }}
                  />
                  <span
                    className="relative inline-flex h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: event.color }}
                  />
                </span>
                Registrations open
              </>
            )}
          </span>
        )}

        {/* CTA stack */}
        <div className="mt-8 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4">
          {registered ? (
            <RoughButton
              as="link"
              href={registered.href}
              color="#4ade80"
              glow="rgba(74,222,128,0.3)"
              fill={false}
              shimmer
              seed={23}
              className="px-10 sm:px-12 py-4 leading-none text-[13px] sm:text-[14px] tracking-[0.4em]"
            >
              {registered.label} <span aria-hidden="true">↗</span>
            </RoughButton>
          ) : (
            paths.map((p) =>
            p.soon ? (
              <RoughButton
                key={p.href}
                as="button"
                disabled
                color={event.color}
                fill={false}
                seed={23}
                className="px-10 sm:px-12 py-4 leading-none text-[13px] sm:text-[14px] tracking-[0.4em]"
              >
                REGISTRATION · COMING SOON
              </RoughButton>
            ) : p.primary ? (
              <RoughButton
                key={p.href}
                as="link"
                href={p.href}
                color={event.color}
                glow={event.glow}
                fill={false}
                shimmer
                seed={23}
                className="px-10 sm:px-12 py-4 leading-none text-[13px] sm:text-[14px] tracking-[0.4em]"
              >
                {p.label} <span aria-hidden="true">↗</span>
              </RoughButton>
            ) : (
              <RoughButton
                key={p.href}
                as="link"
                href={p.href}
                color={event.color}
                fill={false}
                seed={29}
                className="px-8 sm:px-10 py-3 text-[12px] sm:text-[13px] tracking-[0.35em]"
              >
                {p.label} <span aria-hidden="true">↗</span>
              </RoughButton>
            ),
          ))}
        </div>

        {/* Quick links */}
        <div className="mt-10 flex flex-row flex-wrap items-center justify-center gap-3">
          <RoughButton
            as="link"
            href={`/events/${event.slug}/prizes`}
            color="#C5C6C7"
            fill={false}
            seed={37}
            className="px-6 py-2 text-[10px] tracking-[0.35em]"
          >
            SEE THE PRIZES
          </RoughButton>
          <RoughButton
            as="link"
            href="/events"
            color="#C5C6C7"
            fill={false}
            seed={41}
            className="px-6 py-2 text-[10px] tracking-[0.35em]"
          >
            ← ALL EVENTS
          </RoughButton>
        </div>

        {/* Coming-soon brief — mirrors the structure of the full event pages
            (hackathon/hardware) so every /events/[slug] reads consistently. */}
        <div className="mx-auto mt-24 w-full max-w-4xl">
          <div className="mb-8 flex flex-col items-center gap-2 text-center">
            <div className="flex items-center gap-3">
              <RoughDivider width={48} height={20} color={event.color} seed={7} />
              <span className="font-display text-[11px] uppercase tracking-[0.5em]" style={{ color: `${event.color}cc` }}>
                The full brief is being inked
              </span>
              <RoughDivider width={48} height={20} color={event.color} seed={9} />
            </div>
            <p className="max-w-xl font-wizard italic text-silver-hp/60 text-sm">
              Rules, schedule and prizes for {event.name} are unfurling soon. Sign on
              now so you’re first through the gates.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { t: "The Rules", n: "Format, eligibility & scoring" },
              { t: "The Schedule", n: "Rounds, breaks & the finale" },
              { t: "The Prizes", n: "What glory awaits the victors" },
            ].map((c, i) => (
              <RoughFrame
                key={c.t}
                seed={57 + i * 4}
                stroke={event.color}
                mistColor={event.color}
                strokeWidth={1.3}
                padding={18}
                className="w-full bg-slate-hp/25 backdrop-blur-sm"
                inner="flex flex-col items-center text-center gap-2 min-h-[120px] justify-center"
              >
                <span className="font-display text-sm tracking-[0.2em] uppercase text-silver-hp">
                  {c.t}
                </span>
                <span className="font-wizard text-xs text-silver-hp/55">{c.n}</span>
                <span className="mt-1 font-display text-[9px] uppercase tracking-[0.4em] text-gold-hp/70">
                  Soon
                </span>
              </RoughFrame>
            ))}
          </div>
        </div>
      </section>
      )}
      <Footer />
    </main>
  );
}
