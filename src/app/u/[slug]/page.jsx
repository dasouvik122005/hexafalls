// /u/[slug] — PUBLIC user profile (root-level), keyed by elixpo_id.
//
// Anyone can view. Reads like a real profile page: an avatar-led header
// (avatar + name + handle + role/verified badges + bio + links), then an
// identity strip and navigation rows. The owner gets an "Edit profile" button
// → /u/{slug}/settings (the edit form lives there, gated).

import { notFound } from "next/navigation";
import Link from "next/link";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import RoughButton from "@/components/RoughButton";
import PageBackdrop from "@/components/PageBackdrop";
import { getDB } from "@/lib/db";
import { getSessionUser } from "@/lib/auth/server";

export const dynamic = "force-dynamic";

const ZEALEY_URL = "https://zealey.elixpo.com"; // evangelist tracking platform (placeholder)

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const u = await getDB()
    .prepare(`SELECT username, display_name, bio FROM users WHERE elixpo_id = ?`)
    .bind(slug)
    .first();
  if (!u) return { title: "Hacker · HexaFalls" };
  const name = u.display_name ?? "@" + u.username;
  return {
    title: `${name} · HexaFalls Hackers`,
    description:
      u.bio ?? `${name} is signed on for HexaFalls 2026 at JIS University.`,
  };
}

export default async function UserProfilePage({ params }) {
  const { slug } = await params;
  const db = getDB();
  const me = await getSessionUser();

  const user = await db
    .prepare(
      `SELECT id, elixpo_id, username, display_name, bio, college, year,
              github, linkedin, portfolio, role, avatar_url, gdg_email,
              gdg_verified, created_at
         FROM users WHERE elixpo_id = ?`,
    )
    .bind(slug)
    .first();
  if (!user) notFound();

  const isOwner = me?.id === user.id;
  const name = user.display_name ?? (user.username ? `@${user.username}` : "Wizard");
  const hasLinks = user.github || user.linkedin || user.portfolio;
  // Verified === the profile is actually complete (same rule as the save API).
  // Derive it here so the chip is always accurate, even for rows whose stale
  // gdg_verified flag predates the profile-completeness rule. Portfolio optional.
  const verified = Boolean(
    user.college &&
      Number.isInteger(user.year) &&
      user.github &&
      user.linkedin &&
      user.bio &&
      user.gdg_email,
  );

  // Is this profile an evangelist? Either the legacy users.role flag, or a
  // user_roles row granting the hexafalls_evangelists fixed role.
  let isEvangelist = user.role === "evangelist";
  if (!isEvangelist) {
    const ev = await db
      .prepare(
        `SELECT 1 FROM user_roles
          WHERE user_id = ? AND role = 'hexafalls_evangelists' LIMIT 1`,
      )
      .bind(user.id)
      .first();
    isEvangelist = !!ev;
  }

  return (
    <main className="flex-1">
      <TopBar />
      <section className="relative isolate overflow-hidden min-h-screen px-6 pt-28 pb-24">
        <PageBackdrop />
        <div className="mx-auto w-full max-w-3xl">
          {isOwner && (
            <p className="mb-6 text-center font-display text-[10px] uppercase tracking-[0.45em] text-cyan-hp/70 sm:text-left">
              Welcome back
            </p>
          )}

          {/* Profile header — avatar + identity. */}
          <header className="flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:gap-8">
            <Avatar src={user.avatar_url} name={name} />

            <div className="flex min-w-0 flex-1 flex-col items-center gap-3 text-center sm:items-start sm:text-left">
              <div className="flex flex-col gap-1">
                <h1 className="font-display text-3xl sm:text-4xl tracking-tight text-silver-hp">
                  {name}
                </h1>
                {user.username && (
                  <span className="font-mono text-sm text-silver-hp/55">@{user.username}</span>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <RolePill role={user.role} />
                {verified && <VerifiedPill />}
              </div>

              {user.bio && (
                <p className="max-w-xl font-wizard text-silver-hp/80 text-base leading-relaxed whitespace-pre-wrap wrap-break-word">
                  {user.bio}
                </p>
              )}

              {hasLinks && (
                <div className="mt-1 flex flex-wrap justify-center gap-2 sm:justify-start">
                  {user.github && (
                    <ExtLink href={`https://github.com/${user.github}`} label={`GitHub · @${user.github}`} />
                  )}
                  {user.linkedin && (
                    <ExtLink href={`https://linkedin.com/in/${user.linkedin}`} label={`LinkedIn · @${user.linkedin}`} />
                  )}
                  {user.portfolio && <ExtLink href={user.portfolio} label="Portfolio" />}
                </div>
              )}

              {isOwner && (
                <div className="mt-2">
                  <RoughButton
                    as="link"
                    href={`/u/${user.elixpo_id}/settings`}
                    color="#66FCF1"
                    fill={false}
                    seed={47}
                    className="px-7 py-2.5 leading-none text-[11px] tracking-[0.35em]"
                  >
                    EDIT PROFILE ↗
                  </RoughButton>
                </div>
              )}
            </div>
          </header>

          {/* Identity strip. */}
          <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-6 border-y border-cyan-hp/10 py-7 sm:grid-cols-4">
            <Stat label="ID" value={user.id} mono />
            <Stat label="College / School" value={user.college ?? "—"} />
            <Stat label="Year" value={user.year ?? "—"} />
            <Stat label="Verified" value={verified ? "Yes" : "No"} />
          </dl>

          {/* Evangelist → Zealey — a single quiet row, not a card. */}
          {isEvangelist && (
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-b border-violet-300/15 pb-7">
              <div className="flex flex-col gap-1">
                <span className="font-display text-[11px] uppercase tracking-[0.4em] text-violet-300/90">
                  Evangelist
                </span>
                <span className="font-wizard text-silver-hp/70 text-sm">
                  Track your outreach on Zealey.
                </span>
              </div>
              <RoughButton
                as="a"
                href={ZEALEY_URL}
                target="_blank"
                rel="noopener noreferrer"
                color="#A78BFA"
                fill={false}
                seed={97}
                className="px-8 py-3 leading-none text-[11px] tracking-[0.35em]"
              >
                OPEN ZEALEY ↗
              </RoughButton>
            </div>
          )}

          {/* Navigation rows. */}
          <div className="mt-10 flex flex-col gap-3">
            <NavRow
              href={`/u/${user.elixpo_id}/teams`}
              title="Teams & Entries"
              note="Squads, solo entries, statuses and fees."
            />
            {isOwner && (
              <NavRow
                href={`/u/${user.elixpo_id}/notifications`}
                title="Notifications"
                note="Owl post — requests, approvals and updates."
              />
            )}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}

function Avatar({ src, name }) {
  const initials = (name || "?")
    .replace(/^@/, "")
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={name}
        className="h-28 w-28 shrink-0 rounded-full border-2 border-cyan-hp/40 object-cover sm:h-32 sm:w-32"
      />
    );
  }
  return (
    <div className="grid h-28 w-28 shrink-0 place-items-center rounded-full border-2 border-cyan-hp/40 bg-slate-hp/50 font-display text-3xl text-cyan-hp sm:h-32 sm:w-32">
      {initials}
    </div>
  );
}

function RolePill({ role }) {
  return (
    <span className="inline-flex items-center rounded-full border border-gold-hp/50 bg-gold-hp/10 px-3 py-1 font-display text-[9px] uppercase tracking-[0.35em] text-gold-hp/90">
      {role}
    </span>
  );
}

function VerifiedPill() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/50 bg-emerald-400/10 px-3 py-1 font-display text-[9px] uppercase tracking-[0.35em] text-emerald-300">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
      Verified
    </span>
  );
}

