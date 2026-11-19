/* The Leeds Water Guarantee: interactive model page. Uses the same module as the paper. */
import { compute, issues, PRESETS, FUNDERS, SCOPES, D, fmt, toQuery, fromQuery, VERSION, CHECKED } from './model.js';

const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const SVGNS = 'http://www.w3.org/2000/svg';

function read() {
  return {
    litres: +$('litres').value, scope: document.querySelector('input[name=scope]:checked').value, standing: $('standing').checked,
    year: +$('year').value, growth: +$('growth').value, admin: +$('admin').value,
    w: { rise: +$('f-rise').value, co: +$('f-co').value, ex: +$('f-ex').value, loc: +$('f-loc').value }
  };
}
function write(s) {
  $('litres').value = s.litres; document.querySelector(`input[name=scope][value=${s.scope}]`).checked = true;
  $('standing').checked = s.standing; $('year').value = s.year; $('growth').value = s.growth; $('admin').value = s.admin;
  $('f-rise').value = s.w.rise; $('f-co').value = s.w.co; $('f-ex').value = s.w.ex; $('f-loc').value = s.w.loc;
}
function samePreset(s) {
  for (const [k, p] of Object.entries(PRESETS)) if (toQuery(p) === toQuery(s)) return k;
  return null;
}

function el(tag, attrs, parent) {
  const e = document.createElementNS(SVGNS, tag);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  if (parent) parent.appendChild(e);
  return e;
}

function tank(L) {
  const svg = $('tank'); svg.replaceChildren();
  const top = 14, bot = 266, x0 = 8, x1 = 92, max = 160, y = v => bot - (v / max) * (bot - top);
  el('rect', { x: x0, y: y(100), width: x1 - x0, height: y(50) - y(100), fill: '#dbe8ea' }, svg);
  el('rect', { x: x0, y: y(Math.min(L, max)), width: x1 - x0, height: bot - y(Math.min(L, max)), fill: '#1f5f73' }, svg);
  el('path', { d: `M${x0} ${top - 4} V${bot} H${x1} V${top - 4}`, fill: 'none', stroke: '#141a18', 'stroke-width': 1.4 }, svg);
  [[136.9, '137 avg'], [100, 'UN 100'], [50, 'UN 50']].forEach(([v, t]) => {
    el('line', { x1: x0, x2: x1 + 4, y1: y(v), y2: y(v), stroke: v > 100 ? '#141a18' : '#8a6a2f', 'stroke-dasharray': '3 3' }, svg);
    const tx = el('text', { x: x1 + 7, y: y(v) + 3.5, 'font-size': 9.5, 'font-family': 'Arial, Liberation Sans, sans-serif', fill: '#56615c' }, svg); tx.textContent = t;
  });
  const lab = el('text', { x: (x0 + x1) / 2, y: Math.min(bot - 10, y(L) + 26), 'text-anchor': 'middle', 'font-size': 22, 'font-family': 'Georgia, Gelasio, serif', fill: L >= 18 ? '#ffffff' : '#141a18' }, svg);
  lab.textContent = L + ' L';
}

function spark(s) {
  const svg = $('spark'); svg.replaceChildren();
  const ys = []; for (let y = 2026; y <= 2035; y++) ys.push(compute(s, y).total);
  const mx = Math.max(...ys) * 1.15 || 1, W = 600, H = 110, px = i => 10 + i * (W - 20) / 9, py = v => H - 12 - (v / mx) * (H - 24);
  for (let i = 0; i < 10; i++) el('line', { x1: px(i), x2: px(i), y1: 8, y2: H - 12, stroke: '#e3e3da' }, svg);
  const pts = ys.map((v, i) => px(i) + ',' + py(v)).join(' ');
  el('polygon', { points: `${px(0)},${H - 12} ${pts} ${px(9)},${H - 12}`, fill: '#1f5f73', 'fill-opacity': .12 }, svg);
  el('polyline', { points: pts, fill: 'none', stroke: '#1f5f73', 'stroke-width': 2, 'vector-effect': 'non-scaling-stroke' }, svg);
  const ci = s.year - 2026; el('circle', { cx: px(ci), cy: py(ys[ci]), r: 4.5, fill: '#8a6a2f' }, svg);
  $('spark-note').textContent = `${fmt.ty(2026)}: ${fmt.m(ys[0])}. ${fmt.ty(2035)}: ${fmt.m(ys[9])}. Ten-year total: ${fmt.m(ys.reduce((a, b) => a + b, 0))}. The gold point marks the tariff year selected.`;
}

