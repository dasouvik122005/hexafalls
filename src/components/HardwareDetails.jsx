"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import gsap from "gsap";
import Sparkles from "./Sparkles";
import RoughButton from "./RoughButton";
import RoughDivider from "./RoughDivider";
import RoughCorners from "./RoughCorners";
import { HARDWARE_TRACKS } from "@/lib/routes";

const GOLD = "#D4AF37";
const GOLD_GLOW = "rgba(212,175,55,0.25)";

/* ── reusable section eyebrow ────────────────────────────────────────── */
function Eyebrow({ children, color = GOLD }) {
  return (
    <div className="flex items-center justify-center gap-3 text-[11px] uppercase tracking-[0.5em] font-display text-center"
         style={{ color: `${color}cc` }}>
      <RoughDivider width={48} height={20} color={color} seed={3} />
      {children}
      <RoughDivider width={48} height={20} color={color} seed={5} />
    </div>
  );
}

/* ── fade-in wrapper (opacity + y only — never blur) ─────────────────── */
function Reveal({ children, delay = 0, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.05 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── magical ribbon SVG that flows around a card ────────────────────── */
function MagicRibbon({ color, index }) {
  /* Each card gets a unique flowing path so the ribbons feel hand-drawn
     and organic rather than identical. We offset them using the index. */
  const paths = [
    // top-left swirl → along top → top-right curl
    "M -20,30 C 10,10 40,-8 100,-6 C 200,-10 350,-4 500,0 C 650,4 780,-10 820,20",
    // bottom-right swirl → along bottom → bottom-left curl  
    "M 820,250 C 790,270 760,288 700,286 C 550,290 400,284 250,280 C 100,276 30,290 -20,260",
    // left side flowing down
    "M -10,50 C -18,100 -14,160 -10,230",
    // right side flowing down
    "M 810,30 C 818,90 814,170 810,240",
  ];

  const id = `ribbon-${index}`;

  return (
    <svg
      className="pointer-events-none absolute -inset-4 w-[calc(100%+32px)] h-[calc(100%+32px)]"
      viewBox="-30 -20 860 310"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden="true"
    >
      {paths.map((d, pi) => (
        <g key={pi}>
          {/* Outer glow layer (Fake blur using thick stroke for 60FPS mobile performance) */}
          <path
            d={d}
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            opacity="0.12"
          />
          {/* Core ribbon stroke with animated dash */}
          <path
            d={d}
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.6"
            strokeDasharray="12 8 4 8"
            style={{
              animation: `ribbon-flow ${6 + pi * 1.5}s linear infinite${pi % 2 === 1 ? " reverse" : ""}`,
            }}
          />
          {/* Bright inner highlight */}
          <path
            d={d}
            stroke="#fff"
            strokeWidth="0.5"
            strokeLinecap="round"
            opacity="0.15"
            strokeDasharray="4 20"
            style={{
              animation: `ribbon-flow ${8 + pi}s linear infinite`,
            }}
          />
        </g>
      ))}

      {/* Corner ornament dots */}
      {[[-10, -4], [808, -4], [-10, 268], [808, 268]].map(([cx, cy], ci) => (
        <circle key={ci} cx={cx} cy={cy} r="3" fill={color} opacity="0.5">
          <animate attributeName="opacity" values="0.3;0.8;0.3" dur={`${2 + ci * 0.5}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </svg>
  );
}

/* ── interactive track card with realistic scroll texture ────────────── */
function TrackCard({ track: t, index: i }) {
  const cardContent = (
    <>
      <div 
        className="absolute inset-0 bg-cover bg-center rounded-xl opacity-90 transition-opacity duration-500 group-hover:opacity-100"
        style={{ backgroundImage: `url('${t.image}')` }} 
      />
      {/* Dark gradient overlay to ensure text legibility over the scroll */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent rounded-xl transition-opacity duration-500 group-hover:opacity-80" />
      
      {/* Content wrapper */}
      <div className="relative z-10 p-6 md:p-8 flex flex-col h-full justify-center w-full max-w-2xl">
        <div className="flex items-center gap-4">
          <span
            className="text-4xl md:text-5xl select-none font-wizard drop-shadow-lg"
            style={{ color: t.color }}
            aria-hidden="true"
          >
            {t.rune}
          </span>
          <h3
            className="font-display text-2xl md:text-3xl tracking-wide uppercase font-bold"
            style={{ 
              color: '#f8f4e6', 
              textShadow: `0 2px 4px rgba(0,0,0,0.9), 0 0 15px ${t.color}` 
            }}
          >
            {t.name}
          </h3>
        </div>
        
        {/* description */}
        <div className="mt-4 md:mt-6 ml-0 md:ml-16">
          <p
            className="font-wizard text-sm md:text-base leading-relaxed text-[#e8e4d6] drop-shadow-md"
            style={{ textShadow: "0 2px 5px rgba(0,0,0,1)" }}
          >
            {t.desc}
          </p>
        </div>

        {t.slug && (
          <div className="mt-6 md:mt-8 ml-0 md:ml-16 flex items-center">
             <span 
               className="font-display text-[10px] md:text-xs uppercase tracking-widest px-5 py-2 rounded-full border bg-black/50 backdrop-blur-md transition-all duration-300 group-hover:bg-white/10 group-hover:scale-105"
               style={{ color: t.color, borderColor: `${t.color}66` }}
             >
               View Details <span aria-hidden="true" className="ml-1 inline-block transition-transform group-hover:translate-x-1">→</span>
             </span>
          </div>
        )}
      </div>
    </>
  );

  const containerClasses = `group relative w-full min-h-[220px] md:min-h-[280px] flex flex-col rounded-xl overflow-hidden transition-all duration-500 hover:-translate-y-2 shadow-2xl hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)] ${
    t.slug ? "cursor-pointer" : "cursor-default"
  }`;

  if (t.slug) {
    return (
      <Link href={`/events/hardware/${t.slug}`} className={containerClasses} aria-label={`View details for ${t.name} track`}>
        {cardContent}
      </Link>
    );
  }

  return (
    <div tabIndex={0} role="group" aria-label={`${t.name} track`} className={containerClasses}>
      {cardContent}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════ */
export default function HardwareDetails() {
  const sectionRef = useRef(null);

  /* GSAP letter-stagger on the hero headline */
  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      if (reduce) {
        gsap.set(".hd-letter", { opacity: 1, y: 0 });
        return;
      }
      gsap.set(".hd-letter", { opacity: 0, y: 24 });
      gsap.to(".hd-letter", {
        opacity: 1, y: 0,
        duration: 0.4,
        ease: "power3.out",
        stagger: { each: 0.04, from: "start" },
        delay: 0.15,
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const splitLetters = (text) => {
    const parts = text.split(/(\s+)/);
    return parts.map((part, wi) => {
      if (/^\s+$/.test(part)) {
        return <span key={`w${wi}`} style={{ whiteSpace: "pre" }}>{part}</span>;
      }
      return (
        <span key={`w${wi}`} className="inline-block" style={{ whiteSpace: "nowrap" }}>
          {[...part].map((ch, ci) => (
            <span key={`${wi}-${ci}`} className="hd-letter inline-block">{ch}</span>
          ))}
        </span>
      );
    });
  };

  return (
    <section
      ref={sectionRef}
      className="relative isolate overflow-hidden pt-32 pb-24 px-6"
    >
      {/* Ribbon flow animation */}
      <style>{`
        @keyframes ribbon-flow {
          from { stroke-dashoffset: 0; }
          to { stroke-dashoffset: -64; }
        }
      `}</style>
      {/* Dark textured magical background */}
      <div
        className="absolute inset-0 -z-40 opacity-40 bg-cover bg-center"
        style={{ backgroundImage: "url('/bg-stone.png')", mixBlendMode: "luminosity" }}
      />
      <div className="absolute inset-0 -z-50 bg-[#0B0C10]" />
      <div aria-hidden="true" className="absolute inset-0 -z-30 hp-stars pointer-events-none opacity-25" />
      <div aria-hidden="true" className="absolute inset-0 -z-20 hp-scrim pointer-events-none opacity-50" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 pointer-events-none">
        <Sparkles count={8} />
      </div>

      {/* ═══ HERO ═══════════════════════════════════════════════════════ */}
      <div className="mx-auto max-w-4xl text-center relative">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Eyebrow color={GOLD}>Hardware Track</Eyebrow>
        </motion.div>

        <h1
          className="mt-6 font-display font-black tracking-tight leading-[1.05]"
          style={{
            fontSize: "clamp(2.5rem, 8vw, 6rem)",
            color: GOLD,
            textShadow: "0 0 8px rgba(212,175,55,.22)",
          }}
        >
          Hardware Hack
        </h1>

        <Reveal delay={0.15}>
          <p className="mt-6 font-wizard text-silver-hp/80 text-base leading-relaxed max-w-2xl mx-auto">
            Build the magic you can hold. Compete as a team of 2–4 in the robotics
            challenges, or exhibit a hardware project solo (school students).
          </p>
        </Reveal>

        {/* CTA */}
        <Reveal delay={0.25} className="mt-8 flex flex-col items-center gap-4">
          <span
            className="inline-flex items-center gap-2 rounded-full border px-3 py-1 font-display text-[10px] uppercase tracking-[0.4em]"
            style={{ borderColor: `${GOLD}66`, color: GOLD, backgroundColor: `${GOLD}14` }}
          >
            Registrations open
          </span>
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3">
            <RoughButton
              as={Link}
              href="/events/hardware/register?mode=competition"
              color={GOLD}
              glow={GOLD_GLOW}
              fill={false}
              seed={23}
              className="px-9 sm:px-11 py-4 leading-none text-[12px] sm:text-[13px] tracking-[0.35em]"
            >
              <span>COMPETITION · TEAM 2–4</span>
              <span aria-hidden="true">↗</span>
            </RoughButton>
            <RoughButton
              as={Link}
              href="/events/hardware/register?mode=exhibition"
              color={GOLD}
              fill={false}
              seed={29}
              className="px-8 sm:px-10 py-3.5 leading-none text-[12px] tracking-[0.3em]"
            >
              <span>EXHIBITION · SCHOOL SOLO</span>
              <span aria-hidden="true">↗</span>
            </RoughButton>
          </div>
        </Reveal>
      </div>

      {/* ═══ HARDWARE TRACKS ═══════════════════════════════════════════ */}
      <div className="mx-auto mt-28 max-w-4xl">
        <Reveal>
          <Eyebrow color={GOLD}>Hardware Tracks</Eyebrow>
          <h2 className="mt-4 text-center font-display font-bold text-2xl sm:text-3xl tracking-tight" style={{ color: GOLD }}>
            Choose your arena
          </h2>
          <p className="mt-3 text-center font-wizard text-silver-hp/70 text-sm max-w-xl mx-auto">
            Pick the track that fits your build — or bring a custom project for the exhibition.
          </p>
        </Reveal>

        <div className="mt-16 flex flex-col gap-14">
          {HARDWARE_TRACKS.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.15} className="w-full">
              <div className="relative">
                <MagicRibbon color={t.color} index={i} />
                <TrackCard track={t} index={i} />
              </div>
            </Reveal>
          ))}
        </div>
      </div>



      {/* ═══ FOOTER CTAs ═════════════════════════════════════════════════ */}
      <Reveal delay={0.1} className="mt-28 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3">
        <RoughButton
          as={Link}
          href="/events/hardware/register?mode=competition"
          color={GOLD}
          glow={GOLD_GLOW}
          fill={false}
          seed={23}
          className="px-8 py-3 leading-none text-[12px]"
        >
          <span>COMPETITION ↗</span>
        </RoughButton>
        <RoughButton
          as={Link}
          href="/events/hardware/register?mode=exhibition"
          color={GOLD}
          fill={false}
          seed={27}
          className="px-8 py-3 leading-none text-[12px]"
        >
          <span>EXHIBITION ↗</span>
        </RoughButton>
        <RoughButton
          as={Link}
          href="/events"
          color="#C5C6C7"
          fill={false}
          seed={31}
          className="px-8 py-3 leading-none text-[11px]"
        >
          ← ALL EVENTS
        </RoughButton>
      </Reveal>
    </section>
  );
}
