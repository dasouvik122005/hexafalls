# HexaFalls — Registration System Plan & Kanban

> Single source of truth for the registration build. Top half = spec & decisions.
> Bottom half = the Kanban we work from. Keep cards moving as work lands.

---

## Context
Finish the **entire** registration system. Auth/SSO + basic squad create/join/submit/review exist; payments, emails, in-profile notifications, team-leader controls, solo forms, the role model, and the profile UIs do not. Build fast, in parallel, and **securely** — we are effectively building a standalone Devfolio.

## Integration docs (read before touching that area)
- SSO / OAuth → [`docs/sso_elixpo.md`](./sso_elixpo.md)
- Payments / payout → [`docs/payments_elixpo.md`](./payments_elixpo.md)
- Transactional email → [`docs/mails_elixpo.md`](./mails_elixpo.md)

## Confirmed decisions
- **Profiles:** `/u/<hexaID>` keyed by the Elixpo hexaID (`hf_mlh_…`, 12 alnum, = `users.elixpo_id`). `/t/<teamId>` unchanged. `username` is a display handle only.
- **Gaming is now PAID:** ₹100 / member (changed from free).
- **Status term:** "entry fees paid" → **`fees_settled`**.
- **Payments are ONE-TIME (no autopay):** a single ₹100/member charge grants full access for the season. The `member` price must be configured as `one_time` in the Elixpo Pay catalog. Reconciliation is strictly additive — never expires/downgrades a paid seat.
- **Payments + Emails:** built against the documented Elixpo Pay / Mails APIs with **placeholder env keys**; verified live only once real keys land.
- **Timeline conflict warning:** deferred — see note below.

## Blockers / pending inputs
- `.env.local` is missing: `ELIXPO_CLIENT_ID`, `ELIXPO_CLIENT_SECRET`, `SESSION_SECRET`, `ELIXPO_PAY_API_KEY`, `ELIXPO_PAY_APP_ID`, `ELIXPO_PAY_WEBHOOK_SECRET`, `ELIXPO_MAILS_PRODUCT_SECRET`, `ELIXPO_MAILS_ENDPOINT_KEY`. Added as **placeholders**; replace with real values to go live.
- **Timeline has no event times.** The "two consecutive/overlapping events → warn the user" feature is **deferred** until a real schedule (date + start/end per event) is provided. When it lands, add a `schedule` block to `src/lib/registration/events.js` and check overlap at registration time.

---

## Spec reference

### Roles
- **Fixed (assigned manually, never self-registered):** `hexafalls_evangelists`, `hexafalls_teams`, `hexafalls_organisers`, `hexafalls_judges`, `hexafalls_mentors`.
- **Dynamic (granted on registration):** `team_hackathon`, `team_hardware_competition`, `team_hardware_exhibition`, `team_gaming`, `team_competitive_programming`.
- Evangelists: profile shows a button that **redirects to Zealey** (their tracking platform).

### Registration pipeline
1. User opens an event, e.g. `https://hexafalls.org/events/cp`, taps **Register**.
2. → Elixpo SSO (`docs/sso_elixpo.md`); returns a **hexaID** `hf_mlh_[12 alnum]`.
3. Primary account is created; the event registration appears under their profile `/u/<hexaID>`.
4. For team events, the user **creates a team** or **joins one** (invite link); reflected on `/u/<hexaID>` and `/t/<teamId>`.

### Teams
- Team events: **hackathon, hardware-competition, hardware-exhibition, gaming**. **CP is solo-only.**
- Every team has a **teamId** (like the user hexaID).
- Exactly **one leader**; the leader **cannot leave** — if they do, the team is **dismantled** and all members lose their team binding.
- Leader can: invite via a **fixed per-team invite link**, **remove** members, **approve/deny** join requests (team settings).
- **Team status:** `registered → under_review → fees_settled → approved` (+ `rejected`). `fees_settled` is N/A for free events.

