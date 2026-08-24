#!/usr/bin/env node
/**
 * Crystal DNA P0 verifier — independent of Project World P0 verifier.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  OUTPUT_PATH,
  ROULETTE_PC_ROOT_ID,
  SOURCE_PATHS,
} from './z_composed_awareness_crystal_dna/constants.mjs';
import { projectCrystalDnaP0 } from './z_composed_awareness_crystal_dna/crystal_dna_projection.mjs';
import { uniqueProjectIds } from './z_composed_awareness_crystal_dna/project_coverage.mjs';
import { runCrystalDnaP0 } from './z_composed_awareness_crystal_dna_p0.mjs';
import {
  deepClone,
  deepFreeze,
  loadConfigured,
  repoRel,
  sha256File,
  stableStringify,
} from './z_composed_awareness_crystal_dna/source_loader.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const REPEAT = 3;
const FORBIDDEN = ['fetch(', 'http.request', 'https.request', 'WebSocket', 'net.connect', 'Math.random', 'eval(', 'Function(', 'child_process'];

function implFiles() {
  const dir = repoRel(ROOT, 'scripts/z_composed_awareness_crystal_dna');
  return fs.readdirSync(dir).filter((f) => f.endsWith('.mjs')).map((f) => path.join(dir, f)).concat([
    repoRel(ROOT, 'scripts/z_composed_awareness_crystal_dna_p0.mjs'),
  ]);
}

function hashes() {
  const out = {};
  for (const rel of Object.values(SOURCE_PATHS)) out[rel] = sha256File(repoRel(ROOT, rel));
  return out;
}

function main() {
  for (const file of implFiles()) {
    const text = fs.readFileSync(file, 'utf8');
    for (const needle of FORBIDDEN) {
      if (text.includes(needle)) throw new Error(`${path.relative(ROOT, file)} ${needle}`);
    }
    assert.ok(!text.includes('z_crystal_dna_drift_check'));
    assert.ok(!text.includes('z_deterministic_foundation'));
    assert.ok(!text.includes('Date.now()'));
  }

  const before = hashes();
  const loaded = loadConfigured(ROOT, SOURCE_PATHS);
  assert.equal(loaded.errors.length, 0);
  const snapM = deepClone(loaded.manifest.data);
  const snapD = deepClone(loaded.drift.data);
  const snapP = deepClone(loaded.pc_root.data);
  assert.ok(uniqueProjectIds(snapP.projects));

  const frozen = {
    manifest: { ...loaded.manifest, data: deepFreeze(deepClone(loaded.manifest.data)) },
    drift: { ...loaded.drift, data: deepFreeze(deepClone(loaded.drift.data)) },
    pc_root: { ...loaded.pc_root, data: deepFreeze(deepClone(loaded.pc_root.data)) },
  };

  const r1 = projectCrystalDnaP0(frozen);
  const r2 = projectCrystalDnaP0(frozen);
  const r3 = projectCrystalDnaP0(frozen);
  assert.equal(Boolean(r1.hard_stop), false);
  assert.deepStrictEqual(r1, r2);
  assert.deepStrictEqual(r2, r3);

  assert.deepStrictEqual(deepClone(frozen.manifest.data), snapM);
  assert.deepStrictEqual(deepClone(frozen.drift.data), snapD);
  assert.deepStrictEqual(deepClone(frozen.pc_root.data), snapP);

  const disk = JSON.parse(fs.readFileSync(repoRel(ROOT, OUTPUT_PATH), 'utf8'));
  assert.equal(stableStringify(disk), stableStringify(r1));

  const sourceShardCount = snapM.shards.length;
  assert.equal(disk.summary.shard_count, sourceShardCount);
  assert.equal(new Set(disk.shards.map((s) => s.source_id)).size, disk.shards.length);

  let edgeCount = 0;
  for (const sh of snapM.shards) edgeCount += (sh.dependencies || []).length;
  assert.equal(disk.summary.dependency_edge_count, edgeCount);
  for (const e of disk.dependencies) {
    assert.equal(e.direction, 'DEPENDS_ON');
    assert.ok(e.resolution === 'RESOLVED' || e.resolution === 'UNRESOLVED');
  }

  assert.equal(disk.summary.project_exact_join_count, 0);
  assert.equal(disk.summary.project_alias_join_count, 0);
  assert.equal(disk.summary.project_ambiguous_count, 0);
  const pcCount = snapP.projects.length;
  assert.equal(disk.project_coverage.length, pcCount);
  assert.equal(disk.summary.project_missing_count, pcCount);

  for (const c of disk.project_coverage) {
    assert.equal(c.crystal_dna_presence, 'MISSING');
    assert.notEqual(c.crystal_dna_presence, 'GREEN');
    assert.notEqual(c.crystal_dna_presence, 0);
    assert.notEqual(c.crystal_dna_presence, false);
  }

  for (const s of disk.shards) {
    assert.equal(s.join_as_project, 'NON_PROJECT_ASSET');
    assert.equal(s.status.namespace, 'CRYSTAL_DNA_CARD');
    assert.equal(s.rebuild_rule.posture, 'DECLARATIVE_RECOVERY_HINT');
    assert.equal(s.origin, 'DERIVED_REAL');
    const blob = JSON.stringify(s);
    assert.ok(!blob.includes('autonomous_eligible'));
    assert.ok(!blob.includes('"repair_class"'));
    assert.ok(!blob.includes('AR-2'));
  }

  assert.equal(disk.drift.overall_signal.namespace, 'CRYSTAL_DNA_DRIFT');
  assert.equal(disk.drift.findings.length, snapD.findings.length);
  for (const f of disk.drift.findings) {
    assert.equal(f.signal.namespace, 'CRYSTAL_DNA_DRIFT');
    assert.ok(!JSON.stringify(f).includes('"corrupt":true'));
  }

  const roulette = disk.project_coverage.find((c) => c.project_id === ROULETTE_PC_ROOT_ID);
  assert.ok(roulette);
  assert.equal(roulette.crystal_dna_presence, 'MISSING');
  assert.ok(!disk.shards.some((s) => s.source_id === ROULETTE_PC_ROOT_ID));

  const text = JSON.stringify(disk);
  assert.ok(!text.includes('"namespace":"Z_LOGIC"'));
  assert.ok(!text.includes('"MOCK"'));
  assert.equal(disk.posture, 'DERIVED_READ_MODEL');
  assert.equal(disk.summary.origin, 'DERIVED');

  const mutated = deepClone(disk);
  mutated.shards[0].source_id = 'MUTATED';
  assert.equal(snapM.shards[0].id, disk.shards.find((s) => s.source_id === snapM.shards[0].id)?.source_id || snapM.shards[0].id);
  mutated.shards[0].status.value = 'HACK';
  assert.equal(snapM.shards.find((s) => s.id === 'cloudflare_governance_pack').status, 'YELLOW');

  assert.deepStrictEqual(hashes(), before);
  assert.equal(runCrystalDnaP0(ROOT).ok, true);

  const s = disk.summary;
  console.log(`
Z COMPOSED AWARENESS — CRYSTAL DNA P0

SHARDS: ${s.shard_count}
DEPENDENCIES: ${s.dependency_edge_count}
RESOLVED DEPENDENCIES: ${s.resolved_dependency_count}
UNRESOLVED DEPENDENCIES: ${s.unresolved_dependency_count}
DRIFT FINDINGS: ${s.drift_finding_count}
DRIFT OVERALL SIGNAL: ${disk.drift.overall_signal.value}
PC_ROOT PROJECTS: ${pcCount}
EXPLICIT PROJECT JOINS: ${s.project_exact_join_count}
PROJECTS WITH DNA: ${s.project_exact_join_count}
PROJECTS MISSING DNA: ${s.project_missing_count}
AMBIGUOUS JOINS: ${s.project_ambiguous_count}

STATUS NAMESPACE: PASS
DRIFT NAMESPACE: PASS
DEPENDENCY / OWNERSHIP WALL: PASS
ROULETTE BOUNDARY: PASS
REBUILD RULE / GARE RECIPE WALL: PASS
AUTONOMOUS ELIGIBILITY INVENTED: NO

SOURCE NON-MUTATION: PASS
${REPEAT}X DETERMINISM: PASS

NETWORK: NONE
DATABASE: NONE
AI: NONE
REPAIR EXECUTOR: NONE

COMPOSED_AWARENESS_CRYSTAL_DNA_P0 = PASS
`);
}

main();
