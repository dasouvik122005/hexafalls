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
  gdg_required:      "Join the GDG chapter first.",
  unauthorized:      "Sign in to continue.",
  event_not_squad:   "This event is not a team event.",
  ...SQUAD_NAME_ERRORS,
};

export default function SquadCreateForm({ event, eventLabel, hasUsername }) {
  const isExhibition = event === "hardware-exhibition";

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
  // Forge stays greyed until the WHOLE form is filled.
  const canForge =
    nameValid &&
    tagline.trim().length > 0 &&
    description.trim().length > 0 &&
    usernameOk &&
    exhibitionOk &&
    !busy;

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const details = isExhibition
        ? {
            schoolName: schoolName.trim(),
            exhibitTitle: exhibitTitle.trim(),
            schoolId: schoolId.trim() || undefined,
            schoolDetails: schoolDetails.trim() || undefined,
            isHighSchool,
          }
        : undefined;
      const res = await fetch("/api/register/squad", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event,
          squadName,
          tagline: tagline || undefined,
          description: description || undefined,
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
      toast.success("Squad created — invite your members!");
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
        Form your squad · {eventLabel}
      </h2>

      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        {!hasUsername && (
          <UsernameField value={username} onChange={setUsername} />
        )}

        <label className="flex flex-col gap-1.5">
          <span className="font-display text-[10px] uppercase tracking-[0.4em] text-cyan-hp/80">
            Squad name <span className="text-silver-hp/45 normal-case tracking-normal">· display name (max 10)</span>
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
              This is your squad&apos;s display name — and its unique handle. It&apos;s
              always unique: we check it against every other squad in the database
              before sealing. No spaces · 2–10 chars · starts &amp; ends with a letter.
            </span>
          )}
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="font-display text-[10px] uppercase tracking-[0.4em] text-cyan-hp/80">
            One-line tagline
          </span>
          <input
            type="text"
            required
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            placeholder="What is your squad about in 8 words"
            maxLength={120}
            className="w-full rounded-sm border border-cyan-hp/40 bg-midnight/60 px-4 py-3 text-base text-silver-hp focus:border-cyan-hp focus:outline-none focus:ring-2 focus:ring-cyan-hp/40"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="font-display text-[10px] uppercase tracking-[0.4em] text-cyan-hp/80">
            Description
          </span>
          <textarea
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="What do you want to build? Skills, vibe, anything that helps a teammate decide."
            maxLength={800}
            className="w-full rounded-sm border border-cyan-hp/40 bg-midnight/60 px-4 py-3 text-base text-silver-hp focus:border-cyan-hp focus:outline-none focus:ring-2 focus:ring-cyan-hp/40 resize-y"
          />
        </label>

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
          {busy ? "CONJURING…" : "FORGE THE SQUAD ↗"}
        </RoughButton>
      </form>
    </RoughFrame>
  );
}
