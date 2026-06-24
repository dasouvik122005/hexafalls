"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import gsap from "gsap";
import Sparkles from "./Sparkles";
import RoughFrame from "./RoughFrame";
import RoughButton from "./RoughButton";
import RoughDivider from "./RoughDivider";
import { ROBO_TERRENCE_RULES } from "@/lib/routes";

const AMBER = "#F59E0B";
const AMBER_GLOW = "rgba(245,158,11,0.35)";

/* ── reusable section eyebrow ────────────────────────────────────────── */
function Eyebrow({ children, color = AMBER }) {
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

/* ── Rule list component for rules sections ──────────────────────────── */
function RuleList({ items, color = AMBER }) {
  return (
    <ul className="mt-4 space-y-3">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3 items-start">
          <span className="font-mono mt-1 text-[10px]" style={{ color }}>{`>>`}</span>
          <span className="font-mono text-sm text-silver-hp/80 leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  );
}

/* ══════════════════════════════════════════════════════════════════════ */
export default function RoboTerrenceDetails() {
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
      {/* Hardware / Blueprint Background */}
      <div 
        aria-hidden="true" 
        className="absolute inset-0 -z-40 pointer-events-none opacity-20 mix-blend-screen"
        style={{
          backgroundImage: `linear-gradient(${AMBER}22 1px, transparent 1px), linear-gradient(90deg, ${AMBER}22 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />
      <div aria-hidden="true" className="absolute inset-0 -z-30 hp-stars pointer-events-none opacity-50" />
      <div aria-hidden="true" className="absolute inset-0 -z-20 hp-scrim pointer-events-none" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 pointer-events-none">
        <Sparkles count={15} />
      </div>

      {/* ═══ HERO ═══════════════════════════════════════════════════════ */}
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          <Eyebrow color={AMBER}>Rulebook</Eyebrow>
        </motion.div>

        <h1
          aria-label="Robo Terrence"
          className="mt-6 font-display font-black tracking-tight text-center text-silver-hp leading-[1.05] hp-glow text-balance"
          style={{ perspective: 800, fontSize: "clamp(2.4rem, 10vw, 6rem)" }}
        >
          {splitLetters("Robo")}
          <span style={{ whiteSpace: "pre" }}> </span>
          <span
            className="font-mono tracking-widest uppercase"
            style={{
              color: AMBER,
              textShadow: `0 0 8px rgba(245, 158, 11, 0.7), 0 0 22px rgba(245, 158, 11, 0.35)`,
              fontSize: "clamp(2.6rem, 10vw, 6.2rem)",
            }}
          >
            {splitLetters("Terrence")}
          </span>
        </h1>

        <Reveal delay={0.15}>
          <p className="mt-6 font-mono text-silver-hp/85 text-sm sm:text-base leading-relaxed max-w-3xl mx-auto tracking-wide text-center">
            <span className="text-amber-500">{`>_ `}</span>
            {ROBO_TERRENCE_RULES.overview}
          </p>
        </Reveal>

        {/* CTAs (Team Size and Fee as buttons) */}
        <Reveal delay={0.25} className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <RoughButton
            as="div"
            color={AMBER}
            fill={false}
            seed={11}
            className="px-6 py-3 cursor-default"
          >
            <span className="font-mono text-[10px] text-silver-hp/70 uppercase tracking-widest mr-2">Fee:</span>
            <span className="font-mono text-[13px] tracking-widest text-silver-hp">{ROBO_TERRENCE_RULES.registration.fee}</span>
          </RoughButton>
          
          <RoughButton
            as="div"
            color={AMBER}
            fill={false}
            seed={22}
            className="px-6 py-3 cursor-default"
          >
            <span className="font-mono text-[10px] text-silver-hp/70 uppercase tracking-widest mr-2">Team:</span>
            <span className="font-mono text-[13px] tracking-widest text-silver-hp">{ROBO_TERRENCE_RULES.registration.teamSize}</span>
          </RoughButton>
          
          <RoughButton
            as={Link}
            href="/register/hardware"
            color={AMBER}
            glow={AMBER_GLOW}
            shimmer
            seed={33}
            className="px-8 py-3"
          >
            <span className="font-mono text-[13px] tracking-[0.4em]">REGISTER NOW</span>
            <span aria-hidden="true">↗</span>
          </RoughButton>
        </Reveal>
      </div>

      {/* ═══ ROBO TERRENCE RULEBOOK ════════════════════════════════════════ */}
      <div className="mx-auto mt-24 max-w-5xl">
        <div className="grid gap-6 md:grid-cols-2">
          {/* General Rules & Bot Specs */}
          <Reveal className="flex flex-col gap-6">
            <RoughFrame stroke={AMBER} padding={24} className="bg-midnight-hp/50">
              <h3 className="font-mono text-lg uppercase tracking-wider mb-4" style={{ color: AMBER }}>General Rules</h3>
              <RuleList items={ROBO_TERRENCE_RULES.generalRules} />
            </RoughFrame>
          </Reveal>

          {/* Bot Specs & Terrain Challenges */}
          <Reveal delay={0.1} className="flex flex-col gap-6">
            <RoughFrame stroke={AMBER} padding={24} className="bg-midnight-hp/50">
              <h3 className="font-mono text-lg uppercase tracking-wider mb-4" style={{ color: AMBER }}>Bot Specifications</h3>
              <RuleList items={ROBO_TERRENCE_RULES.botSpecs} />
            </RoughFrame>

            <RoughFrame stroke={AMBER} padding={24} className="h-full bg-midnight-hp/50">
              <h3 className="font-mono text-lg uppercase tracking-wider mb-4" style={{ color: AMBER }}>Terrain Challenges</h3>
              <RuleList items={ROBO_TERRENCE_RULES.terrainChallenges} />
            </RoughFrame>
          </Reveal>
        </div>

        {/* Rounds */}
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <Reveal>
            <RoughFrame stroke={AMBER} padding={24} className="h-full bg-midnight-hp/50">
              <h3 className="font-mono text-lg uppercase tracking-wider mb-4" style={{ color: AMBER }}>Preliminary Round</h3>
              <RuleList items={ROBO_TERRENCE_RULES.preliminaryRound} />
            </RoughFrame>
          </Reveal>
          <Reveal delay={0.1}>
            <RoughFrame stroke={AMBER} padding={24} className="h-full bg-midnight-hp/50">
              <h3 className="font-mono text-lg uppercase tracking-wider mb-4" style={{ color: AMBER }}>Final Round</h3>
              <RuleList items={ROBO_TERRENCE_RULES.finalRound} />
            </RoughFrame>
          </Reveal>
        </div>

        {/* Judging & Notes */}
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <Reveal>
            <RoughFrame stroke={AMBER} padding={24} className="h-full bg-midnight-hp/50">
              <h3 className="font-mono text-lg uppercase tracking-wider mb-4" style={{ color: AMBER }}>Judging Criteria</h3>
              <RuleList items={ROBO_TERRENCE_RULES.judgingCriteria} />
            </RoughFrame>
          </Reveal>

          <Reveal delay={0.1} className="flex flex-col gap-6">
            <RoughFrame stroke="#F87171" padding={24} className="bg-midnight-hp/50 h-full" seed={12}>
              <h3 className="font-mono text-lg uppercase tracking-wider mb-4 text-red-400" style={{ textShadow: "0 0 8px rgba(248,113,113,0.4)" }}>Important Notes</h3>
              <RuleList items={ROBO_TERRENCE_RULES.notes} color="#F87171" />
            </RoughFrame>
          </Reveal>
        </div>

        <Reveal className="mt-16 text-center">
           <p className="font-mono text-xl md:text-2xl tracking-widest uppercase font-bold" style={{ color: AMBER, textShadow: `0 0 12px ${AMBER_GLOW}` }}>
             Master the Terrain. Conquer Every Obstacle.
           </p>
        </Reveal>
      </div>

      {/* ═══ FOOTER CTAs ═════════════════════════════════════════════════ */}
      <Reveal delay={0.1} className="mt-28 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4">
        <RoughButton
          as={Link}
          href="/events/hardware"
          color="#C5C6C7"
          fill={false}
          seed={31}
          className="px-8 py-3 text-[11px]"
        >
          ← HARDWARE TRACKS
        </RoughButton>
      </Reveal>
    </section>
  );
}
