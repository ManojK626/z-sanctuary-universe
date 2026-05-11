import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function defaultHubRoot() {
  return path.resolve(__dirname, '..', '..');
}

/**
 * Run the hub's existing verify:ci (structure + registry omni); no duplicated logic.
 * @param {{ cwd?: string, hubRoot?: string }} [options]
 */
export function runVerifyCI(options = {}) {
  const cwd = options.cwd || options.hubRoot || process.env.Z_SANCTUARY_HUB_ROOT || defaultHubRoot();
  const shell = process.platform === 'win32';
  execSync('npm run verify:ci', { stdio: 'inherit', cwd, shell });
}
