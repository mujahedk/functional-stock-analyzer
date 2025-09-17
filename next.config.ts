import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: { ignoreDuringBuilds: true },
  // optional if you're fighting transient type issues:
  // typescript: { ignoreBuildErrors: true },
};

export default nextConfig;
