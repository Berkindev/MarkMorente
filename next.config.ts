import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "9cxzyqk6xi.ufs.sh",
      },
      {
        protocol: "https",
        hostname: "j31e0rc62x.ufs.sh",
      },
      {
        protocol: "https",
        hostname: "example.com",
      },
    ],
  },
  devIndicators: false,
};

export default nextConfig;
