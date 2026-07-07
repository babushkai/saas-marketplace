import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // remotePatterns will list Supabase Storage / Stripe-hosted image hosts
    // once those integrations are wired up.
    remotePatterns: [],
  },
};

export default nextConfig;
