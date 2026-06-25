// The Google Form link for volunteer applications.
export const VOLUNTEER_FORM_URL = "https://forms.gle/wM2qEnr3oB95wss89";
// The Google Form link for core-team applications.
export const CORE_TEAM_FORM_URL = "https://forms.gle/VrZB4PVeDMzMRscz5";

// Top-level navbar entries (kept lean — Call-for-X CTAs live in the Hero).
// Order here is the desired nav order; TopBar keeps "soon" items grouped last.
export const SITEMAP = [
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
    href: "/brand", label: "Brand Kit",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 14.7255 3.09032 17.1962 4.85857 19C5.34211 19.5 5.58388 19.75 5.58388 20.0882C5.58388 20.4265 5.25055 20.5 4.58388 20.5C3.5 20.5 3 21 3 21.5C3 21.7761 3.22386 22 3.5 22H12Z" />
        <circle cx="7.5" cy="10.5" r="1" fill="currentColor" />
        <circle cx="11.5" cy="7.5" r="1" fill="currentColor" />
        <circle cx="16.5" cy="9.5" r="1" fill="currentColor" />
        <circle cx="15.5" cy="14.5" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    href: "/sponsors", label: "Sponsors", red: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
        <path d="M12 21s-7-4.35-7-10a4 4 0 0 1 7-2.65A4 4 0 0 1 19 11c0 5.65-7 10-7 10z" />
      </svg>
    ),
  },
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
    href: "/faq", label: "FAQ",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
  {
    href: "/timeline", label: "Timeline", soon: false,
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
];

// Sub-orders inside the /teams hub. All four share the project's cyan
// primary accent so the hub reads as one cohesive order — only the events
// hub keeps the per-track house colours.
const TEAM_COLOR = "#66FCF1"; // --hx-cyan
const TEAM_GLOW  = "rgba(102,252,241,0.35)";

