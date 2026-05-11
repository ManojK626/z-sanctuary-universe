#!/usr/bin/env node
/**
 * Overseer-gated IDE runner: ensures hub root, then runs npm verify pipeline.
 * Usage: node scripts/z_aafrtc_ide_run.mjs --ci | --full-core | --full
 */
import { spawnSync } from 'node:child_process';
import { isZSanctuaryHubRoot } from './z_aafrtc_hub_guard.mjs';

const cwd = process.cwd();
if (!isZSanctuaryHubRoot(cwd)) {
  process.stderr.write(
    '[AAFRTC] Refusing to run: cwd is not ZSanctuary_Universe hub. See data/z_aafrtc_policy.json\n'
  );
  process.exit(1);
}

const mode = process.argv.find((a) => a.startsWith('--')) || '--ci';
const map = {
  '--ci': 'verify:ci',
  '--full-core': 'verify:full:core',
  '--full': 'verify:full'
};
const script = map[mode];
if (!script) {
  process.stderr.write('[AAFRTC] Use --ci | --full-core | --full\n');
  process.exit(1);
}

process.stdout.write(`[AAFRTC] Overseer-gated run: npm run ${script}\n`);
const r = spawnSync(`npm run ${script}`, {
  shell: true,
  stdio: 'inherit',
  cwd,
  env: process.env
});
const code = typeof r.status === 'number' && !Number.isNaN(r.status) ? r.status : 1;
process.exit(code);
