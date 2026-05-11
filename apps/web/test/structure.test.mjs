import test from 'node:test';
import assert from 'node:assert/strict';
import { stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test('web src layout exists', async () => {
  const appDir = path.join(__dirname, '..', 'src', 'app');
  const componentsDir = path.join(__dirname, '..', 'src', 'components');
  const libDir = path.join(__dirname, '..', 'src', 'lib');
  const appInfo = await stat(appDir);
  const compInfo = await stat(componentsDir);
  const libInfo = await stat(libDir);
  assert.ok(appInfo.isDirectory(), 'expected src/app directory');
  assert.ok(compInfo.isDirectory(), 'expected src/components directory');
  assert.ok(libInfo.isDirectory(), 'expected src/lib directory');
});

test('web app entrypoints exist', async () => {
  const layoutPath = path.join(__dirname, '..', 'src', 'app', 'layout.jsx');
  const pagePath = path.join(__dirname, '..', 'src', 'app', 'page.jsx');
  const layoutInfo = await stat(layoutPath);
  const pageInfo = await stat(pagePath);
  assert.ok(layoutInfo.isFile(), 'expected src/app/layout.jsx');
  assert.ok(pageInfo.isFile(), 'expected src/app/page.jsx');
});

test('next config can be loaded', async () => {
  const cfgPath = path.join(__dirname, '..', 'next.config.js');
  const require = createRequire(import.meta.url);
  const config = require(cfgPath);
  assert.ok(config, 'expected next.config.js to export config');
});

test('next package is resolvable for builds', async () => {
  const require = createRequire(import.meta.url);
  const nextPkg = require.resolve('next/package.json');
  assert.ok(nextPkg, 'expected next to be installed');
});

test('next build smoke', { skip: process.env.RUN_NEXT_BUILD_SMOKE !== '1' }, async () => {
  const projectRoot = path.join(__dirname, '..');
  const isWin = process.platform === 'win32';
  const cmd = isWin ? 'cmd.exe' : 'npx';
  const args = isWin
    ? ['/d', '/s', '/c', 'npx', 'next', 'build', '--no-lint']
    : ['next', 'build', '--no-lint'];
  const result = spawnSync(cmd, args, {
    cwd: projectRoot,
    stdio: 'inherit'
  });
  assert.equal(result.status, 0, 'expected next build to succeed');
});
