// The ONLY four events that send email (everything else → in-profile
// notifications). Each maps to its own Elixpo Mails template webhook, set in
// .env.local. A blank per-template key falls back to the shared
// ELIXPO_MAILS_ENDPOINT_KEY; blank everywhere → the send is skipped (logged).
// See docs/email_templates.md for the variable contracts.

import { env } from "@/lib/db";
import { sendMail } from "./elixpo.js";

// Template name → its dedicated webhook env var.
const WEBHOOK_ENV = {
  team_created: "ELIXPO_MAILS_WEBHOOK_TEAM_CREATED",
  team_approved: "ELIXPO_MAILS_WEBHOOK_TEAM_APPROVED",
  team_deleted: "ELIXPO_MAILS_WEBHOOK_TEAM_DELETED",
  payment_complete: "ELIXPO_MAILS_WEBHOOK_PAYMENT_COMPLETE",
};

// Resolve a per-template endpoint key, falling back to the shared one.
function endpointFor(name) {
  const v = env(WEBHOOK_ENV[name]);
  return (v && v.trim()) || env("ELIXPO_MAILS_ENDPOINT_KEY");
}

// team_created — sent to the leader when a squad is created.
export function sendTeamCreated({ to, leaderName, teamName, event, teamUrl, idempotencyKey }) {
  return sendMail({
    endpointKey: endpointFor("team_created"),
    to,
    variables: { name: leaderName ?? "there", team_name: teamName, event, team_url: teamUrl },
    idempotencyKey,
  });
}

// team_approved — sent to the leader (and optionally members) on approval.
export function sendTeamApproved({ to, name, teamName, event, teamUrl, idempotencyKey }) {
  return sendMail({
    endpointKey: endpointFor("team_approved"),
    to,
    variables: { name: name ?? "there", team_name: teamName, event, team_url: teamUrl },
    idempotencyKey,
  });
}

// team_deleted — sent to members when a leader dismantles the team.
export function sendTeamDeleted({ to, name, teamName, event, idempotencyKey }) {
  return sendMail({
    endpointKey: endpointFor("team_deleted"),
    to,
    variables: { name: name ?? "there", team_name: teamName, event },
    idempotencyKey,
  });
}

// payment_complete — sent when every member of a squad has paid (fees_settled).
export function sendPaymentComplete({ to, name, teamName, event, amount, teamUrl, idempotencyKey }) {
  return sendMail({
    endpointKey: endpointFor("payment_complete"),
    to,
    variables: {
      name: name ?? "there",
      team_name: teamName,
      event,
      amount: amount != null ? `₹${(amount / 100).toFixed(0)}` : "",
      team_url: teamUrl,
    },
    idempotencyKey,
  });
}
