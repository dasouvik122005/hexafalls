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

const catalog = JSON.parse(await readFile(join(root, "payouts.catalog.json"), "utf8"));

const res = await fetch("https://payouts.elixpo.com/v1/sync", {
  method: "POST",
  headers: {
    Authorization: "Bearer " + apiKey,
    "Content-Type": "application/json",
  },
  // Send the whole catalog (app block + products). The endpoint accepts the
  // `app` block (homepage/pricing links) alongside `products`.
  body: JSON.stringify(catalog),
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
