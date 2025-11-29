import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['10.10.10.46', 'localhost'],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
        pathname: "/wikipedia/commons/4/44/Plain_Yellow_Star.png",
      },
    ],
  },
};

export default nextConfig;
