# Mark Morente — Project Guide (read this first)

> Note to future-me (Claude) and to the owner. This is the single source of truth for
> what this project is, how it's built, what we've already done, and how to make the
> common changes safely. Read this before touching anything.

## What this is
**Mark Morente** is a B2B men's suit (takım elbise) brand — wholesale, OEM & private-label
suit/tuxedo manufacturing based in Istanbul, Turkey. This is its marketing + catalog website.

- **Live:** https://www.markmorente.com (canonical domain is **www**)
- **Repo:** https://github.com/Berkindev/MarkMorente
- **Deploy:** Vercel, auto-deploys on push to **`main`**. So pushing = going live. Confirm with owner before pushing.
- **Owner:** Berkin (berkindev55@gmail.com). **Talk to the owner in Turkish; keep all site content in English.**
- **No e-commerce/checkout.** Conversion = contacting via **WhatsApp** (number `905321711494`), Telegram (`@markmorente`), Instagram (`@mark.morente`).

## Tech stack
- Next.js 15 (app router) + React 19 + Tailwind v4 + TypeScript.
- Minimal deps on purpose: `next`, `react`, `react-dom`, `@vercel/analytics`, `@vercel/speed-insights`.
  Dead UI scaffolding was removed (embla, lucide, cva, radix-slot, clsx, tailwind-merge,
  `components/ui/*`, `lib/utils`, `BrandLogoCarousel`, `CategoryProductsGrid`, old `Footer.tsx`).
  **Don't reintroduce them** unless actually needed.
