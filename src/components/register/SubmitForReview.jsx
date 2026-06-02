"use client";

import { useState } from "react";
import RoughButton from "@/components/RoughButton";

const ERRORS = {
  below_min_members: "Add more wizards before submitting.",
  not_leader:        "Only the squad leader can submit.",
  wrong_status:      "This squad cannot be submitted right now.",
};

export default function SubmitForReview({ squadId, canSubmit, minMembers, currentCount, rejectedNotes }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  async function submit() {
    setBusy(true);
    setError(null);
    try {
      const r = await fetch(`/api/register/squad/${squadId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const body = await r.json().catch(() => ({}));
      if (!r.ok) {
        setError(ERRORS[body.error] || body.error || `HTTP ${r.status}`);
        setBusy(false);
        return;
      }
      window.location.reload();
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {rejectedNotes && (
        <p className="font-wizard italic text-red-300 text-sm">
          Last review: {rejectedNotes}
        </p>
      )}
      <RoughButton
        type="button"
        onClick={submit}
        disabled={!canSubmit || busy}
        aria-disabled={!canSubmit || busy}
        color="#D4AF37"
        glow="rgba(212,175,55,0.40)"
        shimmer={canSubmit && !busy}
        seed={51}
        className="self-start px-10 sm:px-12 py-4 text-[13px] sm:text-[14px] tracking-[0.4em]"
      >
        {busy
          ? "SUBMITTING…"
          : canSubmit
            ? "SUBMIT FOR REVIEW ↗"
            : `NEED ${minMembers - currentCount} MORE`}
      </RoughButton>
      {error && (
        <p className="font-wizard italic text-red-300 text-sm">{error}</p>
      )}
    </div>
  );
}
