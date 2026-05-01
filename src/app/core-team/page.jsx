import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import ComingSoon from "@/components/ComingSoon";

export const metadata = {
  title: "Call for Core Team · HexaFalls Techfest",
  description: "Forming the inner circle of HexaFalls — coming soon.",
};

export default function CoreTeamPage() {
  return (
    <main className="flex-1">
      <TopBar />
      <ComingSoon
        eyebrow="The inner circle is gathering"
        title="Call for"
        accent="Core Team"
        lede="The architects of HexaFalls — the ones who shape every spell. Applications to the inner circle will open soon."
        whisper="“Behind every great gathering, a quiet council steadies the wand.”"
      />
      <Footer />
    </main>
  );
}
