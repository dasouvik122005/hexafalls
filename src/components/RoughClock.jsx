"use client";

import { useEffect, useRef } from "react";
import { loadRough } from "@/lib/loadRough";

/**
 * Hand-sketched clock — used on "coming soon" event pages.
 *
 *   <RoughClock size={150} color="#66FCF1" />
 */
export default function RoughClock({ size = 150, color = "#66FCF1", className = "", style }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    let cancelled = false;
    (async () => {
      const rough = await loadRough();
      if (cancelled || !ref.current) return;
      ref.current.innerHTML = "";
      const rc = rough.svg(ref.current);
      const cx = size / 2;
      const cy = size / 2;
      const r = size * 0.4;
      const opts = { stroke: color, strokeWidth: 1.6, roughness: 1.8, bowing: 1.3 };

      // Face + inner ring.
      ref.current.appendChild(rc.circle(cx, cy, r * 2, { ...opts, seed: 7 }));
      ref.current.appendChild(rc.circle(cx, cy, r * 2 * 0.9, { ...opts, strokeWidth: 0.8, roughness: 2.2, seed: 9 }));

      // 12 / 3 / 6 / 9 tick marks.
      [
        [cx, cy - r, cx, cy - r * 0.82],
        [cx + r, cy, cx + r * 0.82, cy],
        [cx, cy + r, cx, cy + r * 0.82],
        [cx - r, cy, cx - r * 0.82, cy],
      ].forEach(([x1, y1, x2, y2], i) =>
        ref.current.appendChild(rc.line(x1, y1, x2, y2, { ...opts, strokeWidth: 1.4, seed: 11 + i })),
      );

      // Hands (hour up, minute to ~2 o'clock) + hub.
      ref.current.appendChild(rc.line(cx, cy, cx, cy - r * 0.55, { ...opts, strokeWidth: 2, seed: 21 }));
      ref.current.appendChild(rc.line(cx, cy, cx + r * 0.5, cy - r * 0.18, { ...opts, strokeWidth: 1.6, seed: 23 }));
      ref.current.appendChild(rc.circle(cx, cy, 7, { ...opts, fill: color, fillStyle: "solid", seed: 25 }));
    })();
    return () => {
      cancelled = true;
    };
  }, [size, color]);

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
      className={`overflow-visible ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
}
