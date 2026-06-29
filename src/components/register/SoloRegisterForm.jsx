"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import RoughButton from "@/components/RoughButton";
import RoughFrame from "@/components/RoughFrame";
import UsernameField from "./UsernameField";
import { toast } from "@/lib/toast";

const ERRORS = {
  invalid_username:        "Pick a username that matches the format.",
  username_taken:          "That handle is taken — try another.",
  already_registered:      "You are already registered for this event.",
  event_not_solo:          "This event is not a solo event.",
  platform_handle_required:"Add at least one platform handle.",
  codeforces_not_found:    "That Codeforces handle doesn't exist — check it.",
  leetcode_not_found:      "That LeetCode handle doesn't exist — check it.",
  codechef_not_found:      "That CodeChef handle doesn't exist — check it.",
  hardware_other_mode:     "You can only enter one Hardware track — you're already in the other.",
  high_school_required:    "Confirm you are a high-school student to continue.",
  missing_fields:          "Fill in the required fields.",
  invalid_details:         "Something looks off with the form — check your inputs.",
  unauthorized:            "Sign in to continue.",
};

const fieldLabel =
  "font-display text-[10px] uppercase tracking-[0.4em] text-cyan-hp/80";
const inputBase =
  "w-full rounded-sm border border-cyan-hp/40 bg-midnight/60 px-4 py-3 text-base text-silver-hp focus:border-cyan-hp focus:outline-none focus:ring-2 focus:ring-cyan-hp/40";

