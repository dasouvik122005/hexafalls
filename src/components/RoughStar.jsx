"use client";

import { useEffect, useRef } from "react";
import { loadRough } from "@/lib/loadRough";

/**
 * Hand-sketched star — drop it as a floating decoration.
 *
 *   <RoughStar size={28} color="#D4AF37" fill />
 */
export default function RoughStar({
  size = 32,
  points = 5,
  color = "#D4AF37",
  fill = false,
  strokeWidth = 1.3,
  roughness = 1.6,
  bowing = 1.2,
  seed = 11,
  innerRatio = 0.42,    // ratio of inner radius to outer
  className = "",
  style,
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

      const cx = size / 2;
      const cy = size / 2;
      const r1 = size * 0.46;
      const r2 = r1 * innerRatio;
      const verts = [];
      for (let i = 0; i < points * 2; i++) {
        const r = i % 2 === 0 ? r1 : r2;
        const angle = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
        verts.push([cx + Math.cos(angle) * r, cy + Math.sin(angle) * r]);
      }

      const node = rc.polygon(verts, {
        stroke: color,
        strokeWidth,
        roughness,
        bowing,
        seed,
        fill: fill ? `${color}55` : undefined,
        fillStyle: "hachure",
        fillWeight: 1.0,
        hachureGap: 4,
      });
      svgRef.current.appendChild(node);
    })();
    return () => { cancelled = true; };
  }, [size, points, color, fill, strokeWidth, roughness, bowing, seed, innerRatio]);

  return (
    <svg
      ref={svgRef}
      width={size}
      height={size}
      className={`overflow-visible pointer-events-none ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
}
