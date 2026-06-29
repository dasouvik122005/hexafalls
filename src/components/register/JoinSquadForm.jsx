"use client";

import { useState } from "react";
import RoughButton from "@/components/RoughButton";
import UsernameField from "./UsernameField";
import { toast } from "@/lib/toast";

const ERRORS = {
  invalid_username:  "Pick a username that matches the format.",
  username_taken:    "That handle is taken — try another.",
  invalid_invite:    "This invite link is invalid or expired.",
  squad_full:        "This squad is already at capacity.",
  squad_locked:      "This squad has been locked by its leader.",
  already_in_squad:  "You are already in a squad for this event.",
  hardware_other_mode: "You can only enter one Hardware track — you're already in the other.",
  already_member:    "You are already a member of this squad.",
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
  const [sent, setSent] = useState(false);

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
        const msg = ERRORS[body.error] || body.error || `HTTP ${res.status}`;
        setError(msg);
        toast.error(msg);
        setBusy(false);
        return;
      }
      // Invite acceptance now files a request — the leader still has to approve.
      setSent(true);
      setBusy(false);
      toast.success("Request sent — awaiting the leader's approval.");
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  if (sent) {
    return (
      <div className="w-full rounded-sm border border-emerald-400/40 bg-emerald-400/6 p-6 flex flex-col gap-2 items-center text-center">
        <h2 className="font-display tracking-[0.3em] uppercase text-sm text-emerald-300">
          Request sent
        </h2>
        <p className="font-wizard text-silver-hp/85 text-base">
          Your request to join <span className="text-silver-hp">{squadName}</span> is
          waiting for the team leader&apos;s approval. You&apos;ll get a
          notification once they respond.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full rounded-sm border border-gold-hp/30 bg-slate-hp/30 p-6 flex flex-col gap-5">
      <h2 className="font-display tracking-[0.3em] uppercase text-sm text-gold-hp">
        Join {squadName}
      </h2>
      <p className="font-wizard text-silver-hp/85 text-base">
        Send a request to join this {eventLabel} squad. The leader approves new
        members from their team panel.
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
          {busy ? "SENDING…" : "REQUEST TO JOIN ↗"}
        </RoughButton>
      </form>
    </div>
  );
}
