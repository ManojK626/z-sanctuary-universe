#!/usr/bin/env node
/**
 * Z-SSWS Shadow Verify
 * Compatibility runner for SSWS/Tower surface readiness checks.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const ROOT = process.cwd();
const REPORTS = path.join(ROOT, 'data', 'reports');
const OUT_JSON = path.join(REPORTS, 'z_ssws_shadow_verify.json');

function run(label, command, args) {
  const printable = `${command} ${args.join(' ')}`.trim();
  console.log(`[SSWS-SHADOW] ${label}`);
  console.log(`[SSWS-SHADOW] > ${printable}`);
  const res = spawnSync(command, args, {
    cwd: ROOT,
    stdio: 'inherit',
    shell: false,
  });
  const code = res.status ?? 1;
  return { label, command: printable, exit_code: code, ok: code === 0 };
}

function main() {
  const started = new Date().toISOString();
  const steps = [
    run('SSWS base verify', 'python', ['scripts/z_ssws_verify.py']),
    run('IDE comm-flow guard', 'node', ['scripts/z_ide_commflow_guard.mjs']),
    run('ATAIECF shadow verify', 'node', ['scripts/z_ataiecf_shadow_verify.mjs']),
  ];

  const ok = steps.every((s) => s.ok);
  const payload = {
    generated_at: new Date().toISOString(),
    started_at: started,
    status: ok ? 'green' : 'red',
    steps,
  };
  fs.mkdirSync(REPORTS, { recursive: true });
  fs.writeFileSync(OUT_JSON, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  console.log(`Z-SSWS shadow verify report: ${OUT_JSON} status=${payload.status}`);
  if (!ok) process.exit(1);
}

main();
