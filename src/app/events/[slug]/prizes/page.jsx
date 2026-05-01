import { notFound } from "next/navigation";
import Link from "next/link";
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
      />
      {/* secondary nav: back to event */}
      <div className="-mt-12 mb-24 flex justify-center px-6">
        <Link
          href={`/events/${event.slug}`}
          className="inline-flex items-center justify-center rounded-full border border-silver-hp/30 px-7 py-3 font-display tracking-[0.3em] text-[11px] text-silver-hp/80 hover:text-silver-hp hover:border-silver-hp/70 transition"
        >
          ← BACK TO {event.name.toUpperCase()}
        </Link>
      </div>
      <Footer />
    </main>
  );
}
