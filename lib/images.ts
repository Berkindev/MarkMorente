/**
 * Catalog image variants.
 *
 * Catalog masters under /collections/<code>/ are 800x1200 WebP and are served
 * with `unoptimized` (see CLAUDE.md) — so there is no srcset and a single file
 * has to fit whatever slot it lands in. Pre-generated downscaled siblings let
 * each slot pull a file that matches it:
 *
 *   foo.webp         800px  product-detail main image
 *   foo-card.webp    480px  grid cards (~267px desktop / ~159px mobile)
 *   foo-thumb.webp   160px  product gallery strip (64-80px)
 *
 * Variants are produced for every image referenced by collections.json /
 * categories.json plus the homepage fabric tiles. If you add a new catalog
 * image, generate its variants too or these helpers will point at a 404.
 */

function withSuffix(src: string, suffix: string): string {
  const dot = src.lastIndexOf(".");
  if (dot === -1) return src;
  return `${src.slice(0, dot)}-${suffix}${src.slice(dot)}`;
}

/** 480px variant — for images rendered inside a grid card. */
export function cardSrc(src: string): string {
  return withSuffix(src, "card");
}

/** 160px variant — for the 64-80px product gallery thumbnails. */
export function thumbSrc(src: string): string {
  return withSuffix(src, "thumb");
}
