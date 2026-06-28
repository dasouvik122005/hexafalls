import { redirect } from "next/navigation";

// Legacy entry — registration now lives under each event at
// /events/<event>/register. Send anyone here to the events hub.
export default function LegacyRegisterIndex() {
  redirect("/events");
}
