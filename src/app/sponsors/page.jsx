import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import ComingSoon from "@/components/ComingSoon";

export const metadata = {
  title: "Call for Sponsors · HexaFalls Techfest",
  description:
    "Stand beside HexaFalls — sponsorship scrolls are being drafted. Coming soon.",
};

export default function SponsorsPage() {
  return (
    <main className="flex-1">
      <TopBar />
      <ComingSoon
        eyebrow="Patrons of the craft sought"
        title="Call for"
        accent="Sponsors"
        lede="The hall is large, the journey long, and the patrons we walk with shape the magic we can cast. Sponsorship scrolls will be unfurled soon."
        whisper="“Even the brightest fire is fed by the hands that carry the wood.”"
        apply={{ open: false, label: "BECOME A PATRON" }}
      />
      <Footer />
    </main>
  );
}
