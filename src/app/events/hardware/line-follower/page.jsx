import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import LineFollowerDetails from "@/components/LineFollowerDetails";

export const metadata = {
  title: "Line Follower Rulebook · HexaFalls Techfest",
  description: "Line Follower rulebook for the HexaFalls 2026 Hardware Hack at JIS University, Kolkata — track layout, bot specifications, timing rules, registration and judging criteria. Designed and engineered by Ayushman Bhattacharya.",
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
