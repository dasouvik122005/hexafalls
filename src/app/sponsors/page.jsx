import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import SponsorsHall from "@/components/SponsorsHall";

export const metadata = {
  title: "Call for Sponsors · HexaFalls Techfest",
  description:
    "Sponsor HexaFalls 2026. Devfolio joins as Gold with more sponsors being inked. Tiers, benefits and reach inside.",
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