- Build check: `npm install && npm run build` must pass (97 static pages as of last edit).
  (There's a pre-existing harmless ESLint `FlatCompat` config warning — ignore it; build still succeeds.)

## Data model — `collections.json` is the source of truth
ALL products live in `collections.json` → `products[]`. Each product:
```
slug, title, model, fit, lapel, fabric, lining, color, code,
images[] (paths under /collections/<code>/...),
status ("In Stock" | "Out of Stock"),
description { compositions{}, features[], lot{ sizes[], quantities[], total } },
content (one descriptive paragraph)
```
- `app/sitemap.ts` and the collections/product pages all derive from this file.
- Other JSON: `categories.json` (6 manufacturing categories + their hero images),
  `manufacturing.json` (manufacturing landing sections; the "categories" section image
  field is unused — the landing grid reads category images from `categories.json`),
  `aboutus.json`, `contactus.json`, `footer.json`.
- `products.json` / `photolinks.json` were legacy/unused and have been **deleted**.

### Product catalog state (codes)
- **16 legacy products** (codes `500, 524, 666, 710, 165, 238, 312, 341, 366, 378, 403, 404,
  DB-PRE, SF-CLS, FB-FRM, TP-PRE`) → set to **Out of Stock** but kept LIVE for SEO.
  Exception: **`FB-FRM` (Formal Business Suit Collection) is In Stock** (owner's call).
- **`S01`–`S09`** = new model-shot suits (linen summer 2-piece + classic 3-piece).
  (`S10` Burgundy was a duplicate of `S09` Brown and was deleted.)
- **`T01`–`T54`** = new mannequin tuxedos / dinner jackets (1 image each).
- New images sourced from owner's WhatsApp photos, grouped by color/model, SEO-renamed.

## Images — performance rules (don't break)
- Every catalog image is a **pre-optimized static WebP** (max ~1200px long edge), served via
  `next/image` with the **`unoptimized`** prop. This bypasses Vercel's Image-Optimization quota
  entirely and serves small CDN-cached files. `public/` is ~17MB (was 81MB of PNG/JPEG).
- When adding images: convert to WebP + downscale first, drop under `public/collections/<code>/`,
  reference with `unoptimized`. **Do NOT** remove `unoptimized` or add remote image hosts
  (`next.config.ts` has no `remotePatterns`).
- Portrait model shots in landscape/square cards use `object-cover object-top` so heads aren't cropped.

## SEO / GEO — working well, do NOT break
SEO drives real traffic & inquiries. **Never delete or rename an existing product slug/URL**
(404 = lost ranking + lost leads). Add new products as new slugs to grow indexed surface.
- `app/sitemap.ts` + `app/robots.ts` are **dynamic** Next metadata routes. **Never** add static
  `public/sitemap.xml` / `public/robots.txt` again — they override the dynamic ones and once
  served a stale non-www sitemap.
- Canonical domain `https://www.markmorente.com` everywhere (sitemap, robots host, `metadataBase`).
- JSON-LD: Organization+WebSite sitewide (`app/layout.tsx`); Product+BreadcrumbList per product;
  Service+BreadcrumbList per manufacturing category; CollectionPage+ItemList on `/collections`.
- Product detail (`app/collections/[slug]/page.tsx`) and manufacturing category
  (`app/mens-suit-manufacturing/[slug]/page.tsx`) are **server components** (SSG via
  `generateStaticParams` + `generateMetadata`). The interactive image gallery lives in the
  client component `components/ProductDetail.tsx`. **Don't turn these pages back into
  `"use client"`** or per-page metadata + JSON-LD break.

## Shared chrome
- `components/SiteFooter.tsx` + `components/FloatingWhatsApp.tsx` render in `app/layout.tsx`,
  so they appear on **every** page. Don't add per-page footers (homepage's old inline footer
  was removed). All WhatsApp links should carry a prefilled `?text=` message.
- Sub-pages use `components/Navbar.tsx`. The homepage (`app/page.tsx`, `"use client"`) keeps its
  own inline scroll-nav + section anchors (#collections, #fabrics, etc.).
- Product detail has a per-product WhatsApp CTA ("I'm interested in this product") prefilled with title + code.

## Helper scripts (live OUTSIDE the repo, in the parent folder `/Users/k/Desktop/Fatih/`)
- `build_products.py` — generated the S/T products + SEO-renamed/copied images into the repo.
- `optimize_images.py` — converts catalog images to downscaled WebP and rewrites JSON paths.
- Owner's new photo drops arrive as folders like `new1/`, `new2/` next to these scripts.
- These are NOT committed; they're scratch tooling on the owner's machine. The repo is cloned
  fresh per session — re-clone with `git clone https://github.com/Berkindev/MarkMorente.git`.

## How to do common future tasks
- **Mark a product in/out of stock:** edit its `status` in `collections.json`.
- **Reorder listing:** `/collections` already shows In-Stock first, Out-of-Stock last
  (`app/collections/page.tsx`).
- **Add a new product:** add an entry to `collections.json` (unique `slug` + `code`), drop its
  WebP images under `public/collections/<code>/`, rebuild. Sitemap/metadata/JSON-LD auto-follow.
- **Swap a product photo:** replace the WebP file (same path) or update the `images[]` paths.
- **Change a manufacturing category image:** edit `image` in `categories.json` (point at any
  `/collections/...webp`).
- **Rename for SEO:** prefer changing `title`/`content`/alt text; do NOT change a live `slug`.
- Always `npm run build` before committing; commit messages end with the Co-Authored-By trailer.

## Change log (high level)
1. Added 64 new products (10 suits + 54 tuxedos), set 16 legacy to Out of Stock (kept live),
   per-product metadata + Product/Breadcrumb JSON-LD, SSG product pages.
2. Completed SEO infra: dynamic sitemap/robots (www), Organization/WebSite JSON-LD, manifest,
   canonicals, improved 404, fixed a bug where every page canonicalized to the homepage.
3. Optimized all images to WebP (81MB→17MB), added sitewide footer + floating WhatsApp + per-
   product WhatsApp CTA, sorted collections (in-stock first), pruned dead code/deps.
4. Removed duplicate burgundy suit (S10), set FB-FRM In Stock, refreshed manufacturing category
   images to new photos, aligned category card images to top (`object-top`).
