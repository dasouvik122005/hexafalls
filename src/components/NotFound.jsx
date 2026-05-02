"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import Sparkles from "./Sparkles";
import RoughFrame from "./RoughFrame";

export default function NotFound() {
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
        gsap.set(".nf-letter", { opacity: 1, y: 0, filter: "blur(0px)" });
        return;
      }
      gsap.set(".nf-letter", { opacity: 0, y: 28, rotateX: -45, filter: "blur(12px)" });
      gsap.to(".nf-letter", {
        opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)",
        duration: 1.0,
        ease: "power3.out",
        stagger: { each: 0.06, from: "start" },
        delay: 0.15,
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const splitLetters = (text) =>
    [...text].map((ch, i) => (
      <span
        key={i}
        className="nf-letter inline-block"
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
        <Sparkles count={32} />
      </motion.div>

      {/* Eyebrow */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
        className="mb-6 flex items-center justify-center gap-3 text-[11px] uppercase tracking-[0.5em] text-cyan-hp/70 font-display text-center"
      >
        <span className="h-px w-8 bg-cyan-hp/40" />
        The map shifts
        <span className="h-px w-8 bg-cyan-hp/40" />
      </motion.div>

      {/* 404 */}
      <div className="text-center">
        <h1
          aria-label="404"
          className="font-display font-black tracking-tight leading-[0.9] hp-glow-gold text-gold-hp text-[28vw] sm:text-[20vw] md:text-[16vw]"
          style={{ perspective: 1000 }}
        >
          {splitLetters("404")}
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="-mt-2 sm:-mt-4"
        >
          <h2 className="font-display tracking-[0.4em] text-silver-hp/85 uppercase text-sm sm:text-base hp-glow">
            Lost in the Castle
          </h2>
        </motion.div>
      </div>

      {/* Lede in rough frame */}
      <motion.div
        initial={{ opacity: 0, filter: "blur(20px)", y: 40 }}
        whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto mt-12 w-full max-w-2xl"
      >
        <RoughFrame
          seed={47}
          stroke="#D4AF37"
          mistColor="#D4AF37"
          strokeWidth={1.4}
          roughness={1.5}
          bowing={1.2}
          padding={26}
          className="w-full bg-slate-hp/30 backdrop-blur-sm"
          inner="flex flex-col items-center text-center gap-4"
        >
          <p className="font-wizard text-silver-hp/80 text-base sm:text-lg leading-relaxed">
            This corridor doesn&apos;t appear on any map of the castle. The walls
            here have a habit of moving — perhaps you took a staircase that
            wasn&apos;t where it ought to have been.
          </p>
          <p className="font-wizard italic text-silver-hp/55 text-sm">
            “Mischief managed. Try a different door.”
          </p>
        </RoughFrame>
      </motion.div>

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.4 }}
        className="mt-12 flex flex-col sm:flex-row items-center gap-4"
      >
        <Link
          href="/"
          className="relative inline-flex items-center gap-3 overflow-hidden rounded-full border border-cyan-hp/50 bg-cyan-hp/10 px-7 py-3 font-display tracking-[0.3em] text-[12px] text-cyan-hp hover:bg-cyan-hp/15 hover:border-cyan-hp hover:shadow-[0_0_24px_rgba(102,252,241,0.35)] transition"
        >
          <span className="relative z-10">← BACK TO THE HALL</span>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(102,252,241,0.25), transparent)",
              animation: "hp-shimmer 3.6s linear infinite",
            }}
          />
        </Link>

        <Link
          href="/about"
          className="inline-flex items-center justify-center rounded-full border border-silver-hp/30 px-7 py-3 font-display tracking-[0.3em] text-[12px] text-silver-hp/80 hover:text-silver-hp hover:border-silver-hp/70 transition"
        >
          READ THE PROPHECY
        </Link>
      </motion.div>

      {/* Footer whisper */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.8 }}
        className="mt-12 flex items-center gap-3 font-display text-[10px] uppercase tracking-[0.5em] text-silver-hp/40"
      >
        <span className="h-px w-6 bg-silver-hp/30" />
        no scroll exists at this address
        <span className="h-px w-6 bg-silver-hp/30" />
      </motion.div>
    </section>
  );
}
