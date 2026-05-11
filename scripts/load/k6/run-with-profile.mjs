/**
 * Cross-platform helper: sets K6_PROFILE=heavy when argv[2] === "heavy", then runs k6.
 * Usage: node scripts/load/k6/run-with-profile.mjs [heavy]
 */
import { spawnSync } from 'node:child_process';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { resolveK6Binary } from './resolve-k6.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const scriptPath = path.join(__dirname, 'web-smoke.js');
const mode = process.argv[2];

const k6 = resolveK6Binary();
if (!k6) {
  console.error(
    '[stress:http] k6 not found. Install: https://k6.io/docs/get-started/installation/ (Windows: winget install GrafanaLabs.k6)',
  );
  process.exit(1);
}

const env = { ...process.env };
if (mode === 'heavy') {
  env.K6_PROFILE = 'heavy';
} else {
  env.K6_PROFILE = env.K6_PROFILE || 'smoke';
}
if (process.platform === 'win32' && path.dirname(k6)) {
  env.PATH = `${path.dirname(k6)}${path.delimiter}${env.PATH || ''}`;
}

const r = spawnSync(k6, ['run', scriptPath], {
  stdio: 'inherit',
  env,
});

process.exit(r.status === null ? 1 : r.status);
