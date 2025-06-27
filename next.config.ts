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
    minimumCacheTTL: 2678400, // 31 gün
    formats: ["image/webp"], // Sadece webp
    deviceSizes: [320, 420, 768, 1024, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  devIndicators: false,
};

export default nextConfig;
