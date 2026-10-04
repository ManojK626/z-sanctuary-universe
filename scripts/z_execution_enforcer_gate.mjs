#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';
import { acceptProgress, attestationShapeError, deriveAttestation } from './z_readiness_attestation.mjs';

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

const COHERENT_BLOCK_CODES = new Set([
  'ACTION_NOT_ALLOW_PROGRESS',
  'NOT_READY',
  'STALE',
  'HASH_MISMATCH',
  'MISMATCH',
  'GATE_VECTOR_MISMATCH',
  'COUNT_MISMATCH',
  'READY_MISMATCH',
]);

/**
 * Confirms a recomputed block is internally valid. Never an execution grant.
 * deploy_allowed stays false. ALLOW_PROGRESS is refused here.
 */
export function assessVerifyOnly({ report, fresh, decision, releaseControl }) {
  const refused = (code, action = 'BLOCK') => ({
    verified: false,
    action,
    code,
    deploy_allowed: false,
    execution_authority: 'none',
    accept: false,
  });

  const recomputed = evaluateStoredReport(report, fresh, releaseControl);
  if (
    !decision ||
    recomputed.action !== decision.action ||
    recomputed.code !== decision.code ||
    recomputed.accept !== decision.accept ||
    recomputed.deploy_allowed !== decision.deploy_allowed
  ) {
    return refused('DECISION_MISMATCH');
  }

  if (!fresh || fresh.ok !== true) return refused(fresh?.code || 'SOURCE_MISSING');
  const shape = attestationShapeError(fresh.attestation);
  if (shape) return refused(shape);
  if (fresh.attestation?.override_state === 'INVALID' || fresh.override?.state === 'INVALID') {
    return refused('INVALID_OVERRIDE');
  }
  if (decision.accept === true || decision.action === 'ALLOW_PROGRESS' || decision.deploy_allowed === true) {
    return refused('VERIFY_ONLY_NO_AUTHORITY', decision.action === 'ALLOW_PROGRESS' ? 'ALLOW_PROGRESS' : 'BLOCK');
  }
  if (decision.action !== 'BLOCK' || decision.deploy_allowed !== false) {
    return refused(decision.code || 'UNATTESTED');
  }
  if (!COHERENT_BLOCK_CODES.has(decision.code)) return refused(decision.code || 'UNATTESTED');

  return {
    verified: true,
    action: 'BLOCK',
    code: decision.code,
    deploy_allowed: false,
    execution_authority: 'none',
    accept: false,
  };
}

function invokedDirectly() {
  const arg = process.argv[1];
  if (!arg) return false;
  return import.meta.url === pathToFileURL(arg).href;
}

async function main() {
  const verifyOnly = process.argv.includes('--verify-only');
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

  if (verifyOnly) {
    const verification = assessVerifyOnly({ report, fresh, decision });
    process.stdout.write(
      `[Z-EE] verify-only action=${verification.action} code=${verification.code} deploy_allowed=false execution_authority=none\n`
    );
    if (!verification.verified) {
      process.stderr.write(`[Z-EE] VERIFY FAILED: ${verification.code}\n`);
      process.exit(1);
    }
    process.stdout.write('[Z-EE] Verification succeeded. No execution authority granted.\n');
    return;
  }

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
