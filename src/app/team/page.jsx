import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import Team from "@/components/Team";

export const metadata = {
  title: "The Team · HexaFalls Techfest",
  description:
    "Meet the wizards behind HexaFalls — the core team and the volunteers who hold the hall together.",
};

export default function TeamPage() {
  return (
    <main className="flex-1">
      <TopBar />
      <Team />
      <Footer />
    </main>
  );
}
