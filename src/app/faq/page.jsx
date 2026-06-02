import TopBar from "@/components/TopBar";
import FAQ from "@/components/faq";
import Footer from "@/components/Footer";

export const metadata = {
  title: "FAQ · HexaFalls Techfest",
  description:
    "Frequently asked questions about HexaFalls: registration, teams, tracks, food, judging and more. Find your answer in one scroll.",
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
