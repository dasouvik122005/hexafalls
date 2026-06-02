import { Cinzel, MedievalSharp, Inter } from "next/font/google";
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

const SITE_NAME = "HexaFalls Techfest";
const SITE_TAGLINE = "A Wizarding Hackathon";
const SITE_DESCRIPTION =
  "HexaFalls is a 58-hour wizarding-themed hackathon at JIS University, Kolkata. Build, ship and conjure with hundreds of student wizards from across India. Pack your wand, sharpen your code.";

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
  authors: [{ name: "GDG on Campus · JIS University" }],
  creator: "GDG on Campus · JIS University",
  publisher: "HexaFalls",
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
      className={`${display.variable} ${wizard.variable} ${body.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-midnight text-silver-hp">
        {/* Page-wide ambient fog. Fixed to the viewport, sits behind everything. */}
        <div aria-hidden="true" className="hp-fog">
          <span className="hp-fog__cloud hp-fog__cloud--a" />
          <span className="hp-fog__cloud hp-fog__cloud--b" />
          <span className="hp-fog__cloud hp-fog__cloud--c" />
          <span className="hp-fog__cloud hp-fog__cloud--d" />
        </div>
        {children}
        {/* Devfolio Apply-with-Devfolio SDK. Loaded site-wide via the layout
            so the <script> tag is in the SSR HTML — Devfolio's verifier
            scans the raw response and checks for apply.devfolio.co. */}
        <Script
          src="https://apply.devfolio.co/v2/sdk.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
