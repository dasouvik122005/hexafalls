"use client";

// Signed-in user chip for the navbar: avatar + name + email pill that expands
// into a dropdown of account actions, with an unread-notification badge.
// Fetches /api/me on mount (TopBar is a shared client component), then the
// unread count from /api/notifications.

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

function initialOf(user) {
  const s = user?.displayName || user?.username || user?.email || "?";
  return s.trim().charAt(0).toUpperCase();
}

// Avatar: Gravatar (real photo or identicon); falls back to a lettered tile if
// the image fails to load.
function Avatar({ user, size = 30, text = "13px" }) {
  const [broken, setBroken] = useState(false);
  const cls =
    "shrink-0 grid place-items-center rounded-full bg-cyan-hp/15 font-display text-cyan-hp ring-1 ring-cyan-hp/40 overflow-hidden";
  const style = { height: size, width: size, fontSize: text };
  if (user?.avatarUrl && !broken) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={user.avatarUrl}
        alt=""
        referrerPolicy="no-referrer"
        onError={() => setBroken(true)}
        className={cls}
        style={style}
      />
    );
  }
  return (
    <span className={cls} style={style} aria-hidden="true">
      {initialOf(user)}
    </span>
  );
}

export default function UserMenu() {
  const [user, setUser] = useState(undefined); // undefined=loading, null=signed out
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    let alive = true;
    fetch("/api/me", { headers: { Accept: "application/json" } })
      .then((r) => r.json())
      .then((d) => {
        if (!alive) return;
        setUser(d.user ?? null);
        if (d.user) {
          fetch("/api/notifications", { headers: { Accept: "application/json" } })
            .then((r) => r.json())
            .then((n) => alive && setUnread(n.unread ?? 0))
            .catch(() => {});
        }
      })
      .catch(() => alive && setUser(null));
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (user === undefined) return null;

  if (user === null) {
    const returnTo = typeof window !== "undefined" ? window.location.pathname : "/";
    return (
      <a
        href={`/api/auth/login?return_to=${encodeURIComponent(returnTo)}`}
        className="inline-flex items-center gap-1.5 rounded-full border border-gold-hp/40 bg-gold-hp/10 px-3 py-1.5 sm:px-4 sm:py-2 font-display text-[10px] sm:text-[11px] uppercase tracking-[0.25em] sm:tracking-[0.3em] text-gold-hp transition hover:bg-gold-hp/20"
      >
        Sign in <span aria-hidden="true">↗</span>
      </a>
    );
  }

  const profileHref = `/u/${user.elixpoId}`;
  const name = user.displayName || (user.username ? `@${user.username}` : "Wizard");

  const items = [
    { label: "My Profile", href: profileHref },
    { label: "Teams & Entries", href: `${profileHref}/teams` },
    { label: "Notifications", href: `${profileHref}/notifications`, badge: unread },
    { label: "Browse Events", href: "/events" },
  ];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="group relative inline-flex items-center gap-2.5 rounded-full border border-cyan-hp/30 bg-slate-hp/40 py-1 pl-1 pr-2.5 sm:pr-3 backdrop-blur-sm transition hover:border-cyan-hp/55 hover:bg-slate-hp/60"
      >
        <span className="relative">
          <Avatar user={user} size={30} text="13px" />
          {unread > 0 && (
            <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-gold-hp px-1 font-display text-[9px] font-bold text-midnight">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </span>
        <span className="hidden sm:flex flex-col items-start leading-tight max-w-[12rem]">
          <span className="font-display text-[12px] tracking-[0.06em] text-silver-hp truncate w-full">
            {name}
          </span>
          <span className="font-mono text-[10px] text-silver-hp/55 truncate w-full">
            {user.email}
          </span>
        </span>
        <svg
          viewBox="0 0 24 24"
          className={`h-4 w-4 text-silver-hp/60 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className="absolute right-0 mt-2 w-72 overflow-hidden rounded-lg border border-cyan-hp/25 bg-midnight/95 backdrop-blur-md shadow-[0_18px_50px_rgba(0,0,0,0.6)]"
          >
            <div className="flex items-center gap-3 border-b border-silver-hp/10 px-4 py-3.5">
              <Avatar user={user} size={42} text="16px" />
              <div className="min-w-0">
                <p className="font-display text-sm text-silver-hp truncate">{name}</p>
                <p className="font-mono text-[11px] text-silver-hp/55 truncate">{user.email}</p>
              </div>
            </div>

            <div className="px-4 pt-2.5">
              <span className="inline-flex items-center rounded-full border border-gold-hp/40 bg-gold-hp/10 px-2.5 py-0.5 font-display text-[9px] uppercase tracking-[0.3em] text-gold-hp/90">
                {user.role}
              </span>
            </div>

            <nav className="flex flex-col py-2">
              {items.map((it) => (
                <Link
                  key={it.label}
                  href={it.href}
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between px-4 py-2.5 font-display text-[13px] tracking-[0.04em] text-silver-hp/85 transition hover:bg-cyan-hp/10 hover:text-cyan-hp"
                >
                  <span>{it.label}</span>
                  {it.badge > 0 && (
                    <span className="grid h-5 min-w-5 place-items-center rounded-full bg-gold-hp px-1.5 font-display text-[10px] font-bold text-midnight">
                      {it.badge > 9 ? "9+" : it.badge}
                    </span>
                  )}
                </Link>
              ))}
            </nav>

            <a
              href="/api/auth/logout"
              role="menuitem"
              className="block border-t border-silver-hp/10 px-4 py-3 font-display text-[13px] tracking-[0.04em] text-red-300/85 transition hover:bg-red-500/10 hover:text-red-300"
            >
              Sign out ↪
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
