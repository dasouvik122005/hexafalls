// The Google Form link for volunteer applications.
export const VOLUNTEER_FORM_URL = "https://forms.gle/wM2qEnr3oB95wss89";

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
    href: "/register", label: "Registration", soon: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
        <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
        <path d="M14 3v6h6" />
        <path d="M9 14h6M9 17h4" />
      </svg>
    ),
  },
  {
    href: "/team", label: "The Team",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
        <circle cx="9" cy="8" r="3" />
        <circle cx="17" cy="9" r="2.2" />
        <path d="M3 20c0-3 3-5 6-5s6 2 6 5" />
        <path d="M15 20c0-2 2-3.5 4-3.5" />
      </svg>
    ),
  },
];

// "Call for…" CTA buttons surfaced from the Hero (and reusable elsewhere).
export const CALLS = [
  {
    href: "/core-team",
    label: "Call for Core Team",
    short: "Core Team",
    accent: "cyan",
    blurb: "Shape every spell from the inner circle.",
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
    href: "/volunteer",
    label: "Call for Volunteers",
    short: "Volunteers",
    accent: "gold",
    open: true,
    blurb: "Open now — sign the scroll, join the order.",
  },
];
