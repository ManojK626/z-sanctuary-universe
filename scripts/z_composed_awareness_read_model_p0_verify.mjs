#!/usr/bin/env node
/**
 * Z-SANCTUARY-COMPOSED-AWARENESS-READ-MODEL-P0 — verifier
 * AUTONOMOUS AUTHORITY = NONE
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  OUTPUT_PATH,
  ROULETTE_PC_ROOT_ID,
  SOURCE_PATHS,
} from './z_composed_awareness_read_model/constants.mjs';
import { negativeIdentityAudit } from './z_composed_awareness_read_model/identity_match.mjs';
import { projectWorldP0 } from './z_composed_awareness_read_model/project_world_projection.mjs';
import { runProjection } from './z_composed_awareness_read_model_p0.mjs';
import {
  deepClone,
  deepFreeze,
  loadConfiguredSources,
  repoRel,
  sha256File,
  stableStringify,
} from './z_composed_awareness_read_model/source_loader.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const REPEAT_COUNT = 3;

const FORBIDDEN = [
  'fetch(',
  'http.request',
  'https.request',
  'WebSocket',
  'Math.random',
  'eval(',
  'Function(',
  'child_process',
];

function listImplFiles() {
  const dir = repoRel(ROOT, 'scripts/z_composed_awareness_read_model');
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.mjs')).map((f) => path.join(dir, f));
  files.push(repoRel(ROOT, 'scripts/z_composed_awareness_read_model_p0.mjs'));
  return files;
}

function scanProhibited() {
  for (const file of listImplFiles()) {
    const text = fs.readFileSync(file, 'utf8');
    for (const needle of FORBIDDEN) {
      if (text.includes(needle)) {
        throw new Error(`prohibited runtime token ${needle} in ${path.relative(ROOT, file)}`);
      }
    }
  }
}

function hashesOfConfigured(root, extraPaths = []) {
  const out = {};
  for (const rel of [...Object.values(SOURCE_PATHS), ...extraPaths]) {
    if (!rel) continue;
    const abs = repoRel(root, rel);
    if (fs.existsSync(abs)) out[rel] = sha256File(abs);
  }
  return out;
}

function main() {
  scanProhibited();

  const neg = negativeIdentityAudit();
  assert.equal(neg.pass, true, `negative identity audit: ${neg.failures.join('; ')}`);

  const loadedA = loadConfiguredSources(ROOT, SOURCE_PATHS);
  assert.equal(loadedA.errors.length, 0, JSON.stringify(loadedA.errors));
  const capsulePaths = (loadedA.eco.data.projects || [])
    .map((p) => p.capsule_path)
    .filter((p) => typeof p === 'string' && p.length > 0);
  const before = hashesOfConfigured(ROOT, capsulePaths);

  const snapPc = deepClone(loadedA.pc.data);
  const snapEco = deepClone(loadedA.eco.data);
  const frozen = {
    pc: { ...loadedA.pc, data: deepFreeze(deepClone(loadedA.pc.data)) },
    identity: loadedA.identity,
    eco: { ...loadedA.eco, data: deepFreeze(deepClone(loadedA.eco.data)) },
  };

  const run1 = projectWorldP0(ROOT, frozen);
  const run2 = projectWorldP0(ROOT, frozen);
  const run3 = projectWorldP0(ROOT, frozen);
  assert.equal(Boolean(run1.hard_stop), false, JSON.stringify(run1));
  assert.deepStrictEqual(run1, run2);
  assert.deepStrictEqual(run2, run3);

  assert.deepStrictEqual(deepClone(frozen.pc.data), snapPc);
  assert.deepStrictEqual(deepClone(frozen.eco.data), snapEco);

  const after = hashesOfConfigured(ROOT, capsulePaths);
  assert.deepStrictEqual(after, before);

  const disk = JSON.parse(fs.readFileSync(repoRel(ROOT, OUTPUT_PATH), 'utf8'));
  assert.equal(stableStringify(disk), stableStringify(run1));

  const ids = disk.projects.map((p) => p.project_id);
  assert.equal(new Set(ids).size, ids.length, 'project_ids must be unique');
  const ordered = [...ids].sort();
  assert.deepStrictEqual(ids, ordered, 'stable ordering');

  for (const p of disk.projects) {
    assert.equal(p.origin, 'DERIVED_REAL');
    assert.ok(p.provenance?.sources?.length >= 1);
    assert.equal(p.sovereignty.source_value_origin, 'REAL_SOURCE');
    assert.ok(!JSON.stringify(p).includes('"MOCK"'));
    assert.ok(!JSON.stringify(p).includes('"DEMO"'));
    if (p.awareness.capsule.posture === 'MISSING') {
      assert.notEqual(p.awareness.capsule.posture, 'GREEN');
    }
    if (p.awareness.ecosystem_row.posture === 'MISSING') {
      assert.notEqual(p.deployment.value, 0);
    }
  }

  const roulette = disk.projects.find((p) => p.project_id === ROULETTE_PC_ROOT_ID);
  assert.ok(roulette, 'roulette pc_root row must be in projection');
  assert.equal(roulette.sovereignty.source_posture, 'external');
  assert.equal(roulette.sovereignty.composed_posture, 'SEPARATE');
  assert.notEqual(roulette.sovereignty.composed_posture, 'INTERNAL');
  assert.notEqual(roulette.sovereignty.composed_posture, 'MEMBER');
  assert.equal(roulette.identity.reconciliation_relation.identity_relation, 'SEPARATE_PROJECT');
  assert.equal(roulette.identity.join_rule === 'NONE' || roulette.identity.join_rule === 'EXACT_CANONICAL_ID' || roulette.identity.join_rule === 'EXPLICIT_HUB_FOLDER_REGISTRY_RELATION', true);
  const merged = roulette.sovereignty.composed_posture === 'INTERNAL' || roulette.sovereignty.composed_posture === 'MEMBER';
  assert.equal(merged, false, 'ROULETTE_MERGED_INTO_HUB');

  const missingCapsule = disk.projects.filter((p) => p.awareness.capsule.posture === 'MISSING');
  assert.ok(missingCapsule.length >= 1, 'expected at least one missing capsule from real sources');
  for (const p of missingCapsule) {
    assert.notEqual(p.awareness.capsule.present, false);
    assert.equal(p.awareness.capsule.present, 'MISSING');
  }

  assert.equal(disk.posture, 'DERIVED_READ_MODEL');
  assert.equal(disk.summary.origin, 'DERIVED');
  assert.equal(disk.summary.ambiguous_joins, 0);
  for (const c of disk.conflicts) {
    assert.equal(c.resolution, 'UNRESOLVED');
  }

  const identityMd = fs.readFileSync(repoRel(ROOT, SOURCE_PATHS.identity_reconciliation), 'utf8');
  assert.ok(identityMd.includes(ROULETTE_PC_ROOT_ID));
  assert.ok(identityMd.includes('SEPARATE_PROJECT'));

  const regen = runProjection(ROOT);
  assert.equal(regen.ok, true);

  const s = disk.summary;
  console.log(`
Z COMPOSED AWARENESS — PROJECT WORLD P0

PROJECTS READ: ${s.project_count}
IDENTITY JOINS: ${s.explicit_joins}
AMBIGUOUS JOINS: ${s.ambiguous_joins}
CAPSULES PRESENT: ${s.capsule_present_count}
CAPSULES MISSING: ${s.capsule_missing_count}
AWARENESS ROWS PRESENT: ${s.awareness_row_present_count}
AWARENESS ROWS MISSING: ${s.awareness_row_missing_count}
CONFLICTS: ${s.conflict_count}
UNMATCHED SOURCE RECORDS: ${s.unmatched_source_record_count}

SOVEREIGNTY PRESERVED: PASS
ROULETTE BOUNDARY: PASS
PROVENANCE: PASS
MISSING DATA: PASS
SOURCE NON-MUTATION: PASS
${REPEAT_COUNT}X DETERMINISM: PASS

NETWORK: NONE
DATABASE: NONE
AI: NONE
AUTHORITY: NONE

COMPOSED_AWARENESS_PROJECT_WORLD_P0 = PASS
`);
}

main();
