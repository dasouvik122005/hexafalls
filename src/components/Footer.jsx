"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { SITEMAP } from "@/lib/routes";
import RoughDivider from "./RoughDivider";
import RoughStar from "./RoughStar";
import RoughTape from "./RoughTape";


const EMAIL    = "support@hexafalls.org";
const GDG_LINK = "https://gdg.community.dev/gdg-on-campus-jis-university-kolkata-india/";
const GITHUB_ORG = "https://github.com/hexafest";

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
  {
    name: "Discord",
    href: "https://discord.gg/U73N82FeNP",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-4 w-4">
        <path d="M20.317 4.369A19.79 19.79 0 0 0 16.21 3.05a.07.07 0 0 0-.073.035c-.21.375-.444.864-.608 1.249a18.27 18.27 0 0 0-5.487 0 12.55 12.55 0 0 0-.617-1.25.072.072 0 0 0-.073-.034 19.74 19.74 0 0 0-4.107 1.32.066.066 0 0 0-.03.027C2.05 8.247 1.39 12.005 1.7 15.73a.082.082 0 0 0 .031.056 19.91 19.91 0 0 0 5.993 3.027.073.073 0 0 0 .079-.026 14.2 14.2 0 0 0 1.227-1.994.07.07 0 0 0-.038-.098 13.1 13.1 0 0 1-1.872-.892.07.07 0 0 1-.007-.117c.126-.094.252-.192.371-.291a.07.07 0 0 1 .074-.01c3.927 1.793 8.18 1.793 12.062 0a.07.07 0 0 1 .074.009c.12.099.246.198.372.292a.07.07 0 0 1-.006.117 12.3 12.3 0 0 1-1.873.892.07.07 0 0 0-.038.099 15.92 15.92 0 0 0 1.226 1.993.07.07 0 0 0 .079.027 19.84 19.84 0 0 0 6.002-3.027.07.07 0 0 0 .03-.055c.5-4.318-.838-8.043-3.549-11.336a.056.056 0 0 0-.028-.027zM8.02 13.46c-1.182 0-2.156-1.085-2.156-2.418 0-1.333.955-2.418 2.156-2.418 1.21 0 2.176 1.094 2.156 2.418 0 1.333-.955 2.418-2.156 2.418zm7.974 0c-1.182 0-2.157-1.085-2.157-2.418 0-1.333.955-2.418 2.157-2.418 1.21 0 2.175 1.094 2.156 2.418 0 1.333-.946 2.418-2.156 2.418z"/>
      </svg>
    ),
  },
  {
    name: "GitHub",
    href: GITHUB_ORG,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-4 w-4">
        <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2.05c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.27-1.69-1.27-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.7 1.25 3.36.96.1-.74.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.04 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.21-1.49 3.18-1.18 3.18-1.18.63 1.58.23 2.75.11 3.04.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.41-5.27 5.69.41.35.78 1.05.78 2.11v3.13c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z"/>
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
      if (ta.parentNode) ta.parentNode.removeChild(ta);
    }
  };

  return (
    <footer className="relative mt-20 border-t border-cyan-hp/10 bg-midnight overflow-hidden cv-footer">
      {/* hand-drawn divider that opens the footer like a chapter break */}
      <div className="absolute inset-x-0 -top-3 flex justify-center pointer-events-none">
        <RoughDivider width={520} height={32} color="#66FCF1" ornament="✦" seed={101} />
      </div>
      <div className="absolute inset-0 hp-stars opacity-20 pointer-events-none" />

      {/* margin scribbles in the footer corners */}
      <RoughStar
        size={22} color="#D4AF37" seed={103}
        className="absolute top-12 left-6 sm:left-12 opacity-60 hp-float pointer-events-none"
        style={{ animationDuration: "13s" }}
      />
      <RoughStar
        size={18} color="#A78BFA" fill seed={107}
        className="absolute bottom-16 right-8 sm:right-14 opacity-50 hp-float pointer-events-none"
        style={{ animationDuration: "15s", animationDelay: "1s" }}
      />

      {/* a piece of tape stuck to the top-right of the footer */}
      <span aria-hidden="true" className="pointer-events-none absolute -top-2 right-10 opacity-80">
        <span className="relative block h-5 w-20">
          <RoughTape color="#D4AF37" width={84} height={18} rotation={-22} inset={0} seed={109} />
        </span>
      </span>

      {/* Brand row */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="relative mx-auto max-w-7xl px-6 pt-14 pb-6 flex flex-col items-center text-center gap-3"
      >
        <div className="flex items-center gap-3">
          <span className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-md border border-cyan-hp/40 bg-slate-hp/60">
            <img
              src="/logos/main_logo.png"
              alt="HexaFalls"
              className="h-full w-full object-contain p-1"
              draggable={false}
            />
          </span>
          <span className="font-display tracking-[0.4em] text-silver-hp/85">
            HEXAFALLS 2
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

        {/* MIDDLE — sitemap (icon row) */}
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
          <ul className="flex flex-wrap items-center justify-center gap-2.5" aria-label="Sitemap">
            {SITEMAP.map((s) => (
              <li key={s.href} className="relative group">
                <Link
                  href={s.href}
                  aria-label={s.label}
                  className={`relative inline-flex h-9 w-9 items-center justify-center rounded-full border transition ${
                    s.soon
                      ? "border-gold-hp/35 bg-gold-hp/10 text-gold-hp/85 hover:border-gold-hp/70 hover:bg-gold-hp/15 hover:shadow-[0_0_18px_rgba(212,175,55,0.3)]"
                      : "border-cyan-hp/40 bg-cyan-hp/10 text-cyan-hp hover:border-cyan-hp/70 hover:bg-cyan-hp/15 hover:shadow-[0_0_18px_rgba(102,252,241,0.3)]"
                  }`}
                >
                  {s.icon}
                </Link>

                {/* tooltip */}
                <div
                  role="tooltip"
                  className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-full mb-2 origin-bottom scale-95 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100 transition-all duration-200 ease-out z-10"
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
                      className={`absolute -bottom-1 left-1/2 -translate-x-1/2 h-2 w-2 rotate-45 border-r border-b bg-midnight/95 ${
                        s.soon ? "border-gold-hp/50" : "border-cyan-hp/50"
                      }`}
                    />
                  </div>
                </div>
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
        <div className="mx-auto max-w-7xl px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] uppercase tracking-[0.3em] text-silver-hp/40 font-display">
          <span>© {new Date().getFullYear()} Hexafalls</span>

          {/* Backlink to the socials hub */}
          <a
            href="https://socials.hexafalls.org"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-cyan-hp/30 bg-cyan-hp/5 px-4 py-1.5 text-cyan-hp/85 hover:border-cyan-hp/60 hover:bg-cyan-hp/10 hover:text-cyan-hp hover:shadow-[0_0_18px_rgba(102,252,241,0.25)] transition"
            aria-label="All HexaFalls links — socials.hexafalls.org"
            title="socials.hexafalls.org"
          >
            all our links
            <span className="normal-case tracking-normal text-silver-hp/55">socials.hexafalls.org</span>
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
