import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import Prophecy from "@/components/Prophecy";

export const metadata = {
  title: "The Prophecy · HexaFalls Techfest",
  description:
    "The lore of HexaFalls — a 36-hour wizarding hackathon where code, chaos, and conjuring meet at JIS University.",
};

export default function AboutPage() {
  return (
    <main className="flex-1">
      <TopBar />
      <Prophecy />
      <Footer />
    </main>
  );
}
