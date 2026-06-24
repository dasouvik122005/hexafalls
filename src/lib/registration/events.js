// One source of truth for what shape each event's registration takes.
// Slugs match `EVENTS` in `src/lib/routes.jsx`; new tracks added there
// must be mirrored here.

// `parentEvent` maps each registration event onto the user-facing /events
// slug it belongs to. Team profiles live under
// `/events/<parentEvent>/teams/<slug>` so all squads of a given track share
// a parent URL even when the registration is split (e.g. hardware-exhibition
// + hardware-competition both nest under /events/hardware).
// NOTE: `fields` are placeholders pending the event-details handoff. The
// `mode` and member limits below reflect the confirmed rules:
//   Software (hackathon)    squad 2–4
//   Hardware Competition    squad 2–5  (approval-based)
//   Hardware Exhibition     solo, high-school only (school details)
//   Competitive Programming solo
//   Gaming                  squad 2–4
export const REGISTRATION_EVENTS = {
  hackathon: {
    label: "The Hackathon",
    mode: "squad",
    squadKind: "hackathon_squad",
    parentEvent: "hackathon",
    minMembers: 2,
    maxMembers: 4,
    pricePerPerson: 100, // ₹, charged only after approval
    fields: ["projectIdea", "track"],
  },
  "hardware-competition": {
    label: "Hardware · Competition",
    mode: "squad",
    squadKind: "hardware_competition_squad",
    parentEvent: "hardware",
    minMembers: 2,
    maxMembers: 5,
    gated: true, // approval-based
    pricePerPerson: 100, // ₹, charged only after approval
    fields: ["category"],
  },
  "hardware-exhibition": {
    label: "Hardware · Exhibition",
    mode: "solo",
    parentEvent: "hardware",
    highSchoolOnly: true,
    fields: ["schoolId", "schoolName", "schoolDetails", "exhibitTitle"],
  },
  cp: {
    label: "Competitive Programming",
    mode: "solo",
    parentEvent: "cp",
    fields: ["platformHandles"],
  },
  gaming: {
    label: "Gaming Arena",
    mode: "squad",
    squadKind: "gaming_squad",
    parentEvent: "gaming",
    minMembers: 2,
    maxMembers: 4,
    pricePerPerson: 100, // ₹, charged only after approval (gaming is now paid)
    fields: ["gameId", "discordHandle"],
  },
};

// Deferred — see docs/plan.md "timeline conflict warning". When a real
// schedule lands, give each event a `{ day, start, end }` slot and check
// overlap against the user's existing registrations at register time.
// export const EVENT_SCHEDULE = {
//   hackathon:              { day: "2026-XX-XX", start: "HH:MM", end: "HH:MM" },
//   "hardware-competition": { day: "2026-XX-XX", start: "HH:MM", end: "HH:MM" },
//   "hardware-exhibition":  { day: "2026-XX-XX", start: "HH:MM", end: "HH:MM" },
//   cp:                     { day: "2026-XX-XX", start: "HH:MM", end: "HH:MM" },
//   gaming:                 { day: "2026-XX-XX", start: "HH:MM", end: "HH:MM" },
// };

// Fixed roles — assigned manually by admins, never self-registered.
export const FIXED_ROLES = [
  "hexafalls_evangelists",
  "hexafalls_teams",
  "hexafalls_organisers",
  "hexafalls_judges",
  "hexafalls_mentors",
];

// Dynamic role granted to a user when they register for an event.
// e.g. hackathon → team_hackathon, hardware-competition → team_hardware_competition.
export function teamRoleFor(eventKey) {
  if (!REGISTRATION_EVENTS[eventKey]) return null;
  return `team_${eventKey.replace(/-/g, "_")}`;
}

// Whether an event charges an entry fee (drives the payment step + fees_settled).
export function isPaidEvent(eventKey) {
  return (REGISTRATION_EVENTS[eventKey]?.pricePerPerson ?? 0) > 0;
}

// Canonical URL for a team profile — root-level `/t/<slug>`. Squad id is
// stored uppercase in the DB (Crockford alphabet); we lowercase it for URLs
// and re-uppercase on read. (eventKey kept for signature compatibility.)
export function teamUrl(_eventKey, squadId) {
  return `/t/${squadId.toLowerCase()}`;
}

// Canonical URL for a public user profile — root-level `/u/<hexaID>`.
// Keyed by the Elixpo hexaID (users.elixpo_id, e.g. hf_mlh_…), NOT the
// username (which is a display handle only).
export function userUrl(hexaId) {
  return `/u/${hexaId}`;
}

// Map an /events parent slug (+ optional mode) → the registration event key.
// Hardware splits into two modes under the single /events/hardware page.
export function registrationKeyFor(eventSlug, mode) {
  if (eventSlug === "hardware") {
    if (mode === "competition") return "hardware-competition";
    if (mode === "exhibition") return "hardware-exhibition";
    return null; // caller renders a mode chooser
  }
  return REGISTRATION_EVENTS[eventSlug] ? eventSlug : null;
}

export function isSquadEvent(eventKey) {
  return REGISTRATION_EVENTS[eventKey]?.mode === "squad";
}

export function isSoloEvent(eventKey) {
  return REGISTRATION_EVENTS[eventKey]?.mode === "solo";
}

export function getRegistrationConfig(eventKey) {
  return REGISTRATION_EVENTS[eventKey] ?? null;
}
