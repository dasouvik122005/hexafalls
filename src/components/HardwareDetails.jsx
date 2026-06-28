"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import gsap from "gsap";
import Sparkles from "./Sparkles";
import RoughButton from "./RoughButton";
import RoughDivider from "./RoughDivider";
import { HARDWARE_TRACKS } from "@/lib/routes";

const GOLD = "#D4AF37";
const GOLD_GLOW = "rgba(212,175,55,0.25)";
// Hardware house colour (green) — used for the registration CTAs.
const GREEN = "#22C55E";
const GREEN_GLOW = "rgba(34,197,94,0.25)";

/* ── "already registered" badge — shown when the viewer is already in a
      hardware squad/entry. ───────────────────────────────────────────── */
function RegisteredBadge({ href, label = "VIEW MY REGISTRATION" }) {
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
        className="px-10 sm:px-12 py-4 leading-none text-[12px] sm:text-[13px] tracking-[0.35em]"
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

/* ── interactive track card with permanently visible description ────────────── */
function TrackCard({ track: t }) {
  const cardContent = (
    <>
      <div className="flex items-center gap-3">
        <span className="text-2xl select-none" style={{ color: t.color }} aria-hidden="true">{t.rune}</span>
        <span className="font-display text-sm font-bold uppercase tracking-wide" style={{ color: t.color }}>{t.name}</span>
      </div>
      <p className="mt-3 font-wizard text-sm leading-relaxed text-silver-hp/80">{t.desc}</p>
      {t.slug && (
        <span className="mt-3 font-display text-[10px] uppercase tracking-widest opacity-70 transition-opacity group-hover:opacity-100" style={{ color: t.color }}>
          View details ↗
        </span>
      )}
    </>
  );
  const cls = `group relative flex h-full flex-col rounded-sm border p-5 outline-none transition-colors duration-200 ${t.slug ? "cursor-pointer" : "cursor-default"}`;
  const style = { background: "rgba(20,18,16,0.55)", borderColor: `${t.color}33` };
  if (t.slug) {
    return (
      <Link href={`/events/hardware/${t.slug}`} className={cls} style={style} aria-label={`View details for ${t.name} track`}>
        {cardContent}
      </Link>
    );
  }
  return (
    <div tabIndex={0} role="group" aria-label={`${t.name} track`} className={cls} style={style}>
      {cardContent}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════ */
export default function HardwareDetails({ registered = null }) {
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
      {/* Matte dark background (no bright radial gradient) */}
      <div
        className="absolute inset-0 -z-40"
        style={{ background: "linear-gradient(180deg, #0B0C10 0%, #0e0c0a 100%)" }}
      />
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
        <Reveal delay={0.25} className="mt-8 flex flex-col items-center gap-3">
          {registered ? (
            <RegisteredBadge href={registered.href} label={registered.label} />
          ) : (
            <>
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
                  <span>COMPETITION · TEAM 2–4</span>
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
            </>
          )}
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

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {HARDWARE_TRACKS.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.04}>
              <TrackCard track={t} />
            </Reveal>
          ))}
        </div>
      </div>



      {/* ═══ FOOTER CTAs ═════════════════════════════════════════════════ */}
      <Reveal delay={0.1} className="mt-28 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4">
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
            <span>{registered.label ?? "VIEW MY REGISTRATION"} ↗</span>
          </RoughButton>
        ) : (
          <>
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
          </>
        )}
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
