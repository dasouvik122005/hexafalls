"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import gsap from "gsap";
import Sparkles from "./Sparkles";
import RoughFrame from "./RoughFrame";
import RoughButton from "./RoughButton";
import RoughDivider from "./RoughDivider";
import HeroVideoBg from "./HeroVideoBg";
import RoughStar from "./RoughStar";
import RoughTape from "./RoughTape";

const TIERS = [
  {
    label: "Collaborative Partner",
    sponsors: [
      {
        name: "Miro",
        href: "https://miro.com",
        logo: "/sponsors/miro.png",
        logoAlt: "MIRO LOGO",
      },
    ],
  },
  {
    label: "Gold",
    sponsors: [
      {
        name: "Devfolio",
        href: "https://devfolio.co",
        logo: "/sponsors/devfolio.png",
        logoAlt: "DEVFOLIO LOGO",
      },
    ],
  },
  {
    label: "In Kind",
    sponsors: [
      {
        name: ".xyz",
        href: "https://gen.xyz",
        logo: "/sponsors/xyz.png",
        logoAlt: "XYZ LOGO",
      },
      {
        name: "n8n",
        href: "https://n8n.io",
        logo: "/sponsors/n8n.png",
        logoAlt: "N8N LOGO",
      },
    ],
  },
];

export default function SponsorsHall() {
  const sectionRef = useRef(null);

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
        duration: 0.4,
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
      <HeroVideoBg />
      <div aria-hidden="true" className="absolute inset-0 -z-20 hp-scrim pointer-events-none" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 pointer-events-none">
        <Sparkles count={18} />
      </div>

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
        transition={{ duration: 0.4 }}
        className="mx-auto mb-6 flex max-w-3xl items-center justify-center gap-3 text-[11px] uppercase tracking-[0.5em] text-cyan-hp/70 font-display text-center"
      >
        <RoughDivider width={48} height={20} color="#66FCF1" seed={3} />
        Patrons of the craft
        <RoughDivider width={48} height={20} color="#66FCF1" seed={5} />
      </motion.div>

      {/* Headline */}
      <h1
        aria-label="Our Patrons"
        className="font-display font-black tracking-tight text-silver-hp leading-[1.05] text-balance text-center text-[9vw] sm:text-[6vw] md:text-[4.5vw] hp-glow"
        style={{ perspective: 800 }}
      >
        {splitLetters("Our")}<span style={{whiteSpace: "pre"}}> </span><span className="text-gold-hp hp-glow-gold text-[9vw] sm:text-[5vw] md:text-[4vw]">{splitLetters("Patrons")}</span>
      </h1>

      <p className="mx-auto mt-8 max-w-2xl text-center font-wizard italic text-silver-hp/60 text-sm">
        The hands that carry the wood, the lanterns that light the long halls.
      </p>

      {/* Tiered patrons */}
      <div className="mt-16 mx-auto max-w-4xl space-y-14">
        {TIERS.map((tier, t) => (
          <div key={tier.label}>
            <div className="flex items-center justify-center gap-4 mb-6">
              <RoughDivider width={96} height={20} color="#D4AF37" seed={11 + t * 2} />
              <span className="font-display text-[11px] uppercase tracking-[0.5em] text-gold-hp hp-glow-gold whitespace-nowrap">
                {tier.label}
              </span>
              <RoughDivider width={96} height={20} color="#D4AF37" seed={13 + t * 2} />
            </div>

            <div className="flex flex-wrap items-stretch justify-center gap-6">
              {tier.sponsors.map((s, i) => (
                <motion.a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.4, delay: i * 0.03 }}
                  className="group block w-72 max-w-full"
                >
                  <RoughFrame
                    seed={37 + (t * 17) + i * 4}
                    stroke="#D4AF37"
                    mist={false}
                    strokeWidth={1.4}
                    roughness={1.6}
                    bowing={1.2}
                    padding={14}
                    className="w-full bg-silver-hp transition-transform duration-500 group-hover:-translate-y-1"
                  >
                    {/* Brand mark on a solid single-colour background, no
                        mask, no overlay — per partner brand guidelines.
                        Plain <img> + a fixed-height holder so wide wordmark
                        logos render legibly without being cropped. */}
                    <div className="relative w-full h-24 bg-silver-hp flex items-center justify-center px-6 rounded-sm">
                      <img
                        src={s.logo}
                        alt={s.logoAlt || s.name}
                        loading="eager"
                        decoding="async"
                        className="max-h-full max-w-full object-contain transition-transform duration-700 group-hover:scale-[1.03]"
                      />
                      <RoughTape color="#D4AF37" seed={61 + t * 11 + i} width={56} height={14} />
                    </div>
                  </RoughFrame>
                </motion.a>
              ))}
            </div>
          </div>
        ))}
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
            Platinum · Silver
          </span>
          <p className="font-wizard text-silver-hp/85 text-base sm:text-lg leading-relaxed">
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
        transition={{ duration: 0.4, delay: 0.3 }}
        className="mx-auto mt-14 flex max-w-3xl flex-row flex-wrap items-center justify-center gap-4"
      >
        <RoughButton
          as="a"
          href="mailto:support@hexafalls.org"
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
