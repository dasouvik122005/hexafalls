import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import Events from "@/components/Events";
import { getDB } from "@/lib/db";
import { getSessionUser } from "@/lib/auth/server";
import { REGISTRATION_EVENTS } from "@/lib/registration/events";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "The Events · HexaFalls Techfest",
  description:
    "Five tracks at HexaFalls: hackathon, competitive programming, gaming, hardware and software. Briefs and prizes coming soon. Co-developed by Ayushman Bhattacharya.",
};

// Map a registration-event key (e.g. hardware-competition) onto the /events
// parent slug (e.g. hardware) that the cards are keyed by.
function parentSlug(eventKey) {
  return REGISTRATION_EVENTS[eventKey]?.parentEvent ?? eventKey;
}

export default async function EventsPage() {
  const me = await getSessionUser();

  // Which /events tracks has the signed-in user already registered for? Pulls
  // from both squad memberships and solo registrations, mapped to parent slugs.
  let registered = [];
  let profileHref = null;
  if (me) {
    profileHref = `/u/${me.elixpo_id}`;
    const db = getDB();
    const [sq, so] = await Promise.all([
      db
        .prepare(
          `SELECT DISTINCT s.event FROM squad_members sm
             JOIN squads s ON s.id = sm.squad_id WHERE sm.user_id = ?`,
        )
        .bind(me.id)
        .all(),
      db
        .prepare(`SELECT DISTINCT event FROM solo_registrations WHERE user_id = ?`)
        .bind(me.id)
        .all(),
    ]);
    const keys = [
      ...(sq.results ?? []).map((r) => r.event),
      ...(so.results ?? []).map((r) => r.event),
    ];
    registered = [...new Set(keys.map(parentSlug))];
  }

  return (
    <main className="flex-1">
      <TopBar />
      <Events registered={registered} profileHref={profileHref} />
      <Footer />
    </main>
  );
}
