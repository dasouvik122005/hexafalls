"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Hand-drawn button. The rough rectangle (stroke + soft hachure fill) sits in
 * an absolute SVG layer behind the children; layout is owned by the wrapping
 * tag so SSR is stable. The SVG is wrapped in a plain div whose opacity fades
 * in on draw — no filter/transform animations on the SVG itself (perf).
 *
 *   <RoughButton color="#D4AF37" glow="rgba(212,175,55,0.30)" shimmer
 *                as="a" href="..." className="px-7 py-3 ...">
 *     SIGN THE SCROLL ↗
 *   </RoughButton>
 */
export default function RoughButton({
  children,
  as: Tag = "button",
  color = "#66FCF1",
  glow,
  fill = true,
  seed = 5,
  roughness = 1.5,
  bowing = 1.3,
  strokeWidth = 1.5,
  hachureGap = 7,
  hachureAngle = -41,
  className = "",
  style,
  shimmer = false,
  disabled = false,
  ...rest
}) {
  const wrapRef = useRef(null);
  const svgRef  = useRef(null);
  const [size, setSize]   = useState({ w: 0, h: 0 });
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    if (!wrapRef.current) return;
    const ro = new ResizeObserver(([entry]) => {
      const r = entry.contentRect;
      setSize({ w: Math.round(r.width), h: Math.round(r.height) });
    });
    ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!svgRef.current || !size.w || !size.h) return;
    let cancelled = false;
    (async () => {
      const rough = (await import("roughjs/bin/rough")).default;
      if (cancelled || !svgRef.current) return;
      svgRef.current.innerHTML = "";
      const rc = rough.svg(svgRef.current);
      const inset = 2;
      const rect = rc.rectangle(
        inset,
        inset,
        Math.max(1, size.w - inset * 2),
        Math.max(1, size.h - inset * 2),
        {
          stroke: color,
          strokeWidth,
          roughness,
          bowing,
          seed,
          // 20% alpha hachure so the fill is a soft wash, strokes stay vivid
          fill: fill ? `${color}33` : undefined,
          fillStyle: "hachure",
          fillWeight: 1.4,
          hachureGap,
          hachureAngle,
        }
      );
      svgRef.current.appendChild(rect);
      requestAnimationFrame(() =>
        requestAnimationFrame(() => !cancelled && setDrawn(true))
      );
    })();
    return () => { cancelled = true; };
  }, [size.w, size.h, color, fill, seed, roughness, bowing, strokeWidth, hachureGap, hachureAngle]);

  // `disabled` only valid on <button>; ignore on Link / <a>.
  const tagProps =
    Tag === "button"
      ? { disabled: disabled || undefined, type: rest.type || "button" }
      : {};

  return (
    <Tag
      ref={wrapRef}
      {...tagProps}
      {...rest}
      className={`group relative inline-flex items-center justify-center select-none transition font-display tracking-[0.3em] ${
        disabled ? "cursor-not-allowed opacity-90" : "cursor-pointer hover:brightness-110"
      } ${className}`}
      style={{
        color,
        textShadow: glow ? `0 0 14px ${glow}` : undefined,
        ...style,
      }}
    >
      {/* rough rect layer */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: drawn ? 1 : 0,
          transform: drawn ? "translateY(0)" : "translateY(4px)",
          transition: "opacity 450ms ease-out, transform 450ms ease-out",
          willChange: "opacity, transform",
        }}
      >
        <svg
          ref={svgRef}
          className="absolute inset-0 h-full w-full overflow-visible"
        />
      </span>

      {/* optional shimmer sweep */}
      {shimmer && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3"
          style={{
            background: `linear-gradient(90deg, transparent, ${glow || `${color}40`}, transparent)`,
            animation: "hp-shimmer 3.6s linear infinite",
          }}
        />
      )}

      <span className="relative z-10 inline-flex items-center gap-2">
        {children}
      </span>
    </Tag>
  );
}
