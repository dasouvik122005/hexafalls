"use client";

// Signed-in user chip for the navbar: name + email pill that expands into a
// dropdown of account actions. Fetches /api/me on mount (TopBar is a shared
// client component, so we can't pass the session user as a prop). Crisp, not
// rough-themed — per the visual conventions, small nav chrome stays clean.

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

function initialOf(user) {
  const s = user?.displayName || user?.username || user?.email || "?";
  return s.trim().charAt(0).toUpperCase();
}

export default function UserMenu() {
  const [user, setUser] = useState(undefined); // undefined = loading, null = signed out
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    let alive = true;
    fetch("/api/me", { headers: { Accept: "application/json" } })
      .then((r) => r.json())
      .then((d) => alive && setUser(d.user ?? null))
      .catch(() => alive && setUser(null));
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Loading: reserve nothing (avoid layout shift / SSR mismatch).
  if (user === undefined) return null;

  // Signed out → a compact sign-in link.
  if (user === null) {
    const returnTo =
      typeof window !== "undefined" ? window.location.pathname : "/";
    return (
      <a
        href={`/api/auth/login?return_to=${encodeURIComponent(returnTo)}`}
        className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-gold-hp/40 bg-gold-hp/10 px-3.5 py-1.5 font-display text-[10px] uppercase tracking-[0.3em] text-gold-hp transition hover:bg-gold-hp/20"
      >
        Sign in <span aria-hidden="true">↗</span>
      </a>
    );
  }

  const profileHref = `/u/${user.elixpoId}`;
  const name = user.displayName || (user.username ? `@${user.username}` : "Wizard");

  const items = [
    { label: "My Scroll · Profile", href: profileHref },
    { label: "Teams & Entries", href: profileHref },
    { label: "Notifications", href: profileHref },
    { label: "Browse Events", href: "/events" },
  ];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="group inline-flex items-center gap-2.5 rounded-full border border-cyan-hp/30 bg-slate-hp/40 py-1 pl-1 pr-2.5 sm:pr-3 backdrop-blur-sm transition hover:border-cyan-hp/55 hover:bg-slate-hp/60"
      >
        <span
          className="grid h-7 w-7 place-items-center rounded-full bg-cyan-hp/15 font-display text-[12px] text-cyan-hp ring-1 ring-cyan-hp/40"
          aria-hidden="true"
        >
          {initialOf(user)}
        </span>
        <span className="hidden sm:flex flex-col items-start leading-tight max-w-[12rem]">
          <span className="font-display text-[11px] tracking-[0.06em] text-silver-hp truncate w-full">
            {name}
          </span>
          <span className="font-mono text-[9px] text-silver-hp/55 truncate w-full">
            {user.email}
          </span>
        </span>
        <svg
          viewBox="0 0 24 24"
          className={`h-3.5 w-3.5 text-silver-hp/60 transition-transform ${open ? "rotate-180" : ""}`}
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
            className="absolute right-0 mt-2 w-60 overflow-hidden rounded-lg border border-cyan-hp/25 bg-midnight/95 backdrop-blur-md shadow-[0_18px_50px_rgba(0,0,0,0.6)]"
          >
            {/* header */}
            <div className="flex items-center gap-3 border-b border-silver-hp/10 px-4 py-3">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-cyan-hp/15 font-display text-sm text-cyan-hp ring-1 ring-cyan-hp/40">
                {initialOf(user)}
              </span>
              <div className="min-w-0">
                <p className="font-display text-[12px] text-silver-hp truncate">{name}</p>
                <p className="font-mono text-[10px] text-silver-hp/55 truncate">{user.email}</p>
              </div>
            </div>

            {/* role chip */}
            <div className="px-4 pt-2">
              <span className="inline-flex items-center rounded-full border border-gold-hp/40 bg-gold-hp/10 px-2 py-0.5 font-display text-[8px] uppercase tracking-[0.3em] text-gold-hp/90">
                {user.role}
              </span>
            </div>

            {/* links */}
            <nav className="flex flex-col py-1.5">
              {items.map((it) => (
                <Link
                  key={it.label}
                  href={it.href}
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 font-display text-[11px] tracking-[0.05em] text-silver-hp/85 transition hover:bg-cyan-hp/10 hover:text-cyan-hp"
                >
                  {it.label}
                </Link>
              ))}
            </nav>

            {/* sign out */}
            <a
              href="/api/auth/logout"
              role="menuitem"
              className="block border-t border-silver-hp/10 px-4 py-2.5 font-display text-[11px] tracking-[0.05em] text-red-300/85 transition hover:bg-red-500/10 hover:text-red-300"
            >
              Sign out ↪
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
