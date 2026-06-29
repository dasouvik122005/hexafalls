import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import RoboSumoDetails from "@/components/RoboSumoDetails";

export const metadata = {
  title: "Robo Sumo Rulebook · HexaFalls Techfest",
  description: "Robo Sumo rulebook for the HexaFalls 2026 Hardware Hack at JIS University, Kolkata — combat rules, bot weight and size specifications, registration and judging criteria. Designed and engineered by Ayushman Bhattacharya.",
};

export default function RoboSumoPage() {
  return (
    <main className="flex-1">
      <TopBar />
      <RoboSumoDetails />
      <Footer />
    </main>
  );
}
