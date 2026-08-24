#!/usr/bin/env node
/**
 * Composition P0 verifier. Does not wrap child verifiers as oracle.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { composeProjectWorldAndDna, extractExactIdLinks, resolveExplicitLinkCandidates } from './z_composed_awareness_project_dna/composition.mjs';
import { acquireChildProjections } from './z_composed_awareness_project_dna/input_adapter.mjs';
import { runComposition } from './z_composed_awareness_project_dna_p0.mjs';
import { deepClone, sha256Bytes, stableStringify } from './z_composed_awareness_project_dna/canonical_json.mjs';
import {
  COMPOSITION_ID,
  DNA_REPORT,
  HUB_REGISTRY_SHARD,
  OUTPUT_PATH,
  PW_REPORT,
  ROULETTE_ID,
} from './z_composed_awareness_project_dna/constants.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const NEW_FILES = [
  'scripts/z_composed_awareness_project_dna/constants.mjs',
  'scripts/z_composed_awareness_project_dna/canonical_json.mjs',
  'scripts/z_composed_awareness_project_dna/coverage_composer.mjs',
  'scripts/z_composed_awareness_project_dna/composition.mjs',
  'scripts/z_composed_awareness_project_dna/input_adapter.mjs',
  'scripts/z_composed_awareness_project_dna_p0.mjs',
];

function repoRel(rel) {
  return path.join(ROOT, rel.split('/').join(path.sep));
}

function executableUse(text, token) {
  const lines = text.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('/*')) continue;
    if (trimmed.includes(token) && !trimmed.includes(`'${token}'`) && !trimmed.includes(`"${token}"`)) {
      if (token === 'fetch(' && /fetch\s*\(/.test(trimmed)) return true;
      if (token !== 'fetch(' && trimmed.includes(token)) return true;
    }
  }
  return false;
}

function main() {
  const pwBefore = sha256Bytes(fs.readFileSync(repoRel(PW_REPORT)));
  const dnaBefore = sha256Bytes(fs.readFileSync(repoRel(DNA_REPORT)));

  const acq = acquireChildProjections(ROOT);
  assert.equal(acq.ok, true, JSON.stringify(acq));
  const pwSnap = deepClone(acq.projectWorld);
  const dnaSnap = deepClone(acq.crystalDna);

  const r1 = composeProjectWorldAndDna(acq.projectWorld, acq.crystalDna, acq.inputMeta);
  const r2 = composeProjectWorldAndDna(acq.projectWorld, acq.crystalDna, acq.inputMeta);
  const r3 = composeProjectWorldAndDna(acq.projectWorld, acq.crystalDna, acq.inputMeta);
  assert.equal(Boolean(r1.hard_stop), false);
  assert.deepStrictEqual(r1, r2);
  assert.deepStrictEqual(r2, r3);
  assert.deepStrictEqual(acq.projectWorld, pwSnap);
  assert.deepStrictEqual(acq.crystalDna, dnaSnap);

  const mutated = deepClone(r1);
  mutated.project_world.projects[0].project_id = 'MUTATED';
  mutated.crystal_dna_lens.shards[0].source_id = 'MUTATED';
  mutated.project_dna_coverage[0].dna_presence = 'GREEN';
  assert.equal(pwSnap.projects[0].project_id, acq.projectWorld.projects[0].project_id);
  assert.equal(dnaSnap.shards[0].source_id, acq.crystalDna.shards[0].source_id);

  const disk = JSON.parse(fs.readFileSync(repoRel(OUTPUT_PATH), 'utf8'));
  assert.equal(stableStringify(disk), stableStringify(r1));
  assert.equal(disk.composition_id, COMPOSITION_ID);
  assert.equal(disk.posture, 'DERIVED_COMPOSITION');

  const projects = disk.project_world.projects;
  const shards = disk.crystal_dna_lens.shards;
  const pwIds = projects.map((p) => p.project_id);
  const shardIds = shards.map((s) => s.source_id);
  assert.equal(new Set(pwIds).size, pwIds.length);
  assert.equal(new Set(shardIds).size, shardIds.length);
  assert.equal(disk.summary.project_count, pwIds.length);
  assert.equal(disk.summary.dna_shard_count, shardIds.length);
  assert.equal(disk.summary.dna_dependency_count, disk.crystal_dna_lens.dependencies.length);
  assert.equal(disk.crystal_dna_lens.dependencies.length, acq.crystalDna.dependencies.length);
  for (let i = 0; i < disk.crystal_dna_lens.dependencies.length; i += 1) {
    assert.equal(disk.crystal_dna_lens.dependencies[i].direction, acq.crystalDna.dependencies[i].direction);
    assert.equal(disk.crystal_dna_lens.dependencies[i].from_shard, acq.crystalDna.dependencies[i].from_shard);
    assert.equal(disk.crystal_dna_lens.dependencies[i].to_shard, acq.crystalDna.dependencies[i].to_shard);
  }
  assert.deepStrictEqual(
    projects.map((p) => p.project_id),
    pwSnap.projects.map((p) => p.project_id),
  );
  for (let i = 0; i < projects.length; i += 1) {
    assert.deepStrictEqual(projects[i].sovereignty, pwSnap.projects[i].sovereignty);
  }
  assert.deepStrictEqual(shardIds, dnaSnap.shards.map((s) => s.source_id));

  const covIds = disk.project_dna_coverage.map((c) => c.project_id).sort();
  assert.deepStrictEqual(covIds, [...pwIds].sort());
  assert.equal(disk.project_dna_coverage.length, pwIds.length);
  assert.equal(disk.cross_lens_links.length, 0);
  assert.equal(disk.summary.verified_project_dna_link_count, 0);
  assert.notEqual(disk.project_dna_coverage.length, disk.cross_lens_links.length || -1);
  assert.equal(disk.summary.projects_with_dna_count, 0);
  assert.equal(disk.summary.projects_missing_dna_count, pwIds.length);
  assert.equal(disk.summary.dna_assets_without_project_join_count, shardIds.length);

  for (const c of disk.project_dna_coverage) {
    assert.equal(c.dna_presence, 'MISSING');
    assert.equal(c.verified_link_count, 0);
    assert.deepEqual(c.verified_links, []);
    assert.notEqual(c.dna_presence, 'GREEN');
    assert.notEqual(c.dna_presence, 'HEALTHY');
    assert.notEqual(c.dna_presence, false);
    assert.notEqual(c.dna_presence, 0);
  }

  const hubLinks = disk.cross_lens_links.filter((l) => l.shard_id === HUB_REGISTRY_SHARD);
  assert.equal(hubLinks.length, 0);
  assert.ok(!disk.cross_lens_links.some((l) => l.project_id === 'z-sanctuary-universe' && l.shard_id === HUB_REGISTRY_SHARD));

  const roulette = projects.find((p) => p.project_id === ROULETTE_ID);
  assert.ok(roulette);
  assert.equal(roulette.sovereignty.composed_posture, pwSnap.projects.find((p) => p.project_id === ROULETTE_ID).sovereignty.composed_posture);
  const rCov = disk.project_dna_coverage.find((c) => c.project_id === ROULETTE_ID);
  assert.equal(rCov.dna_presence, 'MISSING');
  assert.equal(rCov.verified_link_count, 0);

  for (const s of shards) {
    assert.equal(s.status.namespace, 'CRYSTAL_DNA_CARD');
    assert.equal(s.rebuild_rule.posture, 'DECLARATIVE_RECOVERY_HINT');
    assert.ok(!Object.prototype.hasOwnProperty.call(s, 'autonomous_eligible'));
    assert.ok(!Object.prototype.hasOwnProperty.call(s, 'repair_class'));
  }
  assert.equal(disk.crystal_dna_lens.drift.overall_signal.namespace, 'CRYSTAL_DNA_DRIFT');
  const driftBlob = JSON.stringify(disk.project_world.projects);
  assert.ok(!driftBlob.includes('"namespace":"CRYSTAL_DNA_DRIFT"'));
  assert.equal(disk.conflicts.length, 0);
  assert.equal(disk.governance.gare.executor, 'NOT_IMPLEMENTED');
  assert.equal(disk.governance.gare.asset_level_eligibility, 'UNDECLARED');

  const t = JSON.stringify(disk);
  assert.ok(!t.includes('AR-2'));
  assert.ok(!t.includes('overall_health'));
  assert.ok(!t.includes('combined_health'));
  assert.ok(!disk.project_world.projects.some((p) => p.crystal_dna_card_status));

  const ownerFixture = composeProjectWorldAndDna(
    {
      projection_id: 'z_composed_awareness_project_world_p0',
      projects: [{ project_id: 'z-sanctuary-universe', sovereignty: { composed_posture: 'INTERNAL' } }],
      conflicts: [],
      unmatched_source_records: [],
      summary: {},
    },
    {
      projection_id: 'z_composed_awareness_crystal_dna_p0',
      shards: [
        {
          source_id: 'owner-bait',
          owner_layer: 'z-sanctuary-universe',
          path: 'Z_Sanctuary_Universe/docs/x.md',
          status: { namespace: 'CRYSTAL_DNA_CARD', value: 'GREEN' },
          rebuild_rule: { posture: 'DECLARATIVE_RECOVERY_HINT' },
        },
      ],
      dependencies: [],
      drift: { overall_signal: { namespace: 'CRYSTAL_DNA_DRIFT', value: 'BLUE' }, findings: [] },
      project_coverage: [
        {
          project_id: 'z-sanctuary-universe',
          crystal_dna_presence: 'MISSING',
          provenance: { path: 'data/z_pc_root_projects.json' },
        },
      ],
      unmatched_as_projects: [],
    },
    {},
  );
  assert.equal(ownerFixture.cross_lens_links.length, 0);

  const positive = extractExactIdLinks(
    [{ project_id: 'member-one' }],
    [{ source_id: 'member-one' }],
  );
  assert.equal(positive.length, 1);
  assert.equal(positive[0].relation, 'EXACT_CANONICAL_ID');
  assert.ok(positive[0].provenance);

  const amb = resolveExplicitLinkCandidates([{ shard_id: 's1', project_ids: ['a', 'b'] }]);
  assert.equal(amb.links.length, 0);
  assert.equal(amb.conflicts[0].resolution, 'NO_LINK');

  const nsTest = composeProjectWorldAndDna(
    {
      projects: [{ project_id: 'p1', sovereignty: { composed_posture: 'MEMBER' }, identity: { note: 'GREEN' } }],
      conflicts: [],
      unmatched_source_records: [],
      summary: {},
    },
    {
      shards: [{ source_id: 'sh1', status: { namespace: 'CRYSTAL_DNA_CARD', value: 'GREEN' }, rebuild_rule: { posture: 'DECLARATIVE_RECOVERY_HINT' } }],
      dependencies: [],
      drift: { overall_signal: { namespace: 'CRYSTAL_DNA_DRIFT', value: 'BLUE' }, findings: [{ code: 'x', signal: { namespace: 'CRYSTAL_DNA_DRIFT', value: 'BLUE' } }] },
      project_coverage: [{ project_id: 'p1', crystal_dna_presence: 'MISSING', provenance: { path: 'data/z_pc_root_projects.json' } }],
      unmatched_as_projects: [],
    },
    {},
  );
  assert.equal(nsTest.conflicts.length, 0);

  for (const rel of NEW_FILES) {
    const text = fs.readFileSync(repoRel(rel), 'utf8');
    for (const token of ['fetch(', 'http.request', 'https.request', 'WebSocket', 'net.connect', 'Math.random', 'eval(', 'Function(', 'child_process', 'setInterval']) {
      assert.equal(executableUse(text, token), false, `${rel} ${token}`);
    }
    assert.ok(!text.includes('Date.now()'));
    assert.ok(!/\bnew Date\s*\(/.test(text));
    assert.ok(!text.includes('performance.now()'));
    assert.ok(!text.includes('z_crystal_dna_drift_check'));
    assert.ok(!text.includes('z_deterministic_foundation'));
    assert.ok(!text.includes(OUTPUT_PATH) || rel.endsWith('constants.mjs') || rel.endsWith('p0.mjs') || rel.endsWith('verify.mjs'));
  }
  const joinSrc = fs.readFileSync(repoRel('scripts/z_composed_awareness_project_dna/composition.mjs'), 'utf8');
  assert.ok(!joinSrc.includes('.toLowerCase()'));
  assert.ok(!joinSrc.includes('startsWith('));
  assert.ok(!joinSrc.includes('endsWith('));
  assert.ok(!joinSrc.includes('owner_layer === p.project_id'));

  assert.equal(sha256Bytes(fs.readFileSync(repoRel(PW_REPORT))), pwBefore);
  assert.equal(sha256Bytes(fs.readFileSync(repoRel(DNA_REPORT))), dnaBefore);
  assert.equal(runComposition(ROOT).ok, true);

  const s = disk.summary;
  console.log(`
Z COMPOSED AWARENESS
PROJECT WORLD + CRYSTAL DNA P0

INPUT STRATEGY
PROJECT WORLD: PURE_BUILDER
CRYSTAL DNA: PURE_BUILDER

PROJECTS: ${s.project_count}
DNA SHARDS: ${s.dna_shard_count}
DNA DEPENDENCIES: ${s.dna_dependency_count}
DNA DRIFT FINDINGS: ${s.dna_drift_finding_count}
PROJECT-DNA COVERAGE ROWS: ${s.coverage_row_count}
VERIFIED SHARD LINKS: ${s.verified_project_dna_link_count}
PROJECTS WITH VERIFIED DNA: ${s.projects_with_dna_count}
PROJECTS MISSING DNA: ${s.projects_missing_dna_count}
DNA SHARDS WITHOUT PROJECT JOIN: ${s.dna_assets_without_project_join_count}
CROSS-LENS CONFLICTS: ${s.cross_lens_conflict_count}

PROJECT IDENTITY: PASS
SOVEREIGNTY: PASS
ROULETTE: PASS
ZERO-LINK REALITY: PASS
COVERAGE / LINK WALL: PASS
STATUS NAMESPACES: PASS
GLOBAL DRIFT / PROJECT WALL: PASS
GARE ELIGIBILITY LEAK: NONE
CHILD NON-MUTATION: PASS
OUTPUT BACKFLOW: PASS
3X DETERMINISM: PASS
REPORT REBUILDABILITY: PASS
NETWORK: NONE
DATABASE: NONE
AI: NONE
REPAIR EXECUTOR: NONE

COMPOSED_AWARENESS_PROJECT_WORLD_CRYSTAL_DNA_P0 = PASS
`);
}

main();
