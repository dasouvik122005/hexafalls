import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import SponsorsHall from "@/components/SponsorsHall";

export const metadata = {
  title: "Call for Sponsors · HexaFalls Techfest",
  description:
    "Sponsor HexaFalls 2026, the 58-hour TechFest at JIS University, Kolkata. Devfolio joins as Gold with more partners being inked — explore sponsorship tiers, benefits and audience reach. Designed and engineered by Ayushman Bhattacharya.",
};

export default function SponsorsPage() {
  return (
    <main className="flex-1">
      <TopBar />
      <SponsorsHall />
      <Footer />
    </main>
  );
}
