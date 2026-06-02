"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import Sparkles from "./Sparkles";
import RoughFrame from "./RoughFrame";
import RoughButton from "./RoughButton";
import RoughDivider from "./RoughDivider";
import RoughTape from "./RoughTape";

// TODO: replace with the real Google Form URL
const VOLUNTEER_FORM_URL = "https://forms.gle/wM2qEnr3oB95wss89";

// Drop the banner art at /public/volunteers-banner.png (or .jpg/.webp)
const BANNER_SRC = "/banners/vol_form.png";

const PERKS = [
  { rune: "✦", title: "Wear the badge", body: "Crest, robes, and a name on the wall of helpers." },
  { rune: "✧", title: "Inside the magic", body: "Backstage view of how a 58-hour hackathon is conjured." },
  { rune: "❖", title: "The order grows", body: "Mentors, organisers, alumni — your circle, expanded." },
];

export default function CallForVolunteers() {
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
        gsap.set(".cv-letter", { opacity: 1, y: 0 });
        return;
      }
      gsap.set(".cv-letter", { opacity: 0, y: 24 });
      gsap.to(".cv-letter", {
        opacity: 1, y: 0,
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
        className="cv-letter inline-block"
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
      <motion.div style={{ y: yStars }} className="absolute inset-0 -z-30 hp-stars opacity-70" />
      {/* parallax: scrim */}
      <motion.div style={{ y: yMid }} className="absolute inset-0 -z-20 hp-scrim" />
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
        <RoughDivider width={48} height={20} color="#66FCF1" seed={3} />
        The order seeks helpers
        <RoughDivider width={48} height={20} color="#66FCF1" seed={5} />
      </motion.div>

      {/* Headline */}
      <div className="text-center">
        <h1
          aria-label="Call for Volunteers"
          className="font-display font-black tracking-tight text-silver-hp leading-[0.95] text-[12vw] sm:text-[8vw] md:text-[6.5vw] hp-glow"
          style={{ perspective: 800 }}
        >
          <span className="block">{splitLetters("Call for")}</span>
          <span className="block text-gold-hp hp-glow-gold text-[14vw] sm:text-[9vw] md:text-[7vw] mt-2">
            {splitLetters("Volunteers")}
          </span>
        </h1>
      </div>

      {/* Lede */}
      <motion.p
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto mt-10 max-w-2xl text-center font-wizard text-silver-hp/80 text-base sm:text-lg leading-relaxed"
      >
        Every great spell needs hands behind it. Help us run the hall, guide
        the wanderers, and keep the magic on schedule across fifty-eight hours
        of HexaFalls.
      </motion.p>

      {/* Banner — static, image centered, edges blend into the bg */}
      <div className="mx-auto mt-16 w-full max-w-5xl">
        <RoughFrame
          seed={29}
          stroke="#D4AF37"
          mistColor="#D4AF37"
          strokeWidth={1.4}
          roughness={1.6}
          bowing={1.2}
          padding={22}
          className="w-full bg-slate-hp/40 backdrop-blur-sm"
          inner="flex flex-col gap-5"
        >
          <div className="relative w-full aspect-21/9 sm:aspect-21/8 overflow-hidden rounded-sm bg-midnight/70 flex items-center justify-center">
            <img
              src={BANNER_SRC}
              alt="Call for Volunteers"
            loading="lazy"
            decoding="async"
              className="block max-h-full max-w-full object-contain"
              style={{
                WebkitMaskImage:
                  "radial-gradient(ellipse at center, #000 55%, transparent 95%)",
                maskImage:
                  "radial-gradient(ellipse at center, #000 55%, transparent 95%)",
              }}
            />
            {/* edge vignette so any rectangular image dissolves into the dark bg */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at center, transparent 55%, rgba(11,12,16,0.55) 85%, rgba(11,12,16,0.95) 100%)",
              }}
            />
            <div className="absolute inset-0 hp-stars opacity-15 mix-blend-screen pointer-events-none" />

            {/* sketched washi-tape strips at the corners — looks pasted in */}
            <RoughTape color="#D4AF37" seed={51} />

            <span className="absolute top-2 left-2 text-[10px] font-wizard text-gold-hp/60 tracking-widest">★ · the order</span>
            <span className="absolute bottom-2 right-2 text-[10px] font-wizard text-cyan-hp/50 tracking-widest">helpers · welcome</span>
          </div>

          <div className="font-wizard text-[11px] text-silver-hp/55 italic text-center">
            “No spell holds without the hands that steady the wand.”
          </div>
        </RoughFrame>
      </div>

      {/* Perks */}
      <div className="mx-auto mt-20 grid max-w-5xl gap-6 sm:grid-cols-3">
        {PERKS.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 1.3,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.1 + i * 0.12,
            }}
            className="rounded-md border border-silver-hp/15 bg-slate-hp/30 backdrop-blur-sm p-5 text-center"
          >
            <span
              className={`font-wizard text-2xl ${i === 1 ? "text-gold-hp hp-glow-gold" : "text-cyan-hp hp-glow"}`}
              aria-hidden="true"
            >
              {p.rune}
            </span>
            <h3 className="mt-2 font-display tracking-[0.3em] text-silver-hp uppercase text-xs">
              {p.title}
            </h3>
            <p className="mt-2 font-wizard text-silver-hp/65 text-sm leading-relaxed">
              {p.body}
            </p>
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="mt-20 flex flex-col items-center gap-6"
      >
        <span className="font-wizard italic text-silver-hp/60 text-sm text-center max-w-xl">
          Sign the scroll. We&apos;ll dispatch an owl with the next steps.
        </span>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <RoughButton
            as="a"
            href={VOLUNTEER_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            color="#D4AF37"
            glow="rgba(212,175,55,0.30)"
            shimmer
            seed={37}
            className="px-10 sm:px-12 py-4 text-[13px] sm:text-[14px] tracking-[0.35em]"
          >
            <span>SIGN THE SCROLL</span>
            <span>↗</span>
          </RoughButton>

          <RoughButton
            as={Link}
            href="/"
            color="#C5C6C7"
            fill={false}
            seed={41}
            className="px-10 sm:px-12 py-4 text-[13px] sm:text-[14px] tracking-[0.35em]"
          >
            ← BACK TO THE HALL
          </RoughButton>
        </div>
      </motion.div>
    </section>
  );
}
