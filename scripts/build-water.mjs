// Builds Civic Paper No. 01 from its template.
//   src/papers/water.html  ->  public/water/index.html
//   REGISTER               ->  public/water/lis-civic-paper-01-evidence.csv
// Run: npm run build   (then npm run pdf to refresh the PDF)
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { SOURCES, SRC, REGISTER, STATUS, VERSION, CHECKED } from '../public/assets/water/model.js';
import { value } from './water-values.mjs';

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const ROSE = `<svg class="sprite" aria-hidden="true"><defs><symbol id="rose" viewBox="0 0 100 100"><g id="petal"><path d="M50 48C35 39 25 29 30 19C34 11 44 13 50 20C56 13 66 11 70 19C75 29 65 39 50 48Z" fill="currentColor"/><path d="M48 39L50 27L52 39" stroke="#101616" stroke-width="1.2" fill="none"/></g><use href="#petal" transform="rotate(72 50 50)"/><use href="#petal" transform="rotate(144 50 50)"/><use href="#petal" transform="rotate(216 50 50)"/><use href="#petal" transform="rotate(288 50 50)"/><circle cx="50" cy="50" r="12" fill="#101616" stroke="currentColor" stroke-width="2"/><circle cx="50" cy="50" r="4" fill="#c8a775"/></symbol></defs></svg>`;

function figure1() {
  // A measuring glass: 0–160 litres per person per day.
  const top = 18, bot = 262, x0 = 52, x1 = 150, max = 160, y = v => bot - (v / max) * (bot - top);
  const line = (v, label, sub, col, dash) => `<line x1="${x0 - 8}" x2="${x1 + 14}" y1="${y(v)}" y2="${y(v)}" stroke="${col}" stroke-width="1" ${dash ? 'stroke-dasharray="4 3"' : ''}/><text x="${x1 + 22}" y="${y(v) + 4}" font-family="Arial, Liberation Sans, sans-serif" font-size="13.5" fill="#141a18"><tspan font-weight="700">${label}</tspan><tspan fill="#56615c"> ${sub}</tspan></text>`;
  let ticks = '';
  for (let v = 0; v <= 160; v += 20) ticks += `<line x1="${x0 - 6}" x2="${x0}" y1="${y(v)}" y2="${y(v)}" stroke="#56615c"/><text x="${x0 - 10}" y="${y(v) + 4}" text-anchor="end" font-family="Arial, Liberation Sans, sans-serif" font-size="12" fill="#56615c">${v}</text>`;
  return `<svg viewBox="0 0 480 290" width="100%" class="fig-glass" role="img" aria-label="A measuring glass marked from 0 to 160 litres. The proposed allowance fills it to 80 litres, inside the UN range of 50 to 100 litres and below average use of 136.9 litres.">
  <rect x="${x0}" y="${y(100)}" width="${x1 - x0}" height="${y(50) - y(100)}" fill="#dbe8ea"/>
  <rect x="${x0}" y="${y(80)}" width="${x1 - x0}" height="${bot - y(80)}" fill="#1f5f73"/>
  <path d="M${x0} ${top - 6} V${bot} H${x1} V${top - 6}" fill="none" stroke="#141a18" stroke-width="1.6"/>
  ${ticks}
  ${line(136.9, '136.9 L', 'average use, England', '#141a18', true)}
  ${line(100, '100 L', 'top of UN range', '#8a6a2f', true)}
  ${line(80, '80 L', 'proposed allowance', '#1f5f73', false)}
  ${line(50, '50 L', 'bottom of UN range', '#8a6a2f', true)}
  <text x="${(x0 + x1) / 2}" y="${y(40)}" text-anchor="middle" font-family="Georgia, Gelasio, serif" font-size="30" fill="#ffffff">80 L</text>
  <text x="${x0 - 38}" y="${(top + bot) / 2}" transform="rotate(-90 ${x0 - 38} ${(top + bot) / 2})" text-anchor="middle" font-family="Arial, Liberation Sans, sans-serif" font-size="12" fill="#56615c">litres per person per day</text>
</svg>`;
}

