"use client";

import { motion } from "framer-motion";
import RoughFrame from "./RoughFrame";
import RoughDivider from "./RoughDivider";
import RoughTape from "./RoughTape";

const GOLD = [
  {
    name: "Devfolio",
    href: "https://devfolio.co",
    logo: "/sponsors/Devfolio_Logo-White.png",
    logoAlt: "DEVFOLIO LOGO",
  },
];

export default function LandingSponsors() {
  return (
    <section className="relative isolate overflow-hidden px-6 py-24">
      {/* Eyebrow */}
      <div className="mx-auto mb-6 flex max-w-3xl items-center justify-center gap-3 text-[11px] uppercase tracking-[0.5em] text-cyan-hp/70 font-display text-center">
        <RoughDivider width={48} height={20} color="#66FCF1" seed={3} />
        Patrons of the craft
        <RoughDivider width={48} height={20} color="#66FCF1" seed={5} />
      </div>

      {/* Headline */}
      <h2 className="font-display font-black tracking-tight text-silver-hp leading-[0.95] text-center text-[10vw] sm:text-[6vw] md:text-[4vw] hp-glow">
        <span className="block">Our</span>
        <span className="block text-gold-hp hp-glow-gold mt-2">
          Patrons
        </span>
      </h2>

      {/* Gold tier */}
      <div className="mt-12 mx-auto max-w-3xl">
        <div className="flex items-center justify-center gap-4 mb-8">
          <RoughDivider width={120} height={22} color="#D4AF37" seed={11} />
          <span className="font-display text-[11px] uppercase tracking-[0.5em] text-gold-hp hp-glow-gold">
            Gold
          </span>
          <RoughDivider width={120} height={22} color="#D4AF37" seed={13} />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 justify-items-center">
          {GOLD.map((s, i) => (
            <motion.a
              key={s.name}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.9, delay: 0.1 + i * 0.1 }}
              className="group block w-full max-w-55"
            >
              <RoughFrame
                seed={37 + i * 4}
                stroke="#D4AF37"
                mist={false}
                strokeWidth={1.4}
                roughness={1.6}
                bowing={1.2}
                padding={12}
                className="w-full bg-midnight transition-transform duration-500 group-hover:-translate-y-1"
              >
                {/* Brand mark on a solid single-colour background, no mask,
                    no overlay — per Devfolio brand guidelines. Plain <img>
                    (not next/image) so the verifier sees the original asset
                    path with the required alt tag verbatim. */}
                <div className="relative w-full aspect-video overflow-hidden bg-midnight flex items-center justify-center">
                  <img
                    src={s.logo}
                    alt={s.logoAlt || s.name}
                    width="200"
                    height="112"
                    loading="eager"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-contain p-4 transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                  <RoughTape color="#D4AF37" seed={61 + i} width={56} height={14} />
                </div>
              </RoughFrame>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
