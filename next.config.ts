import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // All catalog images are pre-optimized static WebP served with `unoptimized`,
    // so they bypass Vercel's Image Optimization quota entirely.
    minimumCacheTTL: 2678400, // 31 days
    formats: ["image/webp"],
    deviceSizes: [320, 420, 768, 1024, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  devIndicators: false,
};

export default nextConfig;
