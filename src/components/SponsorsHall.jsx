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
        Sponsors of the craft
        <RoughDivider width={48} height={20} color="#66FCF1" seed={5} />
      </motion.div>

      {/* Headline */}
      <h1
        aria-label="Our Sponsors"
        className="font-display font-black tracking-tight text-silver-hp leading-[1.05] text-balance text-center text-[9vw] sm:text-[6vw] md:text-[4.5vw] hp-glow"
        style={{ perspective: 800 }}
      >
        {splitLetters("Our")}<span style={{whiteSpace: "pre"}}> </span><span className="text-gold-hp hp-glow-gold text-[9vw] sm:text-[5vw] md:text-[4vw]">{splitLetters("Sponsors")}</span>
      </h1>

      <p className="mx-auto mt-8 max-w-2xl text-center font-wizard italic text-silver-hp/60 text-sm">
        The hands that carry the wood, the lanterns that light the long halls.
      </p>

      {/* ── Marquee: Collaborative Partner ─────────────────────────────────
          The headline sponsor gets a single wide horizontal card — one
          confident beat rather than a vertical stack. */}
      {TIERS[0]?.sponsors?.length > 0 && (
        <div className="mt-14 mx-auto max-w-3xl">
          <div className="flex items-center justify-center gap-5 mb-8">
            <RoughDivider width={120} height={24} color="#D4AF37" seed={11} />
            <span className="font-display font-black text-base sm:text-lg uppercase tracking-[0.55em] text-gold-hp hp-glow-gold whitespace-nowrap drop-shadow-[0_0_18px_rgba(212,175,55,0.45)]">
              {TIERS[0].label}
            </span>
            <RoughDivider width={120} height={24} color="#D4AF37" seed={13} />
          </div>
          {TIERS[0].sponsors.map((s, i) => (
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
              className="group block"
            >
              <RoughFrame
                seed={37 + i * 4}
                stroke="#D4AF37"
                mist={false}
                strokeWidth={1.6}
                roughness={1.6}
                bowing={1.2}
                padding={16}
                className="w-full bg-silver-hp transition-transform duration-500 group-hover:-translate-y-1"
              >
                <div className="relative w-full h-28 sm:h-32 bg-silver-hp flex items-center justify-center px-8 rounded-sm">
                  <img
                    src={s.logo}
                    alt={s.logoAlt || s.name}
                    loading="eager"
                    decoding="async"
                    className="max-h-full max-w-full object-contain transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                  <RoughTape color="#D4AF37" seed={61 + i} width={64} height={14} />
                </div>
              </RoughFrame>
            </motion.a>
          ))}
        </div>
      )}

      {/* ── Horizontal procession of all other sponsors ────────────────────
          Every remaining tier collapses into ONE wrapping flex row of
          compact chips — each logo lives inside its own RoughFrame artifact
          with a sketched gold tape accent and a bold gold tier caption
          beneath. Replaces the previous long vertical shaft. */}
      <div className="mt-20 mx-auto max-w-5xl">
        <div className="flex items-center justify-center gap-5 mb-10">
          <RoughDivider width={120} height={24} color="#D4AF37" seed={17} />
          <span className="font-display font-black text-base sm:text-lg uppercase tracking-[0.55em] text-gold-hp hp-glow-gold whitespace-nowrap drop-shadow-[0_0_18px_rgba(212,175,55,0.45)]">
            The Procession
          </span>
          <RoughDivider width={120} height={24} color="#D4AF37" seed={19} />
        </div>

        <div className="flex flex-wrap items-start justify-center gap-x-7 gap-y-10">
          {TIERS.slice(1).flatMap((tier, ti) =>
            tier.sponsors.map((s, i) => (
              <motion.a
                key={`${tier.label}-${s.name}`}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${s.name} — ${tier.label}`}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: (ti * 2 + i) * 0.03 }}
                className="group flex flex-col items-center gap-3"
              >
                {/* Same rough.js artifact treatment as the marquee — sketched
                    gold outline, silver plate, washi tape corner. Smaller
                    scale for the row chips. */}
                <RoughFrame
                  seed={41 + ti * 13 + i * 5}
                  stroke="#D4AF37"
                  mist={false}
                  strokeWidth={1.3}
                  roughness={1.6}
                  bowing={1.2}
                  padding={10}
                  className="bg-silver-hp transition-transform duration-500 group-hover:-translate-y-1"
                >
                  <div className="relative h-14 w-36 sm:h-16 sm:w-40 bg-silver-hp flex items-center justify-center px-3 rounded-sm">
                    <img
                      src={s.logo}
                      alt={s.logoAlt || s.name}
                      loading="lazy"
                      decoding="async"
                      className="max-h-full max-w-full object-contain"
                    />
                    <RoughTape color="#D4AF37" seed={73 + ti * 7 + i} width={42} height={11} />
                  </div>
                </RoughFrame>
                <span className="font-display font-bold text-[11px] sm:text-xs uppercase tracking-[0.45em] text-gold-hp hp-glow-gold whitespace-nowrap">
                  {tier.label}
                </span>
              </motion.a>
            )),
          )}
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
            Platinum · Silver
          </span>
          <p className="font-wizard text-silver-hp/85 text-base sm:text-lg leading-relaxed">
            More sponsors join the procession soon. Their seals will be set in
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
          as={Link}
          href="/sponsors/brochure"
          color="#D4AF37"
          glow="rgba(212,175,55,0.40)"
          shimmer
          seed={43}
          className="px-10 sm:px-12 py-4 text-[13px] sm:text-[14px] tracking-[0.35em]"
        >
          VIEW SPONSORSHIP BROCHURE <span>↗</span>
        </RoughButton>
        <RoughButton
          as="a"
          href="mailto:support@hexafalls.org?subject=HexaFalls%20Sponsorship%20—%20interested"
          color="#66FCF1"
          glow="rgba(102,252,241,0.30)"
          seed={45}
          className="px-9 sm:px-10 py-4 text-[12px] sm:text-[13px] tracking-[0.35em]"
        >
          TALK TO ORGANIZER <span>↗</span>
        </RoughButton>
        <RoughButton
          color="#66FCF1"
          glow="rgba(102,252,241,0.25)"
          shimmer
          disabled
          aria-disabled="true"
          seed={46}
          className="px-9 sm:px-10 py-4 text-[12px] sm:text-[13px] tracking-[0.35em] hp-pulse"
        >
          <span>APPLY FOR SPONSOR</span>
          <span className="text-[9px] tracking-[0.25em] px-2 py-0.5 rounded-full border border-gold-hp/60 bg-gold-hp/10 text-gold-hp hp-glow-gold">
            COMING SOON
          </span>
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
