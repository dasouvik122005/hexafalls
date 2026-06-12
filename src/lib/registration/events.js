// One source of truth for what shape each event's registration takes.
// Slugs match `EVENTS` in `src/lib/routes.jsx`; new tracks added there
// must be mirrored here.

// `parentEvent` maps each registration event onto the user-facing /events
// slug it belongs to. Team profiles live under
// `/events/<parentEvent>/teams/<slug>` so all squads of a given track share
// a parent URL even when the registration is split (e.g. hardware-exhibition
// + hardware-competition both nest under /events/hardware).
export const REGISTRATION_EVENTS = {
  hackathon: {
    label: "The Hackathon",
    mode: "squad",
    squadKind: "hackathon_squad",
    parentEvent: "hackathon",
    minMembers: 2,
    maxMembers: 4,
    fields: ["projectIdea", "track"],
  },
  "hardware-exhibition": {
    label: "Hardware · Exhibition",
    mode: "squad",
    squadKind: "hardware_exhibit_squad",
    parentEvent: "hardware",
    minMembers: 2,
    maxMembers: 5,
    fields: ["exhibitTitle", "shortDescription"],
  },
  "hardware-competition": {
    label: "Hardware · Competition",
    mode: "solo",
    parentEvent: "hardware",
    fields: ["category"],
  },
  cp: {
    label: "Competitive Programming",
    mode: "solo",
    parentEvent: "cp",
    fields: ["platformHandles"],
  },
  gaming: {
    label: "Gaming Arena",
    mode: "solo",
    parentEvent: "gaming",
    fields: ["gameId", "discordHandle"],
  },
};

// Canonical URL for a team profile — root-level `/t/<slug>`. Squad id is
// stored uppercase in the DB (Crockford alphabet); we lowercase it for URLs
// and re-uppercase on read. (eventKey kept for signature compatibility.)
export function teamUrl(_eventKey, squadId) {
  return `/t/${squadId.toLowerCase()}`;
}

// Canonical URL for a public user profile — root-level `/u/<username>`.
export function userUrl(username) {
  return `/u/${username}`;
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
