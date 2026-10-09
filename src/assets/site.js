// Mark Morente: menu, reveal, product gallery, contact click events, WebMCP tools.
(() => {
  const burger = document.querySelector('.burger');
  const nav = document.getElementById('nav');
  if (burger && nav) {
    const set = (open) => {
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      nav.classList.toggle('is-open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    };
    burger.addEventListener('click', () => set(burger.getAttribute('aria-expanded') !== 'true'));
    nav.addEventListener('click', (e) => { if (e.target.closest('a')) set(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') set(false); });
  }

  const els = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((en) => en.forEach((x) => { if (x.isIntersecting) { x.target.classList.add('is-in'); io.unobserve(x.target); } }), { rootMargin: '0px 0px -8% 0px' });
    els.forEach((el) => io.observe(el));
  } else els.forEach((el) => el.classList.add('is-in'));

  // Product gallery
  const main = document.querySelector('.gallery__main img');
  document.querySelectorAll('.gallery__thumbs button').forEach((b) => b.addEventListener('click', () => {
    main.src = b.dataset.src; main.removeAttribute('srcset');
    document.querySelectorAll('.gallery__thumbs button').forEach((x) => x.setAttribute('aria-current', String(x === b)));
  }));

  // Contact click events (Cloudflare Zaraz / GA if present)
  document.addEventListener('click', (e) => {
    const a = e.target.closest('[data-wa]');
    if (!a) return;
    const d = { channel: a.href.includes('t.me') ? 'telegram' : 'whatsapp', placement: a.dataset.wa, page: location.pathname };
    try { window.zaraz?.track?.('contact_click', d); } catch {}
    try { window.gtag?.('event', 'contact_click', d); } catch {}
  });

  // WebMCP: expose catalog search + quote link to in-browser AI agents (where supported)
  const mc = navigator.modelContext || document.modelContext;
  if (mc?.registerTool) {
    let cat;
    const load = async () => (cat ??= await (await fetch('/api/catalog.json')).json());
    const norm = (s) => String(s || '').toLowerCase();
    try {
      mc.registerTool({
        name: 'search_suits',
        description: 'Search Mark Morente wholesale suit and tuxedo models (B2B, sold in lots or made to order).',
        inputSchema: { type: 'object', properties: { query: { type: 'string' }, in_stock_only: { type: 'boolean' } }, required: ['query'] },
        async execute({ query, in_stock_only }) {
          const c = await load(); const q = norm(query);
          const hits = c.products.filter((p) => (!in_stock_only || p.status === 'In Stock') && norm([p.title, p.model, p.color, p.fabric, p.lapel, p.code].join(' ')).includes(q)).slice(0, 12);
          return { content: [{ type: 'text', text: JSON.stringify(hits.map(({ code, title, status, url, quoteUrl }) => ({ code, title, status, url, quoteUrl }))) }] };
        },
      });
      mc.registerTool({
        name: 'request_wholesale_quote',
        description: 'Create a WhatsApp link with a wholesale quote request. The user sends it themselves.',
        inputSchema: { type: 'object', properties: { company: { type: 'string' }, country: { type: 'string' }, models: { type: 'string' }, quantity: { type: 'string' }, private_label: { type: 'boolean' } }, required: ['models', 'quantity'] },
        async execute({ company, country, models, quantity, private_label }) {
          const t = `Hello Mark Morente, I'm contacting you from your website. ${company ? `Company: ${company}. ` : ''}${country ? `Country: ${country}. ` : ''}I'd like a wholesale quote for ${models}, quantity ${quantity}${private_label ? ', made under my own label' : ''}.`;
          return { content: [{ type: 'text', text: `https://wa.me/905321711494?text=${encodeURIComponent(t)}` }] };
        },
      });
    } catch {}
  }
})();
