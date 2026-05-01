"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import Sparkles from "./Sparkles";
import RoughFrame from "./RoughFrame";

const GROUPS = [
  {
    href: "/core-team",
    eyebrow: "The inner circle",
    title: "Core Team",
    body:
      "The architects of HexaFalls — the ones who shape every spell. Applications to the inner circle will open soon.",
    runes: ["✦", "✧", "❖"],
    accent: "cyan",
    open: false,
    cta: "MEET THE COUNCIL",
  },
  {
    href: "/volunteer",
    eyebrow: "The order seeks helpers",
    title: "Volunteers",
    body:
      "Hands that steady the wand — guide the wanderers, run the hall, keep the magic on schedule. The scroll is open. Sign your name.",
    runes: ["★", "✶", "✷"],
    accent: "gold",
    open: true,
    cta: "SIGN THE SCROLL",
  },
];

export default function Team() {
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
        gsap.set(".tm-letter", { opacity: 1, y: 0, filter: "blur(0px)" });
        return;
      }
      gsap.set(".tm-letter", { opacity: 0, y: 24, filter: "blur(10px)" });
      gsap.to(".tm-letter", {
        opacity: 1, y: 0, filter: "blur(0px)",
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
        className="tm-letter inline-block"
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

      {/* Eyebrow */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
        className="mx-auto mb-6 flex max-w-3xl items-center justify-center gap-3 text-[11px] uppercase tracking-[0.5em] text-cyan-hp/70 font-display text-center"
      >
        <span className="h-px w-8 bg-cyan-hp/40" />
        Those who hold the hall
        <span className="h-px w-8 bg-cyan-hp/40" />
      </motion.div>

      {/* Headline */}
      <div className="text-center">
        <h1
          aria-label="The Team"
          className="font-display font-black tracking-tight text-silver-hp leading-[0.95] text-[14vw] sm:text-[10vw] md:text-[8vw] hp-glow"
          style={{ perspective: 800 }}
        >
          <span className="block">{splitLetters("The")}</span>
          <span className="block text-gold-hp hp-glow-gold text-[14vw] sm:text-[9vw] md:text-[7vw] mt-2">
            {splitLetters("Team")}
          </span>
        </h1>
      </div>

      <motion.p
        initial={{ opacity: 0, filter: "blur(16px)", y: 30 }}
        whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto mt-10 max-w-2xl text-center font-wizard text-silver-hp/75 text-base sm:text-lg leading-relaxed"
      >
        Two circles guard HexaFalls — the council that shapes the night, and
        the order of helpers that keeps it running. Choose the path that
        calls to you.
      </motion.p>

      {/* Two big cards */}
      <div className="mx-auto mt-16 grid max-w-5xl gap-8 md:grid-cols-2">
        {GROUPS.map((g, i) => {
          const gold = g.accent === "gold";
          const stroke = gold ? "#D4AF37" : "#66FCF1";
          return (
            <motion.div
              key={g.href}
              initial={{ opacity: 0, filter: "blur(18px)", y: 40 }}
              whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.1 + i * 0.15 }}
              className="h-full"
            >
              <RoughFrame
                seed={31 + i * 11}
                stroke={stroke}
                mistColor={stroke}
                strokeWidth={1.5}
                roughness={1.5}
                bowing={1.2}
                padding={28}
                className="h-full bg-slate-hp/30 backdrop-blur-sm"
                inner="flex h-full flex-col items-center text-center gap-5"
              >
                {/* runes */}
                <div className="flex items-center justify-center gap-4">
                  {g.runes.map((r, k) => (
                    <span
                      key={k}
                      className={`font-wizard text-2xl ${
                        gold ? "text-gold-hp hp-glow-gold" : "text-cyan-hp hp-glow"
                      }`}
                      aria-hidden="true"
                    >
                      {r}
                    </span>
                  ))}
                </div>

                <div>
                  <div className={`font-display tracking-[0.4em] uppercase text-[10px] ${gold ? "text-gold-hp/85" : "text-cyan-hp/80"}`}>
                    {g.eyebrow}
                  </div>
                  <h2 className="mt-2 font-display tracking-tight text-silver-hp text-3xl sm:text-4xl hp-glow">
                    {g.title}
                  </h2>
                </div>

                <p className="font-wizard text-silver-hp/75 text-sm leading-relaxed max-w-sm">
                  {g.body}
                </p>

                <div className="mt-auto pt-2">
                  {g.open ? (
                    <Link
                      href={g.href}
                      className="relative inline-flex items-center gap-3 overflow-hidden rounded-full border border-gold-hp/60 bg-gold-hp/10 px-6 py-3 font-display tracking-[0.3em] text-[12px] text-gold-hp hp-glow-gold hover:bg-gold-hp/15 hover:border-gold-hp hover:shadow-[0_0_24px_rgba(212,175,55,0.35)] transition"
                    >
                      <span className="relative z-10">{g.cta}</span>
                      <span className="relative z-10">→</span>
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3"
                        style={{
                          background:
                            "linear-gradient(90deg, transparent, rgba(212,175,55,0.25), transparent)",
                          animation: "hp-shimmer 3.6s linear infinite",
                        }}
                      />
                    </Link>
                  ) : (
                    <Link
                      href={g.href}
                      className="group inline-flex items-center gap-3 rounded-full border border-cyan-hp/50 bg-cyan-hp/10 px-6 py-3 font-display tracking-[0.3em] text-[12px] text-cyan-hp hover:bg-cyan-hp/15 hover:border-cyan-hp hover:shadow-[0_0_24px_rgba(102,252,241,0.3)] transition"
                    >
                      <span>{g.cta}</span>
                      <span className="text-[9px] tracking-[0.25em] px-2 py-0.5 rounded-full border border-gold-hp/60 bg-gold-hp/10 text-gold-hp hp-glow-gold">
                        SOON
                      </span>
                      <span className="group-hover:translate-x-0.5 transition">→</span>
                    </Link>
                  )}
                </div>
              </RoughFrame>
            </motion.div>
          );
        })}
      </div>

      {/* Back */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.4 }}
        className="mt-16 flex justify-center"
      >
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-full border border-silver-hp/30 px-8 py-3 font-display tracking-[0.3em] text-[11px] text-silver-hp/80 hover:text-silver-hp hover:border-silver-hp/70 transition"
        >
          ← BACK TO THE HALL
        </Link>
      </motion.div>
    </section>
  );
}
