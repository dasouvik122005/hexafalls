import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import CallForVolunteers from "@/components/CallForVolunteers";

export const metadata = {
  title: "Call for Volunteers · HexaFalls Techfest",
  description:
    "Join the order of HexaFalls — volunteer for the wizarding hackathon at JIS University.",
};

export default function VolunteerPage() {
  return (
    <main className="flex-1">
      <TopBar />
      <CallForVolunteers />
      <Footer />
    </main>
  );
}
