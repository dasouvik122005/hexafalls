"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import gsap from "gsap";
import Sparkles from "./Sparkles";
import RoughFrame from "./RoughFrame";
import RoughButton from "./RoughButton";
import RoughDivider from "./RoughDivider";

const BLUE = "#3B82F6";
const BLUE_GLOW = "rgba(59,130,246,0.35)";

/* ── "already registered" badge ───────────────────────────────────────────── */
function RegisteredBadge({ href, label = "VIEW MY REGISTRATION" }) {
  return (
    <>
      <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/50 bg-emerald-400/10 px-3 py-1 font-display text-[10px] uppercase tracking-[0.4em] text-emerald-300">
        <span aria-hidden="true">✓</span> You&apos;re registered
      </span>
      <RoughButton
        as={Link}
        href={href}
        color="#4ade80"
        glow="rgba(74,222,128,0.3)"
        fill={false}
        seed={23}
        className="px-10 sm:px-12 py-4 leading-none text-[12px] sm:text-[13px] tracking-[0.35em]"
      >
        <span>{label}</span>
        <span aria-hidden="true">↗</span>
      </RoughButton>
    </>
  );
}

/* ── reusable section eyebrow ────────────────────────────────────────── */
function Eyebrow({ children, color = BLUE }) {
  return (
    <div className="flex items-center justify-center gap-3 text-[11px] uppercase tracking-[0.5em] font-display text-center"
         style={{ color: `${color}cc` }}>
      <RoughDivider width={48} height={20} color={color} seed={3} />
      {children}
      <RoughDivider width={48} height={20} color={color} seed={5} />
    </div>
  );
}

