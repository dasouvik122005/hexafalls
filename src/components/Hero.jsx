"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import Link from "next/link";
import Sparkles from "./Sparkles";
import LocationMap from "./LocationMap";
import RoughButton from "./RoughButton";
import RoughDivider from "./RoughDivider";
import RoughStar from "./RoughStar";
import RoughCorners from "./RoughCorners";
import { CALLS } from "@/lib/routes";

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
      gsap.set(".hp-letter", { opacity: 0, y: 28, rotateX: -60 });
      gsap.to(".hp-letter", {
        opacity: 1, y: 0, rotateX: 0,
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

      {/* Scrapbook scribbles — scattered rough doodles in the page margins.
          Sit between the parallax layers and the foreground content via
          document order; pointer-events stay off so they never block clicks. */}
      <RoughStar
        size={26} color="#A78BFA" seed={71}
        className="absolute top-24 left-6 sm:left-12 opacity-70 hp-float"
        style={{ animationDuration: "12s" }}
      />
      <RoughStar
        size={32} color="#D4AF37" fill seed={79}
        className="absolute top-40 right-8 sm:right-16 opacity-80 hp-float"
        style={{ animationDuration: "14s", animationDelay: "1.5s" }}
      />
      <RoughStar
        size={20} color="#66FCF1" seed={83}
        className="absolute bottom-32 left-12 opacity-60 hp-float"
        style={{ animationDuration: "10s", animationDelay: "2s" }}
      />

      {/* a single piece of "tape" peeling off the top-left corner of the page */}
      <span aria-hidden="true" className="pointer-events-none absolute top-20 -left-4 opacity-90">
        <span className="relative block h-5 w-24">
          <RoughTape color="#66FCF1" width={96} height={20} rotation={28} inset={0} seed={89} />
        </span>
      </span>

      {/* sketched mini-divider tucked above the partner logos */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 opacity-60 pointer-events-none">
        <RoughDivider width={140} height={20} color="#C5C6C7" seed={97} />
      </div>

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
        <RoughDivider width={48} height={20} color="#66FCF1" seed={3} />
        A Wizarding Hackathon
        <RoughDivider width={48} height={20} color="#66FCF1" seed={5} />
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
          <span className="block">{splitLetters("HexaFalls 2")}</span>
          <span className="block text-gold-hp hp-glow-gold text-[10vw] sm:text-[7vw] md:text-[6vw] mt-2">
            {splitLetters("Techfest")}
          </span>
        </h1>

        <p
          ref={subRef}
          className="mt-8 max-w-2xl mx-auto text-base sm:text-lg font-wizard text-silver-hp/80"
        >
          Owls have been dispatched. Robes pressed, wands tuned. A 58-hour
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
        <RoughButton
          color="#66FCF1"
          glow="rgba(102,252,241,0.25)"
          shimmer
          disabled
          aria-disabled="true"
          seed={9}
          className="px-7 py-3 text-[12px] hp-pulse"
        >
          <span>REGISTER</span>
          <span className="text-[10px] tracking-[0.25em] px-2 py-0.5 rounded-full border border-gold-hp/60 bg-gold-hp/10 text-gold-hp hp-glow-gold">
            COMING SOON
          </span>
        </RoughButton>

        <RoughButton
          as={Link}
          href="/about"
          color="#C5C6C7"
          fill={false}
          seed={11}
          className="px-8 py-3 text-[12px]"
        >
          THE PROPHECY
        </RoughButton>
      </motion.div>

      {/* Call for ... — entry points to the four scrolls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="mt-20 w-full max-w-5xl"
      >
        <div className="mb-6 flex items-center justify-center gap-3 text-[11px] uppercase tracking-[0.5em] text-cyan-hp/70 font-display text-center">
          <RoughDivider width={48} height={20} color="#66FCF1" seed={7} />
          The scrolls go out
          <RoughDivider width={48} height={20} color="#66FCF1" seed={11} />
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {CALLS.map((c, i) => {
            const gold = c.accent === "gold";
            return (
              <motion.div
                key={c.href}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, delay: 0.05 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link
                  href={c.href}
                  className={`group relative flex h-full flex-col gap-2 overflow-hidden rounded-lg border px-4 py-4 transition ${
                    gold
                      ? "border-gold-hp/50 bg-gold-hp/10 hover:bg-gold-hp/15 hover:border-gold-hp/80 hover:shadow-[0_0_24px_rgba(212,175,55,0.3)]"
                      : "border-cyan-hp/40 bg-cyan-hp/5 hover:bg-cyan-hp/10 hover:border-cyan-hp/70 hover:shadow-[0_0_24px_rgba(102,252,241,0.25)]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`font-display tracking-[0.25em] uppercase text-[10px] ${
                        gold ? "text-gold-hp hp-glow-gold" : "text-cyan-hp/85"
                      }`}
                    >
                      Call for
                    </span>
                    {c.open ? (
                      <span className="rounded-full border border-gold-hp/60 bg-gold-hp/15 px-2 py-0.5 font-display text-[8px] uppercase tracking-[0.3em] text-gold-hp hp-glow-gold">
                        open
                      </span>
                    ) : (
                      <span className="rounded-full border border-silver-hp/30 px-2 py-0.5 font-display text-[8px] uppercase tracking-[0.3em] text-silver-hp/55">
                        soon
                      </span>
                    )}
                  </div>
                  <div className="font-display tracking-tight text-silver-hp text-lg leading-tight group-hover:text-silver-hp">
                    {c.short}
                  </div>
                  <div className="font-wizard text-[12px] text-silver-hp/60 leading-relaxed">
                    {c.blurb}
                  </div>
                  <div className={`mt-1 inline-flex items-center gap-1.5 font-display text-[10px] tracking-[0.3em] uppercase ${gold ? "text-gold-hp" : "text-cyan-hp/85"}`}>
                    {c.open ? "Apply now" : "Read more"}
                    <span className="group-hover:translate-x-0.5 transition">→</span>
                  </div>

                  {gold && (
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3"
                      style={{
                        background:
                          "linear-gradient(90deg, transparent, rgba(212,175,55,0.18), transparent)",
                        animation: "hp-shimmer 4.2s linear infinite",
                      }}
                    />
                  )}
                </Link>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* sketched divider */}
      <div className="mt-20 flex justify-center">
        <RoughDivider
          width={420}
          height={48}
          color="#D4AF37"
          ornament="✦"
          seed={19}
        />
      </div>

      {/* Full-width Map with mascot orb pinned bottom-right */}
      <div className="relative mt-12 w-full max-w-6xl">
        {/* sketched stars at the upper corners as page-margin scribbles */}
        <RoughStar
          size={28}
          color="#66FCF1"
          seed={23}
          className="absolute -top-8 -left-2 hp-float"
          style={{ animationDuration: "9s" }}
        />
        <RoughStar
          size={22}
          color="#A78BFA"
          seed={29}
          fill
          className="absolute -top-6 right-10 hp-float"
          style={{ animationDuration: "11s", animationDelay: "1s" }}
        />
        <LocationMap />

        {/* Mascot orb */}
        <motion.div
          initial={{ opacity: 0, scale: 0.6, rotate: -8 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1.1, ease: "easeOut", delay: 0.2 }}
          className="absolute -bottom-10 -right-6 sm:-bottom-14 sm:-right-10 z-20"
        >
          <div className="relative hp-float h-40 w-40 sm:h-56 sm:w-56" style={{ animationDuration: "7s" }}>
            {/* sketched frame brackets around the keeper */}
            <RoughCorners color="#66FCF1" length={20} inset={2} seed={67} />

            <img
              src="/mascot/mascot.webp"
              alt="HexaFalls mascot"
              className="relative h-full w-full object-contain select-none"
              style={{
                filter:
                  "drop-shadow(0 0 18px rgba(102,252,241,0.45)) drop-shadow(0 8px 24px rgba(0,0,0,0.55)) drop-shadow(0 0 36px rgba(212,175,55,0.18))",
              }}
              draggable={false}
            />
          </div>
        </motion.div>
      </div>

      {/* View on Google Maps */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="mt-12 flex justify-center"
      >
        <RoughButton
          as="a"
          href="https://www.google.com/maps/place/JIS+UNIVERSITY/@22.6759713,88.3783425,17z/data=!4m6!3m5!1s0x39f89c46c06efd83:0x36a29a26ce825e99!8m2!3d22.6759713!4d88.3783425!16s%2Fm%2F0138jwhb"
          target="_blank"
          rel="noopener noreferrer"
          color="#66FCF1"
          glow="rgba(102,252,241,0.30)"
          shimmer
          seed={17}
          className="px-6 py-3 text-[12px]"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-4 w-4">
            <path d="M12 22s7-7.58 7-13a7 7 0 1 0-14 0c0 5.42 7 13 7 13z" />
            <circle cx="12" cy="9" r="2.5" />
          </svg>
          <span>VIEW ON GOOGLE MAPS</span>
          <span className="opacity-70 group-hover:translate-x-0.5 transition">↗</span>
        </RoughButton>
      </motion.div>

      {/* footnote — more reveals coming */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9 }}
        className="mt-24 flex flex-col items-center gap-2 text-center"
      >
        <span className="inline-flex items-center gap-3 font-display text-[11px] uppercase tracking-[0.5em] text-cyan-hp/70">
          <RoughDivider width={48} height={20} color="#66FCF1" seed={3} />
          more scrolls unfurling soon
          <RoughDivider width={48} height={20} color="#66FCF1" seed={5} />
        </span>
        <span className="font-wizard text-[12px] italic text-silver-hp/45">
          tracks · prizes · sponsors · the keeper&apos;s lore — revealing in due time
        </span>
      </motion.div>
    </section>
  );
}
