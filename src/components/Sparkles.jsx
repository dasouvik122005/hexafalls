// Floating sparks layer — pure CSS animation on the compositor thread.
// No framer-motion, no useEffect, no per-frame JS. Deterministic positions
// so SSR & client match (no hydration mismatch). Honours prefers-reduced-
// motion via the `hp-spark` keyframe gating in globals.css.
export default function Sparkles({ count = 24 }) {
  const seeded = (i) => {
    const s = Math.sin(i * 9301 + 49297) * 233280;
    return s - Math.floor(s);
  };
  const sparks = Array.from({ length: count }, (_, i) => ({
    id: i,
    left: seeded(i + 1) * 100,
    top: seeded(i + 2) * 100,
    size: 1 + seeded(i + 3) * 2.5,
    delay: seeded(i + 4) * 6,
    dur: 4 + seeded(i + 5) * 6,
    gold: seeded(i + 6) > 0.78,
  }));

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {sparks.map((s) => (
        <span
          key={s.id}
          className="hp-spark absolute rounded-full"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            backgroundColor: s.gold ? "var(--hx-gold)" : "var(--hx-cyan)",
            boxShadow: s.gold
              ? "0 0 12px rgba(212,175,55,.7)"
              : "0 0 12px rgba(102,252,241,.8)",
            animationDuration: `${s.dur}s`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
