import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import ComingSoon from "@/components/ComingSoon";

export const metadata = {
  title: "Call for Judges & Mentors · HexaFalls Techfest",
  description:
    "Judges and mentors join the council of HexaFalls, a 58-hour wizarding TechFest at JIS University. Applications open soon.",
};

export default function JudgesPage() {
  return (
    <main className="flex-1">
      <TopBar />
      <ComingSoon
        eyebrow="The council is being convened"
        title="Judges &"
        accent="Mentors"
        lede="Wise hands and sharp eyes, summoned to guide and to judge. The call to the council will open soon."
        whisper="“No spell is complete until elders have weighed it.”"
        apply={{ open: false, label: "APPLY NOW" }}
      />
      <Footer />
    </main>
  );
}
