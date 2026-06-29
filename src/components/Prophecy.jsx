"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import gsap from "gsap";
import Sparkles from "./Sparkles";
import RoughFrame from "./RoughFrame";
import RoughButton from "./RoughButton";
import RoughDivider from "./RoughDivider";
import RoughStar from "./RoughStar";

const PILLARS = [
  {
    rune: "✦",
    title: "Code",
    body:
      "Fifty-eight hours of incantations in TypeScript, Rust, Python — wands of your own choosing. Build something that wasn't there before dawn.",
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

export default function Prophecy() {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      if (reduce) {
        gsap.set(".pr-letter", { opacity: 1, y: 0 });
        return;
      }
      gsap.set(".pr-letter", { opacity: 0, y: 24 });
      gsap.to(".pr-letter", {
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

  const splitLetters = (text) => {
    // Split on whitespace runs but keep the spaces as their own
    // tokens so we can preserve word spacing.
    const parts = text.split(/(\s+)/);
    return parts.map((part, wi) => {
      if (/^\s+$/.test(part)) {
        return (
          <span key={`w${wi}`} style={{ whiteSpace: "pre" }}>
            {part}
          </span>
        );
      }
      // Each word is an atomic inline-block (nowrap), so the
      // browser will only ever line-break BETWEEN words.
      return (
        <span
          key={`w${wi}`}
          className="inline-block"
          style={{ whiteSpace: "nowrap" }}
        >
          {[...part].map((ch, ci) => (
            <span
              key={`${wi}-${ci}`}
              className="pr-letter inline-block"
            >
              {ch}
            </span>
          ))}
        </span>
      );
    });
  };

  return (
    <section
      ref={sectionRef}
      className="relative isolate overflow-hidden min-h-screen pt-32 pb-24 px-6"
    >
      <div aria-hidden="true" className="absolute inset-0 -z-30 hp-stars pointer-events-none" />
      <div aria-hidden="true" className="absolute inset-0 -z-20 hp-scrim pointer-events-none" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 pointer-events-none">
        <Sparkles count={24} />
      </div>

      {/* Eyebrow */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mx-auto mb-6 flex max-w-3xl items-center justify-center gap-3 text-[11px] uppercase tracking-[0.5em] text-cyan-hp/70 font-display"
      >
        <RoughDivider width={48} height={20} color="#66FCF1" seed={3} />
        Foretold in starlight
        <RoughDivider width={48} height={20} color="#66FCF1" seed={5} />
      </motion.div>

      {/* Headline */}
      <div ref={headingRef} className="text-center">
        <h1
          aria-label="The Prophecy"
          className="font-display font-black tracking-tight text-silver-hp leading-[1.05] text-balance text-[14vw] sm:text-[10vw] md:text-[8vw] hp-glow"
          style={{ perspective: 800 }}
        >
          {splitLetters("The")}<span style={{whiteSpace: "pre"}}> </span><span className="text-gold-hp hp-glow-gold text-[12vw] sm:text-[8vw] md:text-[6.5vw]">{splitLetters("Prophecy")}</span>
        </h1>
      </div>

      {/* Opening verse */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.05 }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto mt-12 max-w-3xl text-center"
      >
        <p className="font-wizard text-silver-hp/80 text-base sm:text-lg leading-relaxed">
          We are planning a fifty-eight-hour techfest alongside our peers —
          powered by JIS University, with the university itself
          as our venue. The owls take wing this July.
        </p>
        <p className="mt-4 font-wizard italic text-silver-hp/55 text-sm">
          — fragment, anonymous, Hall of Records, JIS University
        </p>
      </motion.div>

      {/* Pillars / "the calling" */}
      <div className="mx-auto mt-24 grid max-w-6xl gap-8 sm:grid-cols-3">
        {PILLARS.map((p, i) => (
          <div key={p.title}>
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
              <p className="font-wizard text-silver-hp/85 text-sm leading-relaxed">
                {p.body}
              </p>
            </RoughFrame>
          </div>
        ))}
      </div>

      {/* The 58 hours / numbers */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.05 }}
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

      {/* The path foretold — link out to the full timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="mx-auto mt-24 max-w-3xl flex flex-col items-center gap-5 text-center"
      >
        <h2 className="font-display tracking-[0.4em] text-silver-hp/85 uppercase text-sm">
          The path foretold
        </h2>
        <p className="font-wizard italic text-silver-hp/60 text-sm max-w-md">
          Three days, charted hour by hour — ceremonies, hacking, robotics and the finale.
        </p>
        <RoughButton
          as={Link}
          href="/timeline"
          color="#D4AF37"
          glow="rgba(212,175,55,0.35)"
          fill={false}
          shimmer
          seed={61}
          className="px-9 sm:px-11 py-3.5 leading-none text-[12px] sm:text-[13px] tracking-[0.35em]"
        >
          VIEW THE TIMELINE ↗
        </RoughButton>
      </motion.div>

      {/* Closing CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="mt-24 flex flex-col items-center gap-6"
      >

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <RoughButton
            as={Link}
            href="/events"
            color="#66FCF1"
            glow="rgba(102,252,241,0.25)"
            fill={false}
            shimmer
            seed={53}
            className="px-9 sm:px-11 py-3.5 leading-none text-[12px] sm:text-[13px] tracking-[0.35em]"
          >
            <span>REGISTER NOW</span>
            <span aria-hidden="true">↗</span>
          </RoughButton>

          <RoughButton
            as={Link}
            href="/"
            color="#C5C6C7"
            fill={false}
            seed={59}
            className="px-10 sm:px-12 py-4 text-[13px] sm:text-[14px] tracking-[0.35em]"
          >
            ← BACK TO THE HALL
          </RoughButton>
        </div>
      </motion.div>
    </section>
  );
}