/* ── fade-in wrapper (opacity + y only — never blur) ─────────────────── */
function Reveal({ children, delay = 0, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.05 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function CpDetails({ registered = null }) {
  const sectionRef = useRef(null);

  /* GSAP letter-stagger on the hero headline */
  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      if (reduce) {
        gsap.set(".hd-letter", { opacity: 1, y: 0 });
        return;
      }
      gsap.set(".hd-letter", { opacity: 0, y: 24 });
      gsap.to(".hd-letter", {
        opacity: 1, y: 0,
        duration: 0.4,
        ease: "power3.out",
        stagger: { each: 0.04, from: "start" },
        delay: 0.15,
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const splitLetters = (text) => {
    const parts = text.split(/(\s+)/);
    return parts.map((part, wi) => {
      if (/^\s+$/.test(part)) {
        return <span key={`w${wi}`} style={{ whiteSpace: "pre" }}>{part}</span>;
      }
      return (
        <span key={`w${wi}`} className="inline-block" style={{ whiteSpace: "nowrap" }}>
          {[...part].map((ch, ci) => (
            <span key={`${wi}-${ci}`} className="hd-letter inline-block">{ch}</span>
          ))}
        </span>
      );
    });
  };

  const topics = [
    "Arrays & Strings", "Sorting & Searching", "Mathematics", 
    "Greedy Algorithms", "Hashing", "Recursion", "Dynamic Programming", 
    "Graph Theory", "Trees", "Priority Queues", "Implementation", 
    "Two Pointers", "Binary Search"
  ];

  return (
    <section
      ref={sectionRef}
      className="relative isolate overflow-hidden pt-32 pb-24 px-6"
    >
      {/* Matte dark background */}
      <div
        className="absolute inset-0 -z-40"
        style={{ background: "linear-gradient(180deg, #0B0C10 0%, #0e0c0a 100%)" }}
      />
      <div aria-hidden="true" className="absolute inset-0 -z-30 hp-stars pointer-events-none opacity-25" />
      <div aria-hidden="true" className="absolute inset-0 -z-20 hp-scrim pointer-events-none opacity-50" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 pointer-events-none">
        <Sparkles count={8} color="#3B82F6" />
      </div>

      {/* ═══ HERO ═══════════════════════════════════════════════════════ */}
      <div className="mx-auto max-w-4xl text-center relative">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Eyebrow color={BLUE}>Competitive Programming</Eyebrow>
        </motion.div>

        <h1
          className="mt-6 font-display font-black tracking-tight leading-[1.05]"
          style={{
            fontSize: "clamp(2.5rem, 8vw, 6rem)",
            color: BLUE,
            textShadow: "0 0 8px rgba(59,130,246,.22)",
          }}
        >
          {splitLetters("MINDSPELL")}
          <br />
          {splitLetters("MARATHON")}
        </h1>

        <Reveal delay={0.1}>
          <p className="mt-4 font-display font-bold text-lg sm:text-xl text-[#3B82F6] italic tracking-wide" style={{ textShadow: "0 0 10px rgba(59,130,246,0.5)" }}>
            &quot;Where Logic Meets Magic.&quot;
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <p className="mt-6 font-wizard text-silver-hp/80 text-base leading-relaxed max-w-2xl mx-auto">
            Step into the enchanted arena of MINDSPELL MARATHON, the official Competitive Programming event of HexaFalls 2.0. Inspired by the magical world of wizardry, this contest challenges participants to solve algorithmic and data structure problems through logic, speed, and precision.
          </p>
          <p className="mt-4 font-wizard text-silver-hp/80 text-sm leading-relaxed max-w-2xl mx-auto">
            Participants will compete individually in a timed coding contest featuring carefully curated problems ranging from easy to challenging. Every submission will be evaluated in real time using the HackerRank judging platform.
          </p>
        </Reveal>

        {/* CTA */}
        <Reveal delay={0.25} className="mt-8 flex flex-col items-center gap-3">
          {registered ? (
            <RegisteredBadge href={registered.href} label={registered.label} />
          ) : (
            <>
              <span
                className="inline-flex items-center gap-2 rounded-full border px-3 py-1 font-display text-[10px] uppercase tracking-[0.4em]"
                style={{ borderColor: `${BLUE}80`, color: BLUE, backgroundColor: `${BLUE}1a` }}
              >
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full rounded-full opacity-70 animate-ping" style={{ backgroundColor: BLUE }} />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ backgroundColor: BLUE }} />
                </span>
                Registrations Open
              </span>
              <RoughButton
                as={Link}
                href="/events/cp/register"
                color={BLUE}
                glow={BLUE_GLOW}
                fill={false}
                shimmer
                seed={23}
                className="px-10 sm:px-12 py-4 sm:py-5 leading-none text-[13px] sm:text-[14px] tracking-[0.4em]"
              >
                <span>REGISTER · MARATHON</span>
                <span aria-hidden="true">↗</span>
              </RoughButton>
            </>
          )}
        </Reveal>
      </div>

      {/* ═══ EVENT DETAILS & FORMAT ═════════════════════════════════════ */}
      <div className="mx-auto mt-28 max-w-5xl grid gap-10 md:grid-cols-2">
        <Reveal>
          <div className="h-full rounded-xl border border-blue-500/20 bg-midnight/50 p-8 shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur-md">
            <Eyebrow color={BLUE}>The Stats</Eyebrow>
            <h3 className="mt-6 mb-6 font-display text-xl text-[#e8e4d6] tracking-wide text-center">Event Details</h3>
            <ul className="space-y-4 font-wizard text-sm text-silver-hp/80">
              <li className="flex gap-3"><span className="text-[#3B82F6]">✦</span> <strong>Event Name:</strong> Mindspell Marathon</li>
              <li className="flex gap-3"><span className="text-[#3B82F6]">✦</span> <strong>Category:</strong> Competitive Programming</li>
              <li className="flex gap-3"><span className="text-[#3B82F6]">✦</span> <strong>Mode:</strong> Offline (On-Campus)</li>
              <li className="flex gap-3"><span className="text-[#3B82F6]">✦</span> <strong>Platform:</strong> HackerRank</li>
              <li className="flex gap-3"><span className="text-[#3B82F6]">✦</span> <strong>Duration:</strong> 3 hours</li>
              <li className="flex gap-3"><span className="text-[#3B82F6]">✦</span> <strong>Participation:</strong> Individual</li>
              <li className="flex gap-3"><span className="text-[#3B82F6]">✦</span> <strong>Languages:</strong> C, C++, Java, Python, JavaScript, Kotlin, C#, Go, and others supported by HackerRank.</li>
            </ul>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="h-full rounded-xl border border-blue-500/20 bg-midnight/50 p-8 shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur-md">
            <Eyebrow color={BLUE}>The Trial</Eyebrow>
            <h3 className="mt-6 mb-6 font-display text-xl text-[#e8e4d6] tracking-wide text-center">Contest Format</h3>
            <ul className="space-y-4 font-wizard text-sm text-silver-hp/80">
              <li className="flex gap-3"><span className="text-[#3B82F6]">⌬</span> 9 algorithmic programming problems</li>
              <li className="flex gap-3"><span className="text-[#3B82F6]">⌬</span> Difficulty ranges from Beginner to Advanced</li>
              <li className="flex gap-3"><span className="text-[#3B82F6]">⌬</span> Real-time automated evaluation</li>
              <li className="flex gap-3"><span className="text-[#3B82F6]">⌬</span> Live leaderboard throughout the contest</li>
              <li className="flex gap-3"><span className="text-[#3B82F6]">⌬</span> Partial scoring wherever applicable</li>
              <li className="flex gap-3"><span className="text-[#3B82F6]">⌬</span> Tie-breaking based on submission time</li>
            </ul>
          </div>
        </Reveal>
      </div>

      {/* ═══ TOPICS ══════════════════════════════════════════════════════ */}
      <div className="mx-auto mt-28 max-w-4xl text-center">
        <Reveal>
          <Eyebrow color={BLUE}>Syllabus</Eyebrow>
          <h2 className="mt-4 font-display font-bold text-2xl sm:text-3xl tracking-tight" style={{ color: BLUE }}>
            Topics Covered
          </h2>
          <p className="mt-3 font-wizard text-silver-hp/70 text-sm max-w-xl mx-auto">
            Participants may encounter problems based on:
          </p>
        </Reveal>
        
        <Reveal delay={0.1}>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {topics.map((t, i) => (
              <span 
                key={t}
                className="px-4 py-2 text-xs font-display tracking-widest uppercase border border-blue-500/30 rounded-full bg-blue-500/5 text-blue-200"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                {t}
              </span>
            ))}
          </div>
        </Reveal>
      </div>

      {/* ═══ RULES ═══════════════════════════════════════════════════════ */}
      <div className="mx-auto mt-28 max-w-4xl">
        <Reveal>
          <Eyebrow color="#EF4444">Laws of Magic</Eyebrow>
          <h2 className="mt-4 text-center font-display font-bold text-2xl sm:text-3xl tracking-tight text-red-500 hp-glow-red">
            Rules
          </h2>
        </Reveal>

        <Reveal delay={0.1} className="mt-8">
          <RoughFrame
            seed={77}
            stroke="#EF4444"
            strokeWidth={1.5}
            padding={32}
            className="bg-red-950/10 backdrop-blur-sm shadow-[0_10px_30px_rgba(239,68,68,0.1)]"
          >
            <ul className="space-y-4 font-wizard text-sm md:text-base text-silver-hp/85 leading-relaxed">
              <li className="flex gap-3"><span className="text-red-500 font-bold">I.</span> Individual participation only.</li>
              <li className="flex gap-3"><span className="text-red-500 font-bold">II.</span> Participants must carry a valid college ID.</li>
              <li className="flex gap-3"><span className="text-red-500 font-bold">III.</span> Internet browsing, AI tools, external code, or communication with others is strictly prohibited.</li>
              <li className="flex gap-3"><span className="text-red-500 font-bold">IV.</span> Any form of malpractice will result in immediate disqualification.</li>
              <li className="flex gap-3"><span className="text-red-500 font-bold">V.</span> Participants must remember their HackerRank username and password.</li>
              <li className="flex gap-3"><span className="text-red-500 font-bold">VI.</span> The decision of the organizing committee shall be final and binding.</li>
              <li className="flex gap-3"><span className="text-red-500 font-bold">VII.</span> Participants should report at least 30 minutes before the contest begins.</li>
            </ul>
          </RoughFrame>
        </Reveal>
      </div>

      {/* ═══ WHY PARTICIPATE ═════════════════════════════════════════════ */}
      <div className="mx-auto mt-28 max-w-3xl text-center">
        <Reveal>
          <Eyebrow color={BLUE}>The Glory</Eyebrow>
          <h2 className="mt-4 font-display font-bold text-2xl sm:text-3xl tracking-tight" style={{ color: BLUE }}>
            Why Participate?
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 text-left">
            {[
              "Test your coding skills in a competitive environment.",
              "Solve real-world algorithmic challenges.",
              "Experience an industry-standard coding platform.",
              "Improve your problem-solving and analytical thinking.",
              "Win exciting prizes, certificates, and recognition."
            ].map((reason, idx) => (
              <div key={idx} className="flex items-start gap-3 p-4 border border-blue-500/10 rounded-lg bg-midnight/40">
                <span className="text-blue-500 mt-0.5">✦</span>
                <span className="font-wizard text-silver-hp/90 text-sm leading-relaxed">{reason}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      {/* ═══ FOOTER CTAs ═════════════════════════════════════════════════ */}
      <Reveal delay={0.1} className="mt-28 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4">
        {registered ? (
          <RoughButton
            as={Link}
            href={registered.href}
            color="#4ade80"
            glow="rgba(74,222,128,0.3)"
            fill={false}
            seed={23}
            className="px-8 py-3 leading-none text-[12px]"
          >
            <span>{registered.label ?? "VIEW MY REGISTRATION"} ↗</span>
          </RoughButton>
        ) : (
          <RoughButton
            as={Link}
            href="/events/cp/register"
            color={BLUE}
            glow={BLUE_GLOW}
            fill={false}
            shimmer
            seed={23}
            className="px-8 py-3 leading-none text-[12px]"
          >
            <span>REGISTER · MARATHON ↗</span>
          </RoughButton>
        )}
        <RoughButton
          as={Link}
          href="/events"
          color="#C5C6C7"
          fill={false}
          seed={31}
          className="px-8 py-3 leading-none text-[11px]"
        >
          ← ALL EVENTS
        </RoughButton>
      </Reveal>
    </section>
  );
}
