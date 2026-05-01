"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function TopBar() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-midnight/60 border-b border-cyan-hp/10">
      <div className="mx-auto max-w-7xl px-5 py-3 flex items-center justify-between gap-4">
        {/* Left: brand */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
        <Link
          href="/"
          aria-label="HexaFalls — home"
          className="flex items-center gap-3 group"
        >
          <span
            className="flex h-9 w-9 items-center justify-center rounded-md border border-cyan-hp/40 bg-slate-hp/60 group-hover:border-cyan-hp/80 transition"
            aria-label="Hexafalls logo"
          >
            {/* TODO: drop /public/logo.svg */}
            <span className="font-display text-cyan-hp text-lg font-bold">H</span>
          </span>
          <span className="font-display tracking-[0.4em] text-sm text-silver-hp/85 group-hover:text-cyan-hp transition">
            HEXAFALLS
          </span>
        </Link>
        </motion.div>

        {/* Right: nav */}
        <motion.nav
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          aria-label="Primary"
          className="flex items-center gap-3 sm:gap-5 text-[11px] uppercase tracking-[0.3em] text-silver-hp/50 font-display"
        >
          <div className="relative group">
            <Link
              href="/volunteer"
              aria-label="Call for Volunteers"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gold-hp/40 bg-gold-hp/10 text-gold-hp hover:bg-gold-hp/15 hover:border-gold-hp/70 hover:shadow-[0_0_18px_rgba(212,175,55,0.3)] transition hp-glow-gold"
            >
              {/* quill / scroll icon */}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-4 w-4 group-hover:-rotate-6 transition-transform">
                <path d="M19 3l2 2-9 9-3 1 1-3 9-9z" />
                <path d="M14 8l2 2" />
                <path d="M5 21c2-3 4-4 7-4" />
                <path d="M3 21h6" />
              </svg>
            </Link>

            {/* custom tooltip */}
            <div
              role="tooltip"
              className="pointer-events-none absolute right-0 top-full mt-3 origin-top-right scale-95 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100 transition-all duration-200 ease-out z-10"
            >
              <div className="relative whitespace-nowrap rounded-md border border-gold-hp/50 bg-midnight/95 backdrop-blur-sm px-3 py-1.5 font-display text-[10px] uppercase tracking-[0.35em] text-gold-hp hp-glow-gold shadow-[0_4px_24px_rgba(0,0,0,0.6)]">
                Call for Volunteers
                {/* arrow */}
                <span
                  aria-hidden="true"
                  className="absolute -top-1 right-3 h-2 w-2 rotate-45 border-l border-t border-gold-hp/50 bg-midnight/95"
                />
              </div>
            </div>
          </div>
        </motion.nav>
      </div>
    </header>
  );
}
