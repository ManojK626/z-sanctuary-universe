import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const POLICY_PATH = path.join(ROOT, 'config', 'z_lab_task_lanes.json');
const DOC_PATH = path.join(ROOT, 'docs', 'Z_LAB_TASK_STRUCTURE.md');
const REPORTS_DIR = path.join(ROOT, 'data', 'reports');
const OUT_JSON = path.join(REPORTS_DIR, 'z_lab_task_structure_guard.json');
const OUT_MD = path.join(REPORTS_DIR, 'z_lab_task_structure_guard.md');

function readJson(filePath) {
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readText(filePath) {
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath, 'utf8');
}

const policy = readJson(POLICY_PATH);
const doc = readText(DOC_PATH);

const checks = [];
checks.push({
  id: 'policy_exists',
  pass: !!policy,
  note: policy ? 'config/z_lab_task_lanes.json present' : 'missing config/z_lab_task_lanes.json'
});
checks.push({
  id: 'doc_exists',
  pass: !!doc,
  note: doc ? 'docs/Z_LAB_TASK_STRUCTURE.md present' : 'missing docs/Z_LAB_TASK_STRUCTURE.md'
});

if (policy) {
  const lanes = Array.isArray(policy.lanes) ? policy.lanes : [];
  const laneIds = lanes.map((x) => x.id);
  const required = ['CORRESPONDENCE', 'INACCORDANCE', 'CHAT_ONLY'];
  const missing = required.filter((x) => !laneIds.includes(x));
  checks.push({
    id: 'required_lanes_defined',
    pass: missing.length === 0,
    note: missing.length === 0 ? 'all required lanes present' : `missing=${missing.join(', ')}`
  });
}

if (doc) {
  const requiredTokens = ['CORRESPONDENCE', 'INACCORDANCE', 'CHAT_ONLY', 'No-Mixing Protocol'];
  const missingTokens = requiredTokens.filter((t) => !doc.includes(t));
  checks.push({
    id: 'doc_contains_lane_sections',
    pass: missingTokens.length === 0,
    note: missingTokens.length === 0 ? 'sections present' : `missing=${missingTokens.join(', ')}`
  });
}

const status = checks.every((c) => c.pass) ? 'green' : 'hold';
const payload = {
  generated_at: new Date().toISOString(),
  status,
  checks
};

fs.mkdirSync(REPORTS_DIR, { recursive: true });
fs.writeFileSync(OUT_JSON, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
fs.writeFileSync(
  OUT_MD,
  [
    '# Z Lab Task Structure Guard',
    '',
    `- Generated: ${payload.generated_at}`,
    `- Status: ${payload.status.toUpperCase()}`,
    '',
    '## Checks',
    ...checks.map((c) => `- [${c.pass ? 'x' : ' '}] ${c.id}: ${c.note}`),
    ''
  ].join('\n'),
  'utf8'
);

if (status !== 'green') {
  console.error('Z lab task structure guard failed.');
  process.exit(1);
}

console.log(`Z lab task structure guard passed: ${OUT_JSON}`);
