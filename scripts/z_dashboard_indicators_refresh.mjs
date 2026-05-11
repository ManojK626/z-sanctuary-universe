#!/usr/bin/env node
/**
 * Sequential refresh of JSON reports consumed by the main dashboard (badges, rail).
 * Invoked as a single `node ...` command so VS Code PowerShell tasks avoid `&&`.
 */
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const STEPS = [
  { cmd: 'node', args: ['scripts/z_extension_guard.mjs'] },
  { cmd: 'node', args: ['scripts/z_security_sentinel.mjs'] },
  { cmd: 'node', args: ['scripts/z_storage_hygiene_guard.mjs'] },
  { cmd: 'node', args: ['scripts/z_cycle_record.mjs'] },
  { cmd: 'node', args: ['scripts/z_indicator_watchdog.mjs'] },
  { cmd: 'node', args: ['scripts/z_error_budget_engine.mjs'] },
  { cmd: 'node', args: ['scripts/z_ai_status_writer.js'] },
  { cmd: 'node', args: ['scripts/z_autorun_audit.mjs'] },
  { cmd: 'node', args: ['scripts/z_pending_audit.mjs'] },
  { cmd: 'node', args: ['scripts/z_zuno_state_report.mjs'] },
  { cmd: 'python', args: ['scripts/z_ssws_daily_report.py'] },
  { cmd: 'node', args: ['scripts/z_report_freshness_check.mjs'] },
  { cmd: 'node', args: ['scripts/z_cross_project_health_probe.mjs'] },
];

function runStep({ cmd, args }) {
  const r = spawnSync(cmd, args, {
    cwd: ROOT,
    stdio: 'inherit',
    shell: false,
    env: process.env,
  });
  const code = r.status ?? (r.signal ? 1 : 0);
  if (code !== 0) {
    console.error(`[z_dashboard_indicators_refresh] failed: ${cmd} ${args.join(' ')} (exit ${code})`);
    process.exit(code);
  }
}

for (const step of STEPS) {
  runStep(step);
}

console.log('[z_dashboard_indicators_refresh] done.');
