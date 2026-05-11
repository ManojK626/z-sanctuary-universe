import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const ROOT = path.resolve(process.cwd());
const REPORTS_DIR = path.join(ROOT, 'data', 'reports');
const FORMULA_REGISTRY_PATH = path.join(ROOT, 'rules', 'Z_FORMULA_REGISTRY.json');
const FOLDER_POLICY_PATH = path.join(ROOT, 'data', 'z_folder_manager_policy.json');
const REQUEST_ONLY_POLICY_PATH = path.join(ROOT, 'rules', 'Z_REQUEST_ONLY_ACCESS_POLICY.md');
const REGO_POLICY_PATH = path.join(ROOT, 'policies', 'opa', 'shadow_gate.rego');
const OUTPUT_JSON = path.join(REPORTS_DIR, 'z_policy_shadow_gate.json');
const OUTPUT_MD = path.join(REPORTS_DIR, 'z_policy_shadow_gate.md');

fs.mkdirSync(REPORTS_DIR, { recursive: true });

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function exists(filePath) {
  return fs.existsSync(filePath);
}

function hasBinary(command) {
  try {
    execSync(command, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

const now = new Date().toISOString();
const formulaRegistryExists = exists(FORMULA_REGISTRY_PATH);
const folderPolicyExists = exists(FOLDER_POLICY_PATH);
const requestPolicyExists = exists(REQUEST_ONLY_POLICY_PATH);
const regoPolicyExists = exists(REGO_POLICY_PATH);

const formulaRegistry = formulaRegistryExists ? readJson(FORMULA_REGISTRY_PATH) : null;
const folderPolicy = folderPolicyExists ? readJson(FOLDER_POLICY_PATH) : null;

const input = {
  formula_registry: {
    status: formulaRegistry?.status || 'missing',
  },
  folder_policy: {
    mode: folderPolicy?.mode || 'missing',
  },
  request_only_policy_present: requestPolicyExists,
};

const checks = [
  {
    id: 'formula_registry_internal_only',
    pass: input.formula_registry.status === 'internal-only',
    note: `status=${input.formula_registry.status}`,
  },
  {
    id: 'folder_policy_internal_only',
    pass: input.folder_policy.mode === 'internal-only',
    note: `mode=${input.folder_policy.mode}`,
  },
  {
    id: 'request_only_policy_present',
    pass: input.request_only_policy_present,
    note: requestPolicyExists ? 'policy file present' : 'policy file missing',
  },
  {
    id: 'rego_pack_present',
    pass: regoPolicyExists,
    note: regoPolicyExists ? 'opa/shadow_gate.rego present' : 'opa/shadow_gate.rego missing',
  },
];

const opaAvailable = hasBinary('opa version');
const conftestAvailable = hasBinary('conftest --version');

const failed = checks.filter((c) => !c.pass);
const status = {
  generated_at: now,
  mode: 'shadow',
  enforcement: 'advisory',
  status: failed.length > 0 ? 'attention' : 'ready',
  binaries: {
    opa: opaAvailable,
    conftest: conftestAvailable,
  },
  input,
  checks,
};

fs.writeFileSync(OUTPUT_JSON, `${JSON.stringify(status, null, 2)}\n`, 'utf8');

const md = [
  '# Z Policy Shadow Gate',
  '',
  `Generated: ${now}`,
  `Mode: ${status.mode}`,
  `Enforcement: ${status.enforcement}`,
  `Status: ${status.status.toUpperCase()}`,
  '',
  '## Checks',
  ...checks.map((item) => `- ${item.pass ? 'PASS' : 'FAIL'} ${item.id}: ${item.note}`),
  '',
  '## Optional Tooling',
  `- OPA binary: ${opaAvailable ? 'detected' : 'not detected'}`,
  `- Conftest binary: ${conftestAvailable ? 'detected' : 'not detected'}`,
  '',
  'Operational note: shadow gate is advisory only and does not block runtime tasks.',
  '',
].join('\n');

fs.writeFileSync(OUTPUT_MD, md, 'utf8');
console.log('Z policy shadow gate report written.');
