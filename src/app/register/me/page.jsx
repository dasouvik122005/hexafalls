// /register/me — self-view profile editor.
//
// Renders the ProfileEditor for the signed-in user. Anyone else lands on
// /register (login gate).

import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import RegisterShell from "@/components/register/RegisterShell";
import ProfileEditor from "@/components/register/ProfileEditor";
import { requireSession } from "@/lib/auth/server";

export const metadata = {
  title: "Your profile · HexaFalls",
  description:
    "Edit your public HexaFalls profile — college, bio, GitHub, portfolio.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function MyProfilePage() {
  const user = await requireSession("/register/me");
  return (
    <main className="flex-1">
      <TopBar />
      <RegisterShell
        eyebrow={user.username ? `@${user.username}` : "Hacker scroll"}
        title="Your"
        accent="profile"
      >
        <ProfileEditor user={user} />
      </RegisterShell>
      <Footer />
    </main>
  );
}
