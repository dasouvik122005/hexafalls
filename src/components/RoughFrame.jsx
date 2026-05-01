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
  mist = true,       // soft drifting cloud halo around the frame
  mistColor = stroke,
}) {
  const wrapRef = useRef(null);
  const svgRef  = useRef(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [drawn, setDrawn] = useState(false);

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

      // Animate strokes in: fade + scale, plus stroke-dashoffset draw-on
      // for each path so the sketch feels drawn rather than popping in.
      const paths = svgRef.current.querySelectorAll("path");
      paths.forEach((p, i) => {
        try {
          const len = p.getTotalLength();
          if (!isFinite(len) || len <= 0) return;
          p.style.strokeDasharray  = `${len}`;
          p.style.strokeDashoffset = `${len}`;
          p.style.transition       = `stroke-dashoffset 900ms cubic-bezier(0.22,1,0.36,1) ${i * 60}ms, opacity 600ms ease-out ${i * 60}ms`;
          p.style.opacity          = "0";
          // next frame → trigger transition
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              p.style.strokeDashoffset = "0";
              p.style.opacity          = "1";
            });
          });
        } catch { /* ignore filled paths without length */ }
      });

      setDrawn(true);
    })();
    return () => { cancelled = true; };
  }, [size.w, size.h, seed, stroke, strokeWidth, fill, fillStyle, hachureGap, roughness, bowing, radius]);

  return (
    <Tag ref={wrapRef} className={`relative ${className}`} style={{ overflow: "visible" }}>
      {mist && (
        <div
          aria-hidden="true"
          className="rf-mist pointer-events-none absolute"
          style={{ inset: "-60px", "--mist": mistColor }}
        >
          <span className="rf-mist__blob rf-mist__blob--a" />
          <span className="rf-mist__blob rf-mist__blob--b" />
          <span className="rf-mist__blob rf-mist__blob--c" />
          <span className="rf-mist__blob rf-mist__blob--d" />
        </div>
      )}
      <svg
        ref={svgRef}
        className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
        aria-hidden="true"
        style={{
          opacity: drawn ? 1 : 0,
          transition: "opacity 600ms ease-out",
        }}
      />
      <div className="relative" style={{ padding }}>
        <div className={inner}>{children}</div>
      </div>
    </Tag>
  );
}
