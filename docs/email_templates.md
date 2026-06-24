# HexaFalls — Email Templates (Elixpo Mails)

HexaFalls sends email for exactly **four** events. Everything else (join
requests, profile nudges, etc.) goes to the in-profile *Owl Post* notifications
feed, never to email.

Each event maps to one Elixpo Mails **template** built in the **lixeditor**
WYSIWYG editor, with a signed **webhook** triggered by
`src/lib/mail/triggers.js`. The trigger functions fill `{{variable}}`
placeholders via the request `variables` object; the variable list below is the
exact contract each template must consume.

**All four templates are `transactional`** — turn the transactional flag **on**
in lixeditor. Transactional mail bypasses unsubscribe/suppression, carries no
`List-Unsubscribe` headers, and `{{unsubscribe_url}}` is intentionally *not*
available. These are essential account/registration mails.

The per-product footer (logo, address, phone, quote) and background colour are
applied automatically to every send, so you do not need to add them to the
template body.

---

## Environment keys

Configured server-side (e.g. `.env.local` / Worker secrets). Read by
`src/lib/mail/elixpo.js` and `src/lib/mail/triggers.js` via the `env()` helper.

| Env key | Required | Purpose |
|---|---|---|
| `ELIXPO_MAILS_PRODUCT_SECRET` | yes | The product's shared signing secret (shown once on product creation). Used as the HMAC-SHA256 key for every trigger. |
| `ELIXPO_MAILS_ENDPOINT_KEY` | yes | The shared webhook `endpoint_key`. Used for **all** templates today (one webhook). |
| `ELIXPO_MAILS_ENDPOINT_KEY_TEAM_CREATED` | optional | Per-template override for `team_created`. Falls back to `ELIXPO_MAILS_ENDPOINT_KEY` when unset. |
| `ELIXPO_MAILS_ENDPOINT_KEY_TEAM_APPROVED` | optional | Per-template override for `team_approved`. |
| `ELIXPO_MAILS_ENDPOINT_KEY_TEAM_DELETED` | optional | Per-template override for `team_deleted`. |
| `ELIXPO_MAILS_ENDPOINT_KEY_PAYMENT_COMPLETE` | optional | Per-template override for `payment_complete`. |

Resolution (`endpointFor(name)` in `triggers.js`):
`ELIXPO_MAILS_ENDPOINT_KEY_<NAME-UPPERCASED>` if set, otherwise the shared
`ELIXPO_MAILS_ENDPOINT_KEY`. So you can ship all four through one webhook now and
split them onto dedicated webhooks later just by setting the per-template keys —
no code change.

If `ELIXPO_MAILS_PRODUCT_SECRET` or the endpoint key is missing or starts with
`PLACEHOLDER`, the send is skipped (logged, never throws) so registration/payment
flows never break.

---

## HMAC signing scheme (from docs/mails_elixpo.md)

Every trigger POST is HMAC-SHA256 signed with the **product secret**.

- **Endpoint**: `POST https://mails.elixpo.com/v1/hooks/<endpoint_key>`
- **Header**: `X-Elixpo-Signature: t=<unix_seconds>,v1=<hex HMAC-SHA256>`
- **Signed string**: `` `${t}.${rawBody}` `` — the unix timestamp, a literal dot,
  then the **exact JSON body bytes** that are sent. Build the JSON once and sign
  those same bytes; re-serializing breaks the signature.
- **HMAC key**: `ELIXPO_MAILS_PRODUCT_SECRET`.
- **Tolerance**: requests outside a 5-minute window (server time vs `t`) are
  rejected (`400`). During secret rotation the previous secret is accepted for a
  short grace window.
- **Request body**:
  ```json
  { "to": "user@example.com", "variables": { ... }, "idempotency_key": "optional" }
  ```
  `idempotency_key` dedupes retries — the same key never sends twice.

Responses: `200 {ok:true,status:"sent"}` · `200 {ok:false,status:"suppressed"}`
(no-op; not relevant for transactional) · `502 {ok:false,status:"failed"}` ·
`401` bad signature · `400` bad timestamp/recipient · `403` disabled
webhook/product · `404` unknown endpoint_key.

Implementation reference: `src/lib/mail/elixpo.js` (`sendMail`).

---

## Templates

### 1. `team_created`

- **Purpose**: Confirm to a squad leader that their team was created and is now
  awaiting admin review.
