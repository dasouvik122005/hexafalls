import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import ComingSoon from "@/components/ComingSoon";

export const metadata = {
  title: "Call for Judges & Mentors · HexaFalls Techfest",
  description:
    "Become a judge or mentor on the council of HexaFalls 2026, the 58-hour wizarding hackathon at JIS University, Kolkata. Guide teams across all four tracks — applications are open now. Designed and engineered by Ayushman Bhattacharya.",
};

export default function JudgesPage() {
  return (
    <main className="flex-1">
      <TopBar />
      <ComingSoon
        eyebrow="The council is being convened"
        title="Judges &"
        accent="Mentors"
        lede="Wise hands and sharp eyes, summoned to guide and to judge. The call to the council is open — answer it."
        whisper="“No spell is complete until elders have weighed it.”"
        apply={{
          open: true,
          external: true,
          href: "https://luma.com/8f43ddm9",
          label: "APPLY NOW",
        }}
      />
      <Footer />
    </main>
  );
}
