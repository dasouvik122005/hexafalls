"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import gsap from "gsap";
import Sparkles from "./Sparkles";
import RoughFrame from "./RoughFrame";
import RoughButton from "./RoughButton";
import RoughDivider from "./RoughDivider";
import HeroVideoBg from "./HeroVideoBg";

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
  // Softer eye-friendly glow when themed (especially for the cyan teams).
  // Two thin halos at low alpha read as "luminous" without the searing burn
  // of a single big shadow on bright cyans.
  const titleAccentStyle = themed
    ? {
        color: accentColor,
        textShadow: `0 0 8px ${accentColor}b3, 0 0 22px ${accentGlow || accentColor + "55"}`,
        letterSpacing: "0.02em",
      }
    : undefined;
  // Phone-aware clamp() sizing — caps the headline so it never floods the
  // viewport on narrow screens, while keeping the dramatic feel on desktop.
  const titleAccentClass = themed
    ? "block mt-2"
    : "block text-gold-hp hp-glow-gold mt-2";
  const titleAccentInlineSize = "clamp(2.6rem, 11vw, 6.5rem)";
  const titleBaseInlineSize = "clamp(2.2rem, 9vw, 5.5rem)";
  const isOpen = Boolean(apply?.open);
  const sectionRef = useRef(null);

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
        duration: 0.4,
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

  // Closed-scroll label — written in a way that reads naturally regardless
  // of which order it is (organising team, evangelists, etc.).
  const soonLabel = "Council reveals soon";

  return (
    <section
      ref={sectionRef}
      className="relative isolate overflow-hidden min-h-screen pt-28 pb-24 px-6 flex flex-col items-center"
    >
      <HeroVideoBg />
      <div aria-hidden="true" className="absolute inset-0 -z-20 hp-scrim pointer-events-none" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 pointer-events-none">
        <Sparkles count={18} />
      </div>

      {/* ── Above-the-fold: eyebrow → headline → call-to-action ───────────
          The CTA (apply or coming-soon indicator) is the focal point and
          sits high on the page. The descriptive lede/whisper moves to the
          bottom of the section so the action is what hits the eye first. */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6 flex items-center justify-center gap-3 text-[11px] uppercase tracking-[0.5em] text-cyan-hp/70 font-display text-center"
      >
        <RoughDivider width={48} height={20} color="#66FCF1" seed={3} />
        {eyebrow}
        <RoughDivider width={48} height={20} color="#66FCF1" seed={5} />
      </motion.div>

      {/* Headline */}
      <div className="text-center">
        <h1
          aria-label={`${title} ${accent}`}
          className="font-display font-black tracking-tight text-silver-hp leading-[0.95] hp-glow"
          style={{ perspective: 800, fontSize: titleBaseInlineSize, letterSpacing: "0.01em" }}
        >
          <span className="block">{splitLetters(title)}</span>
          <span
            className={titleAccentClass}
            style={{ ...(titleAccentStyle || {}), fontSize: titleAccentInlineSize }}
          >
            {splitLetters(accent)}
          </span>
        </h1>
      </div>

      {/* Primary CTA block */}
      {isOpen && apply ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-10 flex flex-col items-center gap-4"
        >
          <span
            className="inline-flex items-center gap-2 rounded-full border px-3 py-1 font-display text-[10px] uppercase tracking-[0.4em]"
            style={{
              borderColor: `${accentColor || "#D4AF37"}80`,
              color: accentColor || "#D4AF37",
              backgroundColor: `${accentColor || "#D4AF37"}1a`,
            }}
          >
            <span className="relative flex h-1.5 w-1.5">
              <span
                className="absolute inline-flex h-full w-full rounded-full opacity-70 animate-ping"
                style={{ backgroundColor: accentColor || "#D4AF37" }}
              />
              <span
                className="relative inline-flex h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: accentColor || "#D4AF37" }}
              />
            </span>
            Scroll is open
          </span>
          <RoughButton
            as="a"
            href={apply.href}
            target={apply.external ? "_blank" : undefined}
            rel={apply.external ? "noopener noreferrer" : undefined}
            color={accentColor || "#D4AF37"}
            glow={accentGlow || (themed ? `${accentColor}66` : "rgba(212,175,55,0.40)")}
            shimmer
            seed={23}
            className="px-10 sm:px-12 py-4 sm:py-5 text-[13px] sm:text-[14px] tracking-[0.4em]"
          >
            <span>{apply.label || "APPLY NOW"}</span>
            <span aria-hidden="true">↗</span>
          </RoughButton>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-10 flex flex-col items-center gap-3"
          style={themed ? { color: accentColor } : undefined}
        >
          {/* Closed scrolls show ONLY a pulse + label — no disabled apply
              pill — so the page reads as informational, not "almost open". */}
          <span className="inline-flex items-center gap-3 font-display text-[11px] uppercase tracking-[0.5em]">
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
            <span className={themed ? "" : "text-gold-hp/80"}>{soonLabel}</span>
          </span>
        </motion.div>
      )}

      <RoughButton
        as={Link}
        href={backHref}
        color="#C5C6C7"
        fill={false}
        seed={31}
        className="mt-5 px-5 py-2 text-[10px] tracking-[0.35em] opacity-75 hover:opacity-100 transition"
      >
        {backLabel}
      </RoughButton>

      {/* ── Below-the-fold: writeup (lede + whisper) ───────────────────────
          Pushed down so the apply / status pill is what hits first. */}
      <div className="mx-auto mt-20 sm:mt-24 w-full max-w-2xl">
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
    </section>
  );
}
