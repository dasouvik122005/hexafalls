"use client";

// Leader-only team control panel. Mounted on the team profile page:
//   <TeamSettings
//     squadId={squad.id}
//     event={squad.event}
//     inviteToken={squad.invite_token}
//     isLeader={isLeader}
//     members={memberRows}          // [{ id, role, username, display_name, elixpo_id }]
//     requests={pendingRequests}    // [{ id, user_id, username, display_name, elixpo_id, message }]
//   />
//
// Renders nothing meaningful unless `isLeader`. All mutations re-verify
// leadership server-side; this UI only POSTs/DELETEs and refreshes.

import { useState } from "react";
import { useRouter } from "next/navigation";
import RoughFrame from "@/components/RoughFrame";
import RoughButton from "@/components/RoughButton";
import InviteLink from "@/components/register/InviteLink";

const ERRORS = {
  forbidden: "Only the squad leader can do that.",
  not_found: "That squad no longer exists.",
  squad_full: "The squad is already at capacity.",
  squad_locked: "The squad is locked and can no longer change.",
  cannot_remove_leader: "You can't remove the leader — dismantle instead.",
  already_in_squad: "That person is already in a squad for this event.",
  already_decided: "This request was already handled.",
  request_not_found: "That request no longer exists.",
  not_a_member: "That person isn't a member.",
  db_failure: "Something went wrong. Try again.",
  unauthorized: "Sign in to continue.",
};

function label(m) {
  if (!m) return "(pending)";
  // Prefer the person's display name; fall back to their @handle.
  if (m.display_name) return m.username ? `${m.display_name} · @${m.username}` : m.display_name;
  return m.username ? `@${m.username}` : "(pending)";
}

