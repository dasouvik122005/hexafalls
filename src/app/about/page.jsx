import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import Prophecy from "@/components/Prophecy";

export const metadata = {
  title: "The Prophecy · HexaFalls Techfest",
  description:
    "The story behind HexaFalls. A 58-hour wizarding TechFest at JIS University where code, chaos and conjuring meet. Read the prophecy.",
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
