// Squad-name naming convention — shared by the client (live validation + the
// greyed "forge" button) and the server (authoritative check). Pure JS, no deps.
//
// Rules:
//   - 2–48 characters
//   - no whitespace (single token)
//   - must START and END with a letter (no leading/trailing digit or symbol)
//   - allowed characters: letters, digits, and single . _ - separators between
//   - no doubled separators (no "a__b", "a--b")
//   - not NSFW / profane (basic blocklist, substring + leetspeak-normalised)

const MIN = 2;
const MAX = 10;

// Compact profanity blocklist. Matched against a leetspeak-normalised, letters-
// only form of the name, so "h3llo" → "hello", "a$$" → "ass", etc.
const BLOCKLIST = [
  "fuck", "shit", "bitch", "asshole", "bastard", "dick", "cunt", "pussy",
  "slut", "whore", "nigger", "nigga", "faggot", "fag", "retard", "rape",
  "nazi", "hitler", "porn", "sex", "boobs", "penis", "vagina", "cum",
  "jizz", "wank", "twat", "bollocks", "douche", "dildo", "anal", "milf",
];

const LEET = { "0": "o", "1": "i", "3": "e", "4": "a", "5": "s", "7": "t", "@": "a", "$": "s", "!": "i" };

function normalizeForProfanity(s) {
  return s
    .toLowerCase()
    .split("")
    .map((ch) => LEET[ch] ?? ch)
    .join("")
    .replace(/[^a-z]/g, "");
}

export function isProfane(name) {
  const norm = normalizeForProfanity(name);
  return BLOCKLIST.some((bad) => norm.includes(bad));
}

// Returns { ok: true } or { ok: false, error: <code> }.
export function validateSquadName(raw) {
  const name = typeof raw === "string" ? raw : "";
  if (name.length < MIN || name.length > MAX) return { ok: false, error: "name_length" };
  if (/\s/.test(name)) return { ok: false, error: "name_space" };
  if (!/^[A-Za-z]/.test(name)) return { ok: false, error: "name_start" };
  if (!/[A-Za-z]$/.test(name)) return { ok: false, error: "name_end" };
  if (!/^[A-Za-z0-9._-]+$/.test(name)) return { ok: false, error: "name_chars" };
  if (/[._-]{2,}/.test(name)) return { ok: false, error: "name_separators" };
  if (isProfane(name)) return { ok: false, error: "name_nsfw" };
  return { ok: true };
}

// Human-readable messages keyed by error code (used by client forms).
export const SQUAD_NAME_ERRORS = {
  name_length: "Squad name must be 2–10 characters.",
  name_space: "No spaces — use a single name (try - or _ instead).",
  name_start: "Must start with a letter.",
  name_end: "Must end with a letter.",
  name_chars: "Only letters, numbers and . _ - are allowed.",
  name_separators: "No doubled . _ - in a row.",
  name_nsfw: "Pick a cleaner name — that one's not allowed.",
  name_taken: "That squad name is already taken — pick another.",
};
