"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import gsap from "gsap";
import Sparkles from "./Sparkles";
import RoughFrame from "./RoughFrame";
import RoughButton from "./RoughButton";
import RoughDivider from "./RoughDivider";
import { LINE_FOLLOWER_RULES } from "@/lib/routes";

const CYAN = "#06B6D4";
const CYAN_GLOW = "rgba(6,182,212,0.35)";

/* ── reusable section eyebrow ────────────────────────────────────────── */
function Eyebrow({ children, color = CYAN }) {
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
function RuleList({ items, color = CYAN }) {
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
export default function LineFollowerDetails() {
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
          backgroundImage: `linear-gradient(${CYAN}22 1px, transparent 1px), linear-gradient(90deg, ${CYAN}22 1px, transparent 1px)`,
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
          <Eyebrow color={CYAN}>Rulebook</Eyebrow>
        </motion.div>

        <h1
          aria-label="Line Follower"
          className="mt-6 font-display font-black tracking-tight text-center text-silver-hp leading-[1.05] hp-glow text-balance"
          style={{ perspective: 800, fontSize: "clamp(2.4rem, 10vw, 6rem)" }}
        >
          {splitLetters("Line")}
          <span style={{ whiteSpace: "pre" }}> </span>
          <span
            className="font-mono tracking-widest uppercase"
            style={{
              color: CYAN,
              textShadow: `0 0 8px rgba(6, 182, 212, 0.7), 0 0 22px rgba(6, 182, 212, 0.35)`,
              fontSize: "clamp(2.5rem, 10vw, 6rem)",
            }}
          >
            {splitLetters("Follower")}
          </span>
        </h1>

        <Reveal delay={0.15}>
          <p className="mt-6 font-mono text-silver-hp/85 text-sm sm:text-base leading-relaxed max-w-3xl mx-auto tracking-wide text-center">
            <span className="text-cyan-400">{`>_ `}</span>
            {LINE_FOLLOWER_RULES.overview}
          </p>
        </Reveal>

        {/* CTAs (Team Size and Fee as buttons) */}
        <Reveal delay={0.25} className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <RoughButton
            as="div"
            color={CYAN}
            fill={false}
            seed={11}
            className="px-6 py-3 cursor-default"
          >
            <span className="font-mono text-[10px] text-silver-hp/70 uppercase tracking-widest mr-2">Fee:</span>
            <span className="font-mono text-[13px] tracking-widest text-silver-hp">{LINE_FOLLOWER_RULES.registration.fee}</span>
          </RoughButton>
          
          <RoughButton
            as="div"
            color={CYAN}
            fill={false}
            seed={22}
            className="px-6 py-3 cursor-default"
          >
            <span className="font-mono text-[10px] text-silver-hp/70 uppercase tracking-widest mr-2">Team:</span>
            <span className="font-mono text-[13px] tracking-widest text-silver-hp">{LINE_FOLLOWER_RULES.registration.teamSize}</span>
          </RoughButton>
          
          <RoughButton
            as={Link}
            href="/register/hardware"
            color={CYAN}
            glow={CYAN_GLOW}
            shimmer
            seed={33}
            className="px-8 py-3"
          >
            <span className="font-mono text-[13px] tracking-[0.4em]">REGISTER NOW</span>
            <span aria-hidden="true">↗</span>
          </RoughButton>
        </Reveal>
      </div>

      {/* ═══ LINE FOLLOWER RULEBOOK ════════════════════════════════════════ */}
      <div className="mx-auto mt-24 max-w-5xl">
        <div className="grid gap-6 md:grid-cols-2">
          {/* General Rules & Bot Specs */}
          <Reveal className="flex flex-col gap-6">
            <RoughFrame stroke={CYAN} padding={24} className="bg-midnight-hp/50">
              <h3 className="font-mono text-lg uppercase tracking-wider mb-4" style={{ color: CYAN }}>General Rules</h3>
              <RuleList items={LINE_FOLLOWER_RULES.generalRules} />
            </RoughFrame>
          </Reveal>

          {/* Bot Specs & Terrain Challenges */}
          <Reveal delay={0.1} className="flex flex-col gap-6">
            <RoughFrame stroke={CYAN} padding={24} className="bg-midnight-hp/50">
              <h3 className="font-mono text-lg uppercase tracking-wider mb-4" style={{ color: CYAN }}>Bot Specifications</h3>
              <RuleList items={LINE_FOLLOWER_RULES.botSpecs} />
            </RoughFrame>

            <RoughFrame stroke={CYAN} padding={24} className="h-full bg-midnight-hp/50">
              <h3 className="font-mono text-lg uppercase tracking-wider mb-4" style={{ color: CYAN }}>Track Specifications</h3>
              <RuleList items={LINE_FOLLOWER_RULES.trackSpecs} />
            </RoughFrame>
          </Reveal>
        </div>

        {/* Rounds */}
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <Reveal>
            <RoughFrame stroke={CYAN} padding={24} className="h-full bg-midnight-hp/50">
              <h3 className="font-mono text-lg uppercase tracking-wider mb-4" style={{ color: CYAN }}>Preliminary Round</h3>
              <RuleList items={LINE_FOLLOWER_RULES.preliminaryRound} />
            </RoughFrame>
          </Reveal>
          <Reveal delay={0.1}>
            <RoughFrame stroke={CYAN} padding={24} className="h-full bg-midnight-hp/50">
              <h3 className="font-mono text-lg uppercase tracking-wider mb-4" style={{ color: CYAN }}>Final Round</h3>
              <RuleList items={LINE_FOLLOWER_RULES.finalRound} />
            </RoughFrame>
          </Reveal>
        </div>

        {/* Scoring, Judging & Notes */}
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <Reveal className="flex flex-col gap-6">
            <RoughFrame stroke={CYAN} padding={24} className="bg-midnight-hp/50">
              <h3 className="font-mono text-lg uppercase tracking-wider mb-4" style={{ color: CYAN }}>Judging Parameters</h3>
              <RuleList items={LINE_FOLLOWER_RULES.judgingParameters} />
            </RoughFrame>

            <RoughFrame stroke={CYAN} padding={24} className="bg-midnight-hp/50 h-full">
              <h3 className="font-mono text-lg uppercase tracking-wider mb-4" style={{ color: CYAN }}>Scoring Criteria</h3>
              <div className="space-y-6 mt-4">
                {LINE_FOLLOWER_RULES.scoringCriteria.map((c, i) => (
                  <div key={i}>
                    <div className="font-mono text-sm uppercase tracking-widest font-bold" style={{ color: CYAN }}>{c.name}</div>
                    <ul className="mt-2 pl-4 space-y-2">
                      {c.items.map((item, j) => (
                        <li key={j} className="font-mono text-xs text-silver-hp/80 flex items-start gap-2">
                          <span className="text-[10px] mt-0.5" style={{ color: CYAN }}>+</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </RoughFrame>
          </Reveal>

          <Reveal delay={0.1}>
            <RoughFrame stroke="#F87171" padding={24} className="bg-midnight-hp/50 h-full" seed={12}>
              <h3 className="font-mono text-lg uppercase tracking-wider mb-4 text-red-400" style={{ textShadow: "0 0 8px rgba(248,113,113,0.4)" }}>Important Notes</h3>
              <RuleList items={LINE_FOLLOWER_RULES.notes} color="#F87171" />
            </RoughFrame>
          </Reveal>
        </div>

        <Reveal className="mt-16 text-center">
           <p className="font-mono text-xl md:text-2xl tracking-widest uppercase font-bold" style={{ color: CYAN, textShadow: `0 0 12px ${CYAN_GLOW}` }}>
             Follow the Line. Beat the Clock. Lead the Future.
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
