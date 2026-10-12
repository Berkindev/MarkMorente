// Mark Morente static site generator → dist/ (Cloudflare Pages). Zero dependencies.
// URLs keep the old Next.js shape: www host, no trailing slash → we emit <path>.html files.
// English at the root; other languages under /<code> (see scripts/lib/i18n.mjs). Guides are English-only.
import { rmSync, mkdirSync, writeFileSync, readFileSync, cpSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { createHash } from 'node:crypto';
import { site } from '../src/data/site.mjs';
import { loadDir, splitFaq } from './lib/md.mjs';
import { processImage } from './lib/images.mjs';
import { LANGS, makeLang } from './lib/i18n.mjs';
import { layout, esc, waBtn, waHref, tgBtn, pic, catalogPic, thumbSrc, crumbs, faqBlock, b2bNotice } from './lib/html.mjs';

const DIST = 'dist';
const TODAY = new Date().toISOString().slice(0, 10);
rmSync(DIST, { recursive: true, force: true });
mkdirSync(DIST, { recursive: true });

// ── Static files ─────────────────────────────────────────────
cpSync('public', DIST, { recursive: true });            // catalog images keep their URLs (/collections/<code>/...)
cpSync('src/public', DIST, { recursive: true });
for (const f of ['logo.png', 'mmlogo.png']) rmSync(join(DIST, f), { force: true }); // masters, not linked
mkdirSync(join(DIST, 'assets'), { recursive: true });
const css = readFileSync('src/public/fonts/fonts.css', 'utf8') + readFileSync('src/assets/site.css', 'utf8');
const js = readFileSync('src/assets/site.js', 'utf8');
const V = createHash('sha1').update(css + js).digest('hex').slice(0, 8);
writeFileSync(join(DIST, 'assets/site.css'), css);
writeFileSync(join(DIST, 'assets/site.js'), js);
rmSync(join(DIST, 'fonts/fonts.css'), { force: true });

// ── Data ─────────────────────────────────────────────────────
const products = JSON.parse(readFileSync('collections.json', 'utf8')).products;
const legacyCats = JSON.parse(readFileSync('categories.json', 'utf8')).page.categories;
const byCode = (c) => products.find((p) => p.code === c);
const guides = loadDir('content/guides');
const abs = (p) => site.url + (p === '/' ? '' : p);
const LS = LANGS.map(makeLang).filter(Boolean);
const EN = LS[0];

// Content per language: { pages: {slug: doc}, markets: [doc] }
const keyed = (list) => Object.fromEntries(list.map((p) => [p.slug, p]));
const CONTENT = Object.fromEntries(LS.map((L) => {
  const base = L.code === 'en' ? 'content' : `content/i18n/${L.code}`;
  const pg = existsSync(`${base}/pages`) ? loadDir(`${base}/pages`) : [];
  const mk = existsSync(`${base}/markets`) ? loadDir(`${base}/markets`) : [];
  return [L.code, { pages: keyed(pg), markets: mk }];
}));
const pages = CONTENT.en.pages;
const markets = CONTENT.en.markets;

const sizesOf = (p) => p.description?.lot?.sizes || [];
const lotCount = (p) => (p.description?.lot?.quantities || []).reduce((a, b) => a + b, 0) || sizesOf(p).length;
const sizeRange = (p) => (sizesOf(p).length ? `EU ${sizesOf(p)[0]}–${sizesOf(p).at(-1)}` : '');
const isTux = (p) => /tuxedo|dinner jacket/i.test(p.model);
const isCeremony = (p) => isTux(p) && /embellish|sequin|rhinestone|crystal|beaded|glitter|gold|velvet|studded|shimmer|sparkle|ombre|colour block|embroider/i.test(`${p.fabric} ${p.title}`);
const CAT_IMG = { tuxedos: 'T44', 'wedding-suits': 'S08', 'ceremony-suits': 'T12' }; // single mannequin shots (T05 is a two-up collage with text)
const CATS = [
  { slug: '3-piece-suits', test: (p) => /three piece/i.test(p.model) },
  { slug: '2-piece-suits', test: (p) => /two piece|double-breasted/i.test(p.model) || (/suit/i.test(p.model) && !/three/i.test(p.model) && !isTux(p)) },
  { slug: 'tuxedos', test: (p) => isTux(p) },
  { slug: 'wedding-suits', test: (p) => /three piece/i.test(p.model) || /dinner jacket/i.test(p.model) || (isTux(p) && /white|ivory|burgundy|emerald|green|red/i.test(p.color)) },
  { slug: 'ceremony-suits', test: (p) => isCeremony(p) },
  { slug: 'big-tall-suits', test: (p) => sizesOf(p).includes('58') },
].map((c) => {
  const legacy = legacyCats.find((x) => x.slug === c.slug) || {};
  const items = products.filter(c.test).sort((a, b) => (a.status === b.status ? 0 : a.status === 'In Stock' ? -1 : 1));
  return { ...c, legacy, items, image: CAT_IMG[c.slug] ? byCode(CAT_IMG[c.slug])?.images[0] || legacy.image : legacy.image };
});
const catDoc = (code, slug) => CONTENT[code].pages[slug] || CONTENT[code].pages[`category-${slug}`];
const sorted = [...products].sort((a, b) => (a.status === b.status ? 0 : a.status === 'In Stock' ? -1 : 1));

// ── Images (stock photography for process/market pages) ─────
const IMG = {};
const photo = (file, name) => {
  const src = `content/photos/${file}`;
  return existsSync(src) ? (IMG[name] ??= processImage(src, name, DIST)) : null;
};
const PHOTOS = {
  'private-label-suits': ['tailor-sewing-suit-jacket.jpg', 'private-label-suit-production'],
  'oem-suit-manufacturing': ['suit-pattern-making-2.jpg', 'oem-suit-pattern-making'],
  'wholesale-suits': ['suits-on-rack-warehouse.jpg', 'wholesale-suits-stock'],
  'how-to-order': ['garment-bags-packing.jpg', 'suit-order-packing'],
  fabrics: ['suit-fabric-rolls.jpg', 'suit-fabrics-wool'],
  'size-guide': ['suit-fabric-cutting.jpg', 'suit-size-cutting'],
  shipping: ['cargo-shipping-containers.jpg', 'suit-export-shipping'],
  faq: ['suit-quality-control-inspection.jpg', 'suit-quality-control'],
  'about-us': ['suit-factory-production-line.jpg', 'suit-factory-istanbul'],
  contact: ['istanbul-skyline.jpg', 'istanbul-skyline'],
  'mens-suit-manufacturing': ['suit-factory-production-line.jpg', 'suit-factory-istanbul'],
  africa: ['africa-market-or-city.jpg', 'suits-for-africa'],
  europe: ['europe-city.jpg', 'suits-for-europe'],
  'central-asia': ['central-asia-city.jpg', 'suits-for-central-asia'],
  'middle-east': ['middle-east-city.jpg', 'suits-for-middle-east'],
  'north-america': ['north-america-city.jpg', 'suits-for-north-america'],
  // guides
  'how-to-source-suits-from-turkey': ['istanbul-skyline-2.jpg', 'istanbul-bosphorus-bridge'],
  'turkey-vs-china-suit-manufacturing': ['suit-factory-production-line-2.jpg', 'suit-production-workshop'],
  'private-label-suit-manufacturing': ['suit-basted-jacket-fitting.jpg', 'private-label-suit-sample'],
  'suit-manufacturing-cost': ['suit-fabric-cutting-2.jpg', 'suit-cutting-cost'],
  'import-suits-from-turkey-to-africa': ['africa-market-or-city-2.jpg', 'import-suits-africa'],
  'import-suits-from-turkey-to-europe': ['europe-city-2.jpg', 'import-suits-europe'],
  'turkish-suits-for-central-asia-and-caucasus': ['central-asia-city-2.jpg', 'suits-central-asia-caucasus'],
  'wholesale-tuxedo-buying-guide': ['tuxedo-detail-2.jpg', 'wholesale-tuxedo-shawl-lapel'],
  'turkish-wedding-suits-wholesale': ['wedding-groomsmen-suits.jpg', 'wedding-suits-wholesale'],
  'suit-fabric-guide': ['fabric-swatches-suiting.jpg', 'suit-fabric-swatches'],
  'suit-size-runs-and-lot-planning': ['suits-on-rack-warehouse-2.jpg', 'suit-size-run-lots'],
  'suit-quality-control-checklist': ['suit-quality-control-inspection-2.jpg', 'suit-quality-inspection'],
  'how-to-start-a-suit-brand': ['menswear-store-interior.jpg', 'menswear-store-suit-brand'],
  'stock-lots-vs-made-to-order': ['steam-pressing-suit.jpg', 'suit-pressing-production'],
};
// Alt text from the photo credits ("Slot - what the photo shows" → "what the photo shows").
const credits = Object.fromEntries((existsSync('content/photos/credits.json') ? JSON.parse(readFileSync('content/photos/credits.json', 'utf8')) : []).map((c) => [c.file, c.subject.split(' - ').pop()]));
const photoFor = (slug) => (PHOTOS[slug] ? photo(...PHOTOS[slug]) : null);

// ── Page plan: collect every (language, page) first so we know the alternates and which links can be localized ──
const jobs = [];       // { key (English path), L, priority, images, render: (ctx) => { title, description, body, schema, md, og, ogType } }
const AVAIL = {};      // English path → Set(lang codes)
function plan(L, key, priority, render, extra = {}) {
  jobs.push({ key, L, priority, render, ...extra });
  (AVAIL[key] ??= new Set()).add(L.code);
}
const has = (L, key) => AVAIL[key]?.has(L.code);
const href = (L, key) => (has(L, key) ? L.P(key) : key); // localized when that page exists in L, else English
// Rewrite internal links inside rendered markdown to the localized version where it exists.
const locLinks = (L, html) => (L.code === 'en' ? html : html.replace(/href="(\/[^"#?]*)([^"]*)"/g, (m, path, rest) => `href="${href(L, path.replace(/\/$/, '') || '/')}${rest}"`));

// ── Output helpers ───────────────────────────────────────────
const out = []; // { path, md, priority, images[] }
function emit(path, html, md, extra = {}) {
  const file = path === '/' ? join(DIST, 'index.html') : join(DIST, `${path}.html`);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
  if (md) writeFileSync(path === '/' ? join(DIST, 'index.md') : join(DIST, `${path}.md`), md);
  out.push({ path, md, ...extra });
}
const clip = (s, n = 158) => (s.length <= n ? s : s.slice(0, s.lastIndexOf(' ', n - 1)).replace(/[,;:\s،]+$/, '') + '…');
const cleanTitle = (t, fallback) => (t && t.length <= 62 ? t : fallback || t);
const mdFooter = `\n---\nWholesale quotes: WhatsApp ${site.phoneDisplay} (https://wa.me/${site.whatsapp}) · Telegram ${site.telegramHandle} (${site.telegram}) · Instagram ${site.instagramHandle}\nMark Morente, men's suit & tuxedo manufacturer, Istanbul, Turkey. Business buyers only: stock lots of 6–7 suits per model or made to order from 100 units per style. Typical production lead time 12–15 days depending on the order.\n`;

// ── Schema ───────────────────────────────────────────────────
const ORG = `${site.url}/#org`;
const orgSchema = {
  '@context': 'https://schema.org', '@type': ['Organization', 'ClothingStore'], '@id': ORG,
  name: site.name, alternateName: ['MarkMorente', 'Mark Morente Menswear'], url: site.url, logo: abs('/logo-512.png'), image: abs('/og-image.jpg'),
  description: site.description, foundingDate: String(site.founded), telephone: `+${site.whatsapp}`,
  address: { '@type': 'PostalAddress', addressLocality: 'Istanbul', addressCountry: 'TR' },
  sameAs: [site.instagram, site.telegram],
  areaServed: ['Africa', 'Europe', 'Central Asia', 'Middle East', 'North America'],
  knowsAbout: ["Men's suit manufacturing", 'Private label suits', 'OEM suit production', 'Wholesale tuxedos', 'Wedding suits wholesale', 'Made in Turkey menswear'],
  contactPoint: { '@type': 'ContactPoint', telephone: `+${site.whatsapp}`, contactType: 'sales', availableLanguage: ['English', 'Turkish'] },
};
const websiteSchema = { '@context': 'https://schema.org', '@type': 'WebSite', '@id': `${site.url}/#website`, url: site.url, name: site.name, inLanguage: LS.map((l) => l.code), publisher: { '@id': ORG } };
const bcSchema = (items) => ({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items.map(([h, n], i) => ({ '@type': 'ListItem', position: i + 1, name: n, item: abs(h) })) });
const faqSchema = (list) => (list?.length ? { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: list.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) } : null);
const serviceSchema = (name, path, extra = {}) => ({ '@context': 'https://schema.org', '@type': 'Service', name, url: abs(path), provider: { '@id': ORG }, serviceType: "Men's suit manufacturing and wholesale", areaServed: ['Worldwide'], audience: { '@type': 'BusinessAudience', audienceType: 'Wholesalers, retailers and clothing brands' }, ...extra });

// ── Components ───────────────────────────────────────────────
const catName = (L, c) => L.t(`cat.${c.slug}`);
const pcard = (L, p) => {
  const x = L.prod(p);
  return `<a class="pcard reveal" href="${href(L, `/collections/${p.slug}`)}">
  <div class="pcard__img">${catalogPic(p.images[0], L.t('card.alt', { title: x.title, model: x.model.toLocaleLowerCase(L.code) }))}<span class="badge${p.status === 'In Stock' ? ' badge--stock' : ''}">${esc(L.t(p.status === 'In Stock' ? 'card.inStock' : 'card.madeToOrder'))}</span></div>
  <div class="pcard__body"><h3>${esc(x.title)}</h3><p>${esc(p.code)} · ${esc(x.fabric)} · ${esc(L.t('card.lotOf', { n: lotCount(p) }))}</p></div>
</a>`;
};
const catCard = (L, c) => `<a class="cat reveal" href="${href(L, `/mens-suit-manufacturing/${c.slug}`)}">${catalogPic(c.image, L.t('cat.alt', { name: catName(L, c) }), { sizes: '(max-width: 860px) 50vw, 400px' })}<div class="cat__body"><h3>${esc(catName(L, c))}</h3><p>${esc(L.t('cat.meta', { n: c.items.length }))}</p></div></a>`;
const ctaBand = (L, title, text, msg, ev) => `<section class="section" style="padding-top:20px"><div class="wrap"><div class="cta-band reveal"><div><h2>${esc(title)}</h2><p>${esc(text)}</p></div><div class="btn-row">${waBtn(L, L.t('btn.quoteOnWhatsApp'), msg, ev)}${tgBtn(L.t('btn.telegram'), 'btn--ghost')}</div></div></div></section>`;
const quoteBox = (L, msg, ev) => `<div class="quote-box"><h2>${esc(L.t('quote.h'))}</h2><p>${esc(L.t('quote.p'))}</p>${waBtn(L, L.t('btn.whatsapp'), msg, ev)}<div style="height:8px"></div>${tgBtn(L.t('btn.telegram'), 'btn--ghost')}</div>`;
const tocBox = (L, toc) => (toc?.length > 2 ? `<nav class="toc" aria-label="${esc(L.t('toc'))}"><h2>${esc(L.t('toc'))}</h2><ol>${toc.filter((t) => !/^faq/i.test(t.text)).map((t) => `<li><a href="#${t.id}">${esc(t.text)}</a></li>`).join('')}</ol></nav>` : '');
function relatedLinks(L, rel = []) {
  const C = CONTENT[L.code];
  const lookup = (raw) => {
    const s = raw.replace(/^\/+/, '').replace(/^(guides|markets|mens-suit-manufacturing)\//, '');
    if (s === 'collections') return [href(L, '/collections'), L.t('col.h1')];
    const c0 = CATS.find((x) => x.slug === s); if (c0) return [href(L, `/mens-suit-manufacturing/${s}`), (catDoc(L.code, s) || catDoc('en', s))?.h1 || catName(L, c0)];
    if (pages[s]) return [href(L, `/${s}`), (C.pages[s] || pages[s]).h1];
    const g = guides.find((x) => x.slug === s); if (g) return [`/guides/${s}`, g.h1];
    const m = markets.find((x) => x.slug === s); if (m) return [href(L, `/markets/${s}`), (C.markets.find((x) => x.slug === s) || m).h1];
    return null;
  };
  const items = rel.map(lookup).filter(Boolean);
  return items.length ? `<div class="mini-grid" style="margin-top:28px">${items.map(([h, t]) => `<a class="mini" href="${h}"><span class="eyebrow">${esc(L.t('readNext'))}</span><h3>${esc(t)}</h3></a>`).join('')}</div>` : '';
}

/** Article-style page from a content md file. */
function articlePage(L, { doc, path, bc, eyebrow, image, imageAlt, schemaExtra = [], afterArticle = '', msg }) {
  const { main, faqHtml } = splitFaq(locLinks(L, doc.html));
  const qmsg = msg || L.t('msg.page', { h1: doc.h1 });
  const body = `${crumbs(bc)}
<section class="phead${image ? ' phead--split' : ''}"><div class="wrap">
  <div><span class="eyebrow">${esc(eyebrow)}</span><h1>${esc(doc.h1 || doc.title)}</h1>${doc.lead ? `<p class="lead">${esc(doc.lead)}</p>` : ''}
  <div class="btn-row" style="margin-top:20px">${waBtn(L, L.t('btn.requestQuote'), qmsg, path)}<a class="btn btn--ghost" href="${href(L, '/how-to-order')}">${esc(L.t('btn.howOrdering'))}</a></div></div>
  ${image ? `<figure>${pic(image, imageAlt || doc.h1, { sizes: '(max-width: 860px) 100vw, 480px', eager: true })}</figure>` : ''}
</div></section>
<div class="wrap article">
  <article class="prose">${main}${faqHtml && doc.faq?.length ? `<h2 id="faq">${esc(L.t('faqHeading'))}</h2>${faqBlock(doc.faq)}` : ''}${relatedLinks(L, doc.related)}</article>
  <aside class="aside">${tocBox(L, doc.toc)}${quoteBox(L, qmsg, path + '-aside')}${b2bNotice(L)}</aside>
</div>
${afterArticle}
${ctaBand(L, L.t('band.title'), L.t('band.text'), qmsg, path + '-band')}`;
  const md = `# ${doc.h1 || doc.title}\n\n${doc.lead || ''}\n\n${doc.body}\n${mdFooter}`;
  const schema = [bcSchema(bc), faqSchema(doc.faq), ...schemaExtra];
  return { body, md, schema };
}

// ════════════════════════════════════════════════════════════
// PLAN PAGES PER LANGUAGE
// ════════════════════════════════════════════════════════════
const PAGE_ORDER = ['private-label-suits', 'oem-suit-manufacturing', 'wholesale-suits', 'how-to-order', 'fabrics', 'size-guide', 'shipping', 'faq', 'about-us', 'contact'];

for (const L of LS) {
  const C = CONTENT[L.code];
  const home = C.pages.home;
  const crumbHome = [L.P('/'), L.t('home')];
  if (L.code !== 'en' && !home) continue; // a language goes live with its home page

  // ── HOME ──
  plan(L, '/', '1.0', () => {
    const featSuits = ['S05', 'S08', 'S06', 'S02'].map(byCode).filter(Boolean);
    const featTux = ['T07', 'T20', 'T14', 'T09'].map(byCode).filter(Boolean);
    const homeSections = home ? splitFaq(locLinks(L, home.html)).main.split(/(?=<h2 )/).filter((s) => s.startsWith('<h2')) : [];
    const firstAfterHero = 1; // home.md sections 2 and 3 ("two ways", "what we manufacture") are rendered as components below
    const prose = homeSections.filter((_, i) => i !== firstAfterHero && i !== firstAfterHero + 1);
    const faqDoc = C.pages.faq || pages.faq;
    const allFaq = [...(faqDoc?.faq || [])].slice(0, 6);
    const body = `
<section class="hero"><div class="wrap">
  <div class="hero__text">
    <span class="eyebrow">${esc(L.t('home.eyebrow'))}</span>
    <h1>${esc(home?.h1 || "Men's suit and tuxedo manufacturer in Istanbul, Turkey")}</h1>
    <p class="lead">${esc(home?.lead || '')}</p>
    <div class="btn-row">${waBtn(L, L.t('btn.requestQuote'), L.t('home.msgHero'), 'hero')}<a class="btn btn--ghost" href="${href(L, '/collections')}">${esc(L.t('home.viewCollections'))}</a></div>
    <ul class="points">
      ${[1, 2, 3].map((i) => `<li><strong>${esc(L.t(`home.point${i}.k`))}</strong> ${esc(L.t(`home.point${i}.v`))}</li>`).join('\n      ')}
    </ul>
  </div>
</div>
<div class="wrap hero__foot"><div class="stats">
  ${[1, 2, 3, 4].map((i) => `<div><strong>${esc(L.t(`stat${i}.n`))}</strong><span>${esc(L.t(`stat${i}.l`))}</span></div>`).join('\n  ')}
</div></div></section>
<section class="section"><div class="wrap">
  <div class="section__head"><div><span class="eyebrow">${esc(L.t('home.ways.eyebrow'))}</span><h2>${esc(L.t('home.ways.h'))}</h2></div><p>${esc(L.t('home.ways.p'))}</p></div>
  <div class="paths">
    <div class="path reveal"><span class="path__tag">${esc(L.t('home.stock.tag'))}</span><h3>${esc(L.t('home.stock.h'))}</h3><p class="muted">${esc(L.t('home.stock.p'))}</p>
      <dl><dt>${esc(L.t('home.min'))}</dt><dd>${esc(L.t('home.stock.min'))}</dd><dt>${esc(L.t('home.sizes'))}</dt><dd>EU 46–56 / 58</dd><dt>${esc(L.t('home.dispatch'))}</dt><dd>${esc(L.t('home.stock.dispatch'))}</dd></dl>
      <div class="btn-row"><a class="btn btn--dark" href="${href(L, '/wholesale-suits')}">${esc(L.t('home.stock.btn1'))}</a><a class="btn btn--ghost" href="${href(L, '/collections')}">${esc(L.t('home.stock.btn2'))}</a></div></div>
    <div class="path reveal"><span class="path__tag">${esc(L.t('home.mto.tag'))}</span><h3>${esc(L.t('home.mto.h'))}</h3><p class="muted">${esc(L.t('home.mto.p'))}</p>
      <dl><dt>${esc(L.t('home.min'))}</dt><dd>${esc(L.t('home.mto.min'))}</dd><dt>${esc(L.t('home.leadTime'))}</dt><dd>${esc(L.t('home.mto.lead'))}</dd><dt>${esc(L.t('home.branding'))}</dt><dd>${esc(L.t('home.mto.branding'))}</dd></dl>
      <div class="btn-row"><a class="btn btn--dark" href="${href(L, '/private-label-suits')}">${esc(L.t('home.mto.btn1'))}</a><a class="btn btn--ghost" href="${href(L, '/oem-suit-manufacturing')}">${esc(L.t('home.mto.btn2'))}</a></div></div>
  </div>
  <div style="margin-top:18px">${b2bNotice(L)}</div>
</div></section>
<section class="section section--ivory"><div class="wrap">
  <div class="section__head"><div><span class="eyebrow">${esc(L.t('home.make.eyebrow'))}</span><h2>${esc(L.t('home.make.h'))}</h2></div><a class="btn btn--ghost" href="${href(L, '/mens-suit-manufacturing')}">${esc(L.t('home.make.btn'))}</a></div>
  <div class="cats">${CATS.map((c) => catCard(L, c)).join('')}</div>
</div></section>
<section class="section"><div class="wrap">
  <div class="section__head"><div><span class="eyebrow">${esc(L.t('home.cat.eyebrow'))}</span><h2>${esc(L.t('home.cat.h'))}</h2></div><a class="btn btn--ghost" href="${href(L, '/collections')}">${esc(L.t('home.cat.all', { n: products.length }))}</a></div>
  <h3 class="row-title">${esc(L.t('home.cat.suits'))}</h3>
  <div class="products">${featSuits.map((p) => pcard(L, p)).join('')}</div>
  <h3 class="row-title">${esc(L.t('home.cat.tux'))}</h3>
  <div class="products">${featTux.map((p) => pcard(L, p)).join('')}</div>
</div></section>
${prose.map((s, i) => `<section class="section${i % 2 ? '' : ' section--ivory'}"><div class="wrap"><div class="prose reveal">${s}</div></div></section>`).join('')}
<section class="section section--dark"><div class="wrap">
  <div class="section__head"><div><span class="eyebrow">${esc(L.t('home.mk.eyebrow'))}</span><h2>${esc(L.t('home.mk.h'))}</h2></div><p>${esc(L.t('home.mk.p'))}</p></div>
  <div class="mini-grid">${site.markets.map((m) => { const d = C.markets.find((x) => x.slug === m.slug) || markets.find((x) => x.slug === m.slug); return `<a class="mini" href="${href(L, `/markets/${m.slug}`)}"><span class="eyebrow">${esc(L.t('market'))}</span><h3>${esc(L.t(`market.${m.slug}`))}</h3><p>${esc(d?.lead || '')}</p></a>`; }).join('')}</div>
</div></section>
${allFaq.length ? `<section class="section"><div class="wrap split split--top"><div><span class="eyebrow">FAQ</span><h2>${esc(L.t('home.faq.h'))}</h2><p class="muted">${esc(L.t('home.faq.more')).replace('{link}', `<a href="${href(L, '/faq')}">${esc(L.t('home.faq.link'))}</a>`)}</p></div>${faqBlock(allFaq)}</div></section>` : ''}
${ctaBand(L, L.t('home.band.title'), L.t('home.band.text'), L.t('msg.general'), 'home-band')}`;
    const md = `# ${home?.h1 || site.tagline}\n\n${home?.lead || site.description}\n\n${home?.body || ''}\n\n## Manufacturing categories\n${CATS.map((c) => `- [${catName(L, c)}](${abs(`${href(L, `/mens-suit-manufacturing/${c.slug}`)}`)}): ${c.items.length}`).join('\n')}\n${mdFooter}`;
    return { bodyClass: 'home', title: cleanTitle(home?.title, "Men's Suit Manufacturer Turkey | Wholesale & Private Label"), description: clip(home?.description || site.description), og: '/og-image.jpg', body, md, schema: [orgSchema, websiteSchema, faqSchema(allFaq)] };
  });

  // ── MANUFACTURING HUB ──
  const hub = C.pages['mens-suit-manufacturing'];
  if (hub) plan(L, '/mens-suit-manufacturing', '0.95', () => {
    const path = L.P('/mens-suit-manufacturing');
    const bc = [crumbHome, [path, L.t('crumb.manufacturing')]];
    const img = photoFor('mens-suit-manufacturing');
    const r = articlePage(L, { doc: hub, path, bc, eyebrow: L.t('hub.eyebrow'), image: img, imageAlt: L.t('hub.imgAlt'),
      afterArticle: `<section class="section section--ivory"><div class="wrap"><div class="section__head"><div><span class="eyebrow">${esc(L.t('hub.cats.eyebrow'))}</span><h2>${esc(L.t('hub.cats.h'))}</h2></div></div><div class="cats">${CATS.map((c) => catCard(L, c)).join('')}</div></div></section>`,
      schemaExtra: [serviceSchema(hub.h1, path)] });
    return { ...r, title: cleanTitle(hub.title, hub.h1), description: clip(hub.description || hub.lead || ''), og: img?.og };
  });

  // ── CATEGORIES ──
  for (const c of CATS) {
    const doc = catDoc(L.code, c.slug) || (L.code === 'en' ? { h1: c.legacy.title, lead: '', html: `<p>${esc(c.legacy.content || '')}</p>`, body: c.legacy.content || '', faq: [], toc: [], description: c.legacy.content } : null);
    if (!doc) continue;
    const key = `/mens-suit-manufacturing/${c.slug}`;
    plan(L, key, '0.9', () => {
      const path = L.P(key);
      const name = catName(L, c);
      const bc = [crumbHome, [L.P('/mens-suit-manufacturing'), L.t('crumb.manufacturing')], [path, name]];
      const grid = `<section class="section section--ivory"><div class="wrap"><div class="section__head"><div><span class="eyebrow">${esc(L.t('cat.grid.eyebrow', { n: c.items.length }))}</span><h2>${esc(L.t('cat.grid.h', { name }))}</h2></div><p>${esc(L.t('cat.grid.p'))}</p></div><div class="products">${c.items.slice(0, 24).map((p) => pcard(L, p)).join('')}</div>${c.items.length > 24 ? `<div style="margin-top:24px"><a class="btn btn--ghost" href="${href(L, '/collections')}">${esc(L.t('cat.seeAll', { n: c.items.length }))}</a></div>` : ''}</div></section>`;
      const r = articlePage(L, { doc, path, bc, eyebrow: L.t('cat.eyebrow', { name }), image: null, afterArticle: grid,
        msg: L.t('cat.msg', { name: name.toLocaleLowerCase(L.code) }),
        schemaExtra: [serviceSchema(doc.h1, path, { image: abs(c.image) }), { '@context': 'https://schema.org', '@type': 'ItemList', name, itemListElement: c.items.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: abs(href(L, `/collections/${p.slug}`)), name: L.prod(p).title })) }] });
      return { ...r, title: cleanTitle(doc.title, `${name} | Mark Morente`), description: clip(doc.description || doc.lead || ''), images: c.items.slice(0, 10).map((p) => p.images[0]) };
    });
  }

  // ── COLLECTIONS + PRODUCTS (only when the catalog text exists in this language) ──
  if (L.translated) {
    plan(L, '/collections', '0.9', () => {
      const path = L.P('/collections');
      const bc = [crumbHome, [path, L.t('crumb.collections')]];
      const groups = [['col.tux', (p) => isTux(p)], ['col.suits', (p) => !isTux(p)]];
      const body = `${crumbs(bc)}
<section class="phead"><div class="wrap"><span class="eyebrow">${esc(L.t('col.eyebrow'))}</span><h1>${esc(L.t('col.h1'))}</h1><p class="lead">${esc(L.t('col.lead', { n: products.length }))}</p>
<div class="btn-row" style="margin-top:18px">${waBtn(L, L.t('col.btn'), L.t('col.msg'), 'collections')}</div><div style="margin-top:18px">${b2bNotice(L)}</div></div></section>
${groups.map(([k, f]) => { const list = sorted.filter(f); return `<section class="section" style="padding-top:24px"><div class="wrap"><div class="section__head"><div><span class="eyebrow">${esc(L.t('col.models', { n: list.length }))}</span><h2>${esc(L.t(k))}</h2></div></div><div class="products">${list.map((p) => pcard(L, p)).join('')}</div></div></section>`; }).join('')}
${ctaBand(L, L.t('col.band.title'), L.t('col.band.text'), L.t('col.band.msg'), 'collections-band')}`;
      const md = `# ${L.t('col.h1')}\n\n${L.t('col.lead', { n: products.length })}\n\n${sorted.map((p) => { const x = L.prod(p); return `- [${x.title} (${p.code})](${abs(href(L, `/collections/${p.slug}`))}): ${x.model}, ${x.fabric}, ${p.status}, ${L.t('card.lotOf', { n: lotCount(p) })} (${sizeRange(p)})`; }).join('\n')}\n${mdFooter}`;
      return { title: L.t('col.title'), description: clip(L.t('col.description', { n: products.length })), body, md, schema: [bcSchema(bc), { '@context': 'https://schema.org', '@type': 'CollectionPage', name: L.t('col.h1'), url: abs(path), inLanguage: L.code, isPartOf: { '@id': `${site.url}/#website` }, mainEntity: { '@type': 'ItemList', itemListElement: sorted.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: abs(href(L, `/collections/${p.slug}`)), name: L.prod(p).title })) } }] };
    });
    for (const p of products) {
      const key = `/collections/${p.slug}`;
      plan(L, key, p.status === 'In Stock' ? '0.8' : '0.6', () => productPage(L, p, key), { images: p.images });
    }
  }

  // ── CONTENT PAGES ──
  for (const slug of PAGE_ORDER) {
    const doc = C.pages[slug]; if (!doc) continue;
    const key = `/${slug}`;
    plan(L, key, '0.8', () => {
      const path = L.P(key);
      const bc = [crumbHome, [path, doc.h1 || doc.title]];
      const img = photoFor(slug);
      const extra = slug === 'about-us' ? [{ '@context': 'https://schema.org', '@type': 'AboutPage', url: abs(path), about: { '@id': ORG } }, orgSchema]
        : slug === 'contact' ? [{ '@context': 'https://schema.org', '@type': 'ContactPage', url: abs(path), about: { '@id': ORG } }]
          : ['private-label-suits', 'oem-suit-manufacturing', 'wholesale-suits'].includes(slug) ? [serviceSchema(doc.h1, path)] : [];
      const r = articlePage(L, { doc, path, bc, eyebrow: L.t(`eyebrow.${slug}`), image: img, imageAlt: doc.imageAlt || (L.code === 'en' ? credits[PHOTOS[slug]?.[0]] : doc.h1), schemaExtra: extra });
      return { ...r, title: cleanTitle(doc.title, doc.h1), description: clip(doc.description || doc.lead || ''), og: img?.og };
    });
  }

  // ── MARKETS ──
  if (C.markets.length) {
    plan(L, '/markets', '0.7', () => indexPage(L, { path: L.P('/markets'), h1: L.t('mk.h1'), lead: L.t('mk.lead'), eyebrow: L.t('market'), items: C.markets.map((m) => ({ ...m, href: L.P(`/markets/${m.slug}`) })), title: L.t('mk.title'), description: L.t('mk.description') }));
    for (const m of C.markets) {
      const key = `/markets/${m.slug}`;
      plan(L, key, '0.75', () => {
        const path = L.P(key);
        const bc = [crumbHome, [L.P('/markets'), L.t('crumb.markets')], [path, m.h1 || m.title]];
        const img = photoFor(m.slug);
        const countries = Array.isArray(m.country_list) ? m.country_list : [];
        const r = articlePage(L, { doc: m, path, bc, eyebrow: L.t('market'), image: img, imageAlt: L.code === 'en' ? credits[PHOTOS[m.slug]?.[0]] : m.h1,
          msg: L.t('mk.msg', { country: countries[0] || m.h1 }),
          schemaExtra: [serviceSchema(m.h1, path, { areaServed: countries.length ? countries.map((c) => ({ '@type': 'Country', name: c })) : [m.h1] })] });
        return { ...r, title: cleanTitle(m.title, m.h1), description: clip(m.description || m.lead || ''), og: img?.og };
      });
    }
  }
}

