"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import Link from "next/link";
import Sparkles from "./Sparkles";
import HeroVideoBg from "./HeroVideoBg";
import RoughFrame from "./RoughFrame";
import RoughButton from "./RoughButton";
import RoughDivider from "./RoughDivider";
import RoughStar from "./RoughStar";
import RoughTape from "./RoughTape";
import RoughCorners from "./RoughCorners";
import RoughTicks from "./RoughTicks";

import FAQS from "@/data/faq.json";

/* ─── Wax Seal SVG — the "lock" icon on each sealed scroll ───────────────── */
function WaxSeal({ color = "#D4AF37", broken = false }) {
  return (
    <div
      className="relative flex items-center justify-center transition-transform duration-500"
      style={{
        width: 36,
        height: 36,
        transform: broken ? "scale(0.85) rotate(12deg)" : "scale(1) rotate(0deg)",
        opacity: broken ? 0.4 : 1,
      }}
    >
      <svg viewBox="0 0 40 40" width="36" height="36" aria-hidden="true">
        {/* Outer seal circle */}
        <circle
          cx="20"
          cy="20"
          r="16"
          fill={broken ? "transparent" : color}
          stroke={color}
          strokeWidth="2"
          opacity={broken ? 0.3 : 0.9}
        />
        {/* Drip marks */}
        {!broken && (
          <>
            <circle cx="10" cy="32" r="3" fill={color} opacity="0.6" />
            <circle cx="30" cy="33" r="2.5" fill={color} opacity="0.5" />
            <circle cx="6" cy="24" r="2" fill={color} opacity="0.4" />
          </>
        )}
        {/* Inner emblem — "H" for HexaFalls */}
        <text
          x="20"
          y="24"
          textAnchor="middle"
          fontSize="14"
          fontWeight="bold"
          fill={broken ? color : "#0B0C10"}
          opacity={broken ? 0.4 : 0.85}
          fontFamily="serif"
        >
          H
        </text>
      </svg>
      {/* Glow behind the seal */}
      {!broken && (
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            boxShadow: `0 0 14px ${color}55, 0 0 28px ${color}22`,
          }}
        />
      )}
    </div>
  );
}

