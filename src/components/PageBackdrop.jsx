// Shared page background — the matte "spellbook" backdrop used on every route
// EXCEPT the landing hero (which keeps its cinematic video). Mirrors the /brand
// page: midnight base (from <body>) + animated star field + radial scrim +
// floating sparks + scattered hand-drawn rough-star artifacts.
//
// Performance / device optimization:
//   - hp-stars + hp-scrim are pure CSS (cheap on every device).
//   - Sparkles render deterministically (SSR-safe, no per-frame JS).
//   - Extra artifacts + a second sparkle field are wrapped in `hidden md:block`
//     / `hidden lg:block`, so on small screens they're `display:none` — the
//     browser never paints or animates them (a real cost saving on mobile).
//   - All motion (hp-float / hp-spark) is gated by prefers-reduced-motion in
//     globals.css, so reduced-motion users get a still backdrop automatically.

import Sparkles from "./Sparkles";
import RoughStar from "./RoughStar";

// Scattered floating runes. `tier` controls when each appears:
//   base → all devices · md → tablets+ · lg → desktops only.
const ARTIFACTS = [
  { size: 20, color: "#D4AF37", seed: 101, pos: "top-24 left-6",        dur: "11s", delay: "0s",   tier: "base" },
  { size: 24, color: "#66FCF1", seed: 105, pos: "top-40 right-8",       dur: "13s", delay: "1s",   tier: "base" },
  { size: 14, color: "#A78BFA", seed: 109, pos: "bottom-28 left-10",    dur: "12s", delay: "2s",   tier: "base" },
  { size: 22, color: "#66FCF1", seed: 113, pos: "top-1/3 left-1/4",     dur: "14s", delay: "0.5s", tier: "md" },
  { size: 18, color: "#D4AF37", seed: 117, pos: "bottom-24 right-1/4",  dur: "12s", delay: "1.5s", tier: "md" },
  { size: 12, color: "#A78BFA", seed: 121, pos: "top-1/2 right-12",     dur: "15s", delay: "0.8s", tier: "md" },
  { size: 16, color: "#66FCF1", seed: 125, pos: "bottom-1/3 left-1/3",  dur: "13s", delay: "2.5s", tier: "lg" },
  { size: 14, color: "#D4AF37", seed: 129, pos: "top-1/4 right-1/3",    dur: "16s", delay: "1.2s", tier: "lg" },
];

const TIER_CLASS = { base: "", md: "hidden md:block", lg: "hidden lg:block" };

export default function PageBackdrop({ sparkles = true, artifacts = true }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-30 overflow-hidden"
    >
      <div className="absolute inset-0 hp-stars" />
      <div className="absolute inset-0 hp-scrim" />

      {sparkles && (
        <>
          {/* base field — every device */}
          <Sparkles count={10} />
          {/* extra field — desktops only (display:none on mobile = no paint) */}
          <div className="absolute inset-0 hidden md:block">
            <Sparkles count={14} seedOffset={50} />
          </div>
        </>
      )}

      {artifacts &&
        ARTIFACTS.map((a, i) => (
          <RoughStar
            key={i}
            size={a.size}
            color={a.color}
            seed={a.seed}
            className={`absolute hp-float opacity-50 ${a.pos} ${TIER_CLASS[a.tier]}`}
            style={{ animationDuration: a.dur, animationDelay: a.delay }}
          />
        ))}
    </div>
  );
}
