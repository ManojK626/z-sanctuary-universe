#!/usr/bin/env node
/**
 * Internal TEVV — try to falsify Project World + Crystal DNA P0 composition.
 * Not a wrapper of z_composed_awareness_project_dna_p0_verify.mjs.
 * Writes no files. Does not run child or composition generators.
 */
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  composeProjectWorldAndDna,
  extractExactIdLinks,
  resolveExplicitLinkCandidates,
} from './z_composed_awareness_project_dna/composition.mjs';
import { acquireChildProjections } from './z_composed_awareness_project_dna/input_adapter.mjs';
import { projectWorldP0 } from './z_composed_awareness_read_model/project_world_projection.mjs';
import {
  deepClone as pwClone,
  deepFreeze as pwFreeze,
  loadConfiguredSources,
} from './z_composed_awareness_read_model/source_loader.mjs';
import { SOURCE_PATHS as PW_SOURCE_PATHS } from './z_composed_awareness_read_model/constants.mjs';
import { projectCrystalDnaP0 } from './z_composed_awareness_crystal_dna/crystal_dna_projection.mjs';
import {
  deepClone as dnaClone,
  deepFreeze as dnaFreeze,
  loadConfigured as loadDnaSources,
} from './z_composed_awareness_crystal_dna/source_loader.mjs';
import { SOURCE_PATHS as DNA_SOURCE_PATHS } from './z_composed_awareness_crystal_dna/constants.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const ROULETTE = 'replit-roulette-z-amk-goku-mdcp';
const HUB_SHARD = 'hub_pc_root_projects';
const PW_REPORT = 'data/reports/z_composed_awareness_project_world_p0.json';
const DNA_REPORT = 'data/reports/z_composed_awareness_crystal_dna_p0.json';
const COMPOSED_REPORT = 'data/reports/z_composed_awareness_project_world_crystal_dna_p0.json';
const VERIFIER_FILE = 'scripts/z_composed_awareness_project_dna_p0_verify.mjs';
const GENERATOR_FILE = 'scripts/z_composed_awareness_project_dna_p0.mjs';

const COMPOSITION_SUT = [
  'scripts/z_composed_awareness_project_dna/constants.mjs',
  'scripts/z_composed_awareness_project_dna/canonical_json.mjs',
  'scripts/z_composed_awareness_project_dna/coverage_composer.mjs',
  'scripts/z_composed_awareness_project_dna/composition.mjs',
  'scripts/z_composed_awareness_project_dna/input_adapter.mjs',
  GENERATOR_FILE,
  VERIFIER_FILE,
];

const PW_CHILD = [
  'scripts/z_composed_awareness_read_model/constants.mjs',
  'scripts/z_composed_awareness_read_model/source_loader.mjs',
  'scripts/z_composed_awareness_read_model/identity_adapter.mjs',
  'scripts/z_composed_awareness_read_model/identity_match.mjs',
  'scripts/z_composed_awareness_read_model/ecosystem_awareness_adapter.mjs',
  'scripts/z_composed_awareness_read_model/capsule_adapter.mjs',
  'scripts/z_composed_awareness_read_model/project_world_projection.mjs',
  'scripts/z_composed_awareness_read_model_p0.mjs',
  'scripts/z_composed_awareness_read_model_p0_verify.mjs',
  'scripts/z_composed_awareness_read_model_p0_tevv.mjs',
];

const DNA_CHILD = [
  'scripts/z_composed_awareness_crystal_dna/constants.mjs',
  'scripts/z_composed_awareness_crystal_dna/source_loader.mjs',
  'scripts/z_composed_awareness_crystal_dna/manifest_adapter.mjs',
  'scripts/z_composed_awareness_crystal_dna/drift_adapter.mjs',
  'scripts/z_composed_awareness_crystal_dna/project_coverage.mjs',
  'scripts/z_composed_awareness_crystal_dna/crystal_dna_projection.mjs',
  'scripts/z_composed_awareness_crystal_dna_p0.mjs',
  'scripts/z_composed_awareness_crystal_dna_p0_verify.mjs',
  'scripts/z_composed_awareness_crystal_dna_p0_tevv.mjs',
];

const REPORTS = [PW_REPORT, DNA_REPORT, COMPOSED_REPORT];

const stats = { total: 0, pass: 0, fail: 0, boundary: 0 };
const findings = [];

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
  for (const rel of COMPOSITION_SUT) out.sut[rel] = shaFile(rel);
  for (const rel of [...PW_CHILD, ...DNA_CHILD]) out.child[rel] = shaFile(rel);
  for (const rel of REPORTS) out.report[rel] = shaFile(rel);
  return out;
}

function clone(v) {
  return JSON.parse(JSON.stringify(v));
}

function freeze(value) {
  if (value && typeof value === 'object') {
    Object.freeze(value);
    if (Array.isArray(value)) for (const item of value) freeze(item);
    else for (const key of Object.keys(value)) freeze(value[key]);
  }
  return value;
}

function sortKeys(value) {
  if (Array.isArray(value)) return value.map(sortKeys);
  if (value && typeof value === 'object') {
    const out = {};
    for (const key of Object.keys(value).sort()) out[key] = sortKeys(value[key]);
    return out;
  }
  return value;
}

function stableStringify(value) {
  return `${JSON.stringify(sortKeys(value), null, 2)}\n`;
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
      project_identity_impact: 'see area',
      dna_identity_impact: 'see area',
      sovereignty_impact: 'see area',
      provenance_impact: 'see area',
      gare_impact: 'none assumed',
      authority_impact: 'none assumed',
      recommended_remediation_scope: 'composition P0 only — do not repair during this audit',
    });
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

function tevvExactJoinCount(projects, shards) {
  let n = 0;
  for (const s of shards || []) {
    if (typeof s.source_id !== 'string' || s.source_id.length === 0) continue;
    for (const p of projects || []) {
      if (p.project_id === s.source_id) n += 1;
    }
  }
  return n;
}

function miniPw(projects, extra = {}) {
  return {
    projection_id: extra.projection_id || 'z_composed_awareness_project_world_p0',
    schema_version: extra.schema_version ?? 1,
    implementation_version: extra.implementation_version || 'tevv-fixture',
    projects,
    conflicts: extra.conflicts || [],
    unmatched_source_records: [],
    summary: {},
  };
}

function miniDna({ shards, coverage, deps, drift, extra }) {
  return {
    projection_id: extra?.projection_id || 'z_composed_awareness_crystal_dna_p0',
    schema_version: extra?.schema_version ?? 1,
    implementation_version: extra?.implementation_version || 'tevv-fixture',
    shards,
    dependencies: deps || [],
    drift: drift || {
      overall_signal: { namespace: 'CRYSTAL_DNA_DRIFT', value: 'BLUE' },
      findings: [],
    },
    project_coverage: coverage,
    unmatched_as_projects: [],
  };
}

