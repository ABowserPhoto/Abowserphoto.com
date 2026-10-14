import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [{ source: "/immobilien", destination: "/real-estate" }];
  },
};

export default nextConfig;