function Stat({ label, value, mono }) {
  return (
    <div className="flex flex-col gap-1.5">
      <dt className="font-display text-[9px] uppercase tracking-[0.4em] text-cyan-hp/70">
        {label}
      </dt>
      <dd className={`${mono ? "font-mono" : "font-display"} text-sm text-silver-hp`}>
        {value}
      </dd>
    </div>
  );
}

function ExtLink({ href, label }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer me"
      className="inline-flex items-center gap-1.5 rounded-full border border-cyan-hp/40 bg-cyan-hp/10 px-3 py-1.5 font-display text-[10px] uppercase tracking-[0.3em] text-cyan-hp hover:bg-cyan-hp/20 transition"
    >
      {label} <span aria-hidden="true">↗</span>
    </a>
  );
}

function NavRow({ href, title, note }) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between gap-4 rounded-sm border border-cyan-hp/15 bg-slate-hp/20 px-5 py-4 transition hover:border-cyan-hp/40 hover:bg-slate-hp/40"
    >
      <span className="flex flex-col gap-0.5">
        <span className="font-display tracking-[0.2em] uppercase text-sm text-silver-hp">
          {title}
        </span>
        <span className="font-wizard text-xs text-silver-hp/60">{note}</span>
      </span>
      <span aria-hidden="true" className="text-cyan-hp/70 transition group-hover:translate-x-0.5">
        →
      </span>
    </Link>
  );
}
