// Public site URL for canonical tags, OG images, sitemap and JSON-LD.
// Order: explicit override → Vercel's production domain (switches to the
// custom domain automatically once one is attached) → local dev.
const siteUrl = (
  process.env.NEXT_PUBLIC_BASE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000")
).replace(/\/+$/, "");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Inlined into both server and client bundles (JsonLd is a client component)
  env: {
    NEXT_PUBLIC_SITE_URL: siteUrl,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  // Reduce build time
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
