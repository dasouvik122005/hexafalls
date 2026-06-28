// /u/[slug]/settings — GATED profile editor (owner only).
//
// The public profile (/u/[slug]) links here behind an "Edit profile" button
// shown only to the owner. Ownership is re-checked server-side: a non-owner (or
// signed-out visitor) is sent back to the public profile. The form posts to
// PATCH /api/me/profile with current values pre-filled. Verification (gdg) now
// happens here once the profile is complete.
//
// Compact, professional header — no oversized hero title.

import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import ProfileEditor from "@/components/register/ProfileEditor";
import PageBackdrop from "@/components/PageBackdrop";
import { getDB } from "@/lib/db";
import { getSessionUser } from "@/lib/auth/server";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Edit profile · HexaFalls",
  robots: { index: false, follow: false },
};

export default async function UserSettingsPage({ params }) {
  const { slug } = await params;
  const db = getDB();
  const me = await getSessionUser();

  // Need the full profile row so the form can pre-fill current values —
  // getSessionUser() only returns identity columns, not the editable fields.
  const user = await db
    .prepare(
      `SELECT id, elixpo_id, email, bio, college, year, github, linkedin,
              portfolio, gdg_email, gdg_verified
         FROM users WHERE elixpo_id = ?`,
    )
    .bind(slug)
    .first();
  if (!user) notFound();

  // Owner-only: anyone else (incl. signed-out) goes back to the public profile.
  if (!me || me.id !== user.id) redirect(`/u/${user.elixpo_id}`);

  return (
    <main className="flex-1">
      <TopBar />
      <section className="relative isolate overflow-hidden min-h-screen px-6 pt-28 pb-24">
        <PageBackdrop />
        <div className="mx-auto w-full max-w-2xl">
          <Link
            href={`/u/${user.elixpo_id}`}
            className="font-display text-[10px] uppercase tracking-[0.35em] text-cyan-hp/80 hover:text-cyan-hp"
          >
            ← back to profile
          </Link>

          <div className="mt-6 mb-8 flex flex-col gap-1.5">
            <span className="font-display text-[10px] uppercase tracking-[0.45em] text-cyan-hp/70">
              Your scroll
            </span>
            <h1 className="font-display text-2xl sm:text-3xl tracking-tight text-silver-hp">
              Edit profile
            </h1>
          </div>

          <ProfileEditor user={user} />
        </div>
      </section>
      <Footer />
    </main>
  );
}
