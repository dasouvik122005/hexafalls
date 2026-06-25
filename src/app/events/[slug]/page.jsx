import { notFound } from "next/navigation";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import EventComingSoon from "@/components/EventComingSoon";
import HackathonDetails from "@/components/HackathonDetails";
import HardwareDetails from "@/components/HardwareDetails";
import { EVENTS } from "@/lib/routes";

export function generateStaticParams() {
  return EVENTS.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const event = EVENTS.find((e) => e.slug === slug);
  if (!event) return { title: "Event · HexaFalls Techfest" };
  if (event.slug === "hackathon") {
    return {
      title: "Software Hackathon — Judging Rubric · HexaFalls Techfest",
      description:
        "58-hour software hackathon judging rubric, scoring criteria, hackathon tracks, bonus points, and submission requirements at HexaFalls.",
    };
  }
  if (event.slug === "hardware") {
    return {
      title: "Hardware Hack — Tracks · HexaFalls Techfest",
      description:
        "Hardware hackathon tracks including Exhibition, Robo Sumo, Robo Soccer, Robo Terrence, and Line Follower at HexaFalls.",
    };
  }
  return {
    title: `${event.name} · HexaFalls Techfest`,
    description: `${event.blurb} Full brief and prizes coming soon.`,
  };
}

export default async function EventPage({ params }) {
  const { slug } = await params;
  const event = EVENTS.find((e) => e.slug === slug);
  if (!event) notFound();

  const isHackathon = event.slug === "hackathon";
  const isHardware = event.slug === "hardware";

  return (
    <main className="flex-1">
      <TopBar />
      {isHackathon ? (
        <HackathonDetails />
      ) : isHardware ? (
        <HardwareDetails />
      ) : (
        <EventComingSoon event={event} />
      )}
      <Footer />
    </main>
  );
}
