// /events/[slug]/register — event-scoped registration.
//
// - [slug] is the user-facing /events slug (hackathon | hardware | cp | gaming).
// - Hardware splits into two modes via ?mode=exhibition|competition; with no
//   mode it renders a chooser.
// - Gates on session + GDG (server-side, via the auth helpers).
// - Squad events render <SquadCreateForm />; solo events a placeholder until
//   the solo flow lands.

import { notFound } from "next/navigation";
import Link from "next/link";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import RoughFrame from "@/components/RoughFrame";
import RoughButton from "@/components/RoughButton";
import RoughStar from "@/components/RoughStar";
import RegisterShell from "@/components/register/RegisterShell";
import SquadEntry from "@/components/register/SquadEntry";
import SoloRegisterForm from "@/components/register/SoloRegisterForm";
import ProfileGate from "@/components/register/ProfileGate";
import { getSessionUser } from "@/lib/auth/server";
import { EVENTS } from "@/lib/routes";
import {
  REGISTRATION_EVENTS,
  isSquadEvent,
  isSoloEvent,
  teamUrl,
  soloUrl,
  registrationKeyFor,
  clashingEvents,
} from "@/lib/registration/events";
import { getDB } from "@/lib/db";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return EVENTS.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const event = EVENTS.find((e) => e.slug === slug);
  if (!event) return { title: "Register · HexaFalls" };
  return {
    title: `Register · ${event.name} · HexaFalls`,
    description: `Register for ${event.name} at HexaFalls 2026. Co-developed by Ayushman Bhattacharya.`,
  };
}

