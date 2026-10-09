// Shared HTML: layout, header/footer, buttons, images. Every text comes from the language object L
// (scripts/lib/i18n.mjs): L.t(key, vars) for strings, L.P(path) for localized links.
import { site } from '../../src/data/site.mjs';

export const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const icon = {
  wa: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01Zm-7.01 15.24a8.23 8.23 0 0 1-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48a.92.92 0 0 0-.66.31c-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28Z"/></svg>',
  tg: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M21.9 4.3 18.7 19.4c-.2 1-.9 1.3-1.8.8l-4.9-3.6-2.4 2.3c-.3.3-.5.5-1 .5l.3-5 9.1-8.2c.4-.4-.1-.6-.6-.2L6.2 13l-4.8-1.5c-1-.3-1.1-1 .2-1.5L20.5 2.8c.9-.3 1.7.2 1.4 1.5Z"/></svg>',
  ig: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>',
  globe: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z"/></svg>',
};

/** WhatsApp deep link with the localized greeting. */
export const waHref = (L, message) => `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(`${L.t('waPrefix')} ${message}`)}`;
export const waBtn = (L, label, msg, ev = '', cls = '') =>
  `<a class="btn btn--wa ${cls}" href="${esc(waHref(L, msg))}" target="_blank" rel="noopener" data-wa="${esc(ev)}">${icon.wa}<span>${esc(label)}</span></a>`;
export const tgBtn = (label = 'Telegram', cls = 'btn--ghost') =>
  `<a class="btn ${cls}" href="${site.telegram}" target="_blank" rel="noopener" data-wa="telegram">${icon.tg}<span>${esc(label)}</span></a>`;

/** Processed image (scripts/lib/images.mjs output) → <img srcset>. */
export function pic(img, alt, { sizes = '100vw', eager = false, cls = '' } = {}) {
  if (!img) return '';
  const srcset = img.variants.map((v) => `${v.url} ${v.w}w`).join(', ');
  const mid = img.variants[Math.min(1, img.variants.length - 1)];
  return `<img${cls ? ` class="${cls}"` : ''} src="${mid.url}" srcset="${srcset}" sizes="${sizes}" width="${mid.w}" height="${mid.h}" alt="${esc(alt)}"${eager ? ' fetchpriority="high"' : ' loading="lazy"'} decoding="async">`;
}
/** Existing catalog images: foo.webp (800w), foo-card.webp (480w), foo-thumb.webp (160w). */
export const cardSrc = (src) => src.replace(/\.webp$/, '-card.webp');
export const thumbSrc = (src) => src.replace(/\.webp$/, '-thumb.webp');
export function catalogPic(src, alt, { sizes = '(max-width: 520px) 50vw, 260px', eager = false, dims } = {}) {
  const [w, h] = dims || [480, 720];
  return `<img src="${cardSrc(src)}" srcset="${cardSrc(src)} 480w, ${src} 800w" sizes="${sizes}" width="${w}" height="${h}" alt="${esc(alt)}"${eager ? ' fetchpriority="high"' : ' loading="lazy"'} decoding="async">`;
}

const NAV = [
  ['/mens-suit-manufacturing', 'nav.manufacturing'],
  ['/collections', 'nav.collections'],
  ['/private-label-suits', 'nav.privateLabel'],
  ['/wholesale-suits', 'nav.wholesale'],
  ['/how-to-order', 'nav.ordering', false, true],
  ['/markets', 'nav.markets'],
  ['/guides', 'nav.guides', true, true], // guides are English-only
  ['/about-us', 'nav.about'],
  ['/contact', 'nav.contact', false, true],
]; // 4th flag: only in the mobile menu (desktop header has no room; footer links them)

// Small inline flags (emoji flags don't render on Windows). Arabic uses the UAE flag (simple, one of the main Arabic-speaking markets).
const star = (cx, cy, R, r) => Array.from({ length: 10 }, (_, i) => { const a = Math.PI / 5 * i + Math.PI; const d = i % 2 ? r : R; return `${(cx + d * Math.cos(a)).toFixed(2)},${(cy + d * Math.sin(a)).toFixed(2)}`; }).join(' ');
const FLAGS = {
  en: '<svg viewBox="0 0 60 30"><rect width="60" height="30" fill="#012169"/><path d="M0 0 60 30M60 0 0 30" stroke="#fff" stroke-width="6"/><path d="M0 0 60 30M60 0 0 30" stroke="#C8102E" stroke-width="2"/><path d="M30 0v30M0 15h60" stroke="#fff" stroke-width="10"/><path d="M30 0v30M0 15h60" stroke="#C8102E" stroke-width="6"/></svg>',
  ar: '<svg viewBox="0 0 12 6"><rect width="12" height="2" fill="#00732F"/><rect y="2" width="12" height="2" fill="#fff"/><rect y="4" width="12" height="2" fill="#000"/><rect width="3" height="6" fill="#FF0000"/></svg>',
  ru: '<svg viewBox="0 0 9 6"><rect width="9" height="2" fill="#fff"/><rect y="2" width="9" height="2" fill="#0039A6"/><rect y="4" width="9" height="2" fill="#D52B1E"/></svg>',
  fr: '<svg viewBox="0 0 3 2"><rect width="1" height="2" fill="#002395"/><rect x="1" width="1" height="2" fill="#fff"/><rect x="2" width="1" height="2" fill="#ED2939"/></svg>',
  de: '<svg viewBox="0 0 5 3"><rect width="5" height="1" fill="#000"/><rect y="1" width="5" height="1" fill="#DD0000"/><rect y="2" width="5" height="1" fill="#FFCE00"/></svg>',
  es: '<svg viewBox="0 0 3 2"><rect width="3" height="2" fill="#AA151B"/><rect y=".5" width="3" height="1" fill="#F1BF00"/></svg>',
  tr: `<svg viewBox="0 0 30 20"><rect width="30" height="20" fill="#E30A17"/><circle cx="11" cy="10" r="5" fill="#fff"/><circle cx="12.25" cy="10" r="4" fill="#E30A17"/><polygon points="${star(17.3, 10, 2.2, 0.88)}" fill="#fff"/></svg>`,
};
const flag = (code) => `<span class="flag" aria-hidden="true">${FLAGS[code] || ''}</span>`;

