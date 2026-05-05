import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import SponsorsHall from "@/components/SponsorsHall";

export const metadata = {
  title: "Call for Sponsors · HexaFalls Techfest",
  description:
    "Patrons of HexaFalls — Devfolio joins as Gold, with more scrolls being inked.",
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
