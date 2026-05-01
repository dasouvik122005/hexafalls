"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import RoughFrame from "./RoughFrame";

/**
 * Marauder's-Map-style full-width card.
 * Unfurls top-down on scroll (clip-path + scale + blur).
 * Drop the AI map at /public/map-placeholder.png.
 */
export default function LocationMap() {
  const compassRef = useRef(null);

  // sketched compass
  useEffect(() => {
    if (!compassRef.current) return;
    let cancelled = false;
    (async () => {
      const rough = (await import("roughjs/bin/rough")).default;
      if (cancelled || !compassRef.current) return;
      compassRef.current.innerHTML = "";
      const rc = rough.svg(compassRef.current);
      const opts = { stroke: "#D4AF37", strokeWidth: 1.4, roughness: 1.8, bowing: 1.6, seed: 19 };
      compassRef.current.appendChild(rc.circle(60, 60, 100, opts));
      compassRef.current.appendChild(rc.circle(60, 60, 60, { ...opts, seed: 22 }));
      compassRef.current.appendChild(rc.line(60, 8, 60, 112, { ...opts, seed: 31 }));
      compassRef.current.appendChild(rc.line(8, 60, 112, 60, { ...opts, seed: 32 }));
      compassRef.current.appendChild(rc.line(20, 20, 100, 100, { ...opts, stroke: "#66FCF1", strokeWidth: 0.8, seed: 33 }));
      compassRef.current.appendChild(rc.line(100, 20, 20, 100, { ...opts, stroke: "#66FCF1", strokeWidth: 0.8, seed: 34 }));
      compassRef.current.appendChild(
        rc.polygon([[60, 8],[55, 22],[65, 22]], { ...opts, fill: "#D4AF37", fillStyle: "solid", seed: 41 })
      );
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <motion.div
      initial={{
        filter:  "blur(20px)",
        opacity: 0,
        y:       80,
        scale:   0.92,
      }}
      whileInView={{
        filter:  "blur(0px)",
        opacity: 1,
        y:       0,
        scale:   1,
      }}
      viewport={{ once: true, amount: 0.05 }}
      transition={{
        duration: 2.2,
        ease: [0.22, 1, 0.36, 1],
        filter:  { duration: 2.4, ease: "easeOut" },
        opacity: { duration: 2.0, ease: [0.4, 0, 0.2, 1] },
      }}
      className="w-full will-change-[transform,filter]"
    >
      <RoughFrame
        seed={11}
        stroke="#C5C6C7"
        strokeWidth={1.4}
        roughness={1.4}
        bowing={1.0}
        padding={26}
        className="w-full bg-slate-hp/40 backdrop-blur-sm"
        inner="flex flex-col gap-5"
      >
        {/* Header row: compass + address + dotted route */}
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <svg
            ref={compassRef}
            viewBox="0 0 120 120"
            className="h-20 w-20 shrink-0 hp-float"
            style={{ animationDuration: "9s" }}
            aria-hidden="true"
          />
          <div className="flex-1 text-center sm:text-left">
            <div className="font-wizard text-cyan-hp/70 uppercase tracking-[0.3em] text-[10px]">
              You are summoned to
            </div>
            <div className="font-display text-2xl sm:text-3xl text-silver-hp leading-tight mt-1">
              JIS University
            </div>
            <div className="font-wizard text-silver-hp/70 text-sm">
              Agarpara · Kolkata
            </div>
          </div>

          {/* dotted route */}
          <svg viewBox="0 0 320 30" className="hidden md:block w-72 h-6" aria-hidden="true">
            <path
              d="M 4 15 C 60 0, 110 30, 160 15 S 280 30, 316 15"
              stroke="#66FCF1" strokeWidth="1.2" fill="none"
              strokeDasharray="2 6" opacity="0.7"
            />
            <circle cx="4" cy="15" r="3" fill="#C5C6C7" />
            <g>
              <circle cx="316" cy="15" r="4" fill="#D4AF37" />
              <circle cx="316" cy="15" r="8" fill="none" stroke="#D4AF37" strokeWidth="0.8" opacity="0.6">
                <animate attributeName="r" values="6;12;6" dur="2.4s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.6;0;0.6" dur="2.4s" repeatCount="indefinite" />
              </circle>
            </g>
          </svg>
        </div>

        {/* Big map */}
        <div className="relative w-full aspect-[21/9] sm:aspect-[21/8] overflow-hidden rounded-sm bg-midnight/70 flex items-center justify-center">
          <img
            src="/banners/hexafalls_map.png"
            alt="HexaFalls map"
            className="block h-full w-full object-cover"
            style={{
              filter: "saturate(0.8) brightness(0.95) contrast(1.05)",
              WebkitMaskImage:
                "radial-gradient(ellipse at center, #000 55%, transparent 95%)",
              maskImage:
                "radial-gradient(ellipse at center, #000 55%, transparent 95%)",
            }}
            draggable={false}
          />

          {/* misty fog drifting over the map */}
          <div aria-hidden="true" className="rf-mist pointer-events-none absolute inset-0" style={{ "--mist": "#66FCF1" }}>
            <span className="rf-mist__blob rf-mist__blob--a" />
            <span className="rf-mist__blob rf-mist__blob--b" />
            <span className="rf-mist__blob rf-mist__blob--c" />
            <span className="rf-mist__blob rf-mist__blob--d" />
          </div>

          {/* edge vignette so the rectangular image dissolves into the bg */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at center, transparent 55%, rgba(11,12,16,0.55) 85%, rgba(11,12,16,0.95) 100%)",
            }}
          />

          <div className="absolute inset-0 hp-stars opacity-20 mix-blend-screen pointer-events-none" />
          <span className="absolute top-2 left-2 text-[10px] font-wizard text-gold-hp/60 tracking-widest">N · ✦</span>
          <span className="absolute bottom-2 right-2 text-[10px] font-wizard text-cyan-hp/50 tracking-widest">S · ✦</span>
        </div>

        <div className="font-wizard text-[11px] text-silver-hp/50 italic text-center">
          “I solemnly swear that I am up to no good.”
        </div>
      </RoughFrame>
    </motion.div>
  );
}
