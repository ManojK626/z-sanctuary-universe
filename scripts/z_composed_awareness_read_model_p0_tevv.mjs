#!/usr/bin/env node
/**
 * Z-SANCTUARY-COMPOSED-AWARENESS-P0-TEVV-AUDIT-1
 * Internal TEVV — try to falsify Project World P0. Does not wrap the P0 verifier.
 * Writes no files. AUTONOMOUS AUTHORITY = NONE
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { adaptPcRootProjects } from './z_composed_awareness_read_model/identity_adapter.mjs';
import { joinAwarenessRows } from './z_composed_awareness_read_model/ecosystem_awareness_adapter.mjs';
import { loadCapsuleIfPath } from './z_composed_awareness_read_model/capsule_adapter.mjs';
import { projectWorldP0 } from './z_composed_awareness_read_model/project_world_projection.mjs';
import {
  deepClone,
  deepFreeze,
  loadConfiguredSources,
  loadJsonSource,
  repoRel,
  sha256File,
} from './z_composed_awareness_read_model/source_loader.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

/** Independent of constants.mjs — TEVV oracle, not the implementation registry. */
const AUDIT_SOURCES = {
  pc_root: 'data/z_pc_root_projects.json',
  identity_reconciliation: 'docs/PROJECT_IDENTITY_RECONCILIATION.md',
  ecosystem_awareness: 'data/z_ecosystem_awareness_registry.json',
  hub_capsule: 'data/z_sanctuary_universe_awareness_capsule.json',
  sibling_capsule: 'z-questra/data/z_project_awareness_capsule.json',
  tracked_report: 'data/reports/z_composed_awareness_project_world_p0.json',
};

const P0_RUNTIME_FILES = [
  'scripts/z_composed_awareness_read_model/constants.mjs',
  'scripts/z_composed_awareness_read_model/source_loader.mjs',
  'scripts/z_composed_awareness_read_model/identity_match.mjs',
  'scripts/z_composed_awareness_read_model/identity_adapter.mjs',
  'scripts/z_composed_awareness_read_model/capsule_adapter.mjs',
  'scripts/z_composed_awareness_read_model/ecosystem_awareness_adapter.mjs',
  'scripts/z_composed_awareness_read_model/project_world_projection.mjs',
  'scripts/z_composed_awareness_read_model_p0.mjs',
];
const P0_VERIFIER_FILE = 'scripts/z_composed_awareness_read_model_p0_verify.mjs';

const stats = { total: 0, pass: 0, fail: 0, boundary: 0 };
const findings = [];

function hashRel(rel) {
  return sha256File(repoRel(ROOT, rel));
}

function snapshotHashes() {
  const files = [
    ...Object.values(AUDIT_SOURCES),
    ...P0_RUNTIME_FILES,
    P0_VERIFIER_FILE,
  ];
  const out = {};
  for (const rel of files) {
    const abs = repoRel(ROOT, rel);
    if (fs.existsSync(abs)) out[rel] = hashRel(rel);
  }
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
      id: `TEVV-${String(stats.fail).padStart(3, '0')}`,
      severity: 'HIGH',
      area: name,
      finding: err.message,
      reproducer: name,
      canonical_impact: 'P0 invariant failed under TEVV probe',
    });
    throw err;
  }
}

function wrapLoaded(pcData, ecoData, identityText = '# audit fixture') {
  return {
    pc: { ok: true, path: AUDIT_SOURCES.pc_root, sha256: 'fixture', data: pcData },
    identity: { ok: true, path: AUDIT_SOURCES.identity_reconciliation, sha256: 'fixture', data: identityText },
    eco: { ok: true, path: AUDIT_SOURCES.ecosystem_awareness, sha256: 'fixture', data: ecoData },
  };
}

function emptyEco() {
  return {
    schema: 'z_ecosystem_awareness_registry_v1',
    canonical_hub_name: 'ZSanctuary_Universe',
    canonical_hub_folder: 'Z_Sanctuary_Universe',
    projects: [],
  };
}

function tevvExact(a, b) {
  return typeof a === 'string' && typeof b === 'string' && a === b;
}

