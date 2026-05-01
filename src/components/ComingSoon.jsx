"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import Sparkles from "./Sparkles";
import RoughFrame from "./RoughFrame";

/**
 * Generic "Coming Soon" page in the wizarding theme.
 * Used for stubbed routes (core team, sponsors, timeline, register, judges, etc.)
 */
/**
 * `apply` shape:
 *   { href: string, label?: string, open?: boolean, external?: boolean }
 * - open=false renders a disabled "APPLY NOW · COMING SOON" pill
 * - open=true renders an active gold "APPLY NOW ↗" link (use external for new tab)
 */
export default function ComingSoon({
  eyebrow = "A scroll yet to be inked",
  title  = "Coming",
  accent = "Soon",
  lede   = "The owls are still in flight. This corridor of the castle will open soon — return for the unveiling.",
  whisper = "“Patience, young wizard. The map reveals itself in due course.”",
  apply,
}) {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const yStars = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const yMid   = useTransform(scrollYProgress, [0, 1], ["0%", "55%"]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      if (reduce) {
        gsap.set(".cs-letter", { opacity: 1, y: 0, filter: "blur(0px)" });
        return;
      }
      gsap.set(".cs-letter", { opacity: 0, y: 24, filter: "blur(10px)" });
      gsap.to(".cs-letter", {
        opacity: 1, y: 0, filter: "blur(0px)",
        duration: 1.0,
        ease: "power3.out",
        stagger: { each: 0.045, from: "start" },
        delay: 0.15,
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const splitLetters = (text) =>
    [...text].map((ch, i) => (
      <span
        key={i}
        className="cs-letter inline-block"
        style={{ whiteSpace: ch === " " ? "pre" : "normal" }}
      >
        {ch}
      </span>
    ));

  return (
    <section
      ref={sectionRef}
      className="relative isolate overflow-hidden min-h-screen pt-32 pb-24 px-6 flex flex-col items-center justify-center"
    >
      <motion.div style={{ y: yStars }} className="absolute inset-0 -z-30 hp-stars opacity-70" />
      <motion.div style={{ y: yMid }} className="absolute inset-0 -z-20 hp-scrim" />
      <motion.div style={{ y: yMid }} className="absolute inset-0 -z-10">
        <Sparkles count={28} />
      </motion.div>

      {/* Eyebrow */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
        className="mb-6 flex items-center justify-center gap-3 text-[11px] uppercase tracking-[0.5em] text-cyan-hp/70 font-display text-center"
      >
        <span className="h-px w-8 bg-cyan-hp/40" />
        {eyebrow}
        <span className="h-px w-8 bg-cyan-hp/40" />
      </motion.div>

      {/* Headline */}
      <div className="text-center">
        <h1
          aria-label={`${title} ${accent}`}
          className="font-display font-black tracking-tight text-silver-hp leading-[0.95] text-[14vw] sm:text-[10vw] md:text-[8vw] hp-glow"
          style={{ perspective: 800 }}
        >
          <span className="block">{splitLetters(title)}</span>
          <span className="block text-gold-hp hp-glow-gold text-[14vw] sm:text-[9vw] md:text-[7vw] mt-2">
            {splitLetters(accent)}
          </span>
        </h1>
      </div>

      {/* Lede in a rough frame */}
      <div className="mx-auto mt-14 w-full max-w-2xl">
        <RoughFrame
          seed={37}
          stroke="#66FCF1"
          mistColor="#66FCF1"
          strokeWidth={1.4}
          roughness={1.5}
          bowing={1.2}
          padding={26}
          className="w-full bg-slate-hp/30 backdrop-blur-sm"
          inner="flex flex-col items-center text-center gap-4"
        >
          <p className="font-wizard text-silver-hp/80 text-base sm:text-lg leading-relaxed">
            {lede}
          </p>
          <p className="font-wizard italic text-silver-hp/55 text-sm">
            {whisper}
          </p>
        </RoughFrame>
      </div>

      {/* Pulsing "owl in flight" indicator */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.4 }}
        className="mt-12 flex items-center gap-3 font-display text-[10px] uppercase tracking-[0.5em] text-gold-hp/80"
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full rounded-full bg-gold-hp opacity-60 animate-ping" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-gold-hp" />
        </span>
        Inscription in progress
      </motion.div>

      {/* Apply CTA + Back */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.5 }}
        className="mt-12 flex flex-col sm:flex-row items-center gap-4"
      >
        {apply && (apply.open ? (
          <a
            href={apply.href}
            target={apply.external ? "_blank" : undefined}
            rel={apply.external ? "noopener noreferrer" : undefined}
            className="relative inline-flex items-center gap-3 overflow-hidden rounded-full border border-gold-hp/60 bg-gold-hp/10 px-7 py-3 font-display tracking-[0.3em] text-[12px] text-gold-hp hp-glow-gold hover:bg-gold-hp/15 hover:border-gold-hp hover:shadow-[0_0_24px_rgba(212,175,55,0.35)] transition"
          >
            <span className="relative z-10">{apply.label || "APPLY NOW"}</span>
            <span className="relative z-10">↗</span>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(212,175,55,0.25), transparent)",
                animation: "hp-shimmer 3.2s linear infinite",
              }}
            />
          </a>
        ) : (
          <button
            type="button"
            disabled
            aria-disabled="true"
            className="relative inline-flex items-center gap-3 rounded-full border border-cyan-hp/50 bg-cyan-hp/10 px-7 py-3 font-display tracking-[0.3em] text-[12px] text-cyan-hp cursor-not-allowed select-none overflow-hidden hp-pulse"
          >
            <span className="relative z-10">{apply.label || "APPLY NOW"}</span>
            <span className="relative z-10 text-[9px] tracking-[0.25em] px-2 py-0.5 rounded-full border border-gold-hp/60 bg-gold-hp/10 text-gold-hp hp-glow-gold">
              COMING SOON
            </span>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(102,252,241,0.25), transparent)",
                animation: "hp-shimmer 3.2s linear infinite",
              }}
            />
          </button>
        ))}

        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-full border border-silver-hp/30 px-7 py-3 font-display tracking-[0.3em] text-[11px] text-silver-hp/80 hover:text-silver-hp hover:border-silver-hp/70 transition"
        >
          ← BACK TO THE HALL
        </Link>
      </motion.div>
    </section>
  );
}
