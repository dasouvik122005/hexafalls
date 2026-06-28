"use client";

import { useState } from "react";
import RoughButton from "@/components/RoughButton";
import { toast } from "@/lib/toast";

const ERRORS = {
  below_min_members: "Add more wizards before submitting.",
  not_leader:        "Only the squad leader can submit.",
  wrong_status:      "This squad cannot be submitted right now.",
};

export default function SubmitForReview({ squadId, canSubmit, minMembers, currentCount, rejectedNotes }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [confirming, setConfirming] = useState(false);

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
        const msg = ERRORS[body.error] || body.error || `HTTP ${r.status}`;
        setError(msg);
        toast.error(msg);
        setBusy(false);
        return;
      }
      toast.success("Submitted for review — your team is locked.");
      window.location.reload();
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-3">
      {rejectedNotes && (
        <p className="font-wizard italic text-red-300 text-sm">
          Last review: {rejectedNotes}
        </p>
      )}

      {!confirming ? (
        <RoughButton
          type="button"
          onClick={() => {
            setError(null);
            setConfirming(true);
          }}
          disabled={!canSubmit || busy}
          aria-disabled={!canSubmit || busy}
          // Grey while the team hasn't met its minimum size; gold once it can go.
          color={canSubmit ? "#D4AF37" : "#5B5F66"}
          glow={canSubmit ? "rgba(212,175,55,0.40)" : "transparent"}
          shimmer={canSubmit && !busy}
          seed={51}
          className={`px-10 sm:px-12 py-4 text-[13px] sm:text-[14px] tracking-[0.4em] ${
            canSubmit ? "" : "opacity-60"
          }`}
        >
          {canSubmit
            ? "SUBMIT FOR REVIEW ↗"
            : `NEED ${minMembers - currentCount} MORE ${
                minMembers - currentCount === 1 ? "MEMBER" : "MEMBERS"
              }`}
        </RoughButton>
      ) : (
        // Confirmation — submitting locks the team for the review period.
        <div className="w-full max-w-md rounded-sm border border-gold-hp/30 bg-slate-hp/30 p-5 flex flex-col gap-4 text-center">
          <p className="font-wizard text-silver-hp/85 text-sm leading-relaxed">
            Submitting locks your team for the <span className="text-gold-hp">review period</span>.
            While it&apos;s under review you <span className="text-silver-hp">cannot</span> add or
            remove members, change details, or invite anyone. Continue?
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <RoughButton
              type="button"
              onClick={submit}
              disabled={busy}
              aria-disabled={busy}
              color="#D4AF37"
              glow="rgba(212,175,55,0.40)"
              shimmer={!busy}
              seed={51}
              className="px-8 sm:px-10 py-3.5 text-[12px] sm:text-[13px] tracking-[0.35em]"
            >
              {busy ? "LOCKING…" : "LOCK & SUBMIT ↗"}
            </RoughButton>
            {!busy && (
              <RoughButton
                type="button"
                onClick={() => setConfirming(false)}
                color="#C5C6C7"
                fill={false}
                seed={29}
                className="px-7 py-3 text-[11px] tracking-[0.3em]"
              >
                CANCEL
              </RoughButton>
            )}
          </div>
        </div>
      )}

      {error && (
        <p className="font-wizard italic text-red-300 text-sm">{error}</p>
      )}
    </div>
  );
}
