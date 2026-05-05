"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import Sparkles from "./Sparkles";
import RoughFrame from "./RoughFrame";
import RoughButton from "./RoughButton";
import RoughDivider from "./RoughDivider";
import RoughStar from "./RoughStar";
import RoughTape from "./RoughTape";

const PLATINUM = [
  {
    name: "Devfolio",
    href: "https://devfolio.co",
    logo: "/sponsors/devfolio_dark.webp",
    logoAlt: "DEVFOLIO LOGO",
    blurb: "Hackathon platform of record — registrations, submissions, judging.",
  },
];

export default function SponsorsHall() {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const yStars = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const yMid = useTransform(scrollYProgress, [0, 1], ["0%", "55%"]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      if (reduce) {
        gsap.set(".sp-letter", { opacity: 1, y: 0 });
        return;
      }
      gsap.set(".sp-letter", { opacity: 0, y: 24 });
      gsap.to(".sp-letter", {
        opacity: 1,
        y: 0,
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
        className="sp-letter inline-block"
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

      {/* margin scribbles */}
      <RoughStar
        size={26}
        color="#D4AF37"
        fill
        seed={71}
        className="absolute top-32 left-6 sm:left-12 opacity-70 hp-float pointer-events-none"
        style={{ animationDuration: "12s" }}
      />
      <RoughStar
        size={20}
        color="#A78BFA"
        seed={79}
        className="absolute top-48 right-8 sm:right-16 opacity-65 hp-float pointer-events-none"
        style={{ animationDuration: "14s", animationDelay: "1.5s" }}
      />

      {/* Eyebrow */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
        className="mx-auto mb-6 flex max-w-3xl items-center justify-center gap-3 text-[11px] uppercase tracking-[0.5em] text-cyan-hp/70 font-display text-center"
      >
        <RoughDivider width={48} height={20} color="#66FCF1" seed={3} />
        Patrons of the craft
        <RoughDivider width={48} height={20} color="#66FCF1" seed={5} />
      </motion.div>

      {/* Headline */}
      <h1
        aria-label="Our Patrons"
        className="font-display font-black tracking-tight text-silver-hp leading-[0.95] text-center text-[12vw] sm:text-[8vw] md:text-[6vw] hp-glow"
        style={{ perspective: 800 }}
      >
        <span className="block">{splitLetters("Our")}</span>
        <span className="block text-gold-hp hp-glow-gold text-[12vw] sm:text-[7vw] md:text-[5.5vw] mt-2">
          {splitLetters("Patrons")}
        </span>
      </h1>

      <p className="mx-auto mt-8 max-w-2xl text-center font-wizard italic text-silver-hp/60 text-sm">
        The hands that carry the wood, the lanterns that light the long halls.
      </p>

      {/* Platinum tier */}
      <div className="mt-20 mx-auto max-w-5xl">
        <div className="flex items-center justify-center gap-4 mb-10">
          <RoughDivider width={120} height={22} color="#D4AF37" seed={11} />
          <span className="font-display text-[11px] uppercase tracking-[0.5em] text-gold-hp hp-glow-gold">
            Platinum
          </span>
          <RoughDivider width={120} height={22} color="#D4AF37" seed={13} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {PLATINUM.map((s, i) => (
            <motion.a
              key={s.name}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.9, delay: 0.1 + i * 0.1 }}
              className="group block"
            >
              <RoughFrame
                seed={37 + i * 4}
                stroke="#D4AF37"
                mistColor="#D4AF37"
                strokeWidth={1.5}
                roughness={1.6}
                bowing={1.2}
                padding={28}
                className="w-full bg-slate-hp/30 backdrop-blur-sm transition-transform duration-500 group-hover:-translate-y-1"
              >
                <div className="relative w-full aspect-video overflow-hidden bg-midnight/70 flex items-center justify-center">
                  <Image
                    src={s.logo}
                    alt={s.logoAlt || `${s.name} LOGO`}
                    fill
                    sizes="(min-width: 640px) 40vw, 90vw"
                    className="object-contain p-8 transition-transform duration-700 group-hover:scale-[1.03]"
                    style={{
                      WebkitMaskImage:
                        "radial-gradient(ellipse at center, black 60%, transparent 100%)",
                      maskImage:
                        "radial-gradient(ellipse at center, black 60%, transparent 100%)",
                    }}
                  />
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        "radial-gradient(ellipse at center, transparent 55%, rgba(11,12,16,0.55) 85%, rgba(11,12,16,0.95) 100%)",
                    }}
                  />
                  <div className="absolute inset-0 hp-stars opacity-15 mix-blend-screen pointer-events-none" />
                  <RoughTape color="#D4AF37" seed={61 + i} />
                </div>

                <div className="mt-5 flex flex-col items-center text-center gap-2">
                  <span className="font-display text-[10px] uppercase tracking-[0.4em] text-gold-hp/80">
                    Platinum patron
                  </span>
                  <h3 className="font-display text-2xl text-silver-hp hp-glow">
                    {s.name}
                  </h3>
                  <p className="font-wizard text-silver-hp/65 text-sm max-w-xs">
                    {s.blurb}
                  </p>
                </div>
              </RoughFrame>
            </motion.a>
          ))}

          {/* "Reserved" slot for the next platinum patron */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.9, delay: 0.3 }}
          >
            <RoughFrame
              seed={59}
              stroke="#C5C6C7"
              mistColor="#C5C6C7"
              strokeWidth={1.3}
              roughness={1.7}
              bowing={1.3}
              padding={28}
              className="w-full bg-slate-hp/15 backdrop-blur-sm"
            >
              <div className="relative w-full aspect-video flex items-center justify-center">
                <span className="font-wizard italic text-silver-hp/40 text-sm">
                  scroll yet to be inked
                </span>
              </div>
              <div className="mt-5 flex flex-col items-center text-center gap-2">
                <span className="font-display text-[10px] uppercase tracking-[0.4em] text-silver-hp/40">
                  Reserved
                </span>
                <h3 className="font-display text-2xl text-silver-hp/55">
                  Coming soon
                </h3>
              </div>
            </RoughFrame>
          </motion.div>
        </div>
      </div>

      {/* Other tiers — placeholder note */}
      <div className="mt-24 mx-auto max-w-2xl">
        <RoughFrame
          seed={97}
          stroke="#66FCF1"
          mistColor="#66FCF1"
          strokeWidth={1.3}
          roughness={1.5}
          bowing={1.2}
          padding={26}
          className="w-full bg-slate-hp/25 backdrop-blur-sm"
          inner="flex flex-col items-center text-center gap-3"
        >
          <span className="font-display text-[10px] uppercase tracking-[0.5em] text-cyan-hp/80">
            Gold · Silver · In-kind
          </span>
          <p className="font-wizard text-silver-hp/75 text-sm sm:text-base leading-relaxed">
            More patrons join the procession soon. Their seals will be set in
            the wax of these scrolls as they arrive.
          </p>
          <div className="flex items-center gap-3 mt-1 font-display text-[10px] uppercase tracking-[0.5em] text-gold-hp/80">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full opacity-60 animate-ping bg-gold-hp" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-gold-hp" />
            </span>
            Inscription in progress
          </div>
        </RoughFrame>
      </div>

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.3 }}
        className="mx-auto mt-14 flex max-w-3xl flex-row flex-wrap items-center justify-center gap-4"
      >
        <RoughButton
          as="a"
          href="mailto:sponsors@hexafalls.org"
          color="#D4AF37"
          glow="rgba(212,175,55,0.30)"
          shimmer
          seed={43}
          className="px-7 py-3 text-[12px]"
        >
          BECOME A PATRON <span>↗</span>
        </RoughButton>
        <RoughButton
          as={Link}
          href="/"
          color="#C5C6C7"
          fill={false}
          seed={47}
          className="px-7 py-3 text-[11px]"
        >
          ← BACK TO THE HALL
        </RoughButton>
      </motion.div>
    </section>
  );
}
