"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import Sparkles from "./Sparkles";
import RoughFrame from "./RoughFrame";
import RoughButton from "./RoughButton";
import { EVENTS } from "@/lib/routes";

export default function Events() {
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
        gsap.set(".ev-letter", { opacity: 1, y: 0 });
        return;
      }
      gsap.set(".ev-letter", { opacity: 0, y: 24 });
      gsap.to(".ev-letter", {
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
        className="ev-letter inline-block"
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
      <motion.div style={{ y: yStars }} className="absolute inset-0 -z-30 hp-stars opacity-70" />
      <motion.div style={{ y: yMid }} className="absolute inset-0 -z-20 hp-scrim" />
      <motion.div style={{ y: yMid }} className="absolute inset-0 -z-10">
        <Sparkles count={28} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
        className="mx-auto mb-6 flex max-w-3xl items-center justify-center gap-3 text-[11px] uppercase tracking-[0.5em] text-cyan-hp/70 font-display"
      >
        <span className="h-px w-8 bg-cyan-hp/40" />
        Tracks of the techfest
        <span className="h-px w-8 bg-cyan-hp/40" />
      </motion.div>

      <div className="text-center">
        <h1
          aria-label="The Events"
          className="font-display font-black tracking-tight text-silver-hp leading-[0.95] text-[14vw] sm:text-[10vw] md:text-[8vw] hp-glow"
          style={{ perspective: 800 }}
        >
          <span className="block">{splitLetters("The")}</span>
          <span className="block text-gold-hp hp-glow-gold text-[14vw] sm:text-[9vw] md:text-[7vw] mt-2">
            {splitLetters("Events")}
          </span>
        </h1>
      </div>

      <motion.p
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto mt-10 max-w-2xl text-center font-wizard text-silver-hp/75 text-base sm:text-lg leading-relaxed"
      >
        Five tracks. One night that breaks into fifty-eight hours. Each has its
        own scrolls, its own duels, and its own gold to be won.
      </motion.p>

      {/* coming-soon ribbon */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.3 }}
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
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 1.2, delay: 0.05 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
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
              <p className="font-wizard text-silver-hp/65 text-sm leading-relaxed">
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
                <Link
                  href={`/events/${e.slug}/prizes`}
                  className="group inline-flex items-center gap-1.5 rounded-full border border-silver-hp/25 bg-slate-hp/40 px-3 py-1.5 font-display text-[10px] uppercase tracking-[0.3em] text-silver-hp/75 transition"
                  style={{
                    /* hover handled inline via CSS variables */
                  }}
                  onMouseEnter={(ev) => {
                    ev.currentTarget.style.borderColor = `${e.color}aa`;
                    ev.currentTarget.style.color = e.color;
                  }}
                  onMouseLeave={(ev) => {
                    ev.currentTarget.style.borderColor = "";
                    ev.currentTarget.style.color = "";
                  }}
                >
                  Prizes
                  <span className="group-hover:translate-x-0.5 transition">↗</span>
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
        transition={{ duration: 1, delay: 0.4 }}
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
