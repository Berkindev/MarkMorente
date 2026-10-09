# Mark Morente: Project Guide (read this first)

## What this is
**Mark Morente** is a B2B manufacturer of men's suits and tuxedos in Istanbul, Turkey. It does wholesale, private label and OEM production for business buyers worldwide (wholesalers, retailers, store chains, formalwear and wedding stores, brands). It does **not** sell single suits to individuals, and the site makes that distinction everywhere.

- **Live:** https://www.markmorente.com. The canonical host is **www**, and URLs have **no trailing slash**.
- **Repo:** https://github.com/Berkindev/MarkMorente (PUBLIC: no secrets, IPs, personal data or confidential lists).
- **Owner:** Berkin. **Talk to the owner in Turkish. Site content is in English** (translations planned: AR, RU, FR, DE, ES, TR).
- **Conversion:** WhatsApp `905321711494` with prefilled messages. Telegram `@markmorentesuits`, Instagram `@mark.morente`. No checkout and no published prices.

## Stack (since Oct 2026, branch `static-site`)
- Zero-dependency static site generator in Node 22: `node scripts/build.mjs` writes to `dist/`, which is hosted on **Cloudflare Pages** (project `markmorente`).
- The old Next.js/Vercel site lives on `main` until cutover. **Vercel auto-deploys `main`, so don't push or merge to main without the owner's OK.**
- Pages are emitted as `<path>.html` (Pages serves them at `/path`, no slash) plus a `<path>.md` markdown twin. The home page is `index.html` / `index.md`.

```
npm run build          # → dist/
npm run dev            # build + wrangler pages dev on :8789 (functions included)
npm run audit          # build + seo-audit (titles, descriptions, H1, JSON-LD, broken links)
npm run deploy:preview # preview.markmorente.pages.dev (noindex)
npm run deploy         # production
```

## File map
| Path | What |
|---|---|
| `collections.json` | **All 79 products** (source of truth). Slugs are live URLs and must **never** be renamed. |
| `categories.json` | Legacy 6 manufacturing categories (images and fallback text). |
| `content/BRIEF.md` | Verified company facts, audience and **voice rules**. Read before writing copy. |
| `content/pages/*.md` | Home, hub, service, info and category pages (category files use bare slugs, e.g. `slug: tuxedos`). |
| `content/guides/*.md` | 14 buyer guides → `/guides/<slug>` |
| `content/markets/*.md` | 5 market pages → `/markets/<slug>` (with `country_list`) |
| `content/photos/` | Unsplash-licensed stock photos plus `credits.json` (alt text comes from `subject`). |
| `src/data/site.mjs` | Company facts (MOQ, lead time, certifications, contacts) and `waLink()`. |
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
  - Certifications: ISO 9001, OEKO-TEX 100. Founded 1994.
- **Products without prices** use the `ItemPage` + `Service` schema. Never use `Product` (Product without offers or reviews is a critical GSC error).
- **Category mapping** is in `build.mjs` (`CATS`):
  - tuxedos: plain tuxedos and dinner jackets
  - ceremony: embellished, sequin, velvet or jacquard pieces
  - big & tall: models whose lot includes size 58
- **Catalog images:** after adding or replacing one, run `python3 scripts/generate-image-variants.py`.
- **Legacy URLs** (`/collections/<slug>`, `/mens-suit-manufacturing/<slug>`, `/about-us`, `/contact`) must keep working; `_redirects` covers old aliases.
- **DNS** is on Cloudflare. **MX/SPF are Hostinger mail: never touch them.**

## Owner-confirmed (2026-10-09)
- Israel stays off the site. Fully customizable production incl. US sizing. Factory/customer visits welcome. Photos/video from production and before shipping. Shipping air/sea/road as the buyer prefers (express air for urgent); don't single out hanging transport.
- Stock photos are fine for factory/process images; owner will send real ones if available.
- Catalog text was audited against the photos (2026-10-09). T19 and T27 share the same photo: check with the owner.

## Status
- [x] Static rebuild (119 EN URLs + 6 languages = 743 pages), SEO/GEO layer, local QA (audit clean, Lighthouse mobile 96–99, no 375px overflow in any language)
- [ ] Preview deploy → owner review → DNS cutover (www + apex to Pages, MX untouched) → disconnect Vercel
- [ ] GSC sitemap + IndexNow
