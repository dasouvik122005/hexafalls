"use client";

import { useState } from "react";
import RoughButton from "@/components/RoughButton";
import RoughFrame from "@/components/RoughFrame";
import UsernameField from "./UsernameField";

const ERRORS = {
  invalid_username:  "Pick a username that matches the format.",
  username_taken:    "That handle is taken — try another.",
  invalid_squad_name:"Squad name must be 2–48 characters.",
  already_in_squad:  "You are already in a squad for this event.",
  gdg_required:      "Join the GDG chapter first.",
  unauthorized:      "Sign in to continue.",
  event_not_squad:   "This event is not a team event.",
};

export default function SquadCreateForm({ event, eventLabel, hasUsername }) {
  const [squadName, setSquadName]   = useState("");
  const [tagline, setTagline]       = useState("");
  const [description, setDescription] = useState("");
  const [username, setUsername]     = useState("");
  const [busy, setBusy]             = useState(false);
  const [error, setError]           = useState(null);

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/register/squad", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event,
          squadName,
          tagline: tagline || undefined,
          description: description || undefined,
          username: hasUsername ? undefined : username,
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(ERRORS[body.error] || body.error || `HTTP ${res.status}`);
        setBusy(false);
        return;
      }
      window.location.href = `${body.teamUrl}?just_created=1`;
    } catch (err) {
      setError(err.message);
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
            Squad name
          </span>
          <input
            type="text"
            required
            value={squadName}
            onChange={(e) => setSquadName(e.target.value)}
            placeholder="e.g. The Spell-Slingers"
            maxLength={48}
            minLength={2}
            className="w-full rounded-sm border border-cyan-hp/40 bg-midnight/60 px-4 py-3 text-base text-silver-hp focus:border-cyan-hp focus:outline-none focus:ring-2 focus:ring-cyan-hp/40"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="font-display text-[10px] uppercase tracking-[0.4em] text-cyan-hp/80">
            One-line tagline (optional)
          </span>
          <input
            type="text"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            placeholder="What is your squad about in 8 words"
            maxLength={120}
            className="w-full rounded-sm border border-cyan-hp/40 bg-midnight/60 px-4 py-3 text-base text-silver-hp focus:border-cyan-hp focus:outline-none focus:ring-2 focus:ring-cyan-hp/40"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="font-display text-[10px] uppercase tracking-[0.4em] text-cyan-hp/80">
            Description (optional)
          </span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="What do you want to build? Skills, vibe, anything that helps a teammate decide."
            maxLength={800}
            className="w-full rounded-sm border border-cyan-hp/40 bg-midnight/60 px-4 py-3 text-base text-silver-hp focus:border-cyan-hp focus:outline-none focus:ring-2 focus:ring-cyan-hp/40 resize-y"
          />
        </label>

        {error && (
          <p className="font-wizard italic text-red-300 text-sm">{error}</p>
        )}

        <RoughButton
          type="submit"
          disabled={busy}
          aria-disabled={busy}
          color="#D4AF37"
          glow="rgba(212,175,55,0.40)"
          shimmer={!busy}
          seed={29}
          className="self-start px-10 sm:px-12 py-4 text-[13px] sm:text-[14px] tracking-[0.4em]"
        >
          {busy ? "CONJURING…" : "FORGE THE SQUAD ↗"}
        </RoughButton>
      </form>
    </RoughFrame>
  );
}
