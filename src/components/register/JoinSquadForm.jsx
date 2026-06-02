"use client";

import { useState } from "react";
import RoughButton from "@/components/RoughButton";
import RoughFrame from "@/components/RoughFrame";
import UsernameField from "./UsernameField";

const ERRORS = {
  invalid_username:  "Pick a username that matches the format.",
  username_taken:    "That handle is taken — try another.",
  invalid_invite:    "This invite link is invalid or expired.",
  squad_full:        "This squad is already at capacity.",
  squad_locked:      "This squad has been locked by its leader.",
  already_in_squad:  "You are already in a squad for this event.",
  gdg_required:      "Join the GDG chapter first.",
  unauthorized:      "Sign in to continue.",
};

export default function JoinSquadForm({
  squadId,
  inviteToken,
  squadName,
  eventLabel,
  hasUsername,
}) {
  const [username, setUsername] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/register/squad/${squadId}/join`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            inviteToken,
            username: hasUsername ? undefined : username,
          }),
        },
      );
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(ERRORS[body.error] || body.error || `HTTP ${res.status}`);
        setBusy(false);
        return;
      }
      window.location.href = `/register/squad/${squadId}`;
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <RoughFrame
      seed={113}
      stroke="#D4AF37"
      mistColor="#D4AF37"
      strokeWidth={1.5}
      padding={26}
      className="w-full bg-slate-hp/35 backdrop-blur-sm"
      inner="flex flex-col gap-5"
    >
      <h2 className="font-display tracking-[0.3em] uppercase text-sm text-gold-hp hp-glow-gold">
        Join {squadName}
      </h2>
      <p className="font-wizard text-silver-hp/85 text-base">
        Joining as a member of this {eventLabel} squad.
      </p>

      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        {!hasUsername && (
          <UsernameField value={username} onChange={setUsername} />
        )}
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
          seed={37}
          className="self-start px-10 sm:px-12 py-4 text-[13px] sm:text-[14px] tracking-[0.4em]"
        >
          {busy ? "JOINING…" : "JOIN THE SQUAD ↗"}
        </RoughButton>
      </form>
    </RoughFrame>
  );
}
