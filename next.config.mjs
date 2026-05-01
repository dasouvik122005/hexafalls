import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

// Wires Cloudflare bindings (env vars, KV, R2, etc.) into `next dev` so server
// code running locally sees the same shape it will at the edge. No-op in prod.
initOpenNextCloudflareForDev();

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
};

export default nextConfig;
