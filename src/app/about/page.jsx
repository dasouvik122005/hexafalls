import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import Prophecy from "@/components/Prophecy";

export const metadata = {
  title: "The Prophecy · HexaFalls Techfest",
  description:
    "The origin story of HexaFalls — a 58-hour wizarding TechFest at JIS University, Kolkata where code, chaos and conjuring collide across hackathon, competitive programming, gaming and hardware tracks. Designed and engineered by Ayushman Bhattacharya.",
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
