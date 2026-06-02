"use client";

import { useState } from "react";
import RoughButton from "@/components/RoughButton";

export default function InviteLink({ url, remainingSeats }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* noop */
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 font-display text-[10px] uppercase tracking-[0.4em] text-gold-hp/80">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full rounded-full opacity-60 animate-ping bg-gold-hp" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-gold-hp" />
        </span>
        Invite link · {remainingSeats} seat{remainingSeats === 1 ? "" : "s"} left
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          readOnly
          value={url}
          onFocus={(e) => e.currentTarget.select()}
          className="flex-1 rounded-sm border border-cyan-hp/30 bg-midnight/70 px-3 py-2.5 font-mono text-xs sm:text-sm text-silver-hp/85"
        />
        <RoughButton
          type="button"
          onClick={copy}
          color="#66FCF1"
          glow="rgba(102,252,241,0.30)"
          seed={31}
          className="px-6 py-2.5 text-[11px] tracking-[0.35em]"
        >
          {copied ? "COPIED ✓" : "COPY LINK"}
        </RoughButton>
      </div>
      <p className="font-wizard italic text-silver-hp/60 text-xs">
        Anyone with this link can request to join your squad after signing
        in. Don&apos;t share it publicly.
      </p>
    </div>
  );
}
