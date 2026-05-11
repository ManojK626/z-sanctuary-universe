import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const REPORTS_DIR = path.join(ROOT, 'data', 'reports');
const OUT_JSON = path.join(REPORTS_DIR, 'z_report_freshness.json');
const OUT_MD = path.join(REPORTS_DIR, 'z_report_freshness.md');

const CRITICAL_24H = [
  'z_hygiene_status.json',
  'z_autorun_audit.json',
  'z_pending_audit.json',
  'z_ssws_daily_report.json',
  'z_ai_status.json',
  'zuno_system_state_report.json',
  'z_data_leak_audit.json',
  'z_extension_guard.json',
];

const DAY_MS = 24 * 60 * 60 * 1000;
const WEEK_MS = 7 * DAY_MS;

function ageHours(ms) {
  return Number((ms / (60 * 60 * 1000)).toFixed(2));
}

function statFile(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const stat = fs.statSync(filePath);
  const ageMs = Date.now() - stat.mtimeMs;
  return {
    file: path.basename(filePath),
    modified_at: new Date(stat.mtimeMs).toISOString(),
    age_hours: ageHours(ageMs),
    age_ms: ageMs,
  };
}

function run() {
  const generatedAt = new Date().toISOString();
  const criticalRows = CRITICAL_24H.map((name) => {
    const row = statFile(path.join(REPORTS_DIR, name));
    if (!row) {
      return { file: name, missing: true, stale: true, severity: 'critical' };
    }
    return {
      ...row,
      stale: row.age_ms > DAY_MS,
      missing: false,
      severity: row.age_ms > DAY_MS ? 'critical' : 'ok',
    };
  });

  const allReportFiles = fs
    .readdirSync(REPORTS_DIR, { withFileTypes: true })
    .filter((d) => d.isFile() && d.name.endsWith('.json'))
    .map((d) => statFile(path.join(REPORTS_DIR, d.name)))
    .filter(Boolean);

  const weeklyStale = allReportFiles
    .filter((r) => r.age_ms > WEEK_MS)
    .map((r) => ({ ...r, stale: true, severity: 'warn' }))
    .sort((a, b) => b.age_ms - a.age_ms)
    .slice(0, 20);

  const criticalFail = criticalRows.filter((r) => r.stale).length;
  const status = criticalFail === 0 ? 'green' : 'hold';

  const payload = {
    generated_at: generatedAt,
    status,
    checks: {
      critical_24h_total: criticalRows.length,
      critical_24h_stale: criticalFail,
      weekly_stale_count: weeklyStale.length,
    },
    critical_24h: criticalRows,
    weekly_stale: weeklyStale,
  };

  fs.mkdirSync(REPORTS_DIR, { recursive: true });
  fs.writeFileSync(OUT_JSON, JSON.stringify(payload, null, 2));

  const md = [
    '# Z Report Freshness',
    '',
    `Generated: ${generatedAt}`,
    `Status: ${status.toUpperCase()}`,
    '',
    '## Critical (24h SLA)',
    ...criticalRows.map((r) =>
      r.missing
        ? `- [ ] ${r.file}: missing`
        : `- [${r.stale ? ' ' : 'x'}] ${r.file}: ${r.age_hours}h old`
    ),
    '',
    '## Weekly Stale JSON Reports (> 7d)',
    ...(weeklyStale.length
      ? weeklyStale.map((r) => `- ${r.file}: ${r.age_hours}h old`)
      : ['- none']),
    '',
  ];
  fs.writeFileSync(OUT_MD, md.join('\n'));

  console.log(`✅ Report freshness written: ${OUT_JSON}`);
}

run();
