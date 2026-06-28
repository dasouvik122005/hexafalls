"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import Sparkles from "./Sparkles";
import RoughFrame from "./RoughFrame";
import RoughButton from "./RoughButton";
import RoughDivider from "./RoughDivider";
import RoughTape from "./RoughTape";
import RoughCorners from "./RoughCorners";

/* ── reusable section eyebrow ────────────────────────────────────────── */
function Eyebrow({ children, color }) {
  return (
    <div className="flex items-center justify-center gap-3 text-[11px] uppercase tracking-[0.5em] font-display text-center"
         style={{ color: `${color}cc` }}>
      <RoughDivider width={48} height={20} color={color} seed={3} />
      {children}
      <RoughDivider width={48} height={20} color={color} seed={5} />
    </div>
  );
}

/* ── fade-in wrapper ─────────────────────────────────────────────────── */
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

export function RuleList({ items, color }) {
  return (
    <ul className="space-y-4">
      {items.map((item, i) => (
        <li key={i} className="flex gap-4 items-start">
          <span className="font-mono mt-1 text-[12px] opacity-80" style={{ color }}>{`>>`}</span>
          <span className="font-mono text-sm sm:text-base text-silver-hp/90 leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function JudgingList({ criteria, color }) {
  return (
    <div className="space-y-8">
      {criteria.map((c, i) => (
        <div key={i} className="relative pl-6">
          <div className="absolute left-0 top-0 bottom-0 w-[1px] opacity-30" style={{ backgroundColor: color }} />
          <div className="font-mono text-sm sm:text-base uppercase tracking-widest font-bold mb-3" style={{ color }}>{c.name}</div>
          <ul className="space-y-2">
            {c.items.map((item, j) => (
              <li key={j} className="font-mono text-xs sm:text-sm text-silver-hp/80 flex items-start gap-3">
                <span className="text-[10px] mt-1" style={{ color }}>✦</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════ */
export default function WizardingRulebookLayout({ trackData, rules, chapters }) {
  const sectionRef = useRef(null);
  const [activeChapter, setActiveChapter] = useState(chapters[0].id);

  const color = trackData?.color || "#D4AF37";
  const glow = `${color}59`; // roughly 35% opacity glow

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
    if (!text) return null;
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

  const activeContent = chapters.find(c => c.id === activeChapter)?.content;

  return (
    <section
      ref={sectionRef}
      className="relative isolate overflow-hidden pt-32 pb-24 px-6 min-h-screen"
    >
      {/* Background Atmosphere */}
      <div 
        aria-hidden="true" 
        className="absolute inset-0 -z-40 pointer-events-none opacity-[0.15] mix-blend-screen"
        style={{
          backgroundImage: `linear-gradient(${color}22 1px, transparent 1px), linear-gradient(90deg, ${color}22 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />
      <div aria-hidden="true" className="absolute inset-0 -z-30 hp-stars pointer-events-none opacity-40" />
      <div aria-hidden="true" className="absolute inset-0 -z-20 hp-scrim pointer-events-none" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 pointer-events-none">
        <Sparkles count={20} color={color} />
      </div>

      {/* ═══ HERO ═══════════════════════════════════════════════════════ */}
      <div className="mx-auto max-w-5xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Eyebrow color={color}>Rulebook</Eyebrow>
        </motion.div>

        <h1
          aria-label={trackData?.name}
          className="mt-6 font-display font-black tracking-tight text-center text-silver-hp leading-[1.05] hp-glow text-balance"
          style={{ perspective: 800, fontSize: "clamp(2.4rem, 10vw, 6rem)" }}
        >
          <span
            className="font-mono tracking-widest uppercase inline-block"
            style={{
              color: color,
              textShadow: `0 0 8px ${color}b3, 0 0 22px ${glow}`,
              fontSize: "clamp(2.6rem, 11vw, 6.5rem)",
            }}
          >
            {splitLetters(trackData?.name)}
          </span>
        </h1>

        <Reveal delay={0.15}>
          <p className="mt-8 font-mono text-silver-hp/90 text-sm sm:text-base md:text-lg leading-relaxed max-w-3xl mx-auto tracking-wide text-center">
            <span style={{ color }}>{`>_ `}</span>
            {rules?.overview}
          </p>
        </Reveal>

        {/* CTAs */}
        <Reveal delay={0.25} className="mt-12 flex flex-wrap items-center justify-center gap-4">
          <RoughButton as="div" color={color} fill={false} seed={11} className="px-6 py-3 cursor-default">
            <span className="font-mono text-[10px] text-silver-hp/70 uppercase tracking-widest mr-2">Fee:</span>
            <span className="font-mono text-[13px] tracking-widest text-silver-hp">{rules?.registration?.fee}</span>
          </RoughButton>
          <RoughButton as="div" color={color} fill={false} seed={22} className="px-6 py-3 cursor-default">
            <span className="font-mono text-[10px] text-silver-hp/70 uppercase tracking-widest mr-2">Team:</span>
            <span className="font-mono text-[13px] tracking-widest text-silver-hp">{rules?.registration?.teamSize}</span>
          </RoughButton>
          <RoughButton as={Link} href={`/events/hardware/register?mode=${trackData?.slug === "exhibition" ? "exhibition" : "competition"}`} color={color} glow={glow} shimmer seed={33} className="px-8 py-3">
            <span className="font-mono text-[13px] tracking-[0.4em]">REGISTER NOW</span>
            <span aria-hidden="true">↗</span>
          </RoughButton>
        </Reveal>
      </div>

      {/* ═══ INTERACTIVE GRIMOIRE (TABS) ════════════════════════════════ */}
      <Reveal delay={0.3} className="mx-auto mt-24 max-w-6xl relative z-10">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Chapter Index (Sidebar Tabs) */}
          <div className="lg:w-1/4 flex flex-col gap-2">
            <h3 className="font-display text-xl mb-4 ml-2" style={{ color }}>Chapters</h3>
            <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 gap-2 no-scrollbar">
              {chapters.map((chapter) => {
                const isActive = activeChapter === chapter.id;
                return (
                  <button
                    key={chapter.id}
                    onClick={() => setActiveChapter(chapter.id)}
                    className="relative px-4 py-4 text-left font-mono text-sm tracking-widest uppercase whitespace-nowrap transition-all duration-300 outline-none flex-shrink-0"
                    style={{ 
                      color: isActive ? color : "#C5C6C780",
                      backgroundColor: isActive ? `${color}11` : "transparent"
                    }}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTabIndicator"
                        className="absolute left-0 top-0 bottom-0 w-1"
                        style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }}
                      />
                    )}
                    <span className="relative z-10">{chapter.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Chapter Content Area */}
          <div className="lg:w-3/4 relative">
            <RoughFrame stroke={color} padding={0} className="bg-midnight-hp/60 backdrop-blur-md">
              <RoughTape color={color} />
              <RoughCorners color={color} length={24} strokeWidth={2} />
              
              <div className="p-8 md:p-10">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeChapter}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <h2 className="font-display text-3xl md:text-4xl mb-10 pb-4 border-b border-silver-hp/10" style={{ color }}>
                      {chapters.find(c => c.id === activeChapter)?.title}
                    </h2>
                    <div className="prose prose-invert max-w-none">
                      {activeContent}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </RoughFrame>
          </div>
        </div>
      </Reveal>

      {/* ═══ FOOTER CTAs ═════════════════════════════════════════════════ */}
      <Reveal delay={0.4} className="mt-32 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4">
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