export default async function EventRegisterPage({ params, searchParams }) {
  const { slug } = await params;
  const sp = (await searchParams) ?? {};
  const mode = typeof sp.mode === "string" ? sp.mode : undefined;

  const event = EVENTS.find((e) => e.slug === slug);
  if (!event) notFound();

  // Hardware with no mode → let the user pick exhibition vs competition.
  if (slug === "hardware" && !mode) {
    return (
      <ShellWrap eyebrow="Hardware" accent="Hardware">
        <HardwareModeChooser />
      </ShellWrap>
    );
  }

  const regKey = registrationKeyFor(slug, mode);
  const cfg = regKey ? REGISTRATION_EVENTS[regKey] : null;
  if (!cfg) notFound();

  const returnTo = `/events/${slug}/register${mode ? `?mode=${mode}` : ""}`;
  const user = await getSessionUser();

  // If a squad event and the caller is already in one, jump straight to it.
  let existingSquadId = null;
  if (user && isSquadEvent(regKey)) {
    const row = await getDB()
      .prepare(
        `SELECT s.id FROM squad_members sm
           JOIN squads s ON s.id = sm.squad_id
          WHERE sm.user_id = ? AND s.event = ? LIMIT 1`,
      )
      .bind(user.id, regKey)
      .first();
    existingSquadId = row?.id ?? null;
  }

  // If a solo event and the caller is already registered, show a short-circuit
  // scroll instead of the form.
  let existingSoloReg = false;
  let existingSoloId = null;
  if (user && user.gdg_verified && isSoloEvent(regKey)) {
    const row = await getDB()
      .prepare(
        `SELECT id FROM solo_registrations
          WHERE user_id = ? AND event = ? LIMIT 1`,
      )
      .bind(user.id, regKey)
      .first();
    existingSoloReg = Boolean(row);
    existingSoloId = row?.id ?? null;
  }

  // Open squads the caller could request to join (squad events, not already in
  // one). Public roster info only — team profiles are public anyway.
  let openSquads = [];
  if (user && user.gdg_verified && isSquadEvent(regKey) && !existingSquadId) {
    const rows = await getDB()
      .prepare(
        `SELECT s.id, s.name, s.tagline, s.max_members AS maxMembers,
                (SELECT COUNT(*) FROM squad_members sm WHERE sm.squad_id = s.id) AS members
           FROM squads s
          WHERE s.event = ? AND s.status IN ('forming','registered')
          ORDER BY s.created_at DESC
          LIMIT 40`,
      )
      .bind(regKey)
      .all();
    openSquads = (rows.results ?? [])
      .map((s) => ({
        id: s.id,
        name: s.name,
        tagline: s.tagline,
        members: Number(s.members),
        maxMembers: Number(s.maxMembers),
      }))
      .filter((s) => s.members < s.maxMembers);
  }

  // Timeline clash warning: which of the user's OTHER registrations overlap this
  // event's time slot. Informational only — registration is not blocked.
  let clashes = [];
  const showForm =
    user && user.gdg_verified && !existingSquadId && !existingSoloReg;
  if (showForm) {
    const sq = await getDB()
      .prepare(
        `SELECT DISTINCT s.event FROM squad_members sm
           JOIN squads s ON s.id = sm.squad_id WHERE sm.user_id = ?`,
      )
      .bind(user.id)
      .all();
    const so = await getDB()
      .prepare(`SELECT DISTINCT event FROM solo_registrations WHERE user_id = ?`)
      .bind(user.id)
      .all();
    const others = [
      ...(sq.results ?? []).map((r) => r.event),
      ...(so.results ?? []).map((r) => r.event),
    ].filter((e) => e !== regKey);
    clashes = clashingEvents(regKey, [...new Set(others)]);
  }

  return (
    <ShellWrap eyebrow={`Sign on · ${cfg.label}`} accent={cfg.label}>
      {!user && <SignInPanel returnTo={returnTo} />}
      {user && !user.gdg_verified && <ProfileGate elixpoId={user.elixpo_id} />}
      {showForm && clashes.length > 0 && <ClashWarning eventLabel={cfg.label} clashes={clashes} />}
      {user && user.gdg_verified && existingSquadId && (
        <DonePanel
          eyebrow="You're on a team"
          title="Already signed on"
          lede={`Your ${cfg.label} squad is locked in. Manage members, fees and status from your team scroll.`}
          primaryHref={teamUrl(regKey, existingSquadId)}
          primaryLabel="VISIT MY TEAM ↗"
        />
      )}
      {user && user.gdg_verified && existingSoloReg && (
        <DonePanel
          eyebrow="You're registered"
          title="Already registered"
          lede={`Your ${cfg.label} entry is in and under review. Track its status and details on your submission page.`}
          primaryHref={existingSoloId ? soloUrl(existingSoloId) : `/u/${user.elixpo_id}`}
          primaryLabel="VIEW YOUR ENTRY ↗"
        />
      )}
      {user && user.gdg_verified && !existingSquadId && !existingSoloReg &&
        (isSquadEvent(regKey) ? (
          <SquadEntry
            event={regKey}
            eventLabel={cfg.label}
            hasUsername={Boolean(user.username)}
            openSquads={openSquads}
            maxMembers={cfg.maxMembers}
          />
        ) : (
          <SoloRegisterForm
            event={regKey}
            eventLabel={cfg.label}
            hasUsername={Boolean(user.username)}
            backHref={`/events/${slug}`}
          />
        ))}
    </ShellWrap>
  );
}

function ShellWrap({ eyebrow, accent, children }) {
  return (
    <main className="flex-1">
      <TopBar />
      <RegisterShell stack eyebrow={eyebrow} title="Register for" accent={accent}>
        {children}
      </RegisterShell>
      <Footer />
    </main>
  );
}

