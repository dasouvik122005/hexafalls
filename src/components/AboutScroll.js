"use client";

import { motion } from "framer-motion";

const pillars = [
  {
    title: "The Brewing",
    body: "36 hours of code, caffeine, and questionable sleep schedules. Build something that would make Hermione raise an eyebrow.",
  },
  {
    title: "The Trials",
    body: "Tracks across AI, Web3, hardware and pure chaos. Pick a path. Or don't — and forge your own enchantment.",
  },
  {
    title: "The Spoils",
    body: "Galleons, internships, swag worthy of Diagon Alley, and the eternal glory of having shipped something that actually works.",
  },
];

export default function AboutScroll() {
  return (
    <section
      id="about"
      className="relative overflow-hidden px-6 py-32 bg-slate-hp/40 border-y border-cyan-hp/10"
    >
      <div className="absolute inset-0 hp-scrim opacity-50 pointer-events-none" />

      <div className="mx-auto max-w-6xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center font-display text-4xl sm:text-5xl tracking-wide text-cyan-hp hp-glow"
        >
          Unfurl the Parchment
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 1 }}
          className="mt-4 text-center font-wizard text-silver-hp/70 max-w-2xl mx-auto"
        >
          Three things every wizard should know before stepping into the Great Hall.
        </motion.p>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {pillars.map((p, i) => (
            <motion.article
              key={p.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: i * 0.15, duration: 0.7 }}
              className="group relative rounded-2xl border border-cyan-hp/15 bg-midnight/60 p-8 backdrop-blur transition hover:border-cyan-hp/40 hover:-translate-y-1"
            >
              <div className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition pointer-events-none"
                   style={{ boxShadow: "0 0 36px rgba(102,252,241,.20)" }} />
              <h3 className="font-display text-2xl text-gold-hp hp-glow-gold">
                {p.title}
              </h3>
              <p className="mt-4 text-silver-hp/80 leading-relaxed">{p.body}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
