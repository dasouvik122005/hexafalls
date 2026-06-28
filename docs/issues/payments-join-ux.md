# Tracking — Payments / Join-flow / Dashboard UX batch

Reported 2026-06-26. Seven linked defects across the payment lifecycle, the
squad join flow, and the profile dashboards.

## Items

- [ ] **1. Payment-success notifications.** A successful payment must notify
  BOTH the paying member ("your fee is settled") AND the admins/organizers
  ("X paid for event Y"). Today only the *whole-team* settle fires
  notifications (members + leader email); an individual payment is silent.

- [ ] **2. Pay only after approval.** A team may pay its entry fee ONLY once the
  team is approved. `paymentTimingFor()` previously let hardware-competition pay
  at registration — now every paid event is `on_approval`.

- [ ] **3. Stale "pay ₹…" button.** After a successful payment the dashboard
  still shows "fees due / PAY ₹100". Root cause: the payment row only flips to
  `paid` when the async webhook arrives (never, on localhost). Fix: reconcile the
  caller's entitlement on the `?paid=1` success return and on owner dashboard
  view; render the real price (not a hard-coded 100).

- [ ] **4. No Razorpay receipt to the client — confirm via Elixpo Mails.**
  Razorpay/Elixpo-Pay's own receipt email to the buyer must be suppressed; OUR
  payment confirmation is sent through Elixpo Mails (`payment_received`
  template). NOTE: receipt suppression is a provider-side setting — we pass a
  `send_receipt: false` hint in the checkout metadata, but the toggle must also
  be turned OFF in the Elixpo Pay dashboard for this app.

- [ ] **5. Dashboard UX.** Make `/t/<id>`, `/u/<id>`, `/u/<id>/teams`,
  `/u/<id>/notifications` and `TeamSettings` matte/solid — drop gradients,
  `backdrop-blur`, glows and RoughFrame mist for a professional look.

- [ ] **6. Sorting-ceremony button on the homepage** → links to `/house`
  (added to the Hero CTA row).

- [ ] **7. Invite link also needs approval.** Accepting an invite link must NOT
  instantly add the member. It now files a join-request that the leader/admin
  approves from the notifications / members panel — same gate as "request to
  join".

## Env keys touched
- `ELIXPO_MAILS_WEBHOOK_PAYMENT_RECEIVED` — per-member payment confirmation
  template (falls back to `ELIXPO_MAILS_ENDPOINT_KEY`).

## Test price
`pricePerPerson` is **₹3** (catalog `unit_amount: 300`, synced) for testing —
revert to 100 / 10000 and re-run `node scripts/sync-catalog.mjs` before launch.
