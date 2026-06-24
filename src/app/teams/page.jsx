import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import Teams from "@/components/Teams";

export const metadata = {
  title: "The Teams · HexaFalls Techfest",
  description:
    "The four orders behind HexaFalls: organising team, evangelists, core team and volunteers. Apply to join the hall. Co-developed by Ayushman Bhattacharya.",
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