function ClashWarning({ eventLabel, clashes }) {
  return (
    <RoughFrame
      seed={71}
      stroke="#D4AF37"
      mistColor="#D4AF37"
      strokeWidth={1.4}
      padding={20}
      className="mb-6 w-full bg-gold-hp/5 backdrop-blur-sm"
      inner="flex flex-col gap-2"
    >
      <span className="flex items-center gap-2 font-display text-[11px] uppercase tracking-[0.3em] text-gold-hp">
        <span aria-hidden="true">⚠</span> Schedule clash
      </span>
      <p className="font-wizard text-silver-hp/85 text-sm leading-relaxed">
        Heads up — <strong className="text-silver-hp">{eventLabel}</strong> overlaps in time with{" "}
        {clashes.map((c, i) => (
          <span key={c.event}>
            {i > 0 ? (i === clashes.length - 1 ? " and " : ", ") : ""}
            <strong className="text-silver-hp">{c.label}</strong>
            {c.when ? ` (${c.when})` : ""}
          </span>
        ))}
        , which you&apos;re already registered for. You can still sign up — just know
        you may not be able to attend both at once.
      </p>
    </RoughFrame>
  );
}

function HardwareModeChooser() {
  const modes = [
    {
      mode: "exhibition",
      label: "Exhibition",
      note: "School students · team of 1–4",
    },
    {
      mode: "competition",
      label: "Competition",
      note: "Team of 1–4 · approval-based",
    },
  ];
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {modes.map((m) => (
        <Link key={m.mode} href={`/events/hardware/register?mode=${m.mode}`} className="group">
          <RoughFrame
            seed={91 + m.mode.length}
            stroke="#22C55E"
            mistColor="#22C55E"
            strokeWidth={1.3}
            padding={20}
            className="h-full bg-slate-hp/30 backdrop-blur-sm transition group-hover:bg-slate-hp/50"
            inner="flex h-full flex-col gap-2"
          >
            <span className="font-display tracking-[0.3em] uppercase text-[10px] text-cyan-hp/80">
              Hardware
            </span>
            <span className="font-display text-base sm:text-lg text-silver-hp">{m.label}</span>
            <span className="font-wizard text-xs text-silver-hp/65">{m.note}</span>
            <span className="mt-auto font-display text-[10px] uppercase tracking-[0.35em] text-gold-hp/80 group-hover:translate-x-0.5 transition">
              Open the scroll →
            </span>
          </RoughFrame>
        </Link>
      ))}
    </div>
  );
}

function SignInPanel({ returnTo }) {
  return (
    <div className="relative mx-auto flex w-full max-w-xl flex-col items-center gap-7 px-4 py-6 text-center">
      {/* floating hand-drawn artifacts */}
      <RoughStar size={26} color="#66FCF1" className="absolute -left-1 top-3 hp-float opacity-70" style={{ animationDelay: "0.3s" }} />
      <RoughStar size={16} color="#D4AF37" className="absolute right-4 top-10 hp-float opacity-60" style={{ animationDelay: "1.2s" }} />
      <RoughStar size={20} color="#A78BFA" className="absolute left-8 bottom-6 hp-float opacity-50" style={{ animationDelay: "0.8s" }} />
      <RoughStar size={14} color="#66FCF1" className="absolute right-1 bottom-10 hp-float opacity-50" style={{ animationDelay: "1.7s" }} />

      {/* animated sigil — a glowing key in a pulsing aura */}
      <div className="relative grid place-items-center">
        <span
          aria-hidden="true"
          className="absolute h-28 w-28 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(212,175,55,0.22), transparent 70%)" }}
        />
        <span
          aria-hidden="true"
          className="absolute h-20 w-20 rounded-full border border-gold-hp/40 animate-ping"
          style={{ animationDuration: "2.8s" }}
        />
        <div className="relative grid h-20 w-20 place-items-center rounded-full border border-gold-hp/50 bg-midnight/60 backdrop-blur-sm hp-float">
          <svg
            viewBox="0 0 24 24"
            className="h-8 w-8 text-gold-hp"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ filter: "drop-shadow(0 0 8px rgba(212,175,55,0.55))" }}
          >
            <circle cx="9" cy="9" r="5.5" />
            <path d="M12.8 12.8 L21 21" />
            <path d="M18.5 18.5 l2.2 -2.2" />
            <path d="M15.8 15.8 l2.2 -2.2" />
          </svg>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="font-display tracking-[0.28em] uppercase text-base sm:text-lg text-gold-hp hp-glow-gold">
          One key, every gate
        </h2>
        <p className="mx-auto max-w-md font-wizard text-silver-hp/80 text-sm sm:text-base leading-relaxed">
          Sign on with Elixpo to register. A single account assembles your team,
          settles entry fees, and keeps every HexaFalls scroll in one place.
        </p>
      </div>

      <RoughButton
        as="a"
        href={`/api/auth/login?return_to=${encodeURIComponent(returnTo)}`}
        color="#D4AF37"
        glow="rgba(212,175,55,0.40)"
        fill={false}
        shimmer
        seed={19}
        className="px-10 sm:px-12 py-4 leading-none text-[13px] sm:text-[14px] tracking-[0.4em]"
      >
        SIGN IN WITH ELIXPO ↗
      </RoughButton>

      <span className="inline-flex items-center gap-2 font-display text-[10px] uppercase tracking-[0.35em] text-cyan-hp/55">
        <span className="h-1.5 w-1.5 rounded-full bg-cyan-hp/80 animate-pulse" />
        Secure Elixpo SSO · takes a few seconds
      </span>
    </div>
  );
}

