"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import HeroVideoBg from "./HeroVideoBg";
import Sparkles from "./Sparkles";
import RoughDivider from "./RoughDivider";
import RoughCorners from "./RoughCorners";
import RoughButton from "./RoughButton";

// The people who run HexaFalls.
const ORGS = [
  { name: "Ayushman Bhattacharya", img: "/people/orgs/ayushman.webp" },
  { name: "Sourav Singh", img: "/people/orgs/sourav.webp" },
  { name: "Amit Paul", img: "/people/orgs/amit.webp" },
  { name: "Kritika Chakraborty", img: "/people/orgs/kritika.webp" },
  { name: "Abhishek Gupta", img: "/people/orgs/abhishek.webp" },
];

export default function Organisers() {
  return (
    <section className="relative isolate overflow-hidden min-h-screen pt-32 pb-24 px-6 flex flex-col items-center">
      <HeroVideoBg />
      <div aria-hidden="true" className="absolute inset-0 -z-20 hp-scrim opacity-60 pointer-events-none" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 pointer-events-none">
        <Sparkles count={20} />
      </div>

      {/* Eyebrow */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mx-auto mb-6 flex max-w-3xl items-center justify-center gap-3 text-[11px] uppercase tracking-[0.5em] text-cyan-hp/70 font-display text-center"
      >
        <RoughDivider width={48} height={20} color="#66FCF1" seed={3} />
        The hands behind the night
        <RoughDivider width={48} height={20} color="#66FCF1" seed={5} />
      </motion.div>

      {/* Headline */}
      <h1
        aria-label="The Organisers"
        className="font-display font-black tracking-tight text-silver-hp leading-[1.05] text-balance text-center text-[10vw] sm:text-[6.5vw] md:text-[5vw] hp-glow"
        style={{ perspective: 800 }}
      >
        The{" "}
        <span className="text-gold-hp hp-glow-gold">Organisers</span>
      </h1>

      {/* Org grid */}
      <div className="mx-auto mt-14 grid w-full max-w-5xl grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
        {ORGS.map((o, i) => (
          <motion.div
            key={o.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="group flex flex-col items-center text-center"
          >
            {/* Photo holder — sketched corners over a vignetted square */}
            <div className="relative w-full aspect-square overflow-hidden rounded-md bg-midnight/60 shadow-[0_6px_24px_rgba(0,0,0,0.5)]">
              <img
                src={o.img}
                alt={o.name}
                loading="lazy"
                decoding="async"
                draggable={false}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.06]"
              />
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse at center, transparent 52%, rgba(11,12,16,0.55) 88%, rgba(11,12,16,0.85) 100%)",
                }}
              />
              <div className="pointer-events-none absolute inset-0 hp-stars opacity-10 mix-blend-screen" />
              <RoughCorners color={o.role ? "#D4AF37" : "#66FCF1"} length={16} inset={4} seed={31 + i * 9} />
            </div>

            {/* Name + (lead) designation/contact */}
            <h3 className="mt-3 font-display text-sm sm:text-base text-silver-hp leading-tight">
              {o.name}
            </h3>
            {o.role && (
              <span className="mt-1 inline-flex items-center rounded-full border border-gold-hp/40 bg-gold-hp/10 px-2.5 py-0.5 font-display text-[9px] uppercase tracking-[0.3em] text-gold-hp hp-glow-gold">
                {o.role}
              </span>
            )}
            {o.phone && (
              <a
                href={`tel:${o.tel}`}
                className="mt-1.5 font-mono text-xs text-cyan-hp/80 hover:text-cyan-hp transition"
                aria-label={`Call ${o.name} at ${o.phone}`}
              >
                {o.phone}
              </a>
            )}
          </motion.div>
        ))}
      </div>

      {/* Back */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="mt-16 flex justify-center"
      >
        <RoughButton
          as={Link}
          href="/teams"
          color="#C5C6C7"
          fill={false}
          seed={31}
          className="px-7 py-3 text-[11px] tracking-[0.35em]"
        >
          ← ALL TEAMS
        </RoughButton>
      </motion.div>
    </section>
  );
}
