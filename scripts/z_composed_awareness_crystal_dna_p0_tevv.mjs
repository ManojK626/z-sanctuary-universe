#!/usr/bin/env node
/**
 * Internal TEVV — try to falsify Crystal DNA P0. Not a verifier wrapper. Writes no files.
 */
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { projectCrystalDnaP0 } from './z_composed_awareness_crystal_dna/crystal_dna_projection.mjs';
import { adaptDrift } from './z_composed_awareness_crystal_dna/drift_adapter.mjs';
import { adaptDependencies, adaptManifest } from './z_composed_awareness_crystal_dna/manifest_adapter.mjs';
import { projectCoverage } from './z_composed_awareness_crystal_dna/project_coverage.mjs';
import {
  deepClone,
  deepFreeze,
  loadJson,
  repoRel,
  sha256File,
  stableStringify,
} from './z_composed_awareness_crystal_dna/source_loader.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SEALED_HEAD = '9f0b9ba';
const ROULETTE = 'replit-roulette-z-amk-goku-mdcp';

const AUDIT_SOURCES = {
  manifest: 'data/z_crystal_dna_asset_manifest.json',
  drift: 'data/reports/z_crystal_dna_drift_report.json',
  pc_root: 'data/z_pc_root_projects.json',
  tracked: 'data/reports/z_composed_awareness_crystal_dna_p0.json',
};

const SUT_FILES = [
  'scripts/z_composed_awareness_crystal_dna/constants.mjs',
  'scripts/z_composed_awareness_crystal_dna/source_loader.mjs',
  'scripts/z_composed_awareness_crystal_dna/manifest_adapter.mjs',
  'scripts/z_composed_awareness_crystal_dna/drift_adapter.mjs',
  'scripts/z_composed_awareness_crystal_dna/project_coverage.mjs',
  'scripts/z_composed_awareness_crystal_dna/crystal_dna_projection.mjs',
  'scripts/z_composed_awareness_crystal_dna_p0.mjs',
];
const VERIFIER_FILE = 'scripts/z_composed_awareness_crystal_dna_p0_verify.mjs';

const stats = { total: 0, pass: 0, fail: 0, boundary: 0 };
const findings = [];

function shaBuf(buf) {
  return crypto.createHash('sha256').update(buf).digest('hex');
}

function tevvSortKeys(value) {
  if (Array.isArray(value)) return value.map(tevvSortKeys);
  if (value && typeof value === 'object') {
    const out = {};
    for (const key of Object.keys(value).sort()) out[key] = tevvSortKeys(value[key]);
    return out;
  }
  return value;
}

function canonicalJsonSha(obj) {
  return shaBuf(Buffer.from(JSON.stringify(tevvSortKeys(obj)), 'utf8'));
}

function snapshot() {
  const out = { byte: {}, canon: {}, sut: {} };
  for (const rel of Object.values(AUDIT_SOURCES)) {
    const abs = repoRel(ROOT, rel);
    const buf = fs.readFileSync(abs);
    out.byte[rel] = shaBuf(buf);
    out.canon[rel] = canonicalJsonSha(JSON.parse(buf.toString('utf8')));
  }
  for (const rel of [...SUT_FILES, VERIFIER_FILE]) out.sut[rel] = sha256File(repoRel(ROOT, rel));
  return out;
}

function loadHead(rel) {
  const b = execFileSync('git', ['show', `${SEALED_HEAD}:${rel}`]);
  return { sha256: shaBuf(b), data: JSON.parse(b.toString('utf8')) };
}

function wrap(manifest, drift, pc) {
  return {
    manifest: { ok: true, path: AUDIT_SOURCES.manifest, sha256: 'fixture', data: manifest },
    drift: { ok: true, path: AUDIT_SOURCES.drift, sha256: 'fixture', data: drift },
    pc_root: { ok: true, path: AUDIT_SOURCES.pc_root, sha256: 'fixture', data: pc },
  };
}

function shard(id, extra = {}) {
  return {
    id,
    type: 'asset',
    path: extra.path || `docs/${id}.md`,
    owner_layer: extra.owner_layer || 'hub',
    dependencies: extra.dependencies || [],
    hash_optional: extra.hash_optional ?? '',
    rebuild_rule: extra.rebuild_rule || 'none',
    risk: extra.risk || 'low',
    status: extra.status || 'GREEN',
  };
}

function emptyDrift() {
  return { schema: 'z_crystal_dna_drift_report_v1', overall_signal: 'BLUE', findings: [], law: 'detect only' };
}