function render(push) {
  const s = read(), r = compute(s);
  $('o-litres').textContent = s.litres + ' L'; $('o-year').textContent = fmt.ty(s.year);
  $('o-growth').textContent = s.growth.toFixed(1) + '%'; $('o-admin').textContent = s.admin + '%';
  FUNDERS.forEach(([k]) => { $('o-' + k).textContent = fmt.pct0(r.n[k]); });
  $('cost-label').textContent = 'Annual cost, ' + fmt.ty(s.year);
  $('cost').textContent = fmt.m(r.total);
  $('cost-sub').textContent = `${s.litres} litres per person per day, free, for ${SCOPES[s.scope]}${s.standing ? ', with standing charges covered' : ''}.`;
  $('st-hh').textContent = fmt.int(r.households);
  $('st-val').textContent = fmt.gbp(r.perHousehold);
  $('st-share').textContent = fmt.pct(r.shareOfBills);
  $('st-gap').textContent = Math.min(999, Math.round(r.gapClosed * 100)) + '%';

  const bar = $('fund-bar'); bar.replaceChildren();
  FUNDERS.forEach(([k, , c]) => { const i = document.createElement('i'); i.style.width = (r.n[k] * 100) + '%'; i.style.background = c; bar.appendChild(i); });
  const meaning = {
    rise: () => r.aboveM3 === 0 ? 'No use above the allowance to charge.' : `+${fmt.ppm3(r.surcharge)} per m³ above the allowance (+${fmt.pct0(r.surchargePct)} on £${r.rate.toFixed(2)}). Average use is ${r.aboveM3.toFixed(1)} m³ per person a year above it.`,
    co: () => `${r.coMultiple.toFixed(1)}× Yorkshire Water’s current £2.5m social-tariff contribution across its whole region.`,
    ex: () => `A national decision: about ${fmt.gbp(r.exPerHousehold)} for each Leeds household, from general taxation.`,
    loc: () => `${fmt.gbp(r.localPerHousehold)} per Leeds household a year if raised through council tax.`
  };
  $('fund-list').innerHTML = FUNDERS.filter(([k]) => r.n[k] > 0).map(([k, l]) =>
    `<div class="fitem"><span><i class="sw ${k}"></i>${esc(l)}</span><b class="num">${fmt.m(r.byFunder[k])}</b><small>${esc(meaning[k]())}</small></div>`).join('') || '<p class="note">No funder selected.</p>';

  const g = issues(s, r), c = { crit: 0, warn: 0, gap: 0, info: 0 }; g.forEach(x => c[x[0]]++);
  const lab = { crit: 'Blocking', warn: 'Needs a decision', gap: 'Unknown', info: 'Trade-off' }, order = { crit: 0, warn: 1, gap: 2, info: 3 };
  $('counts').innerHTML = Object.keys(c).filter(k => c[k]).map(k => `<span class="pill ${k}">${c[k]} ${lab[k]}</span>`).join('');
  $('issues').innerHTML = g.slice().sort((a, b) => order[a[0]] - order[b[0]]).map(x => `<li class="${x[0]}"><b>${esc(x[1])}</b> <span>${esc(x[2])}</span></li>`).join('');

  tank(s.litres); spark(s);
  const p = samePreset(s);
  document.querySelectorAll('[data-preset]').forEach(b => b.setAttribute('aria-pressed', b.dataset.preset === p ? 'true' : 'false'));
  const q = p ? '?p=' + p : toQuery(s);
  const url = location.origin + location.pathname + q;
  $('share-url').value = url;
  if (push !== false) history.replaceState(null, '', q);
}

document.querySelectorAll('[data-preset]').forEach(b => b.addEventListener('click', () => { write(PRESETS[b.dataset.preset]); render(); }));
$('controls').addEventListener('input', () => render());
$('controls').addEventListener('submit', e => e.preventDefault());
$('copy-link').addEventListener('click', () => {
  const u = $('share-url');
  const ok = () => { $('share-note').textContent = 'Link copied. It reopens the model with exactly these settings.'; };
  if (navigator.clipboard) navigator.clipboard.writeText(u.value).then(ok, () => u.select()); else u.select();
});
$('ver').textContent = VERSION; $('checked').textContent = CHECKED;

const initial = fromQuery(location.search) || PRESETS.a;
write(initial); render(false);
