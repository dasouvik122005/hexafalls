"use client";

import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import RoughFrame from "@/components/RoughFrame";
import RoughDivider from "@/components/RoughDivider";
import RoughStar from "@/components/RoughStar";
import RoughTape from "@/components/RoughTape";
import RoughButton from "@/components/RoughButton";
import Sparkles from "@/components/Sparkles";
import { TIMELINE } from "@/lib/timelineData";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";

const SnitchNode = ({ isImportant }) => {
  const color = isImportant ? "#D4AF37" : "#66FCF1";
  const dropShadow = isImportant ? "drop-shadow(0 0 6px #D4AF37)" : "";
  return (
    <div className="relative flex justify-center items-center w-8 h-6 shrink-0 z-20">
      {/* Left Wing */}
      <motion.svg
        className="absolute right-1/2 top-0 w-5 h-4 origin-bottom-right"
        animate={{ rotateZ: [-15, 15, -15] }}
        transition={{ duration: 0.15, repeat: Infinity, ease: "easeInOut" }}
        viewBox="0 0 24 24"
        style={{ filter: dropShadow }}
      >
        <path d="M24 24C12 24 2 12 0 0C10 6 18 14 24 24Z" fill={color} fillOpacity="0.4" stroke={color} strokeWidth="0.5" />
        <path d="M24 24C14 20 6 10 2 2" stroke={color} strokeWidth="0.5" fill="none" />
      </motion.svg>
      {/* Right Wing */}
      <motion.svg
        className="absolute left-1/2 top-0 w-5 h-4 origin-bottom-left"
        animate={{ rotateZ: [15, -15, 15] }}
        transition={{ duration: 0.15, repeat: Infinity, ease: "easeInOut" }}
        viewBox="0 0 24 24"
        style={{ filter: dropShadow }}
      >
        <path d="M0 24C12 24 22 12 24 0C14 6 6 14 0 24Z" fill={color} fillOpacity="0.4" stroke={color} strokeWidth="0.5" />
        <path d="M0 24C10 20 18 10 22 2" stroke={color} strokeWidth="0.5" fill="none" />
      </motion.svg>
      {/* Snitch Body */}
      <div 
        className="w-3.5 h-3.5 rounded-full z-10 relative" 
        style={{ 
          background: `radial-gradient(circle at 35% 35%, #fff, ${color})`,
          boxShadow: isImportant ? `0 0 10px ${color}, 0 0 20px ${color}` : `0 0 8px ${color}`
        }} 
      />
    </div>
  );
};

const WandLine = ({ isImportant }) => {
  const color = isImportant ? "#D4AF37" : "#66FCF1";
  return (
    <div className="w-2 grow mt-1 -mb-10 relative z-0 flex flex-col">
      <svg className="w-full h-full min-h-[40px]" preserveAspectRatio="none" viewBox="0 0 10 100">
        <defs>
          <linearGradient id={`wandGrad-${isImportant}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.8" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d="M 3 0 C 8 0 8 15 5 20 L 5 100 L 4 100 L 4 20 C 1 15 1 0 3 0 Z" fill={`url(#wandGrad-${isImportant})`} />
        <path d="M 3 3 Q 5 5 7 3 M 3 8 Q 5 10 7 8 M 4 13 L 6 13" stroke="#0B0C10" strokeWidth="0.5" fill="none" opacity="0.6" />
      </svg>
    </div>
  );
};

function EventCard({ event, index }) {
  const isImportant = event.important;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: (index % 5) * 0.1 }}
      className="relative flex items-start gap-2 sm:gap-4 mb-6 sm:mb-8 group"
    >
      {/* Timeline Node */}
      <div className="relative z-10 flex flex-col items-center shrink-0 mt-2 w-8 self-stretch">
        <SnitchNode isImportant={isImportant} />
        <WandLine isImportant={isImportant} />
      </div>

      {/* Content */}
      <RoughFrame
        seed={42 + index}
        stroke={isImportant ? "#D4AF37" : "rgba(31, 40, 51, 0.7)"}
        mistColor={isImportant ? "#D4AF37" : undefined}
        padding={16}
        className={`flex-1 min-w-0 bg-slate-hp/30 backdrop-blur-sm group-hover:bg-slate-hp/40 group-hover:scale-[1.01] group-hover:shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-all duration-300 ease-out ${isImportant ? 'relative overflow-hidden' : ''}`}
      >
        {isImportant && (
          <>
            <RoughTape color="#D4AF37" width={60} className="absolute -top-1 -right-2 opacity-80" rotation={35} />
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold-hp/5 rounded-full blur-[40px] pointer-events-none hp-pulse" />
          </>
        )}
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 mb-2">
            <span className={`font-display text-[10px] tracking-[0.2em] uppercase ${isImportant ? "text-gold-hp" : "text-cyan-hp/70"}`}>
              {event.time}
            </span>
            <span className="font-wizard text-xs text-silver-hp/40 italic">
              {event.category}
            </span>
          </div>
          <h3 className={`font-display text-base sm:text-lg tracking-wide ${isImportant ? "text-gold-hp hp-glow-gold" : "text-silver-hp/90"}`}>
            {event.title}
          </h3>
          {event.description && (
            <p className="mt-2 text-sm text-silver-hp/70 font-body leading-relaxed">
              {event.description}
            </p>
          )}
          {event.subEvents && event.subEvents.length > 0 && (
            <ul className="mt-3 space-y-1">
              {event.subEvents.map((sub, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-silver-hp/60 font-body">
                  <span className="text-cyan-hp/50 mt-0.5">✦</span>
                  {sub}
                </li>
              ))}
            </ul>
          )}
        </div>
      </RoughFrame>
    </motion.div>
  );
}

