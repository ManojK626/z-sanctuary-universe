import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test('api workspace smoke', async () => {
  const pkgPath = path.join(__dirname, '..', 'package.json');
  const raw = await readFile(pkgPath, 'utf-8');
  const pkg = JSON.parse(raw);
  assert.equal(pkg.name, 'z-sanctuary-api');
  assert.ok(pkg.scripts && pkg.scripts.dev, 'expected dev script');
});
