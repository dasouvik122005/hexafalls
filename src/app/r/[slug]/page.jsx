// /r/[slug] — solo submission status page (the solo analogue of /t/[slug]).
//
// slug = solo_registrations.id lowercased (REG-…). Shows the entry's review
// status + the details the user submitted (CP handles / exhibition info) +
// reviewer notes. GATED: only the owner (or an admin/organizer) may view it,
// since exhibition entries carry school details.

import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import PageBackdrop from "@/components/PageBackdrop";
import { getDB } from "@/lib/db";
import { getSessionUser } from "@/lib/auth/server";
import { REGISTRATION_EVENTS, userUrl } from "@/lib/registration/events";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Your entry · HexaFalls",
  robots: { index: false, follow: false },
};

const STATUS_COLOR = {
  registered:   "#66FCF1",
  under_review: "#D4AF37",
  submitted:    "#D4AF37",
  shortlisted:  "#A78BFA",
  approved:     "#4ade80",
  confirmed:    "#4ade80",
  rejected:     "#EF4444",
};

const STATUS_NOTE = {
  under_review: "Your entry is in review — we'll update you here.",
  submitted:    "Your entry is in review — we'll update you here.",
  shortlisted:  "You've been shortlisted! Final confirmation is on the way.",
  approved:     "Approved — your spot is locked in.",
  confirmed:    "Confirmed — your spot is locked in.",
  rejected:     "This entry needs changes — see the reviewer's notes.",
};

export default async function SoloSubmissionPage({ params }) {
  const { slug } = await params;
  const db = getDB();
  const me = await getSessionUser();

  const reg = await db
    .prepare(
      `SELECT id, user_id, event, details_json, status, created_at,
              reviewed_at, review_notes
         FROM solo_registrations WHERE id = ?`,
    )
    .bind(slug.toUpperCase())
    .first();
  if (!reg) notFound();

  // Owner or admin/organizer only (exhibition entries hold school details).
  const isOwner = me?.id === reg.user_id;
  const isAdmin = me?.role === "admin" || me?.role === "organizer";
  if (!me || (!isOwner && !isAdmin)) {
    redirect(me ? `/u/${me.elixpo_id}` : "/events");
  }

  const owner = await db
    .prepare(`SELECT elixpo_id, username, display_name FROM users WHERE id = ?`)
    .bind(reg.user_id)
    .first();

  const cfg = REGISTRATION_EVENTS[reg.event];
  const eventLabel = cfg?.label ?? reg.event;
  let details = {};
  try {
    details = JSON.parse(reg.details_json ?? "{}") ?? {};
  } catch {
    details = {};
  }
  const handles = details.platformHandles ?? null;

  return (
    <main className="flex-1">
      <TopBar />
      <section className="relative isolate overflow-hidden min-h-screen px-6 pt-28 pb-24">
        <PageBackdrop />
        <div className="mx-auto w-full max-w-2xl">
          {owner?.elixpo_id && (
            <Link
              href={userUrl(owner.elixpo_id)}
              className="font-display text-[10px] uppercase tracking-[0.35em] text-cyan-hp/80 hover:text-cyan-hp"
            >
              ← back to profile
            </Link>
          )}

          <div className="mt-6 mb-8 flex flex-col gap-1.5">
            <span className="font-display text-[10px] uppercase tracking-[0.45em] text-cyan-hp/70">
              {eventLabel} · Solo entry
            </span>
            <h1 className="font-display text-2xl sm:text-3xl tracking-tight text-silver-hp">
              Your entry
            </h1>
          </div>

          {/* Status */}
          <div className="flex flex-col items-start gap-3 border-y border-cyan-hp/10 py-6">
            <StatusPill status={reg.status} />
            <p className="font-wizard italic text-silver-hp/75 text-sm">
              {STATUS_NOTE[reg.status] ?? `This entry is ${reg.status}.`}
            </p>
            {reg.status === "rejected" && reg.review_notes && (
              <p className="font-wizard text-red-300/85 text-sm">
                Reviewer notes: {reg.review_notes}
              </p>
            )}
          </div>

          {/* Submitted details */}
          <section className="mt-8 flex flex-col gap-4">
            <h2 className="font-display text-[11px] uppercase tracking-[0.4em] text-gold-hp/80">
              Your submission
            </h2>

            {handles ? (
              <ul className="flex flex-col gap-2">
                {handles.codeforces && (
                  <HandleRow label="Codeforces" href={`https://codeforces.com/profile/${handles.codeforces}`} handle={handles.codeforces} />
                )}
                {handles.leetcode && (
                  <HandleRow label="LeetCode" href={`https://leetcode.com/u/${handles.leetcode}`} handle={handles.leetcode} />
                )}
                {handles.codechef && (
                  <HandleRow label="CodeChef" href={`https://www.codechef.com/users/${handles.codechef}`} handle={handles.codechef} />
                )}
              </ul>
            ) : details.schoolName ? (
              <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Detail label="School" value={details.schoolName} />
                <Detail label="Exhibit" value={details.exhibitTitle} />
                {details.schoolId && <Detail label="School ID" value={details.schoolId} />}
                {details.schoolDetails && (
                  <Detail label="Details" value={details.schoolDetails} wide />
                )}
              </dl>
            ) : (
              <p className="font-wizard italic text-silver-hp/55 text-sm">
                No extra details on file.
              </p>
            )}
          </section>
        </div>
      </section>
      <Footer />
    </main>
  );
}

function HandleRow({ label, href, handle }) {
  return (
    <li className="flex items-center justify-between gap-3 rounded-sm border border-cyan-hp/15 bg-slate-hp/20 px-4 py-3">
      <span className="font-display text-[10px] uppercase tracking-[0.35em] text-cyan-hp/80">
        {label}
      </span>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="font-mono text-sm text-silver-hp hover:text-cyan-hp"
      >
        @{handle} ↗
      </a>
    </li>
  );
}

function Detail({ label, value, wide }) {
  return (
    <div className={`flex flex-col gap-1.5 ${wide ? "sm:col-span-2" : ""}`}>
      <span className="font-display text-[9px] uppercase tracking-[0.4em] text-cyan-hp/70">
        {label}
      </span>
      <span className="font-wizard text-silver-hp/85 text-sm whitespace-pre-wrap">{value}</span>
    </div>
  );
}

function StatusPill({ status }) {
  const c = STATUS_COLOR[status] ?? "#C5C6C7";
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full border px-3 py-1 font-display text-[10px] uppercase tracking-[0.45em]"
      style={{ borderColor: `${c}80`, color: c, backgroundColor: `${c}1a` }}
    >
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full rounded-full opacity-70 animate-ping" style={{ backgroundColor: c }} />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ backgroundColor: c }} />
      </span>
      {status}
    </span>
  );
}
