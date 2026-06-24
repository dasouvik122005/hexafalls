// /u/[slug]/teams — a user's teams + solo entries (split out of the profile).

import { notFound } from "next/navigation";
import Link from "next/link";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import RegisterShell from "@/components/register/RegisterShell";
import PayButton from "@/components/profile/PayButton";
import { getDB } from "@/lib/db";
import { getSessionUser } from "@/lib/auth/server";
import { REGISTRATION_EVENTS, teamUrl, isPaidEvent, isPayableNow } from "@/lib/registration/events";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const u = await getDB()
    .prepare(`SELECT username FROM users WHERE elixpo_id = ?`)
    .bind(slug)
    .first();
  return { title: u ? `@${u.username} · Teams · HexaFalls` : "Teams · HexaFalls" };
}

export default async function UserTeamsPage({ params }) {
  const { slug } = await params;
  const db = getDB();
  const me = await getSessionUser();

  const user = await db
    .prepare(`SELECT id, elixpo_id, username, display_name FROM users WHERE elixpo_id = ?`)
    .bind(slug)
    .first();
  if (!user) notFound();
  const isOwner = me?.id === user.id;

  const squads = await db
    .prepare(
      `SELECT s.id, s.event, s.name, s.status, sm.role
         FROM squad_members sm JOIN squads s ON s.id = sm.squad_id
        WHERE sm.user_id = ? ORDER BY sm.joined_at DESC`,
    )
    .bind(user.id)
    .all();
  const squadRows = squads.results ?? [];

  const soloRes = await db
    .prepare(`SELECT id, event, status FROM solo_registrations WHERE user_id = ? ORDER BY created_at DESC`)
    .bind(user.id)
    .all();
  const soloRows = soloRes.results ?? [];

  const paidSquadIds = new Set();
  const paidSquads = squadRows.filter((s) => isPaidEvent(s.event));
  if (paidSquads.length > 0) {
    const ph = paidSquads.map(() => "?").join(",");
    const payRes = await db
      .prepare(`SELECT squad_id FROM payments WHERE user_id = ? AND status = 'paid' AND squad_id IN (${ph})`)
      .bind(user.id, ...paidSquads.map((s) => s.id))
      .all();
    for (const p of payRes.results ?? []) paidSquadIds.add(p.squad_id);
  }

  const empty = squadRows.length === 0 && soloRows.length === 0;

  return (
    <main className="flex-1">
      <TopBar />
      <RegisterShell eyebrow="Profile" title="Teams &" accent="Entries" stack>
        <div className="flex flex-col gap-6">
          <Link
            href={`/u/${user.elixpo_id}`}
            className="self-start font-display text-[10px] uppercase tracking-[0.35em] text-cyan-hp/80 hover:text-cyan-hp"
          >
            ← back to profile
          </Link>

          {empty && (
            <p className="font-wizard italic text-silver-hp/65 text-center text-sm py-6">
              No teams or entries yet. Pick an event to sign on.
            </p>
          )}

          {squadRows.length > 0 && (
            <div>
              <h2 className="mb-3 font-display tracking-[0.3em] uppercase text-sm text-gold-hp hp-glow-gold">
                Teams
              </h2>
              <ul className="flex flex-col gap-2">
                {squadRows.map((s) => {
                  const paid = isPaidEvent(s.event);
                  const hasPaid = paidSquadIds.has(s.id);
                  return (
                    <li
                      key={s.id}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-sm border border-cyan-hp/20 bg-slate-hp/30 px-4 py-3"
                    >
                      <Link
                        href={teamUrl(s.event, s.id)}
                        className="flex flex-1 items-center gap-3 min-w-0 transition hover:opacity-80"
                      >
                        <span className="font-display text-[9px] uppercase tracking-[0.35em] text-gold-hp/80 rounded-full border border-gold-hp/50 bg-gold-hp/10 px-2 py-0.5">
                          {s.role}
                        </span>
                        <span className="font-display text-sm text-silver-hp">{s.name}</span>
                        <span className="font-wizard text-xs text-silver-hp/55">
                          · {REGISTRATION_EVENTS[s.event]?.label ?? s.event}
                        </span>
                      </Link>
                      <span className="flex items-center gap-2">
                        {paid &&
                          (hasPaid ? (
                            <PaidChip />
                          ) : (
                            <>
                              <FeesDueChip />
                              {isOwner && isPayableNow(s.event, s.status) && (
                                <PayButton event={s.event} squadId={s.id} />
                              )}
                            </>
                          ))}
                        <StatusPill status={s.status} />
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {soloRows.length > 0 && (
            <div>
              <h2 className="mb-3 font-display tracking-[0.3em] uppercase text-sm text-gold-hp hp-glow-gold">
                Entries
              </h2>
              <ul className="flex flex-col gap-2">
                {soloRows.map((e) => (
                  <li
                    key={e.id}
                    className="flex items-center justify-between gap-3 rounded-sm border border-cyan-hp/20 bg-slate-hp/30 px-4 py-3"
                  >
                    <span className="font-display text-sm text-silver-hp">
                      {REGISTRATION_EVENTS[e.event]?.label ?? e.event}
                    </span>
                    <StatusPill status={e.status} />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </RegisterShell>
      <Footer />
    </main>
  );
}

const STATUS_COLOR = {
  registered: "#66FCF1",
  under_review: "#D4AF37",
  fees_settled: "#A78BFA",
  approved: "#4ade80",
  rejected: "#EF4444",
  forming: "#66FCF1",
  submitted: "#D4AF37",
  locked: "#A78BFA",
};

function StatusPill({ status }) {
  const c = STATUS_COLOR[status] ?? "#C5C6C7";
  return (
    <span
      className="rounded-full border px-2.5 py-0.5 font-display text-[9px] uppercase tracking-[0.35em]"
      style={{ borderColor: `${c}80`, color: c, backgroundColor: `${c}1a` }}
    >
      {status}
    </span>
  );
}

function PaidChip() {
  return (
    <span className="rounded-full border border-emerald-400/50 bg-emerald-400/10 px-2.5 py-0.5 font-display text-[9px] uppercase tracking-[0.3em] text-emerald-300">
      Paid ✓
    </span>
  );
}

function FeesDueChip() {
  return (
    <span className="rounded-full border border-gold-hp/50 bg-gold-hp/10 px-2.5 py-0.5 font-display text-[9px] uppercase tracking-[0.3em] text-gold-hp">
      Fees due
    </span>
  );
}
