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

### 🅿️ Phase 0 — Foundation (must land before fan-out)
- [ ] **F0.1** `src/lib/ids.js` — add `gaming_squad` (`GAME-T-XXXXX`) + `hardware_competition_squad` (`HW-C-T-XXXXX`) (currently missing → squad create crashes).
- [ ] **F0.2** `src/lib/registration/events.js` — `gaming.pricePerPerson = 100`; add `paid/free` flags; `FIXED_ROLES` + `teamRoleFor(eventKey)`; commented `schedule` placeholder.
- [ ] **F0.3** `worker/migrations/0003_payments_roles_notifications.sql` — `payments`, `join_requests`, `notifications`, roles, extend `squads.status` machine.
- [ ] **F0.4** hexaID alignment — route `/u/[slug]` by `elixpo_id` (hexaID); `username` display-only.
- [ ] **F0.5** apply migrations locally (`wrangler d1 migrations apply hexafalls --local`).
- [ ] **F0.6** `.env.local` placeholders for the missing keys.

### 🔀 Phase 1 — Parallel workstreams
- [ ] **A. Team-leader controls** — `api/team/[id]/members/[uid]` (kick), `.../requests` (approve/deny), `.../dismantle`; team-settings UI on `/t/[slug]`.
- [ ] **B. Payments (Elixpo Pay)** — `src/lib/pay/elixpo.js`, `api/pay/checkout`, `api/pay/webhook`; per-member `payments` rows → squad rollup → `fees_settled`; payout.
- [ ] **C. Emails + notifications** — `src/lib/mail/elixpo.js` (HMAC), 4 templates, triggers; `notifications` table + UI on `/u`.
- [ ] **D. Solo + event forms** — `api/register/solo`; CP, hardware-exhibition (school fields + HS gate), squad event fields; replace "coming soon" stubs.
- [ ] **E. Profiles UI** — `/u/<hexaID>` per-event + team + payment status + notifications + evangelist→Zealey; `/t/<teamId>` payment progress bar + settings.
- [ ] **F. Roles + security** — wire fixed + dynamic roles; authz guards on every endpoint; validation; idempotency.

### 🔬 Phase 2 — Integration + security
- [ ] **P2.1** wire status machine end-to-end (free events skip payment).
- [ ] **P2.2** connect email/notification triggers.
- [ ] **P2.3** adversarial security review (authz bypass, IDOR, webhook forgery, payment tampering, CSRF, rate-limits).

### ✅ Phase 3 — Verify
- [ ] **V.1** migrations apply; tables present.
- [ ] **V.2** `npm run build` + `npm run lint` clean.
- [ ] **V.3** `next dev` walkthrough: event → SSO → `/u/<hexaID>` → team `/t/<teamId>` → invite/approve/remove → (paid) checkout → `fees_settled` → approve → email/notification.

---

## Deferred TODO — timeline conflict warning
If a user registers for two events whose **time slots overlap** (e.g. two back-to-back events at the same hour), show a **warning/notification** before they commit. **Blocked**: the timeline page currently has no event times. When the schedule exists, add `schedule: { day, start, end }` per event in `src/lib/registration/events.js` and run an overlap check against the user's existing registrations at register time.