// Confirmation state — already on a team / already registered. Mirrors the
// SignInPanel composition (animated sigil + copy) so the page never reads as an
// empty bordered box.
function DonePanel({ eyebrow, title, lede, primaryHref, primaryLabel }) {
  return (
    <div className="relative mx-auto flex w-full max-w-xl flex-col items-center gap-7 px-4 py-6 text-center">
      <RoughStar size={22} color="#D4AF37" className="absolute -left-1 top-3 hp-float opacity-70" style={{ animationDelay: "0.3s" }} />
      <RoughStar size={15} color="#66FCF1" className="absolute right-4 top-10 hp-float opacity-60" style={{ animationDelay: "1.2s" }} />
      <RoughStar size={18} color="#A78BFA" className="absolute left-8 bottom-6 hp-float opacity-50" style={{ animationDelay: "0.8s" }} />

      {/* success sigil — a sealed check in a pulsing aura */}
      <div className="relative grid place-items-center">
        <span
          aria-hidden="true"
          className="absolute h-28 w-28 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(74,222,128,0.18), transparent 70%)" }}
        />
        <span
          aria-hidden="true"
          className="absolute h-20 w-20 rounded-full border border-emerald-400/40 animate-ping"
          style={{ animationDuration: "2.8s" }}
        />
        <div className="relative grid h-20 w-20 place-items-center rounded-full border border-emerald-400/50 bg-midnight/60 backdrop-blur-sm hp-float">
          <svg
            viewBox="0 0 24 24"
            className="h-8 w-8 text-emerald-300"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ filter: "drop-shadow(0 0 8px rgba(74,222,128,0.5))" }}
          >
            <path d="M20 6 L9 17 l-5 -5" />
          </svg>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="font-display text-[10px] uppercase tracking-[0.45em] text-cyan-hp/70">
          {eyebrow}
        </span>
        <h2 className="font-display tracking-[0.28em] uppercase text-base sm:text-lg text-gold-hp hp-glow-gold">
          {title}
        </h2>
        <p className="mx-auto max-w-md font-wizard text-silver-hp/80 text-sm sm:text-base leading-relaxed">
          {lede}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <RoughButton
          as="link"
          href={primaryHref}
          color="#D4AF37"
          glow="rgba(212,175,55,0.35)"
          fill={false}
          shimmer
          seed={21}
          className="px-9 sm:px-11 py-3.5 leading-none text-[12px] sm:text-[13px] tracking-[0.35em]"
        >
          {primaryLabel}
        </RoughButton>
        <RoughButton
          as="link"
          href="/events"
          color="#C5C6C7"
          fill={false}
          seed={29}
          className="px-7 py-3 leading-none text-[11px] tracking-[0.3em]"
        >
          ← OTHER EVENTS
        </RoughButton>
      </div>
    </div>
  );
}
