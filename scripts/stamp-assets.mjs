// Adds a content fingerprint to every stylesheet and script link (?v=…), so a changed
// file reaches visitors at once instead of waiting for their browser cache to expire.
// Run by `npm run build`.
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';

const files = [];
const walk = d => readdirSync(d).forEach(f => { const p = join(d, f); statSync(p).isDirectory() ? walk(p) : p.endsWith('.html') && files.push(p); });
walk('public'); walk('src');

const hash = {};
const fp = path => hash[path] ??= createHash('sha1').update(readFileSync(join('public', path))).digest('hex').slice(0, 10);

let changed = 0;
for (const f of files) {
  const before = readFileSync(f, 'utf8');
  const after = before.replace(/(["'])(\/assets\/[^"'?]+\.(?:css|js))(?:\?v=[a-f0-9]+)?\1/g, (_, q, path) => `${q}${path}?v=${fp(path.slice(1))}${q}`);
  if (after !== before) { writeFileSync(f, after); changed++; }
}
console.log(`Asset fingerprints checked in ${files.length} pages (${changed} updated).`);
