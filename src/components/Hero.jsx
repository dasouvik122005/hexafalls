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
import MysticalTicker from "./MysticalTicker";
import PartnerMarquee from "./PartnerMarquee";

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
      if (reduce) {
        gsap.set([".hp-letter", stripRef.current], {
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

          <p className="mx-auto mt-6 max-w-2xl text-center font-wizard text-silver-hp/75 text-sm sm:text-base leading-relaxed">
            A 58-hour wizarding hackathon at JIS University, Kolkata — build,
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
              <path d="M20.317 4.369A19.79 19.79 0 0 0 16.21 3.05a.07.07 0 0 0-.073.035c-.21.375-.444.864-.608 1.249a18.27 18.27 0 0 0-5.487 0 12.55 12.55 0 0 0-.617-1.25.072.072 0 0 0-.073-.034 19.74 19.74 0 0 0-4.107 1.32.066.066 0 0 0-.03.027C2.05 8.247 1.39 12.005 1.7 15.73a.082.082 0 0 0 .031.056 19.91 19.91 0 0 0 5.993 3.027.073.073 0 0 0 .079-.026 14.2 14.2 0 0 0 1.227-1.994.07.07 0 0 0-.038-.098 13.1 13.1 0 0 1-1.872-.892.07.07 0 0 1-.007-.117c.126-.094.252-.192.371-.291a.07.07 0 0 1 .074-.01c3.927 1.793 8.18 1.793 12.062 0a.07.07 0 0 1 .074.009c.12.099.246.198.372.292a.07.07 0 0 1-.006.117 12.3 12.3 0 0 1-1.873.892.07.07 0 0 0-.038.099 15.92 15.92 0 0 0 1.226 1.993.07.07 0 0 0 .079.027 19.84 19.84 0 0 0 6.002-3.027.07.07 0 0 0 .03-.055c.5-4.318-.838-8.043-3.549-11.336a.056.056 0 0 0-.028-.027zM8.02 13.46c-1.182 0-2.156-1.085-2.156-2.418 0-1.333.955-2.418 2.156-2.418 1.21 0 2.176 1.094 2.156 2.418 0 1.333-.955 2.418-2.156 2.418zm7.974 0c-1.182 0-2.157-1.085-2.157-2.418 0-1.333.955-2.418 2.157-2.418 1.21 0 2.175 1.094 2.156 2.418 0 1.333-.946 2.418-2.156 2.418z"/>
            </svg>
            JOIN OUR DISCORD <span>↗</span>
          </RoughButton>
        </motion.div>

        {/* Sepia partner marquee — renders only when partners are listed */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.7 }}
          className="mt-12 flex w-full flex-col items-center gap-3"
        >
          <PartnerMarquee />
        </motion.div>
      </section>

      <div className="relative w-full overflow-hidden">
        <MysticalTicker />
      </div>
    </>
  );
}
