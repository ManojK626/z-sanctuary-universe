#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';
import { acceptProgress, deriveAttestation } from './z_readiness_attestation.mjs';

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

function printSummary(report) {
  const checks = report?.checks || {};
  process.stdout.write(
    `[Z-EE] action=${report.action} | p1_open=${checks.p1_open ?? '--'} | readiness=${checks.readiness_pass ?? '--'}/${checks.readiness_total ?? '--'} | release=${checks.release_gate ?? '--'}\n`
  );
}

/**
 * Stored ALLOW_PROGRESS is not authority. Caller must pass a freshly derived attestation,
 * including when the enforcer report refresh was skipped.
 */
export function evaluateStoredReport(report, fresh, releaseControl) {
  return acceptProgress({
    action: report?.action,
    storedAttestation: report?.readiness_attestation ?? null,
    fresh,
    releaseControl,
  });
}

function invokedDirectly() {
  const arg = process.argv[1];
  if (!arg) return false;
  return import.meta.url === pathToFileURL(arg).href;
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

  const fresh = await deriveAttestation({ root: ROOT });
  const decision = evaluateStoredReport(report, fresh);
  printSummary(report);
  if (decision.action !== 'ALLOW_PROGRESS' || !decision.accept) {
    process.stderr.write(`[Z-EE] BLOCKED: ${decision.code}\n`);
    process.stderr.write('[Z-EE] Resolve blockers, then rerun gate.\n');
    process.exit(2);
  }

  process.stdout.write('[Z-EE] Gate passed.\n');
}

if (invokedDirectly()) {
  main().catch((error) => {
    process.stderr.write(`[Z-EE] Gate failed: ${error?.message || String(error)}\n`);
    process.exit(1);
  });
}
