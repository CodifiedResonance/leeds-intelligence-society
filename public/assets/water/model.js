/*
  Leeds Water Guarantee: the model behind Civic Paper No. 01.
  One source of truth for the paper (/water/), the model page (/water/model/)
  and the check script (scripts/check-water.mjs). Plain ES module, no dependencies.
*/

export const VERSION = '0.9';
export const CHECKED = '19 November 2026';

/* Published and derived inputs. Every value is listed in REGISTER with its source. */
export const D = {
  households: 341466,      // Leeds, Census 2021
  residents: 811956,       // Leeds, Census 2021
  waterPerM3: 2.1838,      // Yorkshire Water metered water, 2026/27
  sewerPerM3: 2.9761,      // Yorkshire Water metered sewerage, 2026/27
  sewerShare: 0.95,        // sewerage charged on 95% of water supplied
  standingWater: 54.10,    // £ a year
  standingSewer: 33.85,    // £ a year
  averageBill: 636,        // Yorkshire Water region average, 2026/27
  averageUse: 136.9,       // litres per person per day, England 2025/26
  povertyRate: 0.068,      // households spending >5% of income after housing costs
  atRiskRate: 0.15,        // households spending >3%
  medianGap: 337,          // £ a year above the 5% threshold, 2024/25
  companyContribution: 2.5e6 // Yorkshire Water social-tariff contribution, 2026/27, region-wide
};

export const SOURCES = [
  ['cl-own', 'House of Commons Library', 'Ownership of the water sector (CBP-12194)', 'https://commonslibrary.parliament.uk/research-briefings/cbp-12194/'],
  ['yw-meter', 'Yorkshire Water', 'Customers with a meter: 2026/27 rates and standing charges', 'https://www.yorkshirewater.com/bill-account/how-we-work-out-your-bill/customers-with-a-meter/'],
  ['yw-scheme', 'Yorkshire Water', 'Household charges scheme 2026/27', 'https://www.yorkshirewater.com/media/bjcdy5ih/48694_yw_charges-scheme-book_26-27_accessible_aw.pdf'],
  ['ccw-debt', 'Consumer Council for Water', 'Dealing with debt and getting help', 'https://www.ccw.org.uk/save-money-and-water/help-with-bills/dealing-with-debt/'],
  ['un', 'United Nations', 'The human right to water and sanitation', 'https://www.un.org/waterforlifedecade/human_right_to_water.shtml'],
  ['ea', 'Environment Agency', 'Water resources 2025 to 2026: analysis of the water industry’s performance', 'https://www.gov.uk/government/publications/water-resources-2025-2026-analysis-of-the-water-industrys-annual-water-resources-performance/water-resources-2025-to-2026-analysis-of-the-water-industrys-annual-water-resources-performance'],
  ['census', 'Office for National Statistics', 'How the population changed in Leeds: Census 2021', 'https://www.ons.gov.uk/visualisations/censuspopulationchange/E08000035'],
  ['shma', 'Leeds City Council', 'Strategic Housing Market Assessment 2025', 'https://www.leeds.gov.uk/sites/default/files/2025-05/leeds%20strategic%20housing%20market%20assessment%202025.pdf'],
  ['wateruk', 'Water UK', 'Average household water bills 2026/27', 'https://www.water.org.uk/news-views-publications/news/record-investment-average-household-water-bills-rise-ps33-year-april'],
  ['ccw-poverty', 'Consumer Council for Water', 'Analysis of water poverty, 2024/25', 'https://www.ccw.org.uk/publication/analysis-of-water-poverty/'],
  ['yw-assure', 'Yorkshire Water', 'Charges scheme board assurance statement 2026/27', 'https://www.yorkshirewater.com/media/dlvnj4id/48694_yw_charges-scheme-board-assurance-statement_26-27_accessible_aw.pdf'],
  ['tariffs', 'Water Magazine', '380,000 more households rely on water social tariffs, 5 November 2026', 'https://www.watermagazine.co.uk/2026/11/05/380000-more-households-rely-on-water-social-tariffs-as-bill-pressures-grow/'],
  ['mse', 'MoneySavingExpert', 'Water bills reform: no national social tariff, January 2026', 'https://www.moneysavingexpert.com/news/2026/01/water-bills-reform-government-martin-lewis'],
  ['cl-white', 'House of Commons Library', 'Water reform: a new vision for water (CBP-10998)', 'https://commonslibrary.parliament.uk/research-briefings/cbp-10998'],
  ['defra-sep', 'Defra and the Prime Minister', 'Pathway to stronger public control of the water industry revealed, 29 September 2026', 'https://www.gov.uk/government/news/pathway-to-stronger-public-control-of-the-water-industry-revealed'],
  ['defra-nov', 'Defra', 'Communities to get a stronger say over billions of pounds of water investment, 5 November 2026', 'https://www.gov.uk/government/news/communities-to-get-a-stronger-say-over-billions-of-pounds-of-water-investment'],
  ['eagle', 'Alliance News via Morningstar', 'UK government signals end to “business as usual” for water firms, 24 October 2026', 'https://www.morningstar.com/news/alliance-news/1792836999644091000/uk-government-signals-end-to-business-as-usual-for-water-firms'],
  ['kings', 'Prime Minister’s Office', 'The King’s Speech 2026: background briefing notes (Clean Water Bill)', 'https://assets.publishing.service.gov.uk/media/6a18713db95db968c8f3bbfd/The_King_s_Speech_2026_-_background_briefing_notes.pdf'],
  ['eqt', 'Yorkshire Water Finance plc', 'EQT completes investment in Yorkshire Water, June 2026', 'https://www.investegate.co.uk/announcement/prn/yorkshire-water-finance-plc--55gf/eqt-completes-investment-in-yorkshire-water/9622075'],
  ['yp', 'Yorkshire Post', 'What Yorkshire Water’s new Swedish backers mean for its 5.5m customers', 'https://www.yorkshirepost.co.uk/business/great-step-forward-what-yorkshire-waters-new-swedish-backers-mean-for-its-55m-customers-5624655'],
  ['pew', 'Private Equity Wire', 'EQT acquires Yorkshire Water stake at discount', 'https://www.privateequitywire.co.uk/eqt-acquires-yorkshire-water-stake-at-discount/'],
  ['ofwat-nav', 'Ofwat', 'New appointments and variations', 'https://www.ofwat.gov.uk/regulated-companies/markets/nav-market/'],
  ['leeds-1852', 'Leeds Libraries', 'Utilising the city: Leeds City Council papers (waterworks and the Seven Arches)', 'https://secretlibraryleeds.net/2025/08/21/utilising-the-city-leeds-city-council-papers/'],
  ['sa-fbw', 'Department of Water Affairs and Forestry, South Africa', 'Free Basic Water implementation strategy', 'https://www.dws.gov.za/Documents/FBW/FBWImplementStrategyAug2002.pdf'],
  ['uisce', 'Uisce Éireann', 'Household conservation charge', 'https://water.ie/help/domestic-account/household-conservation-charge']
];
export const SRC = Object.fromEntries(SOURCES.map((s, i) => [s[0], i + 1]));