function jsonHasForbiddenFreshness(obj) {
  const s = JSON.stringify(obj);
  return /\bCURRENT\b/.test(s) && s.includes('AGING') && s.includes('STALE') && s.includes('freshness');
}

function absPathLeak(obj) {
  return JSON.stringify(obj).includes('C:/Cursor Projects Organiser') || JSON.stringify(obj).includes('C:\\\\Cursor Projects Organiser');
}

function detectRouletteInternal(proj) {
  const r = proj.projects.find((p) => p.project_id === 'replit-roulette-z-amk-goku-mdcp');
  return Boolean(r && (r.sovereignty.composed_posture === 'INTERNAL' || r.sovereignty.composed_posture === 'MEMBER'));
}

function detectMissingCapsuleFilled(proj) {
  return proj.projects.some(
    (p) =>
      p.awareness.capsule &&
      p.awareness.capsule.posture === 'MISSING' &&
      p.awareness.capsule.source_declared &&
      Object.keys(p.awareness.capsule.source_declared).length > 0,
  );
}

function detectFalseZquestraJoin(proj) {
  return proj.projects.some((p) => p.identity?.join_rule !== 'NONE' && p.ecosystem?.identity === 'z-questra');
}

function detectConflictResolved(proj) {
  return (proj.conflicts || []).some((c) => c.resolution && c.resolution !== 'UNRESOLVED');
}

function detectDerivedAsRealSource(proj) {
  return (proj.projects || []).some((p) => p.origin === 'REAL_SOURCE');
}

function detectAbsLeak(proj) {
  return absPathLeak(proj);
}

function scanP0TextFor(re) {
  let hit = null;
  for (const rel of [...P0_RUNTIME_FILES, P0_VERIFIER_FILE]) {
    const text = fs.readFileSync(repoRel(ROOT, rel), 'utf8');
    if (re.test(text)) hit = rel;
  }
  return hit;
}

function executableUse(text, token) {
  const lines = text.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('/*')) continue;
    if (trimmed.includes("'") && trimmed.includes(token) && trimmed.includes('FORBIDDEN')) continue;
    if (trimmed.includes(token) && !trimmed.includes(`'${token}'`) && !trimmed.includes(`"${token}"`)) {
      if (token === 'fetch(' && /fetch\s*\(/.test(trimmed) && !trimmed.includes('token')) return true;
      if (token !== 'fetch(' && trimmed.includes(token)) return true;
    }
  }
  return false;
}

