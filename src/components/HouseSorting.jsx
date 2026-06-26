"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import RoughFrame from "./RoughFrame";
import RoughButton from "./RoughButton";
import RoughDivider from "./RoughDivider";
import FloatingArtifacts from "./FloatingArtifacts";
import {
  HOUSES,
  ScrollCard,
  downloadScroll,
  MagicalParticles,
} from "./SortingCeremony";
import Sparkles from "./Sparkles";

const STORAGE_KEY = "hexafalls_house_v1";

// Each option weights one house. Tally → the loudest voice wins.
const QUESTIONS = [
  {
    q: "A locked door bars your path. You…",
    options: [
      { label: "Blast it open — nerve over caution", house: "g" },
      { label: "Pick the lock, quiet and unseen", house: "s" },
      { label: "Decode the runes carved into it", house: "r" },
      { label: "Ask around — someone holds the key", house: "h" },
    ],
  },
  {
    q: "Which would you most hate to be called?",
    options: [
      { label: "Cowardly", house: "g" },
      { label: "Ordinary", house: "s" },
      { label: "Ignorant", house: "r" },
      { label: "Selfish", house: "h" },
    ],
  },
  {
    q: "Your wand chooses you for your…",
    options: [
      { label: "Daring", house: "g" },
      { label: "Ambition", house: "s" },
      { label: "Wit", house: "r" },
      { label: "Loyalty", house: "h" },
    ],
  },
  {
    q: "Midnight in the castle. You drift toward…",
    options: [
      { label: "The forbidden corridor", house: "g" },
      { label: "The dungeons' quiet secrets", house: "s" },
      { label: "The library's restricted shelves", house: "r" },
      { label: "The kitchens, to lend a hand", house: "h" },
    ],
  },
  {
    q: "A creature blocks the bridge. You…",
    options: [
      { label: "Meet it head-on", house: "g" },
      { label: "Outsmart it and slip past", house: "s" },
      { label: "Recall its weakness from a book", house: "r" },
      { label: "Calm it with patience", house: "h" },
    ],
  },
];

function houseByKey(key) {
  return HOUSES.find((h) => h.key === key) || HOUSES[0];
}

