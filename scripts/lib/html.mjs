// Shared HTML: layout, header/footer, buttons, images.
import { site, waLink } from '../../src/data/site.mjs';

export const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const icon = {
  wa: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01Zm-7.01 15.24a8.23 8.23 0 0 1-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48a.92.92 0 0 0-.66.31c-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28Z"/></svg>',
  tg: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M21.9 4.3 18.7 19.4c-.2 1-.9 1.3-1.8.8l-4.9-3.6-2.4 2.3c-.3.3-.5.5-1 .5l.3-5 9.1-8.2c.4-.4-.1-.6-.6-.2L6.2 13l-4.8-1.5c-1-.3-1.1-1 .2-1.5L20.5 2.8c.9-.3 1.7.2 1.4 1.5Z"/></svg>',
  ig: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>',
};

export const waBtn = (label, msg, ev = '', cls = '') =>
  `<a class="btn btn--wa ${cls}" href="${esc(waLink(msg))}" target="_blank" rel="noopener" data-wa="${esc(ev)}">${icon.wa}<span>${esc(label)}</span></a>`;
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
  ['/mens-suit-manufacturing', 'Manufacturing'],
  ['/collections', 'Collections'],
  ['/private-label-suits', 'Private Label'],
  ['/wholesale-suits', 'Wholesale'],
  ['/how-to-order', 'Ordering'],
  ['/markets', 'Markets'],
  ['/guides', 'Guides'],
  ['/about-us', 'About'],
  ['/contact', 'Contact'],
];

function header(path) {
  const items = NAV.map(([h, l]) => `<li><a href="${h}"${path === h || (h !== '/' && path.startsWith(h + '/')) ? ' aria-current="page"' : ''}>${l}</a></li>`).join('');
  return `<a class="skip" href="#main">Skip to content</a>
<div class="top"><div class="wrap">Wholesale only<span class="top__x"> · Stock lots from 6 suits · Private label from 100 units per style</span> · Worldwide shipping</div></div>
<header class="header"><div class="wrap">
  <a class="logo" href="/" aria-label="Mark Morente home"><img src="/logo-256.webp" width="52" height="52" alt="Mark Morente logo"><span>Mark Morente</span></a>
  <button class="burger" aria-expanded="false" aria-controls="nav" aria-label="Open menu"><span></span></button>
  <nav class="nav" id="nav" aria-label="Main"><ul>${items}</ul>
    <div class="nav__cta">${waBtn('Request a wholesale quote', 'I would like a wholesale quote.', 'menu')}</div>
  </nav>
  <div class="header__cta">${waBtn('Get a quote', 'I would like a wholesale quote.', 'header', 'btn--sm')}</div>
</div></header>`;
}

function footer(categories) {
  return `<footer class="footer"><div class="wrap">
  <div class="footer__grid">
    <div class="footer__brand"><img src="/logo-256.webp" width="64" height="64" alt="" loading="lazy"><p>Men's suit and tuxedo manufacturer in Istanbul, Turkey. Wholesale, private label and OEM production for businesses worldwide.</p>
    <div class="btn-row">${waBtn('WhatsApp', 'I would like a wholesale quote.', 'footer', 'btn--sm')}${tgBtn('Telegram', 'btn--ghost btn--sm')}</div></div>
    <div><h2>Manufacturing</h2><ul>${categories.map((c) => `<li><a href="/mens-suit-manufacturing/${c.slug}">${esc(c.short)}</a></li>`).join('')}<li><a href="/collections">All collections</a></li></ul></div>
    <div><h2>Buying</h2><ul><li><a href="/wholesale-suits">Wholesale (stock lots)</a></li><li><a href="/private-label-suits">Private label</a></li><li><a href="/oem-suit-manufacturing">OEM production</a></li><li><a href="/how-to-order">How to order</a></li><li><a href="/fabrics">Fabrics</a></li><li><a href="/size-guide">Size guide</a></li><li><a href="/shipping">Shipping</a></li><li><a href="/faq">FAQ</a></li></ul></div>
    <div><h2>Company</h2><ul><li><a href="/about-us">About us</a></li><li><a href="/markets">Markets</a></li><li><a href="/guides">Guides</a></li><li><a href="/contact">Contact</a></li><li><a href="${site.instagram}" rel="noopener">Instagram ${site.instagramHandle}</a></li><li><a href="${site.telegram}" rel="noopener">Telegram ${site.telegramHandle}</a></li></ul></div>
  </div>
  <div class="footer__bottom"><span>© ${new Date().getFullYear()} Mark Morente · Istanbul, Turkey · Est. ${site.founded}</span><span>Business buyers only. We don't sell single suits.</span></div>
</div></footer>
<a class="fab" href="${esc(waLink('I would like a wholesale quote.'))}" target="_blank" rel="noopener" data-wa="fab">${icon.wa}<span>WhatsApp</span></a>
<div class="mbar">${tgBtn('Telegram', 'btn--ghost')}<a class="btn btn--ghost" href="${site.instagram}" rel="noopener">${icon.ig}<span>Insta</span></a>${waBtn('WhatsApp quote', 'I would like a wholesale quote.', 'mbar')}</div>`;
}

/** Full page. p: { path, title, description, body, schema[], og, ogType, noindex, v, categories, md } */
export function layout(p) {
  const url = site.url + (p.path === '/' ? '' : p.path);
  const fullTitle = p.path === '/' || `${p.title} | Mark Morente`.length > 62 ? p.title : `${p.title} | Mark Morente`;
  const og = p.og ? site.url + p.og : `${site.url}/og-image.jpg`;
  const mdHref = p.path === '/' ? '/index.md' : `${p.path}.md`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(p.description)}">
<link rel="canonical" href="${url}">
${p.noindex ? '<meta name="robots" content="noindex, follow">' : '<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">'}
${p.md !== false ? `<link rel="alternate" type="text/markdown" href="${mdHref}">` : ''}
<meta name="theme-color" content="#16140F">
<meta property="og:locale" content="en_US">
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
<link rel="preload" href="/fonts/cormorant-garamond-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/inter-400-650-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/site.css?v=${p.v}">
${(p.schema || []).filter(Boolean).map((s) => `<script type="application/ld+json">${JSON.stringify(s).replace(/</g, '\\u003c')}</script>`).join('\n')}
</head>
<body>
${header(p.path)}
<main id="main">
${p.body}
</main>
${footer(p.categories)}
<script src="/assets/site.js?v=${p.v}" defer></script>
</body>
</html>`;
}

export const crumbs = (items) => `<nav class="crumbs wrap" aria-label="Breadcrumb"><ol>${items.map(([h, l], i) => `<li>${i < items.length - 1 ? `<a href="${h}">${esc(l)}</a>` : `<span aria-current="page">${esc(l)}</span>`}</li>`).join('')}</ol></nav>`;
export const faqBlock = (list) => `<div class="faq">${list.map((f) => `<details><summary>${esc(f.q)}</summary><div><p>${esc(f.a)}</p></div></details>`).join('')}</div>`;
export const b2bNotice = () => `<div class="notice"><span aria-hidden="true">◆</span><p class="mt0" style="margin:0"><strong>Wholesale only.</strong> We supply businesses: the smallest order is one stock lot (6–7 suits in a size run) or 100 units per style for production under your label. We don't sell single suits.</p></div>`;
