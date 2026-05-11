#!/usr/bin/env node
/**
 * Z Readiness Gate — orchestrates Z-Bridge Task 007.5 readiness engine (4 gates).
 * Writes data/reports/z_readiness_gate.json; exit 0 only when all gates PASS.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const REPORT_DIR = path.join(ROOT, 'data', 'reports');
const OUT = path.join(REPORT_DIR, 'z_readiness_gate.json');

const STEPS = [
  { id: 'data_integrity', script: path.join(ROOT, 'scripts', 'z_bridge', 'z_data_integrity_check.mjs') },
  { id: 'abuse_resistance', script: path.join(ROOT, 'scripts', 'z_bridge', 'z_abuse_simulation.mjs') },
  { id: 'stability', script: path.join(ROOT, 'scripts', 'z_bridge', 'z_stability_runner.mjs') },
  { id: 'intelligence', script: path.join(ROOT, 'scripts', 'z_bridge', 'z_intelligence_validation.mjs') }
];

function runGate(step) {
  const r = spawnSync(process.execPath, [step.script], {
    cwd: ROOT,
    encoding: 'utf8',
    shell: false,
    stdio: ['ignore', 'pipe', 'pipe']
  });
  const exit = r.status ?? 1;
  const pass = exit === 0;
  return {
    id: step.id,
    pass,
    exit_code: exit,
    stdout_tail: String(r.stdout || '').slice(-400),
    stderr_tail: String(r.stderr || '').slice(-400)
  };
}

function main() {
  const gates = STEPS.map(runGate);
  const passCount = gates.filter((g) => g.pass).length;
  const allPass = passCount === gates.length;
  const payload = {
    generated_at: new Date().toISOString(),
    readiness: `${passCount}/${gates.length}`,
    summary: {
      status: allPass ? 'PASS' : 'FAIL',
      gates_pass: passCount,
      gates_total: gates.length
    },
    data_integrity: gates.find((g) => g.id === 'data_integrity')?.pass ? 'PASS' : 'FAIL',
    abuse_resistance: gates.find((g) => g.id === 'abuse_resistance')?.pass ? 'SAFE' : 'RISK',
    stability: gates.find((g) => g.id === 'stability')?.pass ? 'PASS' : 'FAIL',
    intelligence: gates.find((g) => g.id === 'intelligence')?.pass ? 'PASS' : 'FAIL',
    gates
  };
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  fs.writeFileSync(OUT, `${JSON.stringify(payload, null, 2)}\n`);
  console.log(JSON.stringify(payload, null, 2));
  process.exit(allPass ? 0 : 1);
}

main();
