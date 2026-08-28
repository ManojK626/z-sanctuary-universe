import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { bindIntake } from './z_creator_intake_bind.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const INTAKE_PATH = path.join(ROOT, 'data', 'reconciliation', 'z_creator_p2a_first_creation_intake.json');

function validRecord() {
  return JSON.parse(fs.readFileSync(INTAKE_PATH, 'utf8'));
}

test('valid documentation/spec intake → accepted', () => {
  const result = bindIntake(validRecord(), { checkCharterFile: true, hubRoot: ROOT });
  assert.equal(result.ok, true, result.errors.join('; '));
  assert.equal(result.bound.request_id, 'req-z-creator-p2a-001');
  assert.equal(result.bound.task_plan_id, 'plan-z-creator-p2a-001');
  assert.equal(result.bound.domain, 'DOCUMENTATION_SPECIFICATION');
  assert.equal(result.bound.executable, false);
});

test('missing charter → rejected', () => {
  const rec = validRecord();
  delete rec.charter;
  const result = bindIntake(rec, { checkCharterFile: false });
  assert.equal(result.ok, false);
  assert.ok(result.errors.some((e) => e.includes('missing human charter')));
});

test('deploy/runtime authority → rejected', () => {
  const rec = validRecord();
  rec.authority.deployment = 'REQUESTED';
  const result = bindIntake(rec, { checkCharterFile: false });
  assert.equal(result.ok, false);
  assert.ok(result.errors.some((e) => e.includes('runtime/deploy authority requested')));
});

test('forbidden path → rejected', () => {
  const rec = validRecord();
  rec.requested_artefact = 'docs/INDEX.md';
  rec.scope.allowed_paths = ['docs/INDEX.md'];
  const result = bindIntake(rec, { checkCharterFile: false });
  assert.equal(result.ok, false);
  assert.ok(result.errors.some((e) => e.includes('forbidden path')));
});

test('unsupported domain → rejected', () => {
  const rec = validRecord();
  rec.domain = 'MEDIA_GENERATION';
  const result = bindIntake(rec, { checkCharterFile: false });
  assert.equal(result.ok, false);
  assert.ok(result.errors.some((e) => e.includes('unsupported domain')));
});
