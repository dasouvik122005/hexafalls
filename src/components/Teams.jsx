"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import gsap from "gsap";
import Sparkles from "./Sparkles";
import HeroVideoBg from "./HeroVideoBg";
import RoughFrame from "./RoughFrame";
import RoughButton from "./RoughButton";
import RoughDivider from "./RoughDivider";
import { TEAMS } from "@/lib/routes";

export default function Teams() {
  const sectionRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      if (reduce) {
        gsap.set(".tm-letter", { opacity: 1, y: 0 });
        return;
      }
      gsap.set(".tm-letter", { opacity: 0, y: 20 });
      gsap.to(".tm-letter", {
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
              className="tm-letter inline-block"
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
      <HeroVideoBg />
      <div aria-hidden="true" className="absolute inset-0 -z-20 hp-scrim opacity-60 pointer-events-none" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 pointer-events-none">
        <Sparkles count={20} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mx-auto mb-6 flex max-w-3xl items-center justify-center gap-3 text-[11px] uppercase tracking-[0.5em] text-cyan-hp/70 font-display"
      >
        <RoughDivider width={48} height={20} color="#66FCF1" seed={3} />
        Those who hold the hall
        <RoughDivider width={48} height={20} color="#66FCF1" seed={5} />
      </motion.div>

      <div className="text-center">
        <h1
          aria-label="The Teams"
          className="font-display font-black tracking-tight text-silver-hp leading-[1.05] text-balance text-[14vw] sm:text-[10vw] md:text-[8vw] hp-glow"
        >
          {splitLetters("The")}<span style={{whiteSpace: "pre"}}> </span><span className="text-gold-hp hp-glow-gold text-[14vw] sm:text-[9vw] md:text-[7vw]">{splitLetters("Teams")}</span>
        </h1>
      </div>

      {/* Team cards — compact single row on desktop (4 abreast), 2x2 on
          phones. Each card is intentionally small: rune + name + status +
          one tap target. The detail page carries the prose. */}
      <div className="mx-auto mt-12 grid max-w-4xl gap-4 grid-cols-1 sm:grid-cols-3">
        {TEAMS.map((t, i) => (
          <motion.div
            key={t.slug}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.05 }}
            transition={{ duration: 0.4, delay: i * 0.03, ease: [0.22, 1, 0.36, 1] }}
            className="h-full"
          >
            <Link
              href={`/teams/${t.slug}`}
              className="group relative block h-full"
              aria-label={`${t.name} — ${t.open ? "apply now" : "details"}`}
            >
              {/* Soft outer glow ring — only on open scrolls, so the live
                  cards literally radiate against the muted soon-cards. */}
              {t.open && (
                <span
                  aria-hidden="true"
                  className="absolute -inset-1 rounded-md opacity-60 group-hover:opacity-90 transition pointer-events-none"
                  style={{
                    background: `radial-gradient(ellipse at center, ${t.glow}, transparent 70%)`,
                    filter: "blur(10px)",
                  }}
                />
              )}
              <RoughFrame
                seed={71 + i * 11}
                stroke={t.color}
                mistColor={t.color}
                strokeWidth={t.open ? 1.8 : 1.2}
                roughness={1.5}
                bowing={1.2}
                padding={16}
                className={`relative h-full backdrop-blur-sm transition ${
                  t.open
                    ? "bg-slate-hp/55 group-hover:bg-slate-hp/65 group-hover:-translate-y-0.5"
                    : "bg-slate-hp/20 group-hover:bg-slate-hp/30"
                }`}
                inner="flex h-full flex-col items-center text-center gap-2"
              >
                <span
                  className="font-wizard"
                  style={{
                    color: t.color,
                    textShadow: `0 0 ${t.open ? 18 : 10}px ${t.glow}`,
                    fontSize: t.open ? "2rem" : "1.6rem",
                    opacity: t.open ? 1 : 0.6,
                  }}
                  aria-hidden="true"
                >
                  {t.rune}
                </span>
                <h2
                  className="font-display tracking-tight text-base sm:text-lg leading-tight"
                  style={{
                    color: t.open ? t.color : "#C5C6C7",
                    textShadow: t.open ? `0 0 16px ${t.glow}` : "none",
                    opacity: t.open ? 1 : 0.75,
                  }}
                >
                  {t.name}
                </h2>
                <span
                  className="mt-auto inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-display text-[9px] uppercase tracking-[0.3em]"
                  style={{
                    borderColor: t.open ? t.color : `${t.color}40`,
                    color: t.open ? t.color : `${t.color}99`,
                    backgroundColor: t.open ? `${t.color}26` : `${t.color}10`,
                  }}
                >
                  {t.open ? (
                    <>
                      <span className="relative flex h-1.5 w-1.5">
                        <span
                          className="absolute inline-flex h-full w-full rounded-full opacity-70 animate-ping"
                          style={{ backgroundColor: t.color }}
                        />
                        <span
                          className="relative inline-flex h-1.5 w-1.5 rounded-full"
                          style={{ backgroundColor: t.color }}
                        />
                      </span>
                      Apply now ↗
                    </>
                  ) : (
                    "Soon"
                  )}
                </span>
              </RoughFrame>
            </Link>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.35, delay: 0.3 }}
        className="mt-16 flex justify-center"
      >
        <RoughButton
          as={Link}
          href="/"
          color="#C5C6C7"
          fill={false}
          seed={61}
          className="px-8 py-3 text-[11px]"
        >
          ← BACK TO THE HALL
        </RoughButton>
      </motion.div>
    </section>
  );
}
