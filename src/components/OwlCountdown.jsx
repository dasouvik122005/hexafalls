"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import RoughFrame from "./RoughFrame";
import RoughDivider from "./RoughDivider";
import Sparkles from "./Sparkles";
import RoughTape from "./RoughTape";

// Change this to the actual start time
const TARGET_DATE = new Date("2026-10-31T18:00:00Z").getTime();

export default function OwlCountdown() {
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });
  const [isZero, setIsZero] = useState(false);
  const [mounted, setMounted] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    const tick = () => {
      const now = new Date().getTime();
      const diff = TARGET_DATE - now;

      if (diff <= 0) {
        setTimeLeft({ d: 0, h: 0, m: 0, s: 0 });
        if (!isZero) setIsZero(true);
      } else {
        setTimeLeft({
          d: Math.floor(diff / (1000 * 60 * 60 * 24)),
          h: Math.floor((diff / (1000 * 60 * 60)) % 24),
          m: Math.floor((diff / 1000 / 60) % 60),
          s: Math.floor((diff / 1000) % 60),
        });
      }
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [isZero]);

  // Subtle breathing animation for the owl + dramatic zero reveal
  useEffect(() => {
    if (!sectionRef.current) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const ctx = gsap.context(() => {
      // Idle animation for the owl
      if (!isZero) {
        gsap.to(".owl-mascot", {
          y: -12,
          rotation: 1,
          duration: 3,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      } else {
        // Zero state: The owl flies up and away
        gsap.to(".owl-mascot", {
          y: -150,
          opacity: 0,
          scale: 1.2,
          duration: 2,
          ease: "power2.in",
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [isZero]);

  if (!mounted) return null;

  const pad = (num) => num.toString().padStart(2, "0");

  const units = [
    { label: "Days", value: pad(timeLeft.d) },
    { label: "Hours", value: pad(timeLeft.h) },
    { label: "Minutes", value: pad(timeLeft.m) },
    { label: "Seconds", value: pad(timeLeft.s) },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative isolate w-full max-w-5xl mx-auto py-24 px-6 flex flex-col items-center justify-center min-h-[600px]"
    >
      {/* ── Background Scrim to make the section pop ── */}
      <div className="absolute inset-0 pointer-events-none hp-scrim opacity-20 -z-10" />

      <AnimatePresence mode="wait">
        {!isZero ? (
          <motion.div
            key="countdown-state"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, filter: "blur(12px)" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex flex-col items-center w-full"
          >
            {/* ── The Mascot (Positioned to overlap the letter) ── */}
            <div className="relative z-20 -mb-16 sm:-mb-24 pointer-events-none owl-mascot">
              <div className="relative h-48 w-48 sm:h-72 sm:w-72">
                {/* Golden aura behind the owl */}
                <div
                  className="absolute inset-0 rounded-full opacity-30"
                  style={{
                    background: "radial-gradient(circle, #D4AF37 0%, transparent 60%)",
                    filter: "blur(30px)",
                  }}
                />
                <img
                  src="/mascot/mascot.webp"
                  alt="HexaFalls mascot carrying a letter"
                  className="relative h-full w-full object-contain"
                  style={{
                    filter: "drop-shadow(0 12px 24px rgba(0,0,0,0.8)) drop-shadow(0 0 20px rgba(212,175,55,0.2))",
                  }}
                  draggable={false}
                />
              </div>
            </div>

            {/* ── The "Letter" (Main Container) ── */}
            <div className="relative z-10 w-full max-w-3xl">
              <RoughFrame
                seed={101}
                stroke="#D4AF37"
                strokeWidth={1.5}
                roughness={1.2}
                padding={0}
                className="bg-[#0B0C10]/80 backdrop-blur-md"
                mist
                mistColor="#D4AF37"
              >
                {/* Washi tape at corners for scrapbook feel */}
                <div className="absolute top-0 left-0 -translate-x-2 -translate-y-2 opacity-80 z-20">
                  <RoughTape color="#D4AF37" width={60} height={18} rotation={-45} />
                </div>
                <div className="absolute top-0 right-0 translate-x-2 -translate-y-2 opacity-80 z-20">
                  <RoughTape color="#D4AF37" width={60} height={18} rotation={45} />
                </div>

                <div className="px-6 pb-10 pt-20 sm:pt-28 flex flex-col items-center relative overflow-hidden">
                  {/* Faint sparkles drifting inside the letter */}
                  <div className="absolute inset-0 opacity-30 pointer-events-none">
                    <Sparkles count={8} />
                  </div>

                  {/* Header */}
                  <div className="flex items-center gap-4 text-[10px] sm:text-[11px] uppercase tracking-[0.4em] text-silver-hp/60 font-display mb-8">
                    <RoughDivider width={40} height={10} color="#C5C6C7" />
                    Owl Post Expected
                    <RoughDivider width={40} height={10} color="#C5C6C7" />
                  </div>

                  {/* The Numbers Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 w-full px-2 sm:px-8 relative z-10">
                    {units.map((u, i) => (
                      <div key={u.label} className="relative group">
                        <RoughFrame
                          seed={200 + i}
                          stroke="#66FCF1"
                          strokeWidth={1}
                          roughness={2}
                          padding={12}
                          className="bg-slate-hp/50 border-t border-white/5 transition-transform duration-300 group-hover:-translate-y-1"
                        >
                          <div className="flex flex-col items-center justify-center py-3">
                            <span
                              className="font-display font-black tracking-widest text-gold-hp hp-glow-gold transition-colors duration-300"
                              style={{
                                fontSize: "clamp(2.5rem, 5vw, 4rem)",
                                lineHeight: "1",
                                textShadow: "0 0 24px rgba(212,175,55,0.6), 0 0 40px rgba(212,175,55,0.2)",
                              }}
                            >
                              {u.value}
                            </span>
                            <span className="font-wizard text-[9px] sm:text-[11px] uppercase tracking-[0.3em] text-cyan-hp/70 mt-4">
                              {u.label}
                            </span>
                          </div>
                        </RoughFrame>
                      </div>
                    ))}
                  </div>
                </div>
              </RoughFrame>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="gates-open-state"
            initial={{ opacity: 0, scale: 0.8, filter: "blur(20px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="relative z-10 flex flex-col items-center justify-center w-full"
          >
            {/* Massive golden glow behind the text */}
            <div
              className="absolute inset-0 pointer-events-none rounded-full opacity-60"
              style={{
                background: "radial-gradient(ellipse at center, rgba(212,175,55,0.2) 0%, transparent 60%)",
                filter: "blur(60px)",
              }}
            />
            
            <RoughDivider width={200} height={20} color="#D4AF37" ornament="✦" className="mb-6" />
            
            <h3
              className="font-display font-black uppercase text-center text-gold-hp"
              style={{
                fontSize: "clamp(3rem, 8vw, 6rem)",
                lineHeight: "1.1",
                letterSpacing: "0.15em",
                textShadow: "0 0 30px rgba(212,175,55,0.8), 0 0 60px rgba(212,175,55,0.4), 0 4px 12px rgba(0,0,0,0.8)",
              }}
            >
              The Gates<br />Are Open
            </h3>
            
            <p className="mt-8 font-wizard text-silver-hp text-lg sm:text-xl tracking-wider opacity-80 text-center">
              The magic has begun. Step into the hall.
            </p>
            
            <RoughDivider width={200} height={20} color="#D4AF37" ornament="✦" className="mt-6" />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
