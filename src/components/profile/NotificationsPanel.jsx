"use client";

// Owl Post — the in-profile notifications feed.
//
//   <NotificationsPanel />                       // self-fetches on mount
//   <NotificationsPanel initial={notifications} />  // hydrate from the server
//
// `initial` is the array from GET /api/notifications `notifications`:
// [{ id, kind, title, body, link, read, created_at }]. Newest first. Matte
// card; unread items get a gold left accent + an unread count in the header.

import { useEffect, useState } from "react";

function EnvelopeIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3.5 6.5 L12 13 L20.5 6.5" />
    </svg>
  );
}

function relativeTime(value) {
  if (!value) return "";
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
    <section className="w-full rounded-sm border border-gold-hp/25 bg-slate-hp/30 p-5 sm:p-6 flex flex-col gap-4">
      {/* Header — "Owl Post" stays on one line; controls wrap below on mobile */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2.5 whitespace-nowrap font-display tracking-[0.3em] uppercase text-sm text-gold-hp">
          <EnvelopeIcon className="h-5 w-5 text-gold-hp/80 shrink-0" />
          <span>Owl Post</span>
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
          <button
            type="button"
            onClick={markAllRead}
            disabled={busy}
            className="rounded-full border border-gold-hp/40 bg-gold-hp/10 px-4 py-1.5 font-display text-[10px] uppercase tracking-[0.3em] text-gold-hp transition hover:bg-gold-hp/20 disabled:opacity-60"
          >
            {busy ? "Marking…" : "Mark all read"}
          </button>
        )}
      </div>

      {loading ? (
        <p className="font-wizard italic text-silver-hp/50 text-sm py-4">Summoning owls…</p>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-10 text-center">
          <EnvelopeIcon className="h-12 w-12 text-silver-hp/20" />
          <p className="max-w-xs font-wizard italic text-silver-hp/55 text-sm">
            No owls yet. Join requests, approvals and payment updates will land here.
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-2.5" aria-live="polite">
          {items.map((n) => {
            const isUnread = !n.read;
            return (
              <li
                key={n.id}
                className={`flex gap-3 rounded-sm border bg-midnight/50 px-4 py-3 ${
                  isUnread ? "border-gold-hp/30 border-l-2 border-l-gold-hp" : "border-cyan-hp/15"
                }`}
              >
                <span
                  className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full border ${
                    isUnread ? "border-gold-hp/40 bg-gold-hp/10 text-gold-hp" : "border-cyan-hp/25 bg-cyan-hp/5 text-cyan-hp/70"
                  }`}
                >
                  <EnvelopeIcon className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                    <h3
                      className={`font-display text-[13px] tracking-wide wrap-break-word ${
                        isUnread ? "text-gold-hp" : "text-silver-hp/85"
                      }`}
                    >
                      {n.title}
                    </h3>
                    <time dateTime={n.created_at} className="shrink-0 font-mono text-[10px] text-silver-hp/40">
                      {relativeTime(n.created_at)}
                    </time>
                  </div>
                  {n.body && (
                    <p className="mt-1 font-wizard text-sm leading-snug text-silver-hp/75 wrap-break-word">
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
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