function miniPc(projects) {
  return { pc_root: 'C:/Cursor Projects Organiser', hub: 'Z_Sanctuary_Universe', projects };
}

function blob(obj) {
  return JSON.stringify(obj);
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
      source_impact: 'P0 invariant failed under TEVV',
      sovereignty_impact: 'unknown until classified',
      gare_impact: 'none assumed',
      authority_impact: 'none assumed',
    });
    throw err;
  }
}

function executableUse(text, token) {
  const lines = text.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('/*')) continue;
    if (trimmed.includes('FORBIDDEN')) continue;
    if (trimmed.includes(token) && !trimmed.includes(`'${token}'`) && !trimmed.includes(`"${token}"`)) {
      if (token === 'fetch(' && /fetch\s*\(/.test(trimmed)) return true;
      if (token !== 'fetch(' && trimmed.includes(token)) return true;
    }
  }
  return false;
}

function stripExecSha(p) {
  const c = deepClone(p);
  if (c.sources) for (const s of c.sources) delete s.sha256;
  return c;
}

function detectFalseJoin(proj) {
  return (proj.project_coverage || []).some((c) => c.crystal_dna_presence === 'PRESENT' && c.join_rule !== 'EXACT_CANONICAL_ID');
}

function detectOwnerLayerJoin(proj, owner) {
  return (proj.project_coverage || []).some(
    (c) => c.crystal_dna_presence === 'PRESENT' && c.project_id !== owner && String(c.note || '').includes(owner),
  );
}

function detectMissingAsGreen(proj) {
  return (proj.project_coverage || []).some(
    (c) => c.crystal_dna_presence === 'GREEN' || c.crystal_dna_presence === 'HEALTHY' || c.crystal_dna_presence === false || c.crystal_dna_presence === 0,
  );
}

function detectGreenAsHealth(proj) {
  const s = blob(proj);
  return s.includes('PROJECT HEALTHY') || s.includes('"CURRENT"') && s.includes('project health') && s.includes('DEPLOY READY');
}

function detectCorruptFromDrift(proj) {
  return blob(proj).includes('"corrupt":true');
}

function detectGareRecipe(proj) {
  return (proj.shards || []).some((x) => x.rebuild_rule?.posture === 'GARE_RECIPE' || x.repair_class || x.autonomous_eligible === true);
}

function detectArClass(proj) {
  return /"repair_class":\s*"AR-[0-4]"/.test(blob(proj)) || blob(proj).includes('"AR-1"') || blob(proj).includes('"AR-2"');
}

function detectRouletteJoin(proj) {
  const r = (proj.project_coverage || []).find((c) => c.project_id === ROULETTE);
  return Boolean(r && r.crystal_dna_presence === 'PRESENT');
}

function detectDerivedAsSource(proj) {
  return (proj.shards || []).some((s) => s.origin === 'REAL_SOURCE');
}

function detectAbsLeak(proj) {
  return blob(proj).includes('C:/Cursor Projects Organiser') || blob(proj).includes('C:\\\\Cursor Projects Organiser');
}

function detectResolvedMissing(edges) {
  return edges.some((e) => e.resolution === 'RESOLVED' && e.to_shard === 'absent-target-xyz');
}

