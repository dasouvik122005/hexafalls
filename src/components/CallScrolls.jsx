// Three "call for…" scrolls under the hero. Lightweight (no images) — pure
// rough-themed cards so they stay fast.

import RoughFrame from "./RoughFrame";
import RoughButton from "./RoughButton";
import RoughDivider from "./RoughDivider";

// Judges & mentors registration (Luma).
const JUDGES_FORM_URL = "https://luma.com/8f43ddm9";

const SCROLLS = [
  {
    rune: "✦",
    title: "Call for Sponsors",
    blurb: "Stand beside the hall and fuel the magic. Put your name on the season.",
    color: "#D4AF37",
    glow: "rgba(212,175,55,0.35)",
    href: "/sponsors",
    cta: "BECOME A SPONSOR",
  },
  {
    rune: "✶",
    title: "Call for Judges & Mentors",
    blurb: "Wise hands, sharp eyes — guide the council, mentor the makers, crown the victors.",
    color: "#66FCF1",
    glow: "rgba(102,252,241,0.35)",
    href: JUDGES_FORM_URL,
    external: true,
    cta: "JUDGE OR MENTOR",
  },
  {
    rune: "❖",
    title: "Call for Community Partners",
    blurb: "Bring your guild. Grow the order together and reach further.",
    color: "#A78BFA",
    glow: "rgba(167,139,250,0.35)",
    href: "https://luma.com/06mfu8uh",
    external: true,
    cta: "PARTNER WITH US",
  },
];

export default function CallScrolls() {
  return (
    <section className="relative isolate overflow-hidden px-6 py-16 sm:py-20">
      <div aria-hidden="true" className="absolute inset-0 -z-10 hp-scrim pointer-events-none opacity-60" />
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col items-center gap-2 text-center">
          <div className="flex items-center gap-3">
            <RoughDivider width={48} height={20} color="#66FCF1" seed={3} />
            <span className="font-display text-[11px] uppercase tracking-[0.5em] text-cyan-hp/80">
              The scrolls go out
            </span>
            <RoughDivider width={48} height={20} color="#66FCF1" seed={5} />
          </div>
          <p className="max-w-xl font-wizard italic text-silver-hp/60 text-sm">
            Lend your hand to HexaFalls — as a sponsor, a judge, or a community partner.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {SCROLLS.map((s, i) => (
            <RoughFrame
              key={s.title}
              seed={31 + i * 6}
              stroke={s.color}
              mistColor={s.color}
              strokeWidth={1.3}
              padding={22}
              className="h-full bg-slate-hp/30 backdrop-blur-sm"
              inner="flex h-full flex-col items-center gap-3 text-center"
            >
              <span className="text-2xl" style={{ color: s.color }} aria-hidden="true">
                {s.rune}
              </span>
              <h3 className="font-display tracking-[0.2em] uppercase text-sm text-silver-hp">
                {s.title}
              </h3>
              <p className="font-wizard text-silver-hp/65 text-sm leading-relaxed">{s.blurb}</p>
              <div className="mt-auto pt-3">
                {s.soon || !s.href ? (
                  <span className="inline-flex items-center gap-2 rounded-full border border-gold-hp/40 bg-gold-hp/10 px-4 py-1.5 font-display text-[10px] uppercase tracking-[0.3em] text-gold-hp/90">
                    Coming soon
                  </span>
                ) : (
                  <RoughButton
                    as={s.external ? "a" : "link"}
                    href={s.href}
                    {...(s.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    color={s.color}
                    glow={s.glow}
                    fill={false}
                    shimmer
                    seed={40 + i}
                    className="px-7 py-3 leading-none text-[11px] tracking-[0.35em]"
                  >
                    {s.cta} ↗
                  </RoughButton>
                )}
              </div>
            </RoughFrame>
          ))}
        </div>
      </div>
    </section>
  );
}
