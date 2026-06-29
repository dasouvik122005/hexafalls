import TopBar from "@/components/TopBar";
import FAQ from "@/components/faq";
import Footer from "@/components/Footer";

export const metadata = {
  title: "FAQ · HexaFalls Techfest",
  description:
    "Everything you need to know about HexaFalls 2026 at JIS University, Kolkata — registration, team rules, the four tracks, food, stay, judging and prizes, answered in one scroll. Designed and engineered by Ayushman Bhattacharya.",
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
