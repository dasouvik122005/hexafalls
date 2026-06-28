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
//   Hardware Competition    squad 1–4  (approval-based)
//   Hardware Exhibition     squad 1–4, school teams (school details)
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
    minMembers: 1,
    maxMembers: 4,
    gated: true, // approval-based
    pricePerPerson: 100, // ₹, charged only after approval
    fields: ["category"],
  },
  "hardware-exhibition": {
    label: "Hardware · Exhibition",
    mode: "squad",
    squadKind: "hardware_exhibit_squad",
    parentEvent: "hardware",
    minMembers: 1,
    maxMembers: 4,
    highSchoolOnly: true, // school students; free event
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

// Per-event time slots (from the timeline, src/lib/timelineData.js). Used to
// warn a user when they register for two events whose times overlap. ISO local
// strings in the same format compare chronologically as plain strings.
export const EVENT_SCHEDULE = {
  hackathon:              { start: "2026-07-25T10:00", end: "2026-07-27T20:00", label: "Jul 25, 10:00 AM → Jul 27" },
  "hardware-competition": { start: "2026-07-24T11:00", end: "2026-07-25T19:00", label: "Jul 24–25 (Robotic Games)" },
  "hardware-exhibition":  { start: "2026-07-24T11:00", end: "2026-07-24T18:00", label: "Jul 24, 11:00 AM → 6:00 PM" },
  gaming:                 { start: "2026-07-25T12:00", end: "2026-07-25T19:15", label: "Jul 25, 12:00 PM → 7:15 PM" },
  cp:                     { start: "2026-07-26T13:00", end: "2026-07-26T16:00", label: "Jul 26, 1:00 PM → 4:00 PM" },
};

// True if two events' time slots overlap.
export function eventsClash(a, b) {
  if (a === b) return false;
  const sa = EVENT_SCHEDULE[a];
  const sb = EVENT_SCHEDULE[b];
  if (!sa || !sb) return false;
  return sa.start < sb.end && sb.start < sa.end;
}

// Given the event being registered for and a list of events the user is already
// in, return the clashing ones (with their schedule labels).
export function clashingEvents(eventKey, otherEventKeys = []) {
  return otherEventKeys
    .filter((e) => eventsClash(eventKey, e))
    .map((e) => ({ event: e, label: REGISTRATION_EVENTS[e]?.label ?? e, when: EVENT_SCHEDULE[e]?.label }));
}

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

// Team review lifecycle:
//   registered → under_review → shortlisted → approved   (+ rejected)
// A team is SHORTLISTED once admins clear its review. For PAID events the leader
// must then pay the entry fee, which moves it to APPROVED (seats locked). FREE
// events skip the fee and go straight to approved on review.
export function paymentTimingFor() {
  return "on_shortlist";
}

// Can the leader pay the entry fee right now? Only paid events, only once the
// team has been SHORTLISTED (review cleared) and not yet approved/paid.
export function isPayableNow(eventKey, squadStatus) {
  if (!isPaidEvent(eventKey)) return false;
  return squadStatus === "shortlisted";
}

// Canonical URL for a team profile — root-level `/t/<slug>`. Squad id is
// stored uppercase in the DB (Crockford alphabet); we lowercase it for URLs
// and re-uppercase on read. (eventKey kept for signature compatibility.)
export function teamUrl(_eventKey, squadId) {
  return `/t/${squadId.toLowerCase()}`;
}

// Canonical URL for a solo submission — root-level `/r/<id>`. Id is stored
// uppercase (REG-…); we lowercase it for the URL and re-uppercase on read.
export function soloUrl(registrationId) {
  return `/r/${registrationId.toLowerCase()}`;
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
