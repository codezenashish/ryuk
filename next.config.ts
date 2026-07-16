import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: [
      "@hugeicons/core-free-icons",
      "react-icons",
      "lucide-react",
      "framer-motion",
    ],
  },
};

export default nextConfig;
