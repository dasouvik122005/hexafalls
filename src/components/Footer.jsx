"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const SITEMAP = [
  { href: "/about",     label: "The Prophecy" },
  { href: "/timeline",  label: "Timeline",            soon: true },
  { href: "/register",  label: "Registration",        soon: true },
  { href: "/core-team", label: "Call for Core Team",  soon: true },
  { href: "/judges",    label: "Judges & Mentors",    soon: true },
  { href: "/sponsors",  label: "Call for Sponsors",   soon: true },
  { href: "/volunteer", label: "Call for Volunteers" },
];

const EMAIL    = "teams.hexafalls@gmail.com";
const GDG_LINK = "https://gdg.community.dev/gdg-on-campus-jis-university-kolkata-india/";

const SOCIALS = [
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/hexafalls/",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-4 w-4">
        <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3V9zm7 0h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.4c0-1.29-.02-2.95-1.8-2.95-1.8 0-2.08 1.4-2.08 2.85V21h-4V9z"/>
      </svg>
    ),
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/hexafalls_/",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-4 w-4">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.9" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    name: "X",
    href: "https://x.com/hexafalls",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-4 w-4">
        <path d="M18.244 2H21.5l-7.5 8.57L23 22h-6.79l-5.32-6.96L4.8 22H1.54l8.02-9.16L1 2h6.96l4.81 6.36L18.244 2zm-1.19 18h1.88L7.04 4h-2L17.054 20z"/>
      </svg>
    ),
  },
];

export default function Footer() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // fallback: select via temp textarea
      const ta = document.createElement("textarea");
      ta.value = EMAIL;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); setCopied(true); setTimeout(() => setCopied(false), 1800); }
      catch { /* noop */ }
      document.body.removeChild(ta);
    }
  };

  return (
    <footer className="relative mt-20 border-t border-cyan-hp/10 bg-midnight overflow-hidden">
      {/* sketched divider sparkle */}
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-cyan-hp/40 to-transparent" />
      <div className="absolute inset-0 hp-stars opacity-20 pointer-events-none" />

      {/* Brand row */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="relative mx-auto max-w-7xl px-6 pt-14 pb-6 flex flex-col items-center text-center gap-3"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-md border border-cyan-hp/40 bg-slate-hp/60">
            <span className="font-display text-cyan-hp text-lg font-bold">H</span>
          </span>
          <span className="font-display tracking-[0.4em] text-silver-hp/85">
            HEXAFALLS
          </span>
        </div>
        <p className="font-wizard text-sm text-silver-hp/60 max-w-md leading-relaxed">
          A wizarding hackathon, conjured by GDG on Campus · JIS University.
          More scrolls of prophecy unfurling soon.
        </p>

        {/* Socials */}
        <ul className="mt-3 flex items-center gap-3" aria-label="Follow Hexafalls">
          {SOCIALS.map((s) => (
            <li key={s.name}>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.name}
                title={s.name}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-silver-hp/25 bg-slate-hp/50 text-silver-hp/75 hover:text-cyan-hp hover:border-cyan-hp/60 hover:shadow-[0_0_18px_rgba(102,252,241,0.25)] transition"
              >
                {s.icon}
              </a>
            </li>
          ))}
        </ul>
      </motion.div>

      <div className="relative mx-auto max-w-7xl px-6 pb-14 grid gap-10 md:grid-cols-3 items-start">
        {/* LEFT — Contact (Send an Owl) */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.05 }}
          className="flex flex-col gap-3 md:items-start"
        >
          <div className="font-display text-[11px] uppercase tracking-[0.4em] text-cyan-hp/70">
            Send an Owl
          </div>
          <button
            type="button"
            onClick={copyEmail}
            aria-label={`Copy email ${EMAIL}`}
            className="group inline-flex items-center gap-3 self-start rounded-full border border-silver-hp/25 bg-slate-hp/50 px-4 py-2 text-sm text-silver-hp/85 hover:border-cyan-hp/60 hover:text-cyan-hp transition cursor-pointer"
          >
            <span className="font-mono">{EMAIL}</span>
            <span className="text-[10px] uppercase tracking-[0.25em] text-silver-hp/50 group-hover:text-cyan-hp transition">
              {copied ? "✓ copied" : "click to copy"}
            </span>
          </button>
        </motion.div>

        {/* MIDDLE — sitemap */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="flex flex-col gap-3 md:items-center text-center"
        >
          <div className="font-display text-[11px] uppercase tracking-[0.4em] text-cyan-hp/70">
            The Corridors
          </div>
          <ul className="flex flex-col gap-1.5 md:items-center">
            {SITEMAP.map((s) => (
              <li key={s.href}>
                <Link
                  href={s.href}
                  className="group inline-flex items-center gap-2 text-[13px] text-silver-hp/75 hover:text-cyan-hp transition"
                >
                  <span className="font-wizard">{s.label}</span>
                  {s.soon && (
                    <span className="rounded-full border border-gold-hp/40 bg-gold-hp/10 px-1.5 py-0.5 font-display text-[8px] uppercase tracking-[0.25em] text-gold-hp/80">
                      soon
                    </span>
                  )}
                  <span className="text-cyan-hp/50 group-hover:translate-x-0.5 transition">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* RIGHT — The Order */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="flex flex-col gap-3 md:items-end"
        >
          <div className="font-display text-[11px] uppercase tracking-[0.4em] text-cyan-hp/70">
            The Order
          </div>
          <a
            href={GDG_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="hp-underline group inline-flex items-center gap-2 text-sm text-silver-hp/85 hover:text-cyan-hp transition"
          >
            GDG on Campus · JIS University
            <span className="text-cyan-hp/70 group-hover:translate-x-0.5 transition">↗</span>
          </a>
          <span className="font-wizard text-[11px] text-silver-hp/40 italic">
            join the chapter
          </span>
        </motion.div>
      </div>

      {/* Bottom strip */}
      <div className="relative border-t border-cyan-hp/10">
        <div className="mx-auto max-w-7xl px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] uppercase tracking-[0.3em] text-silver-hp/40 font-display">
          <span>© {new Date().getFullYear()} Hexafalls</span>
          <span className="text-silver-hp/60">developed by @elixpo on GitHub</span>
        </div>
      </div>
    </footer>
  );
}
