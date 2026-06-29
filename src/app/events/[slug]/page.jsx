// /events/[slug] — slim, action-first event page.
//
// Layout:  eyebrow → headline → 1-line context → REGISTER CTA(s) → back.
// No extra prose, no whisper. Hackathon and the solo tracks each have one
// CTA pointing at our internal /register/[event] flow. Hardware is one
// event with two registration modes (exhibition + competition), so it
// renders two CTAs side by side.

import { notFound } from "next/navigation";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import EventComingSoon from "@/components/EventComingSoon";
import HackathonDetails from "@/components/HackathonDetails";
import HardwareDetails from "@/components/HardwareDetails";
import CpDetails from "@/components/CpDetails";
import { EVENTS } from "@/lib/routes";
import { getDB } from "@/lib/db";
import { getSessionUser } from "@/lib/auth/server";
import { teamUrl } from "@/lib/registration/events";

export const dynamic = "force-dynamic";

// /events slug → the registration event key(s) that count as "registered".
const EVENT_KEYS = {
  hackathon: ["hackathon"],
  cp: ["cp"],
  gaming: ["gaming"],
  hardware: ["hardware-competition", "hardware-exhibition"],
};

// Returns { href, label } if the signed-in user is already registered for this
// event (squad membership or solo entry), else null.
async function getRegistration(slug) {
  const keys = EVENT_KEYS[slug];
  if (!keys) return null;
  const user = await getSessionUser();
  if (!user) return null;
  const db = getDB();
  const ph = keys.map(() => "?").join(",");

  const squad = await db
    .prepare(
      `SELECT s.id, s.event FROM squad_members sm JOIN squads s ON s.id = sm.squad_id
        WHERE sm.user_id = ? AND s.event IN (${ph}) LIMIT 1`,
    )
    .bind(user.id, ...keys)
    .first();
  if (squad) return { href: teamUrl(squad.event, squad.id), label: "VIEW MY TEAM" };

  const solo = await db
    .prepare(`SELECT id FROM solo_registrations WHERE user_id = ? AND event IN (${ph}) LIMIT 1`)
    .bind(user.id, ...keys)
    .first();
  if (solo) return { href: `/u/${user.elixpo_id}`, label: "VIEW MY ENTRY" };

  return null;
}

// One-line context strings — that's the entire writeup.
const CONTEXT = {
  hackathon: "58 hours of pure spellwork. Squads of 2–4.",
  hardware:  "Build the magic you can hold. Compete as a team of 2–4, or exhibit solo (high-school).",
  cp:        "Duels of logic. Solo entry, fastest hand wins.",
  gaming:    "Controller in hand, glory on the line. Squads of 2–4.",
};

export function generateStaticParams() {
  return EVENTS.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const event = EVENTS.find((e) => e.slug === slug);
  if (!event) return { title: "Event · HexaFalls Techfest" };
  if (event.slug === "hackathon") {
    return {
      title: "Software Hackathon — Judging Rubric · HexaFalls Techfest",
      description:
        "The 58-hour Software Hackathon at HexaFalls 2026, JIS University, Kolkata — judging rubric, scoring criteria, bonus points and submission requirements for squads of 2–4. Designed and engineered by Ayushman Bhattacharya.",
    };
  }
  if (event.slug === "hardware") {
    return {
      title: "Hardware Hack — Tracks · HexaFalls Techfest",
      description:
        "The Hardware Hack at HexaFalls 2026, JIS University, Kolkata — build the magic you can hold across Exhibition, Robo Sumo, Robo Soccer, Robo Terrence and Line Follower. Designed and engineered by Ayushman Bhattacharya.",
    };
  }
  return {
    title: `${event.name} · HexaFalls Techfest`,
    description: `${event.name} at HexaFalls 2026, the 58-hour TechFest at JIS University, Kolkata. ${CONTEXT[slug] ?? ""} Register now to compete. Designed and engineered by Ayushman Bhattacharya.`,
  };
}

export default async function EventPage({ params }) {
  const { slug } = await params;
  const event = EVENTS.find((e) => e.slug === slug);
  if (!event) notFound();

  const isHackathon = event.slug === "hackathon";
  const isHardware = event.slug === "hardware";
  const isCp = event.slug === "cp";
  const registered = await getRegistration(slug);

  return (
    <main className="flex-1">
      <TopBar />
      {isHackathon ? (
        <HackathonDetails registered={registered} />
      ) : isHardware ? (
        <HardwareDetails registered={registered} />
      ) : isCp ? (
        <CpDetails registered={registered} />
      ) : (
        <EventComingSoon event={event} />
      )}
      <Footer />
    </main>
  );
}
