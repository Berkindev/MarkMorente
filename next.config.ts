import type { NextConfig } from "next";

// Vercel serves files out of public/ with `cache-control: public, max-age=0,
// must-revalidate`, so a returning visitor makes a conditional request for
// every single catalog image before anything can paint from cache. On
// /collections that is ~79 round-trips per revisit — cheap on fibre, brutal on
// a slow mobile link in Lagos or Cape Town.
//
// These files are content, not code, so they get a day of freshness plus a
// long stale-while-revalidate window: repeat visits render straight from cache
// and the refresh happens in the background.
//
// Trade-off to know about: CLAUDE.md documents swapping a product photo by
// overwriting the same path. With this header that swap can take up to 24h to
// reach a visitor who already has the old file. Renaming the file (or adding
// a new one and repointing collections.json) makes it instant.
const STATIC_ASSET_CACHE =
  "public, max-age=86400, stale-while-revalidate=2592000";

// Matches only real image files. Scoping by extension matters: a naive
// "/collections/:path*" would also match the product *pages*
// (/collections/<slug>) and start caching HTML.
//
// Note the pattern form. A repeated param cannot carry a literal suffix inside
// the same segment — "/collections/:path*.webp" throws
// `Can not repeat "path" without a prefix and suffix` at build time. A single
// param with an explicit regex is the form that works, and `.*` still spans
// slashes so it reaches into the per-code subdirectories.
const IMAGE_SOURCES = [
  "/collections/:path(.*\\.webp)",
  "/mens-suit-manufacturing/:path(.*\\.webp)",
  // Brand assets are listed individually rather than by extension so this
  // never overrides the immutable header Next puts on app/icon.png.
  "/logo-256.webp",
  "/logo-192.png",
  "/logo-512.png",
  "/og-image.jpg",
  "/whatsapplogo.svg",
  "/telegramlogo.svg",
];

const nextConfig: NextConfig = {
  images: {
    // All catalog images are pre-optimized static WebP served with `unoptimized`,
    // so they bypass Vercel's Image Optimization quota entirely.
    // Grid cards and gallery thumbnails use the pre-generated -card / -thumb
    // variants (see lib/images.ts) rather than the 800px master.
    minimumCacheTTL: 2678400, // 31 days
    formats: ["image/webp"],
    deviceSizes: [320, 420, 768, 1024, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  devIndicators: false,
  async headers() {
    return IMAGE_SOURCES.map((source) => ({
      source,
      headers: [{ key: "Cache-Control", value: STATIC_ASSET_CACHE }],
    }));
  },
};

export default nextConfig;
