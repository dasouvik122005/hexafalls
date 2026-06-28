"use client";

// Squad registration entry point: choose between creating a new squad or
// joining an existing one (request-to-join, leader-approved). Invite links
// remain the instant path — handled by /register/join/[token].

import { useState } from "react";
import RoughFrame from "@/components/RoughFrame";
import RoughButton from "@/components/RoughButton";
import SquadCreateForm from "./SquadCreateForm";

const REQ_ERRORS = {
  already_member: "You're already in this squad.",
  already_in_squad: "You're already in a squad for this event.",
  hardware_other_mode: "You can only enter one Hardware track — you're already in the other.",
  squad_full: "This squad is full.",
  squad_locked: "This squad is no longer open to new members.",
  request_pending: "You've already requested to join this squad.",
  gdg_required: "Join the GDG chapter first.",
  unauthorized: "Sign in to continue.",
  not_found: "This squad no longer exists.",
};

function TabButton({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-5 py-2 font-display text-[10px] uppercase tracking-[0.3em] transition ${
        active
          ? "bg-cyan-hp/15 text-cyan-hp ring-1 ring-cyan-hp/40"
          : "text-silver-hp/60 hover:text-silver-hp"
      }`}
    >
      {children}
    </button>
  );
}

function SquadRow({ squad }) {
  const [state, setState] = useState("idle"); // idle | sending | sent | error
  const [error, setError] = useState(null);
  const seatsLeft = Math.max(0, squad.maxMembers - squad.members);

  async function request() {
    setState("sending");
    setError(null);
    try {
      const res = await fetch(`/api/register/squad/${squad.id}/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(REQ_ERRORS[body.error] || body.error || `HTTP ${res.status}`);
        setState("error");
        return;
      }
      setState("sent");
    } catch (err) {
      setError(err.message);
      setState("error");
    }
  }

  return (
    <li className="flex items-center justify-between gap-3 rounded-sm border border-cyan-hp/20 bg-slate-hp/30 px-4 py-3">
      <div className="min-w-0">
        <p className="font-display text-sm text-silver-hp truncate">{squad.name}</p>
        {squad.tagline && (
          <p className="font-wizard text-xs text-silver-hp/55 truncate">{squad.tagline}</p>
        )}
        <p className="mt-0.5 font-display text-[9px] uppercase tracking-[0.3em] text-cyan-hp/60">
          {squad.members}/{squad.maxMembers} · {seatsLeft} seat{seatsLeft === 1 ? "" : "s"} left
        </p>
      </div>
      <div className="shrink-0 text-right">
        {state === "sent" ? (
          <span className="font-display text-[10px] uppercase tracking-[0.3em] text-emerald-300/90">
            Request sent ✓
          </span>
        ) : (
          <button
            type="button"
            onClick={request}
            disabled={state === "sending"}
            className="rounded-full border border-gold-hp/45 bg-gold-hp/10 px-4 py-1.5 font-display text-[10px] uppercase tracking-[0.3em] text-gold-hp transition hover:bg-gold-hp/20 disabled:opacity-60"
          >
            {state === "sending" ? "Sending…" : "Request to join"}
          </button>
        )}
        {state === "error" && error && (
          <p className="mt-1 font-wizard text-[11px] italic text-red-300">{error}</p>
        )}
      </div>
    </li>
  );
}

function BrowseSquads({ eventLabel, openSquads, onCreate }) {
  return (
    <RoughFrame
      seed={97}
      stroke="#66FCF1"
      mistColor="#66FCF1"
      strokeWidth={1.5}
      padding={26}
      className="w-full bg-slate-hp/35 backdrop-blur-sm"
      inner="flex flex-col gap-5"
    >
      <div className="flex flex-col gap-1.5">
        <h2 className="font-display tracking-[0.3em] uppercase text-sm text-cyan-hp hp-glow">
          Join an existing {eventLabel} squad
        </h2>
        <p className="font-wizard text-silver-hp/80 text-sm leading-relaxed">
          Send a request and the squad leader approves or declines it — you&apos;ll
          be notified either way. Got an invite link from a friend? Open it to
          join instantly instead.
        </p>
      </div>

      {openSquads.length === 0 ? (
        <div className="flex flex-col items-center gap-5 rounded-sm border border-cyan-hp/15 bg-midnight/40 px-6 py-10 text-center">
          {/* Sketched banner sigil */}
          <span className="relative grid h-16 w-16 place-items-center">
            <span
              aria-hidden="true"
              className="absolute h-16 w-16 rounded-full"
              style={{ background: "radial-gradient(circle, rgba(102,252,241,0.16), transparent 70%)" }}
            />
            <svg viewBox="0 0 24 24" className="relative h-8 w-8 text-cyan-hp" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 3v18" />
              <path d="M5 4h12l-2.5 3.5L17 11H5" />
            </svg>
          </span>

          <div className="flex flex-col gap-1.5">
            <h3 className="font-display text-base sm:text-lg tracking-tight text-silver-hp">
              No open squads yet
            </h3>
            <p className="mx-auto max-w-sm font-wizard text-silver-hp/70 text-sm leading-relaxed">
              Be the first to raise a banner for {eventLabel}. Forge a squad and
              others can request to join — or share your invite link to bring your
              own crew.
            </p>
          </div>

          <RoughButton
            type="button"
            onClick={onCreate}
            color="#D4AF37"
            glow="rgba(212,175,55,0.4)"
            shimmer
            seed={41}
            className="px-9 py-3.5 leading-none text-[12px] tracking-[0.35em]"
          >
            FORGE A SQUAD ↗
          </RoughButton>
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {openSquads.map((s) => (
            <SquadRow key={s.id} squad={s} />
          ))}
        </ul>
      )}
    </RoughFrame>
  );
}

export default function SquadEntry({ event, eventLabel, hasUsername, openSquads = [], maxMembers = 4 }) {
  const [tab, setTab] = useState("create");
  // A team of one (e.g. CP) can never be joined — no "Join a squad" tab.
  const solo = maxMembers <= 1;

  return (
    <div className="mt-6 sm:mt-8 flex flex-col gap-6">
      {!solo && (
        <div className="mx-auto inline-flex rounded-full border border-cyan-hp/25 bg-slate-hp/40 p-1 backdrop-blur-sm">
          <TabButton active={tab === "create"} onClick={() => setTab("create")}>
            Create a squad
          </TabButton>
          <TabButton active={tab === "join"} onClick={() => setTab("join")}>
            Join a squad
          </TabButton>
        </div>
      )}

      {solo || tab === "create" ? (
        <SquadCreateForm event={event} eventLabel={eventLabel} hasUsername={hasUsername} />
      ) : (
        <BrowseSquads
          eventLabel={eventLabel}
          openSquads={openSquads}
          onCreate={() => setTab("create")}
        />
      )}
    </div>
  );
}
