import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const POLICY_PATH = path.join(ROOT, 'config', 'z_proof_mesh_policy.json');
const CARD_PATH = path.join(ROOT, 'data', 'reports', 'z_proof_mesh_card.json');

function readJson(filePath, fallback = null) {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return fallback;
  }
}

function fail(msg, code = 2) {
  console.error(`⛔ Z-Proof Gate blocked: ${msg}`);
  process.exit(code);
}

const policy = readJson(POLICY_PATH, { rules: {} });
const rules = policy.rules || {};
const card = readJson(CARD_PATH, null);

if (!card) fail('missing proof card. Run: node scripts/z_proof_mesh_card.mjs', 3);

const checkMap = new Map((card.checks || []).map((c) => [c.id, c]));

if (rules.require_hygiene_green && !checkMap.get('hygiene_green')?.pass) {
  fail('hygiene is not green');
}
if (rules.require_protection_audit && !checkMap.get('protection_audit_ok')?.pass) {
  fail('protection audit failed');
}
if (!checkMap.get('privacy_report_recent')?.pass) {
  fail('privacy report is stale');
}
if (!checkMap.get('pending_audit_limit')?.pass) {
  fail('pending audit above threshold');
}
if (!checkMap.get('module_coverage_floor')?.pass) {
  fail('module coverage below threshold');
}
if (!checkMap.get('priority_open_limit')?.pass) {
  fail('priority backlog above threshold');
}

console.log('✅ Z-Proof Gate check passed.');