// ── GUIDES (English only) ──
if (guides.length) plan(EN, '/guides', '0.7', () => indexPage(EN, { path: '/guides', h1: 'Guides for Wholesale Suit Buyers', eyebrow: 'Guide', items: guides.map((g) => ({ ...g, href: `/guides/${g.slug}` })), title: 'Suit Sourcing Guides for Wholesale Buyers', lead: 'Practical guides on sourcing suits and tuxedos from Turkey: private label, costs, fabrics, sizing, quality control and importing.', description: 'Guides for wholesale buyers sourcing men’s suits and tuxedos from Turkey: private label, costs, fabrics, size runs, quality control, shipping and import.' }));
for (const g of guides) {
  const path = `/guides/${g.slug}`;
  plan(EN, path, '0.7', () => {
    const bc = [['/', 'Home'], ['/guides', 'Guides'], [path, g.h1 || g.title]];
    const gi = photoFor(g.slug);
    const r = articlePage(EN, { doc: g, path, bc, eyebrow: `Guide · updated ${g.updated || TODAY}`, image: gi, imageAlt: credits[PHOTOS[g.slug]?.[0]],
      schemaExtra: [{ '@context': 'https://schema.org', '@type': 'Article', headline: g.title, description: g.description, inLanguage: 'en', datePublished: g.updated || TODAY, dateModified: g.updated || TODAY, author: { '@id': ORG }, publisher: { '@id': ORG }, mainEntityOfPage: abs(path), image: abs(gi?.og || '/og-image.jpg') }] });
    return { ...r, ogType: 'article', title: cleanTitle(g.title, g.h1), description: clip(g.description || g.lead || ''), og: gi?.og };
  });
}

