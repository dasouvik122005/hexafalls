"use client";

import { useEffect, useRef, useState } from "react";
import { loadRough } from "@/lib/loadRough";

/**
 * Two short diagonal "washi tape" strips, one at the top-left and one at the
 * top-right, drawn with hachure fill so it reads like coloured masking tape
 * holding a photo down on a scrapbook page.
 */
export default function RoughTape({
  color = "#D4AF37",
  width = 84,
  height = 18,
  rotation = 16,            // tilt in degrees
  inset = -10,              // poke past the edge a touch
  strokeWidth = 1.2,
  roughness = 1.4,
  bowing = 1.0,
  seed = 7,
  fillStyle = "hachure",
  hachureGap = 3.5,
  hachureAngle = -45,
  className = "",
}) {
  const wrapRef = useRef(null);
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!wrapRef.current) return;
    setReady(true);  // wrapper exists; svg refs are set
  }, []);

  useEffect(() => {
    if (!ready || !leftRef.current || !rightRef.current) return;
    let cancelled = false;
    (async () => {
      const rough = await loadRough();
      if (cancelled) return;
      [leftRef, rightRef].forEach((r, idx) => {
        if (!r.current) return;
        r.current.innerHTML = "";
        const rc = rough.svg(r.current);
        const node = rc.rectangle(2, 2, width - 4, height - 4, {
          stroke:        color,
          strokeWidth,
          roughness,
          bowing,
          seed:          seed + idx * 13,
          fill:          `${color}55`,
          fillStyle,
          fillWeight:    0.9,
          hachureGap,
          hachureAngle,
        });
        r.current.appendChild(node);
      });
    })();
    return () => { cancelled = true; };
  }, [ready, color, width, height, strokeWidth, roughness, bowing, seed, fillStyle, hachureGap, hachureAngle]);

  return (
    <span
      ref={wrapRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 ${className}`}
    >
      <svg
        ref={leftRef}
        width={width}
        height={height}
        className="absolute overflow-visible"
        style={{
          top:       inset,
          left:      inset,
          transform: `rotate(-${rotation}deg)`,
          filter:    `drop-shadow(0 2px 4px rgba(0,0,0,0.35))`,
        }}
      />
      <svg
        ref={rightRef}
        width={width}
        height={height}
        className="absolute overflow-visible"
        style={{
          top:       inset,
          right:     inset,
          transform: `rotate(${rotation}deg)`,
          filter:    `drop-shadow(0 2px 4px rgba(0,0,0,0.35))`,
        }}
      />
    </span>
  );
}
