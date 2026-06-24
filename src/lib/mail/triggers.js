// The ONLY four events that send email (everything else → in-profile
// notifications). Each maps to an Elixpo Mails template webhook. Templates
// share one endpoint key today (ELIXPO_MAILS_ENDPOINT_KEY); when each template
// gets its own webhook, set ELIXPO_MAILS_ENDPOINT_KEY_<NAME> and they are
// picked up below. See docs/email_templates.md for the variable contracts.

import { env } from "@/lib/db";
import { sendMail } from "./elixpo.js";

// Resolve a per-template endpoint key, falling back to the shared one.
function endpointFor(name) {
  return env(`ELIXPO_MAILS_ENDPOINT_KEY_${name.toUpperCase()}`) ?? env("ELIXPO_MAILS_ENDPOINT_KEY");
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