// Competitive-programming handle field — shows the platform's profile-URL stem
// as a non-editable prefix; only the bare handle after it is stored.
function CpHandleField({ label, prefix, value, onChange, placeholder }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className={fieldLabel}>{label}</span>
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

export default function SoloRegisterForm({
  event,
  eventLabel,
  hasUsername,
  backHref,
}) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  // cp handles
  const [codeforces, setCodeforces] = useState("");
  const [leetcode, setLeetcode] = useState("");
  const [codechef, setCodechef] = useState("");

  // hardware-exhibition fields
  const [schoolName, setSchoolName] = useState("");
  const [exhibitTitle, setExhibitTitle] = useState("");
  const [schoolId, setSchoolId] = useState("");
  const [schoolDetails, setSchoolDetails] = useState("");
  const [isHighSchool, setIsHighSchool] = useState(false);

  const isCp = event === "cp";
  const isHardware = event === "hardware-exhibition";

  // The "seal my registration" button stays greyed until the form is fillable:
  // CP needs at least one platform handle; hardware needs school + title + the
  // high-school confirmation.
  const cpHasHandle = Boolean(codeforces.trim() || leetcode.trim() || codechef.trim());
  const canSubmit = isCp
    ? cpHasHandle
    : isHardware
      ? Boolean(schoolName.trim() && exhibitTitle.trim() && isHighSchool)
      : true;

  function buildDetails() {
    if (isCp) {
      const platformHandles = {};
      if (codeforces.trim()) platformHandles.codeforces = codeforces.trim();
      if (leetcode.trim()) platformHandles.leetcode = leetcode.trim();
      if (codechef.trim()) platformHandles.codechef = codechef.trim();
      return { platformHandles };
    }
    if (isHardware) {
      return {
        schoolName: schoolName.trim(),
        exhibitTitle: exhibitTitle.trim(),
        schoolId: schoolId.trim() || undefined,
        schoolDetails: schoolDetails.trim() || undefined,
        isHighSchool,
      };
    }
    return {};
  }

  // Client-side gate (UX only — the server re-validates everything).
  function clientError() {
    if (isCp && !codeforces.trim() && !leetcode.trim() && !codechef.trim()) {
      return ERRORS.platform_handle_required;
    }
    if (isHardware) {
      if (!schoolName.trim() || !exhibitTitle.trim()) return ERRORS.missing_fields;
      if (!isHighSchool) return ERRORS.high_school_required;
    }
    return null;
  }

  async function onSubmit(e) {
    e.preventDefault();
    const ce = clientError();
    if (ce) {
      setError(ce);
      return;
    }
    setBusy(true);
    setError(null);
    const tid = toast.loading(isCp ? "Verifying your handles…" : "Submitting your entry…");
    try {
      const res = await fetch("/api/register/solo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event,
          username: hasUsername ? undefined : username,
          details: buildDetails(),
        }),
      });
      const body = await res.json().catch(() => ({}));
      toast.dismiss(tid);
      if (!res.ok) {
        const msg = ERRORS[body.error] || body.error || `HTTP ${res.status}`;
        setError(msg);
        toast.error(msg);
        setBusy(false);
        return;
      }
      toast.success(`Registered for ${eventLabel} — your entry is under review.`);
      router.push(body.submissionUrl ?? body.profileUrl);
    } catch (err) {
      toast.dismiss(tid);
      setError(err.message);
      toast.error(err.message);
      setBusy(false);
    }
  }

  return (
    <RoughFrame
      seed={103}
      stroke="#66FCF1"
      mistColor="#66FCF1"
      strokeWidth={1.5}
      padding={26}
      className="w-full bg-slate-hp/35 backdrop-blur-sm"
      inner="flex flex-col gap-5"
    >
      <h2 className="font-display tracking-[0.3em] uppercase text-sm text-gold-hp hp-glow-gold">
        Sign on solo · {eventLabel}
      </h2>

      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        {!hasUsername && (
          <UsernameField value={username} onChange={setUsername} />
        )}

        {isCp && (
          <>
            <p className="font-wizard italic text-silver-hp/65 text-sm">
              Add at least one competitive-programming handle.
            </p>
            <CpHandleField
              label="Codeforces handle"
              prefix="codeforces.com/profile/"
              value={codeforces}
              onChange={setCodeforces}
              placeholder="e.g. tourist"
            />
            <CpHandleField
              label="LeetCode handle"
              prefix="leetcode.com/u/"
              value={leetcode}
              onChange={setLeetcode}
              placeholder="e.g. swift-falcon"
            />
            <CpHandleField
              label="CodeChef handle"
              prefix="codechef.com/users/"
              value={codechef}
              onChange={setCodechef}
              placeholder="e.g. gennady"
            />
          </>
        )}

        {isHardware && (
          <>
            <label className="flex flex-col gap-1.5">
              <span className={fieldLabel}>School name</span>
              <input
                type="text"
                required
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                placeholder="Your high school"
                maxLength={120}
                className={inputBase}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className={fieldLabel}>Exhibit title</span>
              <input
                type="text"
                required
                value={exhibitTitle}
                onChange={(e) => setExhibitTitle(e.target.value)}
                placeholder="What are you exhibiting?"
                maxLength={120}
                className={inputBase}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className={fieldLabel}>School ID (optional)</span>
              <input
                type="text"
                value={schoolId}
                onChange={(e) => setSchoolId(e.target.value)}
                placeholder="Roll / ID number"
                maxLength={120}
                className={inputBase}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className={fieldLabel}>School details (optional)</span>
              <textarea
                value={schoolDetails}
                onChange={(e) => setSchoolDetails(e.target.value)}
                rows={4}
                placeholder="Class, section, address — anything that helps us verify."
                maxLength={1000}
                className={`${inputBase} resize-y`}
              />
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={isHighSchool}
                onChange={(e) => setIsHighSchool(e.target.checked)}
                className="mt-1 h-4 w-4 accent-cyan-hp"
              />
              <span className="font-wizard text-silver-hp/80 text-sm">
                I confirm I am a high-school student.
              </span>
            </label>
          </>
        )}

        {error && (
          <p className="font-wizard italic text-red-300 text-sm">{error}</p>
        )}

        <RoughButton
          type="submit"
          disabled={busy || !canSubmit}
          aria-disabled={busy || !canSubmit}
          color={canSubmit ? "#D4AF37" : "#5B5F66"}
          glow={canSubmit ? "rgba(212,175,55,0.40)" : "transparent"}
          shimmer={!busy && canSubmit}
          seed={31}
          className={`self-start px-10 sm:px-12 py-4 text-[13px] sm:text-[14px] tracking-[0.4em] ${
            canSubmit ? "" : "opacity-60"
          }`}
        >
          {busy
            ? "VERIFYING…"
            : !canSubmit && isCp
              ? "ADD A HANDLE TO CONTINUE"
              : "SEAL MY REGISTRATION ↗"}
        </RoughButton>

        {backHref && (
          <a
            href={backHref}
            className="font-display text-[10px] uppercase tracking-[0.35em] text-cyan-hp/85 hover:text-cyan-hp underline underline-offset-4"
          >
            ← back to the event
          </a>
        )}
      </form>
    </RoughFrame>
  );
}
