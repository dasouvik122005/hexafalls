import { notFound } from "next/navigation";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import ComingSoon from "@/components/ComingSoon";
import { EVENTS } from "@/lib/routes";

export function generateStaticParams() {
  return EVENTS.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const event = EVENTS.find((e) => e.slug === slug);
  if (!event) return { title: "Event · HexaFalls Techfest" };
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

  return (
    <main className="flex-1">
      <TopBar />
      <ComingSoon
        eyebrow={`Track · ${event.name}`}
        title="The"
        accent={event.name.replace(/^The\s+/i, "")}
        lede={
          isHackathon
            ? `${event.blurb} The full brief (rules, schedule, judging) is yet to come. Registrations are open on Devfolio.`
            : `${event.blurb} The full brief is being inked: rules, schedule, judging. Return soon, or peek at the prizes already.`
        }
        whisper="“Every contest is a small spell, and every spell needs its rules.”"
        accentColor={event.color}
        accentGlow={event.glow}
        apply={
          isHackathon
            ? {
                open: true,
                label: "REGISTER ON DEVFOLIO",
                href: "https://hexafalls2.devfolio.co",
                external: true,
              }
            : {
                open: true,
                label: "SEE THE PRIZES",
                href: `/events/${event.slug}/prizes`,
              }
        }
        backHref="/events"
        backLabel="← ALL EVENTS"
      />
      <Footer />
    </main>
  );
}
