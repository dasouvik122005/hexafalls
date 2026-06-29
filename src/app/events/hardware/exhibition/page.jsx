import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import ExhibitionDetails from "@/components/ExhibitionDetails";

export const metadata = {
  title: "Project Exhibition · HexaFalls Techfest",
  description: "Project Exhibition guide for the HexaFalls 2026 Hardware Hack at JIS University, Kolkata — rules, categories, solo high-school format and judging criteria. Designed and engineered by Ayushman Bhattacharya.",
};

export default function ExhibitionPage() {
  return (
    <main className="flex-1">
      <TopBar />
      <ExhibitionDetails />
      <Footer />
    </main>
  );
}
