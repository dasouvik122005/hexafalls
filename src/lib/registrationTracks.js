// Registration form configs, one per event slug. Drives the generic
// RegistrationWizard. Keep colours aligned with EVENTS in routes.jsx so
// the form theming matches the event card on /events.

// Tiny mock HexaID directory used by the wizard's caster lookup. Ported from
// cp.js / software.js etc. Replace with a real API call when the backend
// lands — keep the function shape (slug -> {name, email}).
export const HEXA_DB = {
  "HXF-001": { name: "Aryan Sharma", email: "aryan@jisu.edu.in" },
  "HXF-002": { name: "Priya Das",    email: "priya@jisu.edu.in" },
  "HXF-003": { name: "Rohan Ghosh",  email: "rohan@jisu.edu.in" },
  "HXF-004": { name: "Sneha Patel",  email: "sneha@jisu.edu.in" },
  "HXF-005": { name: "Amit Paul",    email: "amit@jisu.edu.in" },
  "HXF-006": { name: "Ritika Bose",  email: "ritika@jisu.edu.in" },
  "HXF-007": { name: "Debjit Roy",   email: "debjit@jisu.edu.in" },
  "HXF-008": { name: "Manas Kundu",  email: "manas@jisu.edu.in" },
};

export function lookupHexaId(id) {
  if (!id) return null;
  return HEXA_DB[String(id).trim().toUpperCase()] || null;
}

const COMMON_HACKATHON_CHIPS = [
  "React", "Next.js", "Python", "Flutter", "Node.js", "Firebase",
  "MongoDB", "TensorFlow", "Docker", "AWS", "Figma", "Other",
];

const HARDWARE_CHIPS = [
  "Arduino", "Raspberry Pi", "ESP32", "3D Printing", "IoT Sensors",
  "Robotics", "PCB Design", "Embedded C", "FPGA", "Soldering", "CAD", "Other",
];

const CP_CHIPS = [
  "C++", "Python", "Java", "C", "Codeforces", "LeetCode",
  "CodeChef", "AtCoder", "HackerRank", "ICPC", "DSA", "Other",
];

export const REGISTRATION_TRACKS = {
  cp: {
    slug: "cp",
    name: "Competitive Programming",
    kind: "solo",
    color: "#3B82F6",
    glow:  "rgba(59,130,246,0.40)",
    headline: "Competitive Programming · Registration",
    eyebrow:  "Solo participation · individual event",
    blurb:    "Sharpen your logic. Conquer the arena.",
    chipsLabel: "Languages & Platforms",
    chips: CP_CHIPS,
    askExperience: {
      label: "Is this your first hackathon / CP contest?",
      yes: "Yes — first time competing",
      no:  "No — veteran coder",
    },
    submitLabel: "Cast the Scroll",
  },

  hackathon: {
    slug: "hackathon",
    name: "The Hackathon",
    kind: "team",
    color: "#D4AF37",
    glow:  "rgba(212,175,55,0.35)",
    headline: "The Hackathon · Registration",
    eyebrow:  "Summon your fellowship · team event",
    blurb:    "Summon your team. Sign the scroll. Enter the realm.",
    teamLabel: "Team",
    teamSizes: [2, 3, 4],
    chipsLabel: "Tech Arsenal",
    chips: COMMON_HACKATHON_CHIPS,
    askExperience: {
      label: "Is this your first hackathon?",
      yes: "Yes — first spell",
      no:  "No — walked this path before",
    },
    submitLabel: "Cast the Scroll",
  },

  gaming: {
    slug: "gaming",
    name: "Gaming Arena",
    kind: "squad",
    color: "#EF4444",
    glow:  "rgba(239,68,68,0.40)",
    headline: "Gaming Arena · Registration",
    eyebrow:  "Drop in with your squad",
    blurb:    "Lock in your squad. Drop into the arena. Last team standing wins.",
    teamLabel: "Squad",
    teamSizes: [
      { value: 2, label: "Duo (2)" },
      { value: 3, label: "Trio (3)" },
      { value: 4, label: "Squad (4)" },
    ],
    // gaming has no tech-skills step; replace with per-member game info
    chips: null,
    perMemberFields: [
      { name: "pubgId", label: "PUBG User ID", placeholder: "e.g. 5xxxxxxxxx" },
      { name: "rank",   label: "In-Game Rank", placeholder: "e.g. Crown V"     },
    ],
    askExperience: {
      label: "Is this your first gaming tournament?",
      yes: "Yes — first drop",
      no:  "No — seasoned warrior",
    },
    submitLabel: "Drop In",
  },

  hardware: {
    slug: "hardware",
    name: "Hardware Hack",
    kind: "team",
    color: "#22C55E",
    glow:  "rgba(34,197,94,0.35)",
    headline: "Hardware Hack · Registration",
    eyebrow:  "Solder, sparks, sensors — bring your team",
    blurb:    "Magic you can hold. Pick a fellowship, pick your tools.",
    teamLabel: "Team",
    teamSizes: [2, 3, 4],
    chipsLabel: "Hardware & Tools",
    chips: HARDWARE_CHIPS,
    askExperience: {
      label: "Is this your first hackathon?",
      yes: "Yes — first spell",
      no:  "No — walked this path before",
    },
    submitLabel: "Cast the Scroll",
  },
};
