// Languages: UI strings in src/i18n/<code>.json (English fallback), catalog text in src/i18n/catalog/<code>.json,
// page content in content/i18n/<code>/{pages,markets}/*.md. English lives at the root, others under /<code>.
import { readFileSync, existsSync } from 'node:fs';

export const LANGS = ['en', 'ar', 'ru', 'fr', 'de', 'es', 'tr'];
const read = (f) => (existsSync(f) ? JSON.parse(readFileSync(f, 'utf8')) : null);
const EN = read('src/i18n/en.json');

export function makeLang(code) {
  const own = code === 'en' ? EN : read(`src/i18n/${code}.json`);
  if (!own) return null;
  const S = { ...EN, ...own };
  const meta = { ...EN._meta, ...own._meta };
  const cat = read(`src/i18n/catalog/${code}.json`) || {};
  if (code !== 'en' && !cat.products) return null; // a language goes live only with UI strings + catalog
  const values = cat.values || {};
  const t = (key, vars = {}) => {
    const s = S[key] ?? EN[key];
    if (s == null) throw new Error(`i18n: missing key "${key}"`);
    return String(s).replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));
  };
  const P = (path) => (code === 'en' ? path : path === '/' ? `/${code}` : `/${code}${path}`);
  const v = (x) => (x && values[x]) || x; // translate a catalog value (fabric, lapel, colour...)
  const prod = (p) => {
    const tr = cat.products?.[p.code] || {};
    return {
      title: tr.title || p.title,
      content: tr.content || p.content,
      features: tr.features || (p.description?.features || []).map(v),
      model: v(p.model), fit: v(p.fit), lapel: v(p.lapel), fabric: v(p.fabric), color: v(p.color),
      lining: v((p.lining || '').replace(/^%100/, '100%')),
    };
  };
  return { code, name: meta.name, locale: meta.locale, dir: meta.dir || 'ltr', t, P, v, prod, translated: code === 'en' || !!cat.products };
}
