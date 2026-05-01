"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import Sparkles from "./Sparkles";
import RoughFrame from "./RoughFrame";

const PILLARS = [
  {
    rune: "✦",
    title: "Code",
    body:
      "Thirty-six hours of incantations in TypeScript, Rust, Python — wands of your own choosing. Build something that wasn't there before dawn.",
  },
  {
    rune: "✧",
    title: "Chaos",
    body:
      "Sleep is optional, side-quests are mandatory. Midnight rituals, surprise scrolls, and a few duels along the way.",
  },
  {
    rune: "❖",
    title: "Conjuring",
    body:
      "Hardware, AI, web, games — every track is a different kind of magic. Pick a path, summon a team, ship a relic.",
  },
];

const TIMELINE = [
  { mark: "I",   label: "Owls dispatched",   note: "Registrations open · scrolls go out" },
  { mark: "II",  label: "The gathering",     note: "Robes pressed at JIS University, Agarpara" },
  { mark: "III", label: "The 58 hours",      note: "Build · break · brew · build again" },
  { mark: "IV",  label: "The reveal",        note: "Demos before the council of judges" },
  { mark: "V",   label: "The keeper's gift", note: "Prizes, lore, and stories carried home" },
];

export default function Prophecy() {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);

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
        gsap.set(".pr-letter", { opacity: 1, y: 0, filter: "blur(0px)" });
        return;
      }
      gsap.set(".pr-letter", { opacity: 0, y: 24, filter: "blur(10px)" });
      gsap.to(".pr-letter", {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 1.0,
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
        className="pr-letter inline-block"
        style={{ whiteSpace: ch === " " ? "pre" : "normal" }}
      >
        {ch}
      </span>
    ));

  return (
    <section
      ref={sectionRef}
      className="relative isolate overflow-hidden min-h-screen pt-32 pb-24 px-6"
    >
      {/* parallax: deep stars */}
      <motion.div
        style={{ y: yStars }}
        className="absolute inset-0 -z-30 hp-stars opacity-70"
      />
      {/* parallax: scrim */}
      <motion.div
        style={{ y: yMid }}
        className="absolute inset-0 -z-20 hp-scrim"
      />
      {/* floating sparks */}
      <motion.div style={{ y: yMid }} className="absolute inset-0 -z-10">
        <Sparkles count={28} />
      </motion.div>

      {/* Eyebrow */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
        className="mx-auto mb-6 flex max-w-3xl items-center justify-center gap-3 text-[11px] uppercase tracking-[0.5em] text-cyan-hp/70 font-display"
      >
        <span className="h-px w-8 bg-cyan-hp/40" />
        Foretold in starlight
        <span className="h-px w-8 bg-cyan-hp/40" />
      </motion.div>

      {/* Headline */}
      <div ref={headingRef} className="text-center">
        <h1
          aria-label="The Prophecy"
          className="font-display font-black tracking-tight text-silver-hp leading-[0.95] text-[14vw] sm:text-[10vw] md:text-[8vw] hp-glow"
          style={{ perspective: 800 }}
        >
          <span className="block">{splitLetters("The")}</span>
          <span className="block text-gold-hp hp-glow-gold text-[12vw] sm:text-[8vw] md:text-[6.5vw] mt-2">
            {splitLetters("Prophecy")}
          </span>
        </h1>
      </div>

      {/* Opening verse */}
      <motion.div
        initial={{ opacity: 0, filter: "blur(16px)", y: 30 }}
        whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto mt-12 max-w-3xl text-center"
      >
        <p className="font-wizard text-silver-hp/80 text-base sm:text-lg leading-relaxed">
          When the moon hangs low above Agarpara and the owls grow restless, six
          falls of light shall meet — code, chaos, conjuring, courage, craft and
          curiosity. For thirty-six hours the veil thins, and what is built
          there will travel far beyond the hall.
        </p>
        <p className="mt-4 font-wizard italic text-silver-hp/55 text-sm">
          — fragment, anonymous, Hall of Records, JIS University
        </p>
      </motion.div>

      {/* Pillars / "the calling" */}
      <div className="mx-auto mt-24 grid max-w-6xl gap-8 sm:grid-cols-3">
        {PILLARS.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, filter: "blur(18px)", y: 40 }}
            whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 1.4,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.1 + i * 0.15,
            }}
          >
            <RoughFrame
              seed={13 + i * 7}
              stroke={i === 1 ? "#D4AF37" : "#66FCF1"}
              strokeWidth={1.4}
              roughness={1.5}
              bowing={1.2}
              padding={24}
              className="h-full bg-slate-hp/30 backdrop-blur-sm"
              inner="flex flex-col items-center text-center gap-3"
            >
              <span
                className={`font-wizard text-3xl ${
                  i === 1 ? "text-gold-hp hp-glow-gold" : "text-cyan-hp hp-glow"
                }`}
                aria-hidden="true"
              >
                {p.rune}
              </span>
              <h3 className="font-display tracking-[0.35em] text-silver-hp uppercase text-sm">
                {p.title}
              </h3>
              <p className="font-wizard text-silver-hp/70 text-sm leading-relaxed">
                {p.body}
              </p>
            </RoughFrame>
          </motion.div>
        ))}
      </div>

      {/* The 36 hours / numbers */}
      <motion.div
        initial={{ opacity: 0, filter: "blur(16px)", y: 30 }}
        whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto mt-24 grid max-w-5xl grid-cols-2 gap-6 sm:grid-cols-4"
      >
        {[
          { n: "58", l: "hours of magic" },
          { n: "10+", l: "tracks of craft" },
          { n: "4",  l: "wizarding hall" },
          { n: "∞",  l: "stories to carry" },
        ].map((s) => (
          <div
            key={s.l}
            className="rounded-md border border-silver-hp/15 bg-slate-hp/30 backdrop-blur-sm py-6 text-center"
          >
            <div className="font-display text-4xl text-gold-hp hp-glow-gold">
              {s.n}
            </div>
            <div className="mt-1 font-wizard text-[11px] uppercase tracking-[0.3em] text-silver-hp/60">
              {s.l}
            </div>
          </div>
        ))}
      </motion.div>

      {/* The path / timeline */}
      <div className="mx-auto mt-24 max-w-3xl">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-center font-display tracking-[0.4em] text-silver-hp/85 uppercase text-sm"
        >
          The path foretold
        </motion.h2>

        <ol className="mt-10 relative border-l border-cyan-hp/20 pl-8 space-y-8">
          {TIMELINE.map((t, i) => (
            <motion.li
              key={t.mark}
              initial={{ opacity: 0, filter: "blur(12px)", x: -20 }}
              whileInView={{ opacity: 1, filter: "blur(0px)", x: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{
                duration: 1.1,
                ease: [0.22, 1, 0.36, 1],
                delay: i * 0.08,
              }}
              className="relative"
            >
              <span className="absolute -left-[2.35rem] top-1 flex h-7 w-7 items-center justify-center rounded-full border border-gold-hp/60 bg-midnight font-display text-[10px] tracking-widest text-gold-hp hp-glow-gold">
                {t.mark}
              </span>
              <div className="font-display tracking-[0.25em] text-silver-hp uppercase text-xs">
                {t.label}
              </div>
              <div className="mt-1 font-wizard text-silver-hp/65 text-sm">
                {t.note}
              </div>
            </motion.li>
          ))}
        </ol>
      </div>

      {/* Closing CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="mt-24 flex flex-col items-center gap-6"
      >
        <span className="font-wizard italic text-silver-hp/60 text-sm text-center max-w-xl">
          “The hall remembers every wand that was raised within it. Raise yours.”
        </span>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button
            type="button"
            disabled
            aria-disabled="true"
            className="relative inline-flex items-center gap-3 rounded-full border border-cyan-hp/50 bg-cyan-hp/10 px-7 py-3 font-display tracking-[0.3em] text-cyan-hp cursor-not-allowed select-none overflow-hidden hp-pulse"
          >
            <span className="relative z-10">REGISTER</span>
            <span className="relative z-10 text-[10px] tracking-[0.25em] px-2 py-0.5 rounded-full border border-gold-hp/60 bg-gold-hp/10 text-gold-hp hp-glow-gold">
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

          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-silver-hp/30 px-8 py-3 font-display tracking-[0.3em] text-silver-hp/80 hover:text-silver-hp hover:border-silver-hp/70 transition"
          >
            ← BACK TO THE HALL
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
