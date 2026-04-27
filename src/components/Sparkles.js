"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

// Lightweight floating sparks layer — reuses theme cyan/gold.
// Deterministic positions so SSR & client match (no hydration mismatch).
export default function Sparkles({ count = 24 }) {
  const sparks = useMemo(() => {
    const seeded = (i) => {
      // simple deterministic pseudo-random
      const s = Math.sin(i * 9301 + 49297) * 233280;
      return s - Math.floor(s);
    };
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left:  seeded(i + 1) * 100,
      top:   seeded(i + 2) * 100,
      size:  1 + seeded(i + 3) * 2.5,
      delay: seeded(i + 4) * 6,
      dur:   4 + seeded(i + 5) * 6,
      gold:  seeded(i + 6) > 0.78,
    }));
  }, [count]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {sparks.map((s) => (
        <motion.span
          key={s.id}
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: [0, 1, 0], y: [-6, -28, -6] }}
          transition={{
            duration: s.dur,
            delay: s.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            left: `${s.left}%`,
            top:  `${s.top}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            backgroundColor: s.gold ? "var(--hx-gold)" : "var(--hx-cyan)",
            boxShadow: s.gold
              ? "0 0 12px rgba(212,175,55,.7)"
              : "0 0 12px rgba(102,252,241,.8)",
          }}
          className="absolute rounded-full"
        />
      ))}
    </div>
  );
}
