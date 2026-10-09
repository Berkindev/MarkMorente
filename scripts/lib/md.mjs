// Minimal, dependency-free Markdown for our content files (see content/BRIEF.md "Format").
// Supports: front matter, ## / ### headings, paragraphs, - / 1. lists, **bold**, *italic*, [links](url), pipe tables.
// Returns html, plain markdown body, FAQ items (from the "## FAQ" section) and a TOC of H2s.
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
export const slugify = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);

function inline(s) {
  let out = esc(s);
  out = out.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  out = out.replace(/(^|[^*])\*([^*\s][^*]*?)\*(?!\*)/g, '$1<em>$2</em>');
  out = out.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, t, u) => {
    const ext = /^https?:\/\//.test(u);
    return `<a href="${u}"${ext ? ' rel="noopener" target="_blank"' : ''}>${t}</a>`;
  });
  return out;
}
const plain = (s) => s.replace(/\*\*(.+?)\*\*/g, '$1').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/\*/g, '');

function parseFrontMatter(src) {
  const m = src.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!m) return { data: {}, body: src };
  const data = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
    if (!kv) continue;
    let v = kv[2].trim().replace(/\s+#.*$/, '');
    if (/^\[.*\]$/.test(v)) v = v.slice(1, -1).split(',').map((x) => x.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean);
    else v = v.replace(/^['"]|['"]$/g, '');
    data[kv[1]] = v;
  }
  return { data, body: src.slice(m[0].length) };
}

export function renderMarkdown(body) {
  const lines = body.replace(/\r/g, '').split('\n');
  const html = []; const toc = []; const faq = [];
  let i = 0; let inFaq = false; let cur = null;
  const flushPara = (buf) => { if (buf.length) { const t = buf.join(' ').trim(); html.push(`<p>${inline(t)}</p>`); if (cur) cur.a.push(plain(t)); } };
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }
    let h;
    if ((h = line.match(/^##\s+(.+)$/)) && !line.startsWith('###')) {
      const text = h[1].trim(); const id = slugify(text);
      inFaq = /^(faq|frequently asked questions)/i.test(text);
      cur = null;
      toc.push({ id, text: plain(text) });
      html.push(`<h2 id="${id}">${inline(text)}</h2>`); i++; continue;
    }
    if ((h = line.match(/^###\s+(.+)$/))) {
      const text = h[1].trim();
      if (inFaq) { cur = { q: plain(text), a: [] }; faq.push(cur); }
      html.push(`<h3 id="${slugify(text)}">${inline(text)}</h3>`); i++; continue;
    }
    if (/^\|.*\|\s*$/.test(line)) {
      const rows = [];
      while (i < lines.length && /^\|.*\|\s*$/.test(lines[i])) { rows.push(lines[i]); i++; }
      const cells = (r) => r.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
      const head = cells(rows[0]); const bodyRows = rows.slice(1).filter((r) => !/^\|\s*:?-{2,}/.test(r)).map(cells);
      html.push(`<div class="table-wrap"><table><thead><tr>${head.map((c) => `<th scope="col">${inline(c)}</th>`).join('')}</tr></thead><tbody>${bodyRows.map((r) => `<tr>${r.map((c, j) => (j === 0 ? `<th scope="row">${inline(c)}</th>` : `<td>${inline(c)}</td>`)).join('')}</tr>`).join('')}</tbody></table></div>`);
      continue;
    }
    if (/^\s*[-*]\s+/.test(line) || /^\s*\d+[.)]\s+/.test(line)) {
      const ordered = /^\s*\d+[.)]\s+/.test(line); const items = [];
      while (i < lines.length && (ordered ? /^\s*\d+[.)]\s+/ : /^\s*[-*]\s+/).test(lines[i])) {
        let t = lines[i].replace(/^\s*(?:[-*]|\d+[.)])\s+/, ''); i++;
        while (i < lines.length && /^\s{2,}\S/.test(lines[i]) && !/^\s*(?:[-*]|\d+[.)])\s+/.test(lines[i])) { t += ' ' + lines[i].trim(); i++; }
        items.push(t);
      }
      html.push(`<${ordered ? 'ol' : 'ul'}>${items.map((t) => `<li>${inline(t)}</li>`).join('')}</${ordered ? 'ol' : 'ul'}>`);
      if (cur) cur.a.push(items.map(plain).join('; '));
      continue;
    }
    const buf = [];
    while (i < lines.length && lines[i].trim() && !/^#{2,3}\s|^\||^\s*(?:[-*]|\d+[.)])\s+/.test(lines[i])) { buf.push(lines[i]); i++; }
    flushPara(buf);
  }
  return { html: html.join('\n'), toc, faq: faq.map((f) => ({ q: f.q, a: f.a.join(' ') })) };
}

/** Split rendered HTML at the FAQ H2 so the FAQ can be rendered as an accordion separately. */
export function splitFaq(html) {
  const m = html.match(/<h2 id="(faq|frequently-asked-questions)[^"]*">/);
  return m ? { main: html.slice(0, m.index), faqHtml: html.slice(m.index) } : { main: html, faqHtml: '' };
}

export function loadDir(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((f) => f.endsWith('.md')).sort().map((f) => {
    const src = readFileSync(join(dir, f), 'utf8');
    const { data, body } = parseFrontMatter(src);
    const r = renderMarkdown(body);
    const words = body.replace(/[#*|\-[\]()]/g, ' ').split(/\s+/).filter(Boolean).length;
    return { file: f, slug: data.slug || f.replace(/\.md$/, ''), ...data, body, ...r, words };
  });
}
