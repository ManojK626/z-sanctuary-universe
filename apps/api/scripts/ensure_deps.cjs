const { existsSync } = require('node:fs');
const { spawnSync } = require('node:child_process');
const path = require('node:path');

const apiRoot = path.resolve(__dirname, '..');
const repoRoot = path.resolve(apiRoot, '..', '..');
const expressLocal = path.join(apiRoot, 'node_modules', 'express');
const expressHoisted = path.join(repoRoot, 'node_modules', 'express');

if (existsSync(expressLocal) || existsSync(expressHoisted)) {
  process.exit(0);
}

const result = spawnSync('npm', ['install', '--no-audit', '--no-fund'], {
  cwd: repoRoot,
  stdio: 'inherit'
});

if (result.status !== 0) {
  process.exit(result.status);
}