function register() {
  const rows = REGISTER.map(r => `<tr><td>${esc(r[0])}</td><td class="num"><b>${esc(r[1])}</b></td><td><span class="tag ${r[2]}">${STATUS[r[2]]}</span></td><td>${esc(r[3])}${r[4].length ? cite(r[4]) : ''}</td></tr>`).join('\n');
  return `<table><caption><b>Table B1.</b> Inputs to the model, with their status and source.</caption><thead><tr><th>Input</th><th>Value</th><th>Status</th><th>Basis</th></tr></thead><tbody>\n${rows}\n</tbody></table>`;
}

function sources() {
  return '<ol class="sources">' + SOURCES.map((s, i) => `<li id="src-${i + 1}"><b>${i + 1}</b><span>${esc(s[1])}. <a href="${esc(s[3])}">${esc(s[2])}</a>.<span class="url">${esc(s[3])}</span></span></li>`).join('') + '</ol>';
}

function cite(ids) {
  return '<sup>' + ids.map(id => {
    const n = SRC[id];
    if (!n) throw new Error('Unknown source id: ' + id);
    return `<a href="#src-${n}" aria-label="Source ${n}">[${n}]</a>`;
  }).join('') + '</sup>';
}

const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
let html = readFileSync('src/papers/water.html', 'utf8')
  .replaceAll('{{version}}', VERSION)
  .replaceAll('{{checked}}', CHECKED)
  .replaceAll('{{today}}', `<span data-today>${today}</span>`)
  .replace('{{rose}}', ROSE)
  .replace('{{figure1}}', figure1())
  .replace('{{register}}', register())
  .replace('{{sources}}', sources())
  .replace(/\{\{cite:([^}]+)\}\}/g, (_, ids) => cite(ids.split(',').map(x => x.trim())))
  .replace(/\{\{n:([^}]+)\}\}/g, (_, key) => `<span class="num" data-check="${key}">${value(key)}</span>`);

// Give every body cell its column heading, so tables can stack into cards on phones.
html = html.replace(/<table>([\s\S]*?)<\/table>/g, (whole, inner) => {
  const head = inner.match(/<thead>([\s\S]*?)<\/thead>/);
  if (!head) return whole;
  const labels = [...head[1].matchAll(/<th[^>]*>([\s\S]*?)<\/th>/g)].map(m => m[1].replace(/<[^>]+>/g, '').trim());
  const body = inner.replace(/<tr([^>]*)>([\s\S]*?)<\/tr>/g, (tr, attrs, cells) => {
    if (/<th/.test(cells)) return tr;
    let i = 0;
    return `<tr${attrs}>` + cells.replace(/<td(?![^>]*data-label)([^>]*)>/g, (_, a) => `<td data-label="${esc(labels[i++] || '')}"${a}>`) + '</tr>';
  });
  return `<table class="stack">${body}</table>`;
});

const left = html.match(/\{\{[^}]+\}\}/g);
if (left) throw new Error('Unfilled tokens: ' + left.join(', '));

mkdirSync('public/water', { recursive: true });
writeFileSync('public/water/index.html', html);

const csv = [['Input', 'Value', 'Status', 'Basis', 'Sources']]
  .concat(REGISTER.map(r => [r[0], r[1], STATUS[r[2]], r[3], r[4].map(id => `[${SRC[id]}] ${SOURCES[SRC[id] - 1][3]}`).join(' ')]))
  .map(row => row.map(c => '"' + String(c).replace(/"/g, '""') + '"').join(','))
  .join('\r\n');
writeFileSync('public/water/lis-civic-paper-01-evidence.csv', '﻿' + csv + '\r\n');

console.log('Built public/water/index.html and the evidence CSV.');
