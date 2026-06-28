import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import RoboSumoDetails from "@/components/RoboSumoDetails";

export const metadata = {
  title: "Robo Sumo Rulebook · HexaFalls Techfest",
  description: "Robo Sumo combat rules, bot specifications, registration details, and judging criteria at HexaFalls hardware hackathon. Co-developed by Ayushman Bhattacharya.",
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
