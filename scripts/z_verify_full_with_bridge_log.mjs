#!/usr/bin/env node
/**
 * Runs the full verify pipeline (`verify:full:core`) with inherited stdio,
 * then appends a Z-Bridge log line (best-effort). Exit code always matches
 * the pipeline — logging failures never flip pass/fail.
 */
import { spawnSync } from 'node:child_process';
import { appendZBridgeLog } from './z_bridge/z_bridge_logger.mjs';

const r = spawnSync('npm run verify:full:core', {
  shell: true,
  stdio: 'inherit',
  cwd: process.cwd(),
  env: process.env
});

const code = typeof r.status === 'number' && !Number.isNaN(r.status) ? r.status : 1;
const allPass = code === 0;

try {
  const lr = appendZBridgeLog({
    action: 'verify_full',
    level: allPass ? 'info' : 'warn',
    detail: allPass ? 'pipeline_complete' : 'pipeline_failed',
    meta: {
      exitCode: code,
      verdict: allPass ? 'PASS' : 'FAIL'
    }
  });
  if (!lr.ok) console.warn('[Z-Bridge log]', lr.error);
} catch (e) {
  console.warn('[Z-Bridge log]', e instanceof Error ? e.message : String(e));
}

process.exit(code);
