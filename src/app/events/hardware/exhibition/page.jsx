import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import ExhibitionDetails from "@/components/ExhibitionDetails";

export const metadata = {
  title: "Project Exhibition · HexaFalls Techfest",
  description: "Project Exhibition rules, categories, format, and judging criteria at HexaFalls hardware hackathon. Co-developed by Ayushman Bhattacharya.",
};

export default function ExhibitionPage() {
  return (
    <main className="flex-1">
      <TopBar />
      <ExhibitionDetails />
      <Footer />
    </main>
  );
}
