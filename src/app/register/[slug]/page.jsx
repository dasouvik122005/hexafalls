import { redirect } from "next/navigation";
import { REGISTRATION_EVENTS } from "@/lib/registration/events";

export const dynamic = "force-dynamic";

// Legacy registration slug → new events-scoped route.
export default async function LegacyEventRegisterRedirect({ params }) {
  const { slug } = await params;
  const cfg = REGISTRATION_EVENTS[slug];
  if (!cfg) redirect("/events");
  if (cfg.parentEvent === "hardware") {
    const mode = slug === "hardware-competition" ? "competition" : "exhibition";
    redirect(`/events/hardware/register?mode=${mode}`);
  }
  redirect(`/events/${cfg.parentEvent}/register`);
}
