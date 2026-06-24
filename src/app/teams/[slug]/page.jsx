import { notFound } from "next/navigation";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import ComingSoon from "@/components/ComingSoon";
import { TEAMS } from "@/lib/routes";

export function generateStaticParams() {
  // `orgs` is served by the dedicated /teams/orgs page.
  return TEAMS.filter((t) => t.slug !== "orgs").map((t) => ({ slug: t.slug }));
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

  // Three states:
  //   open       → scroll is open, apply (evangelists).
  //   processing → entries closed, applications under review — point to the
  //                timeline for when the chosen names are revealed (core team,
  //                volunteers).
  //   soon       → not opened yet (organising team).
  const isOpen = Boolean(team.open && team.formUrl);
  const isProcessing = Boolean(team.processing);

  const lede = isOpen
    ? `${team.blurb} The scroll is open — sign on to join the order.`
    : isProcessing
      ? `${team.blurb} Entries for the ${team.name} have closed and the names are now under review. Follow the timeline to learn when the chosen are revealed.`
      : `${team.blurb} The roster, the duties, and the call to apply will be inscribed soon.`;

  const apply = isOpen
    ? { open: true, href: team.formUrl, external: true, label: "APPLY NOW" }
    : isProcessing
      ? { open: false, label: "ENTRIES CLOSED" }
      : { open: false, label: "APPLY NOW" };

  return (
    <main className="flex-1">
      <TopBar />
      <ComingSoon
        eyebrow={`Order · ${team.name}`}
        title="The"
        accent={team.name}
        lede={lede}
        whisper="“Behind every great gathering, a quiet council steadies the wand.”"
        accentColor={team.color}
        accentGlow={team.glow}
        apply={apply}
        statusLabel={isProcessing ? "Entries closed · under review" : undefined}
        applyBadge={isProcessing ? "UNDER REVIEW" : "COMING SOON"}
        backHref={isProcessing ? "/timeline" : "/teams"}
        backLabel={isProcessing ? "VIEW THE TIMELINE →" : "← ALL TEAMS"}
      />
      <Footer />
    </main>
  );
}
