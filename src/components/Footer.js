"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const EMAIL    = "teams.hexafalls@gmail.com";
const GDG_LINK = "https://gdg.community.dev/gdg-on-campus-jis-university-kolkata-india/";

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

      <div className="relative mx-auto max-w-7xl px-6 py-14 grid gap-10 md:grid-cols-3 items-start">
        {/* Brand */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex flex-col gap-3"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-md border border-cyan-hp/40 bg-slate-hp/60">
              <span className="font-display text-cyan-hp text-lg font-bold">H</span>
            </span>
            <span className="font-display tracking-[0.4em] text-silver-hp/85">
              HEXAFALLS
            </span>
          </div>
          <p className="font-wizard text-sm text-silver-hp/60 max-w-xs leading-relaxed">
            A wizarding hackathon, conjured by GDG on Campus · JIS University.
            More scrolls of prophecy unfurling soon.
          </p>
        </motion.div>

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="flex flex-col gap-3"
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

        {/* Links */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
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
          <span className="text-silver-hp/30">cast with care · no muggles harmed</span>
        </div>
      </div>
    </footer>
  );
}
