import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(process.cwd());
const REPORTS_DIR = path.join(ROOT, 'data', 'reports');
const TASKS_PATH = path.join(ROOT, '.vscode', 'tasks.json');
const REGISTRY_PATH = path.join(ROOT, 'rules', 'Z_FORMULA_REGISTRY.json');
const FOLDER_POLICY_PATH = path.join(ROOT, 'data', 'z_folder_manager_policy.json');
const OUT_JSON = path.join(REPORTS_DIR, 'z_troublemaker_scan.json');
const OUT_MD = path.join(REPORTS_DIR, 'z_troublemaker_scan.md');
const OUT_FEED = path.join(REPORTS_DIR, 'z_super_ghost_disturbance_feed.json');

const CRITICAL_REPORTS = [
  'z_ssws_daily_report.json',
  'z_ai_status.json',
  'z_autorun_audit.json',
  'z_policy_shadow_gate.json',
  'z_otel_shadow_status.json',
];

function readJson(filePath, fallback = null) {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return fallback;
  }
}

function fileAgeHours(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const st = fs.statSync(filePath);
  const ageMs = Date.now() - st.mtimeMs;
  return Number((ageMs / (1000 * 60 * 60)).toFixed(2));
}

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

function riskClass(score) {
  if (score >= 80) return 'sacred';
  if (score >= 60) return 'high';
  if (score >= 35) return 'medium';
  return 'low';
}

const now = new Date().toISOString();
fs.mkdirSync(REPORTS_DIR, { recursive: true });

const tasks = readJson(TASKS_PATH, { tasks: [] });
const taskList = Array.isArray(tasks?.tasks) ? tasks.tasks : [];
const folderOpenTasks = taskList.filter((t) => t?.runOptions?.runOn === 'folderOpen');

const folderOpenCount = folderOpenTasks.length;
const folderOpenLabels = folderOpenTasks.map((t) => t.label).filter(Boolean);

const sswsAutoBoot = taskList.find((t) => t?.label === 'Z: SSWS Auto Boot');
const dependsOn = Array.isArray(sswsAutoBoot?.dependsOn) ? sswsAutoBoot.dependsOn : [];

const dangerousTaskTokens = ['--force', '--apply-actions'];
const dangerousInBoot = dependsOn.filter((label) => {
  const task = taskList.find((t) => t.label === label);
  const cmd = String(task?.command || '').toLowerCase();
  return dangerousTaskTokens.some((token) => cmd.includes(token));
});

const registry = readJson(REGISTRY_PATH, {});
const folderPolicy = readJson(FOLDER_POLICY_PATH, {});

/** Hub root: this repo (Organiser path or legacy C:\\ZSanctuary_Universe), not a single hardcoded drive letter. */
function isHubWorkspaceRoot(root) {
  const resolved = path.resolve(root);
  const base = path.basename(resolved).toLowerCase();
  if (base !== 'zsanctuary_universe') return false;
  const pkgPath = path.join(resolved, 'package.json');
  if (!fs.existsSync(pkgPath)) return false;
  const pkg = readJson(pkgPath, {});
  return pkg?.name === 'z-sanctuary-universe';
}

const reportFreshness = CRITICAL_REPORTS.map((name) => {
  const p = path.join(REPORTS_DIR, name);
  const age = fileAgeHours(p);
  return {
    file: name,
    exists: fs.existsSync(p),
    age_hours: age,
  };
});

const staleCritical = reportFreshness.filter((r) => !r.exists || (r.age_hours ?? 999) > 36);

const hubRootOk = isHubWorkspaceRoot(ROOT);

const checks = [
  {
    id: 'single_folder_open_autorun',
    pass: folderOpenCount === 1,
    weight: 20,
    note: `folder-open tasks=${folderOpenCount}`,
    details: folderOpenLabels,
  },
  {
    id: 'workspace_root_canonical',
    pass: hubRootOk,
    weight: 20,
    note: hubRootOk ? `hub_ok=${ROOT}` : `not_hub_package=${ROOT}`,
  },
  {
    id: 'boot_chain_no_dangerous_tokens',
    pass: dangerousInBoot.length === 0,
    weight: 20,
    note:
      dangerousInBoot.length === 0
        ? 'no --force/--apply-actions in boot chain'
        : `dangerous tasks in boot chain: ${dangerousInBoot.join(', ')}`,
  },
  {
    id: 'formula_registry_internal_only',
    pass: String(registry?.status || '').toLowerCase() === 'internal-only',
    weight: 20,
    note: `status=${registry?.status || 'missing'}`,
  },
  {
    id: 'folder_policy_internal_only',
    pass: String(folderPolicy?.mode || '').toLowerCase() === 'internal-only',
    weight: 20,
    note: `mode=${folderPolicy?.mode || 'missing'}`,
  },
  {
    id: 'critical_reports_fresh',
    pass: staleCritical.length === 0,
    weight: 15,
    note:
      staleCritical.length === 0
        ? 'critical reports within freshness window'
        : `stale/missing reports: ${staleCritical.map((x) => x.file).join(', ')}`,
  },
];

const maxScore = checks.reduce((sum, c) => sum + c.weight, 0);
const gotScore = checks.filter((c) => c.pass).reduce((sum, c) => sum + c.weight, 0);
const score = clamp(Math.round((gotScore / maxScore) * 100), 0, 100);
const failed = checks.filter((c) => !c.pass);

const status = failed.length === 0 ? 'green' : failed.length <= 2 ? 'watch' : 'alert';
const classification = riskClass(100 - score);

const result = {
  generated_at: now,
  status,
  disturbance_score: 100 - score,
  risk_class: classification,
  summary: {
    checks_total: checks.length,
    checks_pass: checks.length - failed.length,
    checks_fail: failed.length,
    folder_open_autoruns: folderOpenCount,
  },
  checks,
  freshness: reportFreshness,
  failed_ids: failed.map((f) => f.id),
  protocol: 'observational-only',
};

fs.writeFileSync(OUT_JSON, `${JSON.stringify(result, null, 2)}\n`, 'utf8');

const md = [
  '# Z Trouble Maker Scan',
  '',
  `Generated: ${now}`,
  `Status: ${status.toUpperCase()}`,
  `Risk class: ${classification}`,
  `Disturbance score: ${result.disturbance_score}`,
  '',
  '## Summary',
  `- Checks pass: ${result.summary.checks_pass}/${result.summary.checks_total}`,
  `- Folder-open autoruns: ${result.summary.folder_open_autoruns}`,
  '',
  '## Checks',
  ...checks.map((c) => `- ${c.pass ? 'PASS' : 'FAIL'} ${c.id}: ${c.note}`),
  '',
  '## Freshness',
  ...reportFreshness.map((r) => `- ${r.file}: ${r.exists ? `${r.age_hours}h` : 'missing'}`),
  '',
  'Operational note: advisory scan only, no runtime mutation.',
  '',
].join('\n');

fs.writeFileSync(OUT_MD, md, 'utf8');

const superGhostFeed = {
  generated_at: now,
  source: 'z_troublemaker_scan',
  type: 'disturbance_watch',
  status,
  risk_class: classification,
  disturbance_score: result.disturbance_score,
  failed_ids: result.failed_ids,
  message:
    status === 'green'
      ? 'Trouble Maker scan is clear. No disturbance chain detected.'
      : 'Disturbance watch detected protocol drift. Review failed checks.',
};
fs.writeFileSync(OUT_FEED, `${JSON.stringify(superGhostFeed, null, 2)}\n`, 'utf8');

console.log('Z Trouble Maker scan written.');