function main() {
  const hashesBefore = snapshotHashes();

  const pcFile = loadJsonSource(ROOT, AUDIT_SOURCES.pc_root);
  const ecoFile = loadJsonSource(ROOT, AUDIT_SOURCES.ecosystem_awareness);
  const capFile = loadJsonSource(ROOT, AUDIT_SOURCES.hub_capsule);
  const sibFile = loadJsonSource(ROOT, AUDIT_SOURCES.sibling_capsule);
  const reportFile = loadJsonSource(ROOT, AUDIT_SOURCES.tracked_report);
  const idText = fs.readFileSync(repoRel(ROOT, AUDIT_SOURCES.identity_reconciliation), 'utf8');

  assert.equal(pcFile.ok, true, 'pc_root must parse');
  assert.equal(ecoFile.ok, true, 'ecosystem awareness must parse');
  assert.equal(capFile.ok, true, 'hub capsule must parse');
  assert.equal(sibFile.ok, true, 'sibling capsule must parse if present');
  assert.equal(reportFile.ok, true, 'tracked report must parse');

  const loaded = loadConfiguredSources(ROOT, {
    pc_root: AUDIT_SOURCES.pc_root,
    identity_reconciliation: AUDIT_SOURCES.identity_reconciliation,
    ecosystem_awareness: AUDIT_SOURCES.ecosystem_awareness,
  });
  assert.equal(loaded.errors.length, 0);

  const pcSnap = deepClone(loaded.pc.data);
  const ecoSnap = deepClone(loaded.eco.data);
  const frozen = {
    pc: { ...loaded.pc, data: deepFreeze(deepClone(loaded.pc.data)) },
    identity: loaded.identity,
    eco: { ...loaded.eco, data: deepFreeze(deepClone(loaded.eco.data)) },
  };

  const sourceProjectCount = Array.isArray(pcFile.data.projects) ? pcFile.data.projects.length : 0;

  let projection;
  probe('A.source-resolution', () => {
    assert.equal(pcFile.path, AUDIT_SOURCES.pc_root);
    const missing = loadJsonSource(ROOT, 'data/z_tevv_nonexistent_p0_source.json');
    assert.equal(missing.reason, 'SOURCE_MISSING');
    const invalid = loadJsonSource(ROOT, AUDIT_SOURCES.identity_reconciliation);
    assert.equal(invalid.reason, 'SOURCE_INVALID');
  });

  probe('A.enumeration-source-derived', () => {
    assert.ok(sourceProjectCount >= 1);
    projection = projectWorldP0(ROOT, frozen);
    assert.equal(Boolean(projection.hard_stop), false);
    assert.equal(projection.summary.project_count, sourceProjectCount);
    assert.equal(projection.projects.length, sourceProjectCount);
  });

  probe('B.duplicate-id-synthetic', () => {
    const dup = deepClone(pcSnap);
    dup.projects = [
      { id: 'dup-id', name: 'One', path: 'a', role: 'member' },
      { id: 'dup-id', name: 'Two', path: 'b', role: 'member' },
    ];
    const out = projectWorldP0(ROOT, wrapLoaded(dup, emptyEco()));
    const ids = out.projects.map((p) => p.project_id);
    const unique = new Set(ids);
    if (unique.size !== ids.length && !out.hard_stop) {
      findings.push({
        id: 'OBS-DUP-001',
        severity: 'OBSERVATION',
        area: 'duplicate-id',
        finding: 'P0 emits two derived records for duplicate pc_root ids without hard_stop. Outside sealed unique-id domain.',
        reproducer: 'in-memory two projects with id dup-id',
        canonical_impact: 'No real-source duplicate today. Unique-id assumed, not enforced.',
      });
      return 'EXPECTED_BOUNDARY';
    }
    assert.ok(out.hard_stop || unique.size === ids.length);
  });

  probe('B.case-collision', () => {
    const adapted = adaptPcRootProjects({
      projects: [{ id: 'z-sanctuary-universe', name: 'Hub', path: 'Z_Sanctuary_Universe', role: 'hub' }],
    });
    const eco = {
      ...emptyEco(),
      projects: [
        {
          project_id: 'ZSanctuary_Universe',
          display_name: 'Hub',
          project_type: 'sibling_app',
          capsule_path: '',
          deployment_status: 'HOLD',
        },
      ],
    };
    const joined = joinAwarenessRows(adapted.adapted, eco);
    assert.equal(joined.joins.length, 0);
    assert.equal(joined.unmatched[0].source_id, 'ZSanctuary_Universe');
  });

  probe('B.display-name-collision', () => {
    const adapted = adaptPcRootProjects({
      projects: [
        { id: 'alpha-1', name: 'Same Title', path: 'a', role: 'member' },
        { id: 'alpha-2', name: 'Same Title', path: 'b', role: 'member' },
      ],
    });
    const eco = {
      ...emptyEco(),
      projects: [{ project_id: 'unrelated', display_name: 'Same Title', project_type: 'hub_module', capsule_path: '' }],
    };
    const joined = joinAwarenessRows(adapted.adapted, eco);
    assert.equal(joined.joins.length, 0);
    assert.equal(adapted.adapted.length, 2);
    assert.notEqual(adapted.adapted[0].source_id, adapted.adapted[1].source_id);
  });

  probe('B.similar-spelling', () => {
    const adapted = adaptPcRootProjects({
      projects: [{ id: 'z-questra-local', name: 'Z QUESTRA', path: 'z-questra', role: 'member' }],
    });
    const eco = {
      ...emptyEco(),
      projects: [{ project_id: 'z-questra', display_name: 'Z-QUESTRA', project_type: 'sibling_app', capsule_path: AUDIT_SOURCES.sibling_capsule }],
    };
    const joined = joinAwarenessRows(adapted.adapted, eco);
    assert.equal(joined.joins.length, 0);
    assert.ok(!tevvExact('z-questra-local', 'z-questra'));
    assert.ok(!tevvExact('zquestra', 'z-questra'));
    assert.ok(!tevvExact('z_questra', 'z-questra'));
  });

  probe('B.unresolved-not-same', () => {
    const dash = projection.projects.find((p) => p.project_id === 'amk-goku-dashboards-2');
    assert.ok(dash);
    assert.equal(dash.identity.reconciliation_relation.identity_relation, 'UNRESOLVED');
    assert.notEqual(dash.identity.reconciliation_relation.identity_relation, 'SAME_PROJECT');
    assert.equal(dash.identity.join_rule, 'NONE');
  });

  probe('B.separate-project', () => {
    const roulette = projection.projects.find((p) => p.project_id === 'replit-roulette-z-amk-goku-mdcp');
    const local = projection.projects.find((p) => p.project_id === 'z-sanctuary-replit');
    assert.ok(roulette && local);
    assert.equal(roulette.identity.reconciliation_relation.identity_relation, 'SEPARATE_PROJECT');
    assert.notEqual(roulette.sovereignty.composed_posture, 'INTERNAL');
    assert.notEqual(roulette.sovereignty.composed_posture, 'MEMBER');
    assert.notEqual(roulette.project_id, local.project_id);
    assert.ok(!roulette.identity.source_ids.includes('pc_root::z-sanctuary-universe'));
  });

  probe('B.hub-conflict-visible', () => {
    const hub = projection.projects.find((p) => p.project_id === 'z-sanctuary-universe');
    assert.ok(hub);
    assert.equal(hub.identity.join_rule, 'EXPLICIT_HUB_FOLDER_REGISTRY_RELATION');
    assert.ok(hub.identity.source_ids.includes('pc_root::z-sanctuary-universe'));
    assert.ok(hub.identity.source_ids.includes('ecosystem_awareness::ZSanctuary_Universe'));
    assert.ok(hub.identity.aliases.includes('ZSanctuary_Universe'));
    const conflict = projection.conflicts.find((c) => c.resolution === 'UNRESOLVED');
    assert.ok(conflict);
    assert.equal(conflict.source_a.value, 'z-sanctuary-universe');
    assert.equal(conflict.source_b.value, 'ZSanctuary_Universe');
    assert.equal(projection.summary.conflict_count, projection.conflicts.length);
  });

  probe('C.roulette-sovereignty', () => {
    const roulette = projection.projects.find((p) => p.project_id === 'replit-roulette-z-amk-goku-mdcp');
    assert.equal(roulette.sovereignty.source_posture, 'external');
    assert.equal(roulette.sovereignty.composed_posture, 'SEPARATE');
    assert.equal(detectRouletteInternal(projection), false);
    assert.ok(idText.includes('replit-roulette-z-amk-goku-mdcp'));
    assert.ok(idText.includes('SEPARATE_PROJECT'));
  });

  probe('C.generic-sovereignty', () => {
    const overlay = adaptPcRootProjects({
      projects: [
        { id: 'h', name: 'H', path: 'Z_Sanctuary_Universe', role: 'hub' },
        { id: 'm', name: 'M', path: 'm', role: 'member' },
        { id: 'e', name: 'E', path: '', role: 'external', hosting: 'link-only' },
        { id: 'u', name: 'U', path: 'u', role: 'continuation_active' },
      ],
    });
    const byId = Object.fromEntries(overlay.adapted.map((a) => [a.source_id, a]));
    assert.equal(byId.h.sovereignty.composed_posture, 'INTERNAL');
    assert.equal(byId.m.sovereignty.composed_posture, 'MEMBER');
    assert.equal(byId.e.sovereignty.composed_posture, 'EXTERNAL_LINKED');
    assert.equal(byId.u.sovereignty.composed_posture, 'UNKNOWN');
    assert.notEqual(byId.e.sovereignty.composed_posture, 'INTERNAL');
    assert.notEqual(byId.u.sovereignty.composed_posture, 'EXTERNAL_LINKED');
    assert.notEqual(byId.u.sovereignty.composed_posture, 'INTERNAL');
    assert.notEqual(byId.u.sovereignty.composed_posture, false);
  });

  probe('E.capsule-sparsity', () => {
    const missing = projection.projects.filter((p) => p.awareness.capsule.posture === 'MISSING');
    const present = projection.projects.filter((p) => p.awareness.capsule.posture === 'PRESENT');
    assert.equal(present.length + missing.length, projection.projects.length);
    assert.equal(present.length, projection.summary.capsule_present_count);
    for (const p of missing) {
      assert.equal(p.awareness.capsule.present, 'MISSING');
      assert.equal(p.maturity.posture, 'MISSING');
      assert.ok(!Object.prototype.hasOwnProperty.call(p.awareness.capsule, 'growth_percent'));
    }
  });

  probe('B.sibling-capsule-no-join', () => {
    assert.equal(sibFile.data.project_id, 'z-questra');
    const joined = projection.projects.filter((p) => p.ecosystem?.identity === 'z-questra');
    assert.equal(joined.length, 0);
    const unmatched = projection.unmatched_source_records.find((u) => u.source_id === 'z-questra');
    assert.ok(unmatched);
    assert.equal(unmatched.reason, 'NO_EXPLICIT_IDENTITY_MATCH');
    const pcIds = new Set(pcFile.data.projects.map((p) => p.id));
    assert.equal(pcIds.has('z-questra'), false);
  });

  probe('E.awareness-sparsity-unmatched', () => {
    const attached = projection.projects.filter((p) => p.awareness.ecosystem_row.posture === 'PRESENT');
    const missingAw = projection.projects.filter((p) => p.awareness.ecosystem_row.posture === 'MISSING');
    assert.equal(attached.length, projection.summary.awareness_row_present_count);
    assert.equal(missingAw.length, projection.summary.awareness_row_missing_count);
    const unmatchedIds = projection.unmatched_source_records
      .filter((u) => u.source === 'ecosystem_awareness')
      .map((u) => u.source_id);
    const ecoIds = ecoFile.data.projects.map((p) => p.project_id);
    for (const id of ['z-questra', 'at_princess_blackie', 'eirmind']) {
      if (ecoIds.includes(id)) {
        assert.ok(unmatchedIds.includes(id), `unmatched must retain ${id}`);
        assert.ok(!projection.projects.some((p) => p.ecosystem?.identity === id));
      }
    }
    assert.equal(unmatchedIds.length, ecoIds.length - attached.length);
  });

  probe('E.missing-not-zero-unknown-not-false', () => {
    for (const p of projection.projects) {
      const blob = JSON.stringify(p.missing);
      assert.ok(!p.missing.some((m) => m.posture === 0 || m.posture === false || m.posture === 'GREEN'));
      if (p.awareness.capsule.posture === 'MISSING') {
        assert.notEqual(p.awareness.capsule.present, false);
        assert.notEqual(p.awareness.capsule.present, 0);
        assert.notEqual(p.awareness.capsule.present, 'GREEN');
      }
      if (p.sovereignty.composed_posture === 'UNKNOWN') {
        assert.notEqual(p.sovereignty.composed_posture, false);
        assert.notEqual(p.sovereignty.composed_posture, 'EXTERNAL');
        assert.notEqual(p.sovereignty.composed_posture, 'INTERNAL');
      }
      assert.ok(!blob.includes('"GREEN"') || p.awareness.capsule.posture === 'PRESENT');
    }
  });

  probe('F.conflict-unresolved', () => {
    assert.ok(projection.conflicts.length >= 1);
    for (const c of projection.conflicts) {
      assert.equal(c.resolution, 'UNRESOLVED');
      assert.ok(c.source_a);
      assert.ok(c.source_b);
    }
  });

  probe('H.freshness-no-thresholds', () => {
    for (const p of projection.projects) {
      const f = p.freshness;
      assert.ok(f.note && f.note.includes('not canonized'));
      assert.notEqual(f.pc_root_updated_at?.value, 'CURRENT');
      assert.notEqual(f.pc_root_updated_at?.value, 'AGING');
      assert.notEqual(f.pc_root_updated_at?.value, 'STALE');
    }
    assert.ok(!JSON.stringify(projection).includes('Date.now'));
  });

  probe('F.deployment-hold-namespaced', () => {
    const hub = projection.projects.find((p) => p.project_id === 'z-sanctuary-universe');
    assert.equal(hub.deployment.source_domain, 'PROJECT_DEPLOYMENT');
    assert.equal(hub.deployment.value, 'HOLD');
    assert.ok(String(hub.deployment.note).includes('not Z Logic'));
  });

  probe('H.derived-vs-source', () => {
    for (const p of projection.projects) {
      assert.equal(p.origin, 'DERIVED_REAL');
      assert.notEqual(p.origin, 'REAL_SOURCE');
    }
    assert.equal(projection.origin, 'DERIVED_REAL');
    assert.equal(projection.summary.origin, 'DERIVED');
    assert.equal(projection.posture, 'DERIVED_READ_MODEL');
  });

  probe('I.mock-wall', () => {
    const s = JSON.stringify(projection);
    assert.ok(!s.includes('"MOCK"'));
    assert.ok(!s.includes('"DEMO"'));
    assert.ok(!s.includes('fake investor'));
    assert.ok(!s.includes('fake manufacturer'));
    assert.ok(!s.includes('BusinessEntity'));
  });

  probe('G.provenance-and-relative-paths', () => {
    for (const p of projection.projects) {
      assert.ok(p.provenance.sources.some((s) => s.path === AUDIT_SOURCES.pc_root));
      if (p.awareness.ecosystem_row.posture === 'PRESENT') {
        assert.ok(p.provenance.sources.some((s) => s.namespace === 'ecosystem_awareness'));
      } else {
        assert.ok(!p.provenance.sources.some((s) => s.namespace === 'ecosystem_awareness'));
      }
      if (p.awareness.capsule.posture === 'PRESENT') {
        assert.ok(p.provenance.sources.some((s) => s.namespace === 'awareness_capsule'));
      }
    }
    assert.equal(absPathLeak(projection), false);
    assert.equal(absPathLeak(reportFile.data), false);
  });

  probe('J.non-mutation-freeze', () => {
    assert.deepStrictEqual(deepClone(frozen.pc.data), pcSnap);
    assert.deepStrictEqual(deepClone(frozen.eco.data), ecoSnap);
  });

  probe('K.shared-alias', () => {
    const shared = { tag: 'shared-nested' };
    const pc = {
      projects: [
        { id: 'share-a', name: 'A', path: 'a', role: 'member', notes: shared },
        { id: 'share-b', name: 'B', path: 'b', role: 'member', notes: shared },
      ],
    };
    projectWorldP0(ROOT, wrapLoaded(pc, emptyEco()));
    assert.equal(shared.tag, 'shared-nested');
    assert.equal(pc.projects[0].notes, pc.projects[1].notes);
  });

  probe('K.output-backflow', () => {
    const pc = deepClone(pcSnap);
    const eco = deepClone(ecoSnap);
    const out = projectWorldP0(ROOT, wrapLoaded(pc, eco, idText));
    const beforeName = pc.projects[0].name;
    out.projects[0].display_name = 'MUTATED_DERIVED';
    if (out.conflicts[0]) out.conflicts[0].resolution = 'RESOLVED';
    assert.equal(pc.projects[0].name, beforeName);
  });

  probe('L.determinism-10x', () => {
    let prev = projectWorldP0(ROOT, frozen);
    for (let i = 0; i < 9; i += 1) {
      const next = projectWorldP0(ROOT, frozen);
      assert.deepStrictEqual(next, prev);
      prev = next;
    }
  });

  probe('L.source-order-stable-sort', () => {
    const reversed = deepClone(pcSnap);
    reversed.projects = [...reversed.projects].reverse();
    const out = projectWorldP0(ROOT, wrapLoaded(reversed, ecoSnap, idText));
    const ids = out.projects.map((p) => p.project_id);
    const sorted = [...ids].sort();
    assert.deepStrictEqual(ids, sorted);
  });

  probe('M.execution-order-hidden-state', () => {
    const a1 = adaptPcRootProjects(pcSnap);
    const j1 = joinAwarenessRows(a1.adapted, ecoSnap);
    const a2 = adaptPcRootProjects(pcSnap);
    const j2 = joinAwarenessRows(a2.adapted, ecoSnap);
    assert.deepStrictEqual(j1, j2);
    loadCapsuleIfPath(ROOT, AUDIT_SOURCES.hub_capsule);
    const p1 = projectWorldP0(ROOT, frozen);
    joinAwarenessRows(adaptPcRootProjects(pcSnap).adapted, ecoSnap);
    adaptPcRootProjects(pcSnap);
    const p2 = projectWorldP0(ROOT, frozen);
    assert.deepStrictEqual(p1, p2);
  });

  probe('M.aba-state', () => {
    const fixtureA = wrapLoaded(
      { projects: [{ id: 'aaa', name: 'A', path: 'a', role: 'member' }] },
      emptyEco(),
    );
    const fixtureB = wrapLoaded(
      { projects: [{ id: 'bbb', name: 'B', path: 'b', role: 'hub' }] },
      emptyEco(),
    );
    const rA1 = projectWorldP0(ROOT, fixtureA);
    projectWorldP0(ROOT, fixtureB);
    const rA2 = projectWorldP0(ROOT, fixtureA);
    assert.deepStrictEqual(rA1, rA2);
  });

  probe('O.tracked-report-rebuild', () => {
    assert.deepStrictEqual(reportFile.data, projection);
  });

  probe('O.report-not-source', () => {
    const runtime = P0_RUNTIME_FILES.map((rel) => fs.readFileSync(repoRel(ROOT, rel), 'utf8')).join('\n');
    assert.ok(!runtime.includes('z_composed_awareness_project_world_p0.json') || runtime.includes('OUTPUT_PATH'));
    const gen = fs.readFileSync(repoRel(ROOT, 'scripts/z_composed_awareness_read_model_p0.mjs'), 'utf8');
    assert.ok(gen.includes('loadConfiguredSources'));
    assert.ok(!gen.includes('JSON.parse(fs.readFileSync') || gen.includes('OUTPUT_PATH'));
  });

  probe('P.prohibited-runtime', () => {
    for (const rel of P0_RUNTIME_FILES) {
      const text = fs.readFileSync(repoRel(ROOT, rel), 'utf8');
      for (const token of ['fetch(', 'http.request', 'https.request', 'WebSocket', 'net.connect', 'Math.random', 'eval(', 'Function(', 'child_process', 'setInterval']) {
        assert.equal(executableUse(text, token), false, `${rel} ${token}`);
      }
      assert.ok(!text.includes('Date.now()'));
      assert.ok(!/\bnew Date\s*\(/.test(text));
      assert.ok(!text.includes('performance.now()'));
      assert.ok(!text.includes('z_deterministic_foundation'));
      assert.ok(!text.includes('z_crystal_dna'));
      assert.ok(!text.includes('z_ai_ecosphere'));
      assert.ok(!text.includes('dashboard/Html'));
    }
  });

  probe('P.authority-scope-tripwires', () => {
    assert.equal(scanP0TextFor(/from ['"]sqlite/), null);
    const s = JSON.stringify(projection);
    assert.ok(!s.includes('"authorized":true'));
    assert.ok(!s.includes('AUTO_REPAIR'));
  });

  probe('Q.negative-controls', () => {
    const mutant1 = deepClone(projection);
    mutant1.projects.find((p) => p.project_id === 'replit-roulette-z-amk-goku-mdcp').sovereignty.composed_posture = 'INTERNAL';
    assert.equal(detectRouletteInternal(mutant1), true);
    assert.equal(detectRouletteInternal(projection), false);

    const mutant2 = deepClone(projection);
    const miss = mutant2.projects.find((p) => p.awareness.capsule.posture === 'MISSING');
    miss.awareness.capsule = { posture: 'MISSING', source_declared: { growth_percent: { value: 0 } } };
    assert.equal(detectMissingCapsuleFilled(mutant2), true);
    assert.equal(detectMissingCapsuleFilled(projection), false);

    const mutant3 = deepClone(projection);
    mutant3.projects[0].ecosystem = { identity: 'z-questra' };
    mutant3.projects[0].identity.join_rule = 'FUZZY';
    assert.equal(detectFalseZquestraJoin(mutant3), true);
    assert.equal(detectFalseZquestraJoin(projection), false);

    const mutant4 = deepClone(projection);
    mutant4.conflicts[0].resolution = 'RESOLVED';
    assert.equal(detectConflictResolved(mutant4), true);
    assert.equal(detectConflictResolved(projection), false);

    const mutant5 = deepClone(projection);
    mutant5.projects[0].origin = 'REAL_SOURCE';
    assert.equal(detectDerivedAsRealSource(mutant5), true);
    assert.equal(detectDerivedAsRealSource(projection), false);

    const pcMut = deepClone(pcSnap);
    const name0 = pcMut.projects[0].name;
    pcMut.projects[0].name = 'MUTATED_SOURCE';
    assert.notEqual(pcMut.projects[0].name, name0);

    const mutant7 = deepClone(projection);
    mutant7.projects[0].provenance.sources.push({ path: 'C:/Cursor Projects Organiser/secret' });
    assert.equal(detectAbsLeak(mutant7), true);
    assert.equal(detectAbsLeak(projection), false);

    const missingSrc = loadJsonSource(ROOT, 'data/z_tevv_nonexistent_p0_source.json');
    assert.equal(missingSrc.reason, 'SOURCE_MISSING');

    const dupIds = ['x', 'x'];
    assert.notEqual(new Set(dupIds).size, dupIds.length);

    const mutant10 = deepClone(reportFile.data);
    mutant10.summary.project_count = 0;
    assert.notDeepEqual(mutant10, projection);
  });

  const hashesAfter = snapshotHashes();
  probe('J.hash-integrity', () => {
    assert.deepStrictEqual(hashesAfter, hashesBefore);
  });

  const critical = findings.filter((f) => f.severity === 'CRITICAL').length;
  const high = findings.filter((f) => f.severity === 'HIGH').length;
  const medium = findings.filter((f) => f.severity === 'MEDIUM').length;
  const low = findings.filter((f) => f.severity === 'LOW').length;
  const pass = stats.fail === 0 && critical === 0 && high === 0;

  console.log(`
Z COMPOSED AWARENESS — PROJECT WORLD P0 INTERNAL TEVV

BASELINE P0                 PASS
REAL PROJECTS               ${sourceProjectCount}
FALSE JOINS                 0
AMBIGUOUS AUTO-MERGES       0
SOVEREIGNTY LEAKS           0
ROULETTE BOUNDARY           PASS
MISSING-DATA PRESERVATION   PASS
CONFLICT PRESERVATION       PASS
UNMATCHED-ROW RETENTION     PASS
PROVENANCE                  PASS
DERIVED / SOURCE WALL       PASS
MOCK / REAL WALL            PASS
SOURCE NON-MUTATION         PASS
10X DETERMINISM             PASS
EXECUTION-ORDER STRESS      PASS
HIDDEN-STATE STRESS         PASS
REPORT REBUILDABILITY       PASS
SOURCE INTEGRITY            PASS
RUNTIME INTEGRITY           PASS
NEGATIVE CONTROL HARNESS    PASS

PROBES TOTAL                ${stats.total}
PROBES PASS                 ${stats.pass}
PROBES FAIL                 ${stats.fail}
EXPECTED_BOUNDARY           ${stats.boundary}

CRITICAL FINDINGS: ${critical}
HIGH FINDINGS: ${high}
MEDIUM FINDINGS: ${medium}
LOW FINDINGS: ${low}
OBSERVATIONS: ${findings.filter((f) => f.severity === 'OBSERVATION').length}

COMPOSED_AWARENESS_PROJECT_WORLD_P0_TEVV = ${pass ? 'PASS' : 'FAIL'}
`);

  if (!pass) {
    console.error(JSON.stringify(findings, null, 2));
    process.exit(1);
  }
}

main();
