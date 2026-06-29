import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import RoboTerrenceDetails from "@/components/RoboTerrenceDetails";

export const metadata = {
  title: "Robo Terrence Rulebook · HexaFalls Techfest",
  description: "Robo Terrence rulebook for the HexaFalls 2026 Hardware Hack at JIS University, Kolkata — challenge rules, bot specifications, registration and judging criteria. Designed and engineered by Ayushman Bhattacharya.",
};

export default function RoboTerrencePage() {
  return (
    <main className="flex-1">
      <TopBar />
      <RoboTerrenceDetails />
      <Footer />
    </main>
  );
}
