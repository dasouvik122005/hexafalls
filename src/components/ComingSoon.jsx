"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import Sparkles from "./Sparkles";
import RoughFrame from "./RoughFrame";
import RoughButton from "./RoughButton";

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
  // theme overrides — when set, replace the default cyan/gold palette
  accentColor,           // hex e.g. "#E879F9"
  accentGlow,            // rgba e.g. "rgba(232,121,249,0.30)"
  // back button
  backHref  = "/",
  backLabel = "← BACK TO THE HALL",
}) {
  const themed = Boolean(accentColor);
  const titleAccentStyle = themed
    ? { color: accentColor, textShadow: `0 0 28px ${accentGlow || accentColor}` }
    : undefined;
  const titleAccentClass = themed
    ? "block text-[14vw] sm:text-[9vw] md:text-[7vw] mt-2"
    : "block text-gold-hp hp-glow-gold text-[14vw] sm:text-[9vw] md:text-[7vw] mt-2";
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
        gsap.set(".cs-letter", { opacity: 1, y: 0 });
        return;
      }
      gsap.set(".cs-letter", { opacity: 0, y: 24 });
      gsap.to(".cs-letter", {
        opacity: 1, y: 0,
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
          <span className={titleAccentClass} style={titleAccentStyle}>
            {splitLetters(accent)}
          </span>
        </h1>
      </div>

      {/* Lede in a rough frame */}
      <div className="mx-auto mt-14 w-full max-w-2xl">
        <RoughFrame
          seed={37}
          stroke={accentColor || "#66FCF1"}
          mistColor={accentColor || "#66FCF1"}
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
        className="mt-12 flex items-center gap-3 font-display text-[10px] uppercase tracking-[0.5em]"
        style={themed ? { color: accentColor } : undefined}
      >
        <span className="relative flex h-2 w-2">
          <span
            className="absolute inline-flex h-full w-full rounded-full opacity-60 animate-ping"
            style={{ backgroundColor: accentColor || "#D4AF37" }}
          />
          <span
            className="relative inline-flex h-2 w-2 rounded-full"
            style={{ backgroundColor: accentColor || "#D4AF37" }}
          />
        </span>
        <span className={themed ? "" : "text-gold-hp/80"}>Inscription in progress</span>
      </motion.div>

      {/* Apply CTA + Back — sits side-by-side on every breakpoint */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.5 }}
        className="mt-12 flex flex-row flex-wrap items-center justify-center gap-4"
      >
        {apply && (apply.open ? (
          <RoughButton
            as="a"
            href={apply.href}
            target={apply.external ? "_blank" : undefined}
            rel={apply.external ? "noopener noreferrer" : undefined}
            color={accentColor || "#D4AF37"}
            glow={accentGlow || (themed ? `${accentColor}55` : "rgba(212,175,55,0.30)")}
            shimmer
            seed={23}
            className="px-7 py-3 text-[12px]"
          >
            <span>{apply.label || "APPLY NOW"}</span>
            <span>↗</span>
          </RoughButton>
        ) : (
          <RoughButton
            color={accentColor || "#66FCF1"}
            glow={accentGlow || "rgba(102,252,241,0.25)"}
            shimmer
            disabled
            aria-disabled="true"
            seed={29}
            className="px-7 py-3 text-[12px] hp-pulse"
          >
            <span>{apply.label || "APPLY NOW"}</span>
            <span className="text-[9px] tracking-[0.25em] px-2 py-0.5 rounded-full border border-gold-hp/60 bg-gold-hp/10 text-gold-hp hp-glow-gold">
              COMING SOON
            </span>
          </RoughButton>
        ))}

        <RoughButton
          as={Link}
          href={backHref}
          color="#C5C6C7"
          fill={false}
          seed={31}
          className="px-7 py-3 text-[11px]"
        >
          {backLabel}
        </RoughButton>
      </motion.div>
    </section>
  );
}
