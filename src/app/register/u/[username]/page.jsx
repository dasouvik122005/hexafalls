import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

// Legacy public profile → root /u/<username>.
export default async function LegacyUserRedirect({ params }) {
  const { username } = await params;
  redirect(`/u/${username}`);
}
