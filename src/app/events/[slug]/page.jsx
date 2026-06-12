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
import { EVENTS } from "@/lib/routes";

// Map an /events slug → one or more internal /register slugs.
// Each entry: { label, href, primary? } — only one entry is "primary"
// (rendered as the big gold shimmer button).
const REGISTRATION_PATHS = {
  hackathon: [
    { label: "REGISTER · HACKATHON", href: "/register/hackathon", primary: true },
  ],
  hardware: [
    { label: "EXHIBITION (TEAM)",  href: "/register/hardware-exhibition", primary: true },
    { label: "COMPETITION (SOLO)", href: "/register/hardware-competition" },
  ],
  cp: [
    { label: "REGISTER · COMPETITIVE PROGRAMMING", href: "/register/cp", primary: true },
  ],
  gaming: [
    { label: "REGISTER · GAMING ARENA", href: "/register/gaming", primary: true },
  ],
};

// One-line context strings — that's the entire writeup.
const CONTEXT = {
  hackathon: "58 hours of pure spellwork. Squads of 2–4.",
  hardware:  "Build the magic you can hold. Exhibit as a squad of 2–5, or duel solo.",
  cp:        "Duels of logic. Solo entry, fastest hand wins.",
  gaming:    "Controller in hand, glory on the line. Solo entry.",
};

export function generateStaticParams() {
  return EVENTS.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const event = EVENTS.find((e) => e.slug === slug);
  if (!event) return { title: "Event · HexaFalls Techfest" };
  return {
    title: `${event.name} · HexaFalls Techfest`,
    description: `${event.name} at HexaFalls 2026, JIS University. ${CONTEXT[slug] ?? ""} Register now.`,
  };
}

export default async function EventPage({ params }) {
  const { slug } = await params;
  const event = EVENTS.find((e) => e.slug === slug);
  if (!event) notFound();

  const paths = REGISTRATION_PATHS[slug] ?? [];
  const context = CONTEXT[slug] ?? "";
  const accent = event.name.replace(/^The\s+/i, "");

  return (
    <main className="flex-1">
      <TopBar />
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

        {/* Live indicator */}
        <span
          className="mt-8 inline-flex items-center gap-2 rounded-full border px-3 py-1 font-display text-[10px] uppercase tracking-[0.4em]"
          style={{
            borderColor: `${event.color}80`,
            color: event.color,
            backgroundColor: `${event.color}1a`,
          }}
        >
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
        </span>

        {/* CTA stack */}
        <div className="mt-8 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4">
          {paths.map((p) =>
            p.primary ? (
              <RoughButton
                key={p.href}
                as="link"
                href={p.href}
                color={event.color}
                glow={event.glow}
                shimmer
                seed={23}
                className="px-10 sm:px-12 py-4 text-[13px] sm:text-[14px] tracking-[0.4em]"
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
          )}
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

        {/* Full brief stub — kept tiny per "no extra writeup". */}
        <div className="mx-auto mt-20 w-full max-w-xl">
          <RoughFrame
            seed={59}
            stroke="#66FCF1"
            mistColor="#66FCF1"
            strokeWidth={1.3}
            padding={18}
            className="w-full bg-slate-hp/25 backdrop-blur-sm"
            inner="flex flex-col items-center text-center gap-2"
          >
            <span className="font-display text-[9px] uppercase tracking-[0.5em] text-cyan-hp/75">
              Rules · schedule · judging
            </span>
            <span className="font-wizard italic text-silver-hp/60 text-sm">
              Full brief unfurling soon.
            </span>
          </RoughFrame>
        </div>
      </section>
      <Footer />
    </main>
  );
}
