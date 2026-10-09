// Mark Morente static site generator → dist/ (Cloudflare Pages). Zero dependencies.
// URLs keep the old Next.js shape: www host, no trailing slash → we emit <path>.html files.
import { rmSync, mkdirSync, writeFileSync, readFileSync, cpSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { createHash } from 'node:crypto';
import { site, waLink } from '../src/data/site.mjs';
import { loadDir, splitFaq } from './lib/md.mjs';
import { processImage } from './lib/images.mjs';
import { layout, esc, waBtn, tgBtn, pic, catalogPic, thumbSrc, crumbs, faqBlock, b2bNotice } from './lib/html.mjs';

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
const pages = Object.fromEntries(loadDir('content/pages').map((p) => [p.slug, p]));
const guides = loadDir('content/guides');
const markets = loadDir('content/markets');
const abs = (p) => site.url + (p === '/' ? '' : p);

const sizesOf = (p) => p.description?.lot?.sizes || [];
const lotCount = (p) => (p.description?.lot?.quantities || []).reduce((a, b) => a + b, 0) || sizesOf(p).length;
const sizeRange = (p) => (sizesOf(p).length ? `EU ${sizesOf(p)[0]}–${sizesOf(p).at(-1)}` : '');
const isTux = (p) => /tuxedo|dinner jacket/i.test(p.model);
const isCeremony = (p) => isTux(p) && /embellish|sequin|rhinestone|crystal|glitter|gold|velvet|studded|shimmer|sparkle|ombre|colour block|embroider/i.test(`${p.fabric} ${p.title}`);
const CATS = [
  { slug: '3-piece-suits', short: '3-Piece Suits', test: (p) => /three piece/i.test(p.model) },
  { slug: '2-piece-suits', short: '2-Piece Suits', test: (p) => /two piece|double-breasted/i.test(p.model) || (/suit/i.test(p.model) && !/three/i.test(p.model) && !isTux(p)) },
  { slug: 'tuxedos', short: 'Tuxedos', test: (p) => isTux(p) && !isCeremony(p) },
  { slug: 'wedding-suits', short: 'Wedding Suits', test: (p) => /three piece/i.test(p.model) || (isTux(p) && !isCeremony(p) && /navy|burgundy|emerald|green|ivory|white|black/i.test(p.color + p.title)) },
  { slug: 'ceremony-suits', short: 'Ceremony Suits', test: (p) => isCeremony(p) },
  { slug: 'big-tall-suits', short: 'Big & Tall Suits', test: (p) => sizesOf(p).includes('58') },
].map((c) => {
  const legacy = legacyCats.find((x) => x.slug === c.slug) || {};
  const page = pages[c.slug] || pages[`category-${c.slug}`];
  const items = products.filter(c.test).sort((a, b) => (a.status === b.status ? 0 : a.status === 'In Stock' ? -1 : 1));
  return { ...c, legacy, page, items, image: legacy.image, title: page?.title || legacy.title, h1: page?.h1 || legacy.title };
});

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

// ── Output helpers ───────────────────────────────────────────
const out = []; // { path, md, priority, images[] }
function emit(path, html, md, extra = {}) {
  const file = path === '/' ? join(DIST, 'index.html') : join(DIST, `${path}.html`);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
  if (md) writeFileSync(path === '/' ? join(DIST, 'index.md') : join(DIST, `${path}.md`), md);
  out.push({ path, md, ...extra });
}
const clip = (s, n = 158) => (s.length <= n ? s : s.slice(0, s.lastIndexOf(' ', n - 1)).replace(/[,;:\s]+$/, '') + '…');
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
  hasCredential: site.facts.certifications.map((c) => ({ '@type': 'EducationalOccupationalCredential', name: c })),
  contactPoint: { '@type': 'ContactPoint', telephone: `+${site.whatsapp}`, contactType: 'sales', availableLanguage: ['English', 'Turkish'] },
};
const websiteSchema = { '@context': 'https://schema.org', '@type': 'WebSite', '@id': `${site.url}/#website`, url: site.url, name: site.name, inLanguage: 'en', publisher: { '@id': ORG } };
const bcSchema = (items) => ({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items.map(([h, n], i) => ({ '@type': 'ListItem', position: i + 1, name: n, item: abs(h) })) });
const faqSchema = (list) => (list?.length ? { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: list.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) } : null);
const serviceSchema = (name, path, extra = {}) => ({ '@context': 'https://schema.org', '@type': 'Service', name, url: abs(path), provider: { '@id': ORG }, serviceType: "Men's suit manufacturing and wholesale", areaServed: ['Worldwide'], audience: { '@type': 'BusinessAudience', audienceType: 'Wholesalers, retailers and clothing brands' }, ...extra });

