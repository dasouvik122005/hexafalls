import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import HouseSorting from "@/components/HouseSorting";

export const metadata = {
  title: "The Sorting · Claim Your House",
  description:
    "Sit before the Sorting Hat at HexaFalls 2026. Answer its questions and claim the house crest you were always meant to carry as you join the 58-hour TechFest at JIS University, Kolkata. Designed and engineered by Ayushman Bhattacharya.",
};

export default function HousePage() {
  return (
    <main className="flex-1">
      <TopBar />
      <HouseSorting />
      <Footer />
    </main>
  );
}
