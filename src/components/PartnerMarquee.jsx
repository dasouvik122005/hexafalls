"use client";

import { PARTNERS } from "@/lib/partners";

/**
 * Sepia-toned infinite logo marquee for community / partner logos.
 * Data lives in `src/lib/partners.js`; images in `public/partners/`.
 * Renders nothing when the list is empty (no layout shift). Pure-CSS scroll
 * (see `.hp-marquee-track` in globals.css) — pauses on hover, honours
 * prefers-reduced-motion.
 */
export default function PartnerMarquee({ duration = 38 }) {
  if (!PARTNERS.length) return null;

  // Two copies back-to-back so the -50% translate loops seamlessly.
  const loop = [...PARTNERS, ...PARTNERS];

  return (
    <div
      className="hp-marquee hp-marquee-mask relative w-full max-w-3xl overflow-hidden py-2"
      aria-label="Community partners"
    >
      <div
        className="hp-marquee-track items-center gap-5 sm:gap-7"
        style={{ "--hp-marquee-duration": `${duration}s` }}
      >
        {loop.map((p, i) => (
          <span
            key={`${p.src}-${i}`}
            className="flex h-14 sm:h-16 shrink-0 items-center justify-center rounded-2xl px-6 sm:px-8"
            style={{
              // Dark-cyan neumorphism — surface sits just above the midnight bg,
              // a hard dark shadow bottom-right + a faint cyan highlight top-left
              // give the raised 3D feel.
              background: "linear-gradient(145deg, #1b2f37, #122027)",
              boxShadow:
                "7px 7px 16px rgba(0,0,0,0.6), -6px -6px 14px rgba(102,252,241,0.07), inset 1px 1px 1px rgba(102,252,241,0.10), inset -2px -2px 4px rgba(0,0,0,0.45)",
            }}
          >
            <img
              src={p.src}
              alt={i < PARTNERS.length ? p.alt : ""}
              aria-hidden={i >= PARTNERS.length ? "true" : undefined}
              loading="lazy"
              decoding="async"
              draggable={false}
              className={`w-auto object-contain opacity-95 transition duration-300 hover:opacity-100 ${
                p.scale ? "" : "h-6 sm:h-8"
              }`}
              style={{
                filter: `${p.invert ? "invert(1) " : ""}drop-shadow(0 1px 2px rgba(0,0,0,0.55))`,
                height: p.scale ? `${(2 * p.scale).toFixed(2)}rem` : undefined,
              }}
            />
          </span>
        ))}
      </div>
    </div>
  );
}
