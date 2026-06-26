"use client";

import { useEffect, useRef } from "react";
import { loadRough } from "@/lib/loadRough";

/**
 * Hand-sketched horizontal divider — two squiggly curves with an optional
 * ornament (rune / glyph / text) sitting in the gap between them.
 *
 *   <RoughDivider color="#D4AF37" ornament="✦" width={420} />
 *
 * For an in-eyebrow mini-line, just shrink it: <RoughDivider width={48} />.
 */
export default function RoughDivider({
  width = 320,
  height = 32,
  color = "#C5C6C7",
  strokeWidth = 1.2,
  roughness = 2.0,
  bowing = 1.6,
  seed = 7,
  segments = 14,
  amplitude = 3,
  ornament,
  ornamentSize = "1.25rem",
  className = "",
}) {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!svgRef.current) return;
    let cancelled = false;
    (async () => {
      const rough = await loadRough();
      if (cancelled || !svgRef.current) return;
      svgRef.current.innerHTML = "";
      const rc = rough.svg(svgRef.current);

      const gap     = ornament ? Math.min(60, width * 0.22) : 0;
      const halfLen = (width - gap) / 2;
      const cy      = height / 2;

      const buildPoints = (xOffset) => {
        const pts = [];
        for (let i = 0; i <= segments; i++) {
          const t = i / segments;
          const x = xOffset + t * halfLen;
          // gentle sine wobble that fades out toward the centre/edge
          const fade = Math.sin(t * Math.PI);
          const y = cy + Math.sin(i * 0.85) * amplitude * fade;
          pts.push([x, y]);
        }
        return pts;
      };

      const left  = rc.curve(buildPoints(0), {
        stroke: color, strokeWidth, roughness, bowing, seed,
      });
      const right = rc.curve(buildPoints(halfLen + gap), {
        stroke: color, strokeWidth, roughness, bowing, seed: seed + 13,
      });
      svgRef.current.appendChild(left);
      svgRef.current.appendChild(right);
    })();
    return () => { cancelled = true; };
  }, [width, height, color, strokeWidth, roughness, bowing, seed, segments, amplitude, ornament]);

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width, height }}
      aria-hidden="true"
    >
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="overflow-visible"
      />
      {ornament && (
        <span
          className="absolute font-wizard select-none"
          style={{
            color,
            fontSize: ornamentSize,
            textShadow: `0 0 8px ${color}33`,
          }}
        >
          {ornament}
        </span>
      )}
    </div>
  );
}
