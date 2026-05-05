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

const GOLD = [
  {
    name: "Devfolio",
    href: "https://devfolio.co",
    logo: "/sponsors/Devfolio_Logo-White.png",
    logoAlt: "DEVFOLIO LOGO",
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

      {/* Gold tier */}
      <div className="mt-20 mx-auto max-w-3xl">
        <div className="flex items-center justify-center gap-4 mb-10">
          <RoughDivider width={120} height={22} color="#D4AF37" seed={11} />
          <span className="font-display text-[11px] uppercase tracking-[0.5em] text-gold-hp hp-glow-gold">
            Gold
          </span>
          <RoughDivider width={120} height={22} color="#D4AF37" seed={13} />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 justify-items-center">
          {GOLD.map((s, i) => (
            <motion.a
              key={s.name}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.9, delay: 0.1 + i * 0.1 }}
              className="group block w-full max-w-55"
            >
              <RoughFrame
                seed={37 + i * 4}
                stroke="#D4AF37"
                mist={false}
                strokeWidth={1.4}
                roughness={1.6}
                bowing={1.2}
                padding={12}
                className="w-full bg-midnight transition-transform duration-500 group-hover:-translate-y-1"
              >
                {/* Brand mark on a solid single-colour background, no mask,
                    no overlay — per Devfolio brand guidelines. */}
                <div className="relative w-full aspect-video overflow-hidden bg-midnight flex items-center justify-center">
                  <Image
                    src={s.logo}
                    alt={s.logoAlt || s.name}
                    fill
                    sizes="(min-width: 640px) 200px, 40vw"
                    priority
                    className="object-contain p-4 transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                  <RoughTape color="#D4AF37" seed={61 + i} width={56} height={14} />
                </div>
              </RoughFrame>
            </motion.a>
          ))}
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
            Platinum · Silver · In-kind
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
