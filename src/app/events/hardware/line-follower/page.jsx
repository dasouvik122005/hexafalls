import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import LineFollowerDetails from "@/components/LineFollowerDetails";

export const metadata = {
  title: "Line Follower Rulebook · HexaFalls Techfest",
  description: "Line Follower rules, bot specifications, track details, registration, and judging criteria at HexaFalls hardware hackathon. Co-developed by Ayushman Bhattacharya.",
};

export default function LineFollowerPage() {
  return (
    <main className="flex-1">
      <TopBar />
      <LineFollowerDetails />
      <Footer />
    </main>
  );
}
