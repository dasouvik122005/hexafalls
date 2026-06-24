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

const GREEN = "#22C55E";
const GREEN_GLOW = "rgba(34,197,94,0.35)";

/* ── reusable section eyebrow ────────────────────────────────────────── */
function Eyebrow({ children, color = GREEN }) {
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

/* ── interactive track card with hover description reveal ────────────── */
function TrackCard({ track: t, index: i }) {
  const [hovered, setHovered] = useState(false);

  const cardContent = (
    <>
      <RoughCorners color={t.color} length={16} strokeWidth={1.5} seed={10 + i} inset={-1} />
      
      <div className="flex items-center justify-between relative z-10 w-full">
        <div className="flex items-center gap-3">
          <span
            className="text-2xl select-none transition-transform duration-300 font-mono"
            style={{
              textShadow: `0 0 12px ${t.color}66`,
              transform: hovered ? "scale(1.15)" : "scale(1)",
            }}
            aria-hidden="true"
          >
            {t.rune}
          </span>
          <span
            className="font-mono text-sm tracking-widest uppercase font-bold"
            style={{ color: t.color, textShadow: hovered ? `0 0 8px ${t.color}66` : "none" }}
          >
            {t.name}
          </span>
        </div>
        {t.slug && (
          <span className={`font-mono text-[10px] uppercase tracking-widest transition-opacity duration-300 ${hovered ? "opacity-100" : "opacity-70"}`} style={{ color: t.color }}>
            View details ↗
          </span>
        )}
      </div>
      {/* description — smoothly revealed on hover/focus */}
      <div
        className="grid transition-all duration-300 ease-out relative z-10"
        style={{ gridTemplateRows: hovered ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <p
            className="font-mono text-xs leading-relaxed pt-2 transition-opacity duration-300"
            style={{
              color: `${t.color}cc`,
              opacity: hovered ? 1 : 0,
            }}
          >
            {t.desc}
          </p>
        </div>
      </div>
      
      {/* Optional decorative "circuit" or "blueprint" lines in background on hover */}
      <div className={`absolute right-4 top-4 font-mono text-[8px] text-silver-hp/20 transition-opacity duration-300 ${hovered ? "opacity-100" : "opacity-0"}`}>
        SYS.OK
      </div>
    </>
  );

  const containerClasses = `relative h-full flex flex-col gap-2 p-5 bg-midnight-hp/60 backdrop-blur-sm transition-all duration-300 outline-none ${
    hovered ? "bg-midnight-hp/90 shadow-[inset_0_0_20px_rgba(34,197,94,0.15)]" : "shadow-[inset_0_0_0px_rgba(34,197,94,0)]"
  } ${t.slug ? "cursor-pointer" : "cursor-default"}`;

  if (t.slug) {
    return (
      <Link
        href={`/events/hardware/${t.slug}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        className={containerClasses}
        style={{ border: `1px solid ${t.color}33`, display: "block" }}
        aria-label={`View details for ${t.name} track`}
      >
        {cardContent}
      </Link>
    );
  }

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      tabIndex={0}
      role="group"
      aria-label={`${t.name} track`}
      className={containerClasses}
      style={{ border: `1px solid ${t.color}33` }}
    >
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
      {/* Hardware / Blueprint Background */}
      <div 
        aria-hidden="true" 
        className="absolute inset-0 -z-40 pointer-events-none opacity-20 mix-blend-screen"
        style={{
          backgroundImage: `linear-gradient(${GREEN}22 1px, transparent 1px), linear-gradient(90deg, ${GREEN}22 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />
      <div aria-hidden="true" className="absolute inset-0 -z-30 hp-stars pointer-events-none opacity-50" />
      <div aria-hidden="true" className="absolute inset-0 -z-20 hp-scrim pointer-events-none" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 pointer-events-none">
        <Sparkles count={15} />
      </div>

      {/* ═══ HERO ═══════════════════════════════════════════════════════ */}
      <div className="mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Eyebrow>Track · Hardware Hack</Eyebrow>
        </motion.div>

        <h1
          aria-label="Hardware Hack"
          className="mt-6 font-display font-black tracking-tight text-silver-hp leading-[1.05] hp-glow text-balance"
          style={{ perspective: 800, fontSize: "clamp(2.2rem, 9vw, 5.5rem)" }}
        >
          {splitLetters("Hardware")}
          <span style={{ whiteSpace: "pre" }}> </span>
          <span
            className="font-mono tracking-widest uppercase"
            style={{
              color: GREEN,
              textShadow: `0 0 8px ${GREEN}b3, 0 0 22px ${GREEN_GLOW}`,
              fontSize: "clamp(2.4rem, 10vw, 6rem)",
            }}
          >
            {splitLetters("Hack")}
          </span>
        </h1>

        <Reveal delay={0.15}>
          <p className="mt-6 font-mono text-silver-hp/85 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto tracking-wide">
            <span className="text-green-500">{`>_ `}</span>
            Solder, sparks, sensors. Magic that you can hold. Bring your custom bots, rovers, and embedded systems to life in our dedicated hardware arenas.
          </p>
        </Reveal>

        {/* CTA */}
        <Reveal delay={0.25} className="mt-8 flex flex-col items-center gap-3">
          <span
            className="inline-flex items-center gap-2 rounded-full border px-3 py-1 font-display text-[10px] uppercase tracking-[0.4em]"
            style={{ borderColor: `${GREEN}80`, color: GREEN, backgroundColor: `${GREEN}1a` }}
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full opacity-70 animate-ping" style={{ backgroundColor: GREEN }} />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ backgroundColor: GREEN }} />
            </span>
            Registrations Open
          </span>
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4">
            <RoughButton
              as={Link}
              href="/events/hardware/register?mode=competition"
              color={GREEN}
              glow={GREEN_GLOW}
              fill={false}
              shimmer
              seed={23}
              className="px-10 sm:px-12 py-4 sm:py-5 leading-none text-[13px] sm:text-[14px] tracking-[0.4em]"
            >
              <span>COMPETITION · TEAM 2–5</span>
              <span aria-hidden="true">↗</span>
            </RoughButton>
            <RoughButton
              as={Link}
              href="/events/hardware/register?mode=exhibition"
              color={GREEN}
              fill={false}
              seed={29}
              className="px-8 sm:px-10 py-3 sm:py-4 leading-none text-[12px] sm:text-[13px] tracking-[0.35em]"
            >
              <span>EXHIBITION · SCHOOL SOLO</span>
              <span aria-hidden="true">↗</span>
            </RoughButton>
          </div>
        </Reveal>
      </div>

      {/* ═══ HARDWARE TRACKS ═══════════════════════════════════════════ */}
      <div className="mx-auto mt-28 max-w-5xl">
        <Reveal>
          <Eyebrow>Hardware Tracks</Eyebrow>
          <h2 className="mt-4 text-center font-display font-bold text-2xl sm:text-3xl tracking-tight" style={{ color: GREEN, textShadow: `0 0 14px ${GREEN_GLOW}` }}>
            Choose Your Arena
          </h2>
          <p className="mt-3 text-center font-mono text-silver-hp/75 text-sm max-w-xl mx-auto">
            Pick the track that matches your robot&apos;s capabilities. Or bring a custom project for the exhibition.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 justify-center">
          {HARDWARE_TRACKS.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.04} className="h-full">
              <TrackCard track={t} index={i} />
            </Reveal>
          ))}
        </div>
      </div>



      {/* ═══ FOOTER CTAs ═════════════════════════════════════════════════ */}
      <Reveal delay={0.1} className="mt-28 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4">
        <RoughButton
          as={Link}
          href="/events/hardware/register?mode=competition"
          color={GREEN}
          glow={GREEN_GLOW}
          fill={false}
          shimmer
          seed={23}
          className="px-8 py-3 leading-none text-[12px]"
        >
          <span>COMPETITION ↗</span>
        </RoughButton>
        <RoughButton
          as={Link}
          href="/events/hardware/register?mode=exhibition"
          color={GREEN}
          fill={false}
          seed={29}
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
