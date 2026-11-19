import { compute, PRESETS, fmt, D } from '../public/assets/water/model.js';

export const scenarios = {
  ...PRESETS,
  u80: { ...PRESETS.a, scope: 'all', w: { rise: 100, co: 0, ex: 0, loc: 0 } }
};

export function value(key) {
  // forms: a.total | a@2030.total | a.tenyear | city.allBills | city.poverty | city.atRisk | city.hhSize
  if (key.startsWith('city.')) {
    const k = key.slice(5);
    if (k === 'allBills') return fmt.m(D.households * D.averageBill);
    if (k === 'poverty') return fmt.int(D.households * D.povertyRate);
    if (k === 'atRisk') return fmt.int(D.households * D.atRiskRate);
    if (k === 'hhSize') return (D.residents / D.households).toFixed(2);
    if (k === 'rate') return '£' + (D.waterPerM3 + D.sewerShare * D.sewerPerM3).toFixed(4);
    throw new Error('Unknown city key ' + key);
  }
  const [head, field] = key.split('.');
  const [name, yr] = head.split('@');
  const s = scenarios[name];
  if (!s) throw new Error('Unknown scenario ' + name);
  if (field === 'tenyear') { let t = 0; for (let y = 2026; y <= 2035; y++) t += compute(s, y).total; return fmt.m(t); }
  const r = compute(s, yr ? +yr : undefined);
  const map = {
    total: () => fmt.m(r.total), households: () => fmt.int(r.households), perHousehold: () => fmt.gbp(r.perHousehold),
    perPerson: () => fmt.gbp(r.perPerson), m3: () => r.m3PerPerson.toFixed(1),
    shareOfBills: () => fmt.pct(r.shareOfBills), gapClosed: () => fmt.pct0(r.gapClosed),
    surcharge: () => fmt.ppm3(r.surcharge), surchargePct: () => fmt.pct0(r.surchargePct),
    rise: () => fmt.m(r.byFunder.rise), co: () => fmt.m(r.byFunder.co), ex: () => fmt.m(r.byFunder.ex), loc: () => fmt.m(r.byFunder.loc),
    coMultiple: () => r.coMultiple.toFixed(1) + '×'
  };
  if (!map[field]) throw new Error('Unknown field ' + key);
  return map[field]();
}

