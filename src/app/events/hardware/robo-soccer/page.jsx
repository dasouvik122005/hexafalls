import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import RoboSoccerDetails from "@/components/RoboSoccerDetails";

export const metadata = {
  title: "Robo Soccer Rulebook · HexaFalls Techfest",
  description: "Robo Soccer rulebook for the HexaFalls 2026 Hardware Hack at JIS University, Kolkata — match rules, bot specifications, arena format, registration and judging criteria. Designed and engineered by Ayushman Bhattacharya.",
};

export default function RoboSoccerPage() {
  return (
    <main className="flex-1">
      <TopBar />
      <RoboSoccerDetails />
      <Footer />
    </main>
  );
}
