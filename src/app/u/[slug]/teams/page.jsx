// /u/[slug]/teams — a user's teams + solo entries (split out of the profile).

import { notFound } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import RegisterShell from "@/components/register/RegisterShell";
import PayButton from "@/components/profile/PayButton";
import { getDB } from "@/lib/db";
import { getSessionUser } from "@/lib/auth/server";
import { reconcileUserPayments } from "@/lib/pay/sync";
import { REGISTRATION_EVENTS, teamUrl, soloUrl, isPaidEvent, isPayableNow } from "@/lib/registration/events";

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

  // Owner viewing their own teams: reconcile pending payments first — a payment
  // only flips on the async webhook, so right after checkout the status can look
  // stale. Best-effort; never throw into render. Run BEFORE the squads query so
  // the freshly-settled status is reflected below.
  if (isOwner) {
    try {
      const h = await headers();
      const host = h.get("x-forwarded-host") ?? h.get("host");
      const proto = h.get("x-forwarded-proto") ?? "https";
      const origin = host ? `${proto}://${host}` : "";
      await reconcileUserPayments(db, { userId: user.id, origin });
    } catch {
      // ignore — render with whatever the DB currently holds
    }
  }

  const squads = await db
    .prepare(
      `SELECT s.id, s.event, s.name, s.tagline, s.status, s.paid, sm.role,
              (SELECT COUNT(*) FROM squad_members m WHERE m.squad_id = s.id) AS members
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

  const empty = squadRows.length === 0 && soloRows.length === 0;

  return (
    <main className="flex-1">
      <TopBar />
      <RegisterShell eyebrow="Profile" title="" accent="Teams" stack>
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
            <ul className="flex flex-col gap-3">
              {squadRows.map((s) => {
                const paid = isPaidEvent(s.event);
                const settled = s.status === "fees_settled" || s.paid === 1;
                const isLead = s.role === "leader";
                const payable = isPayableNow(s.event, s.status); // approved
                const teamTotal =
                  Number(s.members ?? 1) * (REGISTRATION_EVENTS[s.event]?.pricePerPerson ?? 0);
                return (
                  <li
                    key={s.id}
                    className="flex flex-col gap-3 rounded-sm border border-cyan-hp/20 bg-slate-hp/30 px-4 py-4 sm:px-5"
                  >
                    {/* Line 1 — name + tagline + event, all inline. */}
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span className="font-display text-base text-silver-hp">{s.name}</span>
                      {s.tagline && (
                        <span className="font-wizard italic text-silver-hp/60 text-sm">
                          {s.tagline}
                        </span>
                      )}
                      <span className="font-wizard text-xs text-silver-hp/45">
                        · {REGISTRATION_EVENTS[s.event]?.label ?? s.event}
                      </span>
                      <span className="ml-auto shrink-0 rounded-full border border-gold-hp/40 bg-gold-hp/10 px-2 py-0.5 font-display text-[9px] uppercase tracking-[0.35em] text-gold-hp/80">
                        {s.role}
                      </span>
                    </div>

                    {/* Line 2 — status + CTAs. */}
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusPill status={s.status} />
                      {paid &&
                        (settled ? (
                          <PaidChip />
                        ) : payable ? (
                          isOwner && isLead ? (
                            <>
                              <FeesDueChip />
                              <PayButton
                                event={s.event}
                                squadId={s.id}
                                price={teamTotal}
                                label={`PAY ₹${teamTotal} ↗`}
                              />
                            </>
                          ) : (
                            <AwaitingLeaderChip />
                          )
                        ) : null)}
                      <Link
                        href={teamUrl(s.event, s.id)}
                        className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-cyan-hp/40 bg-cyan-hp/10 px-3.5 py-1.5 font-display text-[10px] uppercase tracking-[0.3em] text-cyan-hp transition hover:bg-cyan-hp/20"
                      >
                        View team <span aria-hidden="true">→</span>
                      </Link>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          {soloRows.length > 0 && (
            <div>
              <h2 className="mb-3 font-display tracking-[0.3em] uppercase text-sm text-gold-hp hp-glow-gold">
                Entries
              </h2>
              <ul className="flex flex-col gap-2">
                {soloRows.map((e) => (
                  <li key={e.id}>
                    <Link
                      href={soloUrl(e.id)}
                      className="group flex items-center justify-between gap-3 rounded-sm border border-cyan-hp/20 bg-slate-hp/30 px-4 py-3 transition hover:border-cyan-hp/40 hover:bg-slate-hp/40"
                    >
                      <span className="font-display text-sm text-silver-hp">
                        {REGISTRATION_EVENTS[e.event]?.label ?? e.event}
                      </span>
                      <span className="flex items-center gap-2">
                        <StatusPill status={e.status} />
                        <span aria-hidden="true" className="text-cyan-hp/70 transition group-hover:translate-x-0.5">
                          →
                        </span>
                      </span>
                    </Link>
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
  shortlisted: "#A78BFA",
  approved: "#4ade80",
  rejected: "#EF4444",
  forming: "#66FCF1",
  submitted: "#D4AF37",
  fees_settled: "#4ade80",
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

function AwaitingLeaderChip() {
  return (
    <span className="rounded-full border border-silver-hp/30 bg-slate-hp/40 px-2.5 py-0.5 font-display text-[9px] uppercase tracking-[0.3em] text-silver-hp/70">
      Leader to pay
    </span>
  );
}
