"use client";

// Inline "pay my fee" CTA, shown on the owner's profile when a squad they're
// in has fees due. POSTs to /api/pay/checkout and, on a { checkoutUrl }
// response, redirects the browser to the hosted checkout page.
//
//   <PayButton event={squad.event} squadId={squad.id} />

import { useState } from "react";
import RoughButton from "@/components/RoughButton";

const ERRORS = {
  unauthorized: "Sign in to continue.",
  not_a_member: "You're not a member of this squad.",
  already_paid: "Your fee is already settled.",
  free_event: "This event has no entry fee.",
  db_failure: "Something went wrong. Try again.",
};

export default function PayButton({ event, squadId }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  async function checkout() {
    setBusy(true);
    setError(null);
    try {
      const r = await fetch(`/api/pay/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event, squadId }),
      });
      const body = await r.json().catch(() => ({}));
      if (!r.ok || !body.checkoutUrl) {
        setError(ERRORS[body.error] || body.error || `HTTP ${r.status}`);
        setBusy(false);
        return;
      }
      window.location.href = body.checkoutUrl;
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <span className="inline-flex flex-col items-start gap-1">
      <RoughButton
        type="button"
        onClick={checkout}
        disabled={busy}
        aria-disabled={busy}
        color="#D4AF37"
        glow="rgba(212,175,55,0.40)"
        shimmer={!busy}
        seed={61}
        className="px-5 py-2 text-[10px] tracking-[0.35em]"
      >
        {busy ? "OPENING…" : "PAY ₹100 ↗"}
      </RoughButton>
      {error && (
        <span className="font-wizard italic text-red-300 text-[11px]">{error}</span>
      )}
    </span>
  );
}