// ── Components ───────────────────────────────────────────────
const pcard = (p) => `<a class="pcard reveal" href="/collections/${p.slug}">
  <div class="pcard__img">${catalogPic(p.images[0], `${p.title}, wholesale ${p.model.toLowerCase()} by Mark Morente`)}<span class="badge${p.status === 'In Stock' ? ' badge--stock' : ''}">${p.status === 'In Stock' ? 'In stock' : 'Made to order'}</span></div>
  <div class="pcard__body"><h3>${esc(p.title)}</h3><p>${esc(p.code)} · ${esc(p.fabric)} · lot of ${lotCount(p)}</p></div>
</a>`;
const catCard = (c) => `<a class="cat reveal" href="/mens-suit-manufacturing/${c.slug}">${catalogPic(c.image, `${c.short} manufactured by Mark Morente`, { sizes: '(max-width: 860px) 50vw, 400px' })}<div class="cat__body"><h3>${esc(c.short)}</h3><p>${c.items.length} models · wholesale & private label</p></div></a>`;
const ctaBand = (title, text, msg, ev) => `<section class="section" style="padding-top:20px"><div class="wrap"><div class="cta-band reveal"><div><h2>${esc(title)}</h2><p>${esc(text)}</p></div><div class="btn-row">${waBtn('Request a quote on WhatsApp', msg, ev)}${tgBtn('Telegram', 'btn--ghost')}</div></div></div></section>`;
const quoteBox = (msg, ev) => `<div class="quote-box"><h2>Wholesale quote</h2><p>Send model codes, quantities per size and your country. We reply within 24 hours on business days.</p>${waBtn('WhatsApp', msg, ev)}<div style="height:8px"></div>${tgBtn('Telegram', 'btn--ghost')}</div>`;
const tocBox = (toc) => (toc?.length > 2 ? `<nav class="toc" aria-label="On this page"><h2>On this page</h2><ol>${toc.filter((t) => !/^faq/i.test(t.text)).map((t) => `<li><a href="#${t.id}">${esc(t.text)}</a></li>`).join('')}</ol></nav>` : '');
const relatedLinks = (rel = []) => {
  const lookup = (raw) => {
    const s = raw.replace(/^\/+/, '').replace(/^(guides|markets|mens-suit-manufacturing)\//, '');
    if (s === 'collections') return ['/collections', "Men's suit & tuxedo collections"];
    const c0 = CATS.find((x) => x.slug === s); if (c0) return [`/mens-suit-manufacturing/${s}`, c0.h1];
    if (pages[s]) return [`/${s}`, pages[s].h1];
    const g = guides.find((x) => x.slug === s); if (g) return [`/guides/${s}`, g.h1];
    const m = markets.find((x) => x.slug === s); if (m) return [`/markets/${s}`, m.h1];
    const c = CATS.find((x) => x.slug === s); if (c) return [`/mens-suit-manufacturing/${s}`, c.short];
    return null;
  };
  const items = rel.map(lookup).filter(Boolean);
  return items.length ? `<div class="mini-grid" style="margin-top:28px">${items.map(([h, t]) => `<a class="mini" href="${h}"><span class="eyebrow">Read next</span><h3>${esc(t)}</h3></a>`).join('')}</div>` : '';
};

/** Article-style page from a content md file. */
function articlePage({ doc, path, bc, eyebrow, image, imageAlt, schemaExtra = [], ogType, afterArticle = '', msg }) {
  const { main, faqHtml } = splitFaq(doc.html);
  const qmsg = msg || `I read your page "${doc.h1}" and would like a wholesale quote.`;
  const body = `${crumbs(bc)}
<section class="phead${image ? ' phead--split' : ''}"><div class="wrap">
  <div><span class="eyebrow">${esc(eyebrow)}</span><h1>${esc(doc.h1 || doc.title)}</h1>${doc.lead ? `<p class="lead">${esc(doc.lead)}</p>` : ''}
  <div class="btn-row" style="margin-top:20px">${waBtn('Request a wholesale quote', qmsg, path)}<a class="btn btn--ghost" href="/how-to-order">How ordering works</a></div></div>
  ${image ? `<figure>${pic(image, imageAlt || doc.h1, { sizes: '(max-width: 860px) 100vw, 480px', eager: true })}</figure>` : ''}
</div></section>
<div class="wrap article">
  <article class="prose">${main}${faqHtml && doc.faq?.length ? `<h2 id="faq">Frequently asked questions</h2>${faqBlock(doc.faq)}` : ''}${relatedLinks(doc.related)}</article>
  <aside class="aside">${tocBox(doc.toc)}${quoteBox(qmsg, path + '-aside')}${b2bNotice()}</aside>
</div>
${afterArticle}
${ctaBand('Tell us what you need', 'Model codes or reference photos, quantities per size, your label requirements and destination. We quote price and lead time per order.', qmsg, path + '-band')}`;
  const md = `# ${doc.h1 || doc.title}\n\n${doc.lead || ''}\n\n${doc.body}\n${mdFooter}`;
  const schema = [bcSchema(bc), faqSchema(doc.faq), ...schemaExtra];
  return { body, md, schema, ogType };
}

// ════════════════════════════════════════════════════════════
// HOME
// ════════════════════════════════════════════════════════════
{
  const home = pages.home;
  const inStock = products.filter((p) => p.status === 'In Stock');
  const featured = ['S05', 'T05', 'S08', 'T20', 'S01', 'T14', 'S06', 'T03'].map((c) => products.find((p) => p.code === c)).filter(Boolean);
  const heroImgs = [products.find((p) => p.code === 'S05'), products.find((p) => p.code === 'T12')].filter(Boolean);
  const homeSections = home ? splitFaq(home.html).main.split(/(?=<h2 )/).filter((s) => s.startsWith('<h2')) : [];
  const skip = /^<h2[^>]*>(two ways|what we manufacture)/i;
  const allFaq = [...(pages['faq']?.faq || [])].slice(0, 6);
  const body = `
<section class="hero"><div class="wrap">
  <div>
    <span class="eyebrow">Wholesale · Private label · OEM · Istanbul</span>
    <h1>${home?.h1 ? esc(home.h1) : "Men's Suit &amp; Tuxedo Manufacturer in Turkey"}</h1>
    <p class="lead">${esc(home?.lead || "We manufacture suits and tuxedos in Istanbul for wholesalers, retailers and brands worldwide. Buy ready-stock models in lots or produce under your own label.")}</p>
    <div class="btn-row">${waBtn('Request a wholesale quote', 'I would like a wholesale quote for suits/tuxedos.', 'hero')}<a class="btn btn--ghost" href="/collections">View collections</a></div>
    <ul class="points">
      <li><strong>Stock lots:</strong> one model in a size run, 6–7 suits per lot</li>
      <li><strong>Your label:</strong> made to order from 100 units per style</li>
      <li><strong>Lead time:</strong> typically 12–15 days, quoted per order</li>
    </ul>
  </div>
  <div class="hero__media">${heroImgs.map((p, i) => `<figure>${catalogPic(p.images[0], `${p.title} manufactured by Mark Morente`, { sizes: '(max-width: 860px) 50vw, 300px', eager: i === 0 })}</figure>`).join('')}</div>
</div></section>
<section class="wrap"><div class="stats reveal">
  <div><strong>1,000+</strong><span>suits produced per day</span></div>
  <div><strong>${products.length}</strong><span>catalog models, ${inStock.length} in stock</span></div>
  <div><strong>12–15 days</strong><span>typical production lead time</span></div>
  <div><strong>Since ${site.founded}</strong><span>suit manufacturing in Istanbul</span></div>
</div></section>
<section class="section"><div class="wrap">
  <div class="section__head"><div><span class="eyebrow">Two ways to buy</span><h2>From our stock or under your label</h2></div><p>Every order is wholesale. Pick the route that fits your business, or combine both.</p></div>
  <div class="paths">
    <div class="path reveal"><span class="path__tag">Ready stock</span><h3>Wholesale stock lots</h3><p class="muted">Choose in-stock models from the catalog. Each lot is one model in a full size run.</p>
      <dl><dt>Minimum</dt><dd>1 lot (6–7 suits)</dd><dt>Sizes</dt><dd>EU 46–56 / 58</dd><dt>Dispatch</dt><dd>Fast, from stock</dd></dl>
      <div class="btn-row"><a class="btn btn--dark" href="/wholesale-suits">Wholesale details</a><a class="btn btn--ghost" href="/collections">See stock</a></div></div>
    <div class="path reveal"><span class="path__tag">Made to order</span><h3>Private label &amp; OEM</h3><p class="muted">Your fabric, fit, lining, buttons, labels and packaging. Produced in our Istanbul factory.</p>
      <dl><dt>Minimum</dt><dd>100 units per style</dd><dt>Lead time</dt><dd>Typically 12–15 days</dd><dt>Branding</dt><dd>Labels, hangtags, garment bags</dd></dl>
      <div class="btn-row"><a class="btn btn--dark" href="/private-label-suits">Private label</a><a class="btn btn--ghost" href="/oem-suit-manufacturing">OEM</a></div></div>
  </div>
  <div style="margin-top:18px">${b2bNotice()}</div>
</div></section>
<section class="section section--ivory"><div class="wrap">
  <div class="section__head"><div><span class="eyebrow">What we manufacture</span><h2>Suits, tuxedos and ceremonywear</h2></div><a class="btn btn--ghost" href="/mens-suit-manufacturing">All manufacturing</a></div>
  <div class="cats">${CATS.map(catCard).join('')}</div>
</div></section>
<section class="section"><div class="wrap">
  <div class="section__head"><div><span class="eyebrow">Catalog</span><h2>Models buyers order most</h2></div><a class="btn btn--ghost" href="/collections">All ${products.length} models</a></div>
  <div class="products">${featured.map(pcard).join('')}</div>
</div></section>
${homeSections.filter((s) => !skip.test(s)).map((s, i) => `<section class="section${i % 2 ? ' section--ivory' : ''}"><div class="wrap"><div class="prose reveal">${s}</div></div></section>`).join('')}
<section class="section section--dark"><div class="wrap">
  <div class="section__head"><div><span class="eyebrow">Markets</span><h2>Shipping to buyers on five continents</h2></div><p>Africa, Europe, Central Asia and the Caucasus, the Middle East and North America.</p></div>
  <div class="mini-grid">${site.markets.map((m) => { const d = markets.find((x) => x.slug === m.slug); return `<a class="mini" href="/markets/${m.slug}"><span class="eyebrow">Market</span><h3>${esc(m.name)}</h3><p>${esc(d?.lead || '')}</p></a>`; }).join('')}</div>
</div></section>
${allFaq.length ? `<section class="section"><div class="wrap split split--top"><div><span class="eyebrow">FAQ</span><h2>Questions buyers ask first</h2><p class="muted">More answers on the <a href="/faq">FAQ page</a>.</p></div>${faqBlock(allFaq)}</div></section>` : ''}
${ctaBand('Get a wholesale quote', 'Send model codes, quantities and destination. Prices and lead times are quoted per order.', 'I would like a wholesale quote.', 'home-band')}`;
  const md = `# ${home?.h1 || site.tagline}\n\n${site.description}\n\n${home?.body || ''}\n\n## Manufacturing categories\n${CATS.map((c) => `- [${c.short}](${abs(`/mens-suit-manufacturing/${c.slug}`)}): ${c.items.length} models`).join('\n')}\n${mdFooter}`;
  emit('/', layout({ path: '/', v: V, categories: CATS, title: cleanTitle(home?.title, "Men's Suit Manufacturer Turkey | Wholesale & Private Label"), description: clip(home?.description || site.description), og: '/og-image.jpg', body, schema: [orgSchema, websiteSchema, faqSchema(allFaq)] }), md, { priority: '1.0' });
}

// ════════════════════════════════════════════════════════════
// MANUFACTURING HUB + CATEGORIES
// ════════════════════════════════════════════════════════════
{
  const path = '/mens-suit-manufacturing';
  const doc = pages['mens-suit-manufacturing'] || { h1: "Men's Suit Manufacturing", lead: "Private label, OEM and wholesale suit production in Istanbul, Turkey.", html: '', body: '', faq: [], toc: [], title: "Men's Suit Manufacturer Turkey | Private Label, OEM & Wholesale", description: 'Premium suits with high production capacity. Private label, OEM and wholesale manufacturing from Turkey with global B2B shipping.' };
  const bc = [['/', 'Home'], [path, 'Manufacturing']];
  const r = articlePage({ doc, path, bc, eyebrow: "Men's suit manufacturer · Turkey", image: photoFor('mens-suit-manufacturing'), imageAlt: 'Suit production floor in a garment factory',
    afterArticle: `<section class="section section--ivory"><div class="wrap"><div class="section__head"><div><span class="eyebrow">Categories</span><h2>What we manufacture</h2></div></div><div class="cats">${CATS.map(catCard).join('')}</div></div></section>`,
    schemaExtra: [serviceSchema("Men's suit manufacturing (wholesale, private label, OEM)", path)] });
  emit(path, layout({ path, v: V, categories: CATS, title: cleanTitle(doc.title, "Men's Suit Manufacturer in Turkey | Wholesale & Private Label"), description: clip(doc.description), body: r.body, schema: r.schema, og: photoFor('mens-suit-manufacturing')?.og }), r.md, { priority: '0.95' });
}
for (const c of CATS) {
  const path = `/mens-suit-manufacturing/${c.slug}`;
  const doc = c.page || { h1: c.legacy.title, lead: '', html: `<p>${esc(c.legacy.content || '')}</p>`, body: c.legacy.content || '', faq: [], toc: [], description: c.legacy.content };
  const bc = [['/', 'Home'], ['/mens-suit-manufacturing', 'Manufacturing'], [path, c.short]];
  const grid = `<section class="section section--ivory"><div class="wrap"><div class="section__head"><div><span class="eyebrow">${c.items.length} models</span><h2>${esc(c.short)} in our catalog</h2></div><p>In-stock models ship as lots; any model can be produced to order under your label.</p></div><div class="products">${c.items.slice(0, 24).map(pcard).join('')}</div>${c.items.length > 24 ? `<div style="margin-top:24px"><a class="btn btn--ghost" href="/collections">See all ${c.items.length} models</a></div>` : ''}</div></section>`;
  const r = articlePage({ doc, path, bc, eyebrow: `${c.short} · wholesale & private label`, image: null, afterArticle: grid,
    msg: `I'm interested in wholesale ${c.short.toLowerCase()}. Please send your catalog and prices.`,
    schemaExtra: [serviceSchema(c.h1, path, { image: abs(c.image) }), { '@context': 'https://schema.org', '@type': 'ItemList', name: c.short, itemListElement: c.items.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: abs(`/collections/${p.slug}`), name: p.title })) }] });
  emit(path, layout({ path, v: V, categories: CATS, title: cleanTitle(doc.title, `${c.short} Manufacturer Turkey | Wholesale`), description: clip(doc.description || `${c.short} manufacturing in Istanbul for wholesale and private label buyers.`), body: r.body, schema: r.schema, og: null }), r.md, { priority: '0.9', images: c.items.slice(0, 10).map((p) => p.images[0]) });
}

