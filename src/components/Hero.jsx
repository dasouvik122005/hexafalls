"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import Link from "next/link";
import Sparkles from "./Sparkles";
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

      {/* partner logos */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.1 }}
        className="mb-8 flex flex-wrap items-center justify-center gap-5 sm:gap-8"
        aria-label="Presented by"
      >
        {[
          { id: "gdg",  label: "", logo: "/logos/gdg_jisu.png" },
          { id: "jisu", label: "", logo: "/logos/jisu.png" },
          { id: "cse",  label: "", logo: "/logos/cse_jisu.png" },
        ].map((l, i, arr) => (
          <div key={l.id} className="flex items-center gap-3 group">
            <div
              title={l.id.toUpperCase()}
              className="relative h-10 w-10 sm:h-12 sm:w-12 shrink-0 overflow-hidden rounded-md border border-silver-hp/25 bg-slate-hp/50 backdrop-blur flex items-center justify-center group-hover:border-cyan-hp/60 transition"
            >
              <img
                src={l.logo}
                alt={l.id.toUpperCase()}
                className="block h-full w-full object-contain p-1.5 transition duration-300"
                style={{
                  filter:
                    "brightness(1.05) contrast(1.05) saturate(0.85) drop-shadow(0 0 6px rgba(102,252,241,0.18))",
                }}
              />
              {/* themed tint overlay — cyan glow on hover */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-cyan-hp/0 group-hover:bg-cyan-hp/10 transition mix-blend-screen"
              />
            </div>
            <span className="text-[11px] sm:text-xs uppercase tracking-[0.3em] text-silver-hp/70 group-hover:text-silver-hp transition font-display">
              {l.label}
            </span>
            {i < arr.length - 1 && <span className="text-silver-hp/20">·</span>}
          </div>
        ))}
      </motion.div>

      {/* tagline strip */}
      <motion.div
        ref={stripRef}
        className="mb-6 flex items-center gap-3 text-[11px] sm:text-xs uppercase tracking-[0.5em] text-cyan-hp/70 font-display"
      >
        <span className="h-px w-8 bg-cyan-hp/40" />
        A Wizarding Hackathon
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
          className="font-display font-black tracking-tight text-silver-hp leading-[0.95] text-[14vw] sm:text-[10vw] md:text-[8.5vw] hp-glow"
          style={{ perspective: 800 }}
        >
          <span className="block">{splitLetters("HexaFalls")}</span>
          <span className="block text-gold-hp hp-glow-gold text-[10vw] sm:text-[7vw] md:text-[6vw] mt-2">
            {splitLetters("Techfest")}
          </span>
        </h1>

        <p
          ref={subRef}
          className="mt-8 max-w-2xl mx-auto text-base sm:text-lg font-wizard text-silver-hp/80"
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
        {/* Register — Coming Soon highlight */}
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
          {/* shimmer sweep */}
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
          href="/about"
          className="inline-flex items-center justify-center rounded-full border border-silver-hp/30 px-8 py-3 font-display tracking-[0.3em] text-silver-hp/80 hover:text-silver-hp hover:border-silver-hp/70 transition"
        >
          THE PROPHECY
        </Link>
      </motion.div>

      {/* Full-width Map with mascot orb pinned bottom-right */}
      <div className="relative mt-24 w-full max-w-6xl">
        <LocationMap />

        {/* Mascot orb */}
        <motion.div
          initial={{ opacity: 0, scale: 0.6, rotate: -8 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1.1, ease: "easeOut", delay: 0.2 }}
          className="absolute -bottom-10 -right-6 sm:-bottom-14 sm:-right-10 z-20"
        >
          <div className="relative hp-float" style={{ animationDuration: "7s" }}>
            <img
              src="/mascot/mascot.webp"
              alt="HexaFalls mascot"
              className="relative h-40 w-40 sm:h-56 sm:w-56 object-contain select-none"
              style={{
                filter:
                  "drop-shadow(0 0 18px rgba(102,252,241,0.45)) drop-shadow(0 8px 24px rgba(0,0,0,0.55)) drop-shadow(0 0 36px rgba(212,175,55,0.18))",
              }}
              draggable={false}
            />
          </div>
        </motion.div>
      </div>

      {/* footnote — more reveals coming */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9 }}
        className="mt-24 flex flex-col items-center gap-2 text-center"
      >
        <span className="inline-flex items-center gap-3 font-display text-[11px] uppercase tracking-[0.5em] text-cyan-hp/70">
          <span className="h-px w-8 bg-cyan-hp/40" />
          more scrolls unfurling soon
          <span className="h-px w-8 bg-cyan-hp/40" />
        </span>
        <span className="font-wizard text-[12px] italic text-silver-hp/45">
          tracks · prizes · sponsors · the keeper's lore — revealing in due time
        </span>
      </motion.div>
    </section>
  );
}
