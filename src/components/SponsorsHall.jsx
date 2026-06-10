"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import gsap from "gsap";
import Sparkles from "./Sparkles";
import RoughFrame from "./RoughFrame";
import RoughButton from "./RoughButton";
import RoughDivider from "./RoughDivider";
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
      {
        name: "OWASP",
        href: "https://owasp.org",
        logo: "/sponsors/owasp.png",
        logoAlt: "OWASP LOGO",
        invert: true,
        scale: 1.3,
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
      {
        name: "GitHub",
        href: "https://github.com",
        logo: "/sponsors/github.png",
        logoAlt: "GITHUB LOGO",
      },
      {
        name: "Orkes",
        href: "https://orkes.io",
        logo: "/sponsors/orkes.png",
        logoAlt: "ORKES LOGO",
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
              className="sp-letter inline-block"
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
      <div aria-hidden="true" className="absolute inset-0 -z-30 hp-stars pointer-events-none" />
      <div aria-hidden="true" className="absolute inset-0 -z-20 hp-scrim pointer-events-none" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 pointer-events-none">
        <Sparkles count={24} />
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


      {/* ── Tiered sponsors ────────────────────────────────────────────────
          One bold category header per tier with a row of logos beneath.
          No per-logo tier captions — the section header already says it.
          Logo plate sizes scale with rank (top tier biggest). */}
      <div className="mt-14 mx-auto max-w-5xl flex flex-col gap-14">
        {TIERS.map((tier, ti) => {
          if (!tier.sponsors?.length) return null;
          // Every sponsor plate is the SAME size regardless of tier — only the
          // section header distinguishes ranks, so all logos read as equals.
          const plateClass = "h-20 w-48 sm:h-24 sm:w-56";
          const framePad = 12;
          const tapeWidth = 52;

          return (
            <div key={tier.label}>
              {/* Bold tier header */}
              <div className="flex items-center justify-center gap-5 mb-8">
                <RoughDivider
                  width={120}
                  height={24}
                  color="#D4AF37"
                  seed={11 + ti * 4}
                />
                <span className="font-display font-black text-base sm:text-lg uppercase tracking-[0.55em] text-gold-hp hp-glow-gold whitespace-nowrap drop-shadow-[0_0_18px_rgba(212,175,55,0.45)]">
                  {tier.label}
                </span>
                <RoughDivider
                  width={120}
                  height={24}
                  color="#D4AF37"
                  seed={13 + ti * 4}
                />
              </div>

              {/* Logo row — wraps on narrow viewports */}
              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-6">
                {tier.sponsors.map((s, i) => (
                  <motion.a
                    key={`${tier.label}-${s.name}`}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.name}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{
                      duration: 0.4,
                      delay: (ti * 2 + i) * 0.03,
                    }}
                    className="group block"
                  >
                    <RoughFrame
                      seed={41 + ti * 13 + i * 5}
                      stroke="#D4AF37"
                      mist={false}
                      strokeWidth={1.4}
                      roughness={1.6}
                      bowing={1.2}
                      padding={framePad}
                      className="bg-silver-hp transition-transform duration-500 group-hover:-translate-y-1"
                    >
                      <div
                        className={`relative bg-silver-hp rounded-sm flex items-center justify-center px-4 ${plateClass}`}
                      >
                        <img
                          src={s.logo}
                          alt={s.logoAlt || s.name}
                          loading={ti === 0 ? "eager" : "lazy"}
                          decoding="async"
                          className="max-h-full max-w-full object-contain"
                          style={{
                            filter: s.invert ? "invert(1)" : undefined,
                            transform: s.scale ? `scale(${s.scale})` : undefined,
                          }}
                        />
                        <RoughTape
                          color="#D4AF37"
                          seed={73 + ti * 7 + i}
                          width={tapeWidth}
                          height={12}
                        />
                      </div>
                    </RoughFrame>
                  </motion.a>
                ))}
              </div>
            </div>
          );
        })}
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
          as="a"
          href="mailto:support@hexafalls.org"
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
          MAIL US TO BE A SPONSOR <span>↗</span>
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