/* ─── Single FAQ Scroll ──────────────────────────────────────────────────── */
function FaqScroll({ faq, index, isOpen, onToggle }) {
  const seed = 100 + index * 13;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.05 }}
      transition={{ duration: 0.4, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
    >
      <RoughFrame
        seed={seed}
        stroke={isOpen ? faq.accentColor : "#C5C6C7"}
        strokeWidth={isOpen ? 1.6 : 1.2}
        roughness={1.6}
        bowing={1.3}
        padding={0}
        className={`w-full transition-colors duration-500 ${
          isOpen ? "bg-slate-hp/40" : "bg-slate-hp/20"
        } backdrop-blur-sm`}
        mist={isOpen}
        mistColor={faq.accentColor}
      >
        {/* ── Question header (clickable) ──────────────────────────────── */}
        <button
          type="button"
          onClick={onToggle}
          className="w-full text-left px-5 py-4 sm:px-6 sm:py-5 flex items-center gap-4 group cursor-pointer"
          aria-expanded={isOpen}
          id={`faq-q-${index}`}
          aria-controls={`faq-a-${index}`}
        >
          {/* Wax seal */}
          <WaxSeal color={faq.accentColor} broken={isOpen} />

          {/* Question text */}
          <div className="flex-1 min-w-0">
            <span
              className="font-display text-sm sm:text-base tracking-wide leading-snug transition-colors duration-300"
              style={{
                color: isOpen ? faq.accentColor : "#C5C6C7",
                textShadow: isOpen
                  ? `0 0 16px ${faq.accentColor}40`
                  : "none",
              }}
            >
              <span
                className="mr-2 font-wizard opacity-60"
                style={{ color: faq.accentColor }}
                aria-hidden="true"
              >
                {faq.rune}
              </span>
              {faq.q}
            </span>
          </div>

          {/* Open/close chevron */}
          <div
            className="shrink-0 transition-transform duration-500"
            style={{
              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke={isOpen ? faq.accentColor : "#C5C6C7"}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M4 6l4 4 4-4" />
            </svg>
          </div>
        </button>

        {/* ── Answer panel (animated) ──────────────────────────────────── */}
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              key={`faq-answer-${index}`}
              id={`faq-a-${index}`}
              role="region"
              aria-labelledby={`faq-q-${index}`}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="relative px-5 pb-5 sm:px-6 sm:pb-6 pt-0">
                {/* Separator line */}
                <div
                  className="mb-4 h-px w-full"
                  style={{
                    background: `linear-gradient(to right, ${faq.accentColor}50, transparent 80%)`,
                  }}
                />

                {/* Answer text */}
                <div className="relative">
                  <p className="font-wizard text-silver-hp/85 text-base sm:text-lg leading-relaxed">
                    {faq.a}
                  </p>

                  {/* Decoration — varies per scroll for scrapbook variety */}
                  {faq.decoration === "tape" && (
                    <div className="absolute -top-3 -right-1 opacity-50 pointer-events-none">
                      <RoughTape
                        color={faq.accentColor}
                        width={56}
                        height={14}
                        rotation={-18}
                        inset={0}
                        seed={seed + 5}
                      />
                    </div>
                  )}
                  {faq.decoration === "corners" && (
                    <div className="absolute inset-0 pointer-events-none opacity-30">
                      <RoughCorners
                        color={faq.accentColor}
                        length={12}
                        inset={-4}
                        seed={seed + 5}
                      />
                    </div>
                  )}
                  {faq.decoration === "ticks" && (
                    <div className="absolute inset-0 pointer-events-none opacity-30">
                      <RoughTicks
                        color={faq.accentColor}
                        arm={6}
                        inset={-2}
                        seed={seed + 5}
                      />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </RoughFrame>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */
export default function FAQ() {
  const sectionRef = useRef(null);
  const [openIndex, setOpenIndex] = useState(null);

  /* ── GSAP letter-stagger for headline ──────────────────────────────────── */
  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      if (reduce) {
        gsap.set(".ror-letter", { opacity: 1, y: 0 });
        return;
      }
      gsap.set(".ror-letter", { opacity: 0, y: 24 });
      gsap.to(".ror-letter", {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: "power3.out",
        stagger: { each: 0.04, from: "start" },
        delay: 0.15,
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const splitLetters = (text) =>
    [...text].map((ch, i) => (
      <span
        key={i}
        className="ror-letter inline-block"
        style={{ whiteSpace: ch === " " ? "pre" : "normal" }}
      >
        {ch}
      </span>
    ));

  const handleToggle = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section
      ref={sectionRef}
      className="relative isolate overflow-hidden min-h-screen pt-32 pb-24 px-6"
    >
      {/* ── Parallax background stack ────────────────────────────────────── */}
      <HeroVideoBg />
      <div aria-hidden="true" className="absolute inset-0 -z-20 hp-scrim pointer-events-none" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 pointer-events-none">
        <Sparkles count={20} />
      </div>

      {/* Scattered decorative stars */}
      <RoughStar
        size={24}
        color="#A78BFA"
        seed={91}
        className="absolute top-28 left-8 sm:left-16 opacity-60 hp-float"
        style={{ animationDuration: "11s" }}
      />
      <RoughStar
        size={28}
        color="#D4AF37"
        fill
        seed={97}
        className="absolute top-48 right-10 sm:right-20 opacity-70 hp-float"
        style={{ animationDuration: "13s", animationDelay: "2s" }}
      />
      <RoughStar
        size={18}
        color="#66FCF1"
        seed={103}
        className="absolute bottom-40 left-12 opacity-50 hp-float"
        style={{ animationDuration: "9s", animationDelay: "1s" }}
      />

      {/* ── Eyebrow ─────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mx-auto mb-6 flex max-w-3xl items-center justify-center gap-3 text-[11px] uppercase tracking-[0.5em] text-cyan-hp/70 font-display"
      >
        <RoughDivider width={48} height={20} color="#66FCF1" seed={3} />
        The room reveals what you seek
        <RoughDivider width={48} height={20} color="#66FCF1" seed={5} />
      </motion.div>

      {/* ── Headline ────────────────────────────────────────────────────── */}
      <div className="text-center">
        <h1
          aria-label="Frequently Asked Questions"
          className="font-display font-black tracking-tight text-silver-hp leading-[1.05] text-balance text-[12vw] sm:text-[8vw] md:text-[6.5vw] hp-glow"
          style={{ perspective: 800 }}
        >
          {splitLetters("Frequently")}<span style={{whiteSpace: "pre"}}> </span><span className="text-gold-hp hp-glow-gold text-[10vw] sm:text-[7vw] md:text-[5.5vw]">{splitLetters("Asked")}</span>
        </h1>
      </div>

      {/* ── Lede ────────────────────────────────────────────────────────── */}
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mx-auto mt-8 mb-16 max-w-2xl text-center font-wizard text-silver-hp/85 text-base sm:text-lg leading-relaxed"
      >
        Break the seal on any scroll below to reveal its contents.
        The Room only shows what you truly need to know.
      </motion.p>

      {/* ── FAQ Scrolls ─────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-3xl flex flex-col gap-4">
        {FAQS.map((faq, i) => (
          <FaqScroll
            key={i}
            faq={faq}
            index={i}
            isOpen={openIndex === i}
            onToggle={() => handleToggle(i)}
          />
        ))}
      </div>

      {/* ── Closing whisper + CTA ────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mt-20 flex flex-col items-center gap-6"
      >
        <span className="font-wizard italic text-silver-hp/55 text-sm text-center max-w-xl">
          &ldquo;Some scrolls speak only when asked. If your question
          isn&apos;t here, send an owl.&rdquo;
        </span>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <RoughButton
            as={Link}
            href="/events/hackathon"
            color="#D4AF37"
            glow="rgba(212,175,55,0.30)"
            shimmer
            seed={61}
            className="px-7 py-3 text-[12px]"
          >
            REGISTER NOW <span>↗</span>
          </RoughButton>

          <RoughButton
            as={Link}
            href="/"
            color="#C5C6C7"
            fill={false}
            seed={67}
            className="px-8 py-3 text-[12px]"
          >
            ← BACK TO THE HALL
          </RoughButton>
        </div>
      </motion.div>
    </section>
  );
}
