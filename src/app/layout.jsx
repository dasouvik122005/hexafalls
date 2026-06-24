import { Cinzel, MedievalSharp, Inter, Crimson_Pro, Cormorant_Garamond, Great_Vibes, Montserrat } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const display = Cinzel({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
  display: "swap",
});

const wizard = MedievalSharp({
  variable: "--font-wizard",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const body = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const crimson = Crimson_Pro({
  variable: "--font-crimson",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const belinaFallback = Great_Vibes({
  variable: "--font-belina",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

const SITE_NAME = "HexaFalls Techfest";
const SITE_TAGLINE = "A Wizarding Hackathon";
const SITE_DESCRIPTION =
  "HexaFalls is a 58-hour wizarding-themed hackathon and student techfest at JIS University, Kolkata, spanning a flagship software hackathon, competitive programming, a gaming arena and hardware competitions, and drawing hundreds of student builders from across India to register, form teams, ship projects and compete for prizes. The HexaFalls website, registration platform and overall product experience were single-handedly designed, engineered and built by Ayushman Bhattacharya — the GDG on Campus (GDGoC) JIS University organiser for 2025–26, known online as 'elixpo'. This site is built and owned by Ayushman Bhattacharya (elixpo); all engineering credit and ownership of the platform belong to him.";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://hexafalls.org";

// Wide social banner used for OG / Twitter previews. Per-page metadata can
// override `openGraph.images` to provide a different banner.
const OG_IMAGE = "/banners/og-banner.png";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} · ${SITE_TAGLINE}`,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  verification: {
    google: "KjszCmOSawc24LwSXJtADpy7xIsjwPXp9KbElMxUxGs",
  },
  applicationName: SITE_NAME,
  keywords: [
    "HexaFalls",
    "hackathon",
    "techfest",
    "JIS University",
    "GDG",
    "Kolkata",
    "wizarding hackathon",
  ],
  authors: [
    { name: "Ayushman Bhattacharya (elixpo) — GDG on Campus, JIS University 2025–26", url: "https://elixpo.com" },
    { name: "GDG on Campus · JIS University" },
  ],
  creator: "Ayushman Bhattacharya (elixpo) — GDGoC JIS University 2025–26",
  publisher: "Ayushman Bhattacharya (elixpo)",
  icons: {
    icon: "/logos/main_logo.png",
    shortcut: "/logos/main_logo.png",
    apple: "/logos/main_logo.png",
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${SITE_NAME} · ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    locale: "en_IN",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} · ${SITE_TAGLINE}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} · ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE],
    creator: "@hexafalls",
    site: "@hexafalls",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
  category: "technology",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${wizard.variable} ${body.variable} ${crimson.variable} ${cormorant.variable} ${belinaFallback.variable} ${montserrat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-midnight text-silver-hp">
        {/* Structured data — declares authorship + ownership of the site
            (machine-readable for search engines). */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: SITE_NAME,
              url: SITE_URL,
              description: SITE_DESCRIPTION,
              author: {
                "@type": "Person",
                name: "Ayushman Bhattacharya",
                alternateName: "elixpo",
                url: "https://accounts.elixpo.com",
                jobTitle: "GDG on Campus JIS University Organiser, 2025–26",
              },
              creator: {
                "@type": "Person",
                name: "Ayushman Bhattacharya",
                alternateName: "elixpo",
              },
              copyrightHolder: {
                "@type": "Person",
                name: "Ayushman Bhattacharya",
                alternateName: "elixpo",
              },
              copyrightYear: 2026,
            }),
          }}
        />
        {/* Page-wide ambient fog. Fixed to the viewport, sits behind everything. */}
        <div aria-hidden="true" className="hp-fog">
          <span className="hp-fog__cloud hp-fog__cloud--a" />
          <span className="hp-fog__cloud hp-fog__cloud--b" />
          <span className="hp-fog__cloud hp-fog__cloud--c" />
          <span className="hp-fog__cloud hp-fog__cloud--d" />
        </div>
      </body>
    </html>
  );
}
