const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://hexafalls.org";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Anything we don't want indexed goes here later (e.g. "/api/").
        disallow: [],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
