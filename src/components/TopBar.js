"use client";

import { motion } from "framer-motion";

const logos = [
  { id: "gdg",  label: "GDG JISU",       hint: "Google Developer Group" },
  { id: "jisu", label: "JIS University", hint: "JIS University" },
  { id: "cse",  label: "Dept. of CSE",   hint: "Computer Science & Engg." },
];

export default function TopBar() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-midnight/60 border-b border-cyan-hp/10">
      <div className="mx-auto max-w-7xl px-5 py-3 flex items-center justify-between gap-4">
        {/* Left: partner logos */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="flex items-center gap-3 sm:gap-5"
        >
          {logos.map((l, i) => (
            <div
              key={l.id}
              title={l.hint}
              className="flex items-center gap-2 group"
            >
              <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-md border border-silver-hp/25 bg-slate-hp/60 flex items-center justify-center text-[10px] font-[family-name:var(--font-display)] text-silver-hp/70 group-hover:border-cyan-hp/50 group-hover:text-cyan-hp transition">
                {/* TODO: drop /public/logos/{l.id}.svg here */}
                {l.id.toUpperCase().slice(0, 3)}
              </div>
              <span className="hidden md:block text-[11px] tracking-[0.2em] uppercase text-silver-hp/60 group-hover:text-silver-hp/90 transition">
                {l.label}
              </span>
              {i < logos.length - 1 && (
                <span className="hidden md:block text-silver-hp/20">·</span>
              )}
            </div>
          ))}
        </motion.div>

        {/* Right: wordmark */}
        <motion.a
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          href="#"
          className="font-[family-name:var(--font-display)] tracking-[0.4em] text-xs sm:text-sm text-silver-hp/80 hover:text-cyan-hp transition"
        >
          HEXAFALLS · ⚡
        </motion.a>
      </div>
    </header>
  );
}
