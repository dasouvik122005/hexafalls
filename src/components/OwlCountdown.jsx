"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import RoughFrame from "./RoughFrame";
import Sparkles from "./Sparkles";

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

  useEffect(() => {
    if (!sectionRef.current) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const ctx = gsap.context(() => {
      if (!isZero) {
        gsap.to(".owl-mascot", {
          y: -6,
          duration: 2.5,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      } else {
        gsap.to(".owl-mascot", {
          y: -40,
          opacity: 0,
          scale: 1.1,
          duration: 1.5,
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
    <div
      ref={sectionRef}
      className="relative z-10 w-full flex flex-col items-center mt-12 mb-8"
    >
      {/* Small heading */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-[10px] uppercase tracking-[0.4em] text-silver-hp/60 font-display mb-2"
      >
        Owl Post Expected
      </motion.div>

      <AnimatePresence mode="wait">
        {!isZero ? (
          <motion.div
            key="countdown-compact"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center"
          >
            {/* Mascot owl sitting right on the cards */}
            <div className="relative z-20 -mb-6 owl-mascot pointer-events-none">
              <img
                src="/mascot/mascot.webp"
                alt="Owl mascot"
                className="h-20 w-20 object-contain drop-shadow-xl"
                style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.6))" }}
                draggable={false}
              />
            </div>

            {/* The 4 RoughFrame Cards in a tight row */}
            <div className="relative z-10 flex flex-wrap justify-center gap-3 sm:gap-4 px-4">
              {units.map((u, i) => (
                <RoughFrame
                  key={u.label}
                  seed={300 + i}
                  stroke="#D4AF37"
                  strokeWidth={1.2}
                  roughness={1.5}
                  padding={8}
                  className="bg-[#0B0C10]/90 backdrop-blur-sm w-20 sm:w-24 relative overflow-hidden"
                >
                  <div className="absolute inset-0 opacity-30 pointer-events-none">
                    <Sparkles count={3} />
                  </div>
                  
                  <div className="flex flex-col items-center justify-center py-2">
                    <span
                      className="font-display font-black tracking-wider text-gold-hp hp-glow-gold"
                      style={{
                        fontSize: "1.75rem",
                        lineHeight: "1",
                        textShadow: "0 0 12px rgba(212,175,55,0.6)",
                      }}
                    >
                      {u.value}
                    </span>
                    <span className="font-wizard text-[9px] uppercase tracking-[0.2em] text-silver-hp/70 mt-1.5">
                      {u.label}
                    </span>
                  </div>
                </RoughFrame>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="gates-open-compact"
            initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center mt-4"
          >
            <RoughFrame
              seed={99}
              stroke="#66FCF1"
              strokeWidth={1.5}
              padding={16}
              className="bg-cyan-hp/10 backdrop-blur-sm"
              mist
              mistColor="#66FCF1"
            >
              <div className="text-center px-6 py-2">
                <h3
                  className="font-display font-black uppercase tracking-[0.2em] text-cyan-hp"
                  style={{
                    fontSize: "1.5rem",
                    textShadow: "0 0 16px rgba(102,252,241,0.6)",
                  }}
                >
                  The Gates Are Open
                </h3>
                <p className="mt-2 font-wizard text-silver-hp/80 text-xs tracking-wider">
                  The magic has begun. Step into the hall.
                </p>
              </div>
            </RoughFrame>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
