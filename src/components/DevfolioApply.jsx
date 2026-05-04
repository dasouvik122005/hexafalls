"use client";

import { useEffect } from "react";
const THEMES = {
  light: {
    bg: "#3770FF",
    bgHover: "#2A5FE6",
    text: "#FFFFFF",
    badgeBg: "#FFFFFF",
    badgeFg: "#1B1F23",
    glow: "rgba(55,112,255,0.45)",
    chevron: "rgba(255,255,255,0.85)",
  },
  dark: {
    bg: "#1B1F23",
    bgHover: "#272D33",
    text: "#FFFFFF",
    badgeBg: "#FFFFFF",
    badgeFg: "#1B1F23",
    glow: "rgba(55,112,255,0.40)",
    chevron: "rgba(255,255,255,0.85)",
  },
  "dark-inverted": {
    bg: "#FFFFFF",
    bgHover: "#F2F4F8",
    text: "#1B1F23",
    badgeBg: "#1B1F23",
    badgeFg: "#FFFFFF",
    glow: "rgba(27,31,35,0.30)",
    chevron: "rgba(27,31,35,0.85)",
  },
};

export default function DevfolioApply({
  slug = "hexafalls2",
  theme = "light",
  width = 312,
  height = 44,
  variant = "light",
  className = "",
}) {
  useEffect(() => {
    if (variant !== "sdk") return;
    const SDK = "https://apply.devfolio.co/v2/sdk.js";
    if (document.querySelector(`script[src="${SDK}"]`)) return;
    const script = document.createElement("script");
    script.src   = SDK;
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }, [variant]);

  if (variant === "sdk") {
    return (
      <div
        className={`apply-button ${className}`}
        data-hackathon-slug={slug}
        data-button-theme={theme}
        style={{ height, width }}
      />
    );
  }

  const palette = THEMES[theme] || THEMES.dark;

  return (
    <a
      href={`https://${slug}.devfolio.co/`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Apply with Devfolio"
      className={`group relative inline-flex items-center gap-3 rounded-md font-medium tracking-wide transition ${className}`}
      style={{
        height,
        width,
        backgroundColor: palette.bg,
        color: palette.text,
        paddingLeft: 14,
        paddingRight: 16,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = palette.bgHover;
        e.currentTarget.style.boxShadow = `0 0 28px ${palette.glow}`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = palette.bg;
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <span
        aria-hidden="true"
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md"
        style={{ backgroundColor: palette.badgeBg }}
      >
        {/* Devfolio "D" mark — vertical bar + half arch, filled */}
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill={palette.badgeFg} aria-hidden="true">
          <path d="M4.5 3h7.8a9 9 0 0 1 0 18H4.5V3zm3 3v12h4.8a6 6 0 0 0 0-12H7.5z" />
        </svg>
      </span>
      <span className="text-[14px] flex-1 text-left">Apply with Devfolio</span>
      <span
        className="transition group-hover:translate-x-0.5"
        style={{ color: palette.chevron }}
      >
        ↗
      </span>
    </a>
  );
}
