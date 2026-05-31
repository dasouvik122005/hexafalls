import { EVENTS, TEAMS } from "@/lib/routes";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://hexafalls.org";

// Static routes shipped today, with a hand-tuned priority/changefreq.
const STATIC_ROUTES = [
  { path: "/",         priority: 1.0, changeFrequency: "weekly"  },
  { path: "/about",    priority: 0.8, changeFrequency: "monthly" },
  { path: "/teams",    priority: 0.8, changeFrequency: "monthly" },
  { path: "/events",   priority: 0.9, changeFrequency: "weekly"  },
  { path: "/timeline", priority: 0.7, changeFrequency: "weekly"  },
  { path: "/judges",   priority: 0.6, changeFrequency: "monthly" },
  { path: "/sponsors", priority: 0.7, changeFrequency: "monthly" },
];

export default function sitemap() {
  const now = new Date();

  const staticEntries = STATIC_ROUTES.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));

  // One entry per event + per event prize-vault.
  const eventEntries = EVENTS.flatMap((e) => [
    {
      url: `${SITE_URL}/events/${e.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/events/${e.slug}/prizes`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    },
  ]);

  // One entry per team sub-order.
  const teamEntries = TEAMS.map((t) => ({
    url: `${SITE_URL}/teams/${t.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: t.open ? 0.8 : 0.6,
  }));

  return [...staticEntries, ...eventEntries, ...teamEntries];
}
