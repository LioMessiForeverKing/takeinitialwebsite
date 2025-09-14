import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable Vercel deployment banner
  poweredByHeader: false,
  // Hide Vercel deployment info
  generateEtags: false,
  // Additional config to clean up deployment info
  experimental: {
    // Disable Vercel deployment notifications
    serverComponentsExternalPackages: [],
  },
};

export default nextConfig;
