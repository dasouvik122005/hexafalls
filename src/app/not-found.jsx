import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import NotFound from "@/components/NotFound";

export const metadata = {
  title: "Lost in the Castle · HexaFalls Techfest",
  description:
    "This corridor of HexaFalls cannot be found — the map shifts beneath your feet. Return to the hall to explore the 58-hour TechFest at JIS University, Kolkata. Designed and engineered by Ayushman Bhattacharya.",
};

export default function NotFoundPage() {
  return (
    <main className="flex-1">
      <TopBar />
      <NotFound />
      <Footer />
    </main>
  );
}