function langSwitch(L, alternates) {
  if (!alternates || alternates.length < 2) return '';
  return `<details class="lang"><summary aria-label="${esc(L.t('language'))}">${flag(L.code)}<span>${L.code.toUpperCase()}</span></summary>
    <ul>${alternates.map((a) => `<li><a href="${a.href}" hreflang="${a.code}" lang="${a.code}"${a.code === L.code ? ' aria-current="true"' : ''}>${flag(a.code)}${esc(a.name)}</a></li>`).join('')}</ul></details>`;
}

function header(L, path, alternates) {
  const items = NAV.map(([h, k, en, mobileOnly]) => {
    const href = en ? h : L.P(h);
    const cur = path === href || path.startsWith(href + '/');
    return `<li${mobileOnly ? ' class="nav__m"' : ''}><a href="${href}"${cur ? ' aria-current="page"' : ''}>${esc(L.t(k))}</a></li>`;
  }).join('');
  return `<a class="skip" href="#main">${esc(L.t('skip'))}</a>
<div class="top"><div class="wrap">${esc(L.t('top.a'))}<span class="top__x"> · ${esc(L.t('top.b'))}</span> · ${esc(L.t('top.c'))}</div></div>
<header class="header"><div class="wrap">
  <a class="logo" href="${L.P('/')}" aria-label="${esc(L.t('homeAria'))}"><img src="/logo-256.webp" width="52" height="52" alt="${esc(L.t('logoAlt'))}"><span>Mark Morente</span></a>
  <nav class="nav" id="nav" aria-label="Main"><ul>${items}</ul>
    <div class="nav__cta">${waBtn(L, L.t('btn.requestQuote'), L.t('msg.general'), 'menu')}</div>
  </nav>
  <div class="header__end">
    ${langSwitch(L, alternates)}
    <div class="header__cta">${waBtn(L, L.t('btn.getQuote'), L.t('msg.general'), 'header', 'btn--sm')}</div>
    <button class="burger" aria-expanded="false" aria-controls="nav" aria-label="${esc(L.t('openMenu'))}" data-open="${esc(L.t('openMenu'))}" data-close="${esc(L.t('closeMenu'))}"><span></span></button>
  </div>
</div></header>`;
}

