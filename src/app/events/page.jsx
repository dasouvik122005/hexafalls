import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import Events from "@/components/Events";

export const metadata = {
  title: "The Events · HexaFalls Techfest",
  description:
    "Five tracks at HexaFalls: hackathon, competitive programming, gaming, hardware and software. Briefs and prizes coming soon.",
};

export default function EventsPage() {
  return (
    <main className="flex-1">
      <TopBar />
      <Events />
      <Footer />
    </main>
  );
}