export const TEAMS = [
  {
    slug: "orgs",
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
    slug: "team",
    name: "Team",
    rune: "❖",
    blurb: "The core team and volunteers — the architects and the steady hands that run HexaFalls.",
    color: TEAM_COLOR,
    glow:  TEAM_GLOW,
    open:  false,
    // Entries closed — applications received are now under review.
    processing: true,
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
    blurb: "Fifty-eight hours of pure spellwork: full-stack, AI, anything that ships.",
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
    blurb: "Stadium of charms. Controller in hand, glory on the line.",
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
// Sorted by status: open → soon → closed. Each card renders one of three
// states in the Hero (open / soon / closed) based on these flags.
export const CALLS = [
  {
    href: "/teams/evangelists",
    label: "Call for Evangelists",
    short: "Evangelists",
    accent: "gold",
    open: true,
    blurb: "Open now. Be the voice of the order beyond the walls.",
  },
  {
    href: "/judges",
    label: "Call for Judges & Mentors",
    short: "Judges & Mentors",
    accent: "cyan",
    soon: true,
    blurb: "Wise hands. Sharp eyes. Guide the council — soon.",
  },
  {
    href: "/teams/team",
    label: "Call for Team",
    short: "Team",
    accent: "cyan",
    closed: true,
    blurb: "Entries closed — core team & volunteers under review. Watch the timeline.",
  },
];

// ── Hackathon Tracks ────────────────────────────────────────────────────
export const HACKATHON_TRACKS = [
  { name: "Blockchain",        rune: "⛓", color: "#F59E0B", desc: "Decentralised apps, smart contracts, DeFi protocols, or Web3 tooling. Build on any chain." },
  { name: "AI/ML & MLOps",     rune: "🧠", color: "#8B5CF6", desc: "Intelligent systems, model training pipelines, LLM apps, computer vision, or MLOps infrastructure." },
  { name: "IoT & Robotics",    rune: "⚙",  color: "#22C55E", desc: "Connected devices, sensor networks, embedded systems, or robotics automation." },
  { name: "MedTech",           rune: "🩺", color: "#EF4444", desc: "Healthcare solutions — diagnostics, patient management, telemedicine, or health data analytics." },
  { name: "FinTech/EdTech",    rune: "💳", color: "#3B82F6", desc: "Financial services, payment systems, lending platforms, or education & e-learning tools." },
  { name: "DevOps & CI/CD",    rune: "🔄", color: "#06B6D4", desc: "Developer tooling, CI/CD pipelines, infrastructure-as-code, monitoring, or platform engineering." },
  { name: "Open Innovation",   rune: "✦",  color: "#D4AF37", desc: "Anything goes — your wildest idea that doesn't fit another track. Surprise the judges." },
  { name: "Sustainability",    rune: "🌱", color: "#10B981", desc: "Climate tech, energy efficiency, waste reduction, or environmental monitoring solutions." },
  { name: "Sponsored Tracks",  rune: "★",  color: "#EC4899", desc: "Special challenges set by our sponsors with dedicated prizes. Details revealed at kickoff." },
];

// ── Hardware Tracks ─────────────────────────────────────────────────────
export const HARDWARE_TRACKS = [
  {
    name: "Robo Terrence",
    rune: "✇",
    color: "#D4AF37",
    desc: "Race your magical machine through enchanted obstacles.",
    slug: "robo-terrence",
  },

  {
    name: "Robo Soccer",
    rune: "⏣",
    color: "#4A90E2",
    desc: "Strategic robotic gameplay inspired by the wizarding world.",
    slug: "robo-soccer",
  },

  {
    name: "Robo Sumo",
    rune: "⊗",
    color: "#FF6B35",
    desc: "Push, battle and dominate the magical combat arena.",
    slug: "robo-sumo",
  },

  {
    name: "Line Follower",
    rune: "☍",
    color: "#8B5CF6",
    desc: "Follow mystical trails with precision and intelligence.",
    slug: "line-follower",
  },

  {
    name: "Exhibition",
    rune: "✧",
    color: "#22C55E",
    desc: "Present groundbreaking innovations and magical creations.",
    slug: "exhibition",
  },
];

export const EXHIBITION_RULES = {
  overview: "The Project Exhibition is a platform for innovators, makers, researchers, and technology enthusiasts to showcase their ideas, prototypes, and engineering solutions. Participants will demonstrate their projects before a panel of judges, industry experts, and fellow innovators, highlighting creativity, technical excellence, and real-world impact. Whether your project focuses on Artificial Intelligence, IoT, Robotics, Healthcare, Sustainability, Automation, Software Development, or Open Innovation, this event provides an opportunity to present your work, gain valuable feedback, and compete for recognition.",
  registration: {
    fee: "₹400 per Team",
    teamSize: "2–5 Members"
  },
  projectCategories: [
    "Artificial Intelligence & Machine Learning",
    "Internet of Things (IoT)",
    "Robotics & Automation",
    "Embedded Systems",
    "Healthcare & MedTech",
    "Smart Agriculture",
    "Sustainability & Green Technology",
    "Smart Cities",
    "Cybersecurity",
    "Software & Web Applications",
    "Open Innovation"
  ],
  eligibility: [
    "Open to students from schools, colleges, universities, and technical institutions.",
    "Individual and team participation are allowed.",
    "Teams can consist of 2–5 members.",
    "Projects may be hardware-based, software-based, or a combination of both."
  ],
  exhibitionRules: [
    "Each team must present its own original project.",
    "All participants must carry a valid College/School ID card.",
    "Teams must bring all necessary equipment required for demonstration.",
    "Every project should have a working prototype, demo, or proof of concept.",
    "Teams must be prepared to explain the technical implementation and working of their project.",
    "Projects containing unsafe, hazardous, or harmful components may be disqualified.",
    "Plagiarism or copied projects will lead to immediate disqualification.",
    "The decision of judges and coordinators shall be final and binding.",
    "Organizers reserve the right to modify rules if necessary."
  ],
  judgingCriteria: [
    { name: "Innovation & Creativity (30%)", items: ["Originality of the idea", "Uniqueness of the solution"] },
    { name: "Technical Excellence (25%)", items: ["Engineering complexity", "Implementation quality"] },
    { name: "Practical Impact (20%)", items: ["Real-world usefulness", "Problem-solving capability"] },
    { name: "Presentation & Demonstration (15%)", items: ["Clarity of explanation", "Communication skills"] },
    { name: "Scalability & Future Scope (10%)", items: ["Potential for future development", "Commercial or societal impact"] }
  ],
  whatToBring: [
    "Working Prototype or Project",
    "Laptop (if required)",
    "Extension Board",
    "Chargers and Adapters",
    "Presentation Materials",
    "Posters or Documentation",
    "College ID Card"
  ],
  exhibitionFormat: [
    { name: "Project Setup", items: ["Teams will be assigned a designated exhibition space.", "Participants must complete setup before the evaluation begins."] },
    { name: "Project Demonstration", items: ["Teams will present and demonstrate their project to judges.", "Judges may ask technical and implementation-related questions."] },
    { name: "Evaluation", items: ["Projects will be evaluated based on the judging criteria.", "Top-performing projects will be shortlisted for awards and recognition."] }
  ],
  notes: [
    "Projects must be fully operational during evaluation.",
    "Teams are responsible for the safety and maintenance of their exhibits.",
    "Any misconduct or unfair practices may result in disqualification.",
    "No refund will be provided after successful registration."
  ]
};

export const LINE_FOLLOWER_RULES = {
  overview: "Put your programming, electronics, and robotics skills to the ultimate test in the Line Follower Challenge. Participants must design and build an autonomous robot capable of accurately following a predefined path while navigating curves, intersections, checkpoints, gaps, and complex track layouts without any human intervention. The competition rewards speed, precision, reliability, and intelligent navigation as robots race to achieve the fastest completion time while successfully handling every challenge on the course.",
  registration: {
    fee: "₹400 per Team",
    teamSize: "2–4 Members"
  },
  botSpecs: [
    "Maximum Dimensions: 20 cm × 20 cm × 20 cm",
    "Power Supply: On-board only",
    "Maximum Operating Voltage: 10–12V",
    "Robots must operate fully autonomously",
    "External control during the event is strictly prohibited",
    "One robot per team",
    "A robot cannot be shared between multiple teams"
  ],
  trackSpecs: [
    "White flex-sheet arena surface",
    "Black line path (3–5 cm width)",
    "Sharp turns and curves",
    "Junctions and intersections",
    "Checkpoints",
    "Circular paths",
    "Intentional line gaps",
    "Special challenge sections in final rounds"
  ],
  generalRules: [
    "Teams may consist of 2–4 participants.",
    "All participants must carry a valid College ID card.",
    "Robots must operate completely autonomously throughout the run.",
    "No external control, wireless control, or manual intervention is allowed.",
    "Each team may use only one robot.",
    "A single restart is permitted if the robot exits the arena.",
    "Touching the robot during a run will result in a time penalty.",
    "Organizers reserve the right to modify track conditions or rules if necessary.",
    "The decision of judges and coordinators shall be final and binding.",
    "No refund will be provided after successful registration."
  ],
  preliminaryRound: [
    "All teams will perform individual runs.",
    "Robots must complete the track in the shortest possible time.",
    "Top-performing teams will qualify for the finals."
  ],
  finalRound: [
    "Qualified teams will compete on an advanced track.",
    "Additional challenges and modified track layouts may be introduced.",
    "Final rankings will be determined based on performance, checkpoints, and completion time."
  ],
  scoringCriteria: [
    { name: "Checkpoint Detection", items: ["Successful checkpoint identification with LED indication."] },
    { name: "Gap Navigation", items: ["Successfully crossing intentional line gaps."] },
    { name: "Endpoint Completion", items: ["Reaching the finish point successfully."] },
    { name: "Stability Bonus", items: ["Remaining stationary at the endpoint for at least 5 seconds."] },
    { name: "Time Performance", items: ["Fastest completion time receives the highest ranking."] }
  ],
  judgingParameters: [
    "Line Following Accuracy",
    "Autonomous Navigation Capability",
    "Checkpoint Detection",
    "Gap Handling Performance",
    "Overall Completion Time",
    "Robot Stability and Reliability"
  ],
  notes: [
    "Robots must clearly indicate checkpoint detection using LED blinking.",
    "Teams should ensure their robots are fully functional before reporting.",
    "Any attempt to gain unfair advantage may result in disqualification.",
    "Judges' decisions will be final in all circumstances."
  ]
};

export const ROBO_TERRENCE_RULES = {
  overview: "Robo Terrence is an off-road robotic challenge designed to test the endurance, stability, and maneuverability of robots across a variety of challenging terrains. Participants must build and control robots capable of overcoming obstacles such as sand pits, bumpers, water sections, net bridges, and complex pathways while maintaining speed and precision. The competition evaluates a robot's ability to adapt to difficult environments, complete mandatory tasks, and navigate unpredictable terrain efficiently.",
  registration: {
    fee: "₹400 per Team",
    teamSize: "2–5 Members"
  },
  botSpecs: [
    "Maximum Dimensions: 25 cm (Width) × 30 cm (Length)",
    "Maximum Weight: 3 kg",
    "Maximum Operating Voltage: 18V",
    "Remote-controlled robots only",
    "Autonomous microcontroller-based robots are not allowed",
    "LEGO kits and LEGO spare parts are strictly prohibited",
    "Ready-made gearboxes and bases are permitted",
    "Power supply may be onboard or offboard",
    "Offboard power wires must remain slack throughout the event",
    "The robot's primary chassis must remain unchanged during the competition"
  ],
  generalRules: [
    "Maximum 5 participants per team.",
    "All participants must carry a valid College ID card.",
    "A participant cannot be a member of multiple teams.",
    "A controller/driver may operate only one robot.",
    "No trial runs will be provided.",
    "A robot cannot be shared between multiple teams.",
    "Any violation of fair play will result in disqualification.",
    "No restarts are allowed.",
    "Only one team member may control the robot during the event.",
    "The robot must start from the designated starting point and successfully navigate the terrain to reach the finish zone.",
    "The decision of judges and coordinators will be final and binding."
  ],
  terrainChallenges: [
    "Sand Zones",
    "Bumper Obstacles",
    "Water Sections",
    "Net Bridges",
    "Inclines & Uneven Surfaces",
    "Special Task-Based Obstacles"
  ],
  preliminaryRound: [
    "One technical timeout of up to 2 minutes is permitted.",
    "Each team receives two free hand touches.",
    "Additional hand touches may incur penalties.",
    "Certain obstacles carry penalty points if touched.",
    "Mandatory tasks must be completed.",
    "Assistance may be provided with penalties if the robot becomes stuck.",
    "Leaving the designated path will result in penalties.",
    "Final Score = Completion Time + Penalty Time. Lowest time wins."
  ],
  finalRound: [
    "Top-performing teams from the preliminary round will qualify.",
    "The final arena may contain additional challenges and modifications.",
    "Finals will be conducted as a closed competition round.",
    "Teams must report within their assigned time slots.",
    "Failure to report on time may result in disqualification."
  ],
  judgingCriteria: [
    "Terrain Navigation Efficiency",
    "Task Completion",
    "Stability & Control",
    "Obstacle Handling Capability",
    "Overall Completion Time"
  ],
  notes: [
    "No refund will be provided after successful registration.",
    "Organizers reserve the right to modify rules or arena elements if necessary.",
    "The decision of the judges and event coordinators shall be final in all circumstances."
  ]
};

export const ROBO_SOCCER_RULES = {
  overview: "Experience the excitement of robotic football where innovation, strategy, and precision come together on the arena floor. Robo Soccer challenges teams to design and control robots capable of dribbling, defending, and scoring goals against their opponents in an intense battle of engineering and teamwork. Compete in preliminary rounds, knockout stages, and the grand finale to prove your robot's speed, control, and tactical superiority.",
  registration: {
    fee: "₹400 per Team",
    teamSize: "2–5 Members"
  },
  botSpecs: [
    "Maximum Dimensions: 30 cm × 30 cm (including wheels).",
    "Maximum Weight: 3.0 kg (+10% tolerance allowed).",
    "Maximum Supply Voltage: 18V (Fixed).",
    "Robots may be wired or wireless remote-controlled.",
    "For wired bots, the wire must remain slack at all times.",
    "Readymade toy cars, LEGO kits, IC engines, and hydraulic systems are prohibited.",
    "The ball must not be trapped or enclosed within the robot body.",
    "Variable voltage supply during matches is strictly prohibited."
  ],
  generalRules: [
    "Participants are not allowed to enter the arena.",
    "Teams without a robot may use a wired robot provided by the organizers.",
    "Each team must consist of 2–5 members.",
    "A participant cannot join multiple teams.",
    "One robot cannot be shared between multiple teams.",
    "Team members may belong to different institutions.",
    "All participants must carry a valid College ID card.",
    "No trial runs will be provided.",
    "Repair timeout is limited to 2 minutes.",
    "Human interference during gameplay is prohibited.",
    "Damaging the arena may result in immediate disqualification.",
    "The entire event may be recorded for judging and dispute resolution.",
    "The decision of the coordinators and judges will be final and binding.",
    "No refund will be provided after registration."
  ],
  preliminaryRound: [
    "Duration: 4 Minutes",
    "Scoring Formula: Total Score = (Number of Goals × 15) − Penalty Points",
    "Touching penalty bricks marked -5 or -10 will result in corresponding score deductions.",
    "Teams will be ranked according to their highest total score."
  ],
  knockoutRound: [
    "Match Duration: Knockout Matches: 4 Minutes, Final Match: 6 Minutes",
    "Match Format: 1 vs 1 Competition",
    "Ball placed at the center at match start.",
    "Team scoring the highest number of goals wins.",
    "Tie Breaker: Golden Goal Rule applies. First team to score wins."
  ],
  matchRules: [
    "Unnecessary attacks on the opponent robot are prohibited.",
    "Two warnings will be issued before disqualification.",
    "Pulling or twisting the opponent's wire is considered a foul.",
    "Maximum two foul warnings before disqualification.",
    "If robots remain in deadlock for 10 seconds, positions will be reset.",
    "If the ball becomes trapped inside a robot, play will stop and positions will be reset.",
    "Organizers reserve the right to make decisions in unforeseen situations."
  ],
  judgingAndVictory: [
    "Number of Goals Scored",
    "Fair Play",
    "Rule Compliance",
    "Successful Match Completion"
  ],
  notes: [
    "Participants are expected to maintain professionalism and sportsmanship throughout the competition.",
    "Any misconduct, abuse, or violation of event rules may result in immediate disqualification from the event."
  ]
};

export const ROBO_SUMO_RULES = {
  overview: "Enter the ultimate robotic battleground where engineering meets strategy. Robo Sumo challenges participants to design and build powerful combat robots capable of pushing, lifting, pinning, or immobilizing their opponents inside the arena. Victory belongs to the team that demonstrates superior control, aggression, durability, and tactical excellence. Whether you're a robotics enthusiast or a competitive builder, Robo Sumo offers an electrifying platform to showcase your engineering skills and battle against the best.",
  registration: {
    fee: "₹400 per Team",
    teamSize: "2–5 Members"
  },
  botSpecs: [
    "Maximum robot weight: 3 kg (100 g margin allowed).",
    "No restriction on robot dimensions.",
    "Cluster bots are allowed, but total combined weight must remain within 3 kg.",
    "Pneumatic, hydraulic, electric lifters, wedges, and manual jumping/hopping mechanisms are permitted.",
    "Robot height must not exceed 6 ft during motion.",
    "Robots must use wheels, tracks, rolling bodies, or approved continuous drive systems.",
    "Flying mechanisms and suction/sticky devices are strictly prohibited.",
    "Wireless remote control is mandatory.",
    "All power sources must remain onboard.",
    "Autonomous features are allowed only if they can be overridden remotely.",
    "Manual Kill Switch and Radio-Controlled E-Stop are mandatory.",
    "Maximum operating voltage: 36V DC.",
    "Only sealed and leak-proof batteries are permitted.",
    "Battery replacement during a match is not allowed."
  ],
  teamRules: [
    "Each team must consist of 2–5 members.",
    "Team members may belong to the same or different institutions.",
    "Every team must register with a unique team name.",
    "Each team must appoint a team leader as the official representative.",
    "Participants must carry a valid College ID card during the event."
  ],
  matchFormat: [
    "Match Duration: 3 Minutes Active Combat Time",
    "Match Types: 1 vs 1 Combat, Multi-Bot Rumble (if applicable)",
    "Preliminary and Final rounds may follow different formats depending on participation."
  ],
  victoryConditions: [
    "The opponent is immobilized and unable to demonstrate at least 1 inch of controlled movement within 10 seconds.",
    "The opponent is disqualified.",
    "The opponent is thrown out of the arena.",
    "The robot secures a higher score based on judging criteria."
  ],
  combatRules: [
    "Pinning and lifting are allowed for a maximum of 20 seconds per attempt.",
    "Failure to release an opponent after referee instruction may result in penalties or disqualification.",
    "Entangled robots will be separated by officials.",
    "Signal interference complaints will not be considered grounds for a rematch.",
    "Unsafe robots will be immediately disqualified.",
    "Unsportsmanlike behavior may lead to disqualification."
  ],
  judgingCriteria: [
    { name: "Aggression", items: ["Attack frequency", "Offensive intent", "Arena domination"] },
    { name: "Control", items: ["Strategic movement", "Effective weapon usage", "Driving precision"] },
    { name: "Damage", items: ["Functional damage caused to the opponent", "Effectiveness of combat mechanisms"] }
  ],
  safety: [
    "Robots must pass safety inspection before competing.",
    "Battery terminals must be properly insulated.",
    "Exposed wiring and unsafe components are prohibited.",
    "Organizers reserve the right to reject any robot considered unsafe."
  ],
  notes: [
    "No refund will be provided after successful registration.",
    "Participants must report to the arena before their scheduled match.",
    "The decision of judges and event coordinators will be final and binding in all circumstances."
  ]
};

// ── Judging Rubric ──────────────────────────────────────────────────────
export const JUDGING = {
  eligibility: [
    { id: 1, req: "Public source repository (GitHub/GitLab) with the link submitted on Devfolio.", rationale: "Open source must be open to read." },
    { id: 2, req: "An OSI-approved license file in the repository root (e.g. MIT, Apache-2.0, GPL-3.0).", rationale: "Code without a license is not legally reusable." },
    { id: 3, req: "A README describing what the project is, how to run it, and how to contribute.", rationale: "Software no one can set up cannot be evaluated or reused." },
    { id: 4, req: "Commit history created during the event window (no fully pre-built submissions).", rationale: "The work produced during the event is what is judged." },
    { id: 5, req: "A working demo — deployed link, recorded video, or live walkthrough.", rationale: "Functionality must be demonstrable." },
  ],
  criteria: [
    { id: 1, name: "Open-Source Quality",               weight: 30, desc: "Public, properly licensed repository. A clear README and setup steps that reproduce the project. Readable, coherent commit history. Code structured so an outsider could open an issue or submit a pull request (modular, sensibly named; CONTRIBUTING, issues, and labels are a plus). Reusable beyond the original team." },
    { id: 2, name: "Technical Execution & Completeness", weight: 25, desc: "The project works. Sound architecture and code quality. The intended scope is meaningfully complete, not a hollow prototype. Appropriate technology choices." },
    { id: 3, name: "Innovation & Originality",           weight: 15, desc: "A fresh idea, a novel approach, or a clever take on a known problem." },
    { id: 4, name: "Impact & Usefulness",                weight: 15, desc: "Solves a real problem for real users. Clear beneficiaries and rationale. Potential to remain useful after the event." },
    { id: 5, name: "Design & Experience",                weight: 10, desc: "Thoughtful UX/UI, accessibility, and overall craft. Easy and pleasant to use." },
    { id: 6, name: "Demonstration & Communication",      weight:  5, desc: "A clear, honest presentation that explains what, why, and how — including trade-offs and known limitations." },
  ],
  scale: [
    { score: "0",   band: "Absent",      meaning: "Not attempted / not present." },
    { score: "1–2", band: "Emerging",     meaning: "Started, but thin or not functional." },
    { score: "3",   band: "Solid",        meaning: "Meets expectations; works as intended." },
    { score: "4",   band: "Strong",       meaning: "Clearly above expectations; polished." },
    { score: "5",   band: "Exceptional",  meaning: "Reference quality." },
  ],
  formula: "criterion points = (score ÷ 5) × weight",
  bonus: [
    { item: "Automated tests",       pts: "+2", note: "Meaningful test coverage." },
    { item: "Continuous integration", pts: "+2", note: "Working CI (build/test on push)." },
    { item: "Accessibility",         pts: "+2", note: "Genuine a11y effort (keyboard, contrast, semantics, ARIA)." },
    { item: "Contributor readiness",  pts: "+1", note: "CONTRIBUTING.md, \"good first issue\" labels, or a code of conduct." },
    { item: "Reusability",           pts: "+1", note: "Published as a package, component, or template others can adopt." },
  ],
  bonusCap: 8,
  penalties: [
    { issue: "Private repository or missing license at judging time", penalty: "Not scored (eligibility failure)." },
    { issue: "Plagiarism / passing off others' work as your own",     penalty: "Disqualification." },
    { issue: "Demo materially misrepresents what the code does",      penalty: "−10" },
    { issue: "Hard-coded secrets / committed credentials",            penalty: "−3 and a notice to the team." },
  ],
  tiebreakers: [
    "Higher Open-Source Quality (Criterion 1) score.",
    "Higher Impact & Usefulness (Criterion 4) score.",
    "Stronger commit-history quality during the event window.",
    "Judges' deliberation.",
  ],
};
