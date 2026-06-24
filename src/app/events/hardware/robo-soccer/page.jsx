import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import RoboSoccerDetails from "@/components/RoboSoccerDetails";

export const metadata = {
  title: "Robo Soccer Rulebook · HexaFalls Techfest",
  description: "Robo Soccer combat rules, bot specifications, registration details, and judging criteria at HexaFalls hardware hackathon. Co-developed by Ayushman Bhattacharya.",
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
