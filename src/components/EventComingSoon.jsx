"use client";

// Minimal "coming soon" screen for events without a full brief yet (cp, gaming).
// Vertically centered: eyebrow → headline → rough clock → "Coming soon". No
// register / prizes CTAs — just the clock. Matte (no heavy glow).

import Link from "next/link";
import HeroVideoBg from "./HeroVideoBg";
import RoughDivider from "./RoughDivider";
import RoughClock from "./RoughClock";

export default function EventComingSoon({ event }) {
  const accent = event.name.replace(/^The\s+/i, "");
  return (
    <section className="relative isolate flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-32 text-center">
      <HeroVideoBg />
      <div aria-hidden="true" className="absolute inset-0 -z-20 bg-midnight/70 pointer-events-none" />
      <div aria-hidden="true" className="absolute inset-0 -z-20 hp-scrim opacity-40 pointer-events-none" />

      <div
        className="flex items-center gap-3 font-display text-[11px] uppercase tracking-[0.5em]"
        style={{ color: `${event.color}bb` }}
      >
        <RoughDivider width={48} height={20} color={event.color} seed={3} />
        Track · {event.name}
        <RoughDivider width={48} height={20} color={event.color} seed={5} />
      </div>

      <h1
        className="mt-6 font-display font-black tracking-tight text-silver-hp leading-[1.05]"
        style={{ fontSize: "clamp(2.4rem, 9vw, 5.5rem)", letterSpacing: "0.01em" }}
      >
        The <span style={{ color: event.color }}>{accent}</span>
      </h1>

      <RoughClock size={150} color={event.color} className="my-10 hp-float" style={{ animationDuration: "9s" }} />

      <span className="font-display text-sm uppercase tracking-[0.5em] text-gold-hp/90">
        Coming soon
      </span>
      <p className="mt-4 max-w-md font-wizard italic text-silver-hp/60 text-sm">
        The full brief — rules, schedule and prizes — is still being inked.
      </p>

      <Link
        href="/events"
        className="mt-12 font-display text-[10px] uppercase tracking-[0.35em] text-silver-hp/45 transition hover:text-cyan-hp"
      >
        ← All events
      </Link>
    </section>
  );
}
