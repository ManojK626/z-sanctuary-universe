/**
 * Lint sibling repo Z-Sanctuary Claude markdown using this hub's .markdownlint.json.
 * markdownlint-cli rejects globs outside cwd; we run the CLI with cwd = Core root.
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const universeRoot = path.resolve(__dirname, '..');
const claudeRoot = path.resolve(universeRoot, '..', 'Z-Sanctuary Claude');
const configPath = path.join(universeRoot, '.markdownlint.json');
const cliJs = path.join(
  universeRoot,
  'node_modules',
  'markdownlint-cli',
  'markdownlint.js'
);

if (!fs.existsSync(claudeRoot)) {
  console.warn(
    '[lint:md:z-sanctuary-claude] Skip: folder not found:\n  ' + claudeRoot
  );
  process.exit(0);
}

if (!fs.existsSync(cliJs)) {
  console.error('[lint:md:z-sanctuary-claude] markdownlint-cli not found at:\n  ' + cliJs);
  console.error('Run npm install in Z_Sanctuary_Universe.');
  process.exit(1);
}

const args = [
  cliJs,
  '-c',
  configPath,
  '--ignore',
  '**/node_modules/**',
  '**/*.md'
];
// Use `node markdownlint.js` so paths with spaces work on Windows (no `.cmd` + shell).
const result = spawnSync(process.execPath, args, {
  cwd: claudeRoot,
  stdio: 'inherit',
  shell: false
});
process.exit(result.status === null ? 1 : result.status);
