"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useMotionValue, useAnimationFrame } from "framer-motion";
import gsap from "gsap";
import Sparkles from "./Sparkles";
import FloatingArtifacts from "./FloatingArtifacts";
import RoughFrame from "./RoughFrame";
import RoughButton from "./RoughButton";
import RoughDivider from "./RoughDivider";
import RoughCorners from "./RoughCorners";
import { EVENTS } from "@/lib/routes";

export default function Events() {
  const sectionRef = useRef(null);
  const rotation = useMotionValue(0);
  const isDragging = useRef(false);

  useAnimationFrame((time, delta) => {
    if (!isDragging.current) {
      // Auto spin slowly when not being dragged
      rotation.set(rotation.get() - 0.2 * (delta / 16));
    }
  });

  const handlePan = (e, info) => {
    isDragging.current = true;
    // Map the horizontal drag movement to rotation degrees
    rotation.set(rotation.get() + info.delta.x * 0.5);
  };

  const handlePanEnd = () => {
    isDragging.current = false;
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      if (reduce) {
        gsap.set(".ev-letter", { opacity: 1, y: 0 });
        return;
      }
      gsap.set(".ev-letter", { opacity: 0, y: 24 });
      gsap.to(".ev-letter", {
        opacity: 1, y: 0,
        duration: 0.4,
        ease: "power3.out",
        stagger: { each: 0.045, from: "start" },
        delay: 0.15,
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const splitLetters = (text) => {
    // Split on whitespace runs but keep the spaces as their own
    // tokens so we can preserve word spacing.
    const parts = text.split(/(\s+)/);
    return parts.map((part, wi) => {
      if (/^\s+$/.test(part)) {
        return (
          <span key={`w${wi}`} style={{ whiteSpace: "pre" }}>
            {part}
          </span>
        );
      }
      // Each word is an atomic inline-block (nowrap), so the
      // browser will only ever line-break BETWEEN words.
      return (
        <span
          key={`w${wi}`}
          className="inline-block"
          style={{ whiteSpace: "nowrap" }}
        >
          {[...part].map((ch, ci) => (
            <span
              key={`${wi}-${ci}`}
              className="ev-letter inline-block"
            >
              {ch}
            </span>
          ))}
        </span>
      );
    });
  };

  return (
    <section
      ref={sectionRef}
      className="relative isolate overflow-hidden min-h-screen pt-32 pb-24 px-6"
    >
      <div aria-hidden="true" className="absolute inset-0 -z-30 hp-stars pointer-events-none" />
      <div aria-hidden="true" className="absolute inset-0 -z-20 hp-scrim pointer-events-none" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 pointer-events-none hidden md:block">
        <Sparkles count={24} />
      </div>
      <div className="hidden md:block">
        <FloatingArtifacts stars={14} runes={12} seed={8} />
      </div>

      <div className="text-center">
        <h1
          aria-label="The Events"
          className="font-display font-black tracking-tight text-silver-hp leading-[1.05] text-balance text-[14vw] sm:text-[10vw] md:text-[8vw] hp-glow"
          style={{ perspective: 800 }}
        >
          {splitLetters("The")}<span style={{whiteSpace: "pre"}}> </span><span className="text-gold-hp hp-glow-gold text-[14vw] sm:text-[9vw] md:text-[7vw]">{splitLetters("Events")}</span>
        </h1>
      </div>

      {/* coming-soon ribbon */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="mt-10 flex items-center justify-center gap-3 font-display text-[10px] uppercase tracking-[0.5em] text-gold-hp/80"
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full rounded-full bg-gold-hp opacity-60 animate-ping" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-gold-hp" />
        </span>
        Full briefs unfurling soon
      </motion.div>

      {/* Event cards — 3D Carousel */}
      <style>{`
        .carousel-track {
          transform-style: preserve-3d;
          will-change: transform;
        }
        .carousel-container {
          perspective: 1200px;
        }
        .carousel-item {
          transform: rotateY(var(--angle)) translateZ(160px);
          will-change: transform;
        }
        @media (min-width: 640px) {
          .carousel-item { transform: rotateY(var(--angle)) translateZ(280px); }
        }
        @media (min-width: 1024px) {
          .carousel-item { transform: rotateY(var(--angle)) translateZ(400px); }
        }
        @keyframes pulse-glow-opacity {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 1; }
        }
        .btn-pulse {
          position: relative;
        }
        .btn-pulse::after {
          content: '';
          position: absolute;
          inset: -1px;
          border-radius: inherit;
          box-shadow: 0 0 15px var(--btn-glow), inset 0 0 8px var(--btn-glow);
          animation: pulse-glow-opacity 2.5s infinite ease-in-out;
          pointer-events: none;
          will-change: opacity;
        }
      `}</style>

      <div className="carousel-container mx-auto mt-12 mb-24 h-[340px] w-[230px] sm:h-[450px] sm:w-[320px] md:h-[500px] md:w-[380px] relative">
        <motion.div 
          className="carousel-track absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing touch-none"
          style={{ rotateY: rotation }}
          onPan={handlePan}
          onPanEnd={handlePanEnd}
          onPointerDown={() => isDragging.current = true}
          onPointerUp={() => isDragging.current = false}
        >
          {EVENTS.map((e, i) => {
            const angle = i * 90;
            return (
              <div
                key={e.slug}
                className="carousel-item absolute inset-0 group flex flex-col justify-end"
                style={{ "--angle": `${angle}deg` }}
              >
                {/* The cinematic image rendered as a floating, borderless hologram */}
                <div 
                  className="absolute inset-0 transition-transform duration-[12s] ease-out group-hover:scale-110"
                  style={{
                    background: `url('${e.image}') center/cover no-repeat`,
                    mixBlendMode: "screen",
                    WebkitMaskImage: "radial-gradient(ellipse at center, black 40%, transparent 75%)",
                    maskImage: "radial-gradient(ellipse at center, black 40%, transparent 75%)",
                  }}
                />
                {/* soft radial shadow behind text to maintain legibility without hard edges */}
                <div 
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-3/4 opacity-90 transition-opacity duration-500 group-hover:opacity-100" 
                  style={{
                    background: "radial-gradient(ellipse at bottom, rgba(11,12,16,0.95) 0%, rgba(11,12,16,0.7) 40%, transparent 80%)"
                  }}
                />
                
                <div className="absolute inset-0 hp-stars opacity-40 mix-blend-screen pointer-events-none hidden md:block" />

                <div className="relative z-10 p-6 flex flex-col gap-2 transition-transform duration-500 group-hover:-translate-y-2">
                  <div className="flex items-center justify-between">
                    <span
                      className="font-wizard text-3xl"
                      style={{ color: e.color, textShadow: `0 0 14px ${e.glow}` }}
                      aria-hidden="true"
                    >
                      {e.rune}
                    </span>
                    <span
                      className="rounded-full border px-2 py-0.5 font-display text-[8px] uppercase tracking-[0.3em] md:backdrop-blur-md"
                      style={{
                        borderColor: `${e.color}55`,
                        color: `${e.color}ee`,
                        backgroundColor: `${e.color}33`,
                      }}
                    >
                      soon
                    </span>
                  </div>
                  <h2
                    className="font-display tracking-tight text-2xl leading-tight"
                    style={{ color: e.color, textShadow: `0 0 18px ${e.glow}` }}
                  >
                    {e.name}
                  </h2>
                  <p className="font-wizard text-silver-hp/90 text-sm leading-relaxed text-balance">
                    {e.blurb}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2 pt-2">
                    <Link
                      href={`/events/${e.slug}`}
                      className="group/btn btn-pulse inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 font-display text-[10px] uppercase tracking-[0.3em] transition md:backdrop-blur-md hover:bg-white/20"
                      style={{
                        "--btn-glow": e.glow,
                        borderColor: `${e.color}90`,
                        color: e.color,
                        backgroundColor: `${e.color}22`,
                      }}
                    >
                      Details
                      <span className="group-hover/btn:translate-x-0.5 transition">→</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* Back */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="mt-16 flex justify-center"
      >
        <RoughButton
          as={Link}
          href="/"
          color="#C5C6C7"
          fill={false}
          seed={67}
          className="px-8 py-3 text-[11px]"
        >
          ← BACK TO THE HALL
        </RoughButton>
      </motion.div>
    </section>
  );
}
