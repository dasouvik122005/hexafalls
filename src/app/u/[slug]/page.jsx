// /u/[slug] — public user profile (root-level).
//
// SEO-friendly: title + description derived from username + bio.
// Renders: identity card, bio, links, the squads this user belongs to.
// When the signed-in viewer is the profile owner, an inline editor is shown
// (replacing the old /register/me page).

import { notFound } from "next/navigation";
import Link from "next/link";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import RoughFrame from "@/components/RoughFrame";
import RegisterShell from "@/components/register/RegisterShell";
import ProfileEditor from "@/components/register/ProfileEditor";
import RoughButton from "@/components/RoughButton";
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
  return {
    title: `@${u.username} · HexaFalls Hackers`,
    description:
      u.bio ??
      `${u.display_name ?? "@" + u.username} is signed on for HexaFalls 2026 at JIS University.`,
  };
}

export default async function UserProfilePage({ params }) {
  const { slug } = await params;
  const db = getDB();
  const me = await getSessionUser();

  const user = await db
    .prepare(
      `SELECT id, elixpo_id, username, display_name, bio, college, year,
              github, linkedin, portfolio, role, created_at
         FROM users WHERE elixpo_id = ?`,
    )
    .bind(slug)
    .first();
  if (!user) notFound();

  const isOwner = me?.id === user.id;

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
      <RegisterShell
        eyebrow={isOwner ? "Welcome back" : "Hacker scroll"}
        title={isOwner ? "Hello" : ""}
        accent={user.username ? `@${user.username}` : user.display_name ?? "Wizard"}
      >
        <div className="flex flex-col gap-6">
          {/* Evangelist → Zealey */}
          {isEvangelist && (
            <div className="flex justify-center">
              <RoughButton
                as="a"
                href={ZEALEY_URL}
                target="_blank"
                rel="noopener noreferrer"
                color="#A78BFA"
                glow="rgba(167,139,250,0.40)"
                shimmer
                seed={97}
                className="px-8 py-3 text-[12px] tracking-[0.4em]"
              >
                OPEN ZEALEY ↗
              </RoughButton>
            </div>
          )}

          {/* Owner-only inline editor */}
          {isOwner && (
            <RoughFrame
              seed={151}
              stroke="#D4AF37"
              mistColor="#D4AF37"
              strokeWidth={1.4}
              padding={22}
              className="w-full bg-slate-hp/35 backdrop-blur-sm"
              inner="flex flex-col gap-4"
            >
              <span className="font-display tracking-[0.3em] uppercase text-[10px] text-gold-hp/80">
                This is you · edit your scroll
              </span>
              <ProfileEditor user={me} />
            </RoughFrame>
          )}

          {/* Identity */}
          <RoughFrame
            seed={139}
            stroke="#66FCF1"
            mistColor="#66FCF1"
            strokeWidth={1.4}
            padding={22}
            className="w-full bg-slate-hp/35 backdrop-blur-sm"
            inner="grid sm:grid-cols-2 gap-4"
          >
            <Stat label="Display name" value={user.display_name ?? "—"} />
            <Stat label="ID" value={user.id} mono />
            <Stat label="College" value={user.college ?? "—"} />
            <Stat label="Year" value={user.year ?? "—"} />
            <Stat label="Role" value={user.role} />
          </RoughFrame>

          {/* Bio */}
          {user.bio && (
            <RoughFrame
              seed={143}
              stroke="#D4AF37"
              mistColor="#D4AF37"
              strokeWidth={1.3}
              padding={20}
              className="w-full bg-slate-hp/30 backdrop-blur-sm"
            >
              <p className="font-wizard text-silver-hp/90 text-base leading-relaxed whitespace-pre-wrap">
                {user.bio}
              </p>
            </RoughFrame>
          )}

          {/* Links */}
          {(user.github || user.linkedin || user.portfolio) && (
            <div className="flex flex-wrap gap-2">
              {user.github && (
                <ExtLink href={`https://github.com/${user.github}`} label={`GitHub · @${user.github}`} />
              )}
              {user.linkedin && (
                <ExtLink href={`https://linkedin.com/in/${user.linkedin}`} label={`LinkedIn · @${user.linkedin}`} />
              )}
              {user.portfolio && <ExtLink href={user.portfolio} label="Portfolio" />}
            </div>
          )}

          {/* Quick links to the sub-pages */}
          <div className="grid sm:grid-cols-2 gap-3">
            <NavCard
              href={`/u/${user.elixpo_id}/teams`}
              title="Teams & Entries"
              note="Your squads, solo entries, statuses and fees."
            />
            {isOwner && (
              <NavCard
                href={`/u/${user.elixpo_id}/notifications`}
                title="Notifications"
                note="Owl post — requests, approvals and payment updates."
              />
            )}
          </div>
        </div>
      </RegisterShell>
      <Footer />
    </main>
  );
}

function Stat({ label, value, mono }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-display text-[9px] uppercase tracking-[0.4em] text-cyan-hp/80">
        {label}
      </span>
      <span className={`${mono ? "font-mono" : "font-display"} text-sm text-silver-hp`}>
        {value}
      </span>
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

function NavCard({ href, title, note }) {
  return (
    <Link
      href={href}
      className="group flex flex-col gap-1 rounded-sm border border-cyan-hp/25 bg-slate-hp/30 px-5 py-4 transition hover:border-cyan-hp/55 hover:bg-slate-hp/50"
    >
      <span className="flex items-center justify-between font-display tracking-[0.2em] uppercase text-sm text-silver-hp">
        {title}
        <span aria-hidden="true" className="text-cyan-hp/70 transition group-hover:translate-x-0.5">
          →
        </span>
      </span>
      <span className="font-wizard text-xs text-silver-hp/60">{note}</span>
    </Link>
  );
}
