import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/server";

export const dynamic = "force-dynamic";

// Legacy self-profile/editor — profile + edit now live at /u/<username>.
export default async function LegacyMeRedirect() {
  const user = await getSessionUser();
  redirect(user?.username ? `/u/${user.username}` : "/events");
}
