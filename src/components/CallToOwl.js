"use client";

import { motion } from "framer-motion";

export default function CallToOwl() {
  return (
    <section
      id="register"
      className="relative overflow-hidden px-6 py-32 text-center"
    >
      <div className="absolute inset-0 hp-stars opacity-40 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9 }}
        className="mx-auto max-w-3xl"
      >
        <p className="font-[family-name:var(--font-wizard)] uppercase tracking-[0.4em] text-cyan-hp/70 text-xs">
          By order of the Headmaster
        </p>
        <h2 className="mt-6 font-[family-name:var(--font-display)] text-4xl sm:text-6xl text-silver-hp hp-glow">
          Send the Owl.
        </h2>
        <p className="mt-6 text-silver-hp/75 text-lg">
          Registrations open soon. Drop your name, and we'll dispatch the
          parchment the moment the gates of Hexafalls swing wide.
        </p>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="mt-10 flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
        >
          <input
            type="email"
            required
            placeholder="your.owl@hogwarts.edu"
            className="flex-1 rounded-full border border-cyan-hp/30 bg-slate-hp/60 px-6 py-3 text-silver-hp placeholder:text-silver-hp/40 outline-none focus:border-cyan-hp/80 focus:shadow-[0_0_24px_rgba(102,252,241,0.35)] transition"
          />
          <button
            type="submit"
            className="rounded-full border border-gold-hp/60 bg-gold-hp/10 px-6 py-3 font-[family-name:var(--font-display)] tracking-widest text-gold-hp hover:bg-gold-hp/20 hover:shadow-[0_0_28px_rgba(212,175,55,0.4)] transition"
          >
            DISPATCH
          </button>
        </form>
      </motion.div>
    </section>
  );
}
