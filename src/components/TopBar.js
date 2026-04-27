"use client";

import { motion } from "framer-motion";

export default function TopBar() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-midnight/60 border-b border-cyan-hp/10">
      <div className="mx-auto max-w-7xl px-5 py-3 flex items-center justify-between gap-4">
        {/* Left: brand */}
        <motion.a
          href="#"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
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
        </motion.a>

        {/* Right: nav slot (links to be added later) */}
        <motion.nav
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          aria-label="Primary"
          className="flex items-center gap-6 text-[11px] uppercase tracking-[0.3em] text-silver-hp/50 font-display"
        >
          {/* placeholder for future nav: about · tracks · sponsors · register */}
          <span className="hidden sm:block opacity-60">soon ·</span>
        </motion.nav>
      </div>
    </header>
  );
}