// ════════════════════════════════════════════════════════════
// COLLECTIONS + PRODUCTS
// ════════════════════════════════════════════════════════════
const sorted = [...products].sort((a, b) => (a.status === b.status ? 0 : a.status === 'In Stock' ? -1 : 1));
{
  const path = '/collections';
  const bc = [['/', 'Home'], [path, 'Collections']];
  const groups = [['Tuxedos & dinner jackets', (p) => isTux(p)], ['Suits', (p) => !isTux(p)]];
  const body = `${crumbs(bc)}
<section class="phead"><div class="wrap"><span class="eyebrow">Wholesale catalog</span><h1>Men's Suit &amp; Tuxedo Collections</h1><p class="lead">${products.length} models. In-stock models are sold in lots of 6–7 suits (one per size); every model can also be produced to order under your label from 100 units.</p>
<div class="btn-row" style="margin-top:18px">${waBtn('Request the full catalog & prices', 'Please send your full wholesale catalog and price list.', 'collections')}</div><div style="margin-top:18px">${b2bNotice()}</div></div></section>
${groups.map(([name, f]) => { const list = sorted.filter(f); return `<section class="section" style="padding-top:24px"><div class="wrap"><div class="section__head"><div><span class="eyebrow">${list.length} models</span><h2>${name}</h2></div></div><div class="products">${list.map(pcard).join('')}</div></div></section>`; }).join('')}
${ctaBand('Want these under your label?', 'Any model can be produced in your fabric and colour with your labels, from 100 units per style.', 'I would like to produce some of your models under my own label.', 'collections-band')}`;
  const md = `# Men's Suit & Tuxedo Collections\n\n${products.length} wholesale models.\n\n${sorted.map((p) => `- [${p.title} (${p.code})](${abs(`/collections/${p.slug}`)}): ${p.model}, ${p.fabric}, ${p.status}, lot of ${lotCount(p)} (${sizeRange(p)})`).join('\n')}\n${mdFooter}`;
  emit(path, layout({ path, v: V, categories: CATS, title: "Men's Suit & Tuxedo Collections | Wholesale Catalog", description: clip(`Wholesale catalog of ${products.length} men's suits and tuxedos made in Istanbul: stock lots of 6–7 suits per model or private label production from 100 units.`), body, schema: [bcSchema(bc), { '@context': 'https://schema.org', '@type': 'CollectionPage', name: "Men's Suit & Tuxedo Collections", url: abs(path), isPartOf: { '@id': `${site.url}/#website` }, mainEntity: { '@type': 'ItemList', itemListElement: sorted.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: abs(`/collections/${p.slug}`), name: p.title })) } }] }), md, { priority: '0.9' });
}
for (const p of products) {
  const path = `/collections/${p.slug}`;
  const cat = CATS.find((c) => c.test(p)) || CATS[0];
  const bc = [['/', 'Home'], ['/collections', 'Collections'], [path, p.title]];
  const stock = p.status === 'In Stock';
  const feats = p.description?.features || [];
  const comps = Object.entries(p.description?.compositions || {});
  const related = sorted.filter((x) => x.slug !== p.slug && x.model === p.model).slice(0, 4);
  const msgStock = `I'm interested in ${p.title} (code ${p.code}). Please send the wholesale lot price and availability.`;
  const msgPL = `I'd like to produce ${p.title} (code ${p.code}) under my own label. Please send MOQ, price and lead time.`;
  const specs = [['Model code', p.code], ['Type', p.model], ['Fit', p.fit], ['Lapel', p.lapel], ['Fabric', p.fabric], ['Lining', p.lining.replace(/^%100/, '100%')], ['Colour', p.color], ['Availability', stock ? 'In stock (sold in lots)' : 'Made to order'], ['Lot', `${lotCount(p)} suits, ${sizeRange(p)}`]];
  const body = `${crumbs(bc)}
<div class="wrap"><div class="product">
  <div class="gallery">
    <figure class="gallery__main">${catalogPic(p.images[0], `${p.title}, ${p.model.toLowerCase()} by Mark Morente, front view`, { sizes: '(max-width: 860px) 100vw, 600px', eager: true, dims: [800, 1200] })}</figure>
    ${p.images.length > 1 ? `<div class="gallery__thumbs">${p.images.map((src, i) => `<button type="button" data-src="${src}" aria-current="${i === 0}" aria-label="View image ${i + 1}"><img src="${thumbSrc(src)}" width="70" height="92" alt="" loading="lazy"></button>`).join('')}</div>` : ''}
  </div>
  <div>
    <span class="code">Code ${esc(p.code)} · ${esc(p.model)}</span>
    <h1>${esc(p.title)}</h1>
    <p class="lead">${esc(p.content)}</p>
    <div class="order-box">
      <p>${stock ? `In stock. Sold wholesale as a lot of ${lotCount(p)} suits (${sizeRange(p)}, one per size). Also available made to order under your label from 100 units.` : `Currently not in stock as a ready lot. We can produce this model to order from 100 units, in your fabric and colour, with your labels.`}</p>
      ${stock ? waBtn('Ask lot price & availability', msgStock, `product-${p.code}`) : ''}
      ${waBtn(stock ? 'Produce under my label' : 'Request production quote', msgPL, `product-pl-${p.code}`, stock ? 'btn--ghost' : '')}
      ${tgBtn('Ask on Telegram', 'btn--ghost')}
    </div>
    <table class="specs"><tbody>${specs.map(([k, v]) => `<tr><th scope="row">${k}</th><td>${esc(v)}</td></tr>`).join('')}</tbody></table>
    <h2 style="font-size:1.5rem">Sizes in one lot</h2>
    <div class="lot">${sizesOf(p).map((s) => `<span>${s}</span>`).join('')}</div>
    ${feats.length ? `<h2 style="font-size:1.5rem">Details</h2><ul class="chips">${feats.map((f) => `<li>${esc(f)}</li>`).join('')}</ul>` : ''}
    ${comps.length ? `<p class="muted" style="font-size:.92rem">${comps.map(([k, v]) => `${esc(k)}: ${esc(v.replace(/^%100/, '100%'))}`).join(' · ')}</p>` : ''}
    <h2 style="font-size:1.5rem">Ordering this model</h2>
    <p>${stock ? `Order one or more lots from stock; each lot covers ${sizeRange(p)}. If you need more of certain sizes or a different size ratio for your market, we can produce it to order.` : `This style is available made to order.`} For production under your brand you choose fabric, colour, lining, buttons and labels; minimum 100 units per style, typical lead time 12–15 days depending on the order. See <a href="/how-to-order">how ordering works</a> and <a href="/${stock ? 'wholesale-suits' : 'private-label-suits'}">${stock ? 'wholesale stock lots' : 'private label production'}</a>.</p>
    ${b2bNotice()}
  </div>
</div></div>
${related.length ? `<section class="section section--ivory"><div class="wrap"><div class="section__head"><div><span class="eyebrow">Similar models</span><h2>More ${esc(p.model.toLowerCase())}s</h2></div><a class="btn btn--ghost" href="/mens-suit-manufacturing/${cat.slug}">${esc(cat.short)}</a></div><div class="products">${related.map(pcard).join('')}</div></div></section>` : ''}`;
  const schema = [bcSchema(bc), { '@context': 'https://schema.org', '@type': 'ItemPage', '@id': abs(path) + '#page', url: abs(path), name: p.title, inLanguage: 'en', isPartOf: { '@id': `${site.url}/#website` }, primaryImageOfPage: { '@type': 'ImageObject', url: abs(p.images[0]) },
    mainEntity: serviceSchema(`Wholesale ${p.title} (${p.code})`, path, { description: `${p.content} ${stock ? `Sold in lots of ${lotCount(p)} (${sizeRange(p)}).` : 'Made to order.'} Private label from 100 units.`, image: p.images.map(abs), category: p.model }) }];
  const md = `# ${p.title} (code ${p.code})\n\n${p.content}\n\n| Spec | Value |\n|---|---|\n${specs.map(([k, v]) => `| ${k} | ${v} |`).join('\n')}\n\nSizes in one lot: ${sizesOf(p).join(', ')}\n\nDetails: ${feats.join('; ')}\n\nOrder from stock: ${waLink(msgStock)}\nProduce under your label (MOQ 100): ${waLink(msgPL)}\n${mdFooter}`;
  const t = `Wholesale ${p.title} ${p.code}`;
  emit(path, layout({ path, v: V, categories: CATS, ogType: 'product', title: t.length <= 60 ? t : p.title, description: clip(`${p.title} (${p.code}) for wholesale buyers: ${p.fabric.toLowerCase()}, ${p.lapel.toLowerCase()}, ${p.fit.toLowerCase()}. ${stock ? `Lots of ${lotCount(p)}, ${sizeRange(p)}` : 'Made to order'}; private label from 100 units.`), og: p.images[0], body, schema }), md, { priority: stock ? '0.8' : '0.6', images: p.images });
}

