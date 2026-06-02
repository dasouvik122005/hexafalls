"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import Link from "next/link";
import Sparkles from "./Sparkles";
import LocationMap from "./LocationMap";
import RoughButton from "./RoughButton";
import RoughDivider from "./RoughDivider";
import RoughStar from "./RoughStar";
import RoughCorners from "./RoughCorners";
import RoughTape from "./RoughTape";
import { CALLS } from "@/lib/routes";
import MysticalTicker from "./MysticalTicker";

// ── Scroll card accent colours keyed to each call ──────────────────────────
// Gradients lightened (~+40% L on each stop) so cards stand out against the
// blurred parchment scrim behind them. Borders + glows raised in opacity too.
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
        "ᚠ",
        "ᚢ",
        "ᚦ",
        "ᚨ",
        "ᚱ",
        "ᚲ",
        "ᚷ",
        "ᚹ",
        "ᚺ",
        "ᚾ",
        "ᛁ",
        "ᛃ",
        "ᛇ",
        "ᛈ",
        "ᛉ",
        "ᛊ",
        "ᛏ",
        "ᛒ",
        "ᛖ",
        "ᛗ",
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
  const subRef = useRef(null);
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
      if (reduce) {
        gsap.set([".hp-letter", subRef.current, stripRef.current], {
          opacity: 1,
          y: 0,
        });
        return;
      }
      gsap.set(".hp-letter", { opacity: 0, y: 28, rotateX: -60 });
      gsap.to(".hp-letter", {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 0.4,
        ease: "power3.out",
        stagger: { each: 0.045, from: "start" },
        delay: 0.2,
      });
      gsap.from(subRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.45,
        delay: 0.25,
        ease: "power2.out",
      });
      gsap.from(stripRef.current, {
        opacity: 0,
        y: 18,
        duration: 0.4,
        delay: 0.4,
        ease: "power2.out",
      });
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

  const splitLetters = (text) =>
    [...text].map((ch, i) => (
      <span
        key={i}
        className="hp-letter inline-block"
        style={{ whiteSpace: ch === " " ? "pre" : "normal" }}
      >
        {ch}
      </span>
    ));

  return (
    <>
      <section
        ref={sectionRef}
        className="relative isolate overflow-hidden h-screen flex flex-col items-center justify-start pt-32 pb-24 px-6"
      >
        {/* ── Cinematic Background Video ──
            - Cloudinary transforms: f_auto (h264/webm/av1 by browser),
              q_auto (perceptual quality), w_1920 (cap width — most users
              don't need 4K behind a darkened scrim).
            - Poster: first-frame JPG from the same asset → instant first
              paint while the video downloads.
            - preload="metadata" lets the browser fetch the manifest only,
              not the bytes, until the page is interactive.
            - aria-hidden + tabIndex=-1: it's pure decoration. */}
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
              "radial-gradient(circle at center, rgba(102,252,241,0.22) 0%, rgba(102,252,241,0.10) 18%, rgba(212,175,55,0.05) 38%, transparent 68%)",
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
        <motion.div
          style={{ y: yMid }}
          className="absolute inset-0 -z-10 opacity-60"
        >
          <Sparkles count={16} />
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

        <div className="absolute top-24 left-1/2 -translate-x-1/2 opacity-60 pointer-events-none">
          <RoughDivider width={140} height={20} color="#C5C6C7" seed={97} />
        </div>

        {/* partner logos */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-8 flex flex-wrap items-center justify-center gap-5 sm:gap-8"
          aria-label="Presented by"
        >
          {[
            { id: "gdg", label: "", logo: "/logos/gdg_jisu.png" },
            { id: "jisu", label: "", logo: "/logos/jisu.png" },
            { id: "cse", label: "", logo: "/logos/cse_jisu.png" },
          ].map((l, i, arr) => (
            <div key={l.id} className="flex items-center gap-3 group">
              <div
                title={l.id.toUpperCase()}
                className="relative h-10 w-10 sm:h-12 sm:w-12 shrink-0 overflow-hidden rounded-md border border-silver-hp/25 bg-slate-hp/50 backdrop-blur flex items-center justify-center group-hover:border-cyan-hp/60 transition"
              >
                <img
                  src={l.logo}
                  alt={l.id.toUpperCase()}
                  className="block h-full w-full object-contain p-1.5 transition duration-300"
                  style={{
                    filter:
                      "brightness(1.05) contrast(1.05) saturate(0.85) drop-shadow(0 0 6px rgba(102,252,241,0.18))",
                  }}
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-cyan-hp/0 group-hover:bg-cyan-hp/10 transition mix-blend-screen"
                />
              </div>
              <span className="text-[11px] sm:text-xs uppercase tracking-[0.3em] text-silver-hp/70 group-hover:text-silver-hp transition font-display">
                {l.label}
              </span>
              {i < arr.length - 1 && (
                <span className="text-silver-hp/20">·</span>
              )}
            </div>
          ))}
        </motion.div>

        {/* tagline strip */}
        <motion.div
          ref={stripRef}
          className="mb-6 flex items-center gap-3 text-[11px] sm:text-xs uppercase tracking-[0.5em] text-cyan-hp/70 font-display"
        >
          <RoughDivider width={48} height={20} color="#66FCF1" seed={3} />
          A Wizarding Hackathon
          <RoughDivider width={48} height={20} color="#66FCF1" seed={5} />
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
                filter: "blur(40px)",
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

          <p
            ref={subRef}
            className="mt-8 max-w-2xl mx-auto text-base sm:text-lg font-wizard text-silver-hp/80"
          >
            Owls have been dispatched. Robes pressed, wands tuned. A 58-hour
            gathering of code, chaos and conjuring at the edge of the magical
            and the mundane.
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
            href="/events/hackathon"
            color="#D4AF37"
            glow="rgba(212,175,55,0.30)"
            shimmer
            seed={7}
            className="px-8 py-3 text-[12px]"
          >
            REGISTER NOW <span>↗</span>
          </RoughButton>
          <RoughButton
            as={Link}
            href="/about"
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
            THE PROPHECY
          </RoughButton>
        </motion.div>
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
                  "0 0 30px rgba(212,175,55,0.5), 0 0 60px rgba(212,175,55,0.25), 0 2px 4px rgba(0,0,0,0.8)",
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

          {/* ── Lede — short writeup explaining the scrolls ── */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mx-auto mb-10 max-w-2xl text-center font-wizard text-silver-hp/70 text-sm sm:text-base leading-relaxed"
          >
            Four scrolls leave the keep on owl-wing — one for each order of
            the night. Sign the one that finds your hand, and your name joins
            the procession of HexaFalls.
          </motion.p>

          {/* ── Scroll Cards Grid ──
              Each card is tilted slightly off-axis ("scattered on a desk"),
              straightens + lifts on hover. The 5-degree rotation pattern
              alternates so the row reads as a fan, not a column. */}
          {/* Scroll cards — tilt/scale only on hover-capable devices (desktop)
              so touchscreens skip the transform compositing work. */}
          <div className="grid gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4 pt-2 pb-4">
            {CALLS.map((c, i) => {
              const theme = SCROLL_THEMES[i] ?? SCROLL_THEMES[3];
              const tiltDeg = [-2, 1.5, -1.5, 2][i % 4];
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
                  className="hover:transform-[rotate(0deg)_translateY(-4px)] transition-transform duration-300"
                  style={{ transformOrigin: "center center", willChange: "transform" }}
                >
                  <Link href={c.href} className="group block h-full">
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
                            {c.open ? "Apply now" : "Read more"}
                            <span className="transition-transform group-hover:translate-x-0.5">
                              →
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Bottom roller */}
                      <ScrollRoller position="bottom" color={theme.border} />
                    </div>
                  </Link>
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
                  filter:
                    "drop-shadow(0 0 18px rgba(102,252,241,0.45)) drop-shadow(0 8px 24px rgba(0,0,0,0.55)) drop-shadow(0 0 36px rgba(212,175,55,0.18))",
                }}
                draggable={false}
              />
            </div>
          </motion.div>
        </div>

        {/* View on Google Maps */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="mt-12 flex justify-center"
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
        </motion.div>

        {/* footnote */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mt-24 flex flex-col items-center gap-2 text-center"
        >
          <span className="inline-flex items-center gap-3 font-display text-[11px] uppercase tracking-[0.5em] text-cyan-hp/70">
            <RoughDivider width={48} height={20} color="#66FCF1" seed={3} />
            more scrolls unfurling soon
            <RoughDivider width={48} height={20} color="#66FCF1" seed={5} />
          </span>
          <span className="font-wizard text-[12px] italic text-silver-hp/45">
            tracks · prizes · sponsors · the keeper&apos;s lore — revealing in
            due time
          </span>
        </motion.div>
      </section>
    </>
  );
}
