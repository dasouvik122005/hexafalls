"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import RoughFrame from "./RoughFrame";

/**
 * Marauder's-Map-style location card. Sketched compass + dotted route
 * + label. Drop your AI-generated map at /public/map-placeholder.png.
 */
export default function LocationMap() {
  const compassRef = useRef(null);

  useEffect(() => {
    if (!compassRef.current) return;
    let cancelled = false;
    (async () => {
      const rough = (await import("roughjs/bin/rough")).default;
      if (cancelled || !compassRef.current) return;
      compassRef.current.innerHTML = "";
      const rc = rough.svg(compassRef.current);
      const opts = {
        stroke: "#D4AF37",
        strokeWidth: 1.4,
        roughness: 1.8,
        bowing: 1.6,
        seed: 19,
      };
      // outer & inner circle
      compassRef.current.appendChild(rc.circle(60, 60, 100, opts));
      compassRef.current.appendChild(rc.circle(60, 60, 60, { ...opts, seed: 22 }));
      // cardinal lines (N S E W)
      compassRef.current.appendChild(rc.line(60, 8,  60, 112, { ...opts, seed: 31 }));
      compassRef.current.appendChild(rc.line(8,  60, 112, 60, { ...opts, seed: 32 }));
      // diagonals (lighter)
      compassRef.current.appendChild(
        rc.line(20, 20, 100, 100, { ...opts, stroke: "#66FCF1", strokeWidth: 0.8, seed: 33 })
      );
      compassRef.current.appendChild(
        rc.line(100, 20, 20, 100, { ...opts, stroke: "#66FCF1", strokeWidth: 0.8, seed: 34 })
      );
      // arrow N
      compassRef.current.appendChild(
        rc.polygon([[60, 8],[55, 22],[65, 22]], { ...opts, fill: "#D4AF37", fillStyle: "solid", seed: 41 })
      );
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <RoughFrame
      seed={11}
      stroke="#C5C6C7"
      strokeWidth={1.4}
      roughness={1.4}
      bowing={1.0}
      padding={22}
      className="w-full max-w-md mx-auto bg-slate-hp/40 backdrop-blur-sm"
      inner="flex flex-col items-center gap-4"
    >
      {/* compass */}
      <div className="flex items-center gap-4 self-stretch">
        <svg
          ref={compassRef}
          viewBox="0 0 120 120"
          className="h-20 w-20 shrink-0 hp-float"
          style={{ animationDuration: "9s" }}
          aria-hidden="true"
        />
        <div className="flex-1">
          <div className="font-[family-name:var(--font-wizard)] text-cyan-hp/70 uppercase tracking-[0.3em] text-[10px]">
            You are summoned to
          </div>
          <div className="font-[family-name:var(--font-display)] text-xl text-silver-hp leading-tight mt-1">
            JIS University
          </div>
          <div className="font-[family-name:var(--font-wizard)] text-silver-hp/70 text-sm">
            Agarpara · Kolkata
          </div>
        </div>
      </div>

      {/* dotted route */}
      <svg viewBox="0 0 320 30" className="w-full h-6" aria-hidden="true">
        <path
          d="M 4 15 C 60 0, 110 30, 160 15 S 280 30, 316 15"
          stroke="#66FCF1"
          strokeWidth="1.2"
          fill="none"
          strokeDasharray="2 6"
          opacity="0.7"
        />
        {/* start pin */}
        <circle cx="4" cy="15" r="3" fill="#C5C6C7" />
        {/* end pin */}
        <g>
          <circle cx="316" cy="15" r="4" fill="#D4AF37" />
          <circle cx="316" cy="15" r="8" fill="none" stroke="#D4AF37" strokeWidth="0.8" opacity="0.6">
            <animate attributeName="r" values="6;12;6" dur="2.4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.6;0;0.6" dur="2.4s" repeatCount="indefinite" />
          </circle>
        </g>
      </svg>

      {/* map placeholder slot */}
      <div className="relative w-full aspect-[16/7] overflow-hidden rounded-sm border border-silver-hp/15 bg-midnight/60">
        {/* TODO: replace with <Image src="/map-placeholder.png" .../> */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-[family-name:var(--font-wizard)] text-silver-hp/40 text-xs uppercase tracking-[0.4em]">
            map · placeholder
          </span>
        </div>
        <div className="absolute inset-0 hp-stars opacity-30 mix-blend-screen" />
      </div>

      <div className="font-[family-name:var(--font-wizard)] text-[11px] text-silver-hp/50 italic">
        “I solemnly swear that I am up to no good.”
      </div>
    </RoughFrame>
  );
}
