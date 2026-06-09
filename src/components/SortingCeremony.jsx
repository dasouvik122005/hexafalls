"use client";

import { useState } from "react";
import RoughFrame from "./RoughFrame";
import RoughButton from "./RoughButton";
import RoughDivider from "./RoughDivider";

// ─── House Data ─────────────────────────────────────────────────────────────

export const HOUSES = [
  {
    key: "g",
    name: "Gryffindor",
    trait: "Daring, nerve, and chivalry — courage defines your path.",
    flavorColor: "#8B0000",
    accentColor: "#ffa091",
    activeBorder: "#960c05",
    activeBg: "rgba(150,12,5,0.15)",
    activeGlow: "0 0 18px rgba(150,12,5,0.35), inset 0 0 20px rgba(150,12,5,0.06)",
    labelColor: "#ffa091",
    nameColor: "#8b2020",
    image: "/house_card/hexafallsHouse1.png",
    icon: (
      <svg viewBox="0 0 38 38" fill="none" width={36} height={36} aria-hidden="true">
        <path d="M19 4C19 4 9 11 9 20C9 27 14 32 19 35C24 32 29 27 29 20C29 11 19 4 19 4Z" stroke="#ffa091" strokeWidth="1.4" />
        <path d="M16 17L19 14L22 17L21 24H17L16 17Z" stroke="#ffa091" strokeWidth="1.2" />
        <circle cx="19" cy="17" r="1.5" fill="#ffa091" opacity="0.7" />
        <path d="M13 21C13 21 11 22.5 12 25C13 27 15 27.5 17 27" stroke="#ffa091" strokeWidth="1.1" strokeLinecap="round" />
        <path d="M25 21C25 21 27 22.5 26 25C25 27 23 27.5 21 27" stroke="#ffa091" strokeWidth="1.1" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: "s",
    name: "Slytherin",
    trait: "Cunning, resourceful, ambitious — you will stop at nothing.",
    flavorColor: "#1a3d3d",
    accentColor: "#9ec0bf",
    activeBorder: "#4a8a8a",
    activeBg: "rgba(47,79,79,0.22)",
    activeGlow: "0 0 18px rgba(74,138,138,0.3), inset 0 0 20px rgba(47,79,79,0.08)",
    labelColor: "#9ec0bf",
    nameColor: "#2a6b6b",
    image: "/house_card/hexafallsHouse2.png",
    icon: (
      <svg viewBox="0 0 38 38" fill="none" width={36} height={36} aria-hidden="true">
        <path d="M19 7C19 7 23 10 23 14C23 17 21 18.5 19 18.5" stroke="#9ec0bf" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M19 18.5C17 18.5 14.5 19.5 13.5 22C12.5 24.5 14 27 16.5 28C18 28.5 18.5 29 18.5 30.5C18.5 32 16.5 32.5 15 31.5" stroke="#9ec0bf" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M19 7C19 7 15 10 15 14C15 17 17 18.5 19 18.5" stroke="#9ec0bf" strokeWidth="1.4" strokeLinecap="round" />
        <ellipse cx="19" cy="6.5" rx="2.5" ry="2" stroke="#9ec0bf" strokeWidth="1.2" />
        <path d="M17.5 5.5L16 4M20.5 5.5L22 4" stroke="#9ec0bf" strokeWidth="1.1" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: "r",
    name: "Ravenclaw",
    trait: "Wit, wisdom, and learning — knowledge is your greatest power.",
    flavorColor: "#0d3566",
    accentColor: "#85b7eb",
    activeBorder: "#185fa5",
    activeBg: "rgba(24,95,165,0.18)",
    activeGlow: "0 0 18px rgba(24,95,165,0.3), inset 0 0 20px rgba(24,95,165,0.07)",
    labelColor: "#85b7eb",
    nameColor: "#2a5a8b",
    image: "/house_card/hexafallsHouse3.png",
    icon: (
      <svg viewBox="0 0 38 38" fill="none" width={36} height={36} aria-hidden="true">
        <path d="M19 29L8 17L19 6L30 17L19 29Z" stroke="#85b7eb" strokeWidth="1.4" />
        <path d="M19 6V29M8 17H30" stroke="#85b7eb" strokeWidth="0.8" opacity="0.4" />
        <path d="M12 11L19 6L26 11" stroke="#85b7eb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="19" cy="17" r="3" stroke="#85b7eb" strokeWidth="1.2" />
        <circle cx="19" cy="17" r="1" fill="#85b7eb" opacity="0.6" />
      </svg>
    ),
  },
  {
    key: "h",
    name: "Hufflepuff",
    trait: "Patience, loyalty, and fair play — your kindness is your strength.",
    flavorColor: "#6b4e00",
    accentColor: "#fbbc00",
    activeBorder: "#aa8a0a",
    activeBg: "rgba(170,138,10,0.18)",
    activeGlow: "0 0 18px rgba(170,138,10,0.35), inset 0 0 20px rgba(170,138,10,0.07)",
    labelColor: "#fbbc00",
    nameColor: "#7a5a10",
    image: "/house_card/hexafallsHouse4.png",
    icon: (
      <svg viewBox="0 0 38 38" fill="none" width={36} height={36} aria-hidden="true">
        <rect x="11" y="11" width="16" height="16" rx="8" stroke="#fbbc00" strokeWidth="1.4" />
        <path d="M19 7V11M19 27V31M7 19H11M27 19H31" stroke="#fbbc00" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M13 13L10 10M25 13L28 10M25 25L28 28M13 25L10 28" stroke="#fbbc00" strokeWidth="1.1" strokeLinecap="round" opacity="0.5" />
        <circle cx="19" cy="19" r="3.5" stroke="#fbbc00" strokeWidth="1.2" />
        <circle cx="19" cy="19" r="1.2" fill="#fbbc00" opacity="0.6" />
      </svg>
    ),
  },
];

// Limit to max 2 words
function limitWords(name) {
  const words = (name || "").trim().split(/\s+/).filter(Boolean).slice(0, 2);
  return words.join(" ");
}

// Vertical position of the name on the crest, as a fraction of card height.
// SINGLE source of truth — drives BOTH the on-screen card (ScrollCard) and the
// downloaded PNG (downloadScroll). Nudge this one value to move the name.
const NAME_Y_PCT = 0.725453;

// Dynamic font size that shrinks to fit the box
function getNameFontSize(text) {
  const len = text ? text.trim().length : 0;
  if (len <= 8) return 32;
  if (len <= 12) return 26;
  if (len <= 16) return 22;
  if (len <= 20) return 18;
  return 15; // max fit
}

// ─── Filigree corners ────────────────────────────────────────────────────────

function FiligreeCorners() {
  const bar = { position: "absolute", background: "#D4AF37", opacity: 0.4 };
  const corners = [
    { top: 0, left: 0 },
    { top: 0, right: 0 },
    { bottom: 0, left: 0 },
    { bottom: 0, right: 0 },
  ];
  return (
    <>
      {corners.map((pos, i) => (
        <span key={i} style={{ position: "absolute", ...pos, width: 12, height: 12 }}>
          <span style={{ ...bar, height: 1, width: 10, ...pos }} />
          <span style={{ ...bar, width: 1, height: 10, ...pos }} />
        </span>
      ))}
    </>
  );
}

// ─── Scroll Card ─────────────────────────────────────────────────────────────

export function ScrollCard({ name, house }) {
  const displayName = limitWords(name) || "Your Name";
  const flavorColor = house ? house.flavorColor : HOUSES[0].flavorColor;
  // Default to Gryffindor card when no house selected
  const customImage = house?.image ?? HOUSES[0].image;
  const activeHouse = house ?? HOUSES[0];
  const nameFontSize = getNameFontSize(displayName);
  // Bold white-ochre for every crest — reads clearly over the parchment.
  const nameColor = "#F3E3AE";

  return (
    <div
      style={{
        position: "relative",
        background: "#c8a96e",
        borderRadius: 6,
        overflow: "hidden",
        // Match the card art's aspect (≈1024×1531) so the FULL crest shows.
        aspectRatio: "1024 / 1531",
        display: "flex",
        flexDirection: "column",
        border: "1px solid rgba(180,140,80,0.5)",
      }}
    >
      {/* House image background (falls back to parchment if no house selected) */}
      {customImage && (
        <img
          src={customImage}
          alt={`${activeHouse.name} scroll`}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 1, pointerEvents: "none" }}
        />
      )}
      {/* Pentagram watermark */}
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.055, pointerEvents: "none", zIndex: 2 }}>
        <svg viewBox="0 0 200 200" width={200} height={200} fill="none">
          <circle cx="100" cy="100" r="80" stroke="#402d00" strokeWidth="0.8" />
          <circle cx="100" cy="100" r="55" stroke="#402d00" strokeWidth="0.5" />
          <path d="M100 20L116 66H164L128 93L142 139L100 112L58 139L72 93L36 66H84Z" stroke="#402d00" strokeWidth="0.6" />
          <circle cx="100" cy="100" r="15" stroke="#402d00" strokeWidth="0.5" />
        </svg>
      </div>
      {/* Inner border */}
      <div style={{ position: "absolute", top: 16, left: 16, right: 16, bottom: 16, border: "0.5px solid rgba(64,45,0,0.2)", borderRadius: 2, pointerEvents: "none", zIndex: 2 }} />

      {/* Content */}
      <div
        style={{
          position: "relative", zIndex: 3,
          display: "flex", flexDirection: "column", alignItems: "center",
          textAlign: "center", flex: 1, justifyContent: "space-between",
          padding: "32px 24px 26px",
        }}
      >
        {/* Top block */}
        <div style={{ width: "100%" }}>
          {!customImage ? (
            <>
              <p style={{ fontFamily: "var(--font-display), serif", fontSize: 8, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(64,45,0,0.58)", marginBottom: 10 }}>
                Wizarding Identity
              </p>
              {/* Crest box */}
              <div
                style={{
                  width: 68, height: 68,
                  border: "1px solid rgba(64,45,0,0.22)",
                  background: "rgba(100,65,15,0.1)",
                  borderRadius: 4,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 14px",
                }}
              >
                {activeHouse ? (
                  <div style={{ opacity: 0.72 }}>{activeHouse.icon}</div>
                ) : (
                  <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="rgba(64,45,0,0.28)" strokeWidth="1.2">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <path d="M9 9h6M9 13h4" />
                  </svg>
                )}
              </div>
              {activeHouse && (
                <div
                  style={{
                    display: "inline-block",
                    background: "rgba(64,45,0,0.09)",
                    border: "0.5px solid rgba(64,45,0,0.18)",
                    borderRadius: 2,
                    padding: "3px 10px",
                    marginBottom: 10,
                  }}
                >
                  <span style={{ fontFamily: "var(--font-display), serif", fontSize: 7, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(64,45,0,0.52)" }}>
                    {activeHouse.name}
                  </span>
                </div>
              )}
              <h2
                style={{
                  fontFamily: "var(--font-wizard), serif",
                  fontSize: nameFontSize,
                  fontWeight: 700,
                  color: nameColor, lineHeight: 1.2,
                  margin: 0, minHeight: 32,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "100%",
                  textShadow: "0 1px 2px rgba(255,255,255,0.15), 0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                {displayName}
              </h2>
            </>
          ) : (
            <h2
              style={{
                position: "absolute",
                left: "50%",
                top: `${NAME_Y_PCT * 100}%`,
                transform: "translate(-50%, -50%)",
                zIndex: 3,
                fontFamily: "var(--font-wizard), serif",
                fontSize: nameFontSize,
                fontWeight: 800,
                color: nameColor, lineHeight: 1.2,
                margin: 0,
                pointerEvents: "none",
                whiteSpace: "nowrap",
                maxWidth: "82%",
                overflow: "hidden",
                textOverflow: "ellipsis",
                textAlign: "center",
                letterSpacing: "0.01em",
                textShadow: "0 1px 2px rgba(0,0,0,0.5), 0 2px 9px rgba(0,0,0,0.45), 0 0 18px rgba(0,0,0,0.3)",
              }}
            >
              {displayName}
            </h2>
          )}
        </div>

        {/* Footer row */}
        <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <p style={{ fontFamily: "var(--font-display), serif", fontSize: 7, letterSpacing: "0.11em", color: "rgba(64,45,0,0.36)", margin: 0 }}>
            Sorting Ceremony 2024
          </p>
          <svg width={42} height={42} viewBox="0 0 30 30" fill="none" opacity="0.26">
            <circle cx="15" cy="15" r="11" stroke={flavorColor} strokeWidth="0.8" fill={flavorColor} fillOpacity="0.06" />
            <path d="M15 5l2 6h6l-5 3.6 1.8 6L15 17l-4.8 3.6L12 14.6 7 11h6Z" stroke={flavorColor} strokeWidth="0.7" />
            <circle cx="15" cy="15" r="3" stroke={flavorColor} strokeWidth="0.5" />
          </svg>
        </div>
      </div>
    </div>
  );
}

// ─── Download helper ─────────────────────────────────────────────────────────

export async function downloadScroll(name, house) {
  const canvas = document.createElement("canvas");
  const W = 400, H = 560;
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const loadImage = (src) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.crossOrigin = "anonymous";
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = src;
    });

  const safeName = limitWords(name) || "Your Name";
  const nameFontSize = getNameFontSize(safeName);
  const customImage = house?.image ?? null;
  const nameColor = "#F3E3AE"; // bold white-ochre

  // Background image.
  if (customImage) {
    try {
      const image = await loadImage(customImage);
      ctx.drawImage(image, 0, 0, W, H);
    } catch {
      const bg = ctx.createLinearGradient(0, 0, W, H);
      bg.addColorStop(0, "#c8a96e"); bg.addColorStop(0.45, "#b8906a"); bg.addColorStop(1, "#c0956e");
      ctx.fillStyle = bg;
      ctx.roundRect(0, 0, W, H, 8); ctx.fill();
    }
  } else {
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, "#c8a96e"); bg.addColorStop(0.45, "#b8906a"); bg.addColorStop(1, "#c0956e");
    ctx.fillStyle = bg;
    ctx.roundRect(0, 0, W, H, 8); ctx.fill();
  }

  // Draw name text (single line), vertically centred in the crest's name plate.
  const nameY = Math.round(H * NAME_Y_PCT);
  ctx.save();
  ctx.fillStyle = nameColor;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `800 ${nameFontSize}px "MedievalSharp", "EB Garamond", Georgia, serif`;

  // Dark depth shadow for legibility of the white-ochre over parchment
  ctx.shadowColor = "rgba(0,0,0,0.5)";
  ctx.shadowBlur = 6;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 2;
  ctx.fillText(safeName, W / 2, nameY);
  // second pass to deepen
  ctx.shadowColor = "rgba(0,0,0,0.35)";
  ctx.shadowBlur = 3;
  ctx.fillText(safeName, W / 2, nameY);
  ctx.restore();

  const link = document.createElement("a");
  link.download = `${safeName.replace(/\s+/g, "_")}_hogwarts_scroll.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

// ─── Magical Particles (Harry Potter themed) ─────────────────────────────────

export function MagicalParticles() {
  // Deterministic positions — SSR safe, no hydration mismatch
  const seeded = (i) => {
    const s = Math.sin(i * 9301 + 49297) * 233280;
    return s - Math.floor(s);
  };

  // Big glowing orbs — golden snitches, cyan wisps, violet mist
  const orbs = Array.from({ length: 14 }, (_, i) => ({
    id: i,
    left: seeded(i + 1) * 90 + 5,
    top: seeded(i + 2) * 85 + 5,
    size: 40 + seeded(i + 3) * 80,
    delay: seeded(i + 4) * 10,
    dur: 12 + seeded(i + 5) * 14,
    color:
      seeded(i + 6) > 0.7
        ? "rgba(212,175,55,0.18)"   // gold snitch
        : seeded(i + 6) > 0.4
        ? "rgba(102,252,241,0.14)"  // cyan wisp
        : "rgba(167,139,250,0.16)", // violet mist
    blur: 30 + seeded(i + 7) * 40,
  }));

  // Small bright sparks — like wand sparks
  const sparks = Array.from({ length: 22 }, (_, i) => ({
    id: i + 100,
    left: seeded(i + 10) * 100,
    top: seeded(i + 11) * 100,
    size: 2 + seeded(i + 12) * 3,
    delay: seeded(i + 13) * 8,
    dur: 3 + seeded(i + 14) * 5,
    gold: seeded(i + 15) > 0.6,
  }));

  return (
    <>
      {/* Big floating orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" style={{ zIndex: 1 }}>
        {orbs.map((o) => (
          <div
            key={o.id}
            className="sc-orb"
            style={{
              position: "absolute",
              left: `${o.left}%`,
              top: `${o.top}%`,
              width: `${o.size}px`,
              height: `${o.size}px`,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${o.color}, transparent 70%)`,
              filter: `blur(${o.blur}px)`,
              animationDuration: `${o.dur}s`,
              animationDelay: `${o.delay}s`,
            }}
          />
        ))}
      </div>
      {/* Small wand sparks */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" style={{ zIndex: 2 }}>
        {sparks.map((s) => (
          <span
            key={s.id}
            className="sc-spark"
            style={{
              position: "absolute",
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              borderRadius: "50%",
              backgroundColor: s.gold ? "#D4AF37" : "#66FCF1",
              boxShadow: s.gold
                ? "0 0 10px rgba(212,175,55,.8), 0 0 20px rgba(212,175,55,.4)"
                : "0 0 10px rgba(102,252,241,.8), 0 0 20px rgba(102,252,241,.4)",
              animationDuration: `${s.dur}s`,
              animationDelay: `${s.delay}s`,
            }}
          />
        ))}
      </div>
    </>
  );
}

