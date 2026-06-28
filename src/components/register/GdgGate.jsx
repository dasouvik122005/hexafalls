"use client";

import { useState } from "react";
import RoughButton from "@/components/RoughButton";
import RoughFrame from "@/components/RoughFrame";

const GDG_LINK =
  "https://gdg.community.dev/gdg-on-campus-jis-university-kolkata-india/";

export default function GdgGate({ returnTo = "/register" }) {
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  async function onSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const r = await fetch("/api/register/gdg", { method: "POST" });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      window.location.href = returnTo;
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  return (
    <RoughFrame
      seed={91}
      stroke="#66FCF1"
      mistColor="#66FCF1"
      strokeWidth={1.4}
      padding={26}
      className="w-full bg-slate-hp/40 backdrop-blur-sm"
      inner="flex flex-col gap-4"
    >
      <h2 className="font-display tracking-[0.3em] uppercase text-sm text-cyan-hp">
        Join the GDG chapter
      </h2>
      <p className="font-wizard text-silver-hp/85 text-base leading-relaxed">
        HexaFalls is conjured by GDG on Campus · JIS University. Every
        wizard at the hall must first join the chapter — it takes a minute.
      </p>
      <a
        href={GDG_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="font-display text-sm tracking-[0.25em] uppercase text-gold-hp hp-glow-gold underline underline-offset-4"
      >
        Open the chapter page ↗
      </a>

      <form onSubmit={onSubmit} className="mt-2 flex flex-col gap-4">
        <label className="flex items-start gap-3 text-silver-hp/85 font-wizard text-sm sm:text-base cursor-pointer">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="mt-1 h-4 w-4 accent-cyan-hp"
          />
          <span>
            I confirm I have joined the GDG on Campus · JIS University
            chapter on gdg.community.dev with the same email I used here.
          </span>
        </label>

        {error && (
          <p className="font-wizard italic text-red-300 text-sm">{error}</p>
        )}

        <RoughButton
          type="submit"
          disabled={!confirmed || submitting}
          aria-disabled={!confirmed || submitting}
          color="#D4AF37"
          glow="rgba(212,175,55,0.40)"
          shimmer={confirmed}
          seed={23}
          className="self-start px-8 sm:px-10 py-3 sm:py-4 text-[12px] sm:text-[13px] tracking-[0.35em]"
        >
          {submitting ? "VERIFYING…" : "I HAVE JOINED ↗"}
        </RoughButton>
      </form>
    </RoughFrame>
  );
}
