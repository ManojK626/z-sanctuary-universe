#!/usr/bin/env node
/**
 * Three-lens P0 verifier. Independent of generator exit code.
 * Does not import child verifiers as oracles.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { composeProjectWorldAndDna } from './z_composed_awareness_project_dna/composition.mjs';
import { deepClone, sha256Bytes, stableStringify } from './z_composed_awareness_project_dna/canonical_json.mjs';
import { acquireThreeChildProjections } from './z_composed_awareness_project_dna_ai/acquire.mjs';
import { deriveCrossLensConflicts } from './z_composed_awareness_project_dna_ai/conflict_channel.mjs';
import { composeProjectDnaAi } from './z_composed_awareness_project_dna_ai/composition.mjs';
import {
  AI_REPORT,
  COMPOSITION_ID,
  DNA_REPORT,
  OUTPUT_PATH,
  PW_REPORT,
  ROULETTE_ID,
  TWO_LENS_REPORT,
} from './z_composed_awareness_project_dna_ai/constants.mjs';
import {
  gateAiEcosphereVersion,
  gateChildVersions,
  gateCrystalDnaVersion,
  gateProjectWorldVersion,
} from './z_composed_awareness_project_dna_ai/version_gate.mjs';
import { runThreeLensComposition } from './z_composed_awareness_project_dna_ai_p0.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const NEW_FILES = [
  'scripts/z_composed_awareness_project_dna_ai/constants.mjs',
  'scripts/z_composed_awareness_project_dna_ai/version_gate.mjs',
  'scripts/z_composed_awareness_project_dna_ai/conflict_channel.mjs',
  'scripts/z_composed_awareness_project_dna_ai/acquire.mjs',
  'scripts/z_composed_awareness_project_dna_ai/composition.mjs',
  'scripts/z_composed_awareness_project_dna_ai_p0.mjs',
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
  const aiBefore = sha256Bytes(fs.readFileSync(repoRel(AI_REPORT)));
  const twoBefore = sha256Bytes(fs.readFileSync(repoRel(TWO_LENS_REPORT)));

  const acq = acquireThreeChildProjections(ROOT);
  assert.equal(acq.ok, true, JSON.stringify(acq));
  const pwSnap = deepClone(acq.projectWorld);
  const dnaSnap = deepClone(acq.crystalDna);
  const aiSnap = deepClone(acq.aiEcosphere);

  assert.equal(gateProjectWorldVersion(acq.projectWorld).ok, true);
  assert.equal(gateCrystalDnaVersion(acq.crystalDna).ok, true);
  assert.equal(gateAiEcosphereVersion(acq.aiEcosphere).ok, true);
  assert.equal(gateChildVersions(acq.projectWorld, acq.crystalDna, acq.aiEcosphere).ok, true);

  const badPw = { ...acq.projectWorld, implementation_version: 'pw-v99-unsupported' };
  assert.equal(gateProjectWorldVersion(badPw).hard_stop, 'THREE_LENS_UNSUPPORTED_PROJECT_WORLD_VERSION');
  assert.equal(composeProjectDnaAi(badPw, acq.crystalDna, acq.aiEcosphere, acq.inputMeta).hard_stop, 'THREE_LENS_UNSUPPORTED_PROJECT_WORLD_VERSION');

  const badDna = { ...acq.crystalDna, implementation_version: 'dna-v99-unsupported' };
  assert.equal(gateCrystalDnaVersion(badDna).hard_stop, 'THREE_LENS_UNSUPPORTED_CRYSTAL_DNA_VERSION');
  assert.equal(composeProjectDnaAi(acq.projectWorld, badDna, acq.aiEcosphere, acq.inputMeta).hard_stop, 'THREE_LENS_UNSUPPORTED_CRYSTAL_DNA_VERSION');

  const badAi = { ...acq.aiEcosphere, projection_version: 'ai-v99-unsupported' };
  assert.equal(gateAiEcosphereVersion(badAi).hard_stop, 'THREE_LENS_UNSUPPORTED_AI_ECOSPHERE_VERSION');
  assert.equal(composeProjectDnaAi(acq.projectWorld, acq.crystalDna, badAi, acq.inputMeta).hard_stop, 'THREE_LENS_UNSUPPORTED_AI_ECOSPHERE_VERSION');

  const r1 = composeProjectDnaAi(acq.projectWorld, acq.crystalDna, acq.aiEcosphere, acq.inputMeta);
  const r2 = composeProjectDnaAi(acq.projectWorld, acq.crystalDna, acq.aiEcosphere, acq.inputMeta);
  const r3 = composeProjectDnaAi(acq.projectWorld, acq.crystalDna, acq.aiEcosphere, acq.inputMeta);
  assert.equal(Boolean(r1.hard_stop), false, JSON.stringify(r1));
  assert.deepStrictEqual(r1, r2);
  assert.deepStrictEqual(r2, r3);
  assert.deepStrictEqual(acq.projectWorld, pwSnap);
  assert.deepStrictEqual(acq.crystalDna, dnaSnap);
  assert.deepStrictEqual(acq.aiEcosphere, aiSnap);

  const twoLens = composeProjectWorldAndDna(acq.projectWorld, acq.crystalDna, acq.inputMeta.two_lens_input);
  assert.equal(Boolean(twoLens.hard_stop), false);
  assert.deepStrictEqual(r1.project_world, twoLens.project_world);
  assert.deepStrictEqual(r1.crystal_dna_lens, twoLens.crystal_dna_lens);
  assert.deepStrictEqual(r1.project_dna_coverage, twoLens.project_dna_coverage);
  assert.deepStrictEqual(r1.project_dna_verified_links, twoLens.cross_lens_links);

  const mutated = deepClone(r1);
  mutated.project_world.projects[0].project_id = 'MUTATED';
  mutated.crystal_dna_lens.shards[0].source_id = 'MUTATED';
  mutated.crystal_dna_lens.dependencies[0].from_shard = 'MUTATED';
  mutated.ai_ecosphere_lens.ecosphere_rings[0].source_id = 'MUTATED';
  mutated.ai_ecosphere_lens.tower_agents[0].source_id = 'MUTATED';
  mutated.ai_ecosphere_lens.minibots[0].source_id = 'MUTATED';
  mutated.ai_ecosphere_lens.advisory_ledger.entries[0].source_id = 'MUTATED';
  mutated.lens_conflicts.ai_ecosphere[0].entity_ref = 'MUTATED';
  mutated.unmatched.ai_ecosphere[0].source_key = 'MUTATED';
  mutated.summary.project_count = -1;
  assert.deepStrictEqual(acq.projectWorld, pwSnap);
  assert.deepStrictEqual(acq.crystalDna, dnaSnap);
  assert.deepStrictEqual(acq.aiEcosphere, aiSnap);

  const disk = JSON.parse(fs.readFileSync(repoRel(OUTPUT_PATH), 'utf8'));
  assert.equal(stableStringify(disk), stableStringify(r1));
  assert.equal(disk.composition_id, COMPOSITION_ID);
  assert.equal(disk.posture, 'DERIVED_COMPOSITION');
  assert.ok(!Object.prototype.hasOwnProperty.call(disk.summary, 'total_ai_count'));
  assert.ok(!Object.prototype.hasOwnProperty.call(disk, 'total_ai_count'));

  const projects = disk.project_world.projects;
  const shards = disk.crystal_dna_lens.shards;
  assert.equal(new Set(projects.map((p) => p.project_id)).size, projects.length);
  assert.equal(new Set(shards.map((s) => s.source_id)).size, shards.length);
  assert.deepStrictEqual(
    projects.map((p) => p.project_id),
    pwSnap.projects.map((p) => p.project_id),
  );
  assert.deepStrictEqual(
    shards.map((s) => s.source_id),
    dnaSnap.shards.map((s) => s.source_id),
  );
  for (let i = 0; i < projects.length; i += 1) {
    assert.deepStrictEqual(projects[i].sovereignty, pwSnap.projects[i].sovereignty);
  }

  const rings = disk.ai_ecosphere_lens.ecosphere_rings;
  const agents = disk.ai_ecosphere_lens.tower_agents;
  const minibots = disk.ai_ecosphere_lens.minibots;
  assert.equal(rings.length, aiSnap.ecosphere_rings.length);
  assert.equal(agents.length, aiSnap.tower_agents.length);
  assert.equal(minibots.length, aiSnap.minibots.length);
  assert.ok(rings.every((r) => r.family === 'ECOSPHERE_RING'));
  assert.ok(agents.every((a) => a.family === 'TOWER_AGENT'));
  assert.ok(minibots.every((b) => b.family === 'MINIBOT'));
  assert.ok(!Array.isArray(disk.ai_identities));

  assert.equal(disk.project_dna_verified_links.length, 0);
  assert.equal(disk.summary.project_dna_verified_link_count, 0);
  assert.equal(disk.summary.project_dna_coverage_row_count, projects.length);
  assert.notEqual(disk.summary.project_dna_coverage_row_count, disk.summary.project_dna_verified_link_count);
  assert.equal(disk.summary.ai_project_verified_association_count, 0);
  assert.deepEqual(disk.ai_ecosphere_lens.project_associations, []);
  assert.equal(disk.relationship_counts.ai_dna_verified, 0);
  assert.equal(disk.relationship_counts.ai_dna_family, 'UNDEFINED');
  assert.equal(disk.cross_lens_relationships.length, 0);

  assert.equal(disk.summary.ai_verified_active_runtime_count, aiSnap.summary.verified_active_runtime_count);
  assert.equal(disk.summary.ai_verified_active_runtime_count, 0);
  assert.ok(disk.ai_ecosphere_lens.runtime_evidence.every((e) => e.verified_active === false));

  assert.equal(disk.unmatched.ai_ecosphere.length, aiSnap.unmatched_records.length);
  assert.deepStrictEqual(disk.unmatched.ai_ecosphere, aiSnap.unmatched_records);
  assert.equal(disk.lens_conflicts.ai_ecosphere.length, aiSnap.conflicts.length);
  assert.deepStrictEqual(disk.lens_conflicts.ai_ecosphere, aiSnap.conflicts);
  assert.equal(disk.cross_lens_conflicts.length, 0);
  assert.equal(disk.summary.cross_lens_conflict_count, 0);
  assert.equal(disk.summary.ai_internal_conflict_count, 2);
  assert.equal(disk.summary.ai_unmatched_record_count, 5);
  for (const c of disk.lens_conflicts.ai_ecosphere) {
    assert.equal(c.posture, 'UNRESOLVED');
    assert.ok(c.semantic_field);
    assert.ok(Array.isArray(c.claims));
    assert.ok(Array.isArray(c.source_refs));
    assert.ok(!JSON.stringify(c).includes(OUTPUT_PATH));
  }
  for (const u of disk.unmatched.ai_ecosphere) {
    assert.ok(u.provenance || u.source_key);
    assert.ok(!JSON.stringify(u).includes(OUTPUT_PATH));
  }

  const positive = deriveCrossLensConflicts([
    {
      entity_ref: 'synthetic-resolved-entity',
      semantic_field: 'synthetic.comparable_field',
      claims: [
        { lens: 'project_world', value: 'X', provenance: { path: 'synthetic/pw', field: 'synthetic.comparable_field' } },
        { lens: 'ai_ecosphere', value: 'Y', provenance: { path: 'synthetic/ai', field: 'synthetic.comparable_field' } },
      ],
    },
  ]);
  assert.equal(positive.length, 1);
  assert.equal(positive[0].posture, 'UNRESOLVED');
  assert.ok(!Object.prototype.hasOwnProperty.call(positive[0], 'winner'));
  assert.ok(!Object.prototype.hasOwnProperty.call(positive[0], 'selected_claim'));
  assert.ok(positive[0].provenance.length >= 2);
  const removed = deriveCrossLensConflicts([
    {
      entity_ref: 'synthetic-resolved-entity',
      semantic_field: 'synthetic.comparable_field',
      claims: [{ lens: 'project_world', value: 'X', provenance: { path: 'synthetic/pw', field: 'synthetic.comparable_field' } }],
    },
  ]);
  assert.equal(removed.length, 0);
  const dim = deriveCrossLensConflicts([
    {
      entity_ref: 'synthetic-resolved-entity',
      semantic_field: 'PROJECT_DEPLOYMENT',
      claims: [{ lens: 'project_world', value: 'GREEN', provenance: { path: 'synthetic/pw' } }],
    },
    {
      entity_ref: 'synthetic-resolved-entity',
      semantic_field: 'AI_RUNTIME_EVIDENCE',
      claims: [{ lens: 'ai_ecosphere', value: 'UNVERIFIED', provenance: { path: 'synthetic/ai' } }],
    },
  ]);
  assert.equal(dim.length, 0);
  const noProv = deriveCrossLensConflicts([
    {
      entity_ref: 'synthetic-resolved-entity',
      semantic_field: 'synthetic.comparable_field',
      claims: [
        { lens: 'project_world', value: 'X' },
        { lens: 'ai_ecosphere', value: 'Y', provenance: { path: 'synthetic/ai' } },
      ],
    },
  ]);
  assert.equal(noProv.length, 0);

  const withSynth = composeProjectDnaAi(acq.projectWorld, acq.crystalDna, acq.aiEcosphere, {
    ...acq.inputMeta,
    comparable_cross_lens_claims: [
      {
        entity_ref: 'synthetic-resolved-entity',
        semantic_field: 'synthetic.comparable_field',
        claims: [
          { lens: 'project_world', value: 'X', provenance: { path: 'synthetic/pw' } },
          { lens: 'ai_ecosphere', value: 'Y', provenance: { path: 'synthetic/ai' } },
        ],
      },
    ],
  });
  assert.equal(withSynth.cross_lens_conflicts.length, 1);
  assert.equal(disk.cross_lens_conflicts.length, 0);

  const roulette = projects.find((p) => p.project_id === ROULETTE_ID);
  assert.ok(roulette);
  assert.equal(
    roulette.sovereignty.composed_posture,
    pwSnap.projects.find((p) => p.project_id === ROULETTE_ID).sovereignty.composed_posture,
  );
  const rCov = disk.project_dna_coverage.find((c) => c.project_id === ROULETTE_ID);
  assert.equal(rCov.verified_link_count, 0);

  for (const s of shards) {
    assert.equal(s.status.namespace, 'CRYSTAL_DNA_CARD');
    assert.ok(!Object.prototype.hasOwnProperty.call(s, 'verified_active'));
    assert.ok(!Object.prototype.hasOwnProperty.call(s, 'autonomous_eligible'));
  }
  assert.equal(disk.crystal_dna_lens.drift.overall_signal.namespace, 'CRYSTAL_DNA_DRIFT');
  for (const p of projects) {
    assert.ok(!Object.prototype.hasOwnProperty.call(p, 'ai_ledger_band'));
    assert.ok(!Object.prototype.hasOwnProperty.call(p, 'crystal_dna_card_status'));
  }
  const projectBlob = JSON.stringify(disk.project_world);
  assert.ok(!projectBlob.includes('"namespace":"CRYSTAL_DNA_DRIFT"'));
  assert.ok(!projectBlob.includes('"namespace":"AI_ECOSPHERE_CONFIG"'));
  const aiBlob = JSON.stringify(disk.ai_ecosphere_lens);
  assert.ok(!aiBlob.includes('"namespace":"CRYSTAL_DNA_DRIFT"'));
  assert.ok(!aiBlob.includes('"namespace":"CRYSTAL_DNA_CARD"'));

  assert.equal(disk.governance.gare.executor, 'NOT_IMPLEMENTED');
  assert.equal(disk.governance.gare.asset_level_eligibility, 'UNDECLARED');
  const t = JSON.stringify(disk);
  assert.ok(!t.includes('overall_health'));
  assert.ok(!t.includes('ecosystem_health_score'));
  assert.ok(!t.includes('self_awareness_score'));
  assert.ok(!t.includes('ready_for_autonomy'));
  assert.ok(!t.includes('ready_for_repair'));
  assert.ok(!t.includes('repair_recipe_id'));
  assert.ok(!t.includes('autonomous_eligible'));
  assert.ok(!t.includes('total_ai_count'));

  const compSrc = fs.readFileSync(repoRel('scripts/z_composed_awareness_project_dna_ai/composition.mjs'), 'utf8');
  assert.ok(!compSrc.includes('.toLowerCase()'));
  assert.ok(!compSrc.includes('startsWith('));
  assert.ok(!compSrc.includes('endsWith('));
  assert.ok(!compSrc.includes('OUTPUT_PATH'));
  const acqSrc = fs.readFileSync(repoRel('scripts/z_composed_awareness_project_dna_ai/acquire.mjs'), 'utf8');
  assert.ok(!acqSrc.includes(OUTPUT_PATH));
  assert.ok(!acqSrc.includes('z_ai_ecosphere_ledger_refresh'));
  assert.ok(!compSrc.includes('z_ai_ecosphere_ledger_refresh'));
  assert.ok(!compSrc.includes('z_crystal_dna_drift_check'));

  for (const rel of NEW_FILES) {
    const text = fs.readFileSync(repoRel(rel), 'utf8');
    for (const token of [
      'fetch(',
      'http.request',
      'https.request',
      'WebSocket',
      'net.connect',
      'Math.random',
      'eval(',
      'Function(',
      'child_process',
      'setInterval',
    ]) {
      assert.equal(executableUse(text, token), false, `${rel} ${token}`);
    }
    assert.ok(!text.includes('Date.now()'));
    assert.ok(!/\bnew Date\s*\(/.test(text));
    assert.ok(!text.includes('performance.now()'));
  }

  assert.equal(sha256Bytes(fs.readFileSync(repoRel(PW_REPORT))), pwBefore);
  assert.equal(sha256Bytes(fs.readFileSync(repoRel(DNA_REPORT))), dnaBefore);
  assert.equal(sha256Bytes(fs.readFileSync(repoRel(AI_REPORT))), aiBefore);
  assert.equal(sha256Bytes(fs.readFileSync(repoRel(TWO_LENS_REPORT))), twoBefore);
  assert.equal(runThreeLensComposition(ROOT).ok, true);

  const s = disk.summary;
  console.log(`
Z COMPOSED AWARENESS
PROJECT WORLD + CRYSTAL DNA + AI ECOSPHERE P0

PROJECT WORLD
PROJECTS                         ${s.project_count}

CRYSTAL DNA
SHARDS                           ${s.dna_shard_count}
DEPENDENCIES                     ${s.dna_dependency_count}
DRIFT FINDINGS                   ${s.dna_drift_finding_count}
PROJECT-DNA VERIFIED LINKS       ${s.project_dna_verified_link_count}

AI ECOSPHERE
RINGS                            ${s.ai_ring_count}
TOWER AGENTS                     ${s.ai_tower_agent_count}
MINIBOTS                         ${s.ai_minibot_count}
LEDGER ENTRIES                   ${s.ai_ledger_entry_count}
VERIFIED ACTIVE                  ${s.ai_verified_active_runtime_count}
AI-PROJECT ASSOCIATIONS          ${s.ai_project_verified_association_count}
AI INTERNAL CONFLICTS            ${s.ai_internal_conflict_count}
AI UNMATCHED                     ${s.ai_unmatched_record_count}

THREE-LENS
CROSS-LENS CONFLICTS             ${s.cross_lens_conflict_count}

VERSION GATES                    PASS
PROJECT IDENTITY                 PASS
DNA IDENTITY                     PASS
AI TYPED IDENTITY                PASS

ZERO-RELATIONSHIP REALITY        PASS
AI ACTIVE BOUNDARY               PASS
AI UNMATCHED BOUNDARY            PASS
AI CONFLICT SCOPE                PASS

STATUS NAMESPACES                PASS
SOVEREIGNTY                      PASS
ROULETTE                         PASS
PROVENANCE                       PASS

CHILD NON-MUTATION               PASS
OUTPUT BACKFLOW                  PASS
3X DETERMINISM                   PASS
REPORT REBUILDABILITY            PASS

GARE ELIGIBILITY                 NONE

NETWORK                          NONE
DATABASE                         NONE
AI MODEL EXECUTION               NONE
AI LEDGER REFRESH                NOT RUN
DNA DRIFT REFRESH                NOT RUN

COMPOSED_AWARENESS_PROJECT_DNA_AI_P0 = PASS
`);
}

main();
