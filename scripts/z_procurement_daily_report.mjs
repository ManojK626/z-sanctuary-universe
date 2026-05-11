import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const REPORTS_DIR = path.join(ROOT, 'data', 'reports');
const PROCUREMENT_JSON = path.join(REPORTS_DIR, 'z_procurement_status.json');
const BURNIN_MD = path.join(REPORTS_DIR, 'z_vault_burnin.md');
const RESTORE_MD = path.join(REPORTS_DIR, 'z_restore_test.md');
const OUT_JSON = path.join(REPORTS_DIR, 'z_procurement_daily_report.json');
const OUT_MD = path.join(REPORTS_DIR, 'z_procurement_daily_report.md');

function readJson(filePath, fallback = {}) {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return fallback;
  }
}

function readText(filePath, fallback = '') {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    return fs.readFileSync(filePath, 'utf8');
  } catch {
    return fallback;
  }
}

function extractField(text, label) {
  const re = new RegExp(`^${label}:\\s*(.+)$`, 'mi');
  const match = text.match(re);
  return match ? match[1].trim() : '';
}

function countItemsByStatus(wave) {
  const items = Array.isArray(wave?.items) ? wave.items : [];
  const summary = { planned: 0, ordered: 0, received: 0, optional: 0, other: 0 };
  items.forEach((item) => {
    const s = String(item?.status || 'planned').toLowerCase();
    if (summary[s] !== undefined) summary[s] += 1;
    else summary.other += 1;
  });
  return summary;
}

const procurement = readJson(PROCUREMENT_JSON, {});
const burninText = readText(BURNIN_MD, '');
const restoreText = readText(RESTORE_MD, '');

const generatedAt = new Date().toISOString();
const waveA = countItemsByStatus(procurement?.waves?.wave_a);
const waveB = countItemsByStatus(procurement?.waves?.wave_b);
const waveC = countItemsByStatus(procurement?.waves?.wave_c);

const waveAGatePass = Boolean(procurement?.gates?.wave_a_gate?.pass);
const waveBGatePass = Boolean(procurement?.gates?.wave_b_gate?.pass);
const burninVerdict = extractField(burninText, 'Burn-in status') || 'UNKNOWN';
const restoreVerdict = extractField(restoreText, 'Restore status') || 'UNKNOWN';

const report = {
  generated_at: generatedAt,
  phase: procurement?.phase || 'unknown',
  overall_status: procurement?.overall_status || 'unknown',
  budget: procurement?.budget || {},
  wave_status: {
    wave_a: procurement?.waves?.wave_a?.status || 'unknown',
    wave_b: procurement?.waves?.wave_b?.status || 'unknown',
    wave_c: procurement?.waves?.wave_c?.status || 'unknown',
  },
  wave_item_counts: { wave_a: waveA, wave_b: waveB, wave_c: waveC },
  gates: {
    wave_a_gate_pass: waveAGatePass,
    wave_b_gate_pass: waveBGatePass,
  },
  validation: {
    burnin_status: burninVerdict,
    restore_status: restoreVerdict,
  },
  risks: Array.isArray(procurement?.risks) ? procurement.risks : [],
  next_actions: Array.isArray(procurement?.next_actions) ? procurement.next_actions : [],
};

const md = [
  '# Z Procurement Daily Report',
  '',
  `Generated: ${generatedAt}`,
  `Phase: ${report.phase}`,
  `Overall status: ${report.overall_status}`,
  '',
  '## Budget',
  `- Planned total: EUR ${report.budget?.planned_total ?? 0}`,
  `- Committed total: EUR ${report.budget?.committed_total ?? 0}`,
  `- Paid total: EUR ${report.budget?.paid_total ?? 0}`,
  `- Variance: EUR ${report.budget?.variance ?? 0}`,
  '',
  '## Wave Status',
  `- Wave A: ${report.wave_status.wave_a}`,
  `- Wave B: ${report.wave_status.wave_b}`,
  `- Wave C: ${report.wave_status.wave_c}`,
  '',
  '## Wave Item Counts',
  `- Wave A: planned=${waveA.planned}, ordered=${waveA.ordered}, received=${waveA.received}, optional=${waveA.optional}, other=${waveA.other}`,
  `- Wave B: planned=${waveB.planned}, ordered=${waveB.ordered}, received=${waveB.received}, optional=${waveB.optional}, other=${waveB.other}`,
  `- Wave C: planned=${waveC.planned}, ordered=${waveC.ordered}, received=${waveC.received}, optional=${waveC.optional}, other=${waveC.other}`,
  '',
  '## Gates & Validation',
  `- Wave A gate: ${waveAGatePass ? 'PASS' : 'HOLD'}`,
  `- Wave B gate: ${waveBGatePass ? 'PASS' : 'HOLD'}`,
  `- Burn-in status: ${burninVerdict}`,
  `- Restore status: ${restoreVerdict}`,
  '',
  '## Open Risks',
  ...(report.risks.length
    ? report.risks.map((r) => `- [${r.severity || 'n/a'}] ${r.id || 'risk'} (${r.status || 'open'}) -> ${r.mitigation || 'n/a'}`)
    : ['- none']),
  '',
  '## Next Actions',
  ...(report.next_actions.length ? report.next_actions.map((x) => `- ${x}`) : ['- none']),
  '',
];

fs.mkdirSync(REPORTS_DIR, { recursive: true });
fs.writeFileSync(OUT_JSON, JSON.stringify(report, null, 2));
fs.writeFileSync(OUT_MD, md.join('\n'));

console.log('✅ Procurement daily report written:', OUT_MD);
