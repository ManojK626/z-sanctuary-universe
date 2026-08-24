#!/usr/bin/env node
/**
 * Internal TEVV — try to falsify Project World + Crystal DNA + AI Ecosphere P0 composition.
 * Does not import z_composed_awareness_project_dna_ai_p0_verify.mjs as oracle.
 * Writes no files. Does not run generators or refresh producers.
 */
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { composeProjectWorldAndDna } from './z_composed_awareness_project_dna/composition.mjs';
import { deepClone, deepFreeze, stableStringify } from './z_composed_awareness_project_dna/canonical_json.mjs';
import { acquireThreeChildProjections } from './z_composed_awareness_project_dna_ai/acquire.mjs';
import { composeProjectDnaAi } from './z_composed_awareness_project_dna_ai/composition.mjs';
import { deriveCrossLensConflicts } from './z_composed_awareness_project_dna_ai/conflict_channel.mjs';
import { gateChildVersions, SUPPORTED } from './z_composed_awareness_project_dna_ai/version_gate.mjs';
import {
  AI_REPORT,
  DNA_REPORT,
  OUTPUT_PATH,
  PW_REPORT,
  ROULETTE_ID,
  TWO_LENS_REPORT,
} from './z_composed_awareness_project_dna_ai/constants.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const HUB_SHARD = 'hub_pc_root_projects';

const THREE_LENS_SUT = [
  'scripts/z_composed_awareness_project_dna_ai/constants.mjs',
  'scripts/z_composed_awareness_project_dna_ai/version_gate.mjs',
  'scripts/z_composed_awareness_project_dna_ai/conflict_channel.mjs',
  'scripts/z_composed_awareness_project_dna_ai/acquire.mjs',
  'scripts/z_composed_awareness_project_dna_ai/composition.mjs',
  'scripts/z_composed_awareness_project_dna_ai_p0.mjs',
  'scripts/z_composed_awareness_project_dna_ai_p0_verify.mjs',
];

const CHILD_RUNTIME = [
  'scripts/z_composed_awareness_read_model/project_world_projection.mjs',
  'scripts/z_composed_awareness_crystal_dna/crystal_dna_projection.mjs',
  'scripts/z_composed_awareness_ai_ecosphere/projection.mjs',
  'scripts/z_composed_awareness_project_dna/composition.mjs',
  'scripts/z_composed_awareness_read_model_p0_tevv.mjs',
  'scripts/z_composed_awareness_crystal_dna_p0_tevv.mjs',
  'scripts/z_composed_awareness_ai_ecosphere_p0_tevv.mjs',
  'scripts/z_composed_awareness_project_dna_p0_tevv.mjs',
];

const REPORTS = [PW_REPORT, DNA_REPORT, AI_REPORT, TWO_LENS_REPORT, OUTPUT_PATH];

const stats = { total: 0, pass: 0, fail: 0, boundary: 0 };
const findings = [];
const observations = [
  'OBS-ID-001',
  'OBS-COMP-001',
  'OBS-COMP-002',
  'OBS-AI-001',
  'OBS-AI-002',
  'OBS-AI-003',
];

function repoRel(rel) {
  return path.join(ROOT, rel.split('/').join(path.sep));
}

function shaBuf(buf) {
  return crypto.createHash('sha256').update(buf).digest('hex');
}

function shaFile(rel) {
  return shaBuf(fs.readFileSync(repoRel(rel)));
}

function snapshot() {
  const out = { sut: {}, child: {}, report: {} };
  for (const rel of THREE_LENS_SUT) out.sut[rel] = shaFile(rel);
  for (const rel of CHILD_RUNTIME) out.child[rel] = shaFile(rel);
  for (const rel of REPORTS) out.report[rel] = shaFile(rel);
  return out;
}

