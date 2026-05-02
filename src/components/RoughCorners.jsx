"use client";

import { useEffect, useRef, useState } from "react";
import { loadRough } from "@/lib/loadRough";

/**
 * Sketched L-shaped brackets in all four corners of the parent. Drop into any
 * `position: relative` container (image holders, banners, cards) for a
 * "taped to the page of a wizarding scrapbook" look.
 *
 *   <div className="relative ...">
 *     <RoughCorners color="#D4AF37" />
 *     <img ... />
 *   </div>
 */
export default function RoughCorners({
  color = "#C5C6C7",
  length = 22,
  inset = 6,
  strokeWidth = 1.4,
  roughness = 1.8,
  bowing = 1.4,
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

      const drawCorner = (x1, y1, x2, y2, x3, y3, s) => {
        svgRef.current.appendChild(rc.line(x1, y1, x2, y2, { ...opts, seed: s     }));
        svgRef.current.appendChild(rc.line(x2, y2, x3, y3, { ...opts, seed: s + 1 }));
      };

      const w = size.w;
      const h = size.h;

      // top-left
      drawCorner(inset, inset + length, inset, inset, inset + length, inset, seed);
      // top-right
      drawCorner(w - inset, inset + length, w - inset, inset, w - inset - length, inset, seed + 11);
      // bottom-right
      drawCorner(w - inset, h - inset - length, w - inset, h - inset, w - inset - length, h - inset, seed + 23);
      // bottom-left
      drawCorner(inset, h - inset - length, inset, h - inset, inset + length, h - inset, seed + 37);
    })();
    return () => { cancelled = true; };
  }, [size.w, size.h, color, length, inset, strokeWidth, roughness, bowing, seed]);

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
        style={{
          filter: `drop-shadow(0 0 6px ${color}55)`,
        }}
      />
    </span>
  );
}