// ════════════════════════════════════════════════════════════
// CONTENT PAGES
// ════════════════════════════════════════════════════════════
const PAGE_ORDER = ['private-label-suits', 'oem-suit-manufacturing', 'wholesale-suits', 'how-to-order', 'fabrics', 'size-guide', 'shipping', 'faq', 'about-us', 'contact'];
const EYEBROW = { 'private-label-suits': 'Private label', 'oem-suit-manufacturing': 'OEM production', 'wholesale-suits': 'Wholesale stock lots', 'how-to-order': 'Ordering', fabrics: 'Fabrics', 'size-guide': 'Sizing', shipping: 'Shipping & export', faq: 'FAQ', 'about-us': 'About Mark Morente', contact: 'Contact' };
for (const slug of PAGE_ORDER) {
  const doc = pages[slug]; if (!doc) continue;
  const path = `/${slug}`;
  const bc = [['/', 'Home'], [path, doc.h1 || doc.title]];
  const img = photoFor(slug);
  const extra = slug === 'about-us' ? [{ '@context': 'https://schema.org', '@type': 'AboutPage', url: abs(path), about: { '@id': ORG } }, orgSchema]
    : slug === 'contact' ? [{ '@context': 'https://schema.org', '@type': 'ContactPage', url: abs(path), about: { '@id': ORG } }]
      : ['private-label-suits', 'oem-suit-manufacturing', 'wholesale-suits'].includes(slug) ? [serviceSchema(doc.h1, path)] : [];
  const r = articlePage({ doc, path, bc, eyebrow: EYEBROW[slug] || 'Mark Morente', image: img, imageAlt: doc.imageAlt || credits[PHOTOS[slug]?.[0]], schemaExtra: extra });
  emit(path, layout({ path, v: V, categories: CATS, title: cleanTitle(doc.title, doc.h1), description: clip(doc.description || doc.lead || ''), body: r.body, schema: r.schema, og: img?.og }), r.md, { priority: '0.8' });
}

