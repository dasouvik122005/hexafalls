"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import gsap from "gsap";
import Sparkles from "./Sparkles";
import RoughFrame from "./RoughFrame";
import RoughButton from "./RoughButton";
import RoughDivider from "./RoughDivider";
import { HACKATHON_TRACKS, JUDGING } from "@/lib/routes";

const GOLD = "#D4AF37";
const GOLD_GLOW = "rgba(212,175,55,0.22)";
const CYAN = "#66FCF1";

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

/* ── interactive track card with hover description reveal ────────────── */
function TrackCard({ track: t, index: i }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      tabIndex={0}
      role="group"
      aria-label={`${t.name} track`}
    >
      <RoughFrame
        seed={80 + i * 7}
        stroke={t.color}
        mistColor={t.color}
        strokeWidth={1.3}
        roughness={1.6}
        bowing={1.2}
        padding={18}
        className={`h-full bg-slate-hp/30 backdrop-blur-sm cursor-default transition-colors duration-300 ${hovered ? "bg-slate-hp/50" : ""}`}
        inner="flex flex-col gap-2"
      >
        <div className="flex items-center gap-3">
          <span
            className="text-2xl select-none transition-transform duration-300"
            style={{
              textShadow: `0 0 12px ${t.color}66`,
              transform: hovered ? "scale(1.15)" : "scale(1)",
            }}
            aria-hidden="true"
          >
            {t.rune}
          </span>
          <span
            className="font-display text-sm tracking-wide"
            style={{ color: t.color }}
          >
            {t.name}
          </span>
        </div>
        {/* description — smoothly revealed on hover/focus */}
        <div
          className="grid transition-all duration-300 ease-out"
          style={{ gridTemplateRows: hovered ? "1fr" : "0fr" }}
        >
          <div className="overflow-hidden">
            <p
              className="font-wizard text-xs leading-relaxed pt-1 transition-opacity duration-300"
              style={{
                color: `${t.color}cc`,
                opacity: hovered ? 1 : 0,
              }}
            >
              {t.desc}
            </p>
          </div>
        </div>
      </RoughFrame>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════ */
export default function HackathonDetails() {
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
      {/* parallax stack */}
      <div aria-hidden="true" className="absolute inset-0 -z-30 hp-stars pointer-events-none" />
      <div aria-hidden="true" className="absolute inset-0 -z-20 hp-scrim pointer-events-none" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 pointer-events-none">
        <Sparkles count={28} />
      </div>

      {/* ═══ HERO ═══════════════════════════════════════════════════════ */}
      <div className="mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Eyebrow>Track · Software Hackathon</Eyebrow>
        </motion.div>

        <h1
          aria-label="The Hackathon"
          className="mt-6 font-display font-black tracking-tight text-silver-hp leading-[1.05] hp-glow text-balance"
          style={{ perspective: 800, fontSize: "clamp(2.2rem, 9vw, 5.5rem)" }}
        >
          {splitLetters("The")}
          <span style={{ whiteSpace: "pre" }}> </span>
          <span
            className="hp-glow-gold"
            style={{
              color: GOLD,
              textShadow: `0 0 8px ${GOLD}b3, 0 0 22px ${GOLD_GLOW}`,
              fontSize: "clamp(2.6rem, 11vw, 6.5rem)",
            }}
          >
            {splitLetters("Hackathon")}
          </span>
        </h1>

        <Reveal delay={0.15}>
          <p className="mt-6 font-wizard text-silver-hp/85 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto">
            Fifty-eight hours of pure spellwork. Our judging is built around one principle:&nbsp;
            <span className="text-gold-hp font-semibold">the most valuable software is the kind anyone can read, run, and build upon.</span>
            &nbsp;Projects are evaluated on what they ship in the open, not only on the demo.
          </p>
        </Reveal>

        <Reveal delay={0.2} className="mt-4">
          <p className="font-wizard italic text-silver-hp/60 text-sm sm:text-base">
            We value every participant — completing and submitting a project matters, regardless of final placement.
          </p>
        </Reveal>

        {/* CTA */}
        <Reveal delay={0.25} className="mt-8 flex flex-col items-center gap-3">
          <span
            className="inline-flex items-center gap-2 rounded-full border px-3 py-1 font-display text-[10px] uppercase tracking-[0.4em]"
            style={{ borderColor: `${GOLD}80`, color: GOLD, backgroundColor: `${GOLD}1a` }}
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full opacity-70 animate-ping" style={{ backgroundColor: GOLD }} />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ backgroundColor: GOLD }} />
            </span>
            Registrations Open
          </span>
          <RoughButton
            as="a"
            href="https://hexafalls2.devfolio.co"
            target="_blank"
            rel="noopener noreferrer"
            color={GOLD}
            glow={GOLD_GLOW}
            shimmer
            seed={23}
            className="px-10 sm:px-12 py-4 sm:py-5 text-[13px] sm:text-[14px] tracking-[0.4em]"
          >
            <span>REGISTER ON DEVFOLIO</span>
            <span aria-hidden="true">↗</span>
          </RoughButton>
        </Reveal>
      </div>

      {/* ═══ HACKATHON TRACKS ═══════════════════════════════════════════ */}
      <div className="mx-auto mt-28 max-w-5xl">
        <Reveal>
          <Eyebrow>Hackathon Tracks</Eyebrow>
          <h2 className="mt-4 text-center font-display font-bold text-2xl sm:text-3xl text-gold-hp hp-glow-gold tracking-tight">
            Choose Your Domain
          </h2>
          <p className="mt-3 text-center font-wizard text-silver-hp/75 text-sm sm:text-base max-w-xl mx-auto">
            Pick the track that matches your quest. Each track focuses on a different domain — build anything within it.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {HACKATHON_TRACKS.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.04}>
              <TrackCard track={t} index={i} />
            </Reveal>
          ))}
        </div>
      </div>

      {/* ═══ SUBMISSION REQUIREMENTS ═════════════════════════════════════ */}
      <div className="mx-auto mt-28 max-w-4xl">
        <Reveal>
          <Eyebrow color={CYAN}>Eligibility</Eyebrow>
          <h2 className="mt-4 text-center font-display font-bold text-2xl sm:text-3xl text-cyan-hp hp-glow tracking-tight">
            Submission Requirements
          </h2>
          <p className="mt-3 text-center font-wizard text-silver-hp/70 text-sm max-w-lg mx-auto">
            A project must meet <em>all</em> of the following to be eligible for scoring. These are pass/fail gates, not scored criteria.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-8">
          <RoughFrame
            seed={41}
            stroke={CYAN}
            mistColor={CYAN}
            strokeWidth={1.3}
            roughness={1.5}
            bowing={1.1}
            padding={0}
            className="w-full bg-slate-hp/25 backdrop-blur-sm overflow-hidden"
          >
            {/* table-style layout */}
            <div className="divide-y divide-cyan-hp/15">
              {/* header */}
              <div className="grid grid-cols-[2.5rem_1fr_1fr] sm:grid-cols-[3rem_1.4fr_1fr] gap-x-3 px-4 sm:px-6 py-3 text-[10px] uppercase tracking-[0.3em] font-display text-cyan-hp/60">
                <span>#</span>
                <span>Requirement</span>
                <span>Rationale</span>
              </div>
              {JUDGING.eligibility.map((r) => (
                <div
                  key={r.id}
                  className="grid grid-cols-[2.5rem_1fr_1fr] sm:grid-cols-[3rem_1.4fr_1fr] gap-x-3 px-4 sm:px-6 py-4 items-start hover:bg-cyan-hp/5 transition-colors"
                >
                  <span className="font-display text-cyan-hp/50 text-sm">{r.id}</span>
                  <span className="font-wizard text-silver-hp/90 text-sm leading-relaxed">{r.req}</span>
                  <span className="font-wizard text-silver-hp/60 text-xs leading-relaxed italic">{r.rationale}</span>
                </div>
              ))}
            </div>
          </RoughFrame>
        </Reveal>

        <Reveal delay={0.15} className="mt-5">
          <p className="font-wizard text-silver-hp/60 text-xs sm:text-sm text-center leading-relaxed italic">
            Building on a pre-existing project is allowed, but only work done during the event is judged, and the starting point must be declared in the README.
          </p>
        </Reveal>
      </div>

      {/* ═══ SCORING CRITERIA ════════════════════════════════════════════ */}
      <div className="mx-auto mt-28 max-w-5xl">
        <Reveal>
          <Eyebrow>Scoring</Eyebrow>
          <h2 className="mt-4 text-center font-display font-bold text-2xl sm:text-3xl text-gold-hp hp-glow-gold tracking-tight">
            Scoring Criteria
          </h2>
          <p className="mt-2 text-center font-display text-gold-hp/70 text-sm tracking-wide">
            100 POINTS TOTAL
          </p>
          <p className="mt-3 text-center font-wizard text-silver-hp/70 text-sm max-w-xl mx-auto">
            Open-source quality is intentionally the heaviest weight. A polished demo on a closed or undocumented repository will not place highly.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {JUDGING.criteria.map((c, i) => (
            <Reveal key={c.id} delay={i * 0.05}>
              <RoughFrame
                seed={50 + i * 11}
                stroke={GOLD}
                mistColor={GOLD}
                strokeWidth={1.2}
                roughness={1.5}
                bowing={1.2}
                padding={20}
                className="h-full bg-slate-hp/30 backdrop-blur-sm"
                inner="flex flex-col gap-3 h-full"
              >
                {/* header row */}
                <div className="flex items-center justify-between">
                  <span className="font-display text-[10px] uppercase tracking-[0.3em] text-gold-hp/60">
                    Criterion {c.id}
                  </span>
                  <span
                    className="inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 font-display text-[11px] font-bold tracking-wide"
                    style={{ borderColor: `${GOLD}60`, color: GOLD, backgroundColor: `${GOLD}15` }}
                  >
                    {c.weight}
                    <span className="text-[8px] tracking-[0.2em] text-gold-hp/60">PTS</span>
                  </span>
                </div>
                {/* weight bar */}
                <div className="w-full h-1.5 rounded-full bg-slate-hp/60 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: GOLD }}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${(c.weight / 30) * 100}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 + i * 0.05, ease: "easeOut" }}
                  />
                </div>
                <h3 className="font-display text-base sm:text-lg tracking-tight text-gold-hp" style={{ textShadow: `0 0 14px ${GOLD_GLOW}` }}>
                  {c.name}
                </h3>
                <p className="font-wizard text-silver-hp/80 text-sm leading-relaxed mt-auto">
                  {c.desc}
                </p>
              </RoughFrame>
            </Reveal>
          ))}
        </div>
      </div>

      {/* ═══ SCORING SCALE ═══════════════════════════════════════════════ */}
      <div className="mx-auto mt-20 max-w-3xl">
        <Reveal>
          <Eyebrow color={CYAN}>Scale</Eyebrow>
          <h2 className="mt-4 text-center font-display font-bold text-xl sm:text-2xl text-cyan-hp hp-glow tracking-tight">
            Scoring Scale
          </h2>
          <p className="mt-2 text-center font-wizard text-silver-hp/60 text-xs sm:text-sm">
            Each criterion is scored 0–5, then scaled to its weight:
          </p>
          <p className="mt-1 text-center font-display text-cyan-hp/90 text-xs sm:text-sm tracking-wide">
            {JUDGING.formula}
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-6">
          <RoughFrame
            seed={62}
            stroke={CYAN}
            mistColor={CYAN}
            strokeWidth={1.2}
            roughness={1.5}
            bowing={1.1}
            padding={0}
            className="w-full bg-slate-hp/25 backdrop-blur-sm overflow-hidden"
          >
            <div className="divide-y divide-cyan-hp/15">
              <div className="grid grid-cols-[3.5rem_5rem_1fr] gap-x-3 px-4 sm:px-6 py-3 text-[10px] uppercase tracking-[0.3em] font-display text-cyan-hp/60">
                <span>Score</span>
                <span>Band</span>
                <span>Meaning</span>
              </div>
              {JUDGING.scale.map((s) => (
                <div
                  key={s.score}
                  className="grid grid-cols-[3.5rem_5rem_1fr] gap-x-3 px-4 sm:px-6 py-3 items-center hover:bg-cyan-hp/5 transition-colors"
                >
                  <span className="font-display text-cyan-hp text-sm font-bold">{s.score}</span>
                  <span className="font-display text-silver-hp/90 text-sm">{s.band}</span>
                  <span className="font-wizard text-silver-hp/70 text-sm">{s.meaning}</span>
                </div>
              ))}
            </div>
          </RoughFrame>
        </Reveal>
      </div>

      {/* ═══ BONUS POINTS ════════════════════════════════════════════════ */}
      <div className="mx-auto mt-20 max-w-4xl">
        <Reveal>
          <Eyebrow>Bonus</Eyebrow>
          <h2 className="mt-4 text-center font-display font-bold text-xl sm:text-2xl text-gold-hp hp-glow-gold tracking-tight">
            Bonus Points
          </h2>
          <p className="mt-2 text-center font-wizard text-silver-hp/65 text-xs sm:text-sm max-w-md mx-auto">
            Up to <span className="text-gold-hp font-semibold">+{JUDGING.bonusCap}</span> additive points, awarded on top of the 100 — so bonuses reward openness without replacing the core criteria.
          </p>
        </Reveal>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {JUDGING.bonus.map((b, i) => (
            <Reveal key={b.item} delay={i * 0.04}>
              <RoughFrame
                seed={70 + i * 5}
                stroke={GOLD}
                mistColor={GOLD}
                strokeWidth={1.1}
                roughness={1.6}
                bowing={1.2}
                padding={16}
                className="h-full bg-slate-hp/25 backdrop-blur-sm"
                inner="flex flex-col gap-2 h-full"
              >
                <div className="flex items-center justify-between">
                  <span className="font-display text-sm text-gold-hp tracking-tight">{b.item}</span>
                  <span
                    className="rounded-full border px-2 py-0.5 font-display text-[11px] font-bold"
                    style={{ borderColor: `${GOLD}55`, color: GOLD, backgroundColor: `${GOLD}15` }}
                  >
                    {b.pts}
                  </span>
                </div>
                <p className="font-wizard text-silver-hp/70 text-xs leading-relaxed">{b.note}</p>
              </RoughFrame>
            </Reveal>
          ))}
        </div>
      </div>

      {/* ═══ PENALTIES ═══════════════════════════════════════════════════ */}
      <div className="mx-auto mt-20 max-w-3xl">
        <Reveal>
          <Eyebrow color="#EF4444">Penalties</Eyebrow>
          <h2 className="mt-4 text-center font-display font-bold text-xl sm:text-2xl tracking-tight" style={{ color: "#EF4444", textShadow: "0 0 14px rgba(239,68,68,0.35)" }}>
            Penalties
          </h2>
        </Reveal>

        <Reveal delay={0.1} className="mt-6">
          <RoughFrame
            seed={90}
            stroke="#EF4444"
            mistColor="#EF4444"
            strokeWidth={1.2}
            roughness={1.6}
            bowing={1.1}
            padding={0}
            className="w-full bg-slate-hp/25 backdrop-blur-sm overflow-hidden"
          >
            <div className="divide-y divide-red-500/15">
              <div className="grid grid-cols-[1fr_auto] gap-x-4 px-4 sm:px-6 py-3 text-[10px] uppercase tracking-[0.3em] font-display" style={{ color: "rgba(239,68,68,0.6)" }}>
                <span>Issue</span>
                <span>Penalty</span>
              </div>
              {JUDGING.penalties.map((p) => (
                <div
                  key={p.issue}
                  className="grid grid-cols-[1fr_auto] gap-x-4 px-4 sm:px-6 py-4 items-center hover:bg-red-500/5 transition-colors"
                >
                  <span className="font-wizard text-silver-hp/85 text-sm leading-relaxed">{p.issue}</span>
                  <span className="font-display text-sm font-bold whitespace-nowrap" style={{ color: "#EF4444" }}>{p.penalty}</span>
                </div>
              ))}
            </div>
          </RoughFrame>
        </Reveal>
      </div>

      {/* ═══ TIE-BREAKERS ════════════════════════════════════════════════ */}
      <div className="mx-auto mt-20 max-w-3xl">
        <Reveal>
          <Eyebrow color={CYAN}>Tie-breakers</Eyebrow>
          <h2 className="mt-4 text-center font-display font-bold text-xl sm:text-2xl text-cyan-hp hp-glow tracking-tight">
            Tie-breakers
          </h2>
          <p className="mt-2 text-center font-wizard text-silver-hp/60 text-xs sm:text-sm">
            When totals are equal, in order:
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-6">
          <RoughFrame
            seed={95}
            stroke={CYAN}
            mistColor={CYAN}
            strokeWidth={1.2}
            roughness={1.5}
            bowing={1.1}
            padding={20}
            className="w-full bg-slate-hp/25 backdrop-blur-sm"
            inner="flex flex-col gap-0"
          >
            <ol className="list-none space-y-3">
              {JUDGING.tiebreakers.map((t, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span
                    className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full border font-display text-[11px] font-bold"
                    style={{ borderColor: `${CYAN}55`, color: CYAN, backgroundColor: `${CYAN}15` }}
                  >
                    {i + 1}
                  </span>
                  <span className="font-wizard text-silver-hp/85 text-sm leading-relaxed pt-0.5">{t}</span>
                </li>
              ))}
            </ol>
          </RoughFrame>
        </Reveal>
      </div>

      {/* ═══ PARTICIPANT RECOGNITION ════════════════════════════════════ */}
      <div className="mx-auto mt-20 max-w-3xl">
        <Reveal>
          <Eyebrow>Recognition</Eyebrow>
          <h2 className="mt-4 text-center font-display font-bold text-xl sm:text-2xl text-gold-hp hp-glow-gold tracking-tight">
            Participant Recognition &amp; Inclusion
          </h2>
        </Reveal>

        <Reveal delay={0.1} className="mt-6">
          <RoughFrame
            seed={100}
            stroke={GOLD}
            mistColor={GOLD}
            strokeWidth={1.2}
            roughness={1.5}
            bowing={1.2}
            padding={24}
            className="w-full bg-slate-hp/25 backdrop-blur-sm"
            inner="flex flex-col gap-4 text-center"
          >
            <p className="font-wizard text-gold-hp text-base sm:text-lg font-semibold italic">
              &quot;Awards are limited; respect is for everyone.&quot;
            </p>
            <div className="space-y-3 font-wizard text-silver-hp/80 text-sm leading-relaxed">
              <p>
                Every team that submits receives <span className="text-gold-hp">written judge feedback</span>, not only a rank.
              </p>
              <p>
                A separate <span className="text-gold-hp">Participant Recognition</span> may be given to teams that best embodied open-source practices, helped others, or showed the most growth — independent of placement.
              </p>
              <p>
                First-time participants, solo builders, and ambitious-but-incomplete projects are welcomed and encouraged, not penalised for attempting more.
              </p>
              <p className="text-silver-hp/60 italic text-xs">
                Every team that takes part is acknowledged.
              </p>
            </div>
            <p className="font-display text-[10px] uppercase tracking-[0.4em] text-gold-hp/50 pt-2">
              HexaFalls · GDG on Campus · JIS University
            </p>
          </RoughFrame>
        </Reveal>
      </div>

      {/* ═══ FOOTER CTAs ═════════════════════════════════════════════════ */}
      <Reveal delay={0.1} className="mt-20 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4">
        <RoughButton
          as="a"
          href="https://hexafalls2.devfolio.co"
          target="_blank"
          rel="noopener noreferrer"
          color={GOLD}
          glow={GOLD_GLOW}
          shimmer
          seed={23}
          className="px-8 py-3 text-[12px]"
        >
          <span>REGISTER ON DEVFOLIO</span>
          <span aria-hidden="true">↗</span>
        </RoughButton>
        <RoughButton
          as={Link}
          href="/events"
          color="#C5C6C7"
          fill={false}
          seed={31}
          className="px-8 py-3 text-[11px]"
        >
          ← ALL EVENTS
        </RoughButton>
      </Reveal>
    </section>
  );
}
