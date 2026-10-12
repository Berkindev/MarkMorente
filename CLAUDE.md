# Mark Morente: Project Guide (read this first)

## What this is
**Mark Morente** is a B2B manufacturer of men's suits and tuxedos in Istanbul, Turkey. It does wholesale, private label and OEM production for business buyers worldwide (wholesalers, retailers, store chains, formalwear and wedding stores, brands). It does **not** sell single suits to individuals, and the site makes that distinction everywhere.

- **Live:** https://www.markmorente.com. The canonical host is **www**, and URLs have **no trailing slash**.
- **Repo:** https://github.com/Berkindev/MarkMorente (PUBLIC: no secrets, IPs, personal data or confidential lists).
- **Owner:** Berkin (the user works on it for his cousin's company). **Talk to the user in Turkish. Source content is English**, translated to AR, RU, FR, DE, ES, TR.
- **Conversion:** WhatsApp `905321711494` with prefilled messages. Telegram `@markmorentesuits`, Instagram `@mark.morente`. No checkout and no published prices.

## Stack (since 2026-10-09, live on Cloudflare Pages)
- Zero-dependency static site generator in Node 22: `node scripts/build.mjs` writes to `dist/`, which is hosted on **Cloudflare Pages** (project `markmorente`).
- Vercel project and domains were deleted on 2026-10-09; `main` holds the static site. Deploys are manual (`npm run deploy`), pushing to GitHub does not deploy.
- Pages are emitted as `<path>.html` (Pages serves them at `/path`, no slash) plus a `<path>.md` markdown twin. The home page is `index.html` / `index.md`.

```
npm run build          # → dist/
npm run dev            # build + wrangler pages dev on :8789 (functions included)
npm run audit          # build + seo-audit (titles, descriptions, H1, JSON-LD, broken links)
npm run deploy:preview # preview.markmorente.pages.dev (noindex)
npm run deploy         # production + IndexNow ping (key in gitignored .indexnow-key, file src/public/<key>.txt)
npm run indexnow       # re-submit sitemap URLs to IndexNow only
```

## File map
| Path | What |
|---|---|
| `collections.json` | **All 78 products** (source of truth). Slugs are live URLs and must **never** be renamed. |
| `categories.json` | Legacy 6 manufacturing categories (images and fallback text). |
| `content/BRIEF.md` | Verified company facts, audience and **voice rules**. Read before writing copy. |
| `content/pages/*.md` | Home, hub, service, info and category pages (category files use bare slugs, e.g. `slug: tuxedos`). |
| `content/guides/*.md` | 14 buyer guides → `/guides/<slug>` |
| `content/markets/*.md` | 5 market pages → `/markets/<slug>` (with `country_list`) |
| `content/photos/` | Unsplash-licensed stock photos plus `credits.json` (alt text comes from `subject`). |
| `src/data/site.mjs` | Company facts (MOQ, lead time, contacts) and `waLink()`. |
| `src/assets/site.css`, `site.js` | Design system; burger menu, reveal, gallery, contact events, WebMCP tools. |
| `src/public/` | Fonts (self-hosted subsets), icon.png, favicon.ico; copied to dist root. |
| `public/` | Catalog images `/collections/<code>/*.webp` (+ `-card` 480w, `-thumb` 160w), logos, og-image. |
| `scripts/build.mjs` | Generator: pages, schema, sitemap, robots, llms.txt, API, .well-known, _headers, _redirects. |
| `scripts/lib/{html,md,images}.mjs` | Layout and components, markdown renderer, photo pipeline (sips + cwebp → `/img/*.webp?v=hash`). |
| `functions/_middleware.js` | Apex → www 301, `*.pages.dev` noindex, `Accept: text/markdown` negotiation, catalog image caching. |
| `functions/mcp.js` | MCP server (search_models, get_model, get_ordering_terms, create_quote_link). |
| `docs/gsc-*/` | Search Console exports (gitignored, local only). |

## Languages (since 2026-10-09)
- English at the root; `ar` (RTL), `ru`, `fr`, `de`, `es`, `tr` under `/<code>/…` with the same English slugs (e.g. `/fr/collections/<slug>`). hreflang + x-default (en) on every page; the globe menu in the header switches language.
- UI strings: `src/i18n/<code>.json` (keys from `en.json`; `{placeholders}`). Catalog text: `src/i18n/catalog/<code>.json` (`values` for fabric/lapel/colour/feature strings, `products` per code: title, content). `src/i18n/catalog/_source-en.json` is the extraction to translate from.
- Pages: `content/i18n/<code>/{pages,markets}/*.md` (same front matter; English link targets, the build localizes them). Guides are English-only.
- A language is built only when both its UI json and catalog json exist (`scripts/lib/i18n.mjs`). Missing page translations fall back to not building that page in that language.
- When English copy changes, update the 6 translations too (or re-run translation agents with the same brief).

## Design
- Site-wide: ivory paper, charcoal ink, logo gold (`src/assets/site.css` tokens).
- Home page only (`body.home`): the original Mark Morente classic palette, navy `#1A1F3C` + gold `#C9A962` + off-white `#FAF9F6`, square uppercase buttons, navy header/hero/footer. Owner liked this better ("more classic, suits the brand"); extend to other pages only if asked.
- Language menu shows inline SVG flags (Arabic = UAE flag).

## Content markdown format
Front matter fields: `slug`, `title` (≤ 60 chars), `description` (140–160), `h1`, `lead`, `updated`, `related: [slugs]`. The body supports `##`, `###`, paragraphs, lists, **bold**, links and pipe tables. The last section is `## FAQ`, with `### Question` entries that render as FAQPage schema.
`related` accepts page, guide, market and category slugs (with or without a `guides/` or `mens-suit-manufacturing/` prefix) and `collections`.

## Rules
- **Voice:** natural export-sales English. No AI-slop words (elevate, seamless, unlock, delve…), no em dashes, no invented stats. Facts must come from BRIEF.md / site.mjs.
- **Verified facts (owner):**
  - Capacity: 1,000+ suits/day.
  - Stock lot: one model in a size run, 6–7 suits (EU 46–56/58).
  - Made to order: from 100 units per style.
  - Lead time: typically 12–15 days, varies by order, quoted per order.
  - Certifications: do NOT mention any (ISO 9001 / OEKO-TEX removed from all languages, schema, llms.txt on 2026-10-12, owner decision). Founded 1994.
- **Products without prices** use the `ItemPage` + `Service` schema. Never use `Product` (Product without offers or reviews is a critical GSC error).
- **Category mapping** is in `build.mjs` (`CATS`):
  - tuxedos: all tuxedos and dinner jackets
  - wedding: three-piece suits, dinner jackets, tuxedos in white/ivory/burgundy/green/red
  - ceremony: embellished tuxedos (rhinestone, sequin, crystal, beaded, studded, velvet, ombre…)
  - big & tall: models whose lot includes size 58
- **Catalog images:** after adding or replacing one, run `python3 scripts/generate-image-variants.py`.
- **Legacy URLs** (`/collections/<slug>`, `/mens-suit-manufacturing/<slug>`, `/about-us`, `/contact`) must keep working; `_redirects` covers old aliases.
- **DNS** is on Cloudflare. **MX/SPF are Hostinger mail: never touch them.**

## Owner-confirmed (2026-10-09)
- Israel stays off the site. Fully customizable production incl. US sizing. Factory/customer visits welcome. Photos/video from production and before shipping. Shipping air/sea/road as the buyer prefers (express air for urgent); don't single out hanging transport.
- Stock photos are fine for factory/process images; owner will send real ones if available.
- Catalog text was audited against the photos (2026-10-09). T27 was a duplicate of T19 (same photo) and was removed with a 301 to T19. Product codes are internal; owner allows removing duplicates.

## Status
- [x] Static rebuild (119 EN URLs + 6 languages = 743 pages), SEO/GEO layer, local QA (audit clean, Lighthouse mobile 96–99, no 375px overflow in any language)
- [x] DNS cutover 2026-10-09 (www + apex → Pages custom domains, MX/SPF untouched), Vercel removed
- [x] GSC sitemap submitted, IndexNow 736 URLs accepted (2026-10-09)
- [x] 404 sweep 2026-10-09: all 332 legacy URLs (GSC export + old sitemap products, images, categories) return 200 or 301; all 736 sitemap URLs 200
- [ ] GSC: user to click "Validate fix" on the old Product snippet error (old site had Product without price; new site has no Product schema). Watch Pages report for 404s for 1–2 weeks.

## How to do common changes (read this before editing)
After any change: `npm run build && npm run audit`, check locally with `npm run dev` (http://127.0.0.1:8789), then `npm run deploy`, then `git commit` + `git push` (push does not deploy).

- **Swap / add a product photo:** put the WebP (≈800px wide master) under `public/collections/<CODE>/`, list it in that product's `images[]` in `collections.json`, run `python3 scripts/generate-image-variants.py` (creates `-card`/`-thumb`). Keep old file names if the URL was already indexed, or add a `_redirects` line in `build.mjs`.
- **Add a product:** new entry in `collections.json` (unique `code` + new `slug`; copy an existing entry's shape). Then add its translated `title`/`content` to each `src/i18n/catalog/<code>.json` → `products` (and any new fabric/colour/feature string to `values`). Missing translations fall back to English text on the localized pages.
- **Remove a product:** delete the entry, then add a 301 for its slug (and `/<lang>/collections/<slug>` + image folder) in the `_redirects` block of `build.mjs` (see the T27 example). Never leave a 404.
- **Change stock status:** `status` = `"In Stock"` / `"Out of Stock"` in `collections.json` (in-stock sorts first, gets the lot CTA).
- **Change a company fact** (MOQ, lead time, phone, capacity…): `src/data/site.mjs`, `content/BRIEF.md`, `src/i18n/*.json` (stats, notice, top bar), and grep the md content in all languages: `grep -rn "12–15\|12-15" content src`.
- **Edit page copy:** `content/pages|markets|guides/*.md` (English), then the same file under `content/i18n/<code>/`. Keep front matter keys; `## FAQ` marker stays literal.
- **Change UI text / buttons:** `src/i18n/en.json` + the 6 other language files (same keys). Mobile top bar text is `top.m` (keep ≤ ~42 chars).
- **Stock photos (process/market pages):** `content/photos/*.jpg` + `credits.json`; mapping slug → photo is `PHOTOS` in `build.mjs`. Real factory photos from the owner should replace these (same file names = no code change).
- **Home page sections/photos:** home markup is the `HOME` block in `build.mjs`; featured models are the code lists `featSuits` / `featTux`; category card images `CAT_IMG`.

## History (2026-10-09, one long session)
1. Audit of the old Next.js/Vercel site + GSC CSVs (≈181 clicks/6.7k impressions in 3 months; best pages /mens-suit-manufacturing and wedding-suits; Product-without-price GSC error; thin category pages).
2. Rebuilt as static site with 14 guides, 5 market pages, B2B copy (wholesale only, stock lots vs private label), stock photos, full GEO layer (llms.txt, .md twins, MCP, API, WebMCP).
3. Catalog audit against photos: most T-series titles/lapels/fabrics corrected; T27 (duplicate of T19) removed.
4. Translations into 6 languages (pages, markets, UI, catalog) by agents; owner-confirmed facts applied.
5. Mobile-first fixes (contact bar, header, top bar per language), flag language menu, classic navy/gold home (no hero photos: owner found them odd).
6. Cutover: Cloudflare Pages custom domains for www + apex (user did it in the dashboard), Vercel project deleted, `static-site` merged into `main`, GSC sitemap submitted, IndexNow sent.
