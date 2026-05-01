import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import ComingSoon from "@/components/ComingSoon";

export const metadata = {
  title: "Timeline · HexaFalls Techfest",
  description: "The path foretold — full HexaFalls timeline, coming soon.",
};

export default function TimelinePage() {
  return (
    <main className="flex-1">
      <TopBar />
      <ComingSoon
        eyebrow="The path foretold"
        title="The"
        accent="Timeline"
        lede="Hours, milestones, and rituals — every chapter of the 36-hour gathering. The full timeline will be inscribed soon."
        whisper="“Time, in the right hands, is itself a kind of magic.”"
      />
      <Footer />
    </main>
  );
}
