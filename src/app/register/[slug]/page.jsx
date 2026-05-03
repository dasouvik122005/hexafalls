import { notFound } from "next/navigation";
import Link from "next/link";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import RegistrationWizard from "@/components/registration/RegistrationWizard";
import RoughDivider from "@/components/RoughDivider";
import { REGISTRATION_TRACKS } from "@/lib/registrationTracks";

export function generateStaticParams() {
  return Object.keys(REGISTRATION_TRACKS).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const track = REGISTRATION_TRACKS[slug];
  if (!track) return { title: "Registration · HexaFalls Techfest" };
  return {
    title: `${track.name} · Registration · HexaFalls Techfest`,
    description: track.blurb,
  };
}

export default async function TrackRegisterPage({ params }) {
  const { slug } = await params;
  const track = REGISTRATION_TRACKS[slug];
  if (!track) notFound();

  return (
    <main className="flex-1">
      <TopBar />
      <section className="relative isolate overflow-hidden min-h-screen pt-32 pb-24 px-6">
        {/* themed eyebrow */}
        <div className="mx-auto mb-6 flex max-w-3xl items-center justify-center gap-3 text-[11px] uppercase tracking-[0.5em] font-display text-center"
             style={{ color: track.color }}>
          <RoughDivider width={48} height={20} color={track.color} seed={119} />
          {track.eyebrow}
          <RoughDivider width={48} height={20} color={track.color} seed={123} />
        </div>

        {/* headline */}
        <h1
          className="text-center font-display font-black tracking-tight leading-[0.95] text-[10vw] sm:text-[7vw] md:text-[5vw] hp-glow"
          style={{ color: track.color, textShadow: `0 0 28px ${track.glow}` }}
        >
          {track.headline}
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-center font-wizard text-silver-hp/75 text-base">
          {track.blurb}
        </p>

        {/* the wizard */}
        <div className="mx-auto mt-12 w-full max-w-3xl">
          <RegistrationWizard track={track} />
        </div>

        <div className="mt-12 flex justify-center">
          <Link
            href={`/events/${track.slug}`}
            className="inline-flex items-center gap-2 font-display tracking-[0.3em] uppercase text-[11px] text-silver-hp/70 hover:text-silver-hp transition"
          >
            ← Back to {track.name}
          </Link>
        </div>
      </section>
      <Footer />
    </main>
  );
}
