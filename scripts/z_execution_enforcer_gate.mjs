#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const ROOT = process.cwd();
const REPORT_PATH = path.join(ROOT, 'data', 'reports', 'z_execution_enforcer.json');

function runEnforcerRefresh() {
  const nodeCmd = process.execPath;
  const result = spawnSync(nodeCmd, ['scripts/z_execution_enforcer.mjs'], {
    cwd: ROOT,
    stdio: 'inherit',
    shell: false,
  });
  return !result.error && (result.status ?? 1) === 0;
}

async function readReport() {
  try {
    const raw = await fs.readFile(REPORT_PATH, 'utf8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function normalize(value, fallback = '') {
  return String(value || fallback).trim().toUpperCase();
}

function printSummary(report) {
  const checks = report?.checks || {};
  process.stdout.write(
    `[Z-EE] action=${report.action} | p1_open=${checks.p1_open ?? '--'} | readiness=${checks.readiness_pass ?? '--'}/${checks.readiness_total ?? '--'} | release=${checks.release_gate ?? '--'}\n`
  );
}

function ensureAllowed(report) {
  const action = normalize(report?.action, 'UNKNOWN');
  if (action === 'BLOCK') {
    const reason = report?.reason || 'Execution Enforcer requested BLOCK.';
    process.stderr.write(`[Z-EE] BLOCKED: ${reason}\n`);
    process.stderr.write('[Z-EE] Resolve blockers, then rerun gate.\n');
    return false;
  }
  return true;
}

async function main() {
  const skipRefresh = process.argv.includes('--skip-refresh');
  if (!skipRefresh) {
    const refreshed = runEnforcerRefresh();
    if (!refreshed) {
      process.stderr.write('[Z-EE] Failed to refresh execution enforcer report.\n');
      process.exit(1);
    }
  }

  const report = await readReport();
  if (!report) {
    process.stderr.write('[Z-EE] Missing z_execution_enforcer.json report.\n');
    process.exit(1);
  }

  printSummary(report);
  if (!ensureAllowed(report)) {
    process.exit(2);
  }

  process.stdout.write('[Z-EE] Gate passed.\n');
}

main().catch((error) => {
  process.stderr.write(`[Z-EE] Gate failed: ${error?.message || String(error)}\n`);
  process.exit(1);
});
