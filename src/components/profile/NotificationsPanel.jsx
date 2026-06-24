"use client";

// Owl Post — the in-profile notifications feed.
//
//   <NotificationsPanel />                       // self-fetches on mount
//   <NotificationsPanel initial={notifications} />  // hydrate from the server
//
// `initial` is the array returned by listNotifications() / the GET
// /api/notifications `notifications` field: [{ id, kind, title, body, link,
// read, created_at }]. Newest first. Unread items get a gold left accent and
// the header shows an unread badge. "Mark all read" POSTs /api/notifications.

import { useEffect, useState } from "react";
import RoughButton from "@/components/RoughButton";
import RoughFrame from "@/components/RoughFrame";

function relativeTime(value) {
  if (!value) return "";
  // created_at is SQLite "YYYY-MM-DD HH:MM:SS" (UTC). Normalise to ISO.
  const iso = typeof value === "string" && value.includes(" ") ? value.replace(" ", "T") + "Z" : value;
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const diff = Math.max(0, Date.now() - then);
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks}w ago`;
  return new Date(iso).toLocaleDateString();
}

export default function NotificationsPanel({ initial }) {
  const [items, setItems] = useState(initial ?? []);
  const [loading, setLoading] = useState(!initial);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (initial) return;
    let live = true;
    (async () => {
      try {
        const res = await fetch("/api/notifications", { cache: "no-store" });
        const body = await res.json().catch(() => ({}));
        if (live && res.ok) setItems(body.notifications ?? []);
      } catch {
        /* leave empty state */
      } finally {
        if (live) setLoading(false);
      }
    })();
    return () => {
      live = false;
    };
  }, [initial]);

  const unread = items.reduce((n, x) => n + (x.read ? 0 : 1), 0);

  async function markAllRead() {
    if (busy || unread === 0) return;
    setBusy(true);
    // optimistic
    setItems((prev) => prev.map((x) => ({ ...x, read: 1 })));
    try {
      await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
    } catch {
      /* optimistic state stays; next load reconciles */
    } finally {
      setBusy(false);
    }
  }

  return (
    <RoughFrame
      seed={211}
      stroke="#D4AF37"
      mistColor="#D4AF37"
      strokeWidth={1.4}
      padding={24}
      className="w-full bg-slate-hp/35 backdrop-blur-sm"
      inner="flex flex-col gap-4"
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 font-display tracking-[0.3em] uppercase text-sm text-gold-hp">
          Owl Post
          {unread > 0 && (
            <span
              aria-label={`${unread} unread`}
              className="inline-flex min-w-[1.4em] items-center justify-center rounded-full bg-gold-hp/20 border border-gold-hp/50 px-1.5 py-0.5 font-mono text-[10px] leading-none text-gold-hp"
            >
              {unread}
            </span>
          )}
        </h2>

        {unread > 0 && (
          <RoughButton
            type="button"
            onClick={markAllRead}
            disabled={busy}
            aria-disabled={busy}
            color="#D4AF37"
            glow="rgba(212,175,55,0.30)"
            seed={47}
            className="px-5 py-2 text-[10px] tracking-[0.35em]"
          >
            {busy ? "MARKING…" : "MARK ALL READ"}
          </RoughButton>
        )}
      </div>

      {loading ? (
        <p className="font-wizard italic text-silver-hp/50 text-sm">Summoning owls…</p>
      ) : items.length === 0 ? (
        <p className="font-wizard italic text-silver-hp/55 text-sm">No owls yet.</p>
      ) : (
        <ul className="flex flex-col gap-2.5" aria-live="polite">
          {items.map((n) => {
            const isUnread = !n.read;
            return (
              <li
                key={n.id}
                className={`rounded-sm border bg-midnight/50 px-4 py-3 transition-colors ${
                  isUnread
                    ? "border-gold-hp/30 border-l-2 border-l-gold-hp"
                    : "border-cyan-hp/15"
                }`}
              >
                <div className="flex items-baseline justify-between gap-3">
                  <h3
                    className={`font-display text-[13px] tracking-wide ${
                      isUnread ? "text-gold-hp" : "text-silver-hp/85"
                    }`}
                  >
                    {n.title}
                  </h3>
                  <time
                    dateTime={n.created_at}
                    className="shrink-0 font-mono text-[10px] text-silver-hp/40"
                  >
                    {relativeTime(n.created_at)}
                  </time>
                </div>

                {n.body && (
                  <p className="mt-1 font-wizard text-sm leading-snug text-silver-hp/75">
                    {n.body}
                  </p>
                )}

                {n.link && (
                  <a
                    href={n.link}
                    className="mt-1.5 inline-block font-display text-[10px] uppercase tracking-[0.3em] text-cyan-hp/85 underline-offset-4 hover:underline focus:underline focus:outline-none"
                  >
                    Open ↗
                  </a>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </RoughFrame>
  );
}