// ════════════════════════════════════════════════════════════
// GUIDES + MARKETS
// ════════════════════════════════════════════════════════════
function indexPage({ path, h1, lead, eyebrow, items, base, title, description }) {
  const bc = [['/', 'Home'], [path, h1]];
  const body = `${crumbs(bc)}<section class="phead"><div class="wrap"><span class="eyebrow">${esc(eyebrow)}</span><h1>${esc(h1)}</h1><p class="lead">${esc(lead)}</p></div></section>
<section class="section" style="padding-top:0"><div class="wrap"><div class="mini-grid">${items.map((g) => `<a class="mini reveal" href="${base}/${g.slug}"><span class="eyebrow">${esc(eyebrow)}</span><h3>${esc(g.h1 || g.title)}</h3><p>${esc(g.description || g.lead || '')}</p></a>`).join('')}</div></div></section>
${ctaBand('Ready to talk numbers?', 'Send quantities, sizes and destination for a wholesale quote.', 'I would like a wholesale quote.', path + '-band')}`;
  const md = `# ${h1}\n\n${lead}\n\n${items.map((g) => `- [${g.h1 || g.title}](${abs(`${base}/${g.slug}`)}): ${g.description || ''}`).join('\n')}\n${mdFooter}`;
  emit(path, layout({ path, v: V, categories: CATS, title, description: clip(description), body, schema: [bcSchema(bc), { '@context': 'https://schema.org', '@type': 'CollectionPage', name: h1, url: abs(path) }] }), md, { priority: '0.7' });
}
if (guides.length) indexPage({ path: '/guides', h1: 'Guides for Wholesale Suit Buyers', eyebrow: 'Guide', base: '/guides', items: guides, title: 'Suit Sourcing Guides for Wholesale Buyers', lead: 'Practical guides on sourcing suits and tuxedos from Turkey: private label, costs, fabrics, sizing, quality control and importing.', description: 'Guides for wholesale buyers sourcing men’s suits and tuxedos from Turkey: private label, costs, fabrics, size runs, quality control, shipping and import.' });
for (const g of guides) {
  const path = `/guides/${g.slug}`;
  const bc = [['/', 'Home'], ['/guides', 'Guides'], [path, g.h1 || g.title]];
  const gi = photoFor(g.slug);
  const r = articlePage({ doc: g, path, bc, eyebrow: `Guide · updated ${g.updated || TODAY}`, image: gi, imageAlt: credits[PHOTOS[g.slug]?.[0]], ogType: 'article',
    schemaExtra: [{ '@context': 'https://schema.org', '@type': 'Article', headline: g.title, description: g.description, inLanguage: 'en', datePublished: g.updated || TODAY, dateModified: g.updated || TODAY, author: { '@id': ORG }, publisher: { '@id': ORG }, mainEntityOfPage: abs(path), image: abs(gi?.og || '/og-image.jpg') }] });
  emit(path, layout({ path, v: V, categories: CATS, ogType: 'article', title: cleanTitle(g.title, g.h1), description: clip(g.description || g.lead || ''), body: r.body, schema: r.schema, og: gi?.og }), r.md, { priority: '0.7' });
}
if (markets.length) indexPage({ path: '/markets', h1: 'Markets We Supply', eyebrow: 'Market', base: '/markets', items: markets, title: 'Wholesale Suit Supplier for Africa, Europe, Asia & More', lead: 'We ship wholesale suits and tuxedos from Istanbul to buyers in Africa, Europe, Central Asia and the Caucasus, the Middle East and North America.', description: 'Mark Morente supplies wholesale suits and tuxedos from Istanbul to Africa, Europe, Central Asia & Caucasus, the Middle East and North America.' });
for (const m of markets) {
  const path = `/markets/${m.slug}`;
  const bc = [['/', 'Home'], ['/markets', 'Markets'], [path, m.h1 || m.title]];
  const img = photoFor(m.slug);
  const countries = Array.isArray(m.country_list) ? m.country_list : [];
  const r = articlePage({ doc: m, path, bc, eyebrow: 'Market', image: img, imageAlt: credits[PHOTOS[m.slug]?.[0]],
    msg: `I'm a buyer from ${countries[0] || m.h1} and would like a wholesale quote.`,
    schemaExtra: [serviceSchema(`Wholesale suit supply: ${m.h1}`, path, { areaServed: countries.length ? countries.map((c) => ({ '@type': 'Country', name: c })) : [m.h1] })] });
  emit(path, layout({ path, v: V, categories: CATS, title: cleanTitle(m.title, m.h1), description: clip(m.description || m.lead || ''), body: r.body, schema: r.schema, og: img?.og }), r.md, { priority: '0.75' });
}

