"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Hand-sketched rectangle/border drawn with rough.js into an SVG.
 *
 * The rough strokes themselves never get filter/transform animations applied
 * to them (those are catastrophically slow on multi-path SVGs). Instead, the
 * SVG sits inside a plain `<div>` wrapper that fades in via cheap GPU-friendly
 * opacity + translateY when rough finishes drawing. Children render as soon as
 * SSR returns, so layout never shifts.
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
  radius = 0,
  className = "",
  inner = "",
  as: Tag = "div",
  mist = true,
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

      // Double-RAF so the browser commits the appended-but-still-hidden SVG
      // before flipping `drawn` — otherwise the opacity transition snaps.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (!cancelled) setDrawn(true);
        });
      });
    })();
    return () => { cancelled = true; };
  }, [size.w, size.h, seed, stroke, strokeWidth, fill, fillStyle, hachureGap, roughness, bowing, radius]);

  return (
    <Tag
      ref={wrapRef}
      className={`relative ${className}`}
      style={{ overflow: "visible" }}
    >
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

      {/*
        Wrapper div that owns the sketch reveal animation. We never apply
        filter / transform to the SVG itself — opacity + translateY on a plain
        div is GPU-cheap; filter:blur on a multi-path SVG is the opposite.
      */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: drawn ? 1 : 0,
          transform: drawn ? "translateY(0)" : "translateY(6px)",
          transition: "opacity 600ms ease-out, transform 600ms ease-out",
          willChange: "opacity, transform",
        }}
      >
        <svg
          ref={svgRef}
          className="absolute inset-0 h-full w-full overflow-visible"
        />
      </div>

      <div className="relative" style={{ padding }}>
        <div className={inner}>{children}</div>
      </div>
    </Tag>
  );
}
