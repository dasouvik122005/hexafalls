"use client";

import { useEffect, useRef, useState } from "react";
import { loadRough } from "@/lib/loadRough";

/**
 * Cartography-style cross marks at each corner — two short crossed strokes,
 * like the registration ticks on a hand-drawn map. Use for map / chart
 * holders where the "old-paper survey" feel is right.
 */
export default function RoughTicks({
  color = "#C5C6C7",
  arm = 10,
  inset = 14,
  strokeWidth = 1.3,
  roughness = 1.6,
  bowing = 1.2,
  seed = 7,
  className = "",
}) {
  const wrapRef = useRef(null);
  const svgRef  = useRef(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    if (!wrapRef.current) return;
    const el = wrapRef.current;
    const measure = () => setSize({ w: el.offsetWidth, h: el.offsetHeight });
    measure();
    let rafId = 0;
    const ro = new ResizeObserver(() => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => { rafId = 0; measure(); });
    });
    ro.observe(el);
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!svgRef.current || !size.w || !size.h) return;
    let cancelled = false;
    (async () => {
      const rough = await loadRough();
      if (cancelled || !svgRef.current) return;
      svgRef.current.innerHTML = "";
      const rc = rough.svg(svgRef.current);
      const opts = { stroke: color, strokeWidth, roughness, bowing };

      const cross = (cx, cy, s) => {
        svgRef.current.appendChild(rc.line(cx - arm, cy, cx + arm, cy, { ...opts, seed: s     }));
        svgRef.current.appendChild(rc.line(cx, cy - arm, cx, cy + arm, { ...opts, seed: s + 1 }));
      };

      cross(inset,             inset,             seed);
      cross(size.w - inset,    inset,             seed + 11);
      cross(size.w - inset,    size.h - inset,    seed + 23);
      cross(inset,             size.h - inset,    seed + 37);
    })();
    return () => { cancelled = true; };
  }, [size.w, size.h, color, arm, inset, strokeWidth, roughness, bowing, seed]);

  return (
    <span
      ref={wrapRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 ${className}`}
    >
      <svg
        ref={svgRef}
        width={size.w || undefined}
        height={size.h || undefined}
        className="absolute left-0 top-0 overflow-visible"
      />
    </span>
  );
}
