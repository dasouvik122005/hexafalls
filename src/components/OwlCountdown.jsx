"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import RoughFrame from "./RoughFrame";
import RoughDivider from "./RoughDivider";
import RoughStar from "./RoughStar";
import Sparkles from "./Sparkles";

// Target date: change this to the actual start time of the event.
// For now, setting it to a date in the future.
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

  // When reaching zero, do a GSAP reveal
  useEffect(() => {
    if (isZero && sectionRef.current) {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!reduce) {
        const ctx = gsap.context(() => {
          gsap.fromTo(
            ".gates-open-text",
            { opacity: 0, scale: 0.8, y: 20 },
            { opacity: 1, scale: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.2 }
          );
          gsap.to(".owl-image", {
            y: -20,
            scale: 1.05,
            duration: 2,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
          });
        }, sectionRef);
        return () => ctx.revert();
      }
    }
  }, [isZero]);

  if (!mounted) return null; // Avoid hydration mismatch on initial render

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
      className="relative isolate w-full max-w-4xl mx-auto py-24 px-6 flex flex-col items-center justify-center"
    >
      {/* ── Heading ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5 }}
        className="mb-10 text-center"
      >
        <div className="flex items-center justify-center gap-3 text-[11px] uppercase tracking-[0.5em] text-gold-hp/70 font-display mb-3">
          <RoughDivider width={48} height={20} color="#D4AF37" seed={3} />
          Owl Post Expected
          <RoughDivider width={48} height={20} color="#D4AF37" seed={5} />
        </div>
        <h2
          className="font-display font-black tracking-widest text-silver-hp hp-glow-gold uppercase"
          style={{ fontSize: "clamp(1.5rem, 4vw, 2.5rem)" }}
        >
          {isZero ? "The Owls Have Arrived" : "Awaiting the Owls"}
        </h2>
      </motion.div>

      {/* ── Owl Asset ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-20 mb-8"
      >
        <div
          className="owl-image relative hp-float h-48 w-48 sm:h-64 sm:w-64"
          style={{ animationDuration: "6s" }}
        >
          <img
            src="/mascot/mascot.webp"
            alt="HexaFalls mascot owl"
            className="relative h-full w-full object-contain drop-shadow-2xl select-none"
            style={{
              filter:
                "drop-shadow(0 0 24px rgba(212,175,55,0.3)) drop-shadow(0 8px 32px rgba(0,0,0,0.6))",
            }}
            draggable={false}
          />
        </div>
      </motion.div>

      {/* ── Countdown / Deliver ── */}
      <AnimatePresence mode="wait">
        {!isZero ? (
          <motion.div
            key="countdown"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
            transition={{ duration: 0.5 }}
            className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 w-full max-w-3xl"
          >
            {units.map((u, i) => (
              <RoughFrame
                key={u.label}
                seed={120 + i}
                stroke="#D4AF37"
                strokeWidth={1.4}
                roughness={1.5}
                padding={16}
                className="bg-midnight/60 backdrop-blur-md relative overflow-hidden"
              >
                {/* Drifting faint sparkles inside the card */}
                <div className="absolute inset-0 opacity-40 pointer-events-none">
                  <Sparkles count={4} />
                </div>
                
                <div className="flex flex-col items-center justify-center py-2 relative z-10">
                  <span
                    className="font-display font-black tracking-wider text-gold-hp hp-glow-gold"
                    style={{
                      fontSize: "clamp(2rem, 6vw, 3.5rem)",
                      lineHeight: "1",
                    }}
                  >
                    {u.value}
                  </span>
                  <span className="font-wizard text-[10px] sm:text-xs uppercase tracking-[0.25em] text-silver-hp/60 mt-3">
                    {u.label}
                  </span>
                </div>
              </RoughFrame>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="gates-open"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="gates-open-text relative z-10 flex flex-col items-center gap-6"
          >
            <RoughFrame
              seed={99}
              stroke="#66FCF1"
              strokeWidth={1.5}
              roughness={2}
              padding={32}
              className="bg-cyan-hp/5 backdrop-blur-sm"
              mist
              mistColor="#66FCF1"
            >
              <div className="text-center px-4 py-2">
                <h3
                  className="font-display font-black uppercase tracking-[0.3em] text-cyan-hp"
                  style={{
                    fontSize: "clamp(1.8rem, 5vw, 3rem)",
                    textShadow:
                      "0 0 20px rgba(102,252,241,0.6), 0 0 40px rgba(102,252,241,0.3)",
                  }}
                >
                  The Gates Are Open
                </h3>
                <p className="mt-4 font-wizard text-silver-hp/80 text-sm sm:text-base">
                  The magic has begun. Step into the hall.
                </p>
              </div>
            </RoughFrame>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