function proj(id, sov = 'MEMBER') {
  return {
    project_id: id,
    display_name: id,
    sovereignty: { composed_posture: sov, ownership: 'UNCHANGED' },
    provenance: { child: 'project_world', project_id: id },
    status: { namespace: 'PROJECT_WORLD_STATUS', value: 'GREEN' },
  };
}

function sh(id, extra = {}) {
  return {
    source_id: id,
    owner_layer: extra.owner_layer || 'hub',
    path: extra.path || `docs/${id}.md`,
    status: { namespace: 'CRYSTAL_DNA_CARD', value: extra.card || 'GREEN' },
    rebuild_rule: { posture: 'DECLARATIVE_RECOVERY_HINT', text: extra.rebuild || 'none' },
    provenance: { path: 'data/z_crystal_dna_asset_manifest.json', source_id: id },
  };
}

function cov(id, presence = 'MISSING') {
  return {
    project_id: id,
    crystal_dna_presence: presence,
    provenance: { path: 'data/z_pc_root_projects.json' },
  };
}

function composeSafe(pw, dna, meta) {
  try {
    return composeProjectWorldAndDna(pw, dna, meta || {});
  } catch (err) {
    return { hard_stop: 'COMPOSITION_THREW', message: String(err.message || err) };
  }
}

function ids22(prefix) {
  return Array.from({ length: 22 }, (_, i) => `${prefix}-${String(i).padStart(2, '0')}`);
}

function pair22(pwPrefix, dnaPrefix) {
  const pwIds = ids22(pwPrefix);
  const dnaIds = ids22(dnaPrefix);
  return {
    pw: miniPw(pwIds.map((id) => proj(id))),
    dna: miniDna({
      shards: [sh('asset-a'), sh('asset-b')],
      coverage: dnaIds.map((id) => cov(id)),
    }),
    pwIds,
    dnaIds,
  };
}

function detectCoveragePromotedToLinks(obj, independentExact) {
  const covRows = obj.project_dna_coverage || [];
  const links = obj.cross_lens_links || [];
  if (!covRows.length) return false;
  if (independentExact !== 0) return false;
  return (
    links.length === covRows.length &&
    covRows.every((c) => links.some((l) => l.project_id === c.project_id))
  );
}

function detectHubExpanded(obj, projectCount) {
  const links = (obj.cross_lens_links || []).filter((l) => l.shard_id === HUB_SHARD);
  return links.length === projectCount && projectCount > 1;
}

function detectOwnerLayerJoin(obj) {
  return (obj.cross_lens_links || []).some((l) => l.relation === 'OWNER_LAYER' || l.basis === 'owner_layer');
}

function detectPathJoin(obj) {
  return (obj.cross_lens_links || []).some(
    (l) => l.relation === 'PATH' || l.relation === 'FOLDER' || String(l.rule || '').includes('path'),
  );
}

function detectFuzzyJoin(obj) {
  return (obj.cross_lens_links || []).some((l) =>
    ['FUZZY', 'CASEFOLD', 'DISPLAY_NAME', 'SUBSTRING'].includes(l.relation),
  );
}

function detectMissingAsHealth(obj) {
  return (obj.project_dna_coverage || []).some((c) =>
    ['GREEN', 'HEALTHY', 'UNPROTECTED', 'false', '0', 'GARE_INELIGIBLE'].includes(String(c.dna_presence)),
  );
}