// ─── Flying Owls & Snitches — Harry Potter themed flying creatures ──────────────
// Simple SVG silhouettes animated with CSS keyframes
// Deterministic positions for SSR safety
function FlyingCreatures() {
  const seeded = (i) => {
    const s = Math.sin(i * 9301 + 49297) * 233280;
    return s - Math.floor(s);
  };

  // 5 owls flying across the section at different speeds/positions
  const owls = Array.from({ length: 5 }, (_, i) => ({
    top: `${8 + seeded(i) * 80}%`,
    size: 18 + seeded(i + 1) * 14,
    duration: 18 + seeded(i + 2) * 16,
    delay: -(seeded(i + 3) * 20),
    opacity: 0.06 + seeded(i + 4) * 0.08,
    direction: seeded(i + 5) > 0.5 ? 1 : -1,
    color: seeded(i + 6) > 0.6 ? "#D4AF37" : seeded(i + 6) > 0.3 ? "#66FCF1" : "#A78BFA",
  }));

  // 4 golden snitches zipping around
  const snitches = Array.from({ length: 4 }, (_, i) => ({
    top: `${15 + seeded(i + 20) * 65}%`,
    size: 8 + seeded(i + 21) * 6,
    duration: 8 + seeded(i + 22) * 10,
    delay: -(seeded(i + 23) * 12),
    opacity: 0.15 + seeded(i + 24) * 0.15,
  }));

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {/* Flying owls */}
      {owls.map((owl, i) => (
        <div
          key={`owl-${i}`}
          className="sc-owl"
          style={{
            position: "absolute",
            top: owl.top,
            left: 0,
            width: owl.size,
            height: owl.size * 0.7,
            opacity: owl.opacity,
            animationDuration: `${owl.duration}s`,
            animationDelay: `${owl.delay}s`,
            animationDirection: owl.direction < 0 ? "reverse" : "normal",
          }}
        >
          <div style={{ transform: owl.direction < 0 ? "scaleX(-1)" : "none" }}>
          <svg viewBox="0 0 60 42" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Owl body */}
            <ellipse cx="30" cy="24" rx="14" ry="12" fill={owl.color} opacity="0.85" />
            {/* Head */}
            <circle cx="30" cy="12" r="9" fill={owl.color} opacity="0.9" />
            {/* Eyes */}
            <circle cx="26" cy="11" r="2.5" fill="#0B0C10" opacity="0.7" />
            <circle cx="34" cy="11" r="2.5" fill="#0B0C10" opacity="0.7" />
            <circle cx="26.5" cy="10.5" r="0.8" fill="#D4AF37" />
            <circle cx="34.5" cy="10.5" r="0.8" fill="#D4AF37" />
            {/* Beak */}
            <path d="M28 14 L30 17 L32 14 Z" fill="#8B6914" opacity="0.8" />
            {/* Ear tufts */}
            <path d="M23 6 L21 2 L25 5" fill={owl.color} opacity="0.8" />
            <path d="M37 6 L39 2 L35 5" fill={owl.color} opacity="0.8" />
            {/* Wings spread */}
            <path
              d="M16 20 C8 14, 2 18, 4 26 C6 30, 12 32, 18 28 Z"
              fill={owl.color}
              opacity="0.7"
              className="sc-owl-wing-l"
            />
            <path
              d="M44 20 C52 14, 58 18, 56 26 C54 30, 48 32, 42 28 Z"
              fill={owl.color}
              opacity="0.7"
              className="sc-owl-wing-r"
            />
            {/* Letter/scroll in talons */}
            <rect x="26" y="34" width="8" height="5" rx="1" fill="#C5C6C7" opacity="0.5" />
          </svg>
          </div>
        </div>
      ))}

      {/* Golden snitches */}
      {snitches.map((s, i) => (
        <div
          key={`snitch-${i}`}
          className="sc-snitch"
          style={{
            position: "absolute",
            top: s.top,
            left: 0,
            width: s.size,
            height: s.size,
            opacity: s.opacity,
            animationDuration: `${s.duration}s`,
            animationDelay: `${s.delay}s`,
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Snitch ball */}
            <circle cx="12" cy="12" r="5" fill="#D4AF37" />
            <circle cx="12" cy="12" r="5" fill="url(#snitchGrad)" />
            {/* Wings */}
            <path
              d="M7 10 C3 6, 1 8, 2 12 C3 15, 6 14, 8 12 Z"
              fill="#D4AF37"
              opacity="0.6"
              className="sc-snitch-wing-l"
            />
            <path
              d="M17 10 C21 6, 23 8, 22 12 C21 15, 18 14, 16 12 Z"
              fill="#D4AF37"
              opacity="0.6"
              className="sc-snitch-wing-r"
            />
            <defs>
              <radialGradient id="snitchGrad" cx="0.3" cy="0.3">
                <stop offset="0%" stopColor="#FDE68A" />
                <stop offset="100%" stopColor="#D4AF37" />
              </radialGradient>
            </defs>
          </svg>
        </div>
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function SortingCeremony() {
  const [selectedHouse, setSelectedHouse] = useState(null);
  const [nameValue, setNameValue] = useState("");
  const [btnGlow, setBtnGlow] = useState(false);
  const [traitVisible, setTraitVisible] = useState(false);
  const canDownload = Boolean(selectedHouse && nameValue.trim());

  function handleSelectHouse(key) {
    const h = HOUSES.find((x) => x.key === key);
    if (!h) return;
    setSelectedHouse((prev) => (prev?.key === key ? null : h));
    setTraitVisible(false);
  }

  function handleCast() {
    setBtnGlow(true);
    setTimeout(() => setBtnGlow(false), 900);
    if (selectedHouse && nameValue.trim()) {
      setTraitVisible(true);
    }
  }

  function handleNameChange(e) {
    let val = e.target.value;
    // Limit to max 2 words (name + title)
    const words = val.trim().split(/\s+/).filter(Boolean);
    if (words.length > 2) {
      val = words.slice(0, 2).join(" ");
    }
    setNameValue(val);
    setTraitVisible(false);
  }

  return (
    <>
      <style>{`
        /* ── Animations ── */
        @keyframes sc-glowPulse {
          0%, 100% { box-shadow: 0 0 20px rgba(212,175,55,0.2); }
          50%       { box-shadow: 0 0 44px rgba(212,175,55,0.55), 0 0 90px rgba(102,252,241,0.18); }
        }
        @keyframes sc-cardReveal {
          from { opacity: 0; transform: scale(0.93) translateY(12px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes sc-traitReveal {
          from { opacity: 0; transform: translateX(-8px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        /* Big floating orbs — slow dreamy drift */
        @keyframes sc-orb-float {
          0%, 100% { opacity: 0.35; transform: translate(0, 0) scale(1); }
          25%      { opacity: 0.6;  transform: translate(12px, -18px) scale(1.08); }
          50%      { opacity: 0.45; transform: translate(-8px, -30px) scale(1.15); }
          75%      { opacity: 0.65; transform: translate(15px, -12px) scale(1.05); }
        }
        .sc-orb {
          animation: sc-orb-float ease-in-out infinite;
          will-change: transform, opacity;
        }
        /* Small wand sparks — quick flicker up */
        @keyframes sc-spark-flicker {
          0%, 100% { opacity: 0; transform: translateY(0) scale(0.6); }
          20%      { opacity: 1; transform: translateY(-8px) scale(1); }
          50%      { opacity: 0.8; transform: translateY(-20px) scale(0.9); }
          80%      { opacity: 0.3; transform: translateY(-35px) scale(0.5); }
        }
        .sc-spark {
          opacity: 0;
          animation: sc-spark-flicker ease-in-out infinite;
          will-change: transform, opacity;
        }
        /* ── Flying owls ── */
        @keyframes sc-owl-fly {
          0%   { transform: translateX(-10vw) translateY(0); }
          25%  { transform: translateX(25vw) translateY(-15px); }
          50%  { transform: translateX(55vw) translateY(8px); }
          75%  { transform: translateX(85vw) translateY(-10px); }
          100% { transform: translateX(115vw) translateY(5px); }
        }
        @keyframes sc-owl-flap {
          0%, 100% { transform: scaleY(1); }
          50%      { transform: scaleY(0.7); }
        }
        .sc-owl {
          animation: sc-owl-fly linear infinite;
          will-change: transform;
        }
        .sc-owl-wing-l { animation: sc-owl-flap 0.4s ease-in-out infinite; transform-origin: right center; }
        .sc-owl-wing-r { animation: sc-owl-flap 0.4s ease-in-out infinite; transform-origin: left center; }

        /* ── Golden snitches ── */
        @keyframes sc-snitch-zip {
          0%   { transform: translateX(-5vw) translateY(0) rotate(0deg); }
          15%  { transform: translateX(15vw) translateY(-25px) rotate(10deg); }
          30%  { transform: translateX(30vw) translateY(12px) rotate(-8deg); }
          50%  { transform: translateX(50vw) translateY(-18px) rotate(5deg); }
          70%  { transform: translateX(70vw) translateY(8px) rotate(-10deg); }
          85%  { transform: translateX(90vw) translateY(-12px) rotate(8deg); }
          100% { transform: translateX(110vw) translateY(0) rotate(0deg); }
        }
        @keyframes sc-snitch-flutter {
          0%, 100% { transform: scaleX(1); }
          50%      { transform: scaleX(0.6); }
        }
        .sc-snitch {
          animation: sc-snitch-zip ease-in-out infinite;
          will-change: transform;
        }
        .sc-snitch-wing-l { animation: sc-snitch-flutter 0.15s ease-in-out infinite; transform-origin: right center; }
        .sc-snitch-wing-r { animation: sc-snitch-flutter 0.15s ease-in-out infinite; transform-origin: left center; }

        @media (prefers-reduced-motion: reduce) {
          .sc-orb, .sc-spark { animation: none !important; opacity: 0.4; }
          .sc-owl, .sc-snitch { animation: none !important; opacity: 0.08; }
          .sc-owl-wing-l, .sc-owl-wing-r, .sc-snitch-wing-l, .sc-snitch-wing-r { animation: none !important; }
        }

        /* ── House button — matches RoughButton aesthetic ── */
        .sc-house-btn {
          background: transparent;
          border: 1px solid rgba(197,198,199,0.18);
          border-radius: 2px;
          padding: 14px 6px 12px;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          flex: 1;
          min-width: 0;
          position: relative;
          overflow: hidden;
          transition: border-color 0.25s, background 0.25s, transform 0.2s, box-shadow 0.3s;
        }
        .sc-house-btn::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(102,252,241,0.06) 0%, transparent 60%);
          opacity: 0;
          transition: opacity 0.3s;
          pointer-events: none;
        }
        .sc-house-btn:hover::before { opacity: 1; }
        .sc-house-btn:hover { transform: translateY(-2px); }
        .sc-house-btn:active { transform: scale(0.97); }
        .sc-house-btn:focus-visible { outline: 2px solid rgba(102,252,241,0.6); outline-offset: 2px; }

        .sc-house-icon { transition: opacity 0.25s, transform 0.3s; }
        .sc-house-btn:hover .sc-house-icon { transform: scale(1.1); }

        .sc-house-label {
          font-family: var(--font-display), serif;
          font-size: 8px; font-weight: 700;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: rgba(197,198,199,0.45);
          transition: color 0.25s, text-shadow 0.3s;
        }

        /* ── Name input — matches RoughButton aesthetic ── */
        .sc-name-input {
          display: block; width: 100%; box-sizing: border-box;
          background: transparent;
          border: 1px solid rgba(212,175,55,0.35);
          border-radius: 2px;
          padding: 14px 18px;
          font-family: var(--font-display), serif;
          font-size: 13px; font-weight: 500;
          letter-spacing: 0.08em;
          color: #D4AF37;
          outline: none;
          transition: border-color 0.25s, box-shadow 0.3s, text-shadow 0.3s;
          text-shadow: 0 0 12px rgba(212,175,55,0.25);
        }
        .sc-name-input::placeholder {
          color: rgba(212,175,55,0.35);
          font-style: italic;
          letter-spacing: 0.05em;
          text-shadow: none;
        }
        .sc-name-input:focus {
          border-color: rgba(102,252,241,0.5) !important;
          box-shadow: 0 0 0 2px rgba(102,252,241,0.08), 0 0 18px rgba(212,175,55,0.15);
          text-shadow: 0 0 14px rgba(212,175,55,0.4);
        }

        /* ── Cast button glow animation (for RoughButton) ── */
        .sc-cast.glow { animation: sc-glowPulse 0.85s ease; }

        /* ── Scroll card reveal ── */
        .sc-scroll-revealed { animation: sc-cardReveal 0.45s ease; }
        .sc-trait-revealed  { animation: sc-traitReveal 0.4s ease; }

        /* ── Step progress ── */
        .sc-step {
          display: flex; align-items: center; gap: 8px;
          font-family: var(--font-display), serif;
          font-size: 10px; font-weight: 600;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: rgba(197,198,199,0.35);
          transition: color 0.3s;
        }
        .sc-step-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: rgba(197,198,199,0.2);
          transition: background 0.3s, box-shadow 0.3s;
        }
        .sc-step.active { color: #D4AF37; }
        .sc-step.active .sc-step-dot {
          background: #D4AF37;
          box-shadow: 0 0 8px rgba(212,175,55,0.6);
        }
        .sc-step.done { color: #66FCF1; }
        .sc-step.done .sc-step-dot {
          background: #66FCF1;
          box-shadow: 0 0 8px rgba(102,252,241,0.5);
        }
        .sc-step-line {
          flex: 1; height: 1px;
          background: rgba(197,198,199,0.12);
          transition: background 0.3s;
        }
        .sc-step-line.done { background: rgba(102,252,241,0.35); }

        /* ── House preview strip ── */
        .sc-house-strip {
          display: flex; justify-content: center; gap: 12px;
          padding: 10px 0 4px;
        }
        .sc-house-chip {
          width: 28px; height: 28px; border-radius: 50%;
          border: 1px solid rgba(197,198,199,0.15);
          display: flex; align-items: center; justify-content: center;
          opacity: 0.3;
          transition: opacity 0.3s, border-color 0.3s, transform 0.3s;
        }
        .sc-house-chip.active {
          opacity: 1;
          transform: scale(1.15);
        }

        /* ── Rune watermark ── */
        .sc-rune-bg {
          position: absolute; inset: 0;
          display: flex; align-items: center; justify-content: center;
          pointer-events: none; opacity: 0.03;
          font-family: serif; font-size: 180px;
          color: #D4AF37;
          user-select: none;
        }

        /* ── Responsive ── */
        .sc-grid {
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 44px;
          align-items: start;
        }
        @media (max-width: 900px) {
          .sc-grid {
            grid-template-columns: 1fr;
            gap: 36px;
          }
          .sc-scroll-col { order: -1; }
          .sc-h1 { font-size: 36px !important; }
        }
        @media (max-width: 600px) {
          .sc-outer { padding: 36px 20px 52px !important; }
          .sc-h1 { font-size: 30px !important; }
          .sc-house-row { gap: 6px !important; }
          .sc-house-btn { padding: 14px 6px 12px !important; }
          .sc-house-label { font-size: 8px !important; letter-spacing: 0.1em !important; }
        }
      `}</style>

      {/* ── Transparent section — blends with Hero midnight bg ── */}
      <div
        className="relative isolate overflow-hidden py-20"
      >
        {/* Magical floating particles */}
        <MagicalParticles />

        {/* Flying owls and golden snitches */}
        <FlyingCreatures />

        {/* ── Main content ── */}
        <div
          className="sc-outer"
          style={{ position: "relative", zIndex: 10, padding: "52px 48px 72px", maxWidth: 1200, margin: "0 auto" }}
        >
          <div className="sc-grid">

            {/* ── Left column ── */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <RoughDivider width={48} height={20} color="#66FCF1" seed={11} />
                <p style={{ fontFamily: "var(--font-display), serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.13em", textTransform: "uppercase", color: "rgba(102,252,241,0.6)", margin: 0 }}>
                  The Sorting Hat awaits
                </p>
                <RoughDivider width={48} height={20} color="#66FCF1" seed={13} />
              </div>
              <h1
                className="sc-h1 hp-glow"
                style={{ fontFamily: "var(--font-display), serif", fontSize: 48, fontWeight: 700, lineHeight: 1.08, letterSpacing: "-0.02em", color: "#C5C6C7", marginBottom: 10 }}
              >
                Claim your<br />
                <em style={{ color: "#D4AF37", fontFamily: "var(--font-wizard), serif", fontStyle: "normal" }}>House &amp; Scroll</em>
              </h1>
              <p style={{ fontFamily: "var(--font-wizard), serif", fontSize: 19, fontStyle: "italic", color: "rgba(197,198,199,0.45)", marginBottom: 36 }}>
                Discover your house, claim your scroll.
              </p>

              {/* Form block — transparent, blending with bg */}
              <div
                style={{
                  position: "relative",
                  background: "rgba(11,12,16,0.55)",
                  border: "1px solid rgba(102,252,241,0.15)",
                  borderRadius: 6,
                  padding: 24,
                  backdropFilter: "blur(8px)",
                  overflow: "hidden",
                }}
              >
                <FiligreeCorners />
                {/* Rune watermark */}
                <div className="sc-rune-bg" aria-hidden="true">&#x2721;</div>

                {/* Step progress */}
                <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 20 }}>
                  <div className={`sc-step${selectedHouse ? " done" : " active"}`}>
                    <span className="sc-step-dot" />
                    <span>House</span>
                  </div>
                  <div className={`sc-step-line${selectedHouse ? " done" : ""}`} />
                  <div className={`sc-step${nameValue.trim() && selectedHouse ? " done" : selectedHouse ? " active" : ""}`}>
                    <span className="sc-step-dot" />
                    <span>Name</span>
                  </div>
                  <div className={`sc-step-line${nameValue.trim() && selectedHouse ? " done" : ""}`} />
                  <div className={`sc-step${canDownload ? " active" : ""}`}>
                    <span className="sc-step-dot" />
                    <span>Scroll</span>
                  </div>
                </div>

                {/* House selector */}
                <p style={{ fontFamily: "var(--font-display), serif", fontSize: 9, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(102,252,241,0.5)", marginBottom: 10 }}>
                  Choose Your House
                </p>
                <div className="sc-house-row" style={{ display: "flex", gap: 10, marginBottom: 26 }}>
                  {HOUSES.map((house) => {
                    const active = selectedHouse?.key === house.key;
                    return (
                      <button
                        key={house.key}
                        className="sc-house-btn"
                        onClick={() => handleSelectHouse(house.key)}
                        aria-pressed={active}
                        aria-label={house.name}
                        style={{
                          border: `1px solid ${active ? house.activeBorder : "rgba(197,198,199,0.15)"}`,
                          background: active ? house.activeBg : "transparent",
                          boxShadow: active ? house.activeGlow : "none",
                        }}
                      >
                        <div className="sc-house-icon" style={{ opacity: active ? 1 : 0.4 }}>
                          {house.icon}
                        </div>
                        <span
                          className="sc-house-label"
                          style={{
                            color: active ? house.labelColor : "rgba(197,198,199,0.45)",
                            textShadow: active ? `0 0 12px ${house.activeBorder}88` : "none",
                          }}
                        >
                          {house.name}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* House accent strip — shows all 4 crests */}
                <div className="sc-house-strip">
                  {HOUSES.map((house) => {
                    const active = selectedHouse?.key === house.key;
                    return (
                      <div
                        key={house.key}
                        className={`sc-house-chip${active ? " active" : ""}`}
                        style={{
                          borderColor: active ? house.labelColor : "rgba(197,198,199,0.15)",
                          background: active ? house.activeBg : "transparent",
                          boxShadow: active ? `0 0 12px ${house.activeBorder}66` : "none",
                        }}
                      >
                        <div style={{ transform: "scale(0.55)", opacity: active ? 1 : 0.5 }}>
                          {house.icon}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Name field */}
                <p style={{ fontFamily: "var(--font-display), serif", fontSize: 9, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(102,252,241,0.5)", marginBottom: 10 }}>
                  Name on the Scroll
                </p>
                <input
                  className="sc-name-input"
                  value={nameValue}
                  onChange={handleNameChange}
                  placeholder="Name Title (e.g. Harry Potter)"
                  maxLength={30}
                />

                {/* CTA — matches "View on Google Maps" RoughButton */}
                <RoughButton
                  color="#D4AF37"
                  glow="rgba(212,175,55,0.35)"
                  shimmer
                  seed={17}
                  onClick={handleCast}
                  className={`px-6 py-3.5 text-[11px] w-full sc-cast${btnGlow ? " glow" : ""}`}
                  style={{ marginTop: 22 }}
                >
                  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 2l2 7h7l-5.5 4 2 7L12 16l-5.5 4 2-7L3 9h7z" />
                  </svg>
                  <span>CAST THE SPELL</span>
                </RoughButton>
              </div>

              {/* Trait reveal */}
              {traitVisible && selectedHouse && (
                <div
                  className="sc-trait-revealed"
                  style={{
                    marginTop: 14,
                    padding: "15px 18px",
                    borderLeft: `2px solid ${selectedHouse.activeBorder}99`,
                    background: `linear-gradient(135deg, ${selectedHouse.activeBg}, rgba(212,175,55,0.03))`,
                    borderRadius: "0 4px 4px 0",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 12,
                  }}
                >
                  <div style={{
                    width: 32, height: 32, borderRadius: "50%",
                    background: selectedHouse.activeBg,
                    border: `1px solid ${selectedHouse.activeBorder}66`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                    boxShadow: `0 0 12px ${selectedHouse.activeBorder}44`,
                  }}>
                    <div style={{ transform: "scale(0.6)" }}>{selectedHouse.icon}</div>
                  </div>
                  <div>
                    <p style={{ fontFamily: "var(--font-display), serif", fontSize: 8, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: selectedHouse.labelColor, margin: "0 0 4px" }}>
                      {selectedHouse.name}
                    </p>
                    <p style={{ fontFamily: "var(--font-wizard), serif", fontSize: 16, fontStyle: "italic", color: "rgba(197,198,199,0.8)", margin: 0, lineHeight: 1.5 }}>
                      &ldquo;{selectedHouse.trait}&rdquo;
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* ── Right column: scroll preview ── */}
            <div className="sc-scroll-col" style={{ paddingTop: 4 }}>
              <p style={{ fontFamily: "var(--font-display), serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(102,252,241,0.55)", marginBottom: 12, textAlign: "center" }}>
                Your Identity Scroll
              </p>
              {/* House badge indicator */}
              {selectedHouse && (
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  marginBottom: 12, padding: "6px 14px",
                  background: selectedHouse.activeBg,
                  border: `1px solid ${selectedHouse.activeBorder}44`,
                  borderRadius: 20,
                  width: "fit-content", margin: "0 auto 12px",
                }}>
                  <div style={{ transform: "scale(0.45)", opacity: 0.9 }}>{selectedHouse.icon}</div>
                  <span style={{ fontFamily: "var(--font-display), serif", fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: selectedHouse.labelColor }}>
                    {selectedHouse.name}
                  </span>
                </div>
              )}
              <RoughFrame stroke={selectedHouse ? selectedHouse.labelColor : "#D4AF37"} strokeWidth={1.2} mist={false} padding={8} seed={9}>
                <div className={selectedHouse ? "sc-scroll-revealed" : ""}>
                  <ScrollCard name={nameValue} house={selectedHouse} />
                </div>
              </RoughFrame>

              <RoughButton
                color="#66FCF1"
                glow="rgba(102,252,241,0.30)"
                fill={false}
                seed={23}
                onClick={() => void downloadScroll(nameValue, selectedHouse)}
                disabled={!canDownload}
                className="px-5 py-3 text-[10px] w-full"
                style={{ marginTop: 11, opacity: canDownload ? 1 : 0.45 }}
              >
                <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                <span>DOWNLOAD SCROLL</span>
              </RoughButton>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
