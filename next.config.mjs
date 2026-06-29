import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

// Wires Cloudflare bindings (env vars, KV, R2, etc.) into `next dev` so server
// code running locally sees the same shape it will at the edge. No-op in prod.
initOpenNextCloudflareForDev();

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Gzip / Brotli for JS, CSS, and HTML responses.
  compress: true,

  images: {
    // Serve AVIF first (smallest), fall back to WebP, then original.
    formats: ["image/avif", "image/webp"],

    // 30-day browser / CDN cache for optimised images.
    minimumCacheTTL: 60 * 60 * 24 * 30,

    // Allow Cloudinary remote images to be processed by next/image.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/dxkje9whm/**",
      },
    ],
  },
};

export default nextConfig;
