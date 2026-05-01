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

  return (
    <main className="flex-1">
      <TopBar />
      <ComingSoon
        eyebrow={`Track · ${event.name}`}
        title="The"
        accent={event.name.replace(/^The\s+/i, "")}
        lede={`${event.blurb} The full brief — rules, schedule, judging — is being inked. Return soon, or peek at the prizes already.`}
        whisper="“Every contest is a small spell, and every spell needs its rules.”"
      />
      {/* secondary CTA: prizes */}
      <div className="-mt-12 mb-24 flex justify-center px-6">
        <Link
          href={`/events/${event.slug}/prizes`}
          className="relative inline-flex items-center gap-3 overflow-hidden rounded-full border border-gold-hp/50 bg-gold-hp/10 px-7 py-3 font-display tracking-[0.3em] text-[12px] text-gold-hp hp-glow-gold hover:bg-gold-hp/15 hover:border-gold-hp hover:shadow-[0_0_24px_rgba(212,175,55,0.35)] transition"
        >
          <span className="relative z-10">SEE THE PRIZES</span>
          <span className="relative z-10">↗</span>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(212,175,55,0.25), transparent)",
              animation: "hp-shimmer 3.6s linear infinite",
            }}
          />
        </Link>
      </div>
      <Footer />
    </main>
  );
}
