// The Google Form link for volunteer applications.
export const VOLUNTEER_FORM_URL = "https://forms.gle/wM2qEnr3oB95wss89";
// The Google Form link for core-team applications.
export const CORE_TEAM_FORM_URL = "https://forms.gle/VrZB4PVeDMzMRscz5";

// Top-level navbar entries (kept lean — Call-for-X CTAs live in the Hero).
export const SITEMAP = [
  {
    href: "/about", label: "The Prophecy",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
        <path d="M3 5h6a3 3 0 0 1 3 3v12a3 3 0 0 0-3-3H3z" />
        <path d="M21 5h-6a3 3 0 0 0-3 3v12a3 3 0 0 1 3-3h6z" />
      </svg>
    ),
  },
  {
    href: "/timeline", label: "Timeline", soon: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
    ),
  },
  {
    href: "/events", label: "The Events", soon: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
        <path d="M5 4h14a2 2 0 0 1 2 2v3H3V6a2 2 0 0 1 2-2z" />
        <path d="M3 9v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9" />
        <path d="M8 2v4M16 2v4" />
      </svg>
    ),
  },
  {
    href: "/teams", label: "The Teams",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
        <circle cx="9" cy="8" r="3" />
        <circle cx="17" cy="9" r="2.2" />
        <path d="M3 20c0-3 3-5 6-5s6 2 6 5" />
        <path d="M15 20c0-2 2-3.5 4-3.5" />
      </svg>
    ),
  },
  {
    href: "/sponsors", label: "Sponsors",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
        <path d="M12 21s-7-4.35-7-10a4 4 0 0 1 7-2.65A4 4 0 0 1 19 11c0 5.65-7 10-7 10z" />
      </svg>
    ),
  },
];

// Sub-orders inside the /teams hub. All four share the project's cyan
// primary accent so the hub reads as one cohesive order — only the events
// hub keeps the per-track house colours.
const TEAM_COLOR = "#66FCF1"; // --hx-cyan
const TEAM_GLOW  = "rgba(102,252,241,0.35)";

export const TEAMS = [
  {
    slug: "organising-team",
    name: "Organising Team",
    rune: "✦",
    blurb: "The high council that shapes the entire night. Direction, scope, vision.",
    color: TEAM_COLOR,
    glow:  TEAM_GLOW,
    open:  false,
  },
  {
    slug: "evangelists",
    name: "Evangelists",
    rune: "✶",
    blurb: "The voice of the order — outreach, partners, the world beyond the walls.",
    color: TEAM_COLOR,
    glow:  TEAM_GLOW,
    open:  true,
    formUrl: "https://luma.com/vc0k1lcq",
  },
  {
    slug: "core-team",
    name: "Core Team",
    rune: "❖",
    blurb: "The architects on the floor — execution, ops, the spine of HexaFalls.",
    color: TEAM_COLOR,
    glow:  TEAM_GLOW,
    open:  true,
    formUrl: "https://forms.gle/VrZB4PVeDMzMRscz5",
  },
  {
    slug: "volunteers",
    name: "Volunteers",
    rune: "★",
    blurb: "Hands that steady the wand. Sign the scroll, join the order.",
    color: TEAM_COLOR,
    glow:  TEAM_GLOW,
    open:  true,
  },
];

// Tracks / events that run during HexaFalls — one per Hogwarts house.
//   Hackathon → Gryffindor gold
//   CP        → Ravenclaw blue
//   Gaming    → (Gryffindor) red
//   Hardware  → Slytherin green
export const EVENTS = [
  {
    slug: "hackathon",
    name: "The Hackathon",
    rune: "✦",
    blurb: "Fifty-eight hours of pure spellwork — full-stack, AI, anything that ships.",
    color: "#D4AF37", // gold
    glow:  "rgba(212,175,55,0.35)",
  },
  {
    slug: "cp",
    name: "Competitive Programming",
    rune: "⌬",
    blurb: "Duels of logic. Sharpen the wand, race the clock.",
    color: "#3B82F6", // ravenclaw blue
    glow:  "rgba(59,130,246,0.40)",
  },
  {
    slug: "gaming",
    name: "Gaming Arena",
    rune: "✶",
    blurb: "Stadium of charms — controller in hand, glory on the line.",
    color: "#EF4444", // gryffindor red
    glow:  "rgba(239,68,68,0.40)",
  },
  {
    slug: "hardware",
    name: "Hardware Hack",
    rune: "❖",
    blurb: "Solder, sparks, sensors. Magic that you can hold.",
    color: "#22C55E", // slytherin green
    glow:  "rgba(34,197,94,0.35)",
  },
];

// "Call for…" CTA buttons surfaced from the Hero (and reusable elsewhere).
export const CALLS = [
  {
    href: "/teams/core-team",
    label: "Call for Core Team",
    short: "Core Team",
    accent: "gold",
    open: true,
    blurb: "Open now — shape every spell from the inner circle.",
  },
  {
    href: "/judges",
    label: "Call for Judges & Mentors",
    short: "Judges & Mentors",
    accent: "cyan",
    blurb: "Wise hands. Sharp eyes. Guide the council.",
  },
  {
    href: "/sponsors",
    label: "Call for Sponsors",
    short: "Sponsors",
    accent: "cyan",
    blurb: "Stand beside the hall. Fuel the magic.",
  },
  {
    href: "/teams/volunteers",
    label: "Call for Volunteers",
    short: "Volunteers",
    accent: "gold",
    open: true,
    blurb: "Open now — sign the scroll, join the order.",
  },
];