// ── The hat itself — a realistic cinematic sorting hat ──────────────
function SortingHat({ size = 130, glow = "#D4AF37" }) {
  return (
    <motion.div 
      className="relative flex items-center justify-center"
      animate={{ y: [-8, 8, -8] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
    >
      <div 
        className="absolute inset-0 rounded-full blur-[40px] pointer-events-none hp-pulse"
        style={{ background: `radial-gradient(circle, ${glow}55 0%, transparent 70%)` }}
      />
      {/* Magical rotating aura */}
      <motion.div 
        className="absolute w-[150%] h-[150%] rounded-full border border-dashed opacity-30 pointer-events-none"
        style={{ borderColor: glow }}
        animate={{ rotate: 360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      />
      <motion.div 
        className="absolute w-[125%] h-[125%] rounded-full border border-dotted opacity-20 pointer-events-none"
        style={{ borderColor: glow }}
        animate={{ rotate: -360 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      />
      
      <div 
        style={{
          width: size,
          height: size,
          filter: `drop-shadow(0 0 15px ${glow}66) drop-shadow(0 0 35px ${glow}33) contrast(1.15) brightness(1.1)`,
          background: `url('/assets/realistic_sorting_hat.png') center/contain no-repeat`,
          mixBlendMode: 'screen',
          transform: 'scale(1.3)', // Scale up to compensate for image padding + mask
          WebkitMaskImage: 'radial-gradient(circle at center, black 45%, transparent 68%)',
          maskImage: 'radial-gradient(circle at center, black 45%, transparent 68%)',
        }}
        aria-hidden="true"
      />
    </motion.div>
  );
}

export default function HouseSorting() {
  // phase: loading | intro | quiz | naming | revealing | result
  const [phase, setPhase] = useState("loading");
  const [qIndex, setQIndex] = useState(0);
  const [tally, setTally] = useState({ g: 0, s: 0, r: 0, h: 0 });
  const [houseKey, setHouseKey] = useState(null);
  const [name, setName] = useState("");
  const [savedName, setSavedName] = useState("");
  const sectionRef = useRef(null);

  // On mount, restore a prior sorting so returning wizards skip the quiz.
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed?.houseKey && HOUSES.some((h) => h.key === parsed.houseKey)) {
            setHouseKey(parsed.houseKey);
            setName(parsed.name || "");
            setSavedName(parsed.name || "");
            setPhase("result");
            return;
          }
        }
      } catch {
        /* ignore corrupt storage */
      }
      setPhase("intro");
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const house = houseKey ? houseByKey(houseKey) : null;

  function answer(optHouse) {
    // Ignore stray taps once we've run past the last question (prevents an
    // out-of-range qIndex from a rapid double-click).
    if (phase !== "quiz" || qIndex >= QUESTIONS.length) return;

    const next = { ...tally, [optHouse]: (tally[optHouse] ?? 0) + 1 };
    setTally(next);

    const nextIndex = qIndex + 1;
    if (nextIndex < QUESTIONS.length) {
      setQIndex(nextIndex);
    } else {
      // decide the winner (ties resolve by HOUSES order)
      let best = HOUSES[0].key;
      let bestN = -1;
      for (const h of HOUSES) {
        if (next[h.key] > bestN) {
          bestN = next[h.key];
          best = h.key;
        }
      }
      setHouseKey(best);
      setPhase("naming");
    }
  }

  function confirmName() {
    const clean = name.trim();
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ houseKey, name: clean }),
      );
    } catch {
      /* ignore */
    }
    setSavedName(clean);
    setPhase("revealing");
  }

  function resort() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    setTally({ g: 0, s: 0, r: 0, h: 0 });
    setQIndex(0);
    setHouseKey(null);
    setName("");
    setSavedName("");
    setPhase("intro");
  }

  return (
    <section
      ref={sectionRef}
      className="relative isolate overflow-hidden min-h-screen pt-28 pb-24 px-6 flex flex-col items-center"
    >
      <div aria-hidden="true" className="absolute inset-0 -z-30 hp-stars opacity-50 pointer-events-none" />
      <div aria-hidden="true" className="absolute inset-0 -z-20 hp-scrim pointer-events-none" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 pointer-events-none">
        <MagicalParticles />
      </div>
      <FloatingArtifacts stars={14} runes={12} seed={9} />

      <div className="mx-auto mb-10 sm:mb-14 flex max-w-3xl items-center justify-center gap-3 text-[11px] uppercase tracking-[0.5em] text-cyan-hp/70 font-display text-center">
        <RoughDivider width={48} height={20} color="#66FCF1" seed={3} />
        The Sorting
        <RoughDivider width={48} height={20} color="#66FCF1" seed={5} />
      </div>
 
      <div className="flex w-full flex-1 flex-col items-center justify-center">
      <AnimatePresence mode="wait">
        {phase === "loading" && (
          <motion.div key="loading" className="mt-20 text-silver-hp/50 font-wizard" />
        )}

        {/* ── INTRO — the hat awakens ─────────────────────────────────────── */}
        {phase === "intro" && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center text-center"
          >
            <motion.div
              className="hp-float"
              initial={{ scale: 0.7, rotate: -6, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <SortingHat size={220} />
            </motion.div>
            <div className="absolute inset-0 pointer-events-none -z-10">
              <Sparkles count={20} />
            </div>
            <h1
              aria-label="The Sorting Hat"
              className="mt-7 whitespace-nowrap font-display font-black tracking-tight leading-[1.05]"
              style={{ fontSize: "clamp(1.55rem, 7.5vw, 4.2rem)" }}
            >
              <span
                style={{
                  color: "#e0fffc",
                  WebkitTextStroke: "1.4px rgba(102,252,241,0.8)",
                  textShadow:
                    "0 0 16px rgba(102,252,241,0.4), 0 0 40px rgba(102,252,241,0.18)",
                }}
              >
                The Sorting{" "}
              </span>
              <span
                style={{
                  color: "#FFD700",
                  WebkitTextStroke: "2px rgba(212,175,55,0.95)",
                  textShadow:
                    "0 0 22px rgba(212,175,55,0.55), 0 0 60px rgba(212,175,55,0.28), 0 3px 7px rgba(0,0,0,0.7)",
                }}
              >
                Hat
              </span>
            </h1>

            {/* The four houses, lined up as crest artifacts */}
            <div className="mt-7 flex flex-wrap items-center justify-center gap-x-7 gap-y-4 sm:gap-x-10">
              {HOUSES.map((h, i) => (
                <div
                  key={h.key}
                  className="flex flex-col items-center gap-1.5 opacity-80 transition hover:opacity-100"
                >
                  <span
                    className="hp-float"
                    style={{ animationDuration: `${7 + i}s`, animationDelay: `${i * 0.4}s` }}
                  >
                    {h.icon}
                  </span>
                  <span
                    className="font-display text-[9px] uppercase tracking-[0.3em]"
                    style={{ color: h.labelColor }}
                  >
                    {h.name}
                  </span>
                </div>
              ))}
            </div>

            <p className="mx-auto mt-7 max-w-md font-wizard text-silver-hp/80 text-base sm:text-lg leading-relaxed">
              Sit, and let me look inside your mind. Five questions, and I shall
              name the house where you belong.
            </p>
            <RoughButton
              onClick={() => setPhase("quiz")}
              color="#D4AF37"
              glow="rgba(212,175,55,0.35)"
              shimmer
              seed={21}
              className="mt-5 px-10 sm:px-14 py-4 sm:py-5 text-[13px] sm:text-[14px] tracking-[0.4em]"
            >
              PLACE THE HAT
            </RoughButton>
          </motion.div>
        )}

        {/* ── QUIZ ────────────────────────────────────────────────────────── */}
        {phase === "quiz" && QUESTIONS[qIndex] && (
          <motion.div
            key={`q-${qIndex}`}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-2xl flex flex-col items-center"
          >
            {/* progress dots */}
            <div className="mb-8 flex items-center gap-2">
              {QUESTIONS.map((_, i) => (
                <span
                  key={i}
                  className="h-1.5 rounded-full transition-all duration-300"
                  style={{
                    width: i === qIndex ? 26 : 8,
                    background:
                      i < qIndex
                        ? "rgba(102,252,241,0.7)"
                        : i === qIndex
                          ? "#D4AF37"
                          : "rgba(197,198,199,0.25)",
                  }}
                />
              ))}
            </div>

            <div className="hp-float mb-4 opacity-90">
              <SortingHat size={64} glow="#66FCF1" />
            </div>

            <h2
              className="text-center font-display font-bold text-silver-hp leading-snug hp-glow"
              style={{ fontSize: "clamp(1.6rem, 4.5vw, 2.5rem)" }}
            >
              {QUESTIONS[qIndex].q}
            </h2>

            <div className="mt-6 mb-2 opacity-70">
              <RoughDivider width={220} height={22} color="#D4AF37" ornament="✦" seed={40 + qIndex} />
            </div>

            <div className="mt-6 grid w-full gap-4 sm:grid-cols-2">
              {QUESTIONS[qIndex].options.map((opt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => answer(opt.house)}
                  className="group relative flex items-center gap-4 text-left rounded-[3px] border border-silver-hp/20 bg-slate-hp/30 backdrop-blur-sm px-5 py-5 sm:py-6 transition hover:border-gold-hp/60 hover:bg-gold-hp/5 hover:-translate-y-0.5 hover:shadow-[0_6px_26px_rgba(212,175,55,0.18)]"
                >
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-silver-hp/25 bg-midnight/40 font-display text-[13px] text-silver-hp/70 transition group-hover:border-gold-hp/60 group-hover:text-gold-hp"
                  >
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="font-wizard text-silver-hp/85 text-[15px] sm:text-base leading-relaxed group-hover:text-silver-hp">
                    {opt.label}
                  </span>
                  <span className="ml-auto text-gold-hp/0 group-hover:text-gold-hp/80 group-hover:translate-x-0.5 transition">
                    →
                  </span>
                </button>
              ))}
            </div>

            <p className="mt-8 max-w-md text-center font-wizard italic text-silver-hp/45 text-sm">
              The hat murmurs as it weighs your answer…
            </p>
            <div className="mt-3 font-display text-[10px] uppercase tracking-[0.4em] text-silver-hp/40">
              Question {qIndex + 1} of {QUESTIONS.length}
            </div>
          </motion.div>
        )}

        {/* ── NAMING ──────────────────────────────────────────────────────── */}
        {phase === "naming" && house && (
          <motion.div
            key="naming"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.45 }}
            className="w-full max-w-4xl flex flex-col items-center pt-6 sm:pt-10"
          >
            {/* Colored sorting hat crowning the reveal */}
            <div className="hp-float">
              <SortingHat size={104} glow={house.labelColor} />
            </div>

            <div className="mt-10 sm:mt-14 w-full flex flex-col sm:flex-row items-center justify-center gap-10 sm:gap-12">
            {/* LEFT — the chosen crest */}
            <div className="flex flex-1 flex-col items-center text-center">
              <p className="font-display text-[11px] uppercase tracking-[0.5em] text-silver-hp/55">
                The hat has chosen
              </p>

              {/* Glowing house medallion */}
              <div
                className="hp-float mt-5 flex h-28 w-28 sm:h-32 sm:w-32 items-center justify-center rounded-full"
                style={{
                  border: `1.5px solid ${house.labelColor}`,
                  background: `${house.labelColor}14`,
                  boxShadow: `0 0 36px ${house.labelColor}55, inset 0 0 28px ${house.labelColor}22`,
                }}
              >
                <div style={{ transform: "scale(2)" }}>{house.icon}</div>
              </div>

              <h2
                className="mt-5 font-display font-black tracking-tight"
                style={{
                  fontSize: "clamp(2rem, 6.5vw, 3.4rem)",
                  color: house.labelColor,
                  WebkitTextStroke: `1.5px ${house.activeBorder}`,
                  textShadow: `0 0 24px ${house.labelColor}66, 0 3px 8px rgba(0,0,0,0.6)`,
                }}
              >
                {house.name}
              </h2>
              <p className="mt-3 max-w-sm font-wizard italic text-silver-hp/75 text-sm sm:text-base">
                {house.trait}
              </p>
            </div>

            {/* RIGHT — the name form */}
            <div className="flex w-full sm:flex-1 max-w-md flex-col items-center">
              <RoughFrame
                seed={49}
                stroke={house.labelColor}
                mistColor={house.labelColor}
                strokeWidth={1.4}
                roughness={1.5}
                bowing={1.2}
                padding={22}
                className="w-full bg-slate-hp/25 backdrop-blur-sm"
                inner="flex flex-col items-center text-center gap-3"
              >
                <div
                  className="flex items-center justify-center gap-2 font-display text-[11px] uppercase tracking-[0.4em]"
                  style={{ color: house.labelColor }}
                >
                  <span aria-hidden="true" className="text-base leading-none">✒</span>
                  <span>Inscribe your name upon the crest</span>
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && name.trim() && confirmName()}
                  placeholder="e.g. Luna Lovegood"
                  maxLength={40}
                  autoFocus
                  className="w-full rounded-[3px] border bg-midnight/40 px-4 py-3 text-center font-wizard text-lg text-silver-hp placeholder:text-silver-hp/30 outline-none transition"
                  style={{
                    borderColor: `${house.labelColor}40`,
                    boxShadow: name.trim() ? `0 0 18px ${house.labelColor}33` : "none",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = house.labelColor;
                    e.currentTarget.style.boxShadow = `0 0 20px ${house.labelColor}44`;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = `${house.labelColor}40`;
                    e.currentTarget.style.boxShadow = name.trim()
                      ? `0 0 18px ${house.labelColor}33`
                      : "none";
                  }}
                />
                <p className="font-wizard italic text-silver-hp/45 text-xs">
                  It will be inked onto your house crest — yours to keep and share.
                </p>
              </RoughFrame>

              <RoughButton
                onClick={confirmName}
                disabled={!name.trim()}
                color={house.labelColor}
                glow={`${house.labelColor}66`}
                shimmer
                seed={27}
                className="mt-6 w-full py-4 text-[13px] tracking-[0.4em]"
              >
                REVEAL MY CREST <span>↗</span>
              </RoughButton>
            </div>
            </div>
          </motion.div>
        )}

        {/* ── REVEALING — full-screen talking hat (sepia) before the crest ──── */}
        {phase === "revealing" && house && (
          <motion.div
            key="revealing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
            /* fixed below the navbar (z-50) and over everything else, to the footer */
            className="fixed inset-0 z-40 bg-midnight"
          >
            <video
              src="/video/talking_hat.mp4"
              autoPlay
              muted
              playsInline
              onEnded={() => setPhase("result")}
              onError={() => setPhase("result")}
              className="absolute inset-0 h-full w-full object-contain pb-24 px-2 sm:pb-12 sm:px-12 md:p-24 lg:p-32 xl:p-48"
              style={{ 
                mixBlendMode: "screen",
                filter: "sepia(0.5) saturate(1.2) contrast(1.1) brightness(0.9)",
                WebkitMaskImage: "radial-gradient(ellipse at center, black 45%, transparent 80%)",
                maskImage: "radial-gradient(ellipse at center, black 45%, transparent 80%)"
              }}
            />
            {/* Brownish dark wash across the whole video */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(160deg, rgba(60,38,16,0.45) 0%, rgba(28,18,8,0.5) 55%, rgba(12,8,4,0.65) 100%)",
                mixBlendMode: "multiply",
              }}
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(80,52,22,0.12) 0%, transparent 45%), radial-gradient(ellipse at center, transparent 50%, rgba(8,5,2,0.7) 100%)",
              }}
            />
            {/* drifting scrapbook artifacts over the footage */}
            <div className="pointer-events-none absolute inset-0 z-20">
              <FloatingArtifacts stars={16} runes={14} seed={23} />
            </div>
            <div className="pointer-events-none absolute inset-0 hp-stars opacity-15 mix-blend-screen" />

            {/* Skip toast */}
            <motion.button
              type="button"
              onClick={() => setPhase("result")}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.4 }}
              className="group fixed bottom-8 left-1/2 z-50 -translate-x-1/2 inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-midnight/70 px-5 py-2.5 font-display text-[11px] uppercase tracking-[0.35em] text-white/80 backdrop-blur-md hover:border-white/50 hover:text-white hover:shadow-[0_0_24px_rgba(255,255,255,0.18)] transition"
            >
              <span
                className="relative flex h-1.5 w-1.5"
                aria-hidden="true"
              >
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-hp opacity-70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan-hp" />
              </span>
              Skip to the ceremony
              <span className="transition group-hover:translate-x-0.5">→</span>
            </motion.button>
          </motion.div>
        )}

        {/* ── RESULT ──────────────────────────────────────────────────────── */}
        {phase === "result" && house && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-5xl flex flex-col sm:flex-row items-center justify-center gap-10 sm:gap-16"
          >
            {/* LEFT — the verdict + actions, centered */}
            <div className="flex flex-1 flex-col items-center justify-center text-center">
              <div className="hp-float">
                <SortingHat size={92} glow={house.labelColor} />
              </div>
              <p className="mt-5 font-display text-[11px] uppercase tracking-[0.5em] text-white/70">
                The hat has decided — you belong to
              </p>
              <h1
                className="mt-2 font-display font-black tracking-tight"
                style={{
                  fontSize: "clamp(2.2rem, 7vw, 3.6rem)",
                  color: house.labelColor,
                  WebkitTextStroke: `1.5px ${house.activeBorder}`,
                  textShadow: `0 0 26px ${house.labelColor}66, 0 3px 8px rgba(0,0,0,0.6)`,
                }}
              >
                {house.name}
              </h1>
              <p className="mt-3 max-w-xs font-wizard italic text-white/70 text-sm sm:text-base">
                {house.trait}
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
                <RoughButton
                  onClick={() => downloadScroll(savedName, house)}
                  color={house.labelColor}
                  glow={`${house.labelColor}55`}
                  shimmer
                  seed={63}
                  className="px-9 py-4 text-[12px] tracking-[0.35em]"
                >
                  DOWNLOAD CREST <span>↓</span>
                </RoughButton>
                <RoughButton
                  onClick={resort}
                  color="#C5C6C7"
                  fill={false}
                  seed={65}
                  className="px-7 py-3 text-[11px] tracking-[0.3em]"
                >
                  SORT AGAIN
                </RoughButton>
              </div>

              <Link
                href="/"
                className="mt-7 font-display text-[10px] uppercase tracking-[0.4em] text-white/45 hover:text-cyan-hp transition"
              >
                ← back to the hall
              </Link>
            </div>

            {/* RIGHT — the crest card on a glowing, star-strewn field */}
            <div className="relative isolate flex flex-1 items-center justify-center py-4">
              {/* house-coloured glow behind the card */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center"
              >
                <div
                  style={{
                    width: "85%",
                    height: "85%",
                    background: `radial-gradient(ellipse, ${house.labelColor}38 0%, transparent 70%)`,
                    filter: "blur(55px)",
                  }}
                />
              </div>
              <FloatingArtifacts stars={9} runes={7} seed={17} />
              <div className="relative w-full max-w-sm">
                <RoughFrame
                  seed={61}
                  stroke={house.labelColor}
                  mistColor={house.labelColor}
                  strokeWidth={1.5}
                  roughness={1.5}
                  bowing={1.2}
                  padding={14}
                  className="w-full"
                >
                  <ScrollCard name={savedName} house={house} />
                </RoughFrame>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </section>
  );
}
