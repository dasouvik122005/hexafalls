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
  if (!event) return { title: "Prizes · HexaFalls Techfest" };
  return {
    title: `${event.name} · Prizes · HexaFalls Techfest`,
    description: `Prize pool and tiers for ${event.name} — coming soon.`,
  };
}

export default async function EventPrizesPage({ params }) {
  const { slug } = await params;
  const event = EVENTS.find((e) => e.slug === slug);
  if (!event) notFound();

  return (
    <main className="flex-1">
      <TopBar />
      <ComingSoon
        eyebrow={`${event.name} · Prize Vault`}
        title="The"
        accent="Prizes"
        lede={`Gold, glory, and a few oddities chosen by the keeper. The full prize pool for ${event.name} will be unveiled soon.`}
        whisper="“What is hidden in the vault is heavier than what is shown on the parchment.”"
        accentColor={event.color}
        accentGlow={event.glow}
        apply={{ open: true, label: `BACK TO ${event.name.toUpperCase()}`, href: `/events/${event.slug}` }}
        backHref="/events"
        backLabel="← ALL EVENTS"
      />
      <Footer />
    </main>
  );
}
