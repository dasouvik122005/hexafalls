"use client";

import { useEffect, useRef } from "react";
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
const BLUE = "#3B82F6";

/* ── "already registered" badge — shown in place of the register CTA when
      the signed-in viewer is already in this event. ──────────────────── */
function RegisteredBadge({ href, label = "VIEW MY TEAM" }) {
  return (
    <>
      <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/50 bg-emerald-400/10 px-3 py-1 font-display text-[10px] uppercase tracking-[0.4em] text-emerald-300">
        <span aria-hidden="true">✓</span> You&apos;re registered
      </span>
      <RoughButton
        as={Link}
        href={href}
        color="#4ade80"
        glow="rgba(74,222,128,0.3)"
        fill={false}
        seed={23}
        className="px-10 sm:px-12 py-4 leading-none text-[13px] sm:text-[14px] tracking-[0.4em]"
      >
        <span>{label}</span>
        <span aria-hidden="true">↗</span>
      </RoughButton>
    </>
  );
}

/* ── reusable section eyebrow ────────────────────────────────────────── */
function Eyebrow({ children, color = GOLD }) {
  return (
    <div className="flex items-center justify-center gap-3 text-[11px] uppercase tracking-[0.5em] font-display text-center"
         style={{ color: `${color}cc` }}>
      <div className="w-12 h-[2px] rounded-full opacity-60 shadow-[0_0_5px_currentColor]" style={{ background: `linear-gradient(to right, transparent, ${color})` }} />
      {children}
      <div className="w-12 h-[2px] rounded-full opacity-60 shadow-[0_0_5px_currentColor]" style={{ background: `linear-gradient(to left, transparent, ${color})` }} />
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

/* ── track card — matte, shows rune + name + description ─────────────── */
function TrackCard({ track: t }) {
  return (
    <div
      tabIndex={0}
      role="group"
      aria-label={`${t.name} track`}
      className="group flex h-full flex-col rounded-sm border p-5 outline-none transition-colors duration-200"
      style={{ background: "rgba(20,18,16,0.55)", borderColor: `${t.color}33` }}
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl select-none" style={{ color: t.color }} aria-hidden="true">
          {t.rune}
        </span>
        <span className="font-display text-sm font-bold uppercase tracking-wide" style={{ color: t.color }}>
          {t.name}
        </span>
      </div>
      <p className="mt-3 font-wizard text-sm leading-relaxed text-silver-hp/80">{t.desc}</p>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════ */
export default function HackathonDetails({ registered = null }) {
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
      {/* Dark textured magical background */}
      <div
        className="absolute inset-0 -z-40 opacity-40 bg-cover bg-center"
        style={{ backgroundImage: "url('/textures/bg-stone.webp')", mixBlendMode: "luminosity" }}
      />
      <div className="absolute inset-0 -z-50 bg-[#0B0C10]" />
      
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
            style={{
              color: GOLD,
              textShadow: "0 0 8px rgba(212,175,55,0.22)",
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
          {registered ? (
            <RegisteredBadge href={registered.href} label={registered.label} />
          ) : (
            <>
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
                as={Link}
                href="/events/hackathon/register"
                color={GOLD}
                glow={GOLD_GLOW}
                fill={false}
                shimmer
                seed={23}
                className="px-10 sm:px-12 py-4 sm:py-5 leading-none text-[13px] sm:text-[14px] tracking-[0.4em]"
              >
                <span>REGISTER · HACKATHON</span>
                <span aria-hidden="true">↗</span>
              </RoughButton>
            </>
          )}
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
          <div className="relative w-full rounded-xl border border-cyan-hp/30 shadow-[0_10px_30px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-300 hover:shadow-[0_15px_40px_rgba(0,0,0,0.6)] hover:border-cyan-hp/50 group">
            {/* Realistic background image */}
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-70 group-hover:opacity-90 transition-opacity duration-500"
              style={{ backgroundImage: "url('/textures/table_bg_cyan.webp')" }} 
            />
            {/* Dark overlay for readability */}
            <div className="absolute inset-0 bg-black/60 group-hover:bg-black/50 transition-colors duration-500" />
            
            {/* table-style layout */}
            <div className="relative z-10 divide-y divide-cyan-hp/20">
              {/* header */}
              <div className="grid grid-cols-[2.5rem_1fr_1fr] sm:grid-cols-[3rem_1.4fr_1fr] gap-x-3 px-4 sm:px-6 py-4 text-[10px] uppercase tracking-[0.3em] font-display text-cyan-hp bg-cyan-hp/5 shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                <span>#</span>
                <span>Requirement</span>
                <span>Rationale</span>
              </div>
              {JUDGING.eligibility.map((r) => (
                <div
                  key={r.id}
                  className="grid grid-cols-[2.5rem_1fr_1fr] sm:grid-cols-[3rem_1.4fr_1fr] gap-x-3 px-4 sm:px-6 py-5 items-start hover:bg-cyan-hp/10 transition-colors"
                >
                  <span className="font-display text-cyan-hp/80 text-sm md:text-base font-bold" style={{ textShadow: "0 0 8px rgba(102,252,241,0.5)" }}>{r.id}</span>
                  <span className="font-wizard text-[#e8e4d6] text-sm md:text-base lg:text-lg leading-relaxed" style={{ textShadow: "0 2px 4px rgba(0,0,0,1)" }}>{r.req}</span>
                  <span className="font-wizard text-[#e8e4d6]/60 text-xs md:text-sm lg:text-base leading-relaxed italic" style={{ textShadow: "0 2px 4px rgba(0,0,0,1)" }}>{r.rationale}</span>
                </div>
              ))}
            </div>
          </div>
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
              <div className="relative h-full w-full rounded-xl overflow-hidden shadow-[0_10px_20px_rgba(0,0,0,0.5)] border border-gold-hp/20 group hover:shadow-[0_15px_30px_rgba(0,0,0,0.7)] transition-all duration-300">
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-90 transition-opacity duration-300 group-hover:opacity-100"
                  style={{ backgroundImage: "url('/textures/realistic_card_bg.webp')" }} 
                />
                <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors duration-300" />
                
                <div className="relative z-10 p-6 flex flex-col gap-4 h-full">
                  {/* header row */}
                  <div className="flex items-center justify-between">
                    <span className="font-display text-[10px] uppercase tracking-[0.3em] text-[#e8e4d6]/60 drop-shadow-md">
                      Criterion {c.id}
                    </span>
                    <span
                      className="inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 font-display text-[11px] font-bold tracking-wide shadow-[0_2px_10px_rgba(0,0,0,0.5)]"
                      style={{ borderColor: `${GOLD}60`, color: GOLD, backgroundColor: `${GOLD}33` }}
                    >
                      {c.weight}
                      <span className="text-[8px] tracking-[0.2em] text-[#e8e4d6]/80">PTS</span>
                    </span>
                  </div>
                  {/* weight bar */}
                  <div className="w-full h-1.5 rounded-full bg-black/60 shadow-inner overflow-hidden border border-gold-hp/20">
                    <motion.div
                      className="h-full rounded-full shadow-[0_0_10px_rgba(212,175,55,0.8)]"
                      style={{ backgroundColor: GOLD }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${(c.weight / 30) * 100}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.2 + i * 0.05, ease: "easeOut" }}
                    />
                  </div>
                  <h3 className="font-display text-base sm:text-lg tracking-tight text-[#e8e4d6]" style={{ textShadow: `0 2px 4px rgba(0,0,0,0.9), 0 0 14px ${GOLD_GLOW}` }}>
                    {c.name}
                  </h3>
                  <p className="font-wizard text-[#e8e4d6]/80 text-sm leading-relaxed mt-auto drop-shadow-md" style={{ textShadow: "0 2px 4px rgba(0,0,0,1)" }}>
                    {c.desc}
                  </p>
                </div>
              </div>
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
          <div className="relative w-full rounded-xl border border-cyan-hp/30 shadow-[0_10px_30px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-300 hover:shadow-[0_15px_40px_rgba(0,0,0,0.6)] hover:border-cyan-hp/50 group">
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-70 group-hover:opacity-90 transition-opacity duration-500"
              style={{ backgroundImage: "url('/textures/table_bg_cyan.webp')" }} 
            />
            <div className="absolute inset-0 bg-black/60 group-hover:bg-black/50 transition-colors duration-500" />
            
            <div className="relative z-10 divide-y divide-cyan-hp/20">
              <div className="grid grid-cols-[3.5rem_5rem_1fr] gap-x-3 px-4 sm:px-6 py-4 text-[10px] uppercase tracking-[0.3em] font-display text-cyan-hp bg-cyan-hp/5 shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                <span>Score</span>
                <span>Band</span>
                <span>Meaning</span>
              </div>
              {JUDGING.scale.map((s) => (
                <div
                  key={s.score}
                  className="grid grid-cols-[3.5rem_5rem_1fr] gap-x-3 px-4 sm:px-6 py-4 items-center hover:bg-cyan-hp/10 transition-colors"
                >
                  <span className="font-display text-cyan-hp text-sm md:text-base font-bold" style={{ textShadow: "0 0 8px rgba(102,252,241,0.5)" }}>{s.score}</span>
                  <span className="font-display text-[#e8e4d6] text-xs md:text-sm" style={{ textShadow: "0 2px 4px rgba(0,0,0,1)" }}>{s.band}</span>
                  <span className="font-wizard text-[#e8e4d6]/80 text-xs md:text-sm" style={{ textShadow: "0 2px 4px rgba(0,0,0,1)" }}>{s.meaning}</span>
                </div>
              ))}
            </div>
          </div>
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
              <div className="relative h-full w-full rounded-xl overflow-hidden shadow-[0_10px_20px_rgba(0,0,0,0.5)] border border-gold-hp/20 group hover:shadow-[0_15px_30px_rgba(0,0,0,0.7)] transition-all duration-300">
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-90 transition-opacity duration-300 group-hover:opacity-100"
                  style={{ backgroundImage: "url('/textures/realistic_card_bg.webp')" }} 
                />
                <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors duration-300" />
                
                <div className="relative z-10 p-5 flex flex-col gap-3 h-full">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-sm text-[#e8e4d6] tracking-tight" style={{ textShadow: "0 2px 4px rgba(0,0,0,1)" }}>{b.item}</span>
                    <span
                      className="rounded-full border px-2 py-0.5 font-display text-[11px] font-bold shadow-md"
                      style={{ borderColor: `${GOLD}55`, color: GOLD, backgroundColor: `${GOLD}33` }}
                    >
                      {b.pts}
                    </span>
                  </div>
                  <p className="font-wizard text-[#e8e4d6]/80 text-xs leading-relaxed" style={{ textShadow: "0 2px 4px rgba(0,0,0,1)" }}>{b.note}</p>
                </div>
              </div>
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
          <div className="relative w-full rounded-xl border border-[#EF4444]/40 shadow-[0_10px_30px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-300 hover:shadow-[0_15px_40px_rgba(0,0,0,0.6)] hover:border-[#EF4444]/60 group">
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-70 group-hover:opacity-90 transition-opacity duration-500"
              style={{ backgroundImage: "url('/textures/table_bg_red.webp')" }} 
            />
            <div className="absolute inset-0 bg-black/60 group-hover:bg-black/50 transition-colors duration-500" />
            
            <div className="relative z-10 divide-y divide-[#EF4444]/20">
              <div className="grid grid-cols-[1fr_auto] gap-x-4 px-4 sm:px-6 py-4 text-[10px] uppercase tracking-[0.3em] font-display bg-[#EF4444]/10 shadow-[0_2px_10px_rgba(0,0,0,0.5)]" style={{ color: "rgba(239,68,68,0.9)", textShadow: "0 0 8px rgba(239,68,68,0.4)" }}>
                <span>Issue</span>
                <span>Penalty</span>
              </div>
              {JUDGING.penalties.map((p) => (
                <div
                  key={p.issue}
                  className="grid grid-cols-[1fr_auto] gap-x-4 px-4 sm:px-6 py-5 items-center hover:bg-[#EF4444]/10 transition-colors"
                >
                  <span className="font-wizard text-[#e8e4d6]/90 text-sm md:text-base lg:text-lg leading-relaxed" style={{ textShadow: "0 2px 4px rgba(0,0,0,1)" }}>{p.issue}</span>
                  <span className="font-display text-sm md:text-base lg:text-lg font-bold whitespace-nowrap" style={{ color: "#EF4444", textShadow: "0 0 10px rgba(239,68,68,0.6)" }}>{p.penalty}</span>
                </div>
              ))}
            </div>
          </div>
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
          <div className="relative w-full rounded-xl overflow-hidden shadow-[0_15px_30px_rgba(0,0,0,0.6)] border border-cyan-hp/30">
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-100"
              style={{ backgroundImage: "url('/textures/realistic_card_bg.webp')" }} 
            />
            <div className="absolute inset-0 bg-black/60" />
            <div className="relative z-10 p-8">
              <ol className="list-none space-y-4">
                {JUDGING.tiebreakers.map((t, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <span
                      className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full border font-display text-[12px] font-bold shadow-md"
                      style={{ borderColor: `${CYAN}77`, color: CYAN, backgroundColor: `${CYAN}22` }}
                    >
                      {i + 1}
                    </span>
                    <span className="font-wizard text-[#e8e4d6]/95 text-base leading-relaxed pt-0.5 drop-shadow-md" style={{ textShadow: "0 2px 4px rgba(0,0,0,1)" }}>{t}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
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
          <div className="relative w-full rounded-xl overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.6)] border border-gold-hp/30 group">
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-100 transition-opacity duration-500"
              style={{ backgroundImage: "url('/textures/realistic_card_bg.webp')" }} 
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/80 group-hover:from-black/50 group-hover:to-black/70 transition-colors duration-500" />
            
            <div className="relative z-10 p-8 sm:p-10 flex flex-col gap-6 text-center">
              <p className="font-wizard text-gold-hp text-lg sm:text-xl font-bold italic drop-shadow-md" style={{ textShadow: "0 2px 4px rgba(0,0,0,1)" }}>
                &quot;Awards are limited; respect is for everyone.&quot;
              </p>
              <div className="space-y-4 font-wizard text-[#e8e4d6]/90 text-sm sm:text-base leading-relaxed drop-shadow-md" style={{ textShadow: "0 2px 4px rgba(0,0,0,1)" }}>
                <p>
                  Every team that submits receives <span className="text-gold-hp font-bold">written judge feedback</span>, not only a rank.
                </p>
                <p>
                  A separate <span className="text-gold-hp font-bold">Participant Recognition</span> may be given to teams that best embodied open-source practices, helped others, or showed the most growth — independent of placement.
                </p>
                <p>
                  First-time participants, solo builders, and ambitious-but-incomplete projects are welcomed and encouraged, not penalised for attempting more.
                </p>
                <p className="text-[#e8e4d6]/50 italic text-xs sm:text-sm mt-4 border-t border-gold-hp/20 pt-4">
                  Every team that takes part is acknowledged.
                </p>
              </div>
              <p className="font-display text-[10px] uppercase tracking-[0.4em] text-gold-hp/50 pt-2 drop-shadow-md">
                HexaFalls · GDG on Campus · JIS University
              </p>
            </div>
          </div>
        </Reveal>
      </div>

      {/* ═══ FOOTER CTAs ═════════════════════════════════════════════════ */}
      <Reveal delay={0.1} className="mt-20 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4">
        {registered ? (
          <RoughButton
            as={Link}
            href={registered.href}
            color="#4ade80"
            glow="rgba(74,222,128,0.3)"
            fill={false}
            seed={23}
            className="px-8 py-3 leading-none text-[12px]"
          >
            <span>{registered.label ?? "VIEW MY TEAM"}</span>
            <span aria-hidden="true">↗</span>
          </RoughButton>
        ) : (
          <RoughButton
            as={Link}
            href="/events/hackathon/register"
            color={GOLD}
            glow={GOLD_GLOW}
            fill={false}
            shimmer
            seed={23}
            className="px-8 py-3 leading-none text-[12px]"
          >
            <span>REGISTER · HACKATHON</span>
            <span aria-hidden="true">↗</span>
          </RoughButton>
        )}
        <RoughButton
          as={Link}
          href="/events"
          className="group relative inline-flex items-center justify-center gap-2 px-8 py-3 text-[11px] font-display uppercase tracking-[0.4em] font-bold rounded-lg overflow-hidden transition-all duration-300 shadow-[0_5px_15px_rgba(0,0,0,0.6)] hover:shadow-[0_10px_25px_rgba(197,198,199,0.2)] hover:-translate-y-0.5"
          style={{ color: '#C5C6C7', textShadow: "0 2px 4px rgba(0,0,0,1)" }}
        >
          <div className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:opacity-60 transition-opacity duration-300" style={{ backgroundImage: "url('/textures/realistic_card_bg.webp')" }} />
          <div className="absolute inset-0 bg-black/80 group-hover:bg-black/70 transition-colors duration-300" />
          <div className="absolute inset-0 border border-[#C5C6C7]/30 rounded-lg group-hover:border-[#C5C6C7]/50 transition-colors duration-300" />
          <span className="relative z-10">← ALL EVENTS</span>
        </RoughButton>
      </Reveal>
    </section>
  );
}
