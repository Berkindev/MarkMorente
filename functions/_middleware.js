// Cloudflare Pages middleware for www.markmorente.com
// 1) apex → www (canonical host), 2) *.pages.dev → noindex,
// 3) Markdown negotiation: `Accept: text/markdown` returns the page's .md twin (/path → /path.md, / → /index.md),
// 4) content types for agent files, Link header to the markdown alternate, cache for catalog images.

const HOST = 'www.markmorente.com';
// Images of models taken off the site (removed-products.json: all tuxedos/dinner jackets, 2026-10-15) → 410 Gone,
// so Google Images drops them quickly. The product pages themselves 301 (see _redirects in scripts/build.mjs).
const GONE = /^\/collections\/(T\d\d|165|238|312|366|378|403|404)\//;
const TYPES = [
  [/\.md$|^\/llms(-full)?\.txt$/, 'text/markdown; charset=utf-8'],
  [/^\/\.well-known\/api-catalog$/, 'application/linkset+json'],
  [/^\/\.well-known\/.*\.json$/, 'application/json'],
];

const mdPathFor = (path) => {
  if (path === '/' || path === '/index.html') return '/index.md';
  if (/\.[a-z0-9]+$/i.test(path)) return null;
  return `${path.replace(/\/+$/, '')}.md`;
};

async function handle(ctx) {
  const { request, env, next } = ctx;
  const url = new URL(request.url);
  const path = url.pathname;
  const accept = request.headers.get('accept') || '';

  if (request.method === 'GET' && /text\/markdown/i.test(accept) && !/text\/html/i.test(accept.split('text/markdown')[0])) {
    const md = mdPathFor(path);
    if (md) {
      const res = await env.ASSETS.fetch(new URL(md, url.origin));
      if (res.ok) {
        const body = await res.text();
        return new Response(body, {
          headers: {
            'Content-Type': 'text/markdown; charset=utf-8',
            Vary: 'Accept',
            'x-markdown-tokens': String(Math.ceil(body.length / 4)),
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'public, max-age=3600',
            Link: `<https://${HOST}${path === '/' ? '' : path}>; rel="canonical"`,
          },
        });
      }
    }
  }

  const res = await next();
  const type = TYPES.find(([re]) => re.test(path))?.[1];
  const isHtml = (res.headers.get('content-type') || '').includes('text/html');
  const isImg = /\.(webp|jpe?g|png)$/i.test(path);
  if (!type && !isHtml && !isImg) return res;

  const out = new Response(res.body, res);
  if (type) {
    out.headers.set('Content-Type', type);
    out.headers.set('Access-Control-Allow-Origin', '*');
  }
  if (isImg && res.ok) out.headers.set('Cache-Control', 'public, max-age=604800, stale-while-revalidate=2592000');
  if (isHtml) {
    out.headers.append('Vary', 'Accept');
    const md = mdPathFor(path);
    if (md && res.ok) out.headers.append('Link', `<${md}>; rel="alternate"; type="text/markdown"`);
  }
  return out;
}

export async function onRequest(ctx) {
  const u = new URL(ctx.request.url);
  if (u.hostname === 'markmorente.com') return Response.redirect(`https://${HOST}${u.pathname}${u.search}`, 301);
  if (GONE.test(u.pathname)) return new Response('Gone', { status: 410, headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=86400' } });
  const res = await handle(ctx);
  if (!u.hostname.endsWith('.pages.dev')) return res;
  const out = new Response(res.body, res);
  out.headers.set('X-Robots-Tag', 'noindex, nofollow');
  return out;
}
