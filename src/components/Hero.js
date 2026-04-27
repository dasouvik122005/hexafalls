"use client";

import { motion } from "framer-motion";
import Sparkles from "./Sparkles";

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden min-h-screen flex flex-col items-center justify-center px-6 py-24">
      {/* layered background magic */}
      <div className="absolute inset-0 -z-10 hp-stars opacity-70" />
      <div className="absolute inset-0 -z-10 hp-scrim" />
      <Sparkles count={28} />

      {/* logo slot */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mb-10 flex items-center gap-3"
      >
        <div
          className="flex h-14 w-14 items-center justify-center rounded-full border border-cyan-hp/40 bg-slate-hp/40 hp-pulse"
          aria-label="Hexafalls logo placeholder"
        >
          {/* TODO: drop /public/logo.svg here */}
          <span className="font-[family-name:var(--font-display)] text-cyan-hp text-xl font-bold">
            H
          </span>
        </div>
        <span className="font-[family-name:var(--font-display)] tracking-[0.4em] text-silver-hp/80 text-sm">
          HEXAFALLS
        </span>
      </motion.div>

      {/* headline */}
      <motion.h1
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
        className="font-[family-name:var(--font-display)] text-center text-5xl sm:text-7xl md:text-8xl font-black tracking-tight"
      >
        <span className="hp-glow text-silver-hp">A Wizarding</span>{" "}
        <span className="hp-glow-gold text-gold-hp">Hackathon</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="mt-6 max-w-2xl text-center text-lg sm:text-xl font-[family-name:var(--font-wizard)] text-silver-hp/80"
      >
        Owls have been dispatched. Summon your team, sharpen your wands —
        Hexafalls awaits at the threshold of the magical and the mundane.
      </motion.p>

      {/* mascot slot */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.8 }}
        className="relative mt-14 hp-float"
      >
        <div className="relative h-44 w-44 sm:h-56 sm:w-56 rounded-full border border-cyan-hp/30 bg-gradient-to-b from-slate-hp/60 to-midnight/80 hp-pulse flex items-center justify-center overflow-hidden">
          {/* TODO: replace with <Image src="/mascot.png" .../> when asset is ready */}
          <span className="font-[family-name:var(--font-wizard)] text-cyan-hp/70 text-xs uppercase tracking-widest">
            mascot
          </span>
          <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-cyan-hp/20" />
        </div>
      </motion.div>

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.1 }}
        className="mt-14 flex flex-col sm:flex-row items-center gap-4"
      >
        <a
          href="#register"
          className="hp-underline group relative inline-flex items-center justify-center rounded-full border border-cyan-hp/60 bg-cyan-hp/10 px-8 py-3 font-[family-name:var(--font-display)] tracking-widest text-cyan-hp transition hover:bg-cyan-hp/20 hover:shadow-[0_0_36px_rgba(102,252,241,0.45)]"
        >
          REGISTER
        </a>
        <a
          href="#about"
          className="inline-flex items-center justify-center rounded-full border border-silver-hp/30 px-8 py-3 font-[family-name:var(--font-display)] tracking-widest text-silver-hp/80 hover:text-silver-hp hover:border-silver-hp/70 transition"
        >
          LEARN MORE
        </a>
      </motion.div>

      {/* scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6, y: [0, 8, 0] }}
        transition={{ delay: 1.6, duration: 2.4, repeat: Infinity }}
        className="absolute bottom-8 text-xs uppercase tracking-[0.4em] text-silver-hp/50 font-[family-name:var(--font-display)]"
      >
        ↓ scroll for the prophecy
      </motion.div>
    </section>
  );
}
