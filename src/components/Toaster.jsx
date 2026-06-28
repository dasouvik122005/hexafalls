"use client";

// Global toast viewport — mounted once in the root layout. Subscribes to the
// toast store (src/lib/toast.js) and renders matte, themed toasts top-right.
// Click a toast to dismiss it early.

import { useEffect, useState } from "react";
import { subscribe, dismiss } from "@/lib/toast";

const STYLE = {
  success: { c: "#4ade80", icon: "✓" },
  error:   { c: "#EF4444", icon: "✕" },
  info:    { c: "#66FCF1", icon: "✦" },
  loading: { c: "#D4AF37", icon: "◌" },
};

export default function Toaster() {
  const [items, setItems] = useState([]);
  useEffect(() => subscribe(setItems), []);

  if (items.length === 0) return null;

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[120] flex w-[min(92vw,360px)] flex-col gap-2">
      {items.map((t) => {
        const s = STYLE[t.type] ?? STYLE.info;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => dismiss(t.id)}
            className="hp-toast-in pointer-events-auto flex w-full items-start gap-3 rounded-sm border bg-midnight/95 px-4 py-3 text-left shadow-lg backdrop-blur-sm transition hover:bg-slate-hp/80"
            style={{ borderColor: `${s.c}66` }}
          >
            <span
              className={`mt-0.5 font-display text-sm ${t.type === "loading" ? "animate-spin" : ""}`}
              style={{ color: s.c }}
              aria-hidden="true"
            >
              {s.icon}
            </span>
            <span className="font-wizard text-sm leading-snug text-silver-hp">{t.message}</span>
          </button>
        );
      })}
    </div>
  );
}
