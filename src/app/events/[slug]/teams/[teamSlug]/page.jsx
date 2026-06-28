import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

// Team profiles moved to root /t/<slug>.
export default async function LegacyTeamRedirect({ params }) {
  const { teamSlug } = await params;
  redirect(`/t/${teamSlug}`);
}