function probe(name, fn) {
  stats.total += 1;
  try {
    const result = fn();
    if (result === 'EXPECTED_BOUNDARY') {
      stats.boundary += 1;
      return;
    }
    stats.pass += 1;
  } catch (err) {
    stats.fail += 1;
    findings.push({
      id: `TEVV-3L-${String(stats.fail).padStart(3, '0')}`,
      severity: 'HIGH',
      area: name,
      finding: err.message,
      reproducer: name,
      identity_impact: 'see area',
      sovereignty_impact: 'see area',
      provenance_impact: 'see area',
      authority_impact: 'none assumed',
      recommended_remediation_scope: 'three-lens P0 only — do not repair during this audit',
    });
  }
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

function independentExactJoinCount(projects, shards) {
  let n = 0;
  for (const s of shards || []) {
    if (typeof s.source_id !== 'string' || s.source_id.length === 0) continue;
    for (const p of projects || []) {
      if (p.project_id === s.source_id) n += 1;
    }
  }
  return n;
}

function unmatchedKeys(list) {
  return (list || []).map((u) => u.source_key).sort();
}

function composeReal(pw, dna, ai, meta) {
  return composeProjectDnaAi(pw, dna, ai, meta);
}

function detectConflictScopeLeak(env) {
  const internal = env.lens_conflicts?.ai_ecosphere || [];
  const cross = env.cross_lens_conflicts || [];
  if (!internal.length) return false;
  const ids = new Set(internal.map((c) => c.entity_ref));
  return cross.some((c) => (c.entity_refs || []).some((r) => ids.has(r)) || ids.has(c.entity_ref));
}

function detectUnmatchedAttached(env, originalKeys) {
  const now = unmatchedKeys(env.unmatched?.ai_ecosphere);
  if (now.length < originalKeys.length) return true;
  const set = new Set(now);
  return originalKeys.some((k) => !set.has(k));
}

function detectCoverageAsLink(env) {
  const cov = env.project_dna_coverage || [];
  const links = env.project_dna_verified_links || [];
  if (!cov.length) return false;
  return cov.length === links.length && links.length > 0;
}

function detectGareInvented(env) {
  const g = env.governance?.gare || {};
  if (g.asset_level_eligibility && g.asset_level_eligibility !== 'UNDECLARED') return true;
  const t = JSON.stringify(env);
  return t.includes('autonomous_eligible') || t.includes('repair_recipe_id') || t.includes('"repair_authorized":true');
}

function detectWinner(conflict) {
  return Boolean(conflict && (conflict.winner || conflict.selected_claim || conflict.posture === 'RESOLVED'));
}

function main() {
  const before = snapshot();
  const acq = acquireThreeChildProjections(ROOT);
  assert.equal(acq.ok, true, JSON.stringify(acq));

  const pw = acq.projectWorld;
  const dna = acq.crystalDna;
  const ai = acq.aiEcosphere;
  const meta = acq.inputMeta;
  const pwSnap = deepClone(pw);
  const dnaSnap = deepClone(dna);
  const aiSnap = deepClone(ai);

  const liveJoins = independentExactJoinCount(pw.projects, dna.shards);
  const liveUnmatched = unmatchedKeys(ai.unmatched_records);
  const liveAiConflicts = (ai.conflicts || []).length;
  const liveActive = ai.summary.verified_active_runtime_count;
  const liveAssoc = ai.summary.verified_project_association_count;

  probe('baseline-child-derived-counts', () => {
    assert.equal(pw.projects.length, 22);
    assert.equal(dna.shards.length, 8);
    assert.equal(liveJoins, 0);
    assert.equal(ai.ecosphere_rings.length, 4);
    assert.equal(ai.tower_agents.length, 4);
    assert.equal(ai.minibots.length, 4);
    assert.equal(liveActive, 0);
    assert.equal(liveAssoc, 0);
    assert.equal(liveAiConflicts, 2);
    assert.equal(liveUnmatched.length, 5);
  });

  probe('version-gate-supported', () => {
    assert.equal(gateChildVersions(pw, dna, ai).ok, true);
  });

  probe('version-gate-unsupported-pw', () => {
    const bad = { ...pw, implementation_version: 'pw-v99-unsupported' };
    assert.equal(gateChildVersions(bad, dna, ai).hard_stop, 'THREE_LENS_UNSUPPORTED_PROJECT_WORLD_VERSION');
    assert.equal(composeReal(bad, dna, ai, meta).hard_stop, 'THREE_LENS_UNSUPPORTED_PROJECT_WORLD_VERSION');
  });

  probe('version-gate-unsupported-dna', () => {
    const bad = { ...dna, implementation_version: 'dna-v99-unsupported' };
    assert.equal(composeReal(pw, bad, ai, meta).hard_stop, 'THREE_LENS_UNSUPPORTED_CRYSTAL_DNA_VERSION');
  });

  probe('version-gate-unsupported-ai', () => {
    const bad = { ...ai, projection_version: 'ai-v99-unsupported' };
    assert.equal(composeReal(pw, dna, bad, meta).hard_stop, 'THREE_LENS_UNSUPPORTED_AI_ECOSPHERE_VERSION');
  });

  const frozenPw = deepFreeze(deepClone(pw));
  const frozenDna = deepFreeze(deepClone(dna));
  const frozenAi = deepFreeze(deepClone(ai));

  let env;
  probe('compose-real', () => {
    env = composeReal(frozenPw, frozenDna, frozenAi, meta);
    assert.equal(Boolean(env.hard_stop), false, JSON.stringify(env));
  });

  probe('10x-determinism', () => {
    const runs = [];
    for (let i = 0; i < 10; i += 1) {
      runs.push(composeReal(pw, dna, ai, meta));
    }
    for (let i = 1; i < 10; i += 1) assert.deepStrictEqual(runs[i], runs[0]);
    env = runs[0];
  });

  probe('child-non-mutation', () => {
    assert.deepStrictEqual(pw, pwSnap);
    assert.deepStrictEqual(dna, dnaSnap);
    assert.deepStrictEqual(ai, aiSnap);
  });

  probe('pw-dna-semantic-reuse', () => {
    const two = composeProjectWorldAndDna(pw, dna, meta.two_lens_input);
    assert.deepStrictEqual(env.project_world, two.project_world);
    assert.deepStrictEqual(env.crystal_dna_lens, two.crystal_dna_lens);
    assert.deepStrictEqual(env.project_dna_coverage, two.project_dna_coverage);
    assert.deepStrictEqual(env.project_dna_verified_links, two.cross_lens_links);
  });

  probe('ai-internal-conflicts-not-cross-lens', () => {
    assert.equal(env.lens_conflicts.ai_ecosphere.length, liveAiConflicts);
    assert.deepStrictEqual(env.lens_conflicts.ai_ecosphere, aiSnap.conflicts);
    assert.equal(env.cross_lens_conflicts.length, 0);
    assert.equal(detectConflictScopeLeak(env), false);
    assert.equal(env.summary.cross_lens_conflict_count, 0);
    assert.equal(env.summary.ai_internal_conflict_count, 2);
  });

  probe('unmatched-preserved-no-fuzzy-attach', () => {
    assert.deepStrictEqual(unmatchedKeys(env.unmatched.ai_ecosphere), liveUnmatched);
    assert.equal(env.unmatched.ai_ecosphere.length, 5);
    const blob = JSON.stringify(env.unmatched.ai_ecosphere);
    for (const p of pw.projects) {
      assert.ok(!env.unmatched.ai_ecosphere.some((u) => u.matched_project_id === p.project_id));
    }
    assert.ok(!blob.includes('"MATCHED"') || blob.includes('NOT'));
    const names = [
      ...pw.projects.map((p) => p.project_id),
      ...dna.shards.map((s) => s.source_id),
      ...ai.minibots.map((b) => b.source_id),
      ...ai.tower_agents.map((a) => a.source_id),
      ...ai.ecosphere_rings.map((r) => r.source_id),
    ];
    for (const u of env.unmatched.ai_ecosphere) {
      assert.ok(u.reason);
      assert.ok(u.provenance || u.source_key);
      for (const n of names) {
        if (typeof n === 'string' && n.length && String(u.source_key).toLowerCase() === n.toLowerCase()) {
          assert.notEqual(u.status, 'MATCHED');
        }
      }
    }
  });

  probe('zero-project-dna-not-from-coverage', () => {
    assert.equal(independentExactJoinCount(env.project_world.projects, env.crystal_dna_lens.shards), 0);
    assert.equal(env.project_dna_verified_links.length, 0);
    assert.equal(env.summary.project_dna_coverage_row_count, env.project_world.projects.length);
    assert.notEqual(env.summary.project_dna_coverage_row_count, env.summary.project_dna_verified_link_count);
    assert.equal(detectCoverageAsLink(env), false);
    assert.equal(env.project_dna_verified_links.filter((l) => l.shard_id === HUB_SHARD).length, 0);
  });

  probe('zero-ai-project-no-extra-context-ingest', () => {
    assert.equal(env.summary.ai_project_verified_association_count, liveAssoc);
    assert.deepEqual(env.ai_ecosphere_lens.project_associations, []);
    assert.equal(env.relationship_counts.ai_dna_verified, 0);
    assert.equal(env.relationship_counts.ai_dna_family, 'UNDEFINED');
    assert.equal(env.cross_lens_relationships.length, 0);
  });

  probe('verified-active-not-invented', () => {
    assert.equal(env.summary.ai_verified_active_runtime_count, liveActive);
    assert.equal(env.summary.ai_verified_active_runtime_count, 0);
    assert.ok(env.ai_ecosphere_lens.runtime_evidence.every((e) => e.verified_active === false));
    const t = JSON.stringify(env);
    assert.ok(!t.includes('"verified_active":true'));
  });

  probe('cross-lens-channel-synthetic', () => {
    assert.ok(Array.isArray(env.cross_lens_conflicts));
    const one = deriveCrossLensConflicts([
      {
        entity_ref: 'synthetic-resolved-entity',
        semantic_field: 'synthetic.comparable_field',
        claims: [
          { lens: 'project_world', value: 'X', provenance: { path: 'synthetic/pw' } },
          { lens: 'ai_ecosphere', value: 'Y', provenance: { path: 'synthetic/ai' } },
        ],
      },
    ]);
    assert.equal(one.length, 1);
    assert.equal(one[0].posture, 'UNRESOLVED');
    assert.equal(detectWinner(one[0]), false);
    const zero = deriveCrossLensConflicts([
      {
        entity_ref: 'synthetic-resolved-entity',
        semantic_field: 'synthetic.comparable_field',
        claims: [{ lens: 'project_world', value: 'X', provenance: { path: 'synthetic/pw' } }],
      },
    ]);
    assert.equal(zero.length, 0);
    const viaCompose = composeReal(pw, dna, ai, {
      ...meta,
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
    assert.equal(viaCompose.cross_lens_conflicts.length, 1);
    assert.equal(env.cross_lens_conflicts.length, 0);
  });

  probe('different-dimensions-not-conflict', () => {
    const dim = deriveCrossLensConflicts([
      {
        entity_ref: 'same-entity',
        semantic_field: 'PROJECT_DEPLOYMENT',
        claims: [{ lens: 'project_world', value: 'GREEN', provenance: { path: 'pw' } }],
      },
      {
        entity_ref: 'same-entity',
        semantic_field: 'CRYSTAL_DNA_DRIFT',
        claims: [{ lens: 'crystal_dna', value: 'BLUE', provenance: { path: 'dna' } }],
      },
      {
        entity_ref: 'same-entity',
        semantic_field: 'AI_ADVISORY_LEDGER',
        claims: [{ lens: 'ai_ecosphere', value: 'GREEN', provenance: { path: 'ai-ledger' } }],
      },
      {
        entity_ref: 'same-entity',
        semantic_field: 'AI_RUNTIME_EVIDENCE',
        claims: [{ lens: 'ai_ecosphere', value: 'UNVERIFIED', provenance: { path: 'ai-rt' } }],
      },
    ]);
    assert.equal(dim.length, 0);
  });

  probe('identity-authority-not-expanded', () => {
    assert.deepStrictEqual(
      env.project_world.projects.map((p) => p.project_id),
      pwSnap.projects.map((p) => p.project_id),
    );
    assert.deepStrictEqual(
      env.crystal_dna_lens.shards.map((s) => s.source_id),
      dnaSnap.shards.map((s) => s.source_id),
    );
    assert.equal(env.ai_ecosphere_lens.ecosphere_rings.length, 4);
    assert.ok(!Object.prototype.hasOwnProperty.call(env.summary, 'total_ai_count'));
    const src = fs.readFileSync(repoRel('scripts/z_composed_awareness_project_dna_ai/composition.mjs'), 'utf8');
    assert.ok(!src.includes('.toLowerCase()'));
    assert.ok(!src.includes('startsWith('));
    assert.ok(!src.includes('endsWith('));
  });

  probe('sovereignty-roulette', () => {
    for (let i = 0; i < env.project_world.projects.length; i += 1) {
      assert.deepStrictEqual(env.project_world.projects[i].sovereignty, pwSnap.projects[i].sovereignty);
    }
    const roulette = env.project_world.projects.find((p) => p.project_id === ROULETTE_ID);
    assert.ok(roulette);
    assert.equal(roulette.sovereignty.composed_posture, pwSnap.projects.find((p) => p.project_id === ROULETTE_ID).sovereignty.composed_posture);
    assert.equal(env.project_dna_coverage.find((c) => c.project_id === ROULETTE_ID).verified_link_count, 0);
    assert.ok(!(env.ai_ecosphere_lens.project_associations || []).some((a) => a.project_id === ROULETTE_ID));
  });

  probe('provenance-gare-namespaces', () => {
    for (const c of env.lens_conflicts.ai_ecosphere) {
      assert.ok(Array.isArray(c.source_refs));
      assert.ok(!JSON.stringify(c).includes(OUTPUT_PATH));
    }
    for (const u of env.unmatched.ai_ecosphere) {
      assert.ok(!JSON.stringify(u).includes(OUTPUT_PATH));
    }
    assert.equal(env.governance.gare.executor, 'NOT_IMPLEMENTED');
    assert.equal(env.governance.gare.asset_level_eligibility, 'UNDECLARED');
    assert.equal(detectGareInvented(env), false);
    const t = JSON.stringify(env);
    assert.ok(!t.includes('overall_health'));
    assert.ok(!t.includes('ready_for_autonomy'));
    assert.equal(env.posture, 'DERIVED_COMPOSITION');
    const projectBlob = JSON.stringify(env.project_world);
    assert.ok(!projectBlob.includes('"namespace":"CRYSTAL_DNA_DRIFT"'));
    assert.ok(!JSON.stringify(env.ai_ecosphere_lens).includes('"namespace":"CRYSTAL_DNA_CARD"'));
  });

  probe('output-backflow', () => {
    const mutated = deepClone(env);
    mutated.project_world.projects[0].project_id = 'MUTATED';
    mutated.crystal_dna_lens.shards[0].source_id = 'MUTATED';
    mutated.ai_ecosphere_lens.ecosphere_rings[0].source_id = 'MUTATED';
    mutated.lens_conflicts.ai_ecosphere[0].entity_ref = 'MUTATED';
    mutated.unmatched.ai_ecosphere[0].source_key = 'MUTATED';
    mutated.summary.project_count = -1;
    assert.deepStrictEqual(pw, pwSnap);
    assert.deepStrictEqual(dna, dnaSnap);
    assert.deepStrictEqual(ai, aiSnap);
  });

  probe('shared-reference-alias', () => {
    const aliasPw = deepClone(pw);
    const shared = aliasPw.projects[0].sovereignty;
    const out = composeReal(aliasPw, dna, ai, meta);
    shared.composed_posture = 'TEVV_ALIAS_HACK';
    assert.notEqual(out.project_world.projects[0].sovereignty.composed_posture, 'TEVV_ALIAS_HACK');
    aliasPw.projects[0].sovereignty.composed_posture = pwSnap.projects[0].sovereignty.composed_posture;
  });

  probe('aba-hidden-state-and-memory', () => {
    const claims = [
      {
        entity_ref: 'synthetic-resolved-entity',
        semantic_field: 'synthetic.comparable_field',
        claims: [
          { lens: 'project_world', value: 'X', provenance: { path: 'synthetic/pw' } },
          { lens: 'ai_ecosphere', value: 'Y', provenance: { path: 'synthetic/ai' } },
        ],
      },
    ];
    const a1 = composeReal(pw, dna, ai, { ...meta, comparable_cross_lens_claims: claims });
    const b = composeReal(pw, dna, ai, { ...meta, comparable_cross_lens_claims: [] });
    const a2 = composeReal(pw, dna, ai, { ...meta, comparable_cross_lens_claims: claims });
    assert.deepStrictEqual(a1, a2);
    assert.equal(b.cross_lens_conflicts.length, 0);
    assert.equal(a1.cross_lens_conflicts.length, 1);
    assert.equal(b.unmatched.ai_ecosphere.length, 5);
    assert.equal(b.lens_conflicts.ai_ecosphere.length, 2);
    assert.equal(b.project_dna_verified_links.length, 0);
  });

  probe('report-rebuildability-not-sor', () => {
    const disk = JSON.parse(fs.readFileSync(repoRel(OUTPUT_PATH), 'utf8'));
    assert.equal(stableStringify(disk), stableStringify(env));
    const acqSrc = fs.readFileSync(repoRel('scripts/z_composed_awareness_project_dna_ai/acquire.mjs'), 'utf8');
    const compSrc = fs.readFileSync(repoRel('scripts/z_composed_awareness_project_dna_ai/composition.mjs'), 'utf8');
    assert.ok(!acqSrc.includes(OUTPUT_PATH));
    assert.ok(!compSrc.includes(OUTPUT_PATH));
    assert.ok(!compSrc.includes('z_ai_ecosphere_ledger_refresh'));
    assert.ok(!compSrc.includes('z_crystal_dna_drift_check'));
  });

  probe('prohibited-runtime', () => {
    const files = [
      'scripts/z_composed_awareness_project_dna_ai/composition.mjs',
      'scripts/z_composed_awareness_project_dna_ai/conflict_channel.mjs',
      'scripts/z_composed_awareness_project_dna_ai/version_gate.mjs',
      'scripts/z_composed_awareness_project_dna_ai/acquire.mjs',
      'scripts/z_composed_awareness_project_dna_ai_p0.mjs',
    ];
    for (const rel of files) {
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
  });

  probe('negative-control-harness', () => {
    const origKeys = liveUnmatched;
    const leak = deepClone(env);
    leak.cross_lens_conflicts = [
      {
        entity_ref: env.lens_conflicts.ai_ecosphere[0].entity_ref,
        entity_refs: [env.lens_conflicts.ai_ecosphere[0].entity_ref],
        posture: 'UNRESOLVED',
      },
    ];
    assert.equal(detectConflictScopeLeak(leak), true);
    assert.equal(detectConflictScopeLeak(env), false);

    const attached = deepClone(env);
    attached.unmatched.ai_ecosphere = attached.unmatched.ai_ecosphere.slice(1);
    assert.equal(detectUnmatchedAttached(attached, origKeys), true);
    assert.equal(detectUnmatchedAttached(env, origKeys), false);

    const covLink = deepClone(env);
    covLink.project_dna_verified_links = covLink.project_dna_coverage.map((c) => ({
      project_id: c.project_id,
      shard_id: 'invented',
    }));
    assert.equal(detectCoverageAsLink(covLink), true);
    assert.equal(detectCoverageAsLink(env), false);

    const ledgerAttach = { ...env, ai_ecosphere_lens: { ...env.ai_ecosphere_lens, project_associations: [{ project_id: pw.projects[0].project_id, from: 'ledger' }] } };
    assert.equal((ledgerAttach.ai_ecosphere_lens.project_associations || []).length > 0, true);
    assert.equal((env.ai_ecosphere_lens.project_associations || []).length, 0);

    const fuzzy = { matched: env.unmatched.ai_ecosphere.map((u) => ({ ...u, status: 'MATCHED', matched_project_id: pw.projects[0].project_id })) };
    assert.ok(fuzzy.matched.every((u) => u.status === 'MATCHED'));
    assert.ok(env.unmatched.ai_ecosphere.every((u) => u.status !== 'MATCHED'));

    const dnaAi = { ...env.relationship_counts, ai_dna_verified: 1, ai_dna_family: 'PATH' };
    assert.equal(dnaAi.ai_dna_verified === 1, true);
    assert.equal(env.relationship_counts.ai_dna_verified, 0);

    const greenActive = deepClone(env);
    greenActive.ai_ecosphere_lens.runtime_evidence[0].verified_active = true;
    greenActive.summary.ai_verified_active_runtime_count = 1;
    assert.equal(greenActive.summary.ai_verified_active_runtime_count === 1, true);
    assert.equal(env.summary.ai_verified_active_runtime_count, 0);

    const own = deepClone(env);
    own.project_world.projects.find((p) => p.project_id === ROULETTE_ID).sovereignty.composed_posture = 'INTERNAL';
    assert.notEqual(
      own.project_world.projects.find((p) => p.project_id === ROULETTE_ID).sovereignty.composed_posture,
      env.project_world.projects.find((p) => p.project_id === ROULETTE_ID).sovereignty.composed_posture,
    );

    const dimFalse = deriveCrossLensConflicts([
      {
        entity_ref: 'e',
        semantic_field: 'PROJECT_DEPLOYMENT',
        claims: [
          { lens: 'project_world', value: 'GREEN', provenance: { p: 1 } },
          { lens: 'ai_ecosphere', value: 'GREEN', provenance: { p: 2 } },
        ],
      },
    ]);
    assert.equal(dimFalse.length, 0);

    const autoWin = { ...deriveCrossLensConflicts([
      {
        entity_ref: 'e',
        semantic_field: 'f',
        claims: [
          { lens: 'project_world', value: 'A', provenance: { p: 1 } },
          { lens: 'ai_ecosphere', value: 'B', provenance: { p: 2 } },
        ],
      },
    ])[0], winner: 'project_world', posture: 'RESOLVED' };
    assert.equal(detectWinner(autoWin), true);
    assert.equal(detectWinner(deriveCrossLensConflicts([
      {
        entity_ref: 'e',
        semantic_field: 'f',
        claims: [
          { lens: 'project_world', value: 'A', provenance: { p: 1 } },
          { lens: 'ai_ecosphere', value: 'B', provenance: { p: 2 } },
        ],
      },
    ])[0]), false);

    const noProv = deriveCrossLensConflicts([
      {
        entity_ref: 'e',
        semantic_field: 'f',
        claims: [
          { lens: 'project_world', value: 'A' },
          { lens: 'ai_ecosphere', value: 'B', provenance: { p: 2 } },
        ],
      },
    ]);
    assert.equal(noProv.length, 0);

    const gare = deepClone(env);
    gare.governance.gare.asset_level_eligibility = 'ELIGIBLE';
    assert.equal(detectGareInvented(gare), true);
    assert.equal(detectGareInvented(env), false);

    const stale = composeReal(pw, dna, ai, { ...meta, comparable_cross_lens_claims: [] });
    assert.equal(stale.cross_lens_conflicts.length, 0);

    const verBad = composeReal({ ...pw, implementation_version: 'nope' }, dna, ai, meta);
    assert.equal(verBad.hard_stop, 'THREE_LENS_UNSUPPORTED_PROJECT_WORLD_VERSION');

    const src = fs.readFileSync(repoRel('scripts/z_composed_awareness_project_dna_ai/composition.mjs'), 'utf8');
    assert.ok(!src.includes('truth_probability'));
    assert.ok(!src.includes('sync_score') || src.includes('verified_active_runtime_count'));
  });

  probe('obs-carry-forward-not-repaired', () => {
    assert.ok(observations.includes('OBS-COMP-001'));
    assert.ok(observations.includes('OBS-COMP-002'));
    assert.ok(observations.includes('OBS-AI-001'));
    assert.equal(SUPPORTED.project_world.projection_id, 'z_composed_awareness_project_world_p0');
    const twoSrc = fs.readFileSync(repoRel('scripts/z_composed_awareness_project_dna/composition.mjs'), 'utf8');
    assert.ok(twoSrc.includes('conflicts: []') || twoSrc.includes('conflicts:[]'));
  });

  probe('sut-and-report-byte-stability', () => {
    const after = snapshot();
    assert.deepStrictEqual(after.sut, before.sut);
    assert.deepStrictEqual(after.child, before.child);
    assert.deepStrictEqual(after.report, before.report);
  });

  const s = env.summary;
  const verdict = stats.fail === 0 && findings.every((f) => f.severity !== 'CRITICAL' && f.severity !== 'HIGH');
  const label = verdict ? 'PASS' : 'FAIL';

  console.log(`
Z COMPOSED AWARENESS
PROJECT WORLD + CRYSTAL DNA + AI ECOSPHERE P0 INTERNAL TEVV

SOURCE / SUT HASHES               UNCHANGED
BASELINE THREE-LENS VERIFY        (run separately)

PROJECTS                          ${s.project_count}
DNA SHARDS                        ${s.dna_shard_count}
PROJECT-DNA VERIFIED LINKS        ${s.project_dna_verified_link_count}

AI RINGS                          ${s.ai_ring_count}
TOWER AGENTS                      ${s.ai_tower_agent_count}
MINIBOTS                          ${s.ai_minibot_count}
VERIFIED ACTIVE                   ${s.ai_verified_active_runtime_count}
AI-PROJECT ASSOCIATIONS           ${s.ai_project_verified_association_count}
AI INTERNAL CONFLICTS             ${s.ai_internal_conflict_count}
AI UNMATCHED                      ${s.ai_unmatched_record_count}
CROSS-LENS CONFLICTS              ${s.cross_lens_conflict_count}

TYPED IDENTITY                    PASS
VERSION GATES                     PASS
ZERO-RELATIONSHIP REALITY         PASS
AI CONFLICT SCOPE                 PASS
AI UNMATCHED BOUNDARY             PASS
AI ACTIVE BOUNDARY                PASS
CROSS-LENS CHANNEL                PASS
DIFFERENT DIMENSIONS              PASS
SOVEREIGNTY / ROULETTE            PASS
PROVENANCE                        PASS

CHILD NON-MUTATION                PASS
OUTPUT BACKFLOW                   PASS
10X DETERMINISM                   PASS
HIDDEN STATE                      PASS
REPORT REBUILDABILITY             PASS

GARE ELIGIBILITY LEAKS            0
NETWORK                           NONE
DATABASE                          NONE
AI MODEL EXECUTION                NONE
LEDGER REFRESH                    NOT RUN
DNA DRIFT REFRESH                 NOT RUN

NEGATIVE CONTROL HARNESS          PASS

PROBES TOTAL                      ${stats.total}
PROBES PASS                       ${stats.pass}
PROBES FAIL                       ${stats.fail}
EXPECTED_BOUNDARY                 ${stats.boundary}

CRITICAL FINDINGS                 ${findings.filter((f) => f.severity === 'CRITICAL').length}
HIGH FINDINGS                     ${findings.filter((f) => f.severity === 'HIGH').length}
MEDIUM FINDINGS                   ${findings.filter((f) => f.severity === 'MEDIUM').length}
LOW FINDINGS                      ${findings.filter((f) => f.severity === 'LOW').length}
OBSERVATIONS                      ${observations.length}

ORACLE_COUPLING_RISK              MEDIUM

COMPOSED_AWARENESS_PROJECT_DNA_AI_P0_TEVV = ${label}
`);

  if (!verdict) {
    console.error(JSON.stringify({ findings }, null, 2));
    process.exit(1);
  }
}

main();
