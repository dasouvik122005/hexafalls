import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import HouseSorting from "@/components/HouseSorting";

export const metadata = {
  title: "The Sorting · Claim Your House",
  description:
    "Sit before the Sorting Hat. Answer its questions and receive the HexaFalls house crest you were always meant to carry.",
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