### Payments (per member, mapped to the team)
| Event | Team size | Fee |
|---|---|---|
| Software Hackathon | 2–4 | **₹100 / member** |
| Hardware Competition | 2–5 | **₹100 / member** |
| Gaming | 2–4 | **₹100 / member** |
| Hardware Exhibition | solo (high-school) | **free** |
| Competitive Programming | solo | **free** |
- Team settings show a **payment progress bar** (collected vs total). Per-member payment maps to the team. Payout per `docs/payments_elixpo.md`.

### Notifications
- **Email only** for big events: **team creation, team approval, team deletion, full payment**.
- Everything else → **in-profile notifications**.

### Email templates to create (Elixpo Mails)
`team_created` · `team_approved` · `team_deleted` · `payment_complete`.

---

## KANBAN

### 🅿️ Phase 0 — Foundation ✅ DONE
- [x] **F0.1** `src/lib/ids.js` — added `gaming_squad` (`GAME-T-`) + `hardware_competition_squad` (`HW-C-T-`) + `payment` (`PAY-`), `join_request` (`JR-`), `notification` (`NOTE-`).
- [x] **F0.2** `src/lib/registration/events.js` — `gaming.pricePerPerson = 100`; `isPaidEvent()`; `FIXED_ROLES` + `teamRoleFor()`; commented `EVENT_SCHEDULE` placeholder.
- [x] **F0.3** `worker/migrations/0003_payments_roles_notifications.sql` — `payments`, `join_requests`, `notifications`, `user_roles`; `squads.paid` + `fees_settled_at`; status synonyms.
- [x] **F0.4** `/u/[slug]` re-keyed to `elixpo_id` (hexaID); `userUrl()` takes hexaID; `/t` member links use hexaID.
- [x] **F0.5** migration applied locally; tables + columns verified present.
- [x] **F0.6** `.env.local` — SSO/session/Pay/Mails keys (Pay creds real, Mails placeholder).
- [x] **F0.7** shared libs: `src/lib/roles.js`, `src/lib/notifications.js`, `src/lib/mail/elixpo.js` (HMAC), `src/lib/mail/triggers.js`.

### 🔀 Phase 1 — Parallel workstreams ✅ DONE
- [x] **A. Team-leader controls** — `api/team/[id]/members/[uid]` (kick), `.../requests` (GET list / approve-deny), `.../dismantle`, `api/register/squad/[id]/request` (request-to-join); `src/components/team/TeamSettings.jsx`.
- [x] **B. Payments (Elixpo Pay)** — `src/lib/pay/elixpo.js`, `api/pay/checkout`, `api/pay/webhook`; per-member `payments` rows → squad rollup → `fees_settled` + email/notify.
- [x] **C. Emails + notifications** — mail core + 4 triggers; `api/notifications` (GET/POST read); `src/components/profile/NotificationsPanel.jsx`; `docs/email_templates.md`.
- [x] **D. Solo + event forms** — `api/register/solo` (CP handles, hardware-exhibition school fields + HS gate, whitelisted/capped); `SoloRegisterForm.jsx`; replaced the "coming soon" stub.
- [x] **E. Profiles UI** — `/u/<hexaID>` notifications + entries + paid chips + `PayButton` + evangelist→Zealey; `/t/<teamId>` payment progress bar + `TeamSettings`.

### 🔬 Phase 2 — Integration + security ✅ DONE
- [x] **P2.1** status machine wired (free events skip payment; paid events gated — see security notes).
- [x] **P2.2** triggers wired: squad-create → `team_created` + role; join → role + leader notify; admin approve → `team_approved` + member notifies; reject → notify.
- [x] **P2.3** adversarial security review run; HIGH/MED/LOW findings fixed (see below).

### ✅ Phase 3 — Verify
- [x] **V.1** migrations apply; `payments`/`join_requests`/`notifications`/`user_roles` + `squads.paid`/`fees_settled_at` present.
- [x] **V.2** `eslint` clean on all new/changed files (pre-existing img/hook warnings elsewhere untouched). `npm run build` intentionally left to the dev-server owner.
- [ ] **V.3** `next dev` end-to-end walkthrough — **pending real Elixpo Pay/Mails + a live SSO login** (placeholders make external calls no-op/log).

