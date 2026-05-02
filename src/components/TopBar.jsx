"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { SITEMAP } from "@/lib/routes";
import RoughDivider from "./RoughDivider";
import RoughStar from "./RoughStar";

export default function TopBar() {
  const [open, setOpen] = useState(false);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Lock scroll when menu is open
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

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
            onClick={() => setOpen(false)}
          >
            <span
              className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-md border border-cyan-hp/40 bg-slate-hp/60 group-hover:border-cyan-hp/80 transition"
              aria-label="Hexafalls logo"
            >
              <img
                src="/logos/main_logo.png"
                alt="HexaFalls"
                className="h-full w-full object-contain p-1"
                draggable={false}
              />
            </span>
            <span className="font-display tracking-[0.4em] text-sm text-silver-hp/85 group-hover:text-cyan-hp transition">
              HEXAFALLS 2
            </span>
          </Link>
        </motion.div>

        {/* Right: desktop icon nav */}
        <motion.nav
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          aria-label="Primary"
          className="hidden md:flex items-center gap-4 lg:gap-5"
        >
          {SITEMAP.map((s) => (
            <div key={s.href} className="relative group">
              <Link
                href={s.href}
                aria-label={s.label}
                className={`relative inline-flex h-9 w-9 items-center justify-center rounded-full border transition ${
                  s.soon
                    ? "border-gold-hp/40 bg-gold-hp/10 text-gold-hp hover:bg-gold-hp/15 hover:border-gold-hp/70 hover:shadow-[0_0_18px_rgba(212,175,55,0.3)] hp-glow-gold"
                    : "border-cyan-hp/40 bg-cyan-hp/10 text-cyan-hp hover:bg-cyan-hp/15 hover:border-cyan-hp/70 hover:shadow-[0_0_18px_rgba(102,252,241,0.3)] hp-glow"
                }`}
              >
                {s.icon}
              </Link>

              {/* tooltip */}
              <div
                role="tooltip"
                className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-full mt-3 origin-top scale-95 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100 transition-all duration-200 ease-out z-10"
              >
                <div
                  className={`relative whitespace-nowrap rounded-md border bg-midnight/95 backdrop-blur-sm px-2.5 py-1.5 font-display text-[10px] uppercase tracking-[0.3em] shadow-[0_4px_24px_rgba(0,0,0,0.6)] ${
                    s.soon
                      ? "border-gold-hp/50 text-gold-hp hp-glow-gold"
                      : "border-cyan-hp/50 text-cyan-hp hp-glow"
                  }`}
                >
                  {s.label}
                  {s.soon && <span className="ml-2 text-[8px] tracking-[0.25em] text-gold-hp/70">· soon</span>}
                  <span
                    aria-hidden="true"
                    className={`absolute -top-1 left-1/2 -translate-x-1/2 h-2 w-2 rotate-45 border-l border-t bg-midnight/95 ${
                      s.soon ? "border-gold-hp/50" : "border-cyan-hp/50"
                    }`}
                  />
                </div>
              </div>
            </div>
          ))}
        </motion.nav>

        {/* Right: mobile hamburger */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          className="md:hidden relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-cyan-hp/40 bg-cyan-hp/10 text-cyan-hp hover:border-cyan-hp/70 hover:bg-cyan-hp/15 transition hp-glow"
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          {/* animated bars */}
          <span className="relative block h-3.5 w-5">
            <span
              className={`absolute left-0 right-0 h-[1.5px] bg-current transition-all duration-300 ${
                open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0"
              }`}
            />
            <span
              className={`absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[1.5px] bg-current transition-all duration-200 ${
                open ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-0 right-0 h-[1.5px] bg-current transition-all duration-300 ${
                open ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-0"
              }`}
            />
          </span>
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <>
            {/* backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setOpen(false)}
              className="md:hidden fixed inset-0 z-40 bg-midnight/70 backdrop-blur-sm"
            />
            {/* panel */}
            <motion.div
              key="panel"
              id="mobile-menu"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="md:hidden absolute left-0 right-0 top-full z-50 border-b border-cyan-hp/15 bg-midnight/95 backdrop-blur-md"
            >
              <nav aria-label="Mobile" className="mx-auto max-w-7xl px-5 py-4">
                <ul className="flex flex-col gap-1.5">
                  {SITEMAP.map((s, i) => (
                    <motion.li
                      key={s.href}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.04 + i * 0.04, ease: "easeOut" }}
                    >
                      <Link
                        href={s.href}
                        onClick={() => setOpen(false)}
                        className={`group flex items-center gap-3 rounded-lg border px-3 py-3 transition ${
                          s.soon
                            ? "border-gold-hp/30 bg-gold-hp/5 text-gold-hp/90 hover:bg-gold-hp/10 hover:border-gold-hp/60"
                            : "border-cyan-hp/30 bg-cyan-hp/5 text-cyan-hp hover:bg-cyan-hp/10 hover:border-cyan-hp/60"
                        }`}
                      >
                        <span
                          className={`relative inline-flex h-9 w-9 items-center justify-center rounded-full border ${
                            s.soon ? "border-gold-hp/40" : "border-cyan-hp/40"
                          }`}
                        >
                          {s.icon}
                        </span>
                        <span className="flex-1 font-display tracking-[0.25em] uppercase text-[12px]">
                          {s.label}
                        </span>
                        {s.soon && (
                          <span className="rounded-full border border-gold-hp/40 bg-gold-hp/10 px-2 py-0.5 font-display text-[8px] uppercase tracking-[0.25em] text-gold-hp/80">
                            soon
                          </span>
                        )}
                        <span className={`${s.soon ? "text-gold-hp/60" : "text-cyan-hp/60"} group-hover:translate-x-0.5 transition`}>→</span>
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