- **Recipient**: the **team leader** (the user who created the squad).
- **Trigger point**: squad creation, via `sendTeamCreated(...)`.
- **Variables**:

  | Variable | Example value |
  |---|---|
  | `{{name}}` | `Ada` (leader's display name; falls back to `there`) |
  | `{{team_name}}` | `The Phoenix Coders` |
  | `{{event}}` | `HexaFalls 2026` |
  | `{{team_url}}` | `https://hexafalls.dev/u/team/the-phoenix-coders` |

- **Suggested subject**: `Your squad "{{team_name}}" is registered for {{event}}`
- **Suggested body**:
  > Hi {{name}},
  >
  > Your squad **{{team_name}}** has been created for **{{event}}**. It's now
  > awaiting organiser approval — we'll send another owl the moment it's
  > approved.
  >
  > In the meantime, share your invite link from your team page and gather your
  > crew: {{team_url}}
  >
  > See you at the castle gates.

---

### 2. `team_approved`

- **Purpose**: Tell the leader their squad has been approved by an organiser and
  is officially in.
- **Recipient**: the **team leader** (and optionally members).
- **Trigger point**: admin approval, via `sendTeamApproved(...)`.
- **Variables**:

  | Variable | Example value |
  |---|---|
  | `{{name}}` | `Ada` (recipient's display name; falls back to `there`) |
  | `{{team_name}}` | `The Phoenix Coders` |
  | `{{event}}` | `HexaFalls 2026` |
  | `{{team_url}}` | `https://hexafalls.dev/u/team/the-phoenix-coders` |

- **Suggested subject**: `"{{team_name}}" is approved for {{event}} 🎉`
- **Suggested body**:
  > Hi {{name}},
  >
  > Great news — **{{team_name}}** has been approved for **{{event}}**. Your
  > spot is locked in.
  >
  > Manage your squad, confirm your roster, and settle fees from your team page:
  > {{team_url}}
  >
  > Onward.

---

### 3. `team_deleted`

- **Purpose**: Notify members that their squad has been dismantled by the leader.
- **Recipient**: the **squad members** (everyone except the leader who removed it).
- **Trigger point**: leader dismantles the team, via `sendTeamDeleted(...)`.
- **Variables**:

  | Variable | Example value |
  |---|---|
  | `{{name}}` | `Grace` (member's display name; falls back to `there`) |
  | `{{team_name}}` | `The Phoenix Coders` |
  | `{{event}}` | `HexaFalls 2026` |

  > Note: this template has **no** `{{team_url}}` — the team no longer exists.

- **Suggested subject**: `"{{team_name}}" has been disbanded`
- **Suggested body**:
  > Hi {{name}},
  >
  > The squad **{{team_name}}** for **{{event}}** has been dismantled by its
  > leader, so you're no longer a member.
  >
  > No worries — you can still join another squad or start your own before
  > registration closes. We'd love to see you there.

---

### 4. `payment_complete`

- **Purpose**: Confirm that every member of the squad has paid and fees are fully
  settled.
- **Recipient**: the squad (leader / members — the address passed as `to`).
- **Trigger point**: when all members have paid (`fees_settled`), via
  `sendPaymentComplete(...)`.
- **Variables**:

  | Variable | Example value |
  |---|---|
  | `{{name}}` | `Ada` (recipient's display name; falls back to `there`) |
  | `{{team_name}}` | `The Phoenix Coders` |
  | `{{event}}` | `HexaFalls 2026` |
  | `{{amount}}` | `₹1200` (formatted in the trigger from paise: `₹${(amount/100).toFixed(0)}`; empty string when unknown) |
  | `{{team_url}}` | `https://hexafalls.dev/u/team/the-phoenix-coders` |

- **Suggested subject**: `Payment complete — {{team_name}} is all set for {{event}}`
- **Suggested body**:
  > Hi {{name}},
  >
  > Every member of **{{team_name}}** has paid — your registration fee of
  > **{{amount}}** for **{{event}}** is fully settled. You're 100% locked in.
  >
  > Review your squad and event details any time: {{team_url}}
  >
  > Thank you — see you at HexaFalls.

---

## Builder checklist (lixeditor)

For each of the four templates:

1. Create the template in lixeditor; place the `{{variables}}` from its table in
   the subject and body (Elixpo Mails derives the variable list automatically).
2. **Turn the `transactional` flag ON.** Do not add `{{unsubscribe_url}}`.
3. Attach a webhook → copy its `endpoint_key`.
4. Wire the key: use the shared `ELIXPO_MAILS_ENDPOINT_KEY` for all four, or set
   the per-template `ELIXPO_MAILS_ENDPOINT_KEY_<NAME>` to split them onto
   dedicated webhooks.
5. Confirm `ELIXPO_MAILS_PRODUCT_SECRET` is set so triggers can sign requests.
