import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
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