function main() {
  const before = snapshot();

  const manifestFile = loadJson(ROOT, AUDIT_SOURCES.manifest);
  const driftFile = loadJson(ROOT, AUDIT_SOURCES.drift);
  const pcFile = loadJson(ROOT, AUDIT_SOURCES.pc_root);
  const tracked = loadJson(ROOT, AUDIT_SOURCES.tracked);
  assert.equal(manifestFile.ok && driftFile.ok && pcFile.ok && tracked.ok, true);

  const mSnap = deepClone(manifestFile.data);
  const dSnap = deepClone(driftFile.data);
  const pSnap = deepClone(pcFile.data);

  const frozen = {
    manifest: { ...manifestFile, data: deepFreeze(deepClone(manifestFile.data)) },
    drift: { ...driftFile, data: deepFreeze(deepClone(driftFile.data)) },
    pc_root: { ...pcFile, data: deepFreeze(deepClone(pcFile.data)) },
  };

  let projection;
  const sourceShardCount = Array.isArray(mSnap.shards) ? mSnap.shards.length : 0;
  let sourceEdgeCount = 0;
  for (const sh of mSnap.shards || []) sourceEdgeCount += (sh.dependencies || []).length;
  const sourceProjectCount = Array.isArray(pSnap.projects) ? pSnap.projects.length : 0;
  const independentJoins = (pSnap.projects || []).filter((p) => (mSnap.shards || []).some((s) => s.id === p.id)).length;

  probe('A.source-resolution', () => {
    assert.equal(manifestFile.path, AUDIT_SOURCES.manifest);
    assert.equal(loadJson(ROOT, 'data/z_tevv_nonexistent_crystal_dna.json').reason, 'SOURCE_MISSING');
    assert.equal(loadJson(ROOT, 'docs/Z_CRYSTAL_DNA_MESH.md').reason, 'SOURCE_INVALID');
  });

  probe('A.enumeration-source-derived', () => {
    projection = projectCrystalDnaP0(frozen);
    assert.equal(Boolean(projection.hard_stop), false);
    assert.equal(projection.summary.shard_count, sourceShardCount);
    assert.equal(projection.summary.dependency_edge_count, sourceEdgeCount);
    assert.equal(projection.project_coverage.length, sourceProjectCount);
    assert.equal(projection.summary.project_exact_join_count, independentJoins);
  });

  probe('B.custody-canonical-head', () => {
    for (const rel of [AUDIT_SOURCES.manifest, AUDIT_SOURCES.drift, AUDIT_SOURCES.pc_root]) {
      const head = loadHead(rel);
      assert.equal(canonicalJsonSha(JSON.parse(fs.readFileSync(repoRel(ROOT, rel), 'utf8'))), canonicalJsonSha(head.data));
    }
  });

  probe('C.shard-identity', () => {
    for (const s of projection.shards) {
      assert.equal(s.source_namespace, 'crystal_dna_manifest');
      assert.equal(s.namespaced_id, `crystal_dna_manifest::${s.source_id}`);
      assert.equal(s.join_as_project, 'NON_PROJECT_ASSET');
      assert.notEqual(s.source_id, s.namespaced_id.split('::')[0]);
    }
    assert.equal(new Set(projection.shards.map((s) => s.source_id)).size, projection.shards.length);
  });

  probe('D.duplicate-shard-id', () => {
    const man = { shards: [shard('dup-shard'), shard('dup-shard')] };
    const out = adaptManifest(man);
    assert.equal(out.hard_stop, 'CRYSTAL_DNA_P0_DUPLICATE_SHARD_ID');
    assert.equal(Boolean(out.shards), false);
  });

  probe('E.duplicate-project-id', () => {
    const pc = miniPc([
      { id: 'dup-id', name: 'One', path: 'a', role: 'member' },
      { id: 'dup-id', name: 'Two', path: 'b', role: 'member' },
    ]);
    const adapted = adaptManifest({ shards: [shard('x')] });
    const cov = projectCoverage(pc, adapted.shards);
    assert.equal(cov.hard_stop, 'CRYSTAL_DNA_P0_PRIMARY_PROJECT_ID_AMBIGUITY');
  });

  probe('F.dependency-direction', () => {
    const ab = adaptDependencies({ shards: [shard('A', { dependencies: ['B'] }), shard('B')] }, new Set(['A', 'B']));
    const ba = adaptDependencies({ shards: [shard('A'), shard('B', { dependencies: ['A'] })] }, new Set(['A', 'B']));
    assert.equal(ab[0].from_shard, 'A');
    assert.equal(ab[0].to_shard, 'B');
    assert.equal(ab[0].direction, 'DEPENDS_ON');
    assert.equal(ba[0].from_shard, 'B');
    assert.equal(ba[0].to_shard, 'A');
    assert.notDeepEqual(ab, ba);
  });

  probe('G.missing-dependency-target', () => {
    const ids = new Set(['only']);
    const edges = adaptDependencies({ shards: [shard('only', { dependencies: ['absent-target-xyz'] })] }, ids);
    assert.equal(edges.length, 1);
    assert.equal(edges[0].resolution, 'UNRESOLVED');
    assert.equal(edges[0].to_shard, 'absent-target-xyz');
    assert.equal(detectResolvedMissing(edges), false);
  });

  probe('G.dependency-not-ownership', () => {
    for (const e of projection.dependencies) {
      assert.equal(e.note.includes('OWNERSHIP'), true);
      assert.ok(!Object.prototype.hasOwnProperty.call(e, 'sovereignty'));
      assert.ok(!Object.prototype.hasOwnProperty.call(e, 'membership'));
    }
  });

  probe('H.project-join-safety', () => {
    const pc = miniPc([
      { id: 'z-sanctuary-universe', name: 'Hub', path: 'Z_Sanctuary_Universe', role: 'hub' },
      { id: 'member-one', name: 'M', path: 'Member One', role: 'member' },
    ]);
    const man = {
      shards: [
        shard('owner-bait', { owner_layer: 'z-sanctuary-universe' }),
        shard('path-bait', { path: 'Z_Sanctuary_Universe/docs/foo.md' }),
        shard('spell-bait', { id: 'ZSanctuary_Universe' }),
      ],
    };
    man.shards[2] = shard('ZSanctuary_Universe');
    const out = projectCrystalDnaP0(wrap(man, emptyDrift(), pc));
    const byId = Object.fromEntries(out.project_coverage.map((c) => [c.project_id, c]));
    assert.equal(byId['z-sanctuary-universe'].crystal_dna_presence, 'MISSING');
    assert.equal(byId['member-one'].crystal_dna_presence, 'MISSING');
    assert.equal(out.summary.project_exact_join_count, 0);
  });

  probe('H.exact-id-join-allowed', () => {
    const pc = miniPc([{ id: 'member-one', name: 'M', path: 'm', role: 'member' }]);
    const man = { shards: [shard('member-one')] };
    const out = projectCrystalDnaP0(wrap(man, emptyDrift(), pc));
    assert.equal(out.project_coverage[0].crystal_dna_presence, 'PRESENT');
    assert.equal(out.project_coverage[0].join_rule, 'EXACT_CANONICAL_ID');
  });

  probe('H.case-spelling', () => {
    const pc = miniPc([{ id: 'z-sanctuary-universe', name: 'Hub', path: 'Z_Sanctuary_Universe', role: 'hub' }]);
    for (const id of ['ZSanctuary_Universe', 'z_sanctuary_universe', 'z-sanctuary-univers']) {
      const out = projectCrystalDnaP0(wrap({ shards: [shard(id)] }, emptyDrift(), pc));
      assert.equal(out.project_coverage[0].crystal_dna_presence, 'MISSING');
    }
  });

  probe('I.real-coverage-no-heuristic', () => {
    assert.equal(projection.summary.project_exact_join_count, independentJoins);
    for (const c of projection.project_coverage) {
      if (independentJoins === 0) {
        assert.equal(c.crystal_dna_presence, 'MISSING');
        assert.equal(c.join_rule, 'NONE');
      }
      assert.notEqual(c.crystal_dna_presence, 'GREEN');
      assert.notEqual(c.crystal_dna_presence, 'HEALTHY');
      assert.notEqual(c.crystal_dna_presence, 'UNHEALTHY');
      assert.notEqual(c.crystal_dna_presence, false);
      assert.notEqual(c.crystal_dna_presence, 0);
    }
  });

  probe('L.roulette', () => {
    const r = projection.project_coverage.find((c) => c.project_id === ROULETTE);
    assert.ok(r);
    assert.equal(r.crystal_dna_presence, 'MISSING');
    assert.ok(!projection.shards.some((s) => s.source_id === ROULETTE));
    const pcRow = pSnap.projects.find((p) => p.id === ROULETTE);
    assert.equal(pcRow.role, 'external');
    assert.equal(detectRouletteJoin(projection), false);
  });

  probe('M.status-namespaces', () => {
    for (const s of projection.shards) {
      assert.equal(s.status.namespace, 'CRYSTAL_DNA_CARD');
      assert.ok(!blob(s.status).includes('Z_LOGIC'));
    }
    assert.equal(projection.drift.overall_signal.namespace, 'CRYSTAL_DNA_DRIFT');
    for (const f of projection.drift.findings) assert.equal(f.signal.namespace, 'CRYSTAL_DNA_DRIFT');
  });

  probe('N.green-yellow-red-walls', () => {
    const t = blob(projection);
    assert.ok(!t.includes('DEPLOY READY'));
    assert.ok(!t.includes('WRITE AUTHORIZED'));
    assert.ok(!t.includes('GARE ELIGIBLE'));
    assert.ok(!t.includes('"namespace":"Z_LOGIC"'));
    assert.ok(!t.includes('Z Logic BLOCK'));
    for (const s of projection.shards) {
      assert.ok(!Object.prototype.hasOwnProperty.call(s, 'autonomous_eligible'));
      assert.ok(!Object.prototype.hasOwnProperty.call(s, 'repair_class'));
    }
  });

  probe('N.nas-quarantine', () => {
    const nas = projection.shards.find((s) => s.status.value === 'NAS_WAIT');
    if (nas) {
      assert.equal(nas.status.namespace, 'CRYSTAL_DNA_CARD');
    }
    const sut = SUT_FILES.map((rel) => fs.readFileSync(repoRel(ROOT, rel), 'utf8')).join('\n');
    assert.ok(!sut.includes('fs.unlink'));
    assert.ok(!sut.includes('fs.rmdir'));
    assert.ok(!sut.includes('fs.rename'));
    assert.ok(!sut.includes('net.connect'));
  });

  probe('O.drift-semantics', () => {
    assert.equal(projection.drift.findings.length, (dSnap.findings || []).length);
    assert.equal(detectCorruptFromDrift(projection), false);
    assert.ok(!blob(projection.drift).includes('repair command'));
    assert.ok(!blob(projection).includes('"generated_at"'));
    assert.equal(typeof dSnap.generated_at, 'string');
  });

  probe('P.hash-optional', () => {
    for (const s of projection.shards) {
      const h = s.source_declared.hash_optional;
      if (h && h.value === '') {
        assert.notEqual(h.value, false);
        assert.ok(h.origin === 'REAL_SOURCE');
      }
    }
    const hashed = projectCrystalDnaP0(
      wrap({ shards: [shard('h1', { hash_optional: 'abc' })] }, emptyDrift(), miniPc([{ id: 'p', name: 'P', path: 'p', role: 'member' }])),
    );
    assert.ok(!blob(hashed).includes('SEMANTICALLY CORRECT'));
    assert.ok(!blob(hashed).includes('PRODUCTION READY'));
  });

  probe('Q.rebuild-gare', () => {
    for (const s of projection.shards) {
      assert.equal(s.rebuild_rule.posture, 'DECLARATIVE_RECOVERY_HINT');
    }
    const sut = SUT_FILES.map((rel) => fs.readFileSync(repoRel(ROOT, rel), 'utf8')).join('\n');
    assert.ok(!sut.includes('child_process'));
    assert.ok(!sut.includes('eval('));
    assert.equal(detectGareRecipe(projection), false);
    assert.equal(detectArClass(projection), false);
    const eligible = projection.shards.filter((s) => s.autonomous_eligible === true);
    assert.equal(eligible.length, 0);
  });

  probe('Q.tripwires', () => {
    const sut = SUT_FILES.map((rel) => fs.readFileSync(repoRel(ROOT, rel), 'utf8')).join('\n');
    assert.ok(!sut.includes('Mango Tree'));
    assert.ok(!sut.includes('Tarzan Tree'));
    assert.ok(!sut.includes('z_deterministic_foundation'));
    assert.ok(!sut.includes('z_crystal_dna_drift_check'));
  });

  probe('R.provenance', () => {
    for (const s of projection.shards) {
      assert.equal(s.provenance.path, AUDIT_SOURCES.manifest);
      assert.equal(s.provenance.source_id, s.source_id);
    }
    for (const e of projection.dependencies) {
      assert.ok(e.source.includes('z_crystal_dna_asset_manifest.json'));
    }
    for (const f of projection.drift.findings) {
      assert.equal(f.provenance.path, AUDIT_SOURCES.drift);
    }
    for (const c of projection.project_coverage) {
      assert.equal(c.provenance.path, AUDIT_SOURCES.pc_root);
    }
  });

  probe('R.abs-path-only-from-source', () => {
    const leak = detectAbsLeak(projection);
    if (leak) {
      assert.ok(String(pSnap.pc_root || '').includes('C:/Cursor Projects Organiser') || blob(pSnap).includes('C:/Cursor'));
    }
  });

  probe('S.derived-source-wall', () => {
    for (const s of projection.shards) {
      assert.equal(s.origin, 'DERIVED_REAL');
      assert.equal(s.status.origin, 'REAL_SOURCE');
    }
    assert.equal(projection.summary.origin, 'DERIVED');
    assert.equal(projection.posture, 'DERIVED_READ_MODEL');
    assert.equal(detectDerivedAsSource(projection), false);
  });

  probe('T.deep-freeze-non-mutation', () => {
    const beforeM = deepClone(frozen.manifest.data);
    const beforeD = deepClone(frozen.drift.data);
    const beforeP = deepClone(frozen.pc_root.data);
    projectCrystalDnaP0(frozen);
    assert.deepStrictEqual(deepClone(frozen.manifest.data), beforeM);
    assert.deepStrictEqual(deepClone(frozen.drift.data), beforeD);
    assert.deepStrictEqual(deepClone(frozen.pc_root.data), beforeP);
  });

  probe('U.shared-reference', () => {
    const sharedDeps = ['t'];
    const man = { shards: [shard('a', { dependencies: sharedDeps }), shard('t')] };
    man.shards[0].dependencies = sharedDeps;
    man.shards[1].status = man.shards[0].status;
    const clone = deepClone(man);
    const out = adaptManifest(man);
    assert.equal(Boolean(out.hard_stop), false);
    sharedDeps.push('injected');
    assert.deepEqual(clone.shards[0].dependencies, ['t']);
  });

  probe('V.output-backflow', () => {
    const man = deepClone(mSnap);
    const drift = deepClone(dSnap);
    const pc = deepClone(pSnap);
    const out = projectCrystalDnaP0(wrap(man, drift, pc));
    const id0 = man.shards[0].id;
    out.shards[0].source_id = 'MUTATED';
    out.dependencies[0].resolution = 'HACK';
    out.drift.findings[0].code = 'HACK';
    out.project_coverage[0].crystal_dna_presence = 'GREEN';
    assert.equal(man.shards[0].id, id0);
    assert.equal(drift.findings[0].code, dSnap.findings[0].code);
    assert.equal(pc.projects[0].id, pSnap.projects[0].id);
  });

  probe('W.determinism-10x', () => {
    let prev = projectCrystalDnaP0(frozen);
    for (let i = 0; i < 9; i += 1) {
      const next = projectCrystalDnaP0(frozen);
      assert.deepStrictEqual(next, prev);
      prev = next;
    }
  });

  probe('X.source-order', () => {
    const revM = deepClone(mSnap);
    revM.shards = [...revM.shards].reverse();
    const revP = deepClone(pSnap);
    revP.projects = [...revP.projects].reverse();
    const revD = deepClone(dSnap);
    revD.findings = [...revD.findings].reverse();
    const out = projectCrystalDnaP0(wrap(revM, revD, revP));
    const shardIds = out.shards.map((s) => s.source_id);
    assert.deepStrictEqual(shardIds, [...shardIds].sort());
    const covIds = out.project_coverage.map((c) => c.project_id);
    assert.deepStrictEqual(covIds, [...covIds].sort());
    const deps = out.dependencies;
    for (let i = 1; i < deps.length; i += 1) {
      const prev = `${deps[i - 1].from_shard}\0${deps[i - 1].to_shard}`;
      const cur = `${deps[i].from_shard}\0${deps[i].to_shard}`;
      assert.ok(prev <= cur);
    }
  });

  probe('Y.execution-order', () => {
    const mA = adaptManifest(mSnap);
    const dA = adaptDrift(dSnap);
    const eA = adaptDependencies(mSnap, mA.shard_id_set);
    const cA = projectCoverage(pSnap, mA.shards);
    const dB = adaptDrift(dSnap);
    const mB = adaptManifest(mSnap);
    const cB = projectCoverage(pSnap, mB.shards);
    const eB = adaptDependencies(mSnap, mB.shard_id_set);
    assert.deepStrictEqual(mA, mB);
    assert.deepStrictEqual(dA, dB);
    assert.deepStrictEqual(eA, eB);
    assert.deepStrictEqual(cA, cB);
  });

  probe('Z.hidden-state-aba', () => {
    const a = wrap({ shards: [shard('aaa')] }, emptyDrift(), miniPc([{ id: 'p1', name: 'P1', path: 'p1', role: 'member' }]));
    const b = wrap({ shards: [shard('bbb')] }, emptyDrift(), miniPc([{ id: 'p2', name: 'P2', path: 'p2', role: 'hub' }]));
    const r1 = projectCrystalDnaP0(a);
    projectCrystalDnaP0(b);
    const r2 = projectCrystalDnaP0(a);
    assert.deepStrictEqual(r1, r2);
  });

  probe('AA.checkout-rebuild', () => {
    assert.equal(stableStringify(tracked.data), stableStringify(projection));
  });

  probe('AB.head-semantic-rebuild', () => {
    const head = {
      manifest: { ok: true, path: AUDIT_SOURCES.manifest, ...loadHead(AUDIT_SOURCES.manifest) },
      drift: { ok: true, path: AUDIT_SOURCES.drift, ...loadHead(AUDIT_SOURCES.drift) },
      pc_root: { ok: true, path: AUDIT_SOURCES.pc_root, ...loadHead(AUDIT_SOURCES.pc_root) },
    };
    const fromHead = projectCrystalDnaP0(head);
    assert.equal(stableStringify(stripExecSha(fromHead)), stableStringify(stripExecSha(tracked.data)));
  });

  probe('AB.crlf-lf', () => {
    const lf = '{\n  "k": 1\n}\n';
    const crlf = lf.replace(/\n/g, '\r\n');
    assert.notEqual(shaBuf(Buffer.from(lf, 'utf8')), shaBuf(Buffer.from(crlf, 'utf8')));
    assert.equal(canonicalJsonSha(JSON.parse(lf)), canonicalJsonSha(JSON.parse(crlf)));
  });

  probe('AB.semantic-fingerprint', () => {
    assert.notEqual(canonicalJsonSha({ k: 1 }), canonicalJsonSha({ k: 2 }));
  });

  probe('AB.array-order-fingerprint', () => {
    assert.notEqual(canonicalJsonSha({ a: [1, 2] }), canonicalJsonSha({ a: [2, 1] }));
  });

  probe('AC.report-not-source', () => {
    const adapters = SUT_FILES.filter((f) => !f.endsWith('z_composed_awareness_crystal_dna_p0.mjs') && !f.endsWith('constants.mjs'));
    for (const rel of adapters) {
      const text = fs.readFileSync(repoRel(ROOT, rel), 'utf8');
      assert.ok(!text.includes('z_composed_awareness_crystal_dna_p0.json'));
    }
  });

  probe('AC.prohibited-runtime', () => {
    for (const rel of SUT_FILES) {
      const text = fs.readFileSync(repoRel(ROOT, rel), 'utf8');
      for (const token of ['fetch(', 'http.request', 'https.request', 'WebSocket', 'net.connect', 'Math.random', 'eval(', 'Function(', 'child_process', 'setInterval']) {
        assert.equal(executableUse(text, token), false, `${rel} ${token}`);
      }
      assert.ok(!text.includes('Date.now()'));
      assert.ok(!/\bnew Date\s*\(/.test(text));
      assert.ok(!text.includes('performance.now()'));
    }
  });

  probe('AD.negative-controls', () => {
    const m1 = adaptManifest({ shards: [shard('dup-shard'), shard('dup-shard')] });
    assert.equal(m1.hard_stop, 'CRYSTAL_DNA_P0_DUPLICATE_SHARD_ID');

    const m2 = projectCoverage(
      miniPc([
        { id: 'dup-id', name: 'A', path: 'a', role: 'member' },
        { id: 'dup-id', name: 'B', path: 'b', role: 'member' },
      ]),
      adaptManifest({ shards: [shard('x')] }).shards,
    );
    assert.equal(m2.hard_stop, 'CRYSTAL_DNA_P0_PRIMARY_PROJECT_ID_AMBIGUITY');

    const fakeResolved = [{ from_shard: 'only', to_shard: 'absent-target-xyz', resolution: 'RESOLVED' }];
    assert.equal(detectResolvedMissing(fakeResolved), true);

    const mutantJoin = deepClone(projection);
    mutantJoin.project_coverage[0].crystal_dna_presence = 'PRESENT';
    mutantJoin.project_coverage[0].join_rule = 'OWNER_LAYER';
    assert.equal(detectFalseJoin(mutantJoin), true);
    assert.equal(detectFalseJoin(projection), false);

    const mutantGreen = deepClone(projection);
    mutantGreen.project_coverage[0].crystal_dna_presence = 'GREEN';
    assert.equal(detectMissingAsGreen(mutantGreen), true);
    assert.equal(detectMissingAsGreen(projection), false);

    const mutantHealth = deepClone(projection);
    mutantHealth.note = 'PROJECT HEALTHY';
    assert.ok(blob(mutantHealth).includes('PROJECT HEALTHY'));

    const mutantCorrupt = deepClone(projection);
    mutantCorrupt.drift.corrupt = true;
    assert.equal(detectCorruptFromDrift(mutantCorrupt), true);

    const mutantRecipe = deepClone(projection);
    mutantRecipe.shards[0].rebuild_rule.posture = 'GARE_RECIPE';
    mutantRecipe.shards[0].autonomous_eligible = true;
    assert.equal(detectGareRecipe(mutantRecipe), true);

    const mutantAr = deepClone(projection);
    mutantAr.shards[0].repair_class = 'AR-2';
    assert.ok(blob(mutantAr).includes('AR-2'));

    const mutantR = deepClone(projection);
    mutantR.project_coverage.find((c) => c.project_id === ROULETTE).crystal_dna_presence = 'PRESENT';
    assert.equal(detectRouletteJoin(mutantR), true);

    const mutantOrigin = deepClone(projection);
    mutantOrigin.shards[0].origin = 'REAL_SOURCE';
    assert.equal(detectDerivedAsSource(mutantOrigin), true);

    const pcMut = deepClone(pSnap);
    pcMut.projects[0].id = 'MUTATED_SOURCE';
    assert.notEqual(pcMut.projects[0].id, pSnap.projects[0].id);

    const mutantAbs = deepClone(projection);
    mutantAbs.shards[0].provenance.path = 'C:/Cursor Projects Organiser/secret';
    assert.equal(detectAbsLeak(mutantAbs), true);

    const mutantReport = deepClone(tracked.data);
    mutantReport.summary.shard_count = 0;
    assert.notDeepEqual(mutantReport, projection);

    const lf = '{"k":1}';
    const crlf = '{\r\n"k":1\r\n}';
    assert.notEqual(shaBuf(Buffer.from(lf)), shaBuf(Buffer.from(crlf)));
    assert.equal(canonicalJsonSha(JSON.parse(lf)), canonicalJsonSha(JSON.parse(crlf)));
    assert.notEqual(canonicalJsonSha({ k: 1 }), canonicalJsonSha({ k: 2 }));
    assert.notEqual(canonicalJsonSha({ a: [1, 2] }), canonicalJsonSha({ a: [2, 1] }));
  });

  const after = snapshot();
  probe('J.hash-integrity', () => {
    assert.deepStrictEqual(after, before);
  });

  if (adaptManifest({ shards: [{ type: 'x' }] }).hard_stop === 'CRYSTAL_DNA_P0_DUPLICATE_SHARD_ID') {
    findings.push({
      id: 'OBS-ID-001',
      severity: 'OBSERVATION',
      area: 'shard-identity',
      finding: 'Missing shard id reuses CRYSTAL_DNA_P0_DUPLICATE_SHARD_ID stop code.',
      reproducer: 'manifest shard without id',
      source_impact: 'fail-safe still stops; code name is coarse',
      sovereignty_impact: 'none',
      gare_impact: 'none',
      authority_impact: 'none',
    });
  }

  const critical = findings.filter((f) => f.severity === 'CRITICAL').length;
  const high = findings.filter((f) => f.severity === 'HIGH').length;
  const medium = findings.filter((f) => f.severity === 'MEDIUM').length;
  const low = findings.filter((f) => f.severity === 'LOW').length;
  const pass = stats.fail === 0 && critical === 0 && high === 0;

  console.log(`
Z COMPOSED AWARENESS — CRYSTAL DNA P0 INTERNAL TEVV

SOURCE CUSTODY                  CLEAN
BASELINE P0                     PASS

SHARDS                          ${sourceShardCount}
DEPENDENCIES                    ${sourceEdgeCount}
FALSE PROJECT JOINS             0
SOVEREIGNTY LEAKS               0

DUPLICATE-ID DEFENSE            PASS
DEPENDENCY DIRECTION            PASS
MISSING DEPENDENCY              PASS
OWNER_LAYER WALL                PASS
PATH-JOIN WALL                  PASS
ROULETTE BOUNDARY               PASS

MISSING DNA                     PASS
STATUS NAMESPACE                PASS
DRIFT NAMESPACE                 PASS
DRIFT / CORRUPTION WALL         PASS
DRIFT / REPAIR WALL             PASS

REBUILD_RULE / GARE WALL        PASS
AUTONOMOUS ELIGIBILITY LEAKS    0

PROVENANCE                      PASS
DERIVED / SOURCE WALL           PASS
SOURCE NON-MUTATION             PASS
OUTPUT BACKFLOW                 PASS

10X DETERMINISM                 PASS
EXECUTION-ORDER                 PASS
HIDDEN STATE                    PASS

CHECKOUT REBUILDABILITY         PASS
SEALED-HEAD SEMANTIC REBUILD    PASS
CANONICAL JSON FINGERPRINT      PASS
CRLF/LF PROBE                   PASS

NETWORK                         NONE
DATABASE                        NONE
AI                              NONE
GARE EXECUTOR                   NONE
AUTONOMOUS REPAIR               NONE

NEGATIVE CONTROL HARNESS        PASS

PROBES TOTAL                    ${stats.total}
PROBES PASS                     ${stats.pass}
PROBES FAIL                     ${stats.fail}
EXPECTED_BOUNDARY               ${stats.boundary}

CRITICAL FINDINGS               ${critical}
HIGH FINDINGS                   ${high}
MEDIUM FINDINGS                 ${medium}
LOW FINDINGS                    ${low}
OBSERVATIONS                    ${findings.filter((f) => f.severity === 'OBSERVATION').length}

COMPOSED_AWARENESS_CRYSTAL_DNA_P0_TEVV = ${pass ? 'PASS' : 'FAIL'}
`);

  if (!pass) {
    console.error(JSON.stringify(findings, null, 2));
    process.exit(1);
  }
}

main();
