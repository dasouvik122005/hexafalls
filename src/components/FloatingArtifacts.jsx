"use client";

import RoughStar from "./RoughStar";

// Deterministic scatter (SSR-safe, no hydration mismatch).
const seeded = (i) => {
  const s = Math.sin(i * 9301 + 49297) * 233280;
  return s - Math.floor(s);
};

const PALETTE = ["#66FCF1", "#D4AF37", "#A78BFA"];
const RUNES = [
  "ᚠ", "ᚦ", "ᚨ", "ᚱ", "ᚲ", "ᚷ", "ᚹ", "ᛁ", "ᛇ", "ᛉ", "ᛊ", "ᛏ", "ᛒ", "ᛗ",
  "✦", "✧", "✶", "❖", "☆", "⚝",
];

/**
 * Ambient scrapbook scribble layer — scattered hand-drawn stars + faint runic
 * glyphs that drift, to fill the empty margins of a section. Purely decorative,
 * sits behind content, honours prefers-reduced-motion (via `.hp-float`).
 *
 *   <section className="relative isolate overflow-hidden ...">
 *     <FloatingArtifacts stars={12} runes={10} seed={5} />
 *     ...content...
 *   </section>
 */
export default function FloatingArtifacts({
  stars = 10,
  runes = 8,
  seed = 0,
  className = "",
}) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden ${className}`}
    >
      {Array.from({ length: stars }).map((_, i) => {
        const r = (n) => seeded(seed * 1000 + i * 7 + n);
        const color = PALETTE[Math.floor(r(4) * PALETTE.length)];
        return (
          <RoughStar
            key={`s${i}`}
            size={Math.round(12 + r(1) * 26)}
            color={color}
            fill={r(5) > 0.6}
            seed={Math.floor((seed + i) * 13) % 200}
            className="absolute hp-float"
            style={{
              left: `${(r(2) * 96 + 2).toFixed(2)}%`,
              top: `${(r(3) * 92 + 4).toFixed(2)}%`,
              opacity: 0.22 + r(8) * 0.4,
              animationDuration: `${(8 + r(6) * 8).toFixed(1)}s`,
              animationDelay: `${(r(7) * 4).toFixed(1)}s`,
            }}
          />
        );
      })}
      {Array.from({ length: runes }).map((_, i) => {
        const r = (n) => seeded(seed * 1000 + 500 + i * 5 + n);
        const color = PALETTE[Math.floor(r(3) * PALETTE.length)];
        const glyph = RUNES[Math.floor(r(4) * RUNES.length)];
        return (
          <span
            key={`r${i}`}
            className="absolute font-wizard select-none hp-float"
            style={{
              left: `${(r(1) * 96 + 2).toFixed(2)}%`,
              top: `${(r(2) * 92 + 4).toFixed(2)}%`,
              color,
              fontSize: `${(14 + r(5) * 22).toFixed(0)}px`,
              opacity: 0.1 + r(7) * 0.18,
              textShadow: `0 0 10px ${color}55`,
              animationDuration: `${(9 + r(6) * 9).toFixed(1)}s`,
            }}
          >
            {glyph}
          </span>
        );
      })}
    </div>
  );
}
