import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Note: do NOT use output: "standalone" on Vercel — Vercel handles its own
  // build output. The standalone output is only for self-hosted Docker/bun.
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // Allow larger inlining of small images -> fewer requests
  images: {
    minimumCacheTTL: 86400,
  },
  // Experimental: faster package transpilation for dev
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "@radix-ui/react-icons",
    ],
  },
};

export default nextConfig;
