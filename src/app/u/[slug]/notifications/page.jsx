// /u/[slug]/notifications — the owner's notification feed (split out of profile).

import { notFound } from "next/navigation";
import Link from "next/link";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import RoughFrame from "@/components/RoughFrame";
import RegisterShell from "@/components/register/RegisterShell";
import NotificationsPanel from "@/components/profile/NotificationsPanel";
import { getDB } from "@/lib/db";
import { getSessionUser } from "@/lib/auth/server";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Notifications · HexaFalls",
  robots: { index: false, follow: false },
};

export default async function UserNotificationsPage({ params }) {
  const { slug } = await params;
  const db = getDB();
  const me = await getSessionUser();

  const user = await db
    .prepare(`SELECT id, elixpo_id, username FROM users WHERE elixpo_id = ?`)
    .bind(slug)
    .first();
  if (!user) notFound();
  const isOwner = me?.id === user.id;

  return (
    <main className="flex-1">
      <TopBar />
      <RegisterShell eyebrow="Profile" title="Owl" accent="Post" stack>
        <div className="flex flex-col gap-6">
          <Link
            href={`/u/${user.elixpo_id}`}
            className="self-start font-display text-[10px] uppercase tracking-[0.35em] text-cyan-hp/80 hover:text-cyan-hp"
          >
            ← back to profile
          </Link>

          {isOwner ? (
            <NotificationsPanel />
          ) : (
            <RoughFrame
              seed={61}
              stroke="#66FCF1"
              mistColor="#66FCF1"
              padding={22}
              className="w-full bg-slate-hp/35 backdrop-blur-sm"
            >
              <p className="font-wizard italic text-silver-hp/70 text-center text-sm">
                Notifications are private to their owner.
              </p>
            </RoughFrame>
          )}
        </div>
      </RegisterShell>
      <Footer />
    </main>
  );
}