/* status: pub = published, der = derived from published figures, ass = LIS assumption, gap = no evidence yet */
export const REGISTER = [
  ['Leeds households', '341,466', 'pub', 'Census 2021', ['census', 'shma']],
  ['Leeds residents', '811,956', 'pub', 'Census 2021', ['census']],
  ['Metered water, per m³', '£2.1838', 'pub', 'Yorkshire Water, 2026/27', ['yw-meter']],
  ['Metered sewerage, per m³', '£2.9761', 'pub', 'Charged on 95% of water supplied', ['yw-meter', 'yw-scheme']],
  ['Standing charges, water and sewerage', '£87.95 a year', 'pub', '£54.10 + £33.85; surface-water drainage excluded', ['yw-meter']],
  ['Average household bill', '£636', 'pub', 'Yorkshire Water region, 2026/27', ['wateruk']],
  ['Average household use', '136.9 L per person per day', 'pub', 'England, 2025/26; not specific to Leeds', ['ea']],
  ['Water poverty rate (over 5% of income)', '6.8%', 'pub', 'England and Wales, 2024/25', ['ccw-poverty']],
  ['At-risk rate (over 3% of income)', '15%', 'pub', 'England and Wales, 2024/25', ['ccw-poverty']],
  ['Median water-poverty gap', '£337 a year', 'pub', '2024/25, before the latest bill rises', ['ccw-poverty']],
  ['Company social-tariff contribution', '£2.5m', 'pub', 'Yorkshire Water, 2026/27, whole region', ['yw-assure']],
  ['UN basic-needs range', '50–100 L per person per day', 'pub', 'Guide figure, not a legal standard in England', ['un']],
  ['Combined price per m³ supplied', '£5.0111', 'der', 'Water price plus 95% of the sewerage price', ['yw-meter']],
  ['Average household size', '2.38 people', 'der', 'Residents divided by households', ['census']],
  ['Leeds households in water poverty', 'c.23,200', 'der', 'National rate applied to Leeds households', ['ccw-poverty', 'census']],
  ['All Leeds household water bills', 'c.£217m a year', 'der', 'Households multiplied by the average bill', ['wateruk', 'census']],
  ['Bill growth after 2026/27', '5% a year', 'ass', 'Adjustable. Bills for 2030–35 are not yet set', []],
  ['Running and evaluation costs', '3% of credits', 'ass', 'Adjustable', []],
  ['Use responds to price', 'Not modelled', 'ass', 'Higher prices above the allowance would reduce use and shrink the base', []],
  ['Water poverty in Leeds', 'Unknown', 'gap', 'No published local estimate', []],
  ['Share of Leeds homes with a meter', 'Unknown', 'gap', 'Unmetered homes would need a deemed credit', []],
  ['Renters paying for water through rent or service charges', 'Unknown', 'gap', 'The credit must be shown to reach the resident', []]
];
export const STATUS = { pub: 'Published', der: 'Derived', ass: 'Assumption', gap: 'Gap' };