function indexPage(L, { path, h1, lead, eyebrow, items, title, description }) {
  const bc = [[L.P('/'), L.t('home')], [path, h1]];
  const body = `${crumbs(bc)}<section class="phead"><div class="wrap"><span class="eyebrow">${esc(eyebrow)}</span><h1>${esc(h1)}</h1><p class="lead">${esc(lead)}</p></div></section>
<section class="section" style="padding-top:0"><div class="wrap"><div class="mini-grid">${items.map((g) => `<a class="mini reveal" href="${g.href}"><span class="eyebrow">${esc(eyebrow)}</span><h3>${esc(g.h1 || g.title)}</h3><p>${esc(g.description || g.lead || '')}</p></a>`).join('')}</div></div></section>
${ctaBand(L, L.t('idx.band.title'), L.t('idx.band.text'), L.t('msg.general'), path + '-band')}`;
  const md = `# ${h1}\n\n${lead}\n\n${items.map((g) => `- [${g.h1 || g.title}](${abs(g.href)}): ${g.description || ''}`).join('\n')}\n${mdFooter}`;
  return { title, description: clip(description), body, md, schema: [bcSchema(bc), { '@context': 'https://schema.org', '@type': 'CollectionPage', name: h1, url: abs(path), inLanguage: L.code }] };
}

