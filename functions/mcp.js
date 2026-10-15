// Minimal MCP server (Streamable HTTP, JSON-RPC 2.0, stateless, read-only, no auth) over /api/catalog.json.
const PROTOCOL = '2025-06-18';
const PHONE = '905321711494';
const norm = (s = '') => String(s).toLowerCase();
const text = (obj) => ({ content: [{ type: 'text', text: typeof obj === 'string' ? obj : JSON.stringify(obj, null, 2) }] });
const waUrl = (msg) => `https://wa.me/${PHONE}?text=${encodeURIComponent(`Hello Mark Morente, I'm contacting you from your website. ${msg}`)}`;

const TOOLS = [
  { name: 'search_models', description: 'Search Mark Morente wholesale men\'s suit models (B2B only). Matches title, type, colour, fabric, lapel or code, e.g. "navy three piece", "pinstripe double-breasted", "S05".',
    inputSchema: { type: 'object', properties: { query: { type: 'string' }, in_stock_only: { type: 'boolean' }, category: { type: 'string', description: '3-piece-suits, 2-piece-suits, wedding-suits, big-tall-suits' } }, required: ['query'] }, annotations: { readOnlyHint: true } },
  { name: 'get_model', description: 'Full details of one model by code (e.g. "S05").', inputSchema: { type: 'object', properties: { code: { type: 'string' } }, required: ['code'] }, annotations: { readOnlyHint: true } },
  { name: 'get_ordering_terms', description: 'How to buy: stock lots, private label MOQ, lead time, markets and contact channels.', inputSchema: { type: 'object', properties: {} }, annotations: { readOnlyHint: true } },
  { name: 'create_quote_link', description: 'Create a WhatsApp link with a prefilled wholesale quote request. The user sends it themselves. Business buyers only.',
    inputSchema: { type: 'object', properties: { models: { type: 'string', description: 'Model codes or description' }, quantity: { type: 'string', description: 'e.g. "3 lots" or "300 units"' }, private_label: { type: 'boolean' }, company: { type: 'string' }, country: { type: 'string' }, note: { type: 'string' } }, required: ['models', 'quantity'] }, annotations: { readOnlyHint: true } },
];

async function call(name, a, c) {
  switch (name) {
    case 'search_models': {
      const words = norm(a.query).split(/\s+/).filter(Boolean);
      const cat = a.category ? c.categories.find((x) => x.slug === a.category) : null;
      const hits = c.products
        .filter((p) => !a.in_stock_only || p.status === 'In Stock')
        .filter((p) => !cat || (p.categories || []).includes(cat.slug))
        .filter((p) => { const h = norm([p.code, p.title, p.model, p.color, p.fabric, p.lapel, p.fit].join(' ')); return words.every((w) => h.includes(w)); })
        .slice(0, 15).map(({ code, title, model, status, lot, url, quoteUrl }) => ({ code, title, model, status, lot, url, quoteUrl }));
      return text(hits.length ? hits : 'No match. Try a colour, fabric or type (three piece, double-breasted, pinstripe, safari, navy).');
    }
    case 'get_model': {
      const p = c.products.find((x) => norm(x.code) === norm(a.code));
      return p ? text(p) : { ...text(`Model not found: ${a.code}`), isError: true };
    }
    case 'get_ordering_terms': return text({ company: c.company, ordering: c.ordering, categories: c.categories });
    case 'create_quote_link': {
      const msg = `${a.company ? `Company: ${a.company}. ` : ''}${a.country ? `Country: ${a.country}. ` : ''}I'd like a wholesale quote for ${a.models}, quantity ${a.quantity}${a.private_label ? ', produced under my own label' : ''}.${a.note ? ` ${a.note}` : ''}`;
      return text({ whatsappUrl: waUrl(msg), message: msg });
    }
    default: return null;
  }
}

const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });

export async function onRequest({ request, env }) {
  if (request.method === 'OPTIONS') return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, GET, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Accept, Mcp-Session-Id, Mcp-Protocol-Version' } });
  if (request.method === 'GET') return json({ name: 'mark-morente', transport: 'streamable-http', info: 'POST JSON-RPC 2.0 requests. Card: /.well-known/mcp/server-card.json' });
  if (request.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });
  let msg;
  try { msg = await request.json(); } catch { return json({ jsonrpc: '2.0', id: null, error: { code: -32700, message: 'Parse error' } }, 400); }
  const batch = Array.isArray(msg) ? msg : [msg];
  const catalog = await (await env.ASSETS.fetch(new URL('/api/catalog.json', request.url))).json();
  const out = [];
  for (const m of batch) {
    if (m.id === undefined) continue;
    const reply = (result) => out.push({ jsonrpc: '2.0', id: m.id, result });
    const fail = (code, message) => out.push({ jsonrpc: '2.0', id: m.id, error: { code, message } });
    switch (m.method) {
      case 'initialize':
        reply({ protocolVersion: m.params?.protocolVersion || PROTOCOL, capabilities: { tools: { listChanged: false } }, serverInfo: { name: 'mark-morente', title: 'Mark Morente wholesale suit catalog', version: '1.0.0' }, instructions: 'Wholesale (B2B) men\'s suit and tuxedo manufacturer in Istanbul. Stock lots of 6-7 suits per model or private label from 100 units per style. Prices are quoted per order; use create_quote_link. Single suits are not sold.' });
        break;
      case 'ping': reply({}); break;
      case 'tools/list': reply({ tools: TOOLS }); break;
      case 'tools/call': { const r = await call(m.params?.name, m.params?.arguments || {}, catalog); r ? reply(r) : fail(-32602, `Unknown tool: ${m.params?.name}`); break; }
      default: fail(-32601, `Method not found: ${m.method}`);
    }
  }
  if (!out.length) return new Response(null, { status: 202, headers: { 'Access-Control-Allow-Origin': '*' } });
  return json(Array.isArray(msg) ? out : out[0]);
}