export default function TimelinePage() {
  const containerRef = useRef(null);

  useEffect(() => {
    // GSAP letter-stagger for the title, using the standard HexaFalls animation logic.
    let ctx = gsap.context(() => {
      // Check for user preference regarding motion.
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReducedMotion) {
        gsap.set([".tl-letter"], { opacity: 1, y: 0 });
        return;
      }

      gsap.set(".tl-letter", { opacity: 0, y: 24 });
      gsap.to(".tl-letter", {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.04,
        ease: "power3.out",
        delay: 0.1,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const dayTitleVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.2 },
    },
  };

  const dayLetterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
  };

  return (
    <main ref={containerRef} className="relative isolate min-h-screen bg-midnight overflow-x-hidden">
      <TopBar />
      
      <div aria-hidden="true" className="fixed inset-0 -z-30 hp-stars pointer-events-none opacity-40" />
      <div aria-hidden="true" className="fixed inset-0 -z-20 hp-scrim pointer-events-none opacity-70" />
      <div aria-hidden="true" className="fixed inset-0 -z-10 pointer-events-none opacity-60">
        <Sparkles count={25} />
      </div>
      
      <div className="pt-24 sm:pt-32 pb-16 sm:pb-24 px-4 sm:px-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12 sm:mb-20 text-center relative">
          <div className="absolute inset-0 -z-10 pointer-events-none">
            <Sparkles count={15} />
            <RoughStar size={24} color="#66FCF1" seed={11} className="absolute -top-10 left-[10%] opacity-60 hp-float" style={{ animationDuration: "7s" }} />
            <RoughStar size={16} color="#D4AF37" seed={22} className="absolute top-20 right-[15%] opacity-40 hp-pulse" />
          </div>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mb-6"
          >
            <RoughDivider width={64} height={20} color="#66FCF1" seed={99} />
          </motion.div>
          
          <h1 className="font-display text-3xl sm:text-5xl md:text-6xl tracking-widest text-silver-hp hp-glow mb-4 sm:mb-6" aria-label="THE TIMELINE">
            {Array.from("THE TIMELINE").map((char, idx) => (
              <span key={idx} className="tl-letter inline-block">
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </h1>
          
          <p className="font-wizard text-silver-hp/70 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed px-2">
            Hours, milestones and rituals: every chapter of the 58-hour gathering. The path is foretold.
          </p>
        </div>

        {/* Timeline Layout */}
        <div className="space-y-14 sm:space-y-24">
          {TIMELINE.map((dayData, dayIndex) => (
            <div key={dayData.day} className="relative">
              {/* Day Header */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="mb-8 sm:mb-12 relative"
              >
                {dayIndex % 2 === 0 ? (
                  <RoughStar size={18} color="#66FCF1" seed={dayIndex} className="absolute -top-4 -left-6 opacity-30 hp-float" />
                ) : (
                  <RoughStar size={14} color="#D4AF37" seed={dayIndex} className="absolute bottom-0 right-[20%] opacity-40 hp-pulse" />
                )}
                <div className="flex flex-col sm:flex-row sm:items-end gap-1 sm:gap-4 mb-3">
                  <motion.h2 
                    variants={dayTitleVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    className="font-display text-2xl sm:text-3xl md:text-4xl text-cyan-hp hp-glow tracking-widest" 
                    aria-label={dayData.day}
                  >
                    {Array.from(dayData.day).map((char, idx) => (
                      <motion.span key={idx} variants={dayLetterVariants} className="inline-block">
                        {char === " " ? "\u00A0" : char}
                      </motion.span>
                    ))}
                  </motion.h2>
                  <span className="font-wizard text-silver-hp/50 text-base sm:text-lg">{dayData.date}</span>
                </div>
                <h3 className="font-display text-base sm:text-lg tracking-[0.15em] sm:tracking-[0.2em] text-silver-hp/80 uppercase mb-2">
                  {dayData.title}
                </h3>
                <p className="font-body text-sm text-silver-hp/60 max-w-xl leading-relaxed">
                  {dayData.description}
                </p>
                <div className="mt-4 sm:mt-6 w-full max-w-sm opacity-50">
                  <RoughDivider width={200} height={12} color="#1F2833" seed={100 + dayIndex} />
                </div>
              </motion.div>

              {/* Day Events list */}
              <div className="ml-0 sm:ml-4 pl-0 sm:pl-4 relative">
                {dayData.events.map((ev, evIndex) => (
                  <EventCard key={evIndex} event={ev} index={evIndex} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* The End Flourish */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mt-12 flex flex-col items-center justify-center relative pb-10"
        >
          <div className="absolute inset-0 pointer-events-none flex justify-center items-center">
            <Sparkles count={20} />
            <div className="w-64 h-64 bg-gold-hp/5 rounded-full blur-[60px] hp-pulse" />
          </div>
          <RoughStar size={36} color="#D4AF37" seed={888} className="mb-6 opacity-80 hp-float" style={{ animationDuration: "5s" }} />
          <RoughDivider width={100} height={14} color="#66FCF1" seed={999} />
          <p className="font-wizard text-gold-hp/80 mt-4 sm:mt-6 tracking-widest text-lg sm:text-xl hp-glow-gold mb-8 sm:mb-12 text-center px-4">
            The prophecy fulfills.
          </p>
          <RoughButton as={Link} href="/" fill={false} color="#C5C6C7" className="mt-4 px-8 py-3 text-sm tracking-widest">
            ← BACK TO THE HALL
          </RoughButton>
        </motion.div>
      </div>
      
      <Footer />
    </main>
  );
}
