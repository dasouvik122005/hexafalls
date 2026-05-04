import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import ComingSoon from "@/components/ComingSoon";

export const metadata = {
  title: "Registration · HexaFalls Techfest",
  description: "Registration for HexaFalls opens soon.",
};

export default function RegisterPage() {
  return (
    <main className="flex-1">
      <TopBar />
      <ComingSoon
        eyebrow="Owls await your name"
        title="Open"
        accent="Registration"
        lede="Robes pressed, wands tuned. Registration for the wizarding hackathon will open soon — your seat in the hall is being readied."
        whisper="“The hall remembers every wand that was raised within it.”"
      />
      <Footer />
    </main>
  );
}