---

## Security review — findings & resolutions
- **H1 (fixed)** paid team could be approved without paying → admin review now refuses `approve` on a paid event unless `fees_settled`/`paid=1`.
- **H2 (fixed)** submit had no status guard (clobbered review audit, TOCTOU) → `UPDATE … WHERE status IN ('forming','registered','rejected')` + `changes` check.
- **M1 (fixed)** submit persisted arbitrary client blob into `details_json` → bounded whitelist sanitizer (flat, typed, capped keys/length).
- **M2/M3 (fixed)** capacity + same-event TOCTOU on join/approve → single atomic conditional `INSERT … SELECT … WHERE count<max AND NOT EXISTS(same-event)` + `changes` check.
- **L1 (fixed)** dismantle could cascade-delete paid `payments` → blocked once `fees_settled`/`approved` (admin must unwind w/ refund).
- **L3 (fixed)** notification `body`/`link` now length-capped.
- **L2 (accepted/noted)** webhook metadata fallback could mis-attribute a settled fee across squads — low risk (requires valid signature); prefer order-id, documented.
- **Verified-correct:** webhook sig verified on raw body pre-parse + constant-time + replay window + idempotent; amounts server-derived; IDOR/ownership re-derived from DB everywhere; SQL fully parameterized; cookie httpOnly+SameSite=Lax; no secret leakage; emails to DB-derived addresses with idempotency keys.

## Payment reconciliation (cron)
- **Webhook** `POST /api/callback/payouts` is the primary path (settles in real time).
- **Safety net:** `POST /api/cron/sync-payments` pulls Elixpo Pay `GET /v1/sync?app=`, marks any missed `pending→paid`, rolls squads to `fees_settled`. Shared `settleSquadIfComplete` (`src/lib/pay/settle.js`) so webhook + cron settle identically and idempotently.
- **Schedule:** `.github/workflows/sync-payments.yml` — every 15 min + manual dispatch. Hits the hardcoded `https://hexafalls.org/api/cron/sync-payments`. Auths with `Authorization: Bearer ${{ secrets.ELIXPO_PAY_API_KEY }}` (constant-time compared against `CRON_SECRET` if set, else `ELIXPO_PAY_API_KEY`).
- **Prod secrets needed:** `wrangler secret put ELIXPO_PAY_API_KEY` (+ `ELIXPO_PAY_APP_ID`, `ELIXPO_PAY_WEBHOOK_SECRET`, mails keys, optional `CRON_SECRET`) — `.env.local` is local-only.

## Known follow-ups (not blocking)
- ✅ Elixpo Mails keys + 4 per-template webhooks set live in `.env.local`; mail trigger reads `ELIXPO_MAILS_WEBHOOK_TEAM_CREATED/_APPROVED/_DELETED/_PAYMENT_COMPLETE`.
- ✅ Elixpo Pay creds + `ELIXPO_PAY_WEBHOOK_SECRET` set live; webhook handler moved to **`/api/callback/payouts`** to match the dashboard's `ELIXPO_PAY_WEBHOOK_URL`.
- Confirm the Elixpo Pay **checkout** endpoint path (assumed `POST /v1/checkout/sessions`) + that its webhook signing matches the Mails `t=,v1=` HMAC scheme — verify on first real charge.
- Build the 4 email templates in lixeditor per `docs/email_templates.md` (vars must match exactly).
- Optional: gate `pay/checkout` to require `submitted/under_review` so payment can't precede review (currently payment allowed any time after joining).
- Set a real `ZEALEY_URL` for the evangelist button.

---

## Deferred TODO — timeline conflict warning
If a user registers for two events whose **time slots overlap** (e.g. two back-to-back events at the same hour), show a **warning/notification** before they commit. **Blocked**: the timeline page currently has no event times. When the schedule exists, add `schedule: { day, start, end }` per event in `src/lib/registration/events.js` and run an overlap check against the user's existing registrations at register time.