function footer(L, categories) {
  const f = (k) => esc(L.t(k));
  return `<footer class="footer"><div class="wrap">
  <div class="footer__grid">
    <div class="footer__brand"><img src="/logo-256.webp" width="64" height="64" alt="" loading="lazy"><p>${f('footer.about')}</p>
    <div class="btn-row">${waBtn(L, L.t('btn.whatsapp'), L.t('msg.general'), 'footer', 'btn--sm')}${tgBtn(L.t('btn.telegram'), 'btn--ghost btn--sm')}</div></div>
    <div><h2>${f('footer.manufacturing')}</h2><ul>${categories.map((c) => `<li><a href="${L.P(`/mens-suit-manufacturing/${c.slug}`)}">${esc(L.t(`cat.${c.slug}`))}</a></li>`).join('')}<li><a href="${L.P('/collections')}">${f('footer.allCollections')}</a></li></ul></div>
    <div><h2>${f('footer.buying')}</h2><ul><li><a href="${L.P('/wholesale-suits')}">${f('footer.wholesaleLots')}</a></li><li><a href="${L.P('/private-label-suits')}">${f('footer.privateLabel')}</a></li><li><a href="${L.P('/oem-suit-manufacturing')}">${f('footer.oem')}</a></li><li><a href="${L.P('/how-to-order')}">${f('footer.howToOrder')}</a></li><li><a href="${L.P('/fabrics')}">${f('footer.fabrics')}</a></li><li><a href="${L.P('/size-guide')}">${f('footer.sizeGuide')}</a></li><li><a href="${L.P('/shipping')}">${f('footer.shipping')}</a></li><li><a href="${L.P('/faq')}">${f('footer.faq')}</a></li></ul></div>
    <div><h2>${f('footer.company')}</h2><ul><li><a href="${L.P('/about-us')}">${f('footer.aboutUs')}</a></li><li><a href="${L.P('/markets')}">${f('footer.markets')}</a></li><li><a href="/guides">${f(L.code === 'en' ? 'nav.guides' : 'footer.guides')}</a></li><li><a href="${L.P('/contact')}">${f('footer.contact')}</a></li><li><a href="${site.instagram}" rel="noopener">Instagram ${site.instagramHandle}</a></li><li><a href="${site.telegram}" rel="noopener">Telegram ${site.telegramHandle}</a></li></ul></div>
  </div>
  <div class="footer__bottom"><span>© ${new Date().getFullYear()} Mark Morente · ${f('footer.place')} · ${f('footer.est')} ${site.founded}</span><span>${f('footer.b2b')}</span></div>
</div></footer>
<a class="fab" href="${esc(waHref(L, L.t('msg.general')))}" target="_blank" rel="noopener" data-wa="fab">${icon.wa}<span>${f('btn.whatsapp')}</span></a>
<nav class="mbar" aria-label="Contact">
  <a class="mbar__icon" href="${site.telegram}" target="_blank" rel="noopener" data-wa="mbar-telegram" aria-label="Telegram">${icon.tg}</a>
  <a class="mbar__icon" href="${site.instagram}" target="_blank" rel="noopener" aria-label="Instagram">${icon.ig}</a>
  <a class="mbar__wa" href="${esc(waHref(L, L.t('msg.general')))}" target="_blank" rel="noopener" data-wa="mbar">${icon.wa}<span>${f('btn.getQuote')}</span></a>
</nav>`;
}

/** Full page. p: { L, path, title, description, body, schema[], og, ogType, noindex, v, categories, md, alternates[] } */
export function layout(p) {
  const L = p.L;
  const url = site.url + (p.path === '/' ? '' : p.path);
  const fullTitle = p.path === L.P('/') || `${p.title} | Mark Morente`.length > 62 ? p.title : `${p.title} | Mark Morente`;
  const og = p.og ? site.url + p.og : `${site.url}/og-image.jpg`;
  const mdHref = p.path === '/' ? '/index.md' : `${p.path}.md`;
  const alts = p.alternates || [];
  const abs = (h) => site.url + (h === '/' ? '' : h);
  const sub = L.code === 'ru' ? 'cyrillic' : 'latin';
  return `<!doctype html>
<html lang="${L.code}" dir="${L.dir}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(p.description)}">
<link rel="canonical" href="${url}">
${alts.length > 1 ? alts.map((a) => `<link rel="alternate" hreflang="${a.code}" href="${abs(a.href)}">`).join('\n') + `\n<link rel="alternate" hreflang="x-default" href="${abs(alts[0].href)}">` : ''}
${p.noindex ? '<meta name="robots" content="noindex, follow">' : '<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">'}
${p.md !== false ? `<link rel="alternate" type="text/markdown" href="${mdHref}">` : ''}
<meta name="theme-color" content="#16140F">
<meta property="og:locale" content="${L.locale}">
<meta property="og:type" content="${p.ogType || 'website'}">
<meta property="og:site_name" content="Mark Morente">
<meta property="og:title" content="${esc(p.title)}">
<meta property="og:description" content="${esc(p.description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${og}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/icon.png" type="image/png">
<link rel="apple-touch-icon" href="/logo-192.png">
<link rel="manifest" href="/site.webmanifest">
${L.dir === 'rtl' ? '' : `<link rel="preload" href="/fonts/cormorant-garamond-${sub}.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/inter-400-650-${sub}.woff2" as="font" type="font/woff2" crossorigin>`}
<link rel="stylesheet" href="/assets/site.css?v=${p.v}">
${(p.schema || []).filter(Boolean).map((s) => `<script type="application/ld+json">${JSON.stringify(s).replace(/</g, '\\u003c')}</script>`).join('\n')}
</head>
<body${p.bodyClass ? ` class="${p.bodyClass}"` : ''}>
${header(L, p.path, alts)}
<main id="main">
${p.body}
</main>
${footer(L, p.categories)}
<script src="/assets/site.js?v=${p.v}" defer></script>
</body>
</html>`;
}

export const crumbs = (items) => `<nav class="crumbs wrap" aria-label="Breadcrumb"><ol>${items.map(([h, l], i) => `<li>${i < items.length - 1 ? `<a href="${h}">${esc(l)}</a>` : `<span aria-current="page">${esc(l)}</span>`}</li>`).join('')}</ol></nav>`;
export const faqBlock = (list) => `<div class="faq">${list.map((f) => `<details><summary>${esc(f.q)}</summary><div><p>${esc(f.a)}</p></div></details>`).join('')}</div>`;
export const b2bNotice = (L) => `<div class="notice"><span aria-hidden="true">◆</span><p style="margin:0"><strong>${esc(L.t('notice.strong'))}</strong> ${esc(L.t('notice.text'))}</p></div>`;
