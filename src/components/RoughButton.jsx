"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { loadRough } from "@/lib/loadRough";

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
  as: asTag = "button",
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
      // Bigger inset gives rough's stroke wiggles room to breathe inside the
      // overflow-hidden wrapper so corner strokes don't get clipped.
      const inset = 4;
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
          // No fill — stroke-only outline keeps the label crisp and legible.
          fill: undefined,
        }
      );
      svgRef.current.appendChild(rect);
      requestAnimationFrame(() =>
        requestAnimationFrame(() => !cancelled && setDrawn(true))
      );
    })();
    return () => { cancelled = true; };
  }, [size.w, size.h, color, fill, seed, roughness, bowing, strokeWidth, hachureGap, hachureAngle]);

  // Resolve `as="link"` to Next's <Link> internally. This lets server
  // components pass a string (not the Link function) across the client
  // boundary — passing the function directly throws "Functions cannot be
  // passed directly to Client Components".
  const Tag = asTag === "link" ? Link : asTag;

  // `disabled` only valid on <button>; ignore on Link / <a>.
  const tagProps =
    asTag === "button"
      ? { disabled: disabled || undefined, type: rest.type || "button" }
      : {};

  return (
    <Tag
      ref={wrapRef}
      {...tagProps}
      {...rest}
      className={`group relative inline-flex items-center justify-center overflow-hidden select-none transition font-display tracking-[0.3em] ${
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
          width={size.w || undefined}
          height={size.h || undefined}
          className="absolute left-0 top-0 overflow-visible"
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