function productPage(L, p, key) {
  const path = L.P(key);
  const x = L.prod(p);
  const cat = CATS.find((c) => c.test(p)) || CATS[0];
  const bc = [[L.P('/'), L.t('home')], [L.P('/collections'), L.t('crumb.collections')], [path, x.title]];
  const stock = p.status === 'In Stock';
  const comps = Object.entries(p.description?.compositions || {});
  const related = sorted.filter((y) => y.slug !== p.slug && y.model === p.model).slice(0, 4);
  const range = sizeRange(p);
  const msgStock = L.t('p.msg.stock', { title: x.title, code: p.code });
  const msgPL = L.t('p.msg.pl', { title: x.title, code: p.code });
  const specs = [['p.spec.code', p.code], ['p.spec.type', x.model], ['p.spec.fit', x.fit], ['p.spec.lapel', x.lapel], ['p.spec.fabric', x.fabric], ['p.spec.lining', x.lining], ['p.spec.colour', x.color], ['p.spec.availability', L.t(stock ? 'p.avail.stock' : 'p.avail.mto')], ['p.spec.lot', L.t('p.lot', { n: lotCount(p), range })]].map(([k, v]) => [L.t(k), v]);
  const link = (k, h) => `<a href="${href(L, h)}">${esc(L.t(k))}</a>`;
  const body = `${crumbs(bc)}
<div class="wrap"><div class="product">
  <div class="gallery">
    <figure class="gallery__main">${catalogPic(p.images[0], L.t('p.alt', { title: x.title, model: x.model.toLocaleLowerCase(L.code) }), { sizes: '(max-width: 860px) 100vw, 600px', eager: true, dims: [800, 1200] })}</figure>
    ${p.images.length > 1 ? `<div class="gallery__thumbs">${p.images.map((src, i) => `<button type="button" data-src="${src}" aria-current="${i === 0}" aria-label="${esc(L.t('p.viewImage', { n: i + 1 }))}"><img src="${thumbSrc(src)}" width="70" height="92" alt="" loading="lazy"></button>`).join('')}</div>` : ''}
  </div>
  <div>
    <span class="code">${esc(L.t('p.code'))} ${esc(p.code)} · ${esc(x.model)}</span>
    <h1>${esc(x.title)}</h1>
    <p class="lead">${esc(x.content)}</p>
    <div class="order-box">
      <p>${esc(stock ? L.t('p.box.stock', { n: lotCount(p), range }) : L.t('p.box.mto'))}</p>
      ${stock ? waBtn(L, L.t('p.btn.stock'), msgStock, `product-${p.code}`) : ''}
      ${waBtn(L, L.t(stock ? 'p.btn.pl' : 'p.btn.mto'), msgPL, `product-pl-${p.code}`, stock ? 'btn--ghost' : '')}
      ${tgBtn(L.t('p.btn.tg'), 'btn--ghost')}
    </div>
    <table class="specs"><tbody>${specs.map(([k, v]) => `<tr><th scope="row">${esc(k)}</th><td>${esc(v)}</td></tr>`).join('')}</tbody></table>
    <h2 style="font-size:1.5rem">${esc(L.t('p.sizes'))}</h2>
    <div class="lot">${sizesOf(p).map((s) => `<span>${s}</span>`).join('')}</div>
    ${x.features.length ? `<h2 style="font-size:1.5rem">${esc(L.t('p.details'))}</h2><ul class="chips">${x.features.map((f) => `<li>${esc(f)}</li>`).join('')}</ul>` : ''}
    ${comps.length ? `<p class="muted" style="font-size:.92rem">${comps.map(([k, v]) => `${esc(L.v(k))}: ${esc(L.v(v.replace(/^%100/, '100%')))}`).join(' · ')}</p>` : ''}
    <h2 style="font-size:1.5rem">${esc(L.t('p.ordering'))}</h2>
    <p>${esc(stock ? L.t('p.ordering.stock', { range }) : L.t('p.ordering.mto'))} ${esc(L.t('p.ordering.tail')).replace('{how}', link('p.link.how', '/how-to-order')).replace('{more}', stock ? link('p.link.wholesale', '/wholesale-suits') : link('p.link.pl', '/private-label-suits'))}</p>
    ${b2bNotice(L)}
  </div>
</div></div>
${related.length ? `<section class="section section--ivory"><div class="wrap"><div class="section__head"><div><span class="eyebrow">${esc(L.t('p.similar.eyebrow'))}</span><h2>${esc(L.t('p.similar.h'))}</h2></div><a class="btn btn--ghost" href="${href(L, `/mens-suit-manufacturing/${cat.slug}`)}">${esc(catName(L, cat))}</a></div><div class="products">${related.map((y) => pcard(L, y)).join('')}</div></div></section>` : ''}`;
  const schema = [bcSchema(bc), { '@context': 'https://schema.org', '@type': 'ItemPage', '@id': abs(path) + '#page', url: abs(path), name: x.title, inLanguage: L.code, isPartOf: { '@id': `${site.url}/#website` }, primaryImageOfPage: { '@type': 'ImageObject', url: abs(p.images[0]) },
    mainEntity: serviceSchema(`${x.title} (${p.code})`, path, { description: `${x.content} ${stock ? L.t('p.description.lot', { n: lotCount(p), range }) + '.' : ''}`.trim(), image: p.images.map(abs), category: x.model }) }];
  const md = `# ${x.title} (${p.code})\n\n${x.content}\n\n| | |\n|---|---|\n${specs.map(([k, v]) => `| ${k} | ${v} |`).join('\n')}\n\n${L.t('p.sizes')}: ${sizesOf(p).join(', ')}\n\n${x.features.length ? `${L.t('p.details')}: ${x.features.join('; ')}\n\n` : ''}WhatsApp: ${waHref(L, stock ? msgStock : msgPL)}\n${mdFooter}`;
  const t = L.t('p.title', { title: x.title, code: p.code });
  const description = clip(L.t('p.description', { title: x.title, code: p.code, fabric: x.fabric.toLocaleLowerCase(L.code), lapel: x.lapel.toLocaleLowerCase(L.code), fit: x.fit.toLocaleLowerCase(L.code), lot: stock ? L.t('p.description.lot', { n: lotCount(p), range }) : L.t('p.avail.mto') }));
  return { title: t.length <= 60 ? t : x.title, description, body, md, schema, og: p.images[0], ogType: 'product' };
}

