#!/usr/bin/env node
/**
 * Z-GOLDEN-DOORWAY-A11Y-HUMAN-VALIDATION-PREP-1
 * Prep integrity only. Does not certify accessibility or run a screen reader.
 */
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

const REQUIRED_DOCS = [
  'docs/golden-website/Z_GOLDEN_DOORWAY_A11Y_HUMAN_VALIDATION_PREP_1.md',
  'docs/golden-website/Z_GOLDEN_DOORWAY_A11Y_HUMAN_EVIDENCE_TEMPLATE.md',
  'docs/golden-website/PHASE_Z_GOLDEN_DOORWAY_A11Y_HUMAN_VALIDATION_PREP_1_GREEN_RECEIPT.md',
  'docs/golden-website/GW_13_HUMAN_SCREEN_READER_ACCEPTANCE.md'
];

function readJson(rel) {
  const p = path.join(ROOT, rel);
  assert.ok(fs.existsSync(p), `missing ${rel}`);
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function sha256File(rel) {
  return crypto.createHash('sha256').update(fs.readFileSync(path.join(ROOT, rel))).digest('hex');
}

function main() {
  for (const rel of REQUIRED_DOCS) {
    assert.ok(fs.existsSync(path.join(ROOT, rel)), `missing ${rel}`);
  }

  const prep = readJson('data/golden-website/z_golden_doorway_a11y_human_validation_prep_1.json');
  assert.equal(prep.prep_id, 'Z-GOLDEN-DOORWAY-A11Y-HUMAN-VALIDATION-PREP-1');
  assert.equal(prep.status, 'PREP_ONLY');
  assert.equal(prep.human_session_result, 'NOT_RUN');
  assert.equal(prep.human_overall, 'NOT_RECORDED');
  assert.equal(prep.accessibility_certified, false);
  assert.equal(prep.automated_check_equals_human_evidence, false);
  assert.equal(prep.gw13_blocker, 'HUMAN_SCREEN_READER_VALIDATION_PENDING');
  assert.equal(prep.gw13a, 'CLOSED');
  assert.equal(prep.gw14, 'CLOSED');
  assert.equal(prep.publication_authorization, false);
  assert.equal(prep.deployment_authorization, false);
  assert.equal(prep.recruitment_authorization, false);
  assert.equal(prep.telemetry_installation, false);
  assert.equal(prep.shell_mutation_this_phase, false);
  assert.equal(prep.findings.length, 0);
  assert.equal(prep.source_registry_digest, 'd1f108dc9a405221977f35d0a19306d47f2713e08dd4aa02488234de9e84245d');
  assert.equal(prep.evidence_review_digest, '2ebba9f91efc60f017870b58589d634c581211cd2ecbb8ceae14fadd96a05ee2');

  assert.ok(Array.isArray(prep.frozen_shell) && prep.frozen_shell.length > 20);
  for (const row of prep.frozen_shell) {
    assert.equal(sha256File(row.path), row.sha256, `freeze mismatch ${row.path}`);
  }

  const form = fs.readFileSync(path.join(ROOT, 'docs/golden-website/GW_13_HUMAN_SCREEN_READER_ACCEPTANCE.md'), 'utf8');
  assert.ok(form.includes('BLANK FORM'));
  assert.ok(form.includes('not completed'));
  assert.ok(form.includes('GW-14 is **CLOSED**'));
  const afterNotes = (form.split('Tester notes:')[1] || '').trim();
  assert.equal(afterNotes, '', 'human form tester notes must remain blank');

  const blockers = fs.readFileSync(path.join(ROOT, 'docs/golden-website/GW_13_PUBLIC_PILOT_BLOCKERS.md'), 'utf8');
  assert.ok(blockers.includes('HUMAN_SCREEN_READER_VALIDATION_PENDING'));

  const template = fs.readFileSync(
    path.join(ROOT, 'docs/golden-website/Z_GOLDEN_DOORWAY_A11Y_HUMAN_EVIDENCE_TEMPLATE.md'),
    'utf8'
  );
  assert.ok(template.includes('NOT_RUN'));
  assert.ok(template.includes('NOT_RECORDED'));
  assert.ok(template.includes('NO ISSUE OBSERVED ≠ ACCESSIBILITY CERTIFIED'));

  const receipt = fs.readFileSync(
    path.join(ROOT, 'docs/golden-website/PHASE_Z_GOLDEN_DOORWAY_A11Y_HUMAN_VALIDATION_PREP_1_GREEN_RECEIPT.md'),
    'utf8'
  );
  assert.ok(receipt.includes('GREEN — PREP ONLY'));
  assert.ok(receipt.includes('NOT_RUN'));

  console.log('z:golden:doorway:a11y-prep:verify PASS');
  console.log('human_session_result NOT_RUN');
  console.log(`frozen_files ${prep.frozen_shell.length}`);
}

const isDirect =
  process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isDirect) main();
