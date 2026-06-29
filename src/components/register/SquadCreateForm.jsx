"use client";

import { useState } from "react";
import RoughButton from "@/components/RoughButton";
import RoughFrame from "@/components/RoughFrame";
import UsernameField from "./UsernameField";
import { toast } from "@/lib/toast";
import { validateSquadName, SQUAD_NAME_ERRORS } from "@/lib/registration/squadName";

const ERRORS = {
  invalid_username:  "Pick a username that matches the format.",
  username_taken:    "That handle is taken — try another.",
  already_in_squad:  "You are already in a squad for this event.",
  hardware_other_mode: "You can only enter one Hardware track — you're already in the other.",
  high_school_required: "Confirm your team are school students to continue.",
  missing_fields:    "Fill in the school name and exhibit title.",
  platform_handle_required: "Add at least one platform handle.",
  codeforces_not_found: "That Codeforces handle doesn't exist — check it.",
  leetcode_not_found:   "That LeetCode handle doesn't exist — check it.",
  codechef_not_found:   "That CodeChef handle doesn't exist — check it.",
  gdg_required:      "Join the GDG chapter first.",
  unauthorized:      "Sign in to continue.",
  event_not_squad:   "This event is not a team event.",
  ...SQUAD_NAME_ERRORS,
};

export default function SquadCreateForm({ event, eventLabel, hasUsername }) {
  const isExhibition = event === "hardware-exhibition";
  // CP is modelled as a team-of-1 (solo). We collect a display name + platform
  // handles, and skip the team-oriented tagline/description.
  const isCp = event === "cp";

  const [squadName, setSquadName]   = useState("");
  const [tagline, setTagline]       = useState("");
  const [description, setDescription] = useState("");
  const [username, setUsername]     = useState("");
  // Hardware Exhibition (school teams) — extra fields captured on the squad.
  const [schoolName, setSchoolName]     = useState("");
  const [exhibitTitle, setExhibitTitle] = useState("");
  const [schoolId, setSchoolId]         = useState("");
  const [schoolDetails, setSchoolDetails] = useState("");
  const [isHighSchool, setIsHighSchool] = useState(false);
  // CP (team-of-1) — competitive-programming handles.
  const [codeforces, setCodeforces] = useState("");
  const [leetcode, setLeetcode]     = useState("");
  const [codechef, setCodechef]     = useState("");
  const [busy, setBusy]             = useState(false);
  const [error, setError]           = useState(null);

  // Live name validation drives the inline hint + the greyed forge button.
  const trimmedName = squadName.trim();
  const nameCheck = validateSquadName(trimmedName);
  const nameValid = nameCheck.ok;
  const usernameOk = hasUsername || username.trim().length >= 3;
  // Exhibition needs its school fields + the high-school confirmation.
  const exhibitionOk =
    !isExhibition ||
    (schoolName.trim().length > 0 && exhibitTitle.trim().length > 0 && isHighSchool);
  // CP needs at least one platform handle.
  const cpHasHandle = Boolean(codeforces.trim() || leetcode.trim() || codechef.trim());
  const cpOk = !isCp || cpHasHandle;
  // CP skips tagline/description; for team events both are now optional.
  const teamCopyOk = true;
  // Forge stays greyed until the WHOLE form is filled.
  const canForge =
    nameValid &&
    teamCopyOk &&
    usernameOk &&
    exhibitionOk &&
    cpOk &&
    !busy;

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      let details;
      if (isExhibition) {
        details = {
          schoolName: schoolName.trim(),
          exhibitTitle: exhibitTitle.trim(),
          schoolId: schoolId.trim() || undefined,
          schoolDetails: schoolDetails.trim() || undefined,
          isHighSchool,
        };
      } else if (isCp) {
        const platformHandles = {};
        if (codeforces.trim()) platformHandles.codeforces = codeforces.trim();
        if (leetcode.trim()) platformHandles.leetcode = leetcode.trim();
        if (codechef.trim()) platformHandles.codechef = codechef.trim();
        details = { platformHandles };
      }
      const res = await fetch("/api/register/squad", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event,
          squadName,
          tagline: isCp ? undefined : tagline || undefined,
          description: isCp ? undefined : description || undefined,
          username: hasUsername ? undefined : username,
          details,
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = ERRORS[body.error] || body.error || `HTTP ${res.status}`;
        setError(msg);
        toast.error(msg);
        setBusy(false);
        return;
      }
      toast.success(isCp ? "Registered — your entry is in!" : "Squad created — invite your members!");
      window.location.href = `${body.teamUrl}?just_created=1`;
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
      setBusy(false);
    }
  }

  return (
    <RoughFrame
      seed={101}
      stroke="#D4AF37"
      mistColor="#D4AF37"
      strokeWidth={1.5}
      padding={26}
      className="w-full bg-slate-hp/35 backdrop-blur-sm"
      inner="flex flex-col gap-5"
    >
      <h2 className="font-display tracking-[0.3em] uppercase text-sm text-gold-hp hp-glow-gold">
        {isCp ? "Register · " : "Form your squad · "}{eventLabel}
      </h2>

      {isCp && (
        <p className="font-wizard italic text-silver-hp/65 text-sm">
          Competitive Programming is a solo event — pick a display name and add
          your platform handles. Your entry goes through review, then a ₹70 fee
          locks in your seat.
        </p>
      )}

      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        {!hasUsername && (
          <UsernameField value={username} onChange={setUsername} />
        )}

        <label className="flex flex-col gap-1.5">
          <span className="font-display text-[10px] uppercase tracking-[0.4em] text-cyan-hp/80">
            {isCp ? "Display name" : "Squad name"} <span className="text-silver-hp/45 normal-case tracking-normal">· {isCp ? "your handle" : "display name"} (max 10)</span>
          </span>
          <input
            type="text"
            required
            value={squadName}
            onChange={(e) => setSquadName(e.target.value)}
            placeholder="e.g. Phoenix"
            maxLength={10}
            minLength={2}
            className="w-full rounded-sm border border-cyan-hp/40 bg-midnight/60 px-4 py-3 text-base text-silver-hp focus:border-cyan-hp focus:outline-none focus:ring-2 focus:ring-cyan-hp/40"
          />
          {trimmedName.length > 0 && !nameValid ? (
            <span className="font-wizard italic text-red-300/85 text-xs">
              {SQUAD_NAME_ERRORS[nameCheck.error]}
            </span>
          ) : (
            <span className="font-wizard text-silver-hp/45 text-xs">
              {isCp ? "This is your public display name — and its unique handle. " : "This is your squad's display name — and its unique handle. "}
              It&apos;s always unique: we check it against every other entry in the
              database before sealing. No spaces · 2–10 chars · starts &amp; ends with a letter.
            </span>
          )}
        </label>

        {!isCp && (
          <>
            <label className="flex flex-col gap-1.5">
              <span className="font-display text-[10px] uppercase tracking-[0.4em] text-cyan-hp/80">
                One-line tagline{" "}
                <span className="normal-case tracking-normal text-silver-hp/40 font-wizard">· optional</span>
              </span>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="What is your squad about in 8 words (optional)"
                maxLength={120}
                className="w-full rounded-sm border border-cyan-hp/40 bg-midnight/60 px-4 py-3 text-base text-silver-hp focus:border-cyan-hp focus:outline-none focus:ring-2 focus:ring-cyan-hp/40"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="font-display text-[10px] uppercase tracking-[0.4em] text-cyan-hp/80">
                Description{" "}
                <span className="normal-case tracking-normal text-silver-hp/40 font-wizard">· optional</span>
              </span>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="What do you want to build? (optional)"
                maxLength={800}
                className="w-full rounded-sm border border-cyan-hp/40 bg-midnight/60 px-4 py-3 text-base text-silver-hp focus:border-cyan-hp focus:outline-none focus:ring-2 focus:ring-cyan-hp/40 resize-y"
              />
            </label>
          </>
        )}

        {/* CP (team-of-1) — competitive-programming handles, ≥1 required. */}
        {isCp && (
          <div className="flex flex-col gap-5 rounded-sm border border-gold-hp/25 bg-gold-hp/5 p-4">
            <p className="font-wizard italic text-silver-hp/65 text-sm">
              Add at least one competitive-programming handle — we verify each one exists.
            </p>
            <CpHandleField label="Codeforces handle" prefix="codeforces.com/profile/" value={codeforces} onChange={setCodeforces} placeholder="e.g. tourist" />
            <CpHandleField label="LeetCode handle" prefix="leetcode.com/u/" value={leetcode} onChange={setLeetcode} placeholder="e.g. swift-falcon" />
            <CpHandleField label="CodeChef handle" prefix="codechef.com/users/" value={codechef} onChange={setCodechef} placeholder="e.g. gennady" />
          </div>
        )}

        {/* Hardware Exhibition (school teams) — extra details on the squad. */}
        {isExhibition && (
          <div className="flex flex-col gap-5 rounded-sm border border-gold-hp/25 bg-gold-hp/5 p-4">
            <p className="font-wizard italic text-silver-hp/65 text-sm">
              Exhibition is for school teams (1–4). Tell us about your school and exhibit.
            </p>
            <label className="flex flex-col gap-1.5">
              <span className="font-display text-[10px] uppercase tracking-[0.4em] text-cyan-hp/80">
                School name
              </span>
              <input
                type="text"
                required
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                placeholder="Your school"
                maxLength={120}
                className="w-full rounded-sm border border-cyan-hp/40 bg-midnight/60 px-4 py-3 text-base text-silver-hp focus:border-cyan-hp focus:outline-none focus:ring-2 focus:ring-cyan-hp/40"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="font-display text-[10px] uppercase tracking-[0.4em] text-cyan-hp/80">
                Exhibit title
              </span>
              <input
                type="text"
                required
                value={exhibitTitle}
                onChange={(e) => setExhibitTitle(e.target.value)}
                placeholder="What are you exhibiting?"
                maxLength={120}
                className="w-full rounded-sm border border-cyan-hp/40 bg-midnight/60 px-4 py-3 text-base text-silver-hp focus:border-cyan-hp focus:outline-none focus:ring-2 focus:ring-cyan-hp/40"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="font-display text-[10px] uppercase tracking-[0.4em] text-cyan-hp/80">
                School ID (optional)
              </span>
              <input
                type="text"
                value={schoolId}
                onChange={(e) => setSchoolId(e.target.value)}
                placeholder="Roll / ID number"
                maxLength={120}
                className="w-full rounded-sm border border-cyan-hp/40 bg-midnight/60 px-4 py-3 text-base text-silver-hp focus:border-cyan-hp focus:outline-none focus:ring-2 focus:ring-cyan-hp/40"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="font-display text-[10px] uppercase tracking-[0.4em] text-cyan-hp/80">
                School details (optional)
              </span>
              <textarea
                value={schoolDetails}
                onChange={(e) => setSchoolDetails(e.target.value)}
                rows={3}
                placeholder="Class, section, address — anything that helps us verify."
                maxLength={1000}
                className="w-full rounded-sm border border-cyan-hp/40 bg-midnight/60 px-4 py-3 text-base text-silver-hp focus:border-cyan-hp focus:outline-none focus:ring-2 focus:ring-cyan-hp/40 resize-y"
              />
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isHighSchool}
                onChange={(e) => setIsHighSchool(e.target.checked)}
                className="mt-1 h-4 w-4 accent-cyan-hp"
              />
              <span className="font-wizard text-silver-hp/80 text-sm">
                I confirm every member of this team is a school student.
              </span>
            </label>
          </div>
        )}

        {error && (
          <p className="font-wizard italic text-red-300 text-sm">{error}</p>
        )}

        <RoughButton
          type="submit"
          disabled={!canForge}
          aria-disabled={!canForge}
          color={canForge ? "#D4AF37" : "#5B5F66"}
          glow={canForge ? "rgba(212,175,55,0.40)" : "transparent"}
          shimmer={canForge}
          seed={29}
          className={`self-start px-10 sm:px-12 py-4 text-[13px] sm:text-[14px] tracking-[0.4em] ${
            canForge ? "" : "opacity-60"
          }`}
        >
          {busy
            ? "CONJURING…"
            : isCp
              ? !cpHasHandle
                ? "ADD A HANDLE TO CONTINUE"
                : "SEAL MY REGISTRATION ↗"
              : "FORGE THE SQUAD ↗"}
        </RoughButton>
      </form>
    </RoughFrame>
  );
}

// Competitive-programming handle field — shows the platform's profile-URL stem
// as a non-editable prefix; only the bare handle after it is stored.
function CpHandleField({ label, prefix, value, onChange, placeholder }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-display text-[10px] uppercase tracking-[0.4em] text-cyan-hp/80">
        {label}
      </span>
      <div className="flex items-stretch overflow-hidden rounded-sm border border-cyan-hp/40 bg-midnight/60 focus-within:border-cyan-hp focus-within:ring-2 focus-within:ring-cyan-hp/40">
        <span className="flex shrink-0 items-center border-r border-cyan-hp/20 bg-midnight/50 px-2.5 font-mono text-[11px] text-silver-hp/45">
          {prefix}
        </span>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={64}
          spellCheck={false}
          className="min-w-0 flex-1 bg-transparent px-3 py-3 text-base text-silver-hp focus:outline-none"
        />
      </div>
    </label>
  );
}