export default function TeamSettings({
  squadId,
  event,
  inviteToken,
  isLeader,
  members = [],
  requests = [],
  maxMembers,
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(null); // a key identifying the in-flight action
  const [error, setError] = useState(null);
  const [confirmDismantle, setConfirmDismantle] = useState(false);

  if (!isLeader) {
    return (
      <p className="font-wizard italic text-silver-hp/55 text-sm">
        Only the squad leader can manage members and requests.
      </p>
    );
  }

  function showErr(body, res) {
    setError(ERRORS[body?.error] || body?.error || `HTTP ${res?.status ?? "?"}`);
  }

  async function act(key, run) {
    setBusy(key);
    setError(null);
    try {
      const res = await run();
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        showErr(body, res);
        return false;
      }
      return body;
    } catch (e) {
      setError(e.message);
      return false;
    } finally {
      setBusy(null);
    }
  }

  async function decide(requestId, decision) {
    const ok = await act(`req:${requestId}:${decision}`, () =>
      fetch(`/api/team/${squadId}/requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, decision }),
      }),
    );
    if (ok) router.refresh();
  }

  async function removeMember(uid) {
    const ok = await act(`rm:${uid}`, () =>
      fetch(`/api/team/${squadId}/members/${uid}`, { method: "DELETE" }),
    );
    if (ok) router.refresh();
  }

  async function dismantle() {
    const ok = await act("dismantle", () =>
      fetch(`/api/team/${squadId}/dismantle`, { method: "POST" }),
    );
    if (ok) {
      const me = members.find((m) => m.role === "leader");
      window.location.href = me?.elixpo_id ? `/u/${me.elixpo_id}` : "/";
    }
  }

  const nonLeaders = members.filter((m) => m.role !== "leader");
  const inviteUrl = inviteToken
    ? absoluteUrl(`/register/join/${inviteToken}`)
    : null;
  const seatsLeft = Math.max(0, (maxMembers ?? members.length) - members.length);

  return (
    <RoughFrame
      seed={89}
      stroke="#D4AF37"
      mistColor="#D4AF37"
      strokeWidth={1.4}
      padding={22}
      className="w-full bg-slate-hp/35 backdrop-blur-sm"
      inner="flex flex-col gap-7"
    >
      <h2 className="font-display tracking-[0.3em] uppercase text-sm text-gold-hp hp-glow-gold">
        Team settings
      </h2>

      {error && (
        <p className="font-wizard italic text-red-300 text-sm">{error}</p>
      )}

      {/* Invite link */}
      {inviteUrl && seatsLeft > 0 && (
        <InviteLink url={inviteUrl} remainingSeats={seatsLeft} />
      )}

      {/* Pending requests */}
      <section className="flex flex-col gap-3">
        <h3 className="font-display tracking-[0.3em] uppercase text-[11px] text-cyan-hp">
          Pending requests
        </h3>
        {requests.length === 0 ? (
          <p className="font-wizard italic text-silver-hp/55 text-sm">
            No pending requests.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {requests.map((r) => (
              <li
                key={r.id}
                className="flex flex-col gap-2 rounded-sm border border-cyan-hp/20 bg-slate-hp/30 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <span className="font-mono text-sm text-silver-hp">
                    {label(r)}
                  </span>
                  {r.message && (
                    <p className="font-wizard italic text-silver-hp/60 text-xs mt-1">
                      “{r.message}”
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 gap-2">
                  <RoughButton
                    type="button"
                    onClick={() => decide(r.id, "approve")}
                    disabled={busy != null}
                    color="#4ade80"
                    glow="rgba(74,222,128,0.30)"
                    seed={41}
                    className="px-5 py-2 text-[10px] tracking-[0.3em]"
                  >
                    {busy === `req:${r.id}:approve` ? "…" : "APPROVE"}
                  </RoughButton>
                  <RoughButton
                    type="button"
                    onClick={() => decide(r.id, "deny")}
                    disabled={busy != null}
                    color="#C5C6C7"
                    fill={false}
                    seed={43}
                    className="px-5 py-2 text-[10px] tracking-[0.3em]"
                  >
                    {busy === `req:${r.id}:deny` ? "…" : "DENY"}
                  </RoughButton>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Members */}
      <section className="flex flex-col gap-3">
        <h3 className="font-display tracking-[0.3em] uppercase text-[11px] text-cyan-hp">
          Members
        </h3>
        <ul className="flex flex-col gap-2">
          {members.map((m) => (
            <li
              key={m.id}
              className="flex items-center justify-between gap-3 rounded-sm border border-cyan-hp/20 bg-slate-hp/30 px-4 py-3"
            >
              <span className="flex items-center gap-3 min-w-0">
                <span className="font-display text-[9px] uppercase tracking-[0.35em] text-gold-hp/80 rounded-full border border-gold-hp/50 bg-gold-hp/10 px-2 py-0.5">
                  {m.role}
                </span>
                <span className="font-mono text-sm text-silver-hp truncate">
                  {label(m)}
                </span>
              </span>
              {m.role !== "leader" && (
                <RoughButton
                  type="button"
                  onClick={() => removeMember(m.id)}
                  disabled={busy != null}
                  color="#EF4444"
                  fill={false}
                  seed={47}
                  className="shrink-0 px-4 py-1.5 text-[10px] tracking-[0.3em]"
                >
                  {busy === `rm:${m.id}` ? "…" : "REMOVE"}
                </RoughButton>
              )}
            </li>
          ))}
          {nonLeaders.length === 0 && (
            <li className="font-wizard italic text-silver-hp/55 text-sm">
              No other members yet.
            </li>
          )}
        </ul>
      </section>

      {/* Danger zone */}
      <section className="flex flex-col gap-3 border-t border-red-500/20 pt-5">
        <h3 className="font-display tracking-[0.3em] uppercase text-[11px] text-red-400">
          Danger zone
        </h3>
        <p className="font-wizard italic text-silver-hp/60 text-xs">
          Dismantling deletes the squad for everyone. This can&apos;t be undone.
        </p>
        {!confirmDismantle ? (
          <RoughButton
            type="button"
            onClick={() => setConfirmDismantle(true)}
            disabled={busy != null}
            color="#EF4444"
            fill={false}
            seed={53}
            className="self-start px-7 py-2.5 text-[11px] tracking-[0.35em]"
          >
            DISMANTLE TEAM
          </RoughButton>
        ) : (
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-wizard italic text-red-300 text-sm">
              Are you sure?
            </span>
            <RoughButton
              type="button"
              onClick={dismantle}
              disabled={busy != null}
              color="#EF4444"
              glow="rgba(239,68,68,0.35)"
              seed={59}
              className="px-7 py-2.5 text-[11px] tracking-[0.35em]"
            >
              {busy === "dismantle" ? "DISMANTLING…" : "YES, DISMANTLE"}
            </RoughButton>
            <RoughButton
              type="button"
              onClick={() => setConfirmDismantle(false)}
              disabled={busy != null}
              color="#C5C6C7"
              fill={false}
              seed={61}
              className="px-7 py-2.5 text-[11px] tracking-[0.35em]"
            >
              CANCEL
            </RoughButton>
          </div>
        )}
      </section>
    </RoughFrame>
  );
}

function absoluteUrl(path) {
  if (typeof window !== "undefined") return `${window.location.origin}${path}`;
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://hexafalls.org";
  return `${base}${path}`;
}
