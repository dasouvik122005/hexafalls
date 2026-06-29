import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import Teams from "@/components/Teams";

export const metadata = {
  title: "The Teams · HexaFalls Techfest",
  description:
    "Meet the four orders behind HexaFalls 2026 at JIS University, Kolkata — the organising team, evangelists, core team and volunteers. Apply to join the hall and help run the TechFest. Designed and engineered by Ayushman Bhattacharya.",
};

export default function TeamsPage() {
  return (
    <main className="flex-1">
      <TopBar />
      <Teams />
      <Footer />
    </main>
  );
}
