// One source of truth for what shape each event's registration takes.
// Slugs match `EVENTS` in `src/lib/routes.jsx`; new tracks added there
// must be mirrored here.

export const REGISTRATION_EVENTS = {
  hackathon: {
    label: "The Hackathon",
    mode: "squad",
    squadKind: "hackathon_squad",
    minMembers: 2,
    maxMembers: 4,
    fields: ["projectIdea", "track"],
  },
  "hardware-exhibition": {
    label: "Hardware · Exhibition",
    mode: "squad",
    squadKind: "hardware_exhibit_squad",
    minMembers: 2,
    maxMembers: 5,
    fields: ["exhibitTitle", "shortDescription"],
  },
  "hardware-competition": {
    label: "Hardware · Competition",
    mode: "solo",
    fields: ["category"],
  },
  cp: {
    label: "Competitive Programming",
    mode: "solo",
    fields: ["platformHandles"],
  },
  gaming: {
    label: "Gaming Arena",
    mode: "solo",
    fields: ["gameId", "discordHandle"],
  },
};

export function isSquadEvent(eventKey) {
  return REGISTRATION_EVENTS[eventKey]?.mode === "squad";
}

export function isSoloEvent(eventKey) {
  return REGISTRATION_EVENTS[eventKey]?.mode === "solo";
}

export function getRegistrationConfig(eventKey) {
  return REGISTRATION_EVENTS[eventKey] ?? null;
}
