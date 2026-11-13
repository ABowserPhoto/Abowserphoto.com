import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      // Exact legacy paths only. Other `/deutsch/...` shapes are redirected in
      // proxy.ts, and only off niche hosts, so those hosts stay on-host.
      { source: "/deutsch", destination: "/de", permanent: true },
      { source: "/deutsch/index", destination: "/de", permanent: true },
      { source: "/deutsch/index.html", destination: "/de", permanent: true },
    ];
  },
};

export default nextConfig;
