// Public ID format for every role + entity. Crockford base32 alphabet (no
// I, L, O, U) so handwritten IDs don't get misread. Regexes are the source
// of truth — server-side validation re-imports these.

const ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

function randomBlock(len) {
  // crypto.getRandomValues is available in both Workers and Node.js 19+.
  const bytes = new Uint8Array(len);
  crypto.getRandomValues(bytes);
  let out = "";
  for (const b of bytes) out += ALPHABET[b % ALPHABET.length];
  return out;
}

// prefix → { regex, len }
export const ID_SPECS = {
  participant:           { prefix: "PART-",   len: 6 },
  hackathon_squad:       { prefix: "HACK-T-", len: 6 },
  hardware_exhibit_squad:{ prefix: "HW-X-T-", len: 6 },
  solo_registration:     { prefix: "REG-",    len: 6 },
  core:                  { prefix: "CORE-",   len: 5 },
  volunteer:             { prefix: "VOL-",    len: 5 },
  evangelist:            { prefix: "EVA-",    len: 5 },
  admin:                 { prefix: "ADM-",    len: 4 },
  organizer:             { prefix: "ORG-",    len: 4 },
};

export const ID_PATTERNS = Object.fromEntries(
  Object.entries(ID_SPECS).map(([k, { prefix, len }]) => [
    k,
    new RegExp(`^${prefix.replace(/-/g, "\\-")}[${ALPHABET}]{${len}}$`),
  ]),
);

export function generateId(kind) {
  const spec = ID_SPECS[kind];
  if (!spec) throw new Error(`Unknown ID kind: ${kind}`);
  return `${spec.prefix}${randomBlock(spec.len)}`;
}

// Used as squad invite tokens (URL-safe, longer, single-purpose).
export function generateInviteToken() {
  return randomBlock(24);
}

export function isValidId(kind, id) {
  return ID_PATTERNS[kind]?.test(id) ?? false;
}

// Role → the ID prefix that user.id must use. Participants get PART-*.
// Other roles are seeded by admins later; the registration flow only ever
// mints participant IDs.
export const ROLE_TO_ID_KIND = {
  participant: "participant",
  core:        "core",
  volunteer:   "volunteer",
  evangelist:  "evangelist",
  admin:       "admin",
  organizer:   "organizer",
};
