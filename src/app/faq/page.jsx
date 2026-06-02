import TopBar from "@/components/TopBar";
import FAQ from "@/components/faq";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Room of Requirements — FAQ | HexaFalls",
  description:
    "Everything you need to know about HexaFalls — registration, teams, tracks, food, judging, and more. Break the seal to find your answer.",
};

export default function FaqPage() {
  return (
    <main className="flex-1">
      <TopBar />
      <FAQ />
      <Footer />
    </main>
  );
}
