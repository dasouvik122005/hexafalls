import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import Organisers from "@/components/Organisers";

const TITLE = "Organising Team · HexaFalls Techfest";
const DESCRIPTION =
  "Meet the HexaFalls organising team — the people behind the 58-hour wizarding TechFest at JIS University, Kolkata. The site was built, designed, and engineered by Ayushman Bhattacharya, alongside organisers Sourav Singh, Amit Paul, Kritika Chakraborty and Abhishek Gupta.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/teams/orgs" },
  keywords: [
    "HexaFalls organisers",
    "HexaFalls team",
    "Ayushman Bhattacharya",
    "Sourav Singh",
    "Amit Paul",
    "Kritika Chakraborty",
    "Abhishek Gupta",
    "JIS University hackathon",
  ],
  openGraph: {
    type: "profile",
    title: TITLE,
    description: DESCRIPTION,
    url: "/teams/orgs",
    images: [{ url: "/people/orgs/ayushman.webp", alt: "HexaFalls Organising Team" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/people/orgs/ayushman.webp"],
  },
};

export default function OrganisersPage() {
  return (
    <main className="flex-1">
      <TopBar />
      <Organisers />
      <Footer />
    </main>
  );
}
