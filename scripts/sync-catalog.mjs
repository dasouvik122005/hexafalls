// Push payouts.catalog.json to Elixpo Pay (catalog sync).
//
// Products/prices are managed from code, not the dashboard — version the
// catalog here and push it with the secret key (docs/payments_elixpo.md →
// "Catalog sync"). /v1/sync returns HTTP 200 even when a product is rejected,
// so we MUST inspect the body and fail on ok:false / a non-empty errors[].
//
// Run:  ELIXPO_PAY_API_KEY=… node scripts/sync-catalog.mjs
// CI:   .github/workflows/sync-catalog.yml

import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const apiKey = process.env.ELIXPO_PAY_API_KEY;
if (!apiKey) {
  console.error("ELIXPO_PAY_API_KEY is not set");
  process.exit(1);
}

const raw = JSON.parse(await readFile(join(root, "payouts.catalog.json"), "utf8"));

// Validate + reconstruct the payload from a strict allow-list of known fields
// with explicit type coercion. The outbound request is built from this
// sanitized object, never from raw file bytes (closes the CodeQL
// "file data in outbound network request" taint and rejects a malformed file).
const str = (v, max = 256) => (typeof v === "string" ? v.slice(0, max) : undefined);
const url = (v) => {
  const s = str(v, 512);
  return s && /^https:\/\//.test(s) ? s : undefined;
};
const intMinor = (v) => (Number.isInteger(v) && v >= 0 && v <= 100_000_000 ? v : undefined);
const enumv = (v, allowed) => (allowed.includes(v) ? v : undefined);

const drop = (o) => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined));

function buildPrice(p) {
  if (!p || typeof p !== "object") return null;
  const price = drop({
    nickname: str(p.nickname, 64),
    currency: enumv(p.currency, ["INR", "USD", "EUR", "GBP"]),
    unit_amount: intMinor(p.unit_amount),
    interval: enumv(p.interval, ["day", "week", "month", "year"]),
    region: str(p.region, 8),
    type: enumv(p.type, ["one_time", "recurring"]),
  });
  return price.currency && price.unit_amount !== undefined && price.type ? price : null;
}

function buildProduct(p) {
  if (!p || typeof p !== "object") return null;
  const tier = str(p.tier, 64);
  if (!tier || !/^[a-z0-9_]+$/.test(tier)) return null;
  const prices = Array.isArray(p.prices) ? p.prices.map(buildPrice).filter(Boolean) : [];
  return drop({ tier, name: str(p.name, 120), description: str(p.description, 500), prices });
}

const products = Array.isArray(raw.products) ? raw.products.map(buildProduct).filter(Boolean) : [];
if (products.length === 0) {
  console.error("catalog has no valid products after validation");
  process.exit(1);
}
const payload = drop({
  app: raw.app && typeof raw.app === "object"
    ? drop({ homepage_url: url(raw.app.homepage_url), pricing_url: url(raw.app.pricing_url) })
    : undefined,
  products,
});

const res = await fetch("https://payouts.elixpo.com/v1/sync", {
  method: "POST",
  headers: {
    Authorization: "Bearer " + apiKey,
    "Content-Type": "application/json",
  },
  body: JSON.stringify(payload),
});

let out;
try {
  out = await res.json();
} catch {
  out = { ok: false, errors: [`non-JSON response (HTTP ${res.status})`] };
}

if (!res.ok || out.ok === false || (out.errors?.length ?? 0) > 0) {
  console.error("catalog sync failed:", JSON.stringify(out.errors ?? out, null, 2));
  process.exit(1);
}

console.log(`catalog synced — ${out.synced?.length ?? 0} product(s):`);
for (const s of out.synced ?? []) {
  console.log(
    `  · ${s.product?.tier} (${s.prices?.length ?? 0} price(s), ${s.deactivated ?? 0} deactivated)`,
  );
}
