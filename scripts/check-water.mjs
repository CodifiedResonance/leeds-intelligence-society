// Checks every figure marked data-check="…" in the built water paper against the model.
// Run: npm run check   (exits 1 on any mismatch)
import { readFileSync } from 'node:fs';
import { value } from './water-values.mjs';

let bad = 0, n = 0;
for (const file of ['public/water/index.html']) {
  const html = readFileSync(file, 'utf8');
  for (const m of html.matchAll(/data-check="([^"]+)"[^>]*>([^<]*)</g)) {
    n++;
    const want = value(m[1]);
    if (m[2].trim() !== want) { bad++; console.error(`✗ ${file}: ${m[1]} shows "${m[2].trim()}", model gives "${want}"`); }
  }
}
console.log(bad ? `${bad} of ${n} figures do not match the model.` : `All ${n} checked figures match the model.`);
process.exit(bad ? 1 : 0);
