// D1 access for route handlers and server components.
//
// On Cloudflare Workers the binding is `env.DB`; OpenNext surfaces it via
// `getCloudflareContext()`. In `next dev` we fall back to a local file
// via `wrangler d1` — see README for the npm script.

import { getCloudflareContext } from "@opennextjs/cloudflare";

export function getDB() {
  const { env } = getCloudflareContext();
  if (!env.DB) {
    throw new Error(
      "D1 binding `DB` is not available. Check wrangler.toml or run via " +
        "`opennextjs-cloudflare preview`.",
    );
  }
  return env.DB;
}

// Returns `undefined` so consumers can `?? defaultValue`.
export function env(name) {
  const { env } = getCloudflareContext();
  return env[name] ?? process.env[name];
}
