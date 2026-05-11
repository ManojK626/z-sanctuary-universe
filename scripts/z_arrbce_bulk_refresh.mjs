#!/usr/bin/env node
/**
 * Z-ARRBCE — Auto Refresh + Regenerate Backup Core Engines (hub bulk-load helper).
 *
 * Sequential hub-only refresh of core JSON surfaces used by the dashboard rail,
 * badges, Super Chat awareness, and formula posture (via guardian).
 *
 * Security posture: read-oriented toward member trees (freshness git probes only);
 * writes stay under this repo’s `data/`. Does not bypass Z-Execution Enforcer,
 * vault, consent, or autonomous approvals. Harisha (gentle surfacing) and Vegeta
 * (guardian-tier alert awareness) remain policy layers per
 * docs/Z-FULL-VISION-AND-REINFORCEMENT.md — run those pipelines separately.
 *
 * Optional: `--with-dashboard-indicators` runs `z_dashboard_indicators_refresh.mjs` (heavier).
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const node = process.execPath;
const LAST_RUN_JSON = join(ROOT, 'data', 'reports', 'z_arrbce_last_run.json');

const BASE = [
  'scripts/z_project_freshness_refresh.mjs',
  'scripts/z_system_status_refresh.mjs',
  'scripts/z_guardian_report.mjs',
  'scripts/z_operator_digest_refresh.mjs'
];

function runScript(rel) {
  const r = spawnSync(node, [join(ROOT, rel)], { cwd: ROOT, stdio: 'inherit', shell: false });
  const code = r.status ?? (r.signal ? 1 : 0);
  if (code !== 0) {
    console.error(`[z-arrbce-bulk-refresh] failed: ${rel} (exit ${code})`);
    process.exit(code);
  }
}

for (const rel of BASE) {
  runScript(rel);
}

const fullIndicators = process.argv.includes('--with-dashboard-indicators');
if (fullIndicators) {
  runScript('scripts/z_dashboard_indicators_refresh.mjs');
}

const completedAt = new Date().toISOString();
const payload = {
  completed_at_iso: completedAt,
  mode: fullIndicators ? 'full' : 'core',
  ok: true
};
fs.mkdirSync(dirname(LAST_RUN_JSON), { recursive: true });
fs.writeFileSync(LAST_RUN_JSON, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
console.log(`[z-arrbce-bulk-refresh] last-run stamp: ${LAST_RUN_JSON}`);

console.log('[z-arrbce-bulk-refresh] done.');
