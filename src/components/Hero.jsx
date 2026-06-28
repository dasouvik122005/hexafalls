"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import Link from "next/link";
import Sparkles from "./Sparkles";
import LocationMap from "./LocationMap";
import RoughButton from "./RoughButton";
import RoughFrame from "./RoughFrame";
import RoughDivider from "./RoughDivider";
import RoughStar from "./RoughStar";
import RoughCorners from "./RoughCorners";
import RoughTape from "./RoughTape";
import { CALLS } from "@/lib/routes";
import MysticalTicker from "./MysticalTicker";
import PartnerMarquee from "./PartnerMarquee";
import RoughButton from "./RoughButton";
import RoughDivider from "./RoughDivider";
import { EVENTS } from "@/lib/routes";

const SUMMARY = {
  hackathon: "58 hours, squads of 2–4, every track from AI to blockchain.",
  cp: "Solo duels of logic — sharpen the wand, race the clock.",
  gaming: "Squads of 2–4 — controller in hand, glory on the line.",
  hardware: "Build what you can hold — compete as a team or exhibit solo.",
};


// Per-scroll colour themes (one per CALLS card, cycling on index).
const SCROLL_THEMES = {
  0: {
    bg: "linear-gradient(160deg, #2f6b4c 0%, #1a4329 60%, #133523 100%)",
    border: "#4ade80",
    glow: "rgba(74,222,128,0.55)",
    accent: "#86efac",
    rune: "#3a8857",
    shimmer: "rgba(134,239,172,0.18)",
    label: "text-emerald-300",
  },
  1: {
    bg: "linear-gradient(160deg, #6b2a2a 0%, #421616 60%, #2d0f0f 100%)",
    border: "#f87171",
    glow: "rgba(248,113,113,0.55)",
    accent: "#fca5a5",
    rune: "#8a3232",
    shimmer: "rgba(252,165,165,0.18)",
    label: "text-red-300",
  },
  2: {
    bg: "linear-gradient(160deg, #2a3a6b 0%, #18244a 60%, #101a35 100%)",
    border: "#60a5fa",
    glow: "rgba(96,165,250,0.55)",
    accent: "#93c5fd",
    rune: "#3a5188",
    shimmer: "rgba(147,197,253,0.18)",
    label: "text-blue-300",
  },
  3: {
    bg: "linear-gradient(160deg, #6b5118 0%, #4a3610 60%, #352508 100%)",
    border: "#facc15",
    glow: "rgba(250,204,21,0.60)",
    accent: "#fde68a",
    rune: "#8a6a18",
    shimmer: "rgba(253,230,138,0.22)",
    label: "text-gold-hp",
  },
};

// Runic pattern SVG — drawn as a subtle watermark inside each scroll
function RunePattern({ color }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 120 400"
      className="absolute inset-y-0 right-0 h-full w-10 opacity-25 pointer-events-none select-none"
      preserveAspectRatio="xMidYMid slice"
    >
      {[
        "ᚠ", "ᚢ", "ᚦ", "ᚨ", "ᚱ", "ᚲ", "ᚷ", "ᚹ", "ᚺ", "ᚾ",
        "ᛁ", "ᛃ", "ᛇ", "ᛈ", "ᛉ", "ᛊ", "ᛏ", "ᛒ", "ᛖ", "ᛗ",
      ].map((r, i) => (
        <text
          key={i}
          x={i % 2 === 0 ? 10 : 55}
          y={20 + i * 19}
          fontSize="14"
          fill={color}
          fontFamily="serif"
        >
          {r}
        </text>
      ))}
    </svg>
  );
}

// Scroll roller top/bottom cap
function ScrollRoller({ position = "top", color }) {
  return (
    <div
      className={`absolute left-0 right-0 ${position === "top" ? "-top-3" : "-bottom-3"} z-10 h-6 rounded-full`}
      style={{
        background: `linear-gradient(${position === "top" ? "180deg" : "0deg"}, ${color}ff 0%, ${color}aa 40%, ${color}66 100%)`,
        boxShadow: `0 ${position === "top" ? "2px" : "-2px"} 8px rgba(0,0,0,0.6), inset 0 1px 2px rgba(255,255,255,0.15)`,
        border: `1px solid rgba(255,255,255,0.12)`,
      }}
    />
  );
}