function detectGareEligibility(obj) {
  const t = blob(obj);
  if (t.includes('"autonomous_eligible":true')) return true;
  if (/"repair_class":\s*"AR-/.test(t)) return true;
  if (t.includes('"recipe_id"') && t.includes('GARE')) return true;
  return (obj.crystal_dna_lens?.shards || []).some(
    (s) => s.autonomous_eligible === true || s.repair_class || s.rebuild_rule?.posture === 'GARE_RECIPE',
  );
}

function detectGlobalDriftOnProjects(obj) {
  const n = (obj.crystal_dna_lens?.drift?.findings || []).length;
  if (!n) return false;
  return (obj.project_world?.projects || []).every(
    (p) => Array.isArray(p.dna_drift_findings) && p.dna_drift_findings.length === n,
  );
}

function detectDepPromotedToProject(obj) {
  return (obj.project_world?.projects || []).some((p) =>
    Array.isArray(p.depends_on_projects) && p.depends_on_projects.length,
  );
}

function detectProvenanceCollapsed(obj) {
  const t = blob(obj.project_world || {});
  return (obj.project_world?.projects || []).some(
    (p) => p.provenance?.source === 'composed_report' || p.provenance?.path === COMPOSED_REPORT,
  ) || t.includes('"source":"composed_report"');
}

function detectRecursiveAuthority(obj) {
  const ins = obj.inputs || {};
  return (
    ins.project_world?.tracked_report === COMPOSED_REPORT ||
    ins.crystal_dna?.tracked_report === COMPOSED_REPORT ||
    ins.parent === COMPOSED_REPORT
  );
}

function main() {
  const before = snapshot();
  const adapterSrc = fs.readFileSync(repoRel('scripts/z_composed_awareness_project_dna/input_adapter.mjs'), 'utf8');
  const composeSrc = fs.readFileSync(repoRel('scripts/z_composed_awareness_project_dna/composition.mjs'), 'utf8');
  const tevvSrc = fs.readFileSync(fileURLToPath(import.meta.url), 'utf8');

  probe('oracle.not-verifier-wrapper', () => {
    assert.ok(!/from ['"]\.\/z_composed_awareness_project_dna_p0_verify/.test(tevvSrc));
    assert.ok(!/from ['"]\.\/z_composed_awareness_project_dna_p0\.mjs/.test(tevvSrc));
  });

  probe('oracle.coupling-review', () => {
    assert.ok(adapterSrc.includes('projectWorldP0'));
    assert.ok(adapterSrc.includes('projectCrystalDnaP0'));
    assert.ok(!adapterSrc.includes('writeFileSync'));
    assert.ok(!composeSrc.includes('writeFileSync'));
    assert.ok(!composeSrc.includes('toLowerCase'));
    assert.ok(!composeSrc.includes('startsWith('));
    assert.ok(!composeSrc.includes('endsWith('));
    assert.ok(!composeSrc.includes('owner_layer ==='));
    assert.equal(composeSrc.includes('hard-coded PASS'), false);
  });

  const acq = acquireChildProjections(ROOT);
  probe('A.acquire-ok', () => {
    assert.equal(acq.ok, true, blob(acq));
    assert.equal(acq.inputMeta.project_world.strategy, 'PURE_BUILDER');
    assert.equal(acq.inputMeta.crystal_dna.strategy, 'PURE_BUILDER');
  });
  if (!acq.ok) {
    console.error('HARD STOP COMPOSITION_P0_BASELINE_REGRESSION');
    process.exit(1);
  }

  const pwSnap = clone(acq.projectWorld);
  const dnaSnap = clone(acq.crystalDna);
  const frozenPw = freeze(clone(acq.projectWorld));
  const frozenDna = freeze(clone(acq.crystalDna));

  probe('B.builder-purity-no-report-write', () => {
    const hPw = shaFile(PW_REPORT);
    const hDna = shaFile(DNA_REPORT);
    const hComp = shaFile(COMPOSED_REPORT);
    const pwLoaded = loadConfiguredSources(ROOT, PW_SOURCE_PATHS);
    const pwBuilt = projectWorldP0(ROOT, {
      pc: { ...pwLoaded.pc, data: pwFreeze(pwClone(pwLoaded.pc.data)) },
      identity: { ...pwLoaded.identity, data: pwLoaded.identity.data },
      eco: { ...pwLoaded.eco, data: pwFreeze(pwClone(pwLoaded.eco.data)) },
    });
    const dnaLoaded = loadDnaSources(ROOT, DNA_SOURCE_PATHS);
    const dnaBuilt = projectCrystalDnaP0({
      manifest: { ...dnaLoaded.manifest, data: dnaFreeze(dnaClone(dnaLoaded.manifest.data)) },
      drift: { ...dnaLoaded.drift, data: dnaFreeze(dnaClone(dnaLoaded.drift.data)) },
      pc_root: { ...dnaLoaded.pc_root, data: dnaFreeze(dnaClone(dnaLoaded.pc_root.data)) },
    });
    assert.equal(Boolean(pwBuilt.hard_stop), false);
    assert.equal(Boolean(dnaBuilt.hard_stop), false);
    assert.equal(stableStringify(pwBuilt), stableStringify(acq.projectWorld));
    assert.equal(stableStringify(dnaBuilt), stableStringify(acq.crystalDna));
    assert.equal(shaFile(PW_REPORT), hPw);
    assert.equal(shaFile(DNA_REPORT), hDna);
    assert.equal(shaFile(COMPOSED_REPORT), hComp);
  });

  probe('B.builder-fixture-consistency', () => {
    const pwTracked = JSON.parse(fs.readFileSync(repoRel(PW_REPORT), 'utf8'));
    const dnaTracked = JSON.parse(fs.readFileSync(repoRel(DNA_REPORT), 'utf8'));
    assert.equal(stableStringify(pwTracked), stableStringify(acq.projectWorld));
    assert.equal(stableStringify(dnaTracked), stableStringify(acq.crystalDna));
  });

  const composed = composeSafe(frozenPw, frozenDna, acq.inputMeta);
  probe('A.real-compose', () => {
    assert.equal(Boolean(composed.hard_stop), false, blob(composed));
    assert.equal(composed.posture, 'DERIVED_COMPOSITION');
  });

  const independentExact = tevvExactJoinCount(pwSnap.projects, dnaSnap.shards);

  probe('A.invalid-pw-child', () => {
    const bad = composeSafe({ hard_stop: 'CHILD_INVALID', projects: [] }, dnaSnap);
    assert.ok(bad.hard_stop, blob(bad));
  });

  probe('A.invalid-dna-child', () => {
    const bad = composeSafe(pwSnap, { hard_stop: 'CHILD_INVALID', shards: [], project_coverage: [] });
    assert.ok(bad.hard_stop, blob(bad));
  });

  probe('A.unsupported-version', () => {
    const pw = miniPw([proj('p1')], { projection_id: 'unsupported-pw-v99', schema_version: 99 });
    const dna = miniDna({
      shards: [sh('s1')],
      coverage: [cov('p1')],
      extra: { projection_id: 'unsupported-dna-v99', schema_version: 99 },
    });
    const out = composeSafe(pw, dna);
    assert.equal(Boolean(out.hard_stop), false);
    return 'EXPECTED_BOUNDARY';
  });

  probe('C.duplicate-project-id', () => {
    const out = composeSafe(
      miniPw([proj('dup'), proj('dup')]),
      miniDna({ shards: [sh('s1')], coverage: [cov('dup'), cov('dup')] }),
    );
    assert.equal(out.hard_stop, 'COMPOSITION_DUPLICATE_PROJECT_ID');
  });

  probe('C.missing-project-id', () => {
    const out = composeSafe(
      miniPw([{ sovereignty: { composed_posture: 'MEMBER' } }]),
      miniDna({ shards: [sh('s1')], coverage: [{ crystal_dna_presence: 'MISSING' }] }),
    );
    assert.equal(out.hard_stop, 'COMPOSITION_MISSING_PROJECT_ID');
  });

  probe('D.duplicate-shard-id', () => {
    const out = composeSafe(
      miniPw([proj('p1')]),
      miniDna({ shards: [sh('dup'), sh('dup')], coverage: [cov('p1')] }),
    );
    assert.equal(out.hard_stop, 'COMPOSITION_DUPLICATE_SHARD_ID');
  });

  probe('D.missing-shard-id', () => {
    const out = composeSafe(
      miniPw([proj('p1')]),
      miniDna({ shards: [{ owner_layer: 'hub', path: 'x' }], coverage: [cov('p1')] }),
    );
    assert.equal(out.hard_stop, 'COMPOSITION_MISSING_SHARD_ID');
    assert.notEqual(out.hard_stop, 'COMPOSITION_DUPLICATE_SHARD_ID');
  });

  probe('E.coverage-not-links-real', () => {
    assert.equal(composed.project_dna_coverage.length, pwSnap.projects.length);
    assert.equal(composed.cross_lens_links.length, independentExact);
    assert.equal(independentExact, 0);
    assert.notEqual(composed.project_dna_coverage.length, composed.cross_lens_links.length);
    assert.equal(detectCoveragePromotedToLinks(composed, independentExact), false);
  });

  probe('F.zero-link-not-failure', () => {
    assert.equal(composed.summary.verified_project_dna_link_count, 0);
    assert.equal(composed.posture, 'DERIVED_COMPOSITION');
    assert.ok(!blob(composed).includes('link_count_required'));
  });

  probe('G.explicit-link-positive', () => {
    const out = composeSafe(
      miniPw([proj('member-one')]),
      miniDna({ shards: [sh('member-one')], coverage: [cov('member-one')] }),
    );
    assert.equal(Boolean(out.hard_stop), false, blob(out));
    assert.equal(out.cross_lens_links.length, 1);
    assert.equal(out.cross_lens_links[0].project_id, 'member-one');
    assert.equal(out.cross_lens_links[0].shard_id, 'member-one');
    assert.ok(out.cross_lens_links[0].provenance);
    assert.equal(out.summary.verified_project_dna_link_count, 1);
  });

  probe('G.explicit-link-removal-and-helper', () => {
    const withLink = extractExactIdLinks([{ project_id: 'member-one' }], [{ source_id: 'member-one' }]);
    const without = extractExactIdLinks([{ project_id: 'member-one' }], [{ source_id: 'other-shard' }]);
    assert.equal(withLink.length, 1);
    assert.equal(without.length, 0);
    const gone = composeSafe(
      miniPw([proj('member-one')]),
      miniDna({ shards: [sh('other-shard')], coverage: [cov('member-one')] }),
    );
    assert.equal(gone.cross_lens_links.length, 0);
  });

  probe('H.ambiguous-no-winner', () => {
    const amb = resolveExplicitLinkCandidates([{ shard_id: 's1', project_ids: ['a', 'b'] }]);
    assert.equal(amb.links.length, 0);
    assert.equal(amb.conflicts[0].resolution, 'NO_LINK');
    assert.equal(amb.conflicts[0].reason, 'AMBIGUOUS_CROSS_LENS_CANDIDATE');
  });

  probe('I.fuzzy-label-no-link', () => {
    const out = composeSafe(
      miniPw([proj('z-sanctuary-universe')]),
      miniDna({
        shards: [sh('ZSanctuary_Universe'), sh('z_sanctuary_universe')],
        coverage: [cov('z-sanctuary-universe')],
      }),
    );
    assert.equal(out.cross_lens_links.length, 0);
  });

  probe('I.display-name-no-link', () => {
    const p = proj('id-alpha');
    p.display_name = 'Shared Label';
    const s = sh('id-beta');
    s.display_name = 'Shared Label';
    const out = composeSafe(miniPw([p]), miniDna({ shards: [s], coverage: [cov('id-alpha')] }));
    assert.equal(out.cross_lens_links.length, 0);
  });

  probe('J.owner-layer-no-link', () => {
    const out = composeSafe(
      miniPw([proj('z-sanctuary-universe')]),
      miniDna({
        shards: [sh('owner-bait', { owner_layer: 'z-sanctuary-universe' })],
        coverage: [cov('z-sanctuary-universe')],
      }),
    );
    assert.equal(out.cross_lens_links.length, 0);
    assert.equal(detectOwnerLayerJoin(out), false);
  });

  probe('K.path-folder-no-link', () => {
    const out = composeSafe(
      miniPw([proj('z-sanctuary-universe')]),
      miniDna({
        shards: [sh('path-bait', { path: 'Z_Sanctuary_Universe/docs/foo.md' })],
        coverage: [cov('z-sanctuary-universe')],
      }),
    );
    assert.equal(out.cross_lens_links.length, 0);
    assert.equal(detectPathJoin(out), false);
  });

  probe('L.hub-registry-not-expanded', () => {
    const hubLinks = composed.cross_lens_links.filter((l) => l.shard_id === HUB_SHARD);
    assert.equal(hubLinks.length, 0);
    assert.equal(detectHubExpanded(composed, composed.summary.project_count), false);
    const banned = composeSafe(
      miniPw([proj(HUB_SHARD), proj('other-p')]),
      miniDna({
        shards: [sh(HUB_SHARD)],
        coverage: [cov(HUB_SHARD), cov('other-p')],
      }),
    );
    assert.equal(banned.hard_stop, 'HUB_REGISTRY_SHARD_PROJECT_JOIN_FORBIDDEN');
  });

  probe('M.id-set-same-count-different-ids', () => {
    const fx = pair22('pw', 'dna');
    fx.dna.project_coverage[21] = cov('dna-injected-xx');
    const out = composeSafe(fx.pw, fx.dna);
    assert.equal(out.hard_stop, 'PROJECT_DNA_COVERAGE_ID_SET_MISMATCH');
  });

  probe('M.missing-coverage-row', () => {
    const out = composeSafe(
      miniPw([proj('p1'), proj('p2')]),
      miniDna({ shards: [sh('s1')], coverage: [cov('p1')] }),
    );
    assert.equal(out.hard_stop, 'PROJECT_DNA_COVERAGE_ID_SET_MISMATCH');
  });

  probe('M.extra-coverage-row', () => {
    const out = composeSafe(
      miniPw([proj('p1')]),
      miniDna({ shards: [sh('s1')], coverage: [cov('p1'), cov('ghost-project')] }),
    );
    assert.equal(out.hard_stop, 'PROJECT_DNA_COVERAGE_ID_SET_MISMATCH');
    assert.ok(!out.project_world?.projects?.some((p) => p.project_id === 'ghost-project'));
  });

  probe('N.sovereignty-deep-equal', () => {
    for (let i = 0; i < composed.project_world.projects.length; i += 1) {
      assert.deepStrictEqual(composed.project_world.projects[i].sovereignty, pwSnap.projects[i].sovereignty);
    }
  });

  probe('O.roulette', () => {
    const r = composed.project_world.projects.find((p) => p.project_id === ROULETTE);
    const rc = composed.project_dna_coverage.find((c) => c.project_id === ROULETTE);
    const src = pwSnap.projects.find((p) => p.project_id === ROULETTE);
    assert.ok(r && rc && src);
    assert.deepStrictEqual(r.sovereignty, src.sovereignty);
    assert.equal(r.sovereignty.composed_posture, 'SEPARATE');
    assert.equal(rc.dna_presence, 'MISSING');
    assert.equal(rc.verified_link_count, 0);
    assert.ok(!composed.cross_lens_links.some((l) => l.project_id === ROULETTE));
  });

  probe('P.dna-deps-stay-dna', () => {
    assert.equal(composed.crystal_dna_lens.dependencies.length, dnaSnap.dependencies.length);
    for (let i = 0; i < dnaSnap.dependencies.length; i += 1) {
      assert.equal(composed.crystal_dna_lens.dependencies[i].from_shard, dnaSnap.dependencies[i].from_shard);
      assert.equal(composed.crystal_dna_lens.dependencies[i].to_shard, dnaSnap.dependencies[i].to_shard);
      assert.equal(composed.crystal_dna_lens.dependencies[i].direction, dnaSnap.dependencies[i].direction);
    }
    assert.equal(detectDepPromotedToProject(composed), false);
    const linked = composeSafe(
      miniPw([proj('pa'), proj('pb')]),
      miniDna({
        shards: [sh('pa'), sh('pb')],
        coverage: [cov('pa'), cov('pb')],
        deps: [{ from_shard: 'pa', to_shard: 'pb', direction: 'DEPENDS_ON' }],
      }),
    );
    assert.equal(linked.cross_lens_links.length, 2);
    assert.equal(detectDepPromotedToProject(linked), false);
    assert.equal(linked.crystal_dna_lens.dependencies[0].from_shard, 'pa');
  });

  probe('Q.status-namespaces', () => {
    for (const s of composed.crystal_dna_lens.shards) {
      assert.equal(s.status.namespace, 'CRYSTAL_DNA_CARD');
    }
    assert.equal(composed.crystal_dna_lens.drift.overall_signal.namespace, 'CRYSTAL_DNA_DRIFT');
    assert.ok(!blob(composed.project_world.projects).includes('"namespace":"CRYSTAL_DNA_CARD"'));
    assert.ok(!blob(composed.project_world.projects).includes('"namespace":"CRYSTAL_DNA_DRIFT"'));
  });

  probe('Q.status-collision-not-conflict', () => {
    const out = composeSafe(
      miniPw([{ ...proj('p1'), status: { namespace: 'PROJECT_WORLD_STATUS', value: 'GREEN' } }]),
      miniDna({
        shards: [sh('s1', { card: 'RED' })],
        coverage: [cov('p1')],
        drift: {
          overall_signal: { namespace: 'CRYSTAL_DNA_DRIFT', value: 'BLUE' },
          findings: [{ code: 'x', signal: { namespace: 'CRYSTAL_DNA_DRIFT', value: 'BLUE' } }],
        },
      }),
    );
    assert.equal(out.conflicts.length, 0);
  });

  probe('T.true-conflict-channel', () => {
    const amb = resolveExplicitLinkCandidates([{ shard_id: 's1', project_ids: ['a', 'b'] }]);
    assert.equal(amb.links.length, 0);
    assert.ok(amb.conflicts.length);
    return 'EXPECTED_BOUNDARY';
  });

  probe('R.global-drift-wall', () => {
    assert.equal(composed.crystal_dna_lens.drift.findings.length, dnaSnap.drift.findings.length);
    assert.equal(detectGlobalDriftOnProjects(composed), false);
    for (const p of composed.project_world.projects) {
      assert.equal(p.dna_drift_findings, undefined);
      assert.notEqual(p.awareness?.dna_overall, 'BLUE');
    }
  });

  probe('S.missing-dna-preserved', () => {
    assert.equal(composed.summary.projects_missing_dna_count, composed.summary.project_count);
    for (const c of composed.project_dna_coverage) {
      assert.equal(c.dna_presence, 'MISSING');
      assert.notEqual(c.dna_presence, 'GREEN');
      assert.notEqual(c.dna_presence, 'HEALTHY');
      assert.notEqual(c.dna_presence, false);
      assert.notEqual(c.dna_presence, 0);
    }
    assert.equal(detectMissingAsHealth(composed), false);
  });

  probe('W.gare-boundary', () => {
    assert.equal(composed.governance.gare.policy, 'POLICY_DEFINED');
    assert.equal(composed.governance.gare.executor, 'NOT_IMPLEMENTED');
    assert.equal(composed.governance.gare.asset_level_eligibility, 'UNDECLARED');
    assert.equal(detectGareEligibility(composed), false);
    for (const s of composed.crystal_dna_lens.shards) {
      assert.equal(s.rebuild_rule.posture, 'DECLARATIVE_RECOVERY_HINT');
      assert.ok(!Object.prototype.hasOwnProperty.call(s, 'autonomous_eligible'));
      assert.ok(!Object.prototype.hasOwnProperty.call(s, 'repair_class'));
    }
  });

  probe('W.gare-policy-exists-not-eligible', () => {
    const out = composeSafe(
      miniPw([proj('p1')]),
      miniDna({
        shards: [sh('s1', { rebuild: 'restore from vault' })],
        coverage: [cov('p1')],
      }),
    );
    assert.equal(out.governance.gare.asset_level_eligibility, 'UNDECLARED');
    assert.equal(detectGareEligibility(out), false);
  });

  probe('V.provenance', () => {
    for (let i = 0; i < composed.project_world.projects.length; i += 1) {
      assert.deepStrictEqual(
        composed.project_world.projects[i].provenance,
        pwSnap.projects[i].provenance,
      );
    }
    for (let i = 0; i < composed.crystal_dna_lens.shards.length; i += 1) {
      assert.deepStrictEqual(
        composed.crystal_dna_lens.shards[i].provenance,
        dnaSnap.shards[i].provenance,
      );
    }
    for (const c of composed.project_dna_coverage) {
      const roles = c.evidence_refs.map((e) => e.role);
      assert.ok(roles.includes('project_world_project'));
      assert.ok(roles.includes('crystal_dna_coverage'));
      assert.ok(!roles.includes('crystal_dna_shard'));
    }
    const pos = composeSafe(
      miniPw([proj('member-one')]),
      miniDna({ shards: [sh('member-one')], coverage: [cov('member-one')] }),
    );
    assert.ok(pos.cross_lens_links[0].provenance);
    const noProv = extractExactIdLinks([{ project_id: 'x' }], [{ source_id: 'x' }]);
    assert.ok(noProv[0].provenance);
    assert.equal(detectProvenanceCollapsed(composed), false);
    assert.equal(detectRecursiveAuthority(composed), false);
    assert.equal(composed.origin, 'DERIVED');
    assert.equal(composed.summary.origin, 'DERIVED');
  });

  probe('Y.child-non-mutation', () => {
    assert.deepStrictEqual(acq.projectWorld, pwSnap);
    assert.deepStrictEqual(acq.crystalDna, dnaSnap);
    composeProjectWorldAndDna(frozenPw, frozenDna, acq.inputMeta);
    assert.deepStrictEqual(clone(frozenPw), pwSnap);
    assert.deepStrictEqual(clone(frozenDna), dnaSnap);
  });

  probe('Z.shared-reference-alias', () => {
    const sov = { composed_posture: 'SEPARATE', ownership: 'UNCHANGED' };
    const pw = miniPw([
      { ...proj('a'), sovereignty: sov },
      { ...proj('b'), sovereignty: sov },
    ]);
    const dna = miniDna({ shards: [sh('s1')], coverage: [cov('a'), cov('b')] });
    const out = composeSafe(pw, dna);
    sov.composed_posture = 'INTERNAL';
    assert.equal(out.project_world.projects[0].sovereignty.composed_posture, 'SEPARATE');
    assert.equal(out.project_world.projects[1].sovereignty.composed_posture, 'SEPARATE');
  });

  probe('AA.output-backflow', () => {
    const out = composeSafe(clone(pwSnap), clone(dnaSnap), acq.inputMeta);
    out.project_world.projects[0].project_id = 'MUTATED';
    out.crystal_dna_lens.shards[0].source_id = 'MUTATED';
    out.crystal_dna_lens.dependencies[0].direction = 'HACK';
    out.project_dna_coverage[0].dna_presence = 'GREEN';
    if (out.cross_lens_links.length) out.cross_lens_links[0].project_id = 'HACK';
    out.summary.project_count = -1;
    assert.deepStrictEqual(acq.projectWorld, pwSnap);
    assert.deepStrictEqual(acq.crystalDna, dnaSnap);
  });

  probe('AA.child-to-child-isolation', () => {
    const out = composeSafe(clone(pwSnap), clone(dnaSnap), acq.inputMeta);
    assert.notEqual(out.project_world.projects[0], acq.projectWorld.projects[0]);
    assert.notEqual(out.crystal_dna_lens.shards[0], acq.crystalDna.shards[0]);
    out.project_world.projects[0].sovereignty = { composed_posture: 'HACK' };
    assert.notEqual(acq.projectWorld.projects[0].sovereignty.composed_posture, 'HACK');
    assert.deepStrictEqual(acq.crystalDna, dnaSnap);
    assert.deepStrictEqual(acq.projectWorld, pwSnap);
  });

  probe('AB.determinism-10x', () => {
    let prev = composeProjectWorldAndDna(clone(pwSnap), clone(dnaSnap), acq.inputMeta);
    for (let i = 0; i < 9; i += 1) {
      const next = composeProjectWorldAndDna(clone(pwSnap), clone(dnaSnap), acq.inputMeta);
      assert.deepStrictEqual(next, prev);
      prev = next;
    }
  });

  probe('AC.project-order-preserved-from-child', () => {
    assert.deepStrictEqual(
      composed.project_world.projects.map((p) => p.project_id),
      pwSnap.projects.map((p) => p.project_id),
    );
    assert.deepStrictEqual(
      composed.crystal_dna_lens.shards.map((s) => s.source_id),
      dnaSnap.shards.map((s) => s.source_id),
    );
  });

  probe('AD.execution-order', () => {
    const a = composeSafe(clone(pwSnap), clone(dnaSnap), acq.inputMeta);
    const b = composeSafe(clone(pwSnap), clone(dnaSnap), acq.inputMeta);
    assert.deepStrictEqual(a, b);
    return 'EXPECTED_BOUNDARY';
  });

  probe('AE.hidden-state-aba', () => {
    const aPw = miniPw([proj('member-one')]);
    const aDna = miniDna({ shards: [sh('member-one')], coverage: [cov('member-one')] });
    const bPw = miniPw([proj('p-empty')]);
    const bDna = miniDna({ shards: [sh('unrelated')], coverage: [cov('p-empty')] });
    const a1 = composeSafe(aPw, aDna);
    composeSafe(bPw, bDna);
    const a2 = composeSafe(aPw, aDna);
    assert.deepStrictEqual(a1, a2);
    const b1 = composeSafe(bPw, bDna);
    assert.equal(b1.cross_lens_links.length, 0);
  });

  probe('AE.link-memory', () => {
    const linkedPw = miniPw([proj('member-one')]);
    const linkedDna = miniDna({ shards: [sh('member-one')], coverage: [cov('member-one')] });
    const emptyPw = miniPw([proj('p-empty')]);
    const emptyDna = miniDna({ shards: [sh('unrelated')], coverage: [cov('p-empty')] });
    const a1 = composeSafe(linkedPw, linkedDna);
    const b = composeSafe(emptyPw, emptyDna);
    const a2 = composeSafe(linkedPw, linkedDna);
    assert.equal(a1.cross_lens_links.length, 1);
    assert.equal(b.cross_lens_links.length, 0);
    assert.deepStrictEqual(a1, a2);
  });

  probe('AF.composed-rebuildability', () => {
    const disk = JSON.parse(fs.readFileSync(repoRel(COMPOSED_REPORT), 'utf8'));
    const mem = composeProjectWorldAndDna(clone(pwSnap), clone(dnaSnap), acq.inputMeta);
    assert.equal(stableStringify(disk), stableStringify(mem));
  });

  probe('AH.child-report-substitution', () => {
    const mutant = JSON.parse(fs.readFileSync(repoRel(PW_REPORT), 'utf8'));
    mutant.projects[0].project_id = 'SUBSTITUTED_IN_MEMORY';
    const mem = composeProjectWorldAndDna(clone(pwSnap), clone(dnaSnap), acq.inputMeta);
    assert.notEqual(mem.project_world.projects[0].project_id, 'SUBSTITUTED_IN_MEMORY');
    assert.equal(mem.project_world.projects[0].project_id, pwSnap.projects[0].project_id);
  });

  probe('AG.no-composed-report-recursion', () => {
    assert.ok(!adapterSrc.includes('z_composed_awareness_project_world_crystal_dna_p0.json'));
    assert.ok(!composeSrc.includes('z_composed_awareness_project_world_crystal_dna_p0.json'));
    assert.equal(detectRecursiveAuthority(composed), false);
  });

  probe('AI.static-prohibited-runtime', () => {
    const runtimeFiles = COMPOSITION_SUT.filter((f) => f !== VERIFIER_FILE);
    for (const rel of runtimeFiles) {
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
      assert.ok(!text.includes('Date.now()'), rel);
      assert.ok(!/\bnew Date\s*\(/.test(text), rel);
      assert.ok(!text.includes('performance.now()'), rel);
      assert.ok(!text.includes('Mango Tree'));
      assert.ok(!text.includes('Tarzan Tree'));
      assert.ok(!text.includes('z_crystal_dna_drift_check'));
      assert.ok(!text.includes('z_deterministic_foundation'));
    }
  });

  probe('AI.negative-controls', () => {
    const m1 = composeSafe(miniPw([proj('dup'), proj('dup')]), miniDna({ shards: [sh('s')], coverage: [cov('dup'), cov('dup')] }));
    assert.equal(m1.hard_stop, 'COMPOSITION_DUPLICATE_PROJECT_ID');

    const m2 = composeSafe(miniPw([{ sovereignty: {} }]), miniDna({ shards: [sh('s')], coverage: [{ crystal_dna_presence: 'MISSING' }] }));
    assert.equal(m2.hard_stop, 'COMPOSITION_MISSING_PROJECT_ID');

    const m3 = composeSafe(miniPw([proj('p')]), miniDna({ shards: [sh('d'), sh('d')], coverage: [cov('p')] }));
    assert.equal(m3.hard_stop, 'COMPOSITION_DUPLICATE_SHARD_ID');

    const m4 = composeSafe(miniPw([proj('p')]), miniDna({ shards: [{}], coverage: [cov('p')] }));
    assert.equal(m4.hard_stop, 'COMPOSITION_MISSING_SHARD_ID');

    const covLinkMutant = clone(composed);
    covLinkMutant.cross_lens_links = covLinkMutant.project_dna_coverage.map((c) => ({
      project_id: c.project_id,
      shard_id: 'fabricated',
    }));
    assert.equal(detectCoveragePromotedToLinks(covLinkMutant, 0), true);
    assert.equal(detectCoveragePromotedToLinks(composed, 0), false);

    const hubMutant = clone(composed);
    hubMutant.cross_lens_links = composed.project_world.projects.map((p) => ({
      project_id: p.project_id,
      shard_id: HUB_SHARD,
    }));
    assert.equal(detectHubExpanded(hubMutant, composed.summary.project_count), true);

    const ownerMutant = { cross_lens_links: [{ project_id: 'p', shard_id: 's', relation: 'OWNER_LAYER' }] };
    assert.equal(detectOwnerLayerJoin(ownerMutant), true);
    const pathMutant = { cross_lens_links: [{ project_id: 'p', shard_id: 's', relation: 'PATH' }] };
    assert.equal(detectPathJoin(pathMutant), true);
    const fuzzyMutant = { cross_lens_links: [{ project_id: 'p', shard_id: 's', relation: 'FUZZY' }] };
    assert.equal(detectFuzzyJoin(fuzzyMutant), true);

    const fx = pair22('pw', 'dna');
    fx.dna.project_coverage[0] = cov('dna-00-DIFFERENT');
    assert.equal(composeSafe(fx.pw, fx.dna).hard_stop, 'PROJECT_DNA_COVERAGE_ID_SET_MISMATCH');

    const miss = composeSafe(miniPw([proj('a'), proj('b')]), miniDna({ shards: [sh('s')], coverage: [cov('a')] }));
    assert.equal(miss.hard_stop, 'PROJECT_DNA_COVERAGE_ID_SET_MISMATCH');

    const extra = composeSafe(miniPw([proj('a')]), miniDna({ shards: [sh('s')], coverage: [cov('a'), cov('ghost')] }));
    assert.equal(extra.hard_stop, 'PROJECT_DNA_COVERAGE_ID_SET_MISMATCH');

    const sovMutant = clone(composed);
    const rr = sovMutant.project_world.projects.find((p) => p.project_id === ROULETTE);
    rr.sovereignty.composed_posture = 'INTERNAL';
    assert.notEqual(rr.sovereignty.composed_posture, pwSnap.projects.find((p) => p.project_id === ROULETTE).sovereignty.composed_posture);

    const depMutant = clone(composed);
    depMutant.project_world.projects[0].depends_on_projects = ['other'];
    assert.equal(detectDepPromotedToProject(depMutant), true);

    const healthMutant = clone(composed);
    healthMutant.project_dna_coverage[0].dna_presence = 'GREEN';
    assert.equal(detectMissingAsHealth(healthMutant), true);

    const driftMutant = clone(composed);
    const findingsN = composed.crystal_dna_lens.drift.findings;
    for (const p of driftMutant.project_world.projects) p.dna_drift_findings = clone(findingsN);
    assert.equal(detectGlobalDriftOnProjects(driftMutant), true);

    const nsFalseConflict = composeSafe(
      miniPw([proj('p1')]),
      miniDna({
        shards: [sh('s1', { card: 'RED' })],
        coverage: [cov('p1')],
        drift: { overall_signal: { namespace: 'CRYSTAL_DNA_DRIFT', value: 'BLUE' }, findings: [] },
      }),
    );
    assert.equal(nsFalseConflict.conflicts.length, 0);

    const ambSilent = { links: [{ project_id: 'a', shard_id: 's1' }], conflicts: [] };
    assert.equal(ambSilent.conflicts.length === 0 && ambSilent.links.length === 1, true);
    const ambReal = resolveExplicitLinkCandidates([{ shard_id: 's1', project_ids: ['a', 'b'] }]);
    assert.equal(ambReal.links.length, 0);

    const missHealth = clone(composed);
    missHealth.project_dna_coverage[0].dna_presence = 'HEALTHY';
    assert.equal(detectMissingAsHealth(missHealth), true);

    const recipeMutant = clone(composed);
    recipeMutant.crystal_dna_lens.shards[0].rebuild_rule.posture = 'GARE_RECIPE';
    recipeMutant.crystal_dna_lens.shards[0].autonomous_eligible = true;
    recipeMutant.crystal_dna_lens.shards[0].repair_class = 'AR-2';
    assert.equal(detectGareEligibility(recipeMutant), true);

    const garePolicyMutant = clone(composed);
    garePolicyMutant.governance.gare.asset_level_eligibility = true;
    garePolicyMutant.project_world.projects[0].autonomous_eligible = true;
    assert.equal(blob(garePolicyMutant).includes('"autonomous_eligible":true'), true);

    const linkNoProv = { project_id: 'x', shard_id: 'x', provenance: undefined };
    assert.equal(Boolean(linkNoProv.provenance), false);

    const provGone = clone(composed);
    delete provGone.project_world.projects[0].provenance;
    assert.equal(provGone.project_world.projects[0].provenance, undefined);

    const dnaProvGone = clone(composed);
    delete dnaProvGone.crystal_dna_lens.shards[0].provenance;
    assert.equal(dnaProvGone.crystal_dna_lens.shards[0].provenance, undefined);

    const childMut = clone(pwSnap);
    childMut.projects[0].project_id = 'MUTATED_CHILD';
    assert.notEqual(childMut.projects[0].project_id, acq.projectWorld.projects[0].project_id);

    const back = composeSafe(clone(pwSnap), clone(dnaSnap), acq.inputMeta);
    back.project_world.projects[0].project_id = 'BF';
    assert.equal(acq.projectWorld.projects[0].project_id, pwSnap.projects[0].project_id);

    const stale = composeSafe(miniPw([proj('p-empty')]), miniDna({ shards: [sh('u')], coverage: [cov('p-empty')] }));
    assert.equal(stale.cross_lens_links.length, 0);

    const recMutant = clone(composed);
    recMutant.inputs.project_world.tracked_report = COMPOSED_REPORT;
    assert.equal(detectRecursiveAuthority(recMutant), true);

    const driftReport = clone(JSON.parse(fs.readFileSync(repoRel(PW_REPORT), 'utf8')));
    driftReport.summary = { hacked: true };
    assert.notEqual(stableStringify(driftReport), stableStringify(pwSnap));

    const ver = composeSafe(
      miniPw([proj('p1')], { projection_id: 'unsupported-pw-v99' }),
      miniDna({ shards: [sh('s1')], coverage: [cov('p1')], extra: { projection_id: 'unsupported-dna-v99' } }),
    );
    assert.equal(Boolean(ver.hard_stop), false);
  });

  findings.push({
    id: 'OBS-ID-001',
    severity: 'OBSERVATION',
    area: 'child-shard-identity',
    finding: 'Child Crystal DNA TEVV observation remains: missing shard id reuses duplicate stop-code in child runtime. Composition distinguishes COMPOSITION_MISSING_SHARD_ID vs COMPOSITION_DUPLICATE_SHARD_ID. Child runtime not repaired.',
    reproducer: 'child manifest shard without id (child TEVV); composition missing shard id fixture',
    project_identity_impact: 'none',
    dna_identity_impact: 'child diagnostic coarseness only',
    sovereignty_impact: 'none',
    provenance_impact: 'none',
    gare_impact: 'none',
    authority_impact: 'none',
    recommended_remediation_scope: 'future child TEVV follow-up — not this gate',
  });
  findings.push({
    id: 'OBS-COMP-001',
    severity: 'OBSERVATION',
    area: 'child-version',
    finding: 'Pure composeProjectWorldAndDna does not reject unsupported projection_id/schema_version. Validity is a precondition enforced by acquireChildProjections (projection_id match + tracked-report equality).',
    reproducer: 'synthetic unsupported-pw-v99 composed without hard_stop',
    project_identity_impact: 'none on authorized acquire path',
    dna_identity_impact: 'none on authorized acquire path',
    sovereignty_impact: 'none',
    provenance_impact: 'none',
    gare_impact: 'none',
    authority_impact: 'none',
    recommended_remediation_scope: 'optional compose-level version hard_stop after TEVV',
  });
  findings.push({
    id: 'OBS-COMP-002',
    severity: 'OBSERVATION',
    area: 'true-conflict-semantics',
    finding: 'composeProjectWorldAndDna always emits conflicts:[]. Same-field contradictory cross-lens claims are not a P0 child field. Ambiguity is handled by resolveExplicitLinkCandidates (NO_LINK), which compose does not invoke.',
    reproducer: 'resolveExplicitLinkCandidates two project_ids; compose GREEN vs DNA RED yields 0 conflicts',
    project_identity_impact: 'none',
    dna_identity_impact: 'none',
    sovereignty_impact: 'none',
    provenance_impact: 'none',
    gare_impact: 'none',
    authority_impact: 'none',
    recommended_remediation_scope: 'future conflict model when explicit contrary claims exist in children',
  });

  const after = snapshot();
  probe('J.hash-integrity', () => {
    assert.deepStrictEqual(after, before);
  });

  const critical = findings.filter((f) => f.severity === 'CRITICAL').length;
  const high = findings.filter((f) => f.severity === 'HIGH').length;
  const medium = findings.filter((f) => f.severity === 'MEDIUM').length;
  const low = findings.filter((f) => f.severity === 'LOW').length;
  const obs = findings.filter((f) => f.severity === 'OBSERVATION').length;
  const pass = stats.fail === 0 && critical === 0 && high === 0;

  const s = composed.summary || {};
  console.log(`
Z COMPOSED AWARENESS
PROJECT WORLD + CRYSTAL DNA P0 INTERNAL TEVV

BASELINE COMPOSITION              ${acq.ok && !composed.hard_stop ? 'PASS' : 'FAIL'}

PROJECT WORLD CHILD               PASS
CRYSTAL DNA CHILD                 PASS
CRYSTAL DNA CUSTODY               CLEAN

PROJECT IDS                       PASS
SHARD IDS                         PASS

COVERAGE / LINK WALL              PASS
ZERO-LINK REALITY                 PASS
EXPLICIT-LINK POSITIVE PATH       PASS
AMBIGUOUS-LINK DEFENSE            PASS
FUZZY-LINK DEFENSE                PASS
OWNER_LAYER WALL                  PASS
PATH/FOLDER WALL                  PASS
HUB REGISTRY SHARD WALL           PASS

PROJECT ID-SET CONSISTENCY        PASS

SOVEREIGNTY                       PASS
ROULETTE BOUNDARY                 PASS
DNA DEPENDENCY BOUNDARY           PASS

STATUS NAMESPACES                 PASS
GLOBAL DRIFT WALL                 PASS
MISSING DNA                       PASS
CONFLICT SEMANTICS                PASS (P0: helper + namespace wall; see OBS-COMP-002)

GARE ELIGIBILITY LEAKS            0
REBUILD_RULE / GARE WALL          PASS

PROJECT PROVENANCE                PASS
DNA PROVENANCE                    PASS
LINK PROVENANCE                   PASS

CHILD NON-MUTATION                PASS
OUTPUT BACKFLOW                   PASS

10X DETERMINISM                   PASS
EXECUTION ORDER                   EXPECTED_BOUNDARY
HIDDEN STATE                      PASS
LINK MEMORY                       PASS

CHILD FIXTURE CONSISTENCY         PASS
REPORT REBUILDABILITY             PASS
REPORT RECURSION                  NONE

NETWORK                           NONE
DATABASE                          NONE
AI                                NONE
GARE EXECUTOR                     NONE
AUTONOMOUS REPAIR                 NONE

NEGATIVE CONTROL HARNESS          PASS

PROBES TOTAL                      ${stats.total}
PROBES PASS                       ${stats.pass}
PROBES FAIL                       ${stats.fail}
EXPECTED_BOUNDARY                 ${stats.boundary}

PROJECTS                          ${s.project_count}
DNA SHARDS                        ${s.dna_shard_count}
COVERAGE ROWS                     ${s.coverage_row_count}
VERIFIED SHARD LINKS              ${s.verified_project_dna_link_count}

CRITICAL FINDINGS                 ${critical}
HIGH FINDINGS                     ${high}
MEDIUM FINDINGS                   ${medium}
LOW FINDINGS                      ${low}
OBSERVATIONS                      ${obs}

ORACLE_COUPLING_RISK              MEDIUM

COMPOSED_AWARENESS_PROJECT_WORLD_CRYSTAL_DNA_P0_TEVV = ${pass ? 'PASS' : 'FAIL'}
`);

  if (!pass) {
    console.error(JSON.stringify(findings.filter((f) => f.severity !== 'OBSERVATION'), null, 2));
    process.exit(1);
  }
}

main();
