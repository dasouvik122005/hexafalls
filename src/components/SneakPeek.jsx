// Sneak-peek summary above the footer — the homepage has only a couple of
// sections, so this gives a rich at-a-glance look at the events + a nudge into
// the deeper pages. Reads from EVENTS (single source of truth).

import Link from "next/link";
import RoughButton from "./RoughButton";
import RoughDivider from "./RoughDivider";
import { EVENTS } from "@/lib/routes";


export default function SneakPeek() {
  return (
    <section className="relative isolate overflow-hidden px-6 py-20 sm:py-24">
      <div aria-hidden="true" className="absolute inset-0 -z-10 hp-scrim pointer-events-none opacity-60" />
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col items-center gap-3 text-center">
          <div className="flex items-center gap-3">
            <RoughDivider width={48} height={20} color="#D4AF37" seed={7} />
            <span className="font-display text-[11px] uppercase tracking-[0.5em] text-gold-hp/90">
              A glimpse of the night
            </span>
            <RoughDivider width={48} height={20} color="#D4AF37" seed={9} />
          </div>
          <h2 className="font-display font-black tracking-tight text-silver-hp text-3xl sm:text-4xl hp-glow">
            Four arenas. One festival.
          </h2>
          <p className="max-w-xl font-wizard italic text-silver-hp/60 text-sm">
            A quick look at what awaits — dive into any event for the full brief, rules and prizes.
          </p>
        </div>

        {/* At-a-glance summary band — shorthand when / where / scope */}
        <div className="mx-auto mb-8 max-w-3xl">
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-cyan-hp/20 bg-cyan-hp/10 sm:grid-cols-4">
            {[
              { k: "When", v: "Jul 24–26, 2026" },
              { k: "Where", v: "JIS University · Kolkata" },
              { k: "Format", v: "58-hr hackathon + 4 arenas" },
              { k: "Entry", v: "₹100/member · CP & school-exhibition free" },
            ].map((f) => (
              <div key={f.k} className="bg-midnight/80 px-4 py-3 text-center sm:text-left">
                <div className="font-display text-[9px] uppercase tracking-[0.35em] text-cyan-hp/70">
                  {f.k}
                </div>
                <div className="mt-1 font-display text-[12px] text-silver-hp leading-snug">
                  {f.v}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-center font-wizard text-silver-hp/65 text-sm leading-relaxed">
            HexaFalls is JIS University&apos;s wizarding techfest — three days of building,
            competing and celebrating across a flagship hackathon, hardware, gaming and
            competitive programming.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {EVENTS.map((e) => {
            const accent = e.name.replace(/^The\s+/i, "");
            return (
              <Link
                key={e.slug}
                href={`/events/${e.slug}`}
                className="group flex flex-col gap-3 rounded-sm border bg-slate-hp/30 p-5 transition hover:bg-slate-hp/50"
                style={{ borderColor: `${e.color}33` }}
              >
                <span className="text-xl" style={{ color: e.color }} aria-hidden="true">
                  {e.rune}
                </span>
                <h3 className="font-display tracking-[0.15em] uppercase text-sm" style={{ color: e.color }}>
                  {accent}
                </h3>
                <p className="font-wizard text-silver-hp/65 text-sm leading-relaxed">
                  {SUMMARY[e.slug] ?? e.blurb}
                </p>
                <span className="mt-auto pt-2 font-display text-[10px] uppercase tracking-[0.35em] text-silver-hp/55 group-hover:text-silver-hp transition">
                  Explore →
                </span>
              </Link>
            );
          })}
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <RoughButton
            as="link"
            href="/events"
            color="#D4AF37"
            glow="rgba(212,175,55,0.35)"
            fill={false}
            shimmer
            seed={51}
            className="px-9 sm:px-11 py-3.5 leading-none text-[12px] sm:text-[13px] tracking-[0.35em]"
          >
            EXPLORE ALL EVENTS ↗
          </RoughButton>
          <RoughButton
            as="link"
            href="/timeline"
            color="#C5C6C7"
            fill={false}
            seed={53}
            className="px-8 py-3 leading-none text-[11px] tracking-[0.3em]"
          >
            SEE THE TIMELINE
          </RoughButton>
        </div>
      </div>
    </section>
  );
}
