"use client";

import { useState } from "react";
import RoughButton from "@/components/RoughButton";
import { toast } from "@/lib/toast";

const GDG_LINK =
  "https://gdg.community.dev/gdg-on-campus-jis-university-kolkata-india/";

const ERRORS = {
  invalid_year:        "Year must be 1–4.",
  invalid_github:      "Use just the handle, no URL.",
  invalid_linkedin:    "Use just the handle, no URL.",
  invalid_portfolio:   "Portfolio must be a full https:// URL.",
  invalid_gdg_email:   "Enter a valid email.",
  incomplete:          "Fill in every required field to get verified.",
  github_not_found:    "That GitHub profile doesn't exist — check the handle.",
  linkedin_not_found:  "That LinkedIn profile couldn't be found — check the handle.",
  portfolio_unreachable: "Your portfolio link didn't return 200 OK — check the URL.",
  gdg_email_unreal:    "That email's domain can't receive mail — use a real address.",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ProfileEditor({ user, accountEmail: accountEmailProp }) {
  const accountEmail = accountEmailProp || user.email || "";
  const [bio, setBio]             = useState(user.bio ?? "");
  const [college, setCollege]     = useState(user.college ?? "");
  const [year, setYear]           = useState(user.year ?? "");
  const [github, setGithub]       = useState((user.github ?? "").replace(/^https?:\/\/github\.com\//, ""));
  const [linkedin, setLinkedin]   = useState((user.linkedin ?? "").replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, ""));
  const [portfolio, setPortfolio] = useState((user.portfolio ?? "").replace(/^https?:\/\//, ""));
  const [gdgEmail, setGdgEmail]   = useState(user.gdg_email || accountEmail);
  const [sameAsAccount, setSameAsAccount] = useState(
    !user.gdg_email || user.gdg_email === accountEmail,
  );
  const [busy, setBusy]           = useState(false);
  const [error, setError]         = useState(null);
  const [saved, setSaved]         = useState(false);
  const [savedVerified, setSavedVerified] = useState(Boolean(user.gdg_verified));
  const [showExtras, setShowExtras]       = useState(false);
  // Last-saved snapshot, to detect unsaved changes ("dirty").
  const [snapshot, setSnapshot] = useState({
    bio: user.bio ?? "",
    college: user.college ?? "",
    year: user.year ?? "",
    github: user.github ?? "",
    linkedin: user.linkedin ?? "",
    gdgEmail: user.gdg_email || accountEmail,
    portfolio: (user.portfolio ?? "").replace(/^https?:\/\//, ""),
  });

  // Verification === a complete profile. Drive the chip off the LIVE form state
  // so it always reflects whether the current profile meets the bar.
  const complete = Boolean(
    college.trim() &&
      String(year).trim() &&
      EMAIL_RE.test(gdgEmail.trim()),
  );

  // Any field changed since the last save?
  const dirty =
    bio !== snapshot.bio ||
    college !== snapshot.college ||
    String(year) !== String(snapshot.year) ||
    github !== snapshot.github ||
    linkedin !== snapshot.linkedin ||
    gdgEmail !== snapshot.gdgEmail ||
    portfolio !== snapshot.portfolio;

  // The button is greyed until ALL required fields are filled (complete), and —
  // once verified — until the user actually changes something. So you can only
  // click Verify when there's a complete, savable profile.
  const canSave = complete && (!savedVerified || dirty);
  const locked = !canSave;

  function toggleSameAsAccount(checked) {
    setSameAsAccount(checked);
    if (checked) setGdgEmail(accountEmail);
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError(null);
    setSaved(false);
    if (!complete) {
      setError(ERRORS.incomplete);
      return;
    }
    setBusy(true);
    const tid = toast.loading("Verifying your details…");
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
          gdg_email: gdgEmail || undefined,
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
        setSavedVerified(Boolean(body.gdg_verified));
        // Reset the dirty baseline to the just-saved values.
        setSnapshot({ bio, college, year, github, linkedin, gdgEmail, portfolio });
        toast.success(body.gdg_verified ? "Profile saved — you're verified ✓" : "Profile saved.");
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
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display tracking-[0.3em] uppercase text-sm text-cyan-hp">
          Your profile
        </h2>
        <VerifiedPill verified={complete} />
      </div>

      <p className="font-wizard text-silver-hp/70 text-sm leading-relaxed">
        Add your <span className="text-cyan-hp">college, year and GDG email</span> to get
        verified and unlock registration. GitHub, LinkedIn, bio and portfolio are optional.
      </p>

      <form onSubmit={onSubmit} className="grid sm:grid-cols-2 gap-4">
        <Field
          label="College / School"
          value={college}
          onChange={setCollege}
          placeholder="Your college or school"
          col="sm:col-span-2"
          required
        />
        <Field
          label="Year"
          type="text"
          inputMode="numeric"
          value={year}
          onChange={setYear}
          placeholder="Year of study (1–4)"
          required
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
            {showExtras ? "Hide optional fields" : "Add bio, GitHub, LinkedIn… (optional)"}
          </button>
        </div>

        {showExtras && (
          <>
            <PrefixField
              label="GitHub (optional)"
              prefix="github.com/"
              value={github}
              onChange={setGithub}
              placeholder="your-handle"
            />
            <PrefixField
              label="LinkedIn (optional)"
              prefix="linkedin.com/in/"
              value={linkedin}
              onChange={setLinkedin}
              placeholder="your-handle"
            />
            <PrefixField
              label="Portfolio (optional)"
              prefix="https://"
              value={portfolio}
              onChange={setPortfolio}
              placeholder="your-site.com"
            />
            <label className="sm:col-span-2 flex flex-col gap-1.5">
              <span className="font-display text-[10px] uppercase tracking-[0.4em] text-cyan-hp/80">
                Bio
                <span className="ml-2 normal-case tracking-normal text-silver-hp/40 font-wizard">· optional</span>
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

        {/* GDG community email — the membership check now lives here. */}
        <div className="sm:col-span-2 flex flex-col gap-2 rounded-sm border border-gold-hp/25 bg-gold-hp/5 p-4">
          <label className="flex flex-col gap-1.5">
            <span className="font-display text-[10px] uppercase tracking-[0.4em] text-cyan-hp/80">
              GDG · JIS University community email <span className="text-red-300/70">*</span>
            </span>
            <input
              type="email"
              value={gdgEmail}
              onChange={(e) => setGdgEmail(e.target.value)}
              disabled={sameAsAccount}
              placeholder={accountEmail || "you@example.com"}
              className="w-full rounded-sm border border-cyan-hp/40 bg-midnight/60 px-4 py-3 text-base text-silver-hp focus:border-cyan-hp focus:outline-none focus:ring-2 focus:ring-cyan-hp/40 disabled:opacity-60 disabled:cursor-not-allowed"
            />
          </label>

          {/* Shortcut: reuse the email the user signed in with. */}
          {accountEmail && (
            <label className="flex items-center gap-2 cursor-pointer font-wizard text-silver-hp/80 text-sm">
              <input
                type="checkbox"
                checked={sameAsAccount}
                onChange={(e) => toggleSameAsAccount(e.target.checked)}
                className="h-4 w-4 accent-cyan-hp"
              />
              <span>
                Same as my Elixpo account{" "}
                <span className="text-silver-hp/55">({accountEmail})</span>
              </span>
            </label>
          )}

          <p className="font-wizard text-silver-hp/70 text-xs leading-relaxed">
            Use the email associated with your{" "}
            <span className="text-silver-hp">GDG on Campus · JIS University</span>{" "}
            membership. Not a member yet?{" "}
            <a
              href={GDG_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold-hp underline underline-offset-4 hover:text-gold-hp/80"
            >
              Join the chapter ↗
            </a>
          </p>
        </div>


        {error && (
          <p className="sm:col-span-2 font-wizard italic text-red-300 text-sm">
            {error}
          </p>
        )}
        {saved && (
          <p className="sm:col-span-2 font-wizard italic text-cyan-hp/85 text-sm">
            Saved ✓ {complete ? "Your profile is verified." : "Add the missing fields to get verified."}
          </p>
        )}

        <div className="sm:col-span-2 flex items-center gap-3">
          <RoughButton
            type="submit"
            disabled={busy || locked}
            aria-disabled={busy || locked}
            // Grey/locked once verified with no pending changes; cyan otherwise.
            color={locked ? "#5B5F66" : "#66FCF1"}
            glow={locked ? "transparent" : "rgba(102,252,241,0.30)"}
            shimmer={!busy && !locked}
            seed={33}
            className={`px-8 sm:px-10 py-3 text-[12px] sm:text-[13px] tracking-[0.4em] ${
              locked ? "opacity-60" : ""
            }`}
          >
            {busy
              ? "SAVING…"
              : savedVerified
                ? "UPDATE"
                : "SAVE & VERIFY"}
          </RoughButton>
          {!complete ? (
            <span className="font-wizard italic text-silver-hp/55 text-xs">
              Fill every required field to verify.
            </span>
          ) : savedVerified && !dirty ? (
            <span className="font-wizard italic text-emerald-300/80 text-xs">
              Verified · nothing to update
            </span>
          ) : null}
        </div>
      </form>
    </section>
  );
}

function VerifiedPill({ verified }) {
  const c = verified ? "#4ade80" : "#C5C6C7";
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full border px-3 py-1 font-display text-[9px] uppercase tracking-[0.35em]"
      style={{ borderColor: `${c}80`, color: c, backgroundColor: `${c}1a` }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: c }} />
      {verified ? "Verified" : "Unverified"}
    </span>
  );
}

// Field with a fixed, non-editable URL prefix shown inline (e.g. "github.com/").
// Only the handle after the prefix is stored — the prefix is display-only, so
// the saved value stays a bare handle and URL-building elsewhere keeps working.
function PrefixField({ label, prefix, value, onChange, col = "", required = false, ...rest }) {
  return (
    <label className={`flex flex-col gap-1.5 ${col}`}>
      <span className="font-display text-[10px] uppercase tracking-[0.4em] text-cyan-hp/80">
        {label} {required && <span className="text-red-300/70">*</span>}
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

function Field({ label, value, onChange, col = "", required = false, ...rest }) {
  return (
    <label className={`flex flex-col gap-1.5 ${col}`}>
      <span className="font-display text-[10px] uppercase tracking-[0.4em] text-cyan-hp/80">
        {label} {required && <span className="text-red-300/70">*</span>}
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
