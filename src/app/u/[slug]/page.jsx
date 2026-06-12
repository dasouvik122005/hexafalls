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
import { getDB } from "@/lib/db";
import { getSessionUser } from "@/lib/auth/server";
import { REGISTRATION_EVENTS, teamUrl } from "@/lib/registration/events";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const u = await getDB()
    .prepare(`SELECT username, display_name, bio FROM users WHERE username = ?`)
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
      `SELECT id, username, display_name, bio, college, year,
              github, linkedin, portfolio, role, created_at
         FROM users WHERE username = ?`,
    )
    .bind(slug)
    .first();
  if (!user) notFound();

  const isOwner = me?.id === user.id;

  const squads = await db
    .prepare(
      `SELECT s.id, s.event, s.name, s.status, sm.role
         FROM squad_members sm
         JOIN squads s ON s.id = sm.squad_id
        WHERE sm.user_id = ?
        ORDER BY sm.joined_at DESC`,
    )
    .bind(user.id)
    .all();

  return (
    <main className="flex-1">
      <TopBar />
      <RegisterShell eyebrow="Hacker scroll" title="@" accent={user.username}>
        <div className="flex flex-col gap-6">
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

          {/* Squads / teams */}
          {squads.results?.length > 0 && (
            <div>
              <h2 className="mb-3 font-display tracking-[0.3em] uppercase text-sm text-gold-hp hp-glow-gold">
                Teams
              </h2>
              <ul className="flex flex-col gap-2">
                {squads.results.map((s) => (
                  <li key={s.id}>
                    <Link
                      href={teamUrl(s.event, s.id)}
                      className="flex items-center justify-between gap-3 rounded-sm border border-cyan-hp/20 bg-slate-hp/30 px-4 py-3 transition hover:bg-slate-hp/50"
                    >
                      <span className="flex items-center gap-3">
                        <span className="font-display text-[9px] uppercase tracking-[0.35em] text-gold-hp/80 rounded-full border border-gold-hp/50 bg-gold-hp/10 px-2 py-0.5">
                          {s.role}
                        </span>
                        <span className="font-display text-sm text-silver-hp">{s.name}</span>
                        <span className="font-wizard text-xs text-silver-hp/55">
                          · {REGISTRATION_EVENTS[s.event]?.label ?? s.event}
                        </span>
                      </span>
                      <StatusPill status={s.status} />
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

const STATUS_COLOR = {
  forming:   "#66FCF1",
  submitted: "#D4AF37",
  approved:  "#4ade80",
  rejected:  "#EF4444",
  locked:    "#A78BFA",
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
