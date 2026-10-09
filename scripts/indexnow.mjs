#!/usr/bin/env node
// Submit sitemap URLs to IndexNow (Bing, Yandex, Naver, Seznam...).
// Usage: node indexnow.mjs <host> <key> <sitemap.xml path or URL>
// Setup once: generate key (openssl rand -hex 16), serve it as https://<host>/<key>.txt containing the key.
import { readFileSync } from 'node:fs';
const [host, key, src] = process.argv.slice(2);
if (!host || !key || !src) { console.error('usage: indexnow.mjs <host> <key> <sitemap path|url>'); process.exit(2); }
const xml = src.startsWith('http') ? await (await fetch(src, { headers: { 'User-Agent': 'Mozilla/5.0 indexnow-submit' } })).text() : readFileSync(src, 'utf8');
const urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]).filter((u) => new URL(u).host === host);
const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host, key, keyLocation: `https://${host}/${key}.txt`, urlList }),
});
console.log(`IndexNow: ${urlList.length} URLs → HTTP ${res.status} (200/202 = accepted)`);