// ════════════════════════════════════════════════════════════
// RENDER
// ════════════════════════════════════════════════════════════
for (const j of jobs) {
  const L = j.L;
  const path = L.P(j.key);
  const alternates = LS.filter((x) => has(x, j.key)).map((x) => ({ code: x.code, name: x.name, href: x.P(j.key) }));
  const r = j.render();
  emit(path, layout({ L, path, v: V, categories: CATS, alternates, bodyClass: r.bodyClass, title: r.title, description: r.description, body: r.body, schema: r.schema, og: r.og, ogType: r.ogType }), r.md, { priority: j.priority, images: r.images || j.images, lang: L.code });
}

// ── 404 ──────────────────────────────────────────────────────
writeFileSync(join(DIST, '404.html'), layout({ L: EN, path: '/404', v: V, categories: CATS, noindex: true, md: false, title: 'Page not found', description: 'This page has moved.', body: `<section class="phead"><div class="wrap"><span class="eyebrow">404</span><h1>This page has moved</h1><p class="lead">Browse the catalog or ask us directly on WhatsApp.</p><div class="btn-row"><a class="btn btn--dark" href="/collections">Collections</a>${waBtn(EN, 'Ask on WhatsApp', 'I was looking for a page on your website.', '404')}</div></div></section>` }));

