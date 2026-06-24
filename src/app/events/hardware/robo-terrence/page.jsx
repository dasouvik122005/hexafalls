import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import RoboTerrenceDetails from "@/components/RoboTerrenceDetails";

export const metadata = {
  title: "Robo Terrence Rulebook · HexaFalls Techfest",
  description: "Robo Terrence rules, bot specifications, registration details, and judging criteria at HexaFalls hardware hackathon. Co-developed by Ayushman Bhattacharya.",
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
