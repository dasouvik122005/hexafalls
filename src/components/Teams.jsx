"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import Sparkles from "./Sparkles";
import RoughFrame from "./RoughFrame";
import RoughButton from "./RoughButton";
import { TEAMS } from "@/lib/routes";

export default function Teams() {
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
        gsap.set(".tm-letter", { opacity: 1, y: 0 });
        return;
      }
      gsap.set(".tm-letter", { opacity: 0, y: 20 });
      gsap.to(".tm-letter", {
        opacity: 1, y: 0,
        duration: 0.9,
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

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
        className="mx-auto mb-6 flex max-w-3xl items-center justify-center gap-3 text-[11px] uppercase tracking-[0.5em] text-cyan-hp/70 font-display"
      >
        <span className="h-px w-8 bg-cyan-hp/40" />
        Those who hold the hall
        <span className="h-px w-8 bg-cyan-hp/40" />
      </motion.div>

      <div className="text-center">
        <h1
          aria-label="The Teams"
          className="font-display font-black tracking-tight text-silver-hp leading-[0.95] text-[14vw] sm:text-[10vw] md:text-[8vw] hp-glow"
        >
          <span className="block">{splitLetters("The")}</span>
          <span className="block text-gold-hp hp-glow-gold text-[14vw] sm:text-[9vw] md:text-[7vw] mt-2">
            {splitLetters("Teams")}
          </span>
        </h1>
      </div>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto mt-10 max-w-2xl text-center font-wizard text-silver-hp/75 text-base sm:text-lg leading-relaxed"
      >
        Four orders make HexaFalls run. Some shape it from the high seats, some
        carry the lanterns through the corridors. Pick the one that calls.
      </motion.p>

      {/* Team cards — 2x2 like /events */}
      <div className="mx-auto mt-16 grid max-w-5xl gap-6 sm:grid-cols-2">
        {TEAMS.map((t, i) => (
          <motion.div
            key={t.slug}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.9, delay: 0.05 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="h-full"
          >
            <RoughFrame
              seed={71 + i * 11}
              stroke={t.color}
              mistColor={t.color}
              strokeWidth={1.5}
              roughness={1.6}
              bowing={1.2}
              padding={24}
              className="h-full bg-slate-hp/30 backdrop-blur-sm"
              inner="flex h-full flex-col gap-3"
            >
              <div className="flex items-center justify-between">
                <span
                  className="font-wizard text-3xl"
                  style={{ color: t.color, textShadow: `0 0 14px ${t.glow}` }}
                  aria-hidden="true"
                >
                  {t.rune}
                </span>
                <span
                  className="rounded-full border px-2 py-0.5 font-display text-[8px] uppercase tracking-[0.3em]"
                  style={{
                    borderColor: `${t.color}55`,
                    color: `${t.color}cc`,
                    backgroundColor: `${t.color}1a`,
                  }}
                >
                  {t.open ? "open" : "soon"}
                </span>
              </div>
              <h2
                className="font-display tracking-tight text-2xl leading-tight"
                style={{ color: t.color, textShadow: `0 0 18px ${t.glow}` }}
              >
                {t.name}
              </h2>
              <p className="font-wizard text-silver-hp/65 text-sm leading-relaxed">
                {t.blurb}
              </p>

              <div className="mt-auto pt-2">
                <Link
                  href={`/teams/${t.slug}`}
                  className="group inline-flex items-center gap-1.5 rounded-full border px-4 py-2 font-display text-[11px] uppercase tracking-[0.3em] transition"
                  style={{
                    borderColor: `${t.color}80`,
                    color: t.color,
                    backgroundColor: `${t.color}1a`,
                  }}
                >
                  {t.open ? "Apply now" : "Read more"}
                  <span className="group-hover:translate-x-0.5 transition">→</span>
                </Link>
              </div>
            </RoughFrame>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
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
