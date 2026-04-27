"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Hand-sketched rectangle/border drawn with rough.js into an SVG.
 * Renders client-side after mount; SSR shows the children inside a plain frame
 * so layout is stable. Seeded for deterministic strokes.
 */
export default function RoughFrame({
  children,
  seed = 7,
  stroke = "#66FCF1",
  strokeWidth = 1.6,
  fill,
  fillStyle = "hachure",
  hachureGap = 8,
  roughness = 1.6,
  bowing = 1.2,
  padding = 18,
  radius = 0,        // visual rounding via inset
  className = "",
  inner = "",        // class for the inner content wrapper
  as: Tag = "div",
}) {
  const wrapRef = useRef(null);
  const svgRef  = useRef(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  // Observe size so the sketch reflows with content.
  useEffect(() => {
    if (!wrapRef.current) return;
    const ro = new ResizeObserver((entries) => {
      const r = entries[0].contentRect;
      setSize({ w: Math.round(r.width), h: Math.round(r.height) });
    });
    ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, []);

  // Re-draw whenever size or props change.
  useEffect(() => {
    if (!svgRef.current || !size.w || !size.h) return;
    let cancelled = false;
    (async () => {
      const rough = (await import("roughjs/bin/rough")).default;
      if (cancelled || !svgRef.current) return;
      // wipe previous
      svgRef.current.innerHTML = "";
      const rc = rough.svg(svgRef.current);
      const inset = 2 + radius;
      const node = rc.rectangle(
        inset,
        inset,
        Math.max(1, size.w - inset * 2),
        Math.max(1, size.h - inset * 2),
        {
          stroke,
          strokeWidth,
          roughness,
          bowing,
          seed,
          fill,
          fillStyle,
          hachureGap,
          fillWeight: 1,
        }
      );
      svgRef.current.appendChild(node);
    })();
    return () => { cancelled = true; };
  }, [size.w, size.h, seed, stroke, strokeWidth, fill, fillStyle, hachureGap, roughness, bowing, radius]);

  return (
    <Tag ref={wrapRef} className={`relative ${className}`}>
      <svg
        ref={svgRef}
        className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
        aria-hidden="true"
      />
      <div className={`relative`} style={{ padding }}>
        <div className={inner}>{children}</div>
      </div>
    </Tag>
  );
}
