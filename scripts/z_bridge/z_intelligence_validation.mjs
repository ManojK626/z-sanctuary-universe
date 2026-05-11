#!/usr/bin/env node
/**
 * Gate 4 — Intelligence accuracy (delegates to z_intelligence_regression.mjs).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { Z_BRIDGE_REPO_ROOT } from './z_bridge_loader.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPORT_DIR = path.join(Z_BRIDGE_REPO_ROOT, 'data', 'reports');
const OUT = path.join(REPORT_DIR, 'z_bridge_intelligence_validation.json');
const REG = path.join(__dirname, 'z_intelligence_regression.mjs');

function main() {
  const r = spawnSync(process.execPath, [REG], { cwd: Z_BRIDGE_REPO_ROOT, encoding: 'utf8', shell: false });
  const exit = r.status ?? 1;
  const status = exit === 0 ? 'PASS' : 'FAIL';
  const payload = {
    generated_at: new Date().toISOString(),
    gate: 'intelligence',
    status,
    delegate: 'scripts/z_bridge/z_intelligence_regression.mjs',
    exit_code: exit,
    stderr_tail: String(r.stderr || '').slice(-800)
  };
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  fs.writeFileSync(OUT, `${JSON.stringify(payload, null, 2)}\n`);
  console.log(JSON.stringify(payload, null, 2));
  process.exit(exit === 0 ? 0 : 1);
}

main();
