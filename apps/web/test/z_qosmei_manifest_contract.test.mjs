import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
/** Repo root = apps/web/test → ../../../ */
const MANIFEST_PATH = path.join(__dirname, '..', '..', '..', 'data', 'z_qosmei_manifest.json');

test('z_qosmei manifest: ethics.claimsScope contract (prevents UI/manifest drift)', async () => {
  const raw = await readFile(MANIFEST_PATH, 'utf-8');
  const m = JSON.parse(raw);
  assert.equal(m.id, 'z-qosmei');
  assert.ok(m.ethics && typeof m.ethics === 'object');
  assert.ok(m.ethics.claimsScope && typeof m.ethics.claimsScope === 'object');
  const { operational, observation } = m.ethics.claimsScope;
  assert.equal(typeof operational, 'string');
  assert.equal(typeof observation, 'string');
  assert.ok(operational.trim().length > 20, 'operational claimsScope should be substantive');
  assert.ok(observation.trim().length > 20, 'observation claimsScope should be substantive');
});
