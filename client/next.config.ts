import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      new URL("https://images.unsplash.com/**"),
      new URL("https://plus.unsplash.com/**"),
    ],
  },
};

export default nextConfig;
