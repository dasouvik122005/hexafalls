"use client";

import { useState } from "react";
import RoughButton from "@/components/RoughButton";
import RoughFrame from "@/components/RoughFrame";

const ERRORS = {
  invalid_year:      "Year must be 1–4.",
  invalid_github:    "Use just the handle, no URL.",
  invalid_linkedin:  "Use just the handle, no URL.",
  invalid_portfolio: "Portfolio must be a full https:// URL.",
};

export default function ProfileEditor({ user }) {
  const [bio, setBio]             = useState(user.bio ?? "");
  const [college, setCollege]     = useState(user.college ?? "");
  const [year, setYear]           = useState(user.year ?? "");
  const [github, setGithub]       = useState(user.github ?? "");
  const [linkedin, setLinkedin]   = useState(user.linkedin ?? "");
  const [portfolio, setPortfolio] = useState(user.portfolio ?? "");
  const [busy, setBusy]           = useState(false);
  const [error, setError]         = useState(null);
  const [saved, setSaved]         = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setSaved(false);
    try {
      const res = await fetch("/api/me/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bio: bio || undefined,
          college: college || undefined,
          year: year ? Number(year) : undefined,
          github: github || undefined,
          linkedin: linkedin || undefined,
          portfolio: portfolio || undefined,
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(ERRORS[body.error] || body.error || `HTTP ${res.status}`);
      } else {
        setSaved(true);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <RoughFrame
      seed={127}
      stroke="#66FCF1"
      mistColor="#66FCF1"
      strokeWidth={1.4}
      padding={24}
      className="w-full bg-slate-hp/35 backdrop-blur-sm"
      inner="flex flex-col gap-4"
    >
      <h2 className="font-display tracking-[0.3em] uppercase text-sm text-cyan-hp">
        Your profile
      </h2>

      <form onSubmit={onSubmit} className="grid sm:grid-cols-2 gap-4">
        <Field
          label="College"
          value={college}
          onChange={setCollege}
          placeholder="JIS University"
          col="sm:col-span-2"
        />
        <Field
          label="Year"
          type="text"
          inputMode="numeric"
          value={year}
          onChange={setYear}
          placeholder="Year of study (1–4)"
        />
        <Field
          label="GitHub"
          value={github}
          onChange={setGithub}
          placeholder="your-handle"
        />
        <Field
          label="LinkedIn"
          value={linkedin}
          onChange={setLinkedin}
          placeholder="your-handle"
        />
        <Field
          label="Portfolio"
          value={portfolio}
          onChange={setPortfolio}
          placeholder="https://..."
        />
        <label className="sm:col-span-2 flex flex-col gap-1.5">
          <span className="font-display text-[10px] uppercase tracking-[0.4em] text-cyan-hp/80">
            Bio
          </span>
          <textarea
            rows={3}
            maxLength={280}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="One paragraph about you — wand of choice, side quests, anything."
            className="w-full rounded-sm border border-cyan-hp/40 bg-midnight/60 px-4 py-3 text-base text-silver-hp focus:border-cyan-hp focus:outline-none focus:ring-2 focus:ring-cyan-hp/40 resize-y"
          />
        </label>

        {error && (
          <p className="sm:col-span-2 font-wizard italic text-red-300 text-sm">
            {error}
          </p>
        )}
        {saved && (
          <p className="sm:col-span-2 font-wizard italic text-cyan-hp/85 text-sm">
            Saved ✓
          </p>
        )}

        <div className="sm:col-span-2">
          <RoughButton
            type="submit"
            disabled={busy}
            aria-disabled={busy}
            color="#66FCF1"
            glow="rgba(102,252,241,0.30)"
            shimmer={!busy}
            seed={33}
            className="px-8 sm:px-10 py-3 text-[12px] sm:text-[13px] tracking-[0.4em]"
          >
            {busy ? "SAVING…" : "SAVE PROFILE"}
          </RoughButton>
        </div>
      </form>
    </RoughFrame>
  );
}

function Field({ label, value, onChange, col = "", ...rest }) {
  return (
    <label className={`flex flex-col gap-1.5 ${col}`}>
      <span className="font-display text-[10px] uppercase tracking-[0.4em] text-cyan-hp/80">
        {label}
      </span>
      <input
        {...rest}
        type={rest.type || "text"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-sm border border-cyan-hp/40 bg-midnight/60 px-4 py-3 text-base text-silver-hp focus:border-cyan-hp focus:outline-none focus:ring-2 focus:ring-cyan-hp/40"
      />
    </label>
  );
}