export default function Hero() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const stripRef = useRef(null);
  const cursorRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const yStars = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const yMid = useTransform(scrollYProgress, [0, 1], ["0%", "60%"]);
  const yTitle = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const ctx = gsap.context(() => {
      // Only animate targets that actually exist (stripRef may be unattached) —
      // passing a null target makes GSAP warn "target null not found".
      const letters = sectionRef.current?.querySelectorAll(".hp-letter") ?? [];
      if (reduce) {
        const reduceTargets = [...letters, stripRef.current].filter(Boolean);
        if (reduceTargets.length) gsap.set(reduceTargets, { opacity: 1, y: 0 });
        return;
      }
      if (letters.length) {
        gsap.set(letters, { opacity: 0, y: 28, rotateX: -60 });
        gsap.to(letters, {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.4,
          ease: "power3.out",
          stagger: { each: 0.045, from: "start" },
          delay: 0.2,
        });
      }
      if (stripRef.current) {
        gsap.from(stripRef.current, {
          opacity: 0,
          y: 18,
          duration: 0.4,
          delay: 0.4,
          ease: "power2.out",
        });
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const el = cursorRef.current;
    const canvas = document.getElementById("wand-particles");
    if (!el || !canvas) return;
    const ctx = canvas.getContext("2d");
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);
    let tx = -400,
      ty = -400,
      cx = -400,
      cy = -400;
    let lastMoveTime = 0,
      glowOpacity = 0;
    const idleDelay = 260,
      maxGlow = 0.65;
    let raf;
    const particles = [];
    const onMove = (e) => {
      tx = e.clientX;
      ty = e.clientY;
      lastMoveTime = performance.now();
    };
    window.addEventListener("pointermove", onMove);
    class Particle {
      constructor(x, y) {
        this.x = x + (Math.random() - 0.5) * 12;
        this.y = y + (Math.random() - 0.5) * 12;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = -Math.random() * 0.7 - 0.15;
        this.life = 1;
        this.decay = Math.random() * 0.014 + 0.011;
        this.r = Math.random() * 1.6 + 0.5;
        this.gold = Math.random() > 0.45;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= this.decay;
      }
      draw() {
        ctx.save();
        ctx.globalAlpha = this.life * 0.55;
        ctx.fillStyle = this.gold ? "#D4AF37" : "#66FCF1";
        ctx.shadowBlur = 5;
        ctx.shadowColor = this.gold
          ? "rgba(212,175,55,0.55)"
          : "rgba(102,252,241,0.55)";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }
    let frameCount = 0;
    const loop = () => {
      const now = performance.now();
      const active = now - lastMoveTime < idleDelay;
      const targetOpacity = active ? maxGlow : 0;
      glowOpacity += (targetOpacity - glowOpacity) * 0.16;
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      el.style.transform = `translate(${cx - 300}px, ${cy - 300}px)`;
      el.style.opacity = `${glowOpacity}`;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frameCount++;
      if (active && frameCount % 2 === 0) particles.push(new Particle(cx, cy));
      for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw();
        if (particles[i].life <= 0) particles.splice(i, 1);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
    };
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
              className="hp-letter inline-block"
            >
              {ch}
            </span>
          ))}
        </span>
      );
    });
  };

  return (
    <>
      <section
        ref={sectionRef}
        className="relative isolate overflow-hidden h-screen flex flex-col items-center justify-start pt-32 pb-24 px-6"
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="https://res.cloudinary.com/dxkje9whm/video/upload/so_0,f_jpg,q_auto,w_1920/v1779009744/hexa2_hero_background_demo_1-B9c3V5LY3VUM4T_seg1_7c8c3f56-265e-4786-ab86-51d5784526bf_lnbo8r.jpg"
          aria-hidden="true"
          tabIndex={-1}
          disablePictureInPicture
          disableRemotePlayback
          className="absolute inset-0 -z-40 h-screen w-full object-cover"
        >
          <source
            src="https://res.cloudinary.com/dxkje9whm/video/upload/f_auto,q_auto,vc_auto,w_1920/v1779009744/hexa2_hero_background_demo_1-B9c3V5LY3VUM4T_seg1_7c8c3f56-265e-4786-ab86-51d5784526bf_lnbo8r.mp4"
          />
        </video>
        <div className="absolute inset-0 -z-39 bg-[#02050d]/70 pointer-events-none" />
        <div
          className="absolute inset-0 -z-37 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 90% 85% at 50% 45%, transparent 30%, rgba(2,5,12,0.92) 100%)",
          }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-48 -z-36 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(2,5,12,0.8) 0%, transparent 100%)",
          }}
        />

        {/* Wand particle canvas */}
        <canvas
          id="wand-particles"
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-20"
          style={{ width: "100vw", height: "100vh" }}
        />
        {/* Cursor wand glow */}
        <div
          ref={cursorRef}
          aria-hidden="true"
          className="pointer-events-none fixed top-0 left-0 z-10 h-150 w-150 rounded-full"
          style={{
            background:
              "radial-gradient(circle at center, rgba(102,252,241,0.10) 0%, rgba(102,252,241,0.05) 18%, rgba(212,175,55,0.03) 38%, transparent 68%)",
            filter: "blur(28px)",
            willChange: "transform, opacity",
          }}
        />

        <motion.div
          style={{ y: yStars }}
          className="absolute inset-0 -z-30 hp-stars opacity-15"
        />
        <motion.div
          style={{ y: yMid }}
          className="absolute inset-0 -z-20 hp-scrim opacity-10"
        />
        {/* Two sparkle layers — a deeper parallax wash plus a denser, brighter
            foreground field so the hero never reads as dead space. */}
        <motion.div
          style={{ y: yMid }}
          className="absolute inset-0 -z-10 opacity-70"
        >
          <Sparkles count={44} />
        </motion.div>
        <motion.div
          style={{ y: yStars }}
          className="absolute inset-0 -z-10 opacity-50"
        >
          <Sparkles count={28} />
        </motion.div>

        <RoughStar
          size={26}
          color="#A78BFA"
          seed={71}
          className="absolute top-24 left-6 sm:left-12 opacity-70 hp-float"
          style={{ animationDuration: "12s" }}
        />
        <RoughStar
          size={32}
          color="#D4AF37"
          fill
          seed={79}
          className="absolute top-40 right-8 sm:right-16 opacity-80 hp-float"
          style={{ animationDuration: "14s", animationDelay: "1.5s" }}
        />
        <RoughStar
          size={20}
          color="#66FCF1"
          seed={83}
          className="absolute bottom-32 left-12 opacity-60 hp-float"
          style={{ animationDuration: "10s", animationDelay: "2s" }}
        />
        <RoughStar
          size={16}
          color="#66FCF1"
          seed={91}
          className="absolute top-1/3 right-1/4 opacity-50 hp-float"
          style={{ animationDuration: "11s", animationDelay: "0.5s" }}
        />
        <RoughStar
          size={22}
          color="#A78BFA"
          fill
          seed={93}
          className="absolute bottom-44 right-10 sm:right-24 opacity-55 hp-float"
          style={{ animationDuration: "13s", animationDelay: "2.5s" }}
        />
        <RoughStar
          size={14}
          color="#D4AF37"
          seed={95}
          className="absolute top-1/2 left-1/4 opacity-50 hp-float"
          style={{ animationDuration: "9s", animationDelay: "1s" }}
        />

        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-20 -left-4 opacity-90"
        >
          <span className="relative block h-5 w-24">
            <RoughTape
              color="#66FCF1"
              width={96}
              height={20}
              rotation={28}
              inset={0}
              seed={89}
            />
          </span>
        </span>


        {/* partner logos */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-8 flex flex-wrap items-center justify-center gap-5 sm:gap-8"
          aria-label="Presented by"
        >
          {[
            { id: "jisu", label: "", logo: "/logos/jisu.png", url: "https://www.jisuniversity.ac.in/" },
            { id: "gdg", label: "", logo: "/logos/gdg_jisu.png", url: "https://gdg.community.dev/gdg-on-campus-jis-university-kolkata-india/" },
            { id: "cse", label: "", logo: "/logos/cse_jisu.png", url: "https://www.jisuniversity.ac.in/faculty-of-engineering-and-technology.php"},
          ].map((l, i, arr) => (
            <div key={l.id} className="flex items-center gap-3">
              <a
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                title={l.id.toUpperCase()}
                aria-label={l.id.toUpperCase()}
                className="group relative h-10 w-10 sm:h-12 sm:w-12 shrink-0 overflow-hidden rounded-md border border-silver-hp/25 bg-slate-hp/50 backdrop-blur flex items-center justify-center transition hover:border-cyan-hp/60 hover:shadow-[0_0_18px_rgba(102,252,241,0.25)]"
              >
                <img
                  src={l.logo}
                  alt={l.id.toUpperCase()}
                  className="block h-full w-full object-contain p-1.5 transition duration-300 group-hover:scale-105"
                  style={{
                    filter:
                      "brightness(1.05) contrast(1.05) saturate(0.85) drop-shadow(0 0 6px rgba(102,252,241,0.18))",
                  }}
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-cyan-hp/0 group-hover:bg-cyan-hp/10 transition mix-blend-screen"
                />
              </a>
              {l.label && (
                <span className="text-[11px] sm:text-xs uppercase tracking-[0.3em] text-silver-hp/70 transition font-display">
                  {l.label}
                </span>
              )}
              {i < arr.length - 1 && (
                <span aria-hidden="true" className="text-silver-hp/20">·</span>
              )}
            </div>
          ))}
        </motion.div>


        {/* HEADLINE */}
        <motion.div
          ref={titleRef}
          style={{ y: yTitle, opacity }}
          className="text-center"
        >
          {/* Ambient golden glow behind the title */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center -z-10">
            <div
              style={{
                width: "60%",
                height: "40%",
                background:
                  "radial-gradient(ellipse, rgba(212,175,55,0.10) 0%, transparent 70%)",
              }}
            />
          </div>
          <h1
            aria-label="HexaFalls Techfest"
            className="font-display font-black tracking-tight leading-[0.95] text-[14vw] sm:text-[10vw] md:text-[8.5vw]"
            style={{ perspective: 800 }}
          >
            <span
              className="block"
              style={{
                color: "#e0fffc",
                WebkitTextStroke: "2px rgba(102,252,241,0.9)",
              }}
            >
              {splitLetters("HexaFalls 2")}
            </span>
            <span
              className="block mt-2"
              style={{
                color: "#FFD700",
                fontSize: "clamp(1rem, 7vw, 6vw)",
                letterSpacing: "0.12em",
                WebkitTextStroke: "2px rgba(212,175,55,0.95)",
              }}
            >
              {splitLetters("Techfest")}
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-center font-wizard text-silver-hp/75 text-sm sm:text-base leading-relaxed">
            A 58-hour wizarding TechFest at JIS University, Kolkata — build,
            ship and conjure across web, AI, hardware and games with hundreds of
            student wizards this July.
          </p>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="mt-10 flex flex-col sm:flex-row items-center gap-4"
        >
          {/* Register — routes to /events/hackathon which then sends to Devfolio */}
          <RoughButton
            as={Link}
            href="/events"
            color="#D4AF37"
            glow="rgba(212,175,55,0.30)"
            shimmer
            seed={7}
            className="px-8 py-3 text-[12px]"
          >
            View Events<span>↗</span>
          </RoughButton>
          <RoughButton
            as={Link}
            href="/timeline"
            color="#C9A84C"
            fill={false}
            seed={11}
            className="px-8 py-3 text-[12px] tracking-[0.3em] transition-all duration-200 active:scale-95"
            style={{
              color: "#C9A84C",
              textShadow: "0 0 8px rgba(201,168,76,0.4)",
              filter: "drop-shadow(0 0 6px rgba(201,168,76,0.25))",
            }}
            onMouseDown={(e) =>
            (e.currentTarget.style.filter =
              "drop-shadow(0 0 16px rgba(201,168,76,0.7)) brightness(1.2)")
            }
            onMouseUp={(e) =>
            (e.currentTarget.style.filter =
              "drop-shadow(0 0 6px rgba(201,168,76,0.25))")
            }
            onMouseLeave={(e) =>
            (e.currentTarget.style.filter =
              "drop-shadow(0 0 6px rgba(201,168,76,0.25))")
            }
          >
            The Timeline
          </RoughButton>
          {/* Sorting Hat — sends visitors to the house-sorting ceremony. */}
          <RoughButton
            as={Link}
            href="/house"
            color="#A78BFA"
            glow="rgba(167,139,250,0.30)"
            seed={17}
            className="px-8 py-3 text-[12px] tracking-[0.3em]"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-4 w-4">
              <path d="M12 2c-1.1 0-2 .9-2 2 0 .2.03.4.08.58C6.9 5.6 4.5 8.3 4.5 11.5c0 .3.02.6.06.88-.9.2-1.56 1-1.56 1.95 0 1.1.9 2 2 2 .35 0 .68-.09.97-.25 1.2 1.46 3.07 2.42 5.18 2.42.62 0 1.22-.08 1.79-.24l5.2 2.06c.6.24 1.2-.32 1.02-.94l-1.3-4.5c.86-.83 1.39-1.95 1.39-3.2 0-1.04-.36-2-.97-2.77.05-.25.07-.5.07-.76 0-2.9-2.1-5.4-4.94-6.06.05-.18.08-.38.08-.57 0-1.1-.9-2-2-2zm-2.5 9c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm5 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1z"/>
            </svg>
            FACE THE SORTING HAT
          </RoughButton>
          <RoughButton
            as="a"
            href="https://discord.com/invite/FdgCkrmrG"
            target="_blank"
            rel="noopener noreferrer"
            color="#A78BFA"
            glow="rgba(167,139,250,0.30)"
            seed={13}
            className="px-8 py-3 text-[12px] tracking-[0.3em]"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-4 w-4">
              <path d="M20.317 4.369A19.79 19.79 0 0 0 16.21 3.05a.07.07 0 0 0-.073.035c-.21.375-.444.864-.608 1.249a18.27 18.27 0 0 0-5.487 0 12.55 12.55 0 0 0-.617-1.25.072.072 0 0 0-.073-.034 19.74 19.74 0 0 0-4.107 1.32.066.066 0 0 0-.03.027C2.05 8.247 1.39 12.005 1.7 15.73a.082.082 0 0 0 .031.056 19.91 19.91 0 0 0 5.993 3.027.073.073 0 0 0 .079-.026 14.2 14.2 0 0 0 1.227-1.994.07.07 0 0 0-.038-.098 13.1 13.1 0 0 1-1.872-.892.07.07 0 0 1-.007-.117c.126-.094.252-.192.371-.291a.07.07 0 0 1 .074-.01c3.927 1.793 8.18 1.793 12.062 0a.07.07 0 0 1 .074.009c.12.099.246.198.372.292a.07.07 0 0 1-.006.117 12.3 12.3 0 0 1-1.873.892.07.07 0 0 0-.038.099 15.92 15.92 0 0 0 1.226 1.993.07.07 0 0 0 .079.027 19.84 19.84 0 0 0 6.002-3.027.07.07 0 0 0 .03-.055c.5-4.318-.838-8.043-3.549-11.336a.056.056 0 0 0-.028-.027zM8.02 13.46c-1.182 0-2.156-1.085-2.156-2.418 0-1.333.955-2.418 2.156-2.418 1.21 0 2.176 1.094 2.156 2.418 0 1.333-.955 2.418-2.156 2.418zm7.974 0c-1.182 0-2.157-1.085-2.157-2.418 0-1.333.955-2.418 2.157-2.418 1.21 0 2.175 1.094 2.156 2.418 0 1.333-.946 2.418-2.156 2.418z" />
            </svg>
            JOIN OUR DISCORD <span>↗</span>
          </RoughButton>
        </motion.div>

        {/* Sepia partner marquee — renders only when partners are listed */}
        {/* <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.7 }}
          className="mt-12 flex w-full flex-col items-center gap-3"
        >
          <PartnerMarquee />
        </motion.div> */}
      </section>

      <div className="relative w-full overflow-hidden">
        <MysticalTicker />
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          SCROLLS SECTION — fully redesigned as parchment scroll cards
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative isolate overflow-hidden flex flex-col items-center justify-start px-6 scrolls-section-bg">
        {/* ── "THE SCROLLS GO OUT" heading ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="mt-20 w-full max-w-5xl"
        >
          {/* Decorative heading with ornamental dividers */}
          <div className="mb-10 flex flex-col items-center gap-2">
            {/* Top ornament row */}
            <div className="flex items-center gap-3">
              <div
                className="h-px w-16 sm:w-28"
                style={{
                  background:
                    "linear-gradient(to right, transparent, rgba(212,175,55,0.7))",
                }}
              />
              <svg viewBox="0 0 40 14" className="w-10 opacity-80" fill="none">
                <path
                  d="M20 1 L38 7 L20 13 L2 7 Z"
                  stroke="#D4AF37"
                  strokeWidth="1"
                  fill="rgba(212,175,55,0.15)"
                />
              </svg>
              <div
                className="h-px w-16 sm:w-28"
                style={{
                  background:
                    "linear-gradient(to left, transparent, rgba(212,175,55,0.7))",
                }}
              />
            </div>

            {/* Main title */}
            <h2
              className="font-display font-black tracking-[0.18em] uppercase text-center mt-1"
              style={{
                fontSize: "clamp(1.6rem, 4vw, 2.8rem)",
                color: "#D4AF37",
                textShadow:
                  "0 0 8px rgba(212,175,55,0.22), 0 2px 4px rgba(0,0,0,0.8)",
                letterSpacing: "0.2em",
              }}
            >
              The Scrolls Go Out
            </h2>

            {/* Bottom ornament row */}
            <div className="flex items-center gap-3 mt-1">
              <div
                className="h-px w-24 sm:w-36"
                style={{
                  background:
                    "linear-gradient(to right, transparent, rgba(212,175,55,0.5))",
                }}
              />
              <div className="flex gap-1.5 items-center">
                <div className="h-1 w-1 rounded-full bg-gold-hp opacity-60" />
                <div className="h-1.5 w-1.5 rounded-full bg-gold-hp opacity-80" />
                <div className="h-1 w-1 rounded-full bg-gold-hp opacity-60" />
              </div>
              <div
                className="h-px w-24 sm:w-36"
                style={{
                  background:
                    "linear-gradient(to left, transparent, rgba(212,175,55,0.5))",
                }}
              />
            </div>
          </div>


          {/* ── Scroll Cards Grid ──
              Each card is tilted slightly off-axis ("scattered on a desk"),
              straightens + lifts on hover. The 5-degree rotation pattern
              alternates so the row reads as a fan, not a column. */}
          {/* Scroll cards — tilt/scale only on hover-capable devices (desktop)
              so touchscreens skip the transform compositing work. */}
          <div className="flex flex-wrap justify-center gap-5 sm:gap-6 pt-2 pb-4">
            {CALLS.map((c, i) => {
              const theme = SCROLL_THEMES[i] ?? SCROLL_THEMES[3];
              const tiltDeg = [-2, 1.5, -1.5, 2][i % 4];
              const Wrapper = c.external ? "a" : Link;
              const wrapperProps = c.external
                ? { href: c.href, target: "_blank", rel: "noopener noreferrer" }
                : { href: c.href };
              return (
                <motion.div
                  key={c.href}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0, rotate: tiltDeg }}
                  viewport={{ once: true, amount: 0.05 }}
                  transition={{
                    duration: 0.35,
                    delay: i * 0.03,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="w-full sm:w-[19rem] lg:w-[20rem] hover:transform-[rotate(0deg)_translateY(-4px)] transition-transform duration-300"
                  style={{ transformOrigin: "center center", willChange: "transform" }}
                >
                  <Wrapper {...wrapperProps} className="group block h-full">
                    <div className="relative pt-2 pb-2">
                      <ScrollRoller position="top" color={theme.border} />

                      {/* Parchment card body — minHeight cut, boxShadow
                          simplified (one dark drop + a soft glow). */}
                      <div
                        className="relative overflow-hidden scroll-card-bg"
                        style={{
                          "--scroll-card-gradient": theme.bg,
                          border: `1px solid ${theme.border}`,
                          borderRadius: "2px",
                          boxShadow: `0 4px 18px rgba(0,0,0,0.55), 0 0 14px ${theme.glow}`,
                          minHeight: "230px",
                        }}
                      >
                        {/* Inner golden border trim */}
                        <div
                          className="absolute inset-[3px] pointer-events-none z-10"
                          style={{
                            border: `1px solid rgba(212,175,55,0.22)`,
                            borderRadius: "1px",
                          }}
                        />

                        {/* Runic side pattern — desktop only. 80 text nodes
                            in the DOM hurts mobile paint cost; the pattern
                            is too small to read on phones anyway. */}
                        <div className="hidden lg:block">
                          <RunePattern color={theme.rune} />
                        </div>

                        {/* Shimmer sweep — only when hover is supported AND
                            the user is hovering. No infinite animation on
                            touch / idle. */}
                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 opacity-0 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-hover:animate-[hp-shimmer_3s_linear_infinite] transition-opacity duration-500"
                          style={{
                            background: `linear-gradient(90deg, transparent, ${theme.shimmer}, transparent)`,
                          }}
                        />

                        {/* Content */}
                        <div className="relative z-10 flex flex-col gap-2.5 px-4 py-4 sm:px-5 sm:py-5">
                          {/* Status badge */}
                          <div className="flex items-center justify-between">
                            <span
                              className="font-display tracking-[0.3em] uppercase text-[9px]"
                              style={{ color: theme.accent, opacity: 0.75 }}
                            >
                              Call for
                            </span>
                            {c.open ? (
                              <span
                                className="rounded-sm px-2 py-0.5 font-display text-[8px] uppercase tracking-[0.35em]"
                                style={{
                                  border: `1px solid rgba(212,175,55,0.6)`,
                                  background: "rgba(212,175,55,0.12)",
                                  color: "#D4AF37",
                                }}
                              >
                                Open
                              </span>
                            ) : c.closed ? (
                              <span
                                className="rounded-sm px-2 py-0.5 font-display text-[8px] uppercase tracking-[0.35em]"
                                style={{
                                  border: `1px solid rgba(197,198,199,0.4)`,
                                  background: "rgba(197,198,199,0.08)",
                                  color: "rgba(197,198,199,0.75)",
                                }}
                              >
                                Closed
                              </span>
                            ) : (
                              <span
                                className="rounded-sm px-2 py-0.5 font-display text-[8px] uppercase tracking-[0.35em]"
                                style={{
                                  border: `1px solid ${theme.accent}50`,
                                  background: `${theme.accent}12`,
                                  color: theme.accent,
                                }}
                              >
                                Soon
                              </span>
                            )}
                          </div>

                          {/* Thin gold line separator */}
                          <div
                            className="h-px w-full"
                            style={{
                              background: `linear-gradient(to right, ${theme.accent}60, transparent)`,
                            }}
                          />

                          {/* Title */}
                          <div
                            className="font-display font-bold tracking-tight leading-snug"
                            style={{
                              fontSize: "clamp(1.15rem, 2.2vw, 1.35rem)",
                              color: "#e8dcc8",
                              textShadow: `0 0 16px ${theme.glow}`,
                            }}
                          >
                            {c.short}
                          </div>

                          {/* Blurb */}
                          <p
                            className="font-wizard text-[12px] leading-relaxed"
                            style={{ color: "rgba(200,190,170,0.70)" }}
                          >
                            {c.blurb}
                          </p>

                          {/* CTA */}
                          <div
                            className="mt-auto pt-2 inline-flex items-center gap-1.5 font-display text-[10px] tracking-[0.3em] uppercase transition-all duration-300 group-hover:gap-2.5"
                            style={{
                              border: `1px solid ${theme.accent}55`,
                              borderRadius: "2px",
                              padding: "6px 10px",
                              background: `${theme.accent}0d`,
                              color: theme.accent,
                              width: "fit-content",
                            }}
                          >
                            {c.open ? "Apply now" : c.closed ? "Watch timeline" : "Read more"}
                            <span className="transition-transform group-hover:translate-x-0.5">
                              →
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Bottom roller */}
                      <ScrollRoller position="bottom" color={theme.border} />
                    </div>
                  </Wrapper>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* sketched divider */}
        <div className="mt-20 flex justify-center">
          <RoughDivider
            width={420}
            height={48}
            color="#D4AF37"
            ornament="✦"
            seed={19}
          />
        </div>

        {/* Full-width Map with mascot orb pinned bottom-right */}
        <div className="relative mt-12 w-full max-w-6xl">
          <RoughStar
            size={28}
            color="#66FCF1"
            seed={23}
            className="absolute -top-8 -left-2 hp-float"
            style={{ animationDuration: "9s" }}
          />
          <RoughStar
            size={22}
            color="#A78BFA"
            seed={29}
            fill
            className="absolute -top-6 right-10 hp-float"
            style={{ animationDuration: "11s", animationDelay: "1s" }}
          />
          <LocationMap />

          <motion.div
            initial={{ opacity: 0, scale: 0.6, rotate: -8 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45, ease: "easeOut", delay: 0.2 }}
            className="absolute -bottom-10 -right-6 sm:-bottom-14 sm:-right-10 z-20"
          >
            <div
              className="relative hp-float h-40 w-40 sm:h-56 sm:w-56"
              style={{ animationDuration: "7s" }}
            >
              <RoughCorners color="#66FCF1" length={20} inset={2} seed={67} />
              <img
                src="/mascot/mascot.webp"
                alt="HexaFalls mascot"
                className="relative h-full w-full object-contain select-none"
                style={{
                  filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.55))",
                }}
                draggable={false}
              />
            </div>
          </motion.div>
        </div>

        {/* Map CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
        >
          <RoughButton
            as="a"
            href="https://www.google.com/maps/place/JIS+UNIVERSITY/@22.6759713,88.3783425,17z/data=!4m6!3m5!1s0x39f89c46c06efd83:0x36a29a26ce825e99!8m2!3d22.6759713!4d88.3783425!16s%2Fm%2F0138jwhb"
            target="_blank"
            rel="noopener noreferrer"
            color="#66FCF1"
            glow="rgba(102,252,241,0.30)"
            shimmer
            seed={17}
            className="px-6 py-3 text-[12px]"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="h-4 w-4"
            >
              <path d="M12 22s7-7.58 7-13a7 7 0 1 0-14 0c0 5.42 7 13 7 13z" />
              <circle cx="12" cy="9" r="2.5" />
            </svg>
            <span>VIEW ON GOOGLE MAPS</span>
            <span className="opacity-70 group-hover:translate-x-0.5 transition">
              ↗
            </span>
          </RoughButton>

          <RoughButton
            as={Link}
            href="/travel"
            color="#D4AF37"
            glow="rgba(212,175,55,0.30)"
            shimmer
            seed={88}
            className="px-6 py-3 text-[12px]"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="h-4 w-4"
            >
              <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
              <line x1="9" y1="3" x2="9" y2="18" />
              <line x1="15" y1="6" x2="15" y2="21" />
            </svg>
            <span>TRAVEL GUIDE</span>
            <span className="opacity-70 group-hover:translate-x-0.5 transition">
              ↗
            </span>
          </RoughButton>
        </motion.div>

        {/* ── Claim your house — teaser that routes to the Sorting at /house ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="mt-28 w-full max-w-3xl"
        >
          <RoughFrame
            seed={131}
            stroke="#D4AF37"
            mistColor="#D4AF37"
            strokeWidth={1.5}
            roughness={1.6}
            bowing={1.2}
            padding={28}
            className="w-full bg-slate-hp/30 backdrop-blur-sm"
            inner="flex flex-col items-center text-center gap-4"
          >
            <span className="font-display text-[11px] uppercase tracking-[0.5em] text-gold-hp/80">
              The Sorting
            </span>
            <h3
              className="font-display font-black tracking-tight text-silver-hp hp-glow"
              style={{ fontSize: "clamp(1.5rem, 4vw, 2.4rem)" }}
            >
              Claim your <span className="text-gold-hp hp-glow-gold">House</span>
            </h3>
            <p className="max-w-md font-wizard text-silver-hp/70 text-sm sm:text-base leading-relaxed">
              The hat is waiting. Answer its questions, let it read your wand-hand,
              and receive the crest you were always meant to carry.
            </p>
            <RoughButton
              as={Link}
              href="/house"
              color="#D4AF37"
              glow="rgba(212,175,55,0.30)"
              shimmer
              seed={133}
              className="mt-1 px-9 sm:px-12 py-4 text-[13px] sm:text-[14px] tracking-[0.4em]"
            >
              ENTER THE SORTING <span>↗</span>
            </RoughButton>
          </RoughFrame>
        </motion.div>

         <div aria-hidden="true" className="absolute inset-0 -z-10 hp-scrim pointer-events-none opacity-60" />
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col items-center gap-3 text-center">
          <div className="flex items-center gap-3">
            <RoughDivider width={48} height={20} color="#D4AF37" seed={7} />
            <span className="font-display text-[11px] uppercase tracking-[0.5em] text-gold-hp/90">
              A glimpse of the night
            </span>
            <RoughDivider width={48} height={20} color="#D4AF37" seed={9} />
          </div>
          <h2 className="font-display font-black tracking-tight text-silver-hp text-3xl sm:text-4xl hp-glow">
            Four arenas. One festival.
          </h2>
          <p className="max-w-xl font-wizard italic text-silver-hp/60 text-sm">
            A quick look at what awaits — dive into any event for the full brief, rules and prizes.
          </p>
        </div>

        {/* At-a-glance summary band — shorthand when / where / scope */}
        <div className="mx-auto mb-8 max-w-3xl">
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-cyan-hp/20 bg-cyan-hp/10 sm:grid-cols-4">
            {[
              { k: "When", v: "Jul 24–26, 2026" },
              { k: "Where", v: "JIS University · Kolkata" },
              { k: "Format", v: "58-hr hackathon + 4 arenas" },
              { k: "Entry", v: "₹100/member · CP & school-exhibition free" },
            ].map((f) => (
              <div key={f.k} className="bg-midnight/80 px-4 py-3 text-center sm:text-left">
                <div className="font-display text-[9px] uppercase tracking-[0.35em] text-cyan-hp/70">
                  {f.k}
                </div>
                <div className="mt-1 font-display text-[12px] text-silver-hp leading-snug">
                  {f.v}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-center font-wizard text-silver-hp/65 text-sm leading-relaxed">
            HexaFalls is JIS University&apos;s wizarding techfest — three days of building,
            competing and celebrating across a flagship hackathon, hardware, gaming and
            competitive programming.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {EVENTS.map((e) => {
            const accent = e.name.replace(/^The\s+/i, "");
            return (
              <Link
                key={e.slug}
                href={`/events/${e.slug}`}
                className="group flex flex-col gap-3 rounded-sm border bg-slate-hp/30 p-5 transition hover:bg-slate-hp/50"
                style={{ borderColor: `${e.color}33` }}
              >
                <span className="text-xl" style={{ color: e.color }} aria-hidden="true">
                  {e.rune}
                </span>
                <h3 className="font-display tracking-[0.15em] uppercase text-sm" style={{ color: e.color }}>
                  {accent}
                </h3>
                <p className="font-wizard text-silver-hp/65 text-sm leading-relaxed">
                  {SUMMARY[e.slug] ?? e.blurb}
                </p>
                <span className="mt-auto pt-2 font-display text-[10px] uppercase tracking-[0.35em] text-silver-hp/55 group-hover:text-silver-hp transition">
                  Explore →
                </span>
              </Link>
            );
          })}
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <RoughButton
            as="link"
            href="/events"
            color="#D4AF37"
            glow="rgba(212,175,55,0.35)"
            fill={false}
            shimmer
            seed={51}
            className="px-9 sm:px-11 py-3.5 leading-none text-[12px] sm:text-[13px] tracking-[0.35em]"
          >
            EXPLORE ALL EVENTS ↗
          </RoughButton>
          <RoughButton
            as="link"
            href="/timeline"
            color="#C5C6C7"
            fill={false}
            seed={53}
            className="px-8 py-3 leading-none text-[11px] tracking-[0.3em]"
          >
            SEE THE TIMELINE
          </RoughButton>
        </div>
      </div>
      </section>
    </>
  );
}
