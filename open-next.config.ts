import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Default Cloudflare config for OpenNext. Add an incremental cache (KV / R2)
// here once a binding is configured in wrangler.jsonc, e.g.:
//
//   import kvIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/kv-incremental-cache";
//   export default defineCloudflareConfig({ incrementalCache: kvIncrementalCache });
//
// For the static-only marketing site as it stands, the default is enough.
export default defineCloudflareConfig();