export const FUNDERS = [
  ['rise', 'Higher users, through the tariff', '#2f6f85'],
  ['co', 'Company and investors', '#a8843f'],
  ['ex', 'National government', '#5e7f55'],
  ['loc', 'Leeds and West Yorkshire', '#7b6a96']
];

export const PRESETS = {
  a: { name: 'Water-poor households first', note: 'Recommended', litres: 80, scope: 'p5', standing: true, year: 2026, growth: 5, admin: 3, w: { rise: 40, co: 30, ex: 30, loc: 0 } },
  b: { name: 'At-risk households, national funding', note: 'A national social tariff by another name', litres: 100, scope: 'p3', standing: true, year: 2026, growth: 5, admin: 3, w: { rise: 0, co: 0, ex: 100, loc: 0 } },
  c: { name: 'Universal minimum through the tariff', note: 'Everyone, paid for by higher users', litres: 50, scope: 'all', standing: false, year: 2026, growth: 5, admin: 3, w: { rise: 100, co: 0, ex: 0, loc: 0 } },
  d: { name: 'Universal, investor and public-stake funded', note: 'Depends on the Water Bill', litres: 80, scope: 'all', standing: true, year: 2026, growth: 5, admin: 3, w: { rise: 0, co: 70, ex: 30, loc: 0 } }
};

export const SCOPES = {
  p5: 'households in water poverty (over 5% of income)',
  p3: 'households at risk (over 3% of income)',
  all: 'every Leeds household'
};

export function compute(s, yearOverride) {
  const year = yearOverride ?? s.year;
  const f = Math.pow(1 + s.growth / 100, year - 2026);
  const rate = (D.waterPerM3 + D.sewerShare * D.sewerPerM3) * f;
  const m3PerPerson = s.litres * 365 / 1000;
  const perPerson = m3PerPerson * rate;
  const hhSize = D.residents / D.households;
  const share = s.scope === 'all' ? 1 : s.scope === 'p3' ? D.atRiskRate : D.povertyRate;
  const households = D.households * share;
  const people = households * hhSize;
  const standing = s.standing ? (D.standingWater + D.standingSewer) * f : 0;
  const credits = people * perPerson + households * standing;
  const total = credits * (1 + s.admin / 100);
  const perHousehold = perPerson * hhSize + standing;
  const allBills = D.households * D.averageBill * f;
  const aboveM3 = Math.max(0, D.averageUse - s.litres) * 365 / 1000;
  const base = D.residents * aboveM3;
  const wsum = s.w.rise + s.w.co + s.w.ex + s.w.loc;
  const n = {};
  for (const k in s.w) n[k] = wsum ? s.w[k] / wsum : 0;
  const surcharge = base > 0 ? total * n.rise / base : Infinity;
  return {
    year, f, rate, m3PerPerson, perPerson, households, people, standing, total, perHousehold,
    allBills, shareOfBills: total / allBills, gapClosed: perHousehold / (D.medianGap * f),
    aboveM3, base, n, wsum, surcharge, surchargePct: surcharge / rate,
    byFunder: Object.fromEntries(Object.keys(n).map(k => [k, total * n[k]])),
    localPerHousehold: total * n.loc / D.households,
    exPerHousehold: total * n.ex / D.households,
    coMultiple: total * n.co / D.companyContribution
  };
}

/* Formatting shared by every page, so the paper and the model always print the same figure. */
export const fmt = {
  m: v => v >= 1e8 ? '£' + Math.round(v / 1e6) + 'm' : '£' + (v / 1e6).toFixed(1) + 'm',
  gbp: v => '£' + Math.round(v).toLocaleString('en-GB'),
  int: v => Math.round(v).toLocaleString('en-GB'),
  pct: v => (v * 100).toFixed(1) + '%',
  pct0: v => Math.round(v * 100) + '%',
  ppm3: v => isFinite(v) ? '£' + v.toFixed(2) : 'n/a',
  ty: y => y + '/' + String((y + 1) % 100).padStart(2, '0')
};

