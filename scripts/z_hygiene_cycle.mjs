import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const REPORTS_DIR = path.join(ROOT, 'data', 'reports');
const OUT_JSON = path.join(REPORTS_DIR, 'z_hygiene_status.json');
const OUT_MD = path.join(REPORTS_DIR, 'z_hygiene_status.md');

function readJson(filePath) {
  try {
    if (!fs.existsSync(filePath)) return null;
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

function minutesSince(ts) {
  if (!ts) return null;
  const ms = Date.parse(ts);
  if (Number.isNaN(ms)) return null;
  return Math.floor((Date.now() - ms) / 60000);
}

function walkFileCount(dir) {
  if (!fs.existsSync(dir)) return 0;
  const stack = [dir];
  let count = 0;
  while (stack.length) {
    const current = stack.pop();
    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const e of entries) {
      const p = path.join(current, e.name);
      if (e.isDirectory()) stack.push(p);
      else if (e.isFile()) count += 1;
    }
  }
  return count;
}

function check(id, pass, note) {
  return { id, pass: Boolean(pass), note: note || '' };
}

const generatedAt = new Date().toISOString();
const privacyReport = readJson(path.join(REPORTS_DIR, 'privacy', 'z_privacy_report.json'));
const pendingAudit = readJson(path.join(REPORTS_DIR, 'z_pending_audit.json'));
const autorunAudit = readJson(path.join(REPORTS_DIR, 'z_autorun_audit.json'));
const procurementDaily = readJson(path.join(REPORTS_DIR, 'z_procurement_daily_report.json'));
const layoutAudit = readJson(path.join(REPORTS_DIR, 'z_data_layout_audit.json'));
const storageAudit = readJson(path.join(REPORTS_DIR, 'z_storage_hygiene_audit.json'));
const aliasAudit = readJson(path.join(REPORTS_DIR, 'z_canonical_alias_audit.json'));
const placeholderAudit = readJson(path.join(REPORTS_DIR, 'z_placeholder_dir_audit.json'));
const securitySentinel = readJson(path.join(REPORTS_DIR, 'z_security_sentinel.json'));
const dataLeakAudit = readJson(path.join(REPORTS_DIR, 'z_data_leak_audit.json'));
const extensionGuard = readJson(path.join(REPORTS_DIR, 'z_extension_guard.json'));
const anyDevicesAnalyzer = readJson(path.join(REPORTS_DIR, 'z_anydevices_analyzer.json'));
const anyDevicesSecurity = readJson(path.join(REPORTS_DIR, 'z_anydevices_security_scan.json'));

const rawCount = walkFileCount(path.join(ROOT, 'uploads', 'raw'));
const privacyAge = minutesSince(privacyReport?.generated_at);
const pendingTotal = Number(pendingAudit?.total || 0);
const autoTasksOn = String(autorunAudit?.auto_tasks_setting || '').toLowerCase() === 'on';
const autoTaskCount = Array.isArray(autorunAudit?.auto_tasks) ? autorunAudit.auto_tasks.length : 0;
const anyDevicesAnalyzerAge = minutesSince(anyDevicesAnalyzer?.generated_at);
const anyDevicesSecurityAge = minutesSince(anyDevicesSecurity?.generated_at);

const checks = [
  check('privacy_raw_empty', rawCount === 0, `uploads/raw files=${rawCount}`),
  check('privacy_report_recent', privacyAge !== null && privacyAge <= 24 * 60, `privacy report age=${privacyAge ?? 'unknown'}m`),
  check('pending_audit_clear', pendingTotal === 0, `pending total=${pendingTotal}`),
  check('autorun_enabled', autoTasksOn, `task.allowAutomaticTasks=${autorunAudit?.auto_tasks_setting || 'unknown'}`),
  check('autorun_tasks_present', autoTaskCount >= 1, `auto tasks=${autoTaskCount}`),
  check('procurement_daily_present', Boolean(procurementDaily), `procurement report=${procurementDaily ? 'present' : 'missing'}`),
  check('data_layout_green', String(layoutAudit?.status || '').toLowerCase() === 'green', `layout status=${layoutAudit?.status || 'unknown'}`),
  check('storage_hygiene_green', String(storageAudit?.status || '').toLowerCase() === 'green', `storage status=${storageAudit?.status || 'unknown'}`),
  check('canonical_alias_green', String(aliasAudit?.status || '').toLowerCase() === 'green', `alias status=${aliasAudit?.status || 'unknown'}`),
  check('placeholder_dirs_green', String(placeholderAudit?.status || '').toLowerCase() === 'green', `placeholder status=${placeholderAudit?.status || 'unknown'}`),
  check('extension_guard_green', String(extensionGuard?.status || '').toLowerCase() === 'green', `extension guard status=${extensionGuard?.status || 'unknown'}`),
  check('data_leak_audit_green', String(dataLeakAudit?.status || '').toLowerCase() === 'green', `data leak status=${dataLeakAudit?.status || 'unknown'}`),
  check('security_sentinel_not_critical', String(securitySentinel?.status || '').toLowerCase() !== 'critical', `sentinel status=${securitySentinel?.status || 'unknown'}`),
  check('anydevices_analyzer_recent', anyDevicesAnalyzerAge !== null && anyDevicesAnalyzerAge <= 60, `anydevices analyzer age=${anyDevicesAnalyzerAge ?? 'unknown'}m`),
  check('anydevices_security_not_blocked', String(anyDevicesSecurity?.status || '').toLowerCase() !== 'blocked', `anydevices security status=${anyDevicesSecurity?.status || 'unknown'}`),
  check('anydevices_security_recent', anyDevicesSecurityAge !== null && anyDevicesSecurityAge <= 60, `anydevices security age=${anyDevicesSecurityAge ?? 'unknown'}m`),
];

const failed = checks.filter((c) => !c.pass);
const status = failed.length ? 'hold' : 'green';
const summary = {
  generated_at: generatedAt,
  status,
  checks,
  metrics: {
    raw_files: rawCount,
    privacy_report_age_min: privacyAge,
    pending_total: pendingTotal,
    auto_tasks: autoTaskCount,
    anydevices_analyzer_age_min: anyDevicesAnalyzerAge,
    anydevices_security_age_min: anyDevicesSecurityAge,
  },
  notes: failed.length
    ? 'Hygiene drift detected. Resolve failed checks before running heavy processing.'
    : 'All hygiene checks passed. Safe to continue background processing.',
};

fs.mkdirSync(REPORTS_DIR, { recursive: true });
fs.writeFileSync(OUT_JSON, JSON.stringify(summary, null, 2));

const md = [
  '# Z Hygiene Status',
  '',
  `Generated: ${generatedAt}`,
  `Status: ${status.toUpperCase()}`,
  '',
  '## Checks',
  ...checks.map((c) => `- [${c.pass ? 'x' : ' '}] ${c.id}: ${c.note}`),
  '',
  '## Metrics',
  `- raw_files: ${summary.metrics.raw_files}`,
  `- privacy_report_age_min: ${summary.metrics.privacy_report_age_min ?? 'unknown'}`,
  `- pending_total: ${summary.metrics.pending_total}`,
  `- auto_tasks: ${summary.metrics.auto_tasks}`,
  `- anydevices_analyzer_age_min: ${summary.metrics.anydevices_analyzer_age_min ?? 'unknown'}`,
  `- anydevices_security_age_min: ${summary.metrics.anydevices_security_age_min ?? 'unknown'}`,
  '',
  `Notes: ${summary.notes}`,
  '',
];
fs.writeFileSync(OUT_MD, md.join('\n'));

console.log(`✅ Hygiene cycle report written: ${OUT_JSON}`);
