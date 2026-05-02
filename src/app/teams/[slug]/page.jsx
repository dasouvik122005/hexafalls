import { notFound } from "next/navigation";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import ComingSoon from "@/components/ComingSoon";
import CallForVolunteers from "@/components/CallForVolunteers";
import { TEAMS } from "@/lib/routes";

export function generateStaticParams() {
  return TEAMS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const team = TEAMS.find((t) => t.slug === slug);
  if (!team) return { title: "The Teams · HexaFalls Techfest" };
  return {
    title: `${team.name} · HexaFalls Techfest`,
    description: team.blurb,
  };
}

export default async function TeamSlugPage({ params }) {
  const { slug } = await params;
  const team = TEAMS.find((t) => t.slug === slug);
  if (!team) notFound();

  // Volunteers is the only open scroll — render the full apply page.
  if (team.slug === "volunteers") {
    return (
      <main className="flex-1">
        <TopBar />
        <CallForVolunteers />
        <Footer />
      </main>
    );
  }

  // The other three orders: themed coming-soon with a disabled apply button.
  return (
    <main className="flex-1">
      <TopBar />
      <ComingSoon
        eyebrow={`Order · ${team.name}`}
        title="The"
        accent={team.name}
        lede={`${team.blurb} The roster, the duties, and the call to apply will be inscribed soon.`}
        whisper="“Behind every great gathering, a quiet council steadies the wand.”"
        accentColor={team.color}
        accentGlow={team.glow}
        apply={{ open: false, label: "APPLY NOW" }}
        backHref="/teams"
        backLabel="← ALL TEAMS"
      />
      <Footer />
    </main>
  );
}
