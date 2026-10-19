import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      { source: "/deutsch", destination: "/de", permanent: true },
      { source: "/deutsch/index", destination: "/de", permanent: true },
      { source: "/deutsch/index.html", destination: "/de", permanent: true },
    ];
  },
};

export default nextConfig;