// ════════════════════════════════════════════════════════════
// SEO / GEO FILES
// ════════════════════════════════════════════════════════════
const LIVE = LS.filter((L) => has(L, '/'));
writeFileSync(join(DIST, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${out.map((p) => `  <url><loc>${abs(p.path)}</loc><lastmod>${TODAY}</lastmod><priority>${p.lang === 'en' ? p.priority : (Number(p.priority) - 0.1).toFixed(1)}</priority>${(p.lang === 'en' ? p.images || [] : []).slice(0, 10).map((i) => `<image:image><image:loc>${abs(i)}</image:loc></image:image>`).join('')}</url>`).join('\n')}
</urlset>
`);
const enOut = out.filter((p) => p.lang === 'en');
const llms = `# Mark Morente

> ${site.description}

Key facts:
- Business type: manufacturer and wholesaler of men's suits and tuxedos (B2B). Istanbul, Turkey. Since ${site.founded}.
- Buyers: ${site.audience.join(', ')}. No single-suit or bespoke retail orders.
- Ordering: ready-stock models in lots (one model, one suit per size, 6–7 suits, EU 46–56/58) or made to order under the buyer's label from 100 units per style (private label / OEM). Fully customizable, including US sizing.
- Lead time: typically 12–15 days production, depending on quantity, model and fabric; quoted per order. Prices quoted per order, not published.
- Capacity: ${site.facts.capacity}.
- Markets: Africa, Europe, Central Asia & Caucasus, Middle East, North America. Worldwide shipping by air, sea or road, as the buyer prefers (express air for urgent orders). Factory visits welcome; photos/video from production and before shipping.
- Contact: WhatsApp ${site.phoneDisplay} (https://wa.me/${site.whatsapp}), Telegram ${site.telegramHandle}, Instagram ${site.instagramHandle}.
- Languages: ${LIVE.map((L) => `${L.name} ${abs(L.P('/'))}`).join(' · ')}

Every page has a Markdown version at the same URL + ".md" (home: /index.md) or via \`Accept: text/markdown\`.

## Manufacturing
- [Men's suit manufacturing (hub)](${abs('/mens-suit-manufacturing.md')})
${CATS.map((c) => `- [${catName(EN, c)}](${abs(`/mens-suit-manufacturing/${c.slug}.md`)}): ${c.items.length} models`).join('\n')}

## Buying
${PAGE_ORDER.filter((s) => pages[s]).map((s) => `- [${pages[s].h1}](${abs(`/${s}.md`)}): ${pages[s].description || ''}`).join('\n')}

## Markets
${markets.map((m) => `- [${m.h1}](${abs(`/markets/${m.slug}.md`)}): ${m.description || ''}`).join('\n')}

## Guides
${guides.map((g) => `- [${g.h1}](${abs(`/guides/${g.slug}.md`)}): ${g.description || ''}`).join('\n')}

## Catalog
- [All collections](${abs('/collections.md')}) · [JSON catalog](${abs('/api/catalog.json')}) · [MCP server](${abs('/mcp')})

## Optional
- [Full site content (English)](${abs('/llms-full.txt')})
`;
writeFileSync(join(DIST, 'llms.txt'), llms);
writeFileSync(join(DIST, 'llms-full.txt'), `# Mark Morente — full content\n\n` + enOut.filter((p) => p.md).map((p) => `<!-- ${abs(p.path)} -->\n${p.md}`).join('\n\n---\n\n'));
const BOTS = ['Googlebot', 'Bingbot', 'OAI-SearchBot', 'ChatGPT-User', 'GPTBot', 'Claude-SearchBot', 'Claude-User', 'ClaudeBot', 'PerplexityBot', 'Perplexity-User', 'Google-Extended', 'Applebot', 'Applebot-Extended', 'DuckAssistBot', 'meta-externalagent', 'MistralAI-User', 'YandexBot', 'Amazonbot', 'CCBot'];
writeFileSync(join(DIST, 'robots.txt'), `# Mark Morente — ${site.url}
# Content Signals (contentsignals.org): we want to be found in search and AI answers.
User-agent: *
Content-Signal: search=yes, ai-input=yes, ai-train=yes
Allow: /
Disallow: /private/
Disallow: /cdn-cgi/

${BOTS.map((b) => `User-agent: ${b}`).join('\n')}
Allow: /

Sitemap: ${site.url}/sitemap.xml
`);
mkdirSync(join(DIST, 'api'), { recursive: true });
writeFileSync(join(DIST, 'api/catalog.json'), JSON.stringify({
  updated: TODAY,
  company: { name: site.name, url: site.url, city: 'Istanbul', country: 'Turkey', founded: site.founded, whatsapp: `https://wa.me/${site.whatsapp}`, telegram: site.telegram, instagram: site.instagram, facts: site.facts, buyers: site.audience, b2bOnly: true, languages: LIVE.map((L) => ({ code: L.code, url: abs(L.P('/')) })) },
  ordering: { stockLot: site.facts.stockLot, madeToOrderMOQ: site.facts.moq, leadTime: site.facts.leadTime, customization: 'Fully customizable for made-to-order (fabric, colour, fit, sizes incl. US sizing, lining, buttons, labels, packaging)', shipping: 'Air, sea or road as the buyer prefers; express air for urgent orders', pricing: 'Quoted per order; not published.' },
  categories: CATS.map((c) => ({ slug: c.slug, name: catName(EN, c), url: abs(`/mens-suit-manufacturing/${c.slug}`), models: c.items.length })),
  products: sorted.map((p) => ({ code: p.code, title: p.title, model: p.model, fit: p.fit, lapel: p.lapel, fabric: p.fabric, lining: p.lining.replace(/^%100/, '100%'), color: p.color, status: p.status, lot: { sizes: sizesOf(p), suits: lotCount(p) }, categories: CATS.filter((c) => c.test(p)).map((c) => c.slug), url: abs(`/collections/${p.slug}`), markdown: abs(`/collections/${p.slug}.md`), image: abs(p.images[0]), quoteUrl: waHref(EN, `I'm interested in ${p.title} (code ${p.code}). Please send the wholesale price.`) })),
}, null, 2));
writeFileSync(join(DIST, 'openapi.json'), JSON.stringify({ openapi: '3.1.0', info: { title: 'Mark Morente wholesale catalog', version: '1.0.0', description: 'Read-only catalog of wholesale suit and tuxedo models. Quotes via WhatsApp (quoteUrl per product).' }, servers: [{ url: site.url }], paths: { '/api/catalog.json': { get: { operationId: 'getCatalog', summary: 'All models, categories and ordering terms', responses: { 200: { description: 'Catalog' } } } }, '/mcp': { post: { operationId: 'mcp', summary: 'MCP endpoint (Streamable HTTP, JSON-RPC 2.0)', responses: { 200: { description: 'JSON-RPC response' } } } } } }, null, 2));
const WK = join(DIST, '.well-known');
mkdirSync(join(WK, 'mcp'), { recursive: true }); mkdirSync(join(WK, 'agent-skills/mark-morente-wholesale'), { recursive: true });
writeFileSync(join(WK, 'api-catalog'), JSON.stringify({ linkset: [{ anchor: abs('/api/catalog.json'), 'service-desc': [{ href: abs('/openapi.json'), type: 'application/openapi+json' }], 'service-doc': [{ href: abs('/llms.txt'), type: 'text/markdown' }] }] }, null, 2));
const card = { serverInfo: { name: 'mark-morente', title: 'Mark Morente wholesale suit catalog', version: '1.0.0' }, description: 'Search wholesale suit/tuxedo models, get ordering terms and create WhatsApp quote links. Read-only, no auth.', transport: { type: 'streamable-http', url: abs('/mcp') }, capabilities: { tools: { listChanged: false } }, tools: [{ name: 'search_models' }, { name: 'get_model' }, { name: 'get_ordering_terms' }, { name: 'create_quote_link' }], authentication: { required: false } };
writeFileSync(join(WK, 'mcp/server-card.json'), JSON.stringify(card, null, 2));
const skill = `---\nname: mark-morente-wholesale\ndescription: Find wholesale men's suits/tuxedos from Mark Morente (Istanbul manufacturer) and prepare a WhatsApp quote request. B2B only.\n---\n\n# Ordering from Mark Morente\n\n1. Search models via ${abs('/api/catalog.json')} or the MCP server ${abs('/mcp')} (tool search_models).\n2. Clarify with the user: company, country, models/codes, quantity (stock lots of 6–7 suits per model, or 100+ units per style for private label), branding needs, destination.\n3. Use the product's quoteUrl or create_quote_link; the user sends the WhatsApp message themselves.\n4. Prices and lead times (typically 12–15 days) are quoted per order. Single suits are not sold.\n`;
writeFileSync(join(WK, 'agent-skills/mark-morente-wholesale/SKILL.md'), skill);
writeFileSync(join(WK, 'agent-skills/index.json'), JSON.stringify({ skills: [{ name: 'mark-morente-wholesale', type: 'skill-md', description: 'Find wholesale suit models and prepare a quote request.', url: abs('/.well-known/agent-skills/mark-morente-wholesale/SKILL.md'), digest: 'sha256:' + createHash('sha256').update(skill).digest('hex') }] }, null, 2));
writeFileSync(join(WK, 'ai-catalog.json'), JSON.stringify({ specVersion: '1.0', host: { name: site.name, url: site.url }, entries: [
  { id: 'urn:air:markmorente.com:mcp:catalog', displayName: 'Mark Morente MCP', type: 'application/mcp+json', url: abs('/.well-known/mcp/server-card.json'), representativeQueries: ['wholesale suit manufacturer Turkey', 'private label tuxedo manufacturer', 'buy suits in bulk from Istanbul'] },
  { id: 'urn:air:markmorente.com:api:catalog', displayName: 'Wholesale catalog (OpenAPI)', type: 'application/openapi+json', url: abs('/openapi.json'), representativeQueries: ['wholesale tuxedo models in stock', 'men suit lots EU sizes'] },
  { id: 'urn:air:markmorente.com:docs:llms', displayName: 'llms.txt', type: 'text/markdown', url: abs('/llms.txt'), representativeQueries: ['who is Mark Morente', 'Mark Morente MOQ and lead time'] },
] }, null, 2));
writeFileSync(join(DIST, '_headers'), `/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-Frame-Options: SAMEORIGIN
  Strict-Transport-Security: max-age=31536000; includeSubDomains
  Link: </llms.txt>; rel="describedby"; type="text/markdown", </sitemap.xml>; rel="sitemap", </.well-known/api-catalog>; rel="api-catalog"
/img/*
  Cache-Control: public, max-age=31536000, immutable
/fonts/*
  Cache-Control: public, max-age=31536000, immutable
/assets/*
  Cache-Control: public, max-age=31536000, immutable
/api/*
  Access-Control-Allow-Origin: *
`);
// Catalog image caching is set in functions/_middleware.js (path patterns can't tell .webp from product HTML).
writeFileSync(join(DIST, '_routes.json'), JSON.stringify({ version: 1, include: ['/*'], exclude: ['/assets/*', '/fonts/*', '/img/*', '/favicon.ico'] }, null, 2));
writeFileSync(join(DIST, 'site.webmanifest'), JSON.stringify({ name: 'Mark Morente', short_name: 'Mark Morente', description: site.tagline, start_url: '/', display: 'standalone', background_color: '#F8F5EF', theme_color: '#16140F', icons: [{ src: '/logo-192.png', sizes: '192x192', type: 'image/png' }, { src: '/logo-512.png', sizes: '512x512', type: 'image/png' }] }));
writeFileSync(join(DIST, '_redirects'), `/index /  301
/home /  301
/products /collections 301
/products/* /collections/:splat 301
/manufacturing /mens-suit-manufacturing 301
/about /about-us 301
/contact-us /contact 301
/collections/navy-blue-jacquard-shawl-lapel-mens-tuxedo-t27 /collections/navy-blue-jacquard-shawl-lapel-mens-tuxedo-t19 301
/collections/T27/* /collections/T19/:splat 301
${LIVE.filter((L) => L.code !== 'en').map((L) => `/${L.code}/collections/navy-blue-jacquard-shawl-lapel-mens-tuxedo-t27 /${L.code}/collections/navy-blue-jacquard-shawl-lapel-mens-tuxedo-t19 301`).join('\n')}
`);
console.log(`✓ ${out.length} pages (${LIVE.map((L) => `${L.code}:${out.filter((p) => p.lang === L.code).length}`).join(' ')}), ${guides.length} guides, ${Object.keys(IMG).length} photos → ${DIST}/ (v${V})`);