// ── 404 ──────────────────────────────────────────────────────
writeFileSync(join(DIST, '404.html'), layout({ path: '/404', v: V, categories: CATS, noindex: true, md: false, title: 'Page not found', description: 'This page has moved.', body: `<section class="phead"><div class="wrap"><span class="eyebrow">404</span><h1>This page has moved</h1><p class="lead">Browse the catalog or ask us directly on WhatsApp.</p><div class="btn-row"><a class="btn btn--dark" href="/collections">Collections</a>${waBtn('Ask on WhatsApp', 'I was looking for a page on your website.', '404')}</div></div></section>` }));

// ════════════════════════════════════════════════════════════
// SEO / GEO FILES
// ════════════════════════════════════════════════════════════
writeFileSync(join(DIST, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${out.map((p) => `  <url><loc>${abs(p.path)}</loc><lastmod>${TODAY}</lastmod><priority>${p.priority}</priority>${(p.images || []).slice(0, 10).map((i) => `<image:image><image:loc>${abs(i)}</image:loc></image:image>`).join('')}</url>`).join('\n')}
</urlset>
`);
const llms = `# Mark Morente

> ${site.description}

Key facts:
- Business type: manufacturer and wholesaler of men's suits and tuxedos (B2B). Istanbul, Turkey. Since ${site.founded}.
- Buyers: ${site.audience.join(', ')}. No single-suit or bespoke retail orders.
- Ordering: ready-stock models in lots (one model, one suit per size, 6–7 suits, EU 46–56/58) or made to order under the buyer's label from 100 units per style (private label / OEM).
- Lead time: typically 12–15 days production, depending on quantity, model and fabric; quoted per order. Prices quoted per order, not published.
- Capacity: ${site.facts.capacity}. Certifications: ${site.facts.certifications.join('; ')}.
- Markets: Africa, Europe, Central Asia & Caucasus, Middle East, North America. Worldwide shipping by air, sea or road.
- Contact: WhatsApp ${site.phoneDisplay} (https://wa.me/${site.whatsapp}), Telegram ${site.telegramHandle}, Instagram ${site.instagramHandle}.

Every page has a Markdown version at the same URL + ".md" (home: /index.md) or via \`Accept: text/markdown\`.

## Manufacturing
- [Men's suit manufacturing (hub)](${abs('/mens-suit-manufacturing.md')})
${CATS.map((c) => `- [${c.short}](${abs(`/mens-suit-manufacturing/${c.slug}.md`)}): ${c.items.length} models`).join('\n')}

## Buying
${PAGE_ORDER.filter((s) => pages[s]).map((s) => `- [${pages[s].h1}](${abs(`/${s}.md`)}): ${pages[s].description || ''}`).join('\n')}

## Markets
${markets.map((m) => `- [${m.h1}](${abs(`/markets/${m.slug}.md`)}): ${m.description || ''}`).join('\n')}

## Guides
${guides.map((g) => `- [${g.h1}](${abs(`/guides/${g.slug}.md`)}): ${g.description || ''}`).join('\n')}

## Catalog
- [All collections](${abs('/collections.md')}) · [JSON catalog](${abs('/api/catalog.json')}) · [MCP server](${abs('/mcp')})

## Optional
- [Full site content](${abs('/llms-full.txt')})
`;
writeFileSync(join(DIST, 'llms.txt'), llms);
writeFileSync(join(DIST, 'llms-full.txt'), `# Mark Morente — full content\n\n` + out.filter((p) => p.md).map((p) => `<!-- ${abs(p.path)} -->\n${p.md}`).join('\n\n---\n\n'));
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
  company: { name: site.name, url: site.url, city: 'Istanbul', country: 'Turkey', founded: site.founded, whatsapp: `https://wa.me/${site.whatsapp}`, telegram: site.telegram, instagram: site.instagram, facts: site.facts, buyers: site.audience, b2bOnly: true },
  ordering: { stockLot: site.facts.stockLot, madeToOrderMOQ: site.facts.moq, leadTime: site.facts.leadTime, pricing: 'Quoted per order; not published.' },
  categories: CATS.map((c) => ({ slug: c.slug, name: c.short, url: abs(`/mens-suit-manufacturing/${c.slug}`), models: c.items.length })),
  products: sorted.map((p) => ({ code: p.code, title: p.title, model: p.model, fit: p.fit, lapel: p.lapel, fabric: p.fabric, lining: p.lining.replace(/^%100/, '100%'), color: p.color, status: p.status, lot: { sizes: sizesOf(p), suits: lotCount(p) }, categories: CATS.filter((c) => c.test(p)).map((c) => c.slug), url: abs(`/collections/${p.slug}`), markdown: abs(`/collections/${p.slug}.md`), image: abs(p.images[0]), quoteUrl: waLink(`I'm interested in ${p.title} (code ${p.code}). Please send the wholesale price.`) })),
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
`);
console.log(`✓ ${out.length} pages, ${guides.length} guides, ${markets.length} markets, ${Object.keys(IMG).length} photos → ${DIST}/ (v${V})`);
