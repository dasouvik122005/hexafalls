# Elixpo Pay Docs — Overview

Source: https://payouts.elixpo.com/docs

This is one section of the Elixpo Pay developer documentation. Elixpo Pay is the payments and creator payouts platform for Elixpo.

---
# Elixpo Pay — Overview

Elixpo Pay is the payments and payouts layer for the Elixpo ecosystem, and an open SaaS for any developer. It abstracts providers behind one API plus a hosted checkout, a unified ledger, entitlement grants, and creator payouts.

## How it fits together

Your app never touches card data. Your server creates a checkout session with your secret key and redirects the buyer to our hosted checkout; we charge them through a provider (Razorpay for INR in P0), then grant an entitlement and tell your app about it two ways:

- a signed entitlement.updated webhook delivered to your app, and
- a pull endpoint, GET /v1/entitlements?app=&uid=, you can call any time.

## Core concepts

- Merchant — your tenant. You sign in with Elixpo Accounts.
- App — a project under your merchant (e.g. lixblogs), with its own API key.
- Product — a sellable tier (e.g. member).
- Price — a regional/PPP variant of a product in a currency. Each price has a type of one_time (manual re-purchase each cycle) or recurring (autopay mandate, billed automatically).
- Entitlement — the tier + expiry a customer currently holds.
- Subscription — for autopay prices, the recurring billing mandate. We manage the Razorpay subscription, the renewal charges, and emit entitlement.updated on every successful cycle.

## Billing modes

- One-time — buyer goes through Razorpay Checkout, pays once, gets entitlement for the price's interval (e.g. 30 days). Re-buying is manual.
- Autopay (recurring) — buyer goes through Razorpay's hosted mandate page (UPI Autopay or Card eMandate), and Razorpay charges them automatically each cycle. You receive entitlement.updated on every renewal.
Switch modes per price with the type field in your catalog JSON — no other change needed in your integration. See Catalog sync.

## Cancellation

For autopay prices, buyers can self-serve cancel from your app — see Checkout sessions → Cancelling. Graceful by default: access continues through the paid period, then the entitlement expires and you get a final entitlement.updated with active: false.

---

# API reference (transcribed from https://payouts.elixpo.com/docs — the live
# docs have these sections; this file previously had only the Overview, which
# led to wrong field assumptions. Keep in sync with our code in src/lib/pay/.)

## Catalog sync — `POST /v1/sync`

Products/prices are managed from code, not the dashboard. We version
`payouts.catalog.json` and push it with the secret key (`scripts/sync-catalog.mjs`).

```
POST https://payouts.elixpo.com/v1/sync
Authorization: Bearer <ELIXPO_PAY_API_KEY>
{
  "app": { "homepage_url": "…", "pricing_url": "…" },   // optional
  "products": [
    {
      "tier": "member",                 // [a-z0-9_], upserts by (app, tier)
      "name": "…",
      "description": "…",
      "prices": [
        { "nickname": "India", "currency": "INR", "unit_amount": 10000,
          "interval": "year", "region": "IN", "type": "one_time" }
      ]
    }
  ]
}
```
- `unit_amount` is **minor units** (paise/cents). `type` is `one_time` | `recurring`.
- Prices reconcile by `(currency, region, interval)`; a price no longer in the
  file is **deactivated** (never hard-deleted).
- ⚠️ `/v1/sync` returns **HTTP 200 even on validation failure** — you MUST inspect
  the body and treat `ok:false` or a non-empty `errors[]` as a failure.

## Checkout — `POST /v1/checkout/sessions`

```
POST https://payouts.elixpo.com/v1/checkout/sessions
Authorization: Bearer <ELIXPO_PAY_API_KEY>
{
  "tier": "member",
  "currency": "INR",                    // Pay resolves the catalog price
  "customer": { "uid": "…", "email": "…" },
  "success_url": "https://…",
  "metadata": { … }                     // echoed onto the session
}
→ 201 { "id": "cs_…", "url": "…", "amount": 10000, "currency": "INR",
        "tier": "member", "expires_at": "…" }
```
- **You never send `amount`** — Pay looks up the active price for `(tier, currency)`,
  so the buyer can't tamper with the price.
- `uid` is the buyer id **in our namespace**. We use `${userId}:${event}` so one
  `member` tier covers every paid event yet each fee is its own entitlement.

## Webhooks — `POST <our endpoint>` (we use `/api/callback/payouts`)

Events: `entitlement.updated` (required — fulfillment) and `payment.captured`
(optional — receipts/analytics). Headers + signature:
```
X-Elixpo-Pay-Event:     entitlement.updated
X-Elixpo-Pay-Timestamp: 1718500000
X-Elixpo-Pay-Signature: sha256=<hex HMAC-SHA256 of `${timestamp}.${rawBody}` with ELIXPO_PAY_WEBHOOK_SECRET>
```
`entitlement.updated` payload `data`: `{ app, uid, tier, status, active, expires_at, version }`.
**No order id / metadata is echoed** — match the payment by `uid` (→ user+event).
`active` already accounts for expiry. Verify the signature on the RAW body before
parsing.

## Entitlements API — `GET /v1/entitlements?app=&uid=`

Server-to-server read of a customer's current entitlement; used to **reconcile if
a webhook was missed** (`src/lib/pay/sync.js`, run by the GitHub Actions cron).
```
GET /v1/entitlements?app=<app>&uid=<uid>
Authorization: Bearer <ELIXPO_PAY_API_KEY>
→ { app, uid, tier, status, active, expires_at, version }
```
- Gate on `active` (already accounts for expiry). No entitlement → safe default
  `{ tier:"free", status:"none", active:false }`. Bad key → 401, unknown app → 404.
