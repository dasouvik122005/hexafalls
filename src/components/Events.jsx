"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import gsap from "gsap";
import Sparkles from "./Sparkles";
import RoughFrame from "./RoughFrame";
import RoughButton from "./RoughButton";
import RoughDivider from "./RoughDivider";
import { EVENTS } from "@/lib/routes";

export default function Events() {
  const sectionRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      if (reduce) {
        gsap.set(".ev-letter", { opacity: 1, y: 0 });
        return;
      }
      gsap.set(".ev-letter", { opacity: 0, y: 24 });
      gsap.to(".ev-letter", {
        opacity: 1, y: 0,
        duration: 0.4,
        ease: "power3.out",
        stagger: { each: 0.045, from: "start" },
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
              className="ev-letter inline-block"
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

      <div className="text-center">
        <h1
          aria-label="The Events"
          className="font-display font-black tracking-tight text-silver-hp leading-[1.05] text-balance text-[14vw] sm:text-[10vw] md:text-[8vw] hp-glow"
          style={{ perspective: 800 }}
        >
          {splitLetters("The")}<span style={{whiteSpace: "pre"}}> </span><span className="text-gold-hp hp-glow-gold text-[14vw] sm:text-[9vw] md:text-[7vw]">{splitLetters("Events")}</span>
        </h1>
      </div>

      {/* coming-soon ribbon */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="mt-10 flex items-center justify-center gap-3 font-display text-[10px] uppercase tracking-[0.5em] text-gold-hp/80"
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full rounded-full bg-gold-hp opacity-60 animate-ping" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-gold-hp" />
        </span>
        Full briefs unfurling soon
      </motion.div>

      {/* Event cards — each carries its own house color */}
      <div className="mx-auto mt-16 grid max-w-6xl gap-6 sm:grid-cols-2">
        {EVENTS.map((e, i) => (
          <motion.div
            key={e.slug}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.05 }}
            transition={{ duration: 0.45, delay: i * 0.03, ease: [0.22, 1, 0.36, 1] }}
            className="h-full"
          >
            <RoughFrame
              seed={51 + i * 9}
              stroke={e.color}
              mistColor={e.color}
              strokeWidth={1.4}
              roughness={1.5}
              bowing={1.2}
              padding={22}
              className="h-full bg-slate-hp/30 backdrop-blur-sm"
              inner="flex h-full flex-col gap-3"
            >
              <div className="flex items-center justify-between">
                <span
                  className="font-wizard text-3xl"
                  style={{
                    color: e.color,
                    textShadow: `0 0 14px ${e.glow}`,
                  }}
                  aria-hidden="true"
                >
                  {e.rune}
                </span>
                <span
                  className="rounded-full border px-2 py-0.5 font-display text-[8px] uppercase tracking-[0.3em]"
                  style={{
                    borderColor: `${e.color}55`,
                    color: `${e.color}cc`,
                    backgroundColor: `${e.color}1a`,
                  }}
                >
                  soon
                </span>
              </div>
              <h2
                className="font-display tracking-tight text-2xl leading-tight"
                style={{ color: e.color, textShadow: `0 0 18px ${e.glow}` }}
              >
                {e.name}
              </h2>
              <p className="font-wizard text-silver-hp/85 text-sm leading-relaxed">
                {e.blurb}
              </p>

              <div className="mt-auto flex flex-wrap gap-2 pt-2">
                <Link
                  href={`/events/${e.slug}`}
                  className="group inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-display text-[10px] uppercase tracking-[0.3em] transition"
                  style={{
                    borderColor: `${e.color}80`,
                    color: e.color,
                    backgroundColor: `${e.color}1a`,
                  }}
                >
                  Details
                  <span className="group-hover:translate-x-0.5 transition">→</span>
                </Link>
              </div>
            </RoughFrame>
          </motion.div>
        ))}
      </div>

      {/* Back */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="mt-16 flex justify-center"
      >
        <RoughButton
          as={Link}
          href="/"
          color="#C5C6C7"
          fill={false}
          seed={67}
          className="px-8 py-3 text-[11px]"
        >
          ← BACK TO THE HALL
        </RoughButton>
      </motion.div>
    </section>
  );
}
