"use client";

import { useEffect, useRef } from "react";
import { loadRough } from "@/lib/loadRough";
import Image from "next/image";
import RoughFrame from "./RoughFrame";
import RoughButton from "./RoughButton";
import RoughTicks from "./RoughTicks";

// Official Google Maps deep-link to the venue.
const VENUE_MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=JIS+University+Agarpara+Kolkata";

/**
 * Marauder's-Map-style venue card under the hero. A sketched hat marks the
 * start and a sketched sword marks the venue, joined by a dotted route — a
 * little quest leading to JIS University.
 */
export default function LocationMap() {
  const compassRef = useRef(null);
  const hatRef = useRef(null);
  const swordRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const rough = await loadRough();
      if (cancelled) return;
      const gold = { stroke: "#D4AF37", strokeWidth: 1.4, roughness: 1.8, bowing: 1.6 };

      // Compass rose.
      if (compassRef.current) {
        compassRef.current.innerHTML = "";
        const rc = rough.svg(compassRef.current);
        compassRef.current.appendChild(rc.circle(60, 60, 100, { ...gold, seed: 19 }));
        compassRef.current.appendChild(rc.circle(60, 60, 60, { ...gold, seed: 22 }));
        compassRef.current.appendChild(rc.line(60, 8, 60, 112, { ...gold, seed: 31 }));
        compassRef.current.appendChild(rc.line(8, 60, 112, 60, { ...gold, seed: 32 }));
        compassRef.current.appendChild(rc.line(20, 20, 100, 100, { ...gold, stroke: "#66FCF1", strokeWidth: 0.8, seed: 33 }));
        compassRef.current.appendChild(rc.line(100, 20, 20, 100, { ...gold, stroke: "#66FCF1", strokeWidth: 0.8, seed: 34 }));
        compassRef.current.appendChild(rc.polygon([[60, 8], [55, 22], [65, 22]], { ...gold, fill: "#D4AF37", fillStyle: "solid", seed: 41 }));
      }

      // Sorting hat (start marker).
      if (hatRef.current) {
        hatRef.current.innerHTML = "";
        const rc = rough.svg(hatRef.current);
        const c = { ...gold, stroke: "#66FCF1", roughness: 2.1 };
        hatRef.current.appendChild(rc.path("M 22 78 Q 44 36 58 16 Q 60 44 72 60 Q 80 70 92 78", c));
        hatRef.current.appendChild(rc.ellipse(58, 82, 86, 20, { ...c, seed: 12 }));
        hatRef.current.appendChild(rc.line(36, 74, 78, 70, { ...c, strokeWidth: 1, seed: 7 }));
      }

      // Sword (venue marker).
      if (swordRef.current) {
        swordRef.current.innerHTML = "";
        const rc = rough.svg(swordRef.current);
        const c = { ...gold, roughness: 1.6 };
        swordRef.current.appendChild(rc.polygon([[60, 8], [54, 22], [66, 22]], { ...c, fill: "#D4AF37", fillStyle: "solid", seed: 3 }));
        swordRef.current.appendChild(rc.line(60, 18, 60, 84, { ...c, strokeWidth: 2.2, seed: 5 }));
        swordRef.current.appendChild(rc.line(40, 84, 80, 84, { ...c, strokeWidth: 2, seed: 9 }));
        swordRef.current.appendChild(rc.line(60, 84, 60, 102, { ...c, strokeWidth: 2, seed: 11 }));
        swordRef.current.appendChild(rc.circle(60, 106, 12, { ...c, seed: 13 }));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex w-full flex-col items-center gap-8">
      {/* Header (outside the frame): compass + address */}
      <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
        <svg
          ref={compassRef}
          viewBox="0 0 120 120"
          className="h-20 w-20 shrink-0 hp-float"
          style={{ animationDuration: "9s" }}
          aria-hidden="true"
        />
        <div>
          <div className="font-wizard text-cyan-hp/70 uppercase tracking-[0.3em] text-[10px]">
            You are summoned to
          </div>
          <div className="font-display text-3xl sm:text-4xl text-silver-hp leading-tight mt-1 hp-glow">
            JIS University
          </div>
          <div className="font-wizard text-silver-hp/70 text-sm">Agarpara · Kolkata</div>
        </div>
      </div>

      {/* The quest trail (outside the frame): hat → dotted route → sword */}
      <div className="flex items-center justify-center gap-3 sm:gap-5">
        <svg ref={hatRef} viewBox="0 0 120 100" className="h-16 w-20 shrink-0 hp-float" style={{ animationDuration: "7s" }} aria-hidden="true" />
        <svg viewBox="0 0 320 30" className="w-40 sm:w-72 h-7" aria-hidden="true">
          <path d="M 4 15 C 60 0, 110 30, 160 15 S 280 30, 316 15" stroke="#66FCF1" strokeWidth="1.2" fill="none" strokeDasharray="2 6" opacity="0.7" />
          <circle cx="4" cy="15" r="3" fill="#66FCF1" />
          <g>
            <circle cx="316" cy="15" r="4" fill="#D4AF37" />
            <circle cx="316" cy="15" r="8" fill="none" stroke="#D4AF37" strokeWidth="0.8" opacity="0.6">
              <animate attributeName="r" values="6;12;6" dur="2.4s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.6;0;0.6" dur="2.4s" repeatCount="indefinite" />
            </circle>
          </g>
        </svg>
        <svg ref={swordRef} viewBox="0 0 120 120" className="h-20 w-14 shrink-0 hp-float" style={{ animationDuration: "8s" }} aria-hidden="true" />
      </div>

      {/* Only the map lives inside the frame */}
      <RoughFrame
        seed={11}
        stroke="#C5C6C7"
        strokeWidth={1.4}
        roughness={1.4}
        bowing={1.0}
        padding={14}
        className="w-full bg-slate-hp/30 backdrop-blur-sm"
        inner="block"
      >
        <div className="relative w-full aspect-21/9 sm:aspect-21/8 overflow-hidden rounded-sm bg-midnight/70 flex items-center justify-center">
          <Image
            src="/banners/hexafalls_map.webp"
            alt="HexaFalls map — JIS University, Agarpara, Kolkata"
            fill
            sizes="(max-width: 768px) 100vw, 80vw"
            className="object-cover"
            style={{ filter: "saturate(0.85) brightness(0.97) contrast(1.04)" }}
            draggable={false}
          />
          <div className="absolute inset-0 hp-stars opacity-15 mix-blend-screen pointer-events-none" />
          <RoughTicks color="#D4AF37" arm={9} inset={16} seed={43} />
          <span className="absolute top-2 left-2 text-[10px] font-wizard text-gold-hp/60 tracking-widest">N · ✦</span>
          <span className="absolute bottom-2 right-2 text-[10px] font-wizard text-cyan-hp/50 tracking-widest">S · ✦</span>
        </div>
      </RoughFrame>

      {/* Location button + quote (outside the frame) */}
      <RoughButton
        as="a"
        href={VENUE_MAPS_URL}
        target="_blank"
        rel="noopener noreferrer"
        color="#D4AF37"
        glow="rgba(212,175,55,0.35)"
        fill={false}
        shimmer
        seed={27}
        className="px-9 sm:px-11 py-3.5 leading-none text-[12px] sm:text-[13px] tracking-[0.35em]"
      >
        SHOW THE LOCATION ↗
      </RoughButton>

      <div className="font-wizard text-[11px] text-silver-hp/50 italic text-center -mt-2">
        “I solemnly swear that I am up to no good.”
      </div>
    </div>
  );
}
