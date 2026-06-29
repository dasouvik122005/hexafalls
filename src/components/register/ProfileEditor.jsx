"use client";

import { useState } from "react";
import RoughButton from "@/components/RoughButton";
import { toast } from "@/lib/toast";

const ERRORS = {
  invalid_year:        "Year must be 1–4.",
  invalid_github:      "Use just the handle, no URL.",
  invalid_linkedin:    "Use just the handle, no URL.",
  invalid_portfolio:   "Portfolio must be a full https:// URL.",
  portfolio_unreachable: "Your portfolio link didn't return 200 OK — check the URL.",
  no_fields:           "Nothing to save yet — fill in a field.",
};

export default function ProfileEditor({ user }) {
  const [bio, setBio]             = useState(user.bio ?? "");
  const [college, setCollege]     = useState(user.college ?? "");
  const [year, setYear]           = useState(user.year ?? "");
  const [github, setGithub]       = useState((user.github ?? "").replace(/^https?:\/\/github\.com\//, ""));
  const [linkedin, setLinkedin]   = useState((user.linkedin ?? "").replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, ""));
  const [portfolio, setPortfolio] = useState((user.portfolio ?? "").replace(/^https?:\/\//, ""));
  const [busy, setBusy]           = useState(false);
  const [error, setError]         = useState(null);
  const [saved, setSaved]         = useState(false);
  const [showExtras, setShowExtras] = useState(
    Boolean(user.bio || user.github || user.linkedin || user.portfolio),
  );
  // Last-saved snapshot, to detect unsaved changes ("dirty").
  const [snapshot, setSnapshot] = useState({
    bio: user.bio ?? "",
    college: user.college ?? "",
    year: user.year ?? "",
    github: user.github ?? "",
    linkedin: user.linkedin ?? "",
    portfolio: (user.portfolio ?? "").replace(/^https?:\/\//, ""),
  });

  // Any field changed since the last save?
  const dirty =
    bio !== snapshot.bio ||
    college !== snapshot.college ||
    String(year) !== String(snapshot.year) ||
    github !== snapshot.github ||
    linkedin !== snapshot.linkedin ||
    portfolio !== snapshot.portfolio;

  const canSave = dirty && !busy;

  async function onSubmit(e) {
    e.preventDefault();
    setError(null);
    setSaved(false);
    setBusy(true);
    const tid = toast.loading("Saving your profile…");
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
          portfolio: portfolio.trim() ? `https://${portfolio.trim()}` : undefined,
        }),
      });
      const body = await res.json().catch(() => ({}));
      toast.dismiss(tid);
      if (!res.ok) {
        const msg = ERRORS[body.error] || body.error || `HTTP ${res.status}`;
        setError(msg);
        toast.error(msg);
      } else {
        setSaved(true);
        setSnapshot({ bio, college, year, github, linkedin, portfolio });
        toast.success("Profile saved.");
      }
    } catch (err) {
      toast.dismiss(tid);
      setError(err.message);
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="profile-form w-full flex flex-col gap-5 rounded-sm border border-cyan-hp/15 bg-slate-hp/30 p-5 sm:p-6">
      <h2 className="font-display tracking-[0.3em] uppercase text-sm text-cyan-hp">
        Your profile
      </h2>

      <p className="font-wizard text-silver-hp/70 text-sm leading-relaxed">
        Tell us a little about yourself. Everything here is optional — you can
        register and form teams without filling it in.
      </p>

      <form onSubmit={onSubmit} className="grid sm:grid-cols-2 gap-4">
        <Field
          label="College / School"
          value={college}
          onChange={setCollege}
          placeholder="Your college or school"
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

        {/* ── Optional extras (collapsed by default) ── */}
        <div className="sm:col-span-2">
          <button
            type="button"
            onClick={() => setShowExtras(v => !v)}
            className="flex items-center gap-2 font-display text-[10px] uppercase tracking-[0.35em] text-cyan-hp/60 hover:text-cyan-hp/90 transition"
          >
            <span
              className="inline-block transition-transform duration-200"
              style={{ transform: showExtras ? "rotate(90deg)" : "rotate(0deg)" }}
            >
              ▶
            </span>
            {showExtras ? "Hide extra fields" : "Add bio, GitHub, LinkedIn…"}
          </button>
        </div>

        {showExtras && (
          <>
            <PrefixField
              label="GitHub"
              prefix="github.com/"
              value={github}
              onChange={setGithub}
              placeholder="your-handle"
            />
            <PrefixField
              label="LinkedIn"
              prefix="linkedin.com/in/"
              value={linkedin}
              onChange={setLinkedin}
              placeholder="your-handle"
            />
            <PrefixField
              label="Portfolio"
              prefix="https://"
              value={portfolio}
              onChange={setPortfolio}
              placeholder="your-site.com"
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
          </>
        )}

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

        <div className="sm:col-span-2 flex items-center gap-3">
          <RoughButton
            type="submit"
            disabled={!canSave}
            aria-disabled={!canSave}
            color={!canSave ? "#5B5F66" : "#66FCF1"}
            glow={!canSave ? "transparent" : "rgba(102,252,241,0.30)"}
            shimmer={canSave}
            seed={33}
            className={`px-8 sm:px-10 py-3 text-[12px] sm:text-[13px] tracking-[0.4em] ${
              !canSave ? "opacity-60" : ""
            }`}
          >
            {busy ? "SAVING…" : "SAVE PROFILE"}
          </RoughButton>
          {!dirty && (
            <span className="font-wizard italic text-silver-hp/55 text-xs">
              Nothing to save
            </span>
          )}
        </div>
      </form>
    </section>
  );
}

// Field with a fixed, non-editable URL prefix shown inline (e.g. "github.com/").
// Only the handle after the prefix is stored — the prefix is display-only, so
// the saved value stays a bare handle and URL-building elsewhere keeps working.
function PrefixField({ label, prefix, value, onChange, col = "", ...rest }) {
  return (
    <label className={`flex flex-col gap-1.5 ${col}`}>
      <span className="font-display text-[10px] uppercase tracking-[0.4em] text-cyan-hp/80">
        {label}
      </span>
      <div className="flex items-stretch overflow-hidden rounded-sm border border-cyan-hp/40 bg-midnight/60 focus-within:border-cyan-hp focus-within:ring-2 focus-within:ring-cyan-hp/40">
        <span className="flex shrink-0 items-center border-r border-cyan-hp/20 bg-midnight/50 px-3 font-mono text-sm text-silver-hp/45">
          {prefix}
        </span>
        <input
          {...rest}
          type={rest.type || "text"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="min-w-0 flex-1 bg-transparent px-3 py-3 text-base text-silver-hp focus:outline-none"
        />
      </div>
    </label>
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