export function issues(s, r) {
  const g = [];
  if (r.wsum === 0) g.push(['crit', 'No funder chosen.', 'Set at least one source of money.']);
  if (s.litres < 50) g.push(['crit', 'Below the UN basic-needs range.', 'An allowance under 50 litres per person per day would not meet the commitment.']);
  if (r.n.rise > 0 && r.aboveM3 === 0) g.push(['crit', 'No use left to carry the cross-subsidy.', 'The allowance is at or above average use, so higher users cannot pay for it.']);
  else if (r.n.rise > 0 && r.surchargePct > 0.5) g.push(['crit', 'The price above the allowance rises by ' + fmt.pct0(r.surchargePct) + '.', 'That moves costs onto large households and people who need more water for medical reasons. Lower the tariff share or narrow who is covered.']);
  if (r.n.rise > 0) g.push(['warn', 'Needs a change to the charges scheme.', 'Yorkshire Water sets one tariff across its region under the regulator’s rules. We found no precedent for a tariff block that applies only in Leeds.']);
  if (r.n.co > 0) g.push(['warn', 'Needs a negotiated or regulated settlement.', 'Until the next price review this is voluntary. The company contributes ' + fmt.m(D.companyContribution) + ' a year across its whole region; this scenario asks for ' + fmt.m(r.byFunder.co) + ' in Leeds alone.']);
  if (r.n.ex > 0) g.push(['warn', 'Needs a national decision.', 'In January 2026 the Government decided against a national social tariff. The Water Bill, the 10-year plan and the next price review are the next chances.']);
  if (r.n.loc > 0) g.push(['warn', 'Needs a local budget line.', 'Councils can act under the general power of competence, but council tax rises above the national limit need a local referendum. This share is about ' + fmt.gbp(r.localPerHousehold) + ' per Leeds household a year.']);
  if (s.scope !== 'all') g.push(['warn', 'Needs a way to find eligible households.', 'Targeting depends on consented data, for example from benefits records. Low take-up is the main risk.']);
  else g.push(['info', 'Universal cover pays for well-off homes too.', 'In return there is no means test, no stigma and no take-up gap.']);
  if (s.standing) g.push(['info', 'Standing charges are covered.', 'Fixed charges weigh most on low-use households, which are often the poorest.']);
  if (s.scope !== 'all' && r.gapClosed < 1) g.push(['warn', 'The typical gap is not closed.', 'At this allowance an average-sized household in water poverty still spends more than 5% of its income on water.']);
  g.push(['gap', 'No Leeds figure for water poverty.', 'The model applies the England and Wales rate to Leeds.']);
  g.push(['gap', 'Unknown share of Leeds homes with a meter.', 'A volume allowance needs a reading; unmetered homes would need a deemed credit.']);
  g.push(['gap', 'Water paid through rent.', 'Where water is in the rent or a service charge, the credit must be shown to reach the resident.']);
  if (s.year > 2029) g.push(['gap', 'Prices after 2030 are not set.', 'The next price review sets bills for 2030–35. The growth rate here is an assumption.']);
  return g;
}

/* Scenario <-> URL query string, e.g. ?l=80&s=p5&st=1&y=2026&g=5&a=3&w=40-30-30-0 */
export function toQuery(s) {
  return '?l=' + s.litres + '&s=' + s.scope + '&st=' + (s.standing ? 1 : 0) + '&y=' + s.year + '&g=' + s.growth + '&a=' + s.admin + '&w=' + [s.w.rise, s.w.co, s.w.ex, s.w.loc].join('-');
}
export function fromQuery(q) {
  const p = new URLSearchParams(q);
  if (p.get('p') && PRESETS[p.get('p')]) return structuredClone(PRESETS[p.get('p')]);
  if (!p.has('l')) return null;
  const num = (k, d, lo, hi) => { const v = parseFloat(p.get(k)); return isFinite(v) ? Math.min(hi, Math.max(lo, v)) : d; };
  const w = (p.get('w') || '40-30-30-0').split('-').map(x => Math.min(100, Math.max(0, parseInt(x, 10) || 0)));
  return {
    litres: num('l', 80, 20, 160), scope: ['p5', 'p3', 'all'].includes(p.get('s')) ? p.get('s') : 'p5',
    standing: p.get('st') !== '0', year: num('y', 2026, 2026, 2035), growth: num('g', 5, 0, 10), admin: num('a', 3, 0, 10),
    w: { rise: w[0] ?? 40, co: w[1] ?? 30, ex: w[2] ?? 30, loc: w[3] ?? 0 }
  };
}
