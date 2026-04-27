"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import Sparkles from "./Sparkles";
import RoughFrame from "./RoughFrame";
import LocationMap from "./LocationMap";

export default function Hero() {
  const sectionRef = useRef(null);
  const titleRef   = useRef(null);
  const subRef     = useRef(null);
  const stripRef   = useRef(null);

  // ---- parallax layers (transform-only, GPU friendly) ----
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const yStars   = useTransform(scrollYProgress, [0, 1], ["0%",  "30%"]);
  const yMid     = useTransform(scrollYProgress, [0, 1], ["0%",  "60%"]);
  const yMascot  = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);
  const yTitle   = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);
  const opacity  = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  // ---- GSAP "string" reveal: stagger characters as if drawn by quill ----
  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      if (reduce) {
        gsap.set([".hp-letter", subRef.current, stripRef.current], { opacity: 1, y: 0 });
        return;
      }
      gsap.set(".hp-letter", { opacity: 0, y: 28, rotateX: -60, filter: "blur(10px)" });
      gsap.to(".hp-letter", {
        opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)",
        duration: 1.0,
        ease: "power3.out",
        stagger: { each: 0.045, from: "start" },
        delay: 0.2,
      });
      gsap.from(subRef.current, {
        opacity: 0, y: 20, duration: 1.1, delay: 1.1, ease: "power2.out",
      });
      gsap.from(stripRef.current, {
        opacity: 0, y: 18, duration: 0.9, delay: 1.4, ease: "power2.out",
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const splitLetters = (text) =>
    [...text].map((ch, i) => (
      <span
        key={i}
        className="hp-letter inline-block"
        style={{ whiteSpace: ch === " " ? "pre" : "normal" }}
      >
        {ch}
      </span>
    ));

  return (
    <section
      ref={sectionRef}
      className="relative isolate overflow-hidden min-h-[110vh] flex flex-col items-center justify-start pt-32 pb-24 px-6"
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
      {/* parallax: floating sparks */}
      <motion.div style={{ y: yMid }} className="absolute inset-0 -z-10">
        <Sparkles count={36} />
      </motion.div>

      {/* tagline strip */}
      <motion.div
        ref={stripRef}
        className="mb-6 flex items-center gap-3 text-[11px] sm:text-xs uppercase tracking-[0.5em] text-cyan-hp/70 font-[family-name:var(--font-display)]"
      >
        <span className="h-px w-8 bg-cyan-hp/40" />
        Presented by GDG · JIS University
        <span className="h-px w-8 bg-cyan-hp/40" />
      </motion.div>

      {/* HEADLINE */}
      <motion.div
        ref={titleRef}
        style={{ y: yTitle, opacity }}
        className="text-center"
      >
        <h1
          aria-label="HexaFalls Techfest"
          className="font-[family-name:var(--font-display)] font-black tracking-tight text-silver-hp leading-[0.95] text-[14vw] sm:text-[10vw] md:text-[8.5vw] hp-glow"
          style={{ perspective: 800 }}
        >
          <span className="block">{splitLetters("HexaFalls")}</span>
          <span className="block text-gold-hp hp-glow-gold text-[10vw] sm:text-[7vw] md:text-[6vw] mt-2">
            {splitLetters("Techfest")}
          </span>
        </h1>

        <p
          ref={subRef}
          className="mt-8 max-w-2xl mx-auto text-base sm:text-lg font-[family-name:var(--font-wizard)] text-silver-hp/80"
        >
          Owls have been dispatched. Robes pressed, wands tuned. A 36-hour
          gathering of code, chaos and conjuring at the edge of the magical
          and the mundane.
        </p>
      </motion.div>

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.6 }}
        className="mt-10 flex flex-col sm:flex-row items-center gap-4"
      >
        <a
          href="#register"
          className="hp-underline group relative inline-flex items-center justify-center rounded-full border border-cyan-hp/60 bg-cyan-hp/10 px-8 py-3 font-[family-name:var(--font-display)] tracking-[0.3em] text-cyan-hp transition hover:bg-cyan-hp/20 hover:shadow-[0_0_36px_rgba(102,252,241,0.45)]"
        >
          REGISTER
        </a>
        <a
          href="#about"
          className="inline-flex items-center justify-center rounded-full border border-silver-hp/30 px-8 py-3 font-[family-name:var(--font-display)] tracking-[0.3em] text-silver-hp/80 hover:text-silver-hp hover:border-silver-hp/70 transition"
        >
          THE PROPHECY
        </a>
      </motion.div>

      {/* Mascot + Map row */}
      <motion.div
        style={{ y: yMascot }}
        className="mt-20 grid w-full max-w-6xl grid-cols-1 md:grid-cols-2 gap-10 items-center"
      >
        {/* MASCOT */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 1.0 }}
          className="flex justify-center"
        >
          <RoughFrame
            seed={3}
            stroke="#66FCF1"
            strokeWidth={1.4}
            roughness={2}
            bowing={2}
            padding={26}
            className="bg-slate-hp/40 backdrop-blur-sm"
          >
            <div className="relative h-56 w-56 sm:h-64 sm:w-64 hp-float flex items-center justify-center">
              {/* TODO: <Image src="/mascot.png" .../> */}
              <span className="font-[family-name:var(--font-wizard)] text-cyan-hp/70 text-xs uppercase tracking-[0.4em]">
                mascot · placeholder
              </span>
            </div>
            <div className="mt-3 text-center font-[family-name:var(--font-wizard)] text-[11px] text-silver-hp/50 italic">
              the keeper of Hexafalls
            </div>
          </RoughFrame>
        </motion.div>

        {/* LOCATION MAP */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, delay: 1.2 }}
        >
          <LocationMap />
        </motion.div>
      </motion.div>

      {/* scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6, y: [0, 8, 0] }}
        transition={{ delay: 2, duration: 2.4, repeat: Infinity }}
        className="mt-16 text-xs uppercase tracking-[0.4em] text-silver-hp/50 font-[family-name:var(--font-display)]"
      >
        ↓ unfurl the parchment
      </motion.div>
    </section>
  );
}
