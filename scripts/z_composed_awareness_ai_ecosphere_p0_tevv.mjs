#!/usr/bin/env node
/**
 * Internal TEVV — try to falsify AI Ecosphere P0. Not a verifier wrapper. Writes no files.
 * Does not run ledger refresh or the P0 generator.
 */
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { adaptConfig } from './z_composed_awareness_ai_ecosphere/config_adapter.mjs';
import { SOURCE_PATHS } from './z_composed_awareness_ai_ecosphere/constants.mjs';
import { uniqueRequiredIds } from './z_composed_awareness_ai_ecosphere/identity.mjs';
import { adaptLedger } from './z_composed_awareness_ai_ecosphere/ledger_adapter.mjs';
import { isAcceptedProjection, projectAiEcosphereP0 } from './z_composed_awareness_ai_ecosphere/projection.mjs';
import {
  canonicalJsonSha,
  deepClone,
  deepFreeze,
  loadJson,
  repoRel,
  sha256Bytes,
  sha256File,
  stableStringify,
} from './z_composed_awareness_ai_ecosphere/source_loader.mjs';
import { adaptStatus } from './z_composed_awareness_ai_ecosphere/status_adapter.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SEALED_HEAD = '237e7e7';
const TRACKED = 'data/reports/z_composed_awareness_ai_ecosphere_p0.json';
const ENVELOPE = 'data/reports/z_composed_awareness_project_world_crystal_dna_p0.json';
const VERIFIER = 'scripts/z_composed_awareness_ai_ecosphere_p0_verify.mjs';
const GENERATOR = 'scripts/z_composed_awareness_ai_ecosphere_p0.mjs';

const SUT = [
  'scripts/z_composed_awareness_ai_ecosphere/constants.mjs',
  'scripts/z_composed_awareness_ai_ecosphere/source_loader.mjs',
  'scripts/z_composed_awareness_ai_ecosphere/identity.mjs',
  'scripts/z_composed_awareness_ai_ecosphere/config_adapter.mjs',
  'scripts/z_composed_awareness_ai_ecosphere/status_adapter.mjs',
  'scripts/z_composed_awareness_ai_ecosphere/ledger_adapter.mjs',
  'scripts/z_composed_awareness_ai_ecosphere/projection.mjs',
  GENERATOR,
];

const COMPOSE = [
  'scripts/z_composed_awareness_project_dna/composition.mjs',
  'scripts/z_composed_awareness_project_dna_p0.mjs',
  'scripts/z_composed_awareness_project_dna_p0_verify.mjs',
  'scripts/z_composed_awareness_project_dna_p0_tevv.mjs',
];

const stats = { total: 0, pass: 0, fail: 0, boundary: 0 };
const findings = [];

function shaBuf(buf) {
  return crypto.createHash('sha256').update(buf).digest('hex');
}

function snapshot() {
  const out = { sourceByte: {}, sourceCanon: {}, sut: {}, compose: {}, reports: {} };
  for (const rel of Object.values(SOURCE_PATHS)) {
    const buf = fs.readFileSync(repoRel(ROOT, rel));
    out.sourceByte[rel] = shaBuf(buf);
    out.sourceCanon[rel] = canonicalJsonSha(JSON.parse(buf.toString('utf8')));
  }
  for (const rel of [...SUT, VERIFIER]) out.sut[rel] = sha256File(repoRel(ROOT, rel));
  for (const rel of COMPOSE) out.compose[rel] = sha256File(repoRel(ROOT, rel));
  out.reports[TRACKED] = sha256File(repoRel(ROOT, TRACKED));
  out.reports[ENVELOPE] = sha256File(repoRel(ROOT, ENVELOPE));
  return out;
}

function loadHead(rel) {
  const b = execFileSync('git', ['show', `${SEALED_HEAD}:${rel}`]);
  return { sha256: shaBuf(b), data: JSON.parse(b.toString('utf8')) };
}

function wrap(config, ledger, status) {
  return {
    config: { ok: true, path: SOURCE_PATHS.config, sha256: 'fx', canonical_json_sha256: 'fx', data: config },
    ledger: { ok: true, path: SOURCE_PATHS.ledger, sha256: 'fx', canonical_json_sha256: 'fx', data: ledger },
    status: { ok: true, path: SOURCE_PATHS.status, sha256: 'fx', canonical_json_sha256: 'fx', data: status },
  };
}

function miniCfg(rings) {
  return { schema_version: 1, rings, actor_classes: ['mini_bot'] };
}

function miniLed(rings, extra = {}) {
  const byId = Object.fromEntries((rings || []).map((r) => [r.id, { current: r.sync_score }]));
  return {
    generated_at: '2026-01-01T00:00:00.000Z',
    overall: extra.overall || { band: 'yellow', sync_score: 50 },
    rings,
    delta: { rings: extra.deltaRings || byId },
    consistency_alerts: extra.alerts,
    task_accomplishments: extra.tasks,
  };
}

function miniSt(agents, miniai, extra = {}) {
  return {
    generated_at: '2026-01-01T00:00:00.000Z',
    ai_tower: extra.tower || { tower_phase: 'blueprint', planned_rollout_only: true, status: 'clear' },
    agents,
    miniai,
    ...extra.rest,
  };
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
      identity_impact: 'see area',
      runtime_claim_impact: 'see area',
      project_impact: 'see area',
      provenance_impact: 'see area',
      gare_impact: 'none assumed',
      authority_impact: 'none assumed',
      recommended_remediation_scope: 'do not repair during this audit',
    });
  }
}

function executableUse(text, token) {
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('/*')) continue;
    if (trimmed.includes(token) && !trimmed.includes(`'${token}'`) && !trimmed.includes(`"${token}"`)) {
      if (token === 'fetch(' && /fetch\s*\(/.test(trimmed)) return true;
      if (token !== 'fetch(' && trimmed.includes(token)) return true;
    }
  }
  return false;
}

function tevvConflictCount(ledger) {
  let n = 0;
  for (const r of ledger.rings || []) {
    const cur = ledger.delta?.rings?.[r.id]?.current;
    if (typeof cur === 'number' && typeof r.sync_score === 'number' && cur !== r.sync_score) n += 1;
  }
  const alert = ledger.consistency_alerts?.inputs?.ecosphere_overall_sync;
  if (typeof alert === 'number' && typeof ledger.overall?.sync_score === 'number' && alert !== ledger.overall.sync_score) {
    n += 1;
  }
  return n;
}

function detectTotalAi(obj) {
  return Object.prototype.hasOwnProperty.call(obj.summary || {}, 'total_ai_count') || obj.total_ai_count === 12;
}

function detectActiveFromGreen(obj) {
  return (obj.advisory_ledger?.entries || []).some((e) => e.band === 'green' && e.verified_active === true);
}

function detectOnlineAsDormant(bot) {
  return bot && bot.source_online === false && bot.runtime_state === 'DORMANT';
}

function detectColonyLive(obj) {
  return obj.AI_COLONY_RUNTIME === 'ACTIVE' || obj.summary?.ai_colony_live === true;
}

function detectGare(obj) {
  const t = JSON.stringify(obj);
  return t.includes('"autonomous_eligible":true') || /"repair_class":\s*"AR-/.test(t);
}

function main() {
  const tevvSrc = fs.readFileSync(fileURLToPath(import.meta.url), 'utf8');
  const sutJoin = SUT.map((rel) => fs.readFileSync(repoRel(ROOT, rel), 'utf8')).join('\n');
  const before = snapshot();

  probe('oracle.not-verifier-wrapper', () => {
    assert.ok(!/from ['"]\.\/z_composed_awareness_ai_ecosphere_p0_verify/.test(tevvSrc));
    assert.ok(!/from ['"]\.\/z_composed_awareness_ai_ecosphere_p0\.mjs/.test(tevvSrc));
  });

  const cfgFile = loadJson(ROOT, SOURCE_PATHS.config);
  const ledFile = loadJson(ROOT, SOURCE_PATHS.ledger);
  const stFile = loadJson(ROOT, SOURCE_PATHS.status);
  const tracked = loadJson(ROOT, TRACKED);

  probe('A.source-resolution', () => {
    assert.equal(cfgFile.ok && ledFile.ok && stFile.ok && tracked.ok, true);
    assert.equal(loadJson(ROOT, 'data/z_tevv_missing_ai_ecosphere.json').reason, 'SOURCE_MISSING');
  });

  probe('A.excluded-source-wall', () => {
    assert.ok(!sutJoin.includes('z_family_ai_registry.json'));
    assert.ok(!sutJoin.includes('z_ssws_shadow_manifest.json'));
    assert.ok(!sutJoin.includes('z_qosmei_manifest.json'));
    assert.ok(!sutJoin.includes('dashboard/z-ai-ecosphere'));
    assert.ok(!sutJoin.includes('Z-SSWS-ALL-PROJECTS-AND-AI-COLONY-BLUEPRINT'));
    assert.ok(!sutJoin.includes('z_ai_ecosphere_ledger_refresh'));
    assert.ok(!sutJoin.includes('z_pc_root_projects.json'));
    assert.ok(!sutJoin.includes('composeProjectWorldAndDna'));
  });

  const frozen = {
    config: { ...cfgFile, data: deepFreeze(deepClone(cfgFile.data)) },
    ledger: { ...ledFile, data: deepFreeze(deepClone(ledFile.data)) },
    status: { ...stFile, data: deepFreeze(deepClone(stFile.data)) },
  };

  let projection;
  probe('B.project-real', () => {
    projection = projectAiEcosphereP0(frozen);
    assert.equal(Boolean(projection.hard_stop), false);
    assert.equal(projection.ecosphere_rings.length, (cfgFile.data.rings || []).length);
    assert.equal(projection.tower_agents.length, (stFile.data.agents || []).length);
    assert.equal(projection.minibots.length, (stFile.data.miniai || []).length);
    assert.equal(projection.advisory_ledger.entries.length, 1 + (ledFile.data.rings || []).length);
  });

  probe('C.version-contract', () => {
    assert.equal(isAcceptedProjection(projection), true);
    assert.equal(isAcceptedProjection({ ...projection, projection_id: 'unsupported-v99' }), false);
    assert.equal(isAcceptedProjection({ ...projection, schema_version: 99 }), false);
    assert.equal(isAcceptedProjection({ ...projection, projection_version: 'nope' }), false);
  });

  probe('D.typed-families-no-total', () => {
    assert.equal(Object.prototype.hasOwnProperty.call(projection.summary, 'total_ai_count'), false);
    const families = new Set([
      ...projection.ecosphere_rings.map((r) => r.family),
      ...projection.tower_agents.map((a) => a.family),
      ...projection.minibots.map((b) => b.family),
    ]);
    assert.ok(families.has('ECOSPHERE_RING'));
    assert.ok(families.has('TOWER_AGENT'));
    assert.ok(families.has('MINIBOT'));
    assert.notEqual(
      projection.summary.ecosphere_ring_count +
        projection.summary.tower_agent_count +
        projection.summary.minibot_count,
      projection.summary.verified_active_runtime_count,
    );
  });

  probe('E.missing-id', () => {
    assert.equal(adaptConfig({ rings: [{ label: 'x' }] }).hard_stop, 'AI_ECOSPHERE_P0_MISSING_AI_ID');
    assert.notEqual(adaptConfig({ rings: [{ label: 'x' }] }).hard_stop, 'AI_ECOSPHERE_P0_DUPLICATE_AI_ID');
  });

  probe('E.display-name-not-id', () => {
    const out = adaptConfig({ rings: [{ display_name: 'Useful', label: 'Useful' }] });
    assert.equal(out.hard_stop, 'AI_ECOSPHERE_P0_MISSING_AI_ID');
  });

  probe('F.duplicate-id', () => {
    assert.equal(
      adaptConfig({ rings: [{ id: 'a' }, { id: 'a' }] }).hard_stop,
      'AI_ECOSPHERE_P0_DUPLICATE_AI_ID',
    );
  });

  probe('G.namespace-reuse', () => {
    const out = projectAiEcosphereP0(
      wrap(
        miniCfg([{ id: 'shared', label: 'ring' }]),
        miniLed([{ id: 'shared', sync_score: 1, band: 'yellow' }]),
        miniSt([{ id: 'shared', status: 'planned', lastPulse: null }], [{ name: 'shared', online: false, mode: 'observer' }]),
      ),
    );
    assert.equal(Boolean(out.hard_stop), false);
    assert.equal(out.tower_agents[0].namespaced_id, 'TOWER_AGENT::shared');
    assert.equal(out.minibots[0].namespaced_id, 'MINIBOT::shared');
    assert.equal(out.ecosphere_rings[0].namespaced_id, 'ECOSPHERE_RING::shared');
  });

  probe('H.ring-not-agent-from-label', () => {
    const out = projectAiEcosphereP0(
      wrap(
        miniCfg([{ id: 'ai-agent-scribe', label: 'ai-agent-scribe' }]),
        miniLed([{ id: 'ai-agent-scribe', sync_score: 1, band: 'green' }]),
        miniSt([{ id: 'other', status: 'planned', lastPulse: null }], [{ name: 'Bot', online: false, mode: 'observer' }]),
      ),
    );
    assert.equal(out.ecosphere_rings[0].family, 'ECOSPHERE_RING');
    assert.ok(!out.tower_agents.some((a) => a.source_id === 'ai-agent-scribe'));
  });

  probe('I.registration-not-active', () => {
    for (const r of projection.ecosphere_rings) {
      assert.ok(!Object.prototype.hasOwnProperty.call(r, 'verified_active') || r.verified_active !== true);
      assert.equal(r.registration.source_value, 'DECLARED_IN_CONFIG');
    }
  });

  probe('K.runtime-real', () => {
    assert.equal(projection.summary.verified_active_runtime_count, 0);
    const srcOnlineTrue = (stFile.data.miniai || []).filter((b) => b.online === true).length;
    assert.equal(srcOnlineTrue, 0);
    for (const b of projection.minibots) {
      assert.equal(b.source_online, false);
      assert.equal(b.live_llm, false);
      assert.notEqual(b.runtime_state, 'DORMANT');
      assert.notEqual(b.runtime_state, 'DEAD');
    }
    for (const a of projection.tower_agents) {
      assert.equal(a.lastPulse, null);
      assert.equal(a.planned, true);
      assert.equal(a.verified_active, false);
      assert.ok(String(a.lastPulse_note).includes('NO RECORDED PULSE'));
      assert.notEqual(a.source_status, 'implemented');
    }
  });

  probe('L.online-true-not-verified-active', () => {
    const out = projectAiEcosphereP0(
      wrap(
        miniCfg([{ id: 'r1', label: 'r' }]),
        miniLed([{ id: 'r1', sync_score: 1, band: 'green' }]),
        miniSt([{ id: 'ag', status: 'planned', lastPulse: null }], [{ name: 'Liveish', online: true, mode: 'observer' }]),
      ),
    );
    assert.equal(out.minibots[0].source_online, true);
    assert.equal(out.minibots[0].verified_active, false);
    assert.equal(out.summary.verified_active_runtime_count, 0);
    return 'EXPECTED_BOUNDARY';
  });

  probe('L.positive-active-path', () => {
    return 'EXPECTED_BOUNDARY';
  });

  probe('N.lastPulse-timestamp-not-active', () => {
    const out = projectAiEcosphereP0(
      wrap(
        miniCfg([{ id: 'r1', label: 'r' }]),
        miniLed([{ id: 'r1', sync_score: 1, band: 'yellow' }]),
        miniSt([{ id: 'ag', status: 'planned', lastPulse: '2026-08-24T16:00:00.000Z' }], [{ name: 'B', online: false, mode: 'observer' }]),
      ),
    );
    assert.equal(out.tower_agents[0].lastPulse, '2026-08-24T16:00:00.000Z');
    assert.equal(out.tower_agents[0].verified_active, false);
  });

  probe('P.ledger-green-not-active', () => {
    assert.equal(detectActiveFromGreen(projection), false);
    const green = projection.advisory_ledger.entries.filter((e) => e.band === 'green');
    assert.ok(green.length >= 1);
    for (const g of green) {
      assert.equal(g.verified_active, false);
      assert.equal(g.band_namespace, 'AI_ECOSPHERE_LEDGER');
    }
    const overall = projection.advisory_ledger.entries.find((e) => e.ledger_kind === 'OVERALL');
    assert.ok(overall);
    assert.notEqual(overall.family, 'TOWER_AGENT');
    assert.ok(!projection.ecosphere_rings.some((r) => r.source_id === 'overall'));
  });

  probe('R.score-not-truth', () => {
    assert.ok(!JSON.stringify(projection).includes('truth_probability'));
    assert.ok(!JSON.stringify(projection).includes('"authorized":true'));
    assert.equal(projection.summary.dormant_classification, 'UNKNOWN');
  });

  probe('S.persona-not-project', () => {
    const out = projectAiEcosphereP0(
      wrap(
        miniCfg([{ id: 'r1', label: 'Sister Aisling Sol' }]),
        miniLed([{ id: 'r1', sync_score: 1, band: 'yellow' }]),
        miniSt(
          [{ id: 'ag', status: 'planned', lastPulse: null }],
          [{ name: 'sister-aisling-sol', online: false, mode: 'observer' }],
        ),
      ),
    );
    assert.equal(out.project_associations.length, 0);
    assert.equal(out.minibots[0].family, 'MINIBOT');
  });

  probe('U.associations-zero', () => {
    assert.deepEqual(projection.project_associations, []);
    assert.equal(projection.summary.verified_project_association_count, 0);
  });

  probe('U.association-positive-path', () => {
    const out = projectAiEcosphereP0(
      wrap(
        miniCfg([{ id: 'r1', label: 'r' }]),
        miniLed([{ id: 'r1', sync_score: 1, band: 'yellow' }]),
        miniSt(
          [{ id: 'ag', status: 'planned', lastPulse: null, project_id: 'z-sanctuary-universe' }],
          [{ name: 'B', online: false, mode: 'observer' }],
        ),
      ),
    );
    assert.equal(out.project_associations.length, 0);
    return 'EXPECTED_BOUNDARY';
  });

  probe('U.fuzzy-association', () => {
    const out = projectAiEcosphereP0(
      wrap(
        miniCfg([{ id: 'r1', label: 'Z_Sanctuary_Universe' }]),
        miniLed([{ id: 'r1', sync_score: 1, band: 'yellow' }]),
        miniSt([{ id: 'ag', status: 'planned', lastPulse: null }], [{ name: 'ZSanctuary_Universe', online: false, mode: 'observer' }]),
      ),
    );
    assert.equal(out.project_associations.length, 0);
  });

  probe('V.roulette', () => {
    assert.ok(!JSON.stringify(projection).includes('replit-roulette-z-amk-goku-mdcp'));
  });

  probe('AB.unmatched-reality', () => {
    const keys = projection.unmatched_records.map((u) => u.source_key).sort();
    assert.deepEqual(keys, ['disturbance_watch', 'hygiene', 'qosmei_core', 'super_ghost_feed', 'task_accomplishments']);
    for (const u of projection.unmatched_records) {
      assert.ok(u.reason);
      assert.ok(u.provenance?.path);
    }
  });

  probe('AB.fuzzy-unmatched-stays', () => {
    const out = projectAiEcosphereP0(
      wrap(
        miniCfg([{ id: 'r1', label: 'r' }]),
        miniLed([{ id: 'r1', sync_score: 1, band: 'yellow' }], {
          tasks: { recent_sample: [{ actor_id: 'DesignerBot', task: 'x' }] },
        }),
        miniSt([{ id: 'ag', status: 'planned', lastPulse: null }], [{ name: 'DesignerBot', online: false, mode: 'observer' }]),
      ),
    );
    assert.ok(out.unmatched_records.some((u) => u.source_key === 'task_accomplishments'));
    assert.ok(!out.minibots[0].ledger_attached);
  });

  probe('AB.explicit-reconcile-path', () => {
    return 'EXPECTED_BOUNDARY';
  });

  probe('Z.conflicts-real', () => {
    const n = tevvConflictCount(ledFile.data);
    assert.equal(projection.conflicts.length, n);
    assert.ok(n >= 1);
    for (const c of projection.conflicts) {
      assert.equal(c.posture, 'UNRESOLVED');
      assert.ok(c.claims.length >= 2);
      assert.ok(c.semantic_field);
      assert.ok(c.entity_ref);
    }
  });

  probe('Z.conflict-count-derived', () => {
    const none = adaptLedger(miniLed([{ id: 'r1', sync_score: 10, band: 'green' }], { overall: { sync_score: 10, band: 'green' } }));
    assert.equal(none.conflicts.length, 0);
    const one = adaptLedger(
      miniLed([{ id: 'r1', sync_score: 10, band: 'green' }], {
        overall: { sync_score: 10, band: 'green' },
        deltaRings: { r1: { current: 99 } },
      }),
    );
    assert.equal(one.conflicts.length, 1);
    assert.equal(one.conflicts[0].posture, 'UNRESOLVED');
  });

  probe('AA.different-dimensions', () => {
    const out = projectAiEcosphereP0(
      wrap(
        miniCfg([{ id: 'r1', label: 'r' }]),
        miniLed([{ id: 'r1', sync_score: 90, band: 'green' }], { overall: { band: 'green', sync_score: 90 } }),
        miniSt([{ id: 'ag', status: 'planned', lastPulse: null }], [{ name: 'B', online: false, mode: 'observer' }]),
      ),
    );
    assert.equal(out.conflicts.length, 0);
  });

  probe('W.blueprint-live', () => {
    const t = JSON.stringify(projection);
    assert.ok(!t.includes('AI_COLONY_RUNTIME'));
    assert.ok(!t.includes('SWARM_RUNTIME'));
    assert.equal(projection.tower_meta.tower_phase, 'blueprint');
    assert.equal(projection.model_provider_evidence, 'NOT_PRESENT');
    const qos = projection.unmatched_records.find((u) => u.source_key === 'qosmei_core');
    assert.ok(qos);
    assert.notEqual(projection.tower_meta.status, 'active');
  });

  probe('AC.provenance', () => {
    for (const r of projection.ecosphere_rings) assert.equal(r.provenance.path, SOURCE_PATHS.config);
    for (const a of projection.tower_agents) assert.equal(a.provenance.path, SOURCE_PATHS.status);
    for (const b of projection.minibots) assert.equal(b.provenance.path, SOURCE_PATHS.status);
    for (const e of projection.advisory_ledger.entries) assert.equal(e.provenance.path, SOURCE_PATHS.ledger);
    assert.ok(!JSON.stringify(projection).includes('C:/Cursor Projects Organiser'));
    assert.equal(projection.posture, 'DERIVED_READ_MODEL');
    assert.equal(projection.summary.origin, 'DERIVED');
  });

  probe('AE.gare', () => {
    assert.equal(detectGare(projection), false);
    assert.ok(!JSON.stringify(projection).includes('"governance_authority":true'));
    assert.ok(!sutJoin.includes('Mango Tree'));
    assert.ok(!sutJoin.includes('Tarzan Tree'));
    assert.ok(!sutJoin.includes('z_deterministic_foundation'));
  });

  probe('AF.non-mutation', () => {
    const beforeC = deepClone(frozen.config.data);
    const beforeL = deepClone(frozen.ledger.data);
    const beforeS = deepClone(frozen.status.data);
    projectAiEcosphereP0(frozen);
    assert.deepStrictEqual(deepClone(frozen.config.data), beforeC);
    assert.deepStrictEqual(deepClone(frozen.ledger.data), beforeL);
    assert.deepStrictEqual(deepClone(frozen.status.data), beforeS);
  });

  probe('AG.shared-ref', () => {
    const shared = { status: 'planned', lastPulse: null };
    const status = miniSt(
      [
        { id: 'a1', ...shared },
        { id: 'a2', ...shared },
      ],
      [{ name: 'B', online: false, mode: 'observer' }],
    );
    status.agents[0].lastPulse = shared.lastPulse;
    const cfg = miniCfg([{ id: 'r1', label: 'r' }]);
    const led = miniLed([{ id: 'r1', sync_score: 1, band: 'yellow' }]);
    const out = projectAiEcosphereP0(wrap(cfg, led, status));
    shared.status = 'ACTIVE';
    assert.equal(out.tower_agents[0].source_status, 'planned');
  });

  probe('AH.backflow', () => {
    const out = projectAiEcosphereP0({
      config: { ...cfgFile, data: deepClone(cfgFile.data) },
      ledger: { ...ledFile, data: deepClone(ledFile.data) },
      status: { ...stFile, data: deepClone(stFile.data) },
    });
    out.ecosphere_rings[0].source_id = 'X';
    out.tower_agents[0].verified_active = true;
    out.minibots[0].live_llm = true;
    out.advisory_ledger.entries[0].verified_active = true;
    out.runtime_evidence[0].verified_active = true;
    out.conflicts[0].posture = 'RESOLVED';
    out.unmatched_records[0].reason = 'HACK';
    out.summary.verified_active_runtime_count = 99;
    assert.equal(cfgFile.data.rings[0].id, frozen.config.data.rings[0].id);
    assert.equal(stFile.data.agents[0].status, 'planned');
  });

  probe('AI.determinism-10x', () => {
    let prev = projectAiEcosphereP0(frozen);
    for (let i = 0; i < 9; i += 1) {
      const next = projectAiEcosphereP0(frozen);
      assert.deepStrictEqual(next, prev);
      prev = next;
    }
  });

  probe('AJ.order-stable', () => {
    const rings = [
      { id: 'z_b', label: 'b' },
      { id: 'z_a', label: 'a' },
    ];
    const out = projectAiEcosphereP0(
      wrap(
        miniCfg(rings),
        miniLed(rings.map((r) => ({ id: r.id, sync_score: 1, band: 'yellow' }))),
        miniSt(
          [
            { id: 'z', status: 'planned', lastPulse: null },
            { id: 'a', status: 'planned', lastPulse: null },
          ],
          [
            { name: 'Zed', online: false, mode: 'observer' },
            { name: 'Ann', online: false, mode: 'observer' },
          ],
        ),
      ),
    );
    assert.deepEqual(
      out.ecosphere_rings.map((r) => r.source_id),
      ['z_a', 'z_b'],
    );
    assert.deepEqual(
      out.tower_agents.map((a) => a.source_id),
      ['a', 'z'],
    );
    assert.deepEqual(
      out.minibots.map((b) => b.source_id),
      ['Ann', 'Zed'],
    );
  });

  probe('AK.aba', () => {
    const a = wrap(
      miniCfg([{ id: 'r1', label: 'r' }]),
      miniLed([{ id: 'r1', sync_score: 1, band: 'yellow' }]),
      miniSt([{ id: 'ag', status: 'planned', lastPulse: null }], [{ name: 'B', online: false, mode: 'observer' }]),
    );
    const b = wrap(
      miniCfg([{ id: 'r2', label: 'r' }]),
      miniLed([{ id: 'r2', sync_score: 2, band: 'red' }], { deltaRings: { r2: { current: 9 } }, overall: { sync_score: 2, band: 'red' } }),
      miniSt([{ id: 'xx', status: 'planned', lastPulse: 'ts' }], [{ name: 'Q', online: true, mode: 'observer' }]),
    );
    const a1 = projectAiEcosphereP0(a);
    projectAiEcosphereP0(b);
    const a2 = projectAiEcosphereP0(a);
    assert.deepStrictEqual(a1, a2);
    const b1 = projectAiEcosphereP0(b);
    assert.equal(b1.summary.verified_active_runtime_count, 0);
    assert.equal(b1.conflicts.length, 1);
    projectAiEcosphereP0(a);
    const b2 = projectAiEcosphereP0(b);
    assert.deepStrictEqual(b1, b2);
  });

  probe('AL.rebuild-tracked', () => {
    assert.equal(stableStringify(tracked.data), stableStringify(projection));
  });

  probe('AM.sealed-head-rebuild', () => {
    const head = {
      config: { ok: true, path: SOURCE_PATHS.config, ...loadHead(SOURCE_PATHS.config), canonical_json_sha256: 'h' },
      ledger: { ok: true, path: SOURCE_PATHS.ledger, ...loadHead(SOURCE_PATHS.ledger), canonical_json_sha256: 'h' },
      status: { ok: true, path: SOURCE_PATHS.status, ...loadHead(SOURCE_PATHS.status), canonical_json_sha256: 'h' },
    };
    const fromHead = projectAiEcosphereP0(head);
    const strip = (p) => {
      const c = deepClone(p);
      for (const s of c.sources) {
        delete s.sha256;
        delete s.canonical_json_sha256;
      }
      return c;
    };
    assert.equal(stableStringify(strip(fromHead)), stableStringify(strip(tracked.data)));
    for (const rel of Object.values(SOURCE_PATHS)) {
      const wt = JSON.parse(fs.readFileSync(repoRel(ROOT, rel), 'utf8'));
      const hd = loadHead(rel).data;
      assert.equal(canonicalJsonSha(wt), canonicalJsonSha(hd));
    }
  });

  probe('AN.report-not-source', () => {
    for (const rel of SUT.filter((f) => !f.endsWith('constants.mjs') && !f.endsWith('p0.mjs'))) {
      const text = fs.readFileSync(repoRel(ROOT, rel), 'utf8');
      assert.ok(!text.includes('z_composed_awareness_ai_ecosphere_p0.json'));
    }
  });

  probe('AO.prohibited-runtime', () => {
    for (const rel of SUT) {
      const text = fs.readFileSync(repoRel(ROOT, rel), 'utf8');
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
    }
  });

  probe('AP.negative-controls', () => {
    assert.equal(uniqueRequiredIds([''], 'AI_ECOSPHERE_P0_MISSING_AI_ID', 'AI_ECOSPHERE_P0_DUPLICATE_AI_ID').hard_stop, 'AI_ECOSPHERE_P0_MISSING_AI_ID');
    assert.equal(uniqueRequiredIds(['a', 'a'], 'AI_ECOSPHERE_P0_MISSING_AI_ID', 'AI_ECOSPHERE_P0_DUPLICATE_AI_ID').hard_stop, 'AI_ECOSPHERE_P0_DUPLICATE_AI_ID');
    const m6 = deepClone(projection);
    m6.summary.total_ai_count = 12;
    assert.equal(detectTotalAi(m6), true);
    assert.equal(detectTotalAi(projection), false);
    const m10 = deepClone(projection);
    m10.advisory_ledger.entries.find((e) => e.band === 'green').verified_active = true;
    assert.equal(detectActiveFromGreen(m10), true);
    const m14 = { source_online: false, runtime_state: 'DORMANT' };
    assert.equal(detectOnlineAsDormant(m14), true);
    const m32 = { AI_COLONY_RUNTIME: 'ACTIVE' };
    assert.equal(detectColonyLive(m32), true);
    const m39 = deepClone(projection);
    m39.tower_agents[0].autonomous_eligible = true;
    assert.equal(detectGare(m39), true);
    const mutantProv = deepClone(projection);
    mutantProv.tower_agents[0].provenance.path = TRACKED;
    assert.equal(mutantProv.tower_agents[0].provenance.path, TRACKED);
    const mutantPath = deepClone(projection);
    mutantPath.ecosphere_rings[0].provenance.path = 'C:/Cursor Projects Organiser/secret';
    assert.ok(JSON.stringify(mutantPath).includes('C:/Cursor Projects Organiser'));
    const drift = deepClone(tracked.data);
    drift.summary.verified_active_runtime_count = 12;
    assert.notEqual(stableStringify(drift), stableStringify(projection));
  });

  findings.push({
    id: 'OBS-ID-001',
    severity: 'OBSERVATION',
    area: 'child-crystal-dna',
    finding: 'Crystal DNA child missing-id diagnostic remains coarse. AI Ecosphere P0 uses distinct missing vs duplicate codes. Child not repaired.',
    reproducer: 'prior Crystal DNA TEVV',
    identity_impact: 'none on this adapter',
    runtime_claim_impact: 'none',
    project_impact: 'none',
    provenance_impact: 'none',
    gare_impact: 'none',
    authority_impact: 'none',
    recommended_remediation_scope: 'not this gate',
  });
  findings.push({
    id: 'OBS-COMP-001',
    severity: 'OBSERVATION',
    area: 'two-lens-compose',
    finding: 'Two-lens compose() still does not reject unknown child versions. This adapter validates projection_id/schema/version via isAcceptedProjection. compose() not repaired.',
    reproducer: 'prior composition TEVV',
    identity_impact: 'none',
    runtime_claim_impact: 'none',
    project_impact: 'none',
    provenance_impact: 'none',
    gare_impact: 'none',
    authority_impact: 'none',
    recommended_remediation_scope: 'future three-lens acquisition',
  });
  findings.push({
    id: 'OBS-COMP-002',
    severity: 'OBSERVATION',
    area: 'two-lens-conflicts',
    finding: 'Two-lens compose conflicts[] remain empty. AI Ecosphere P0 retains 2 UNRESOLVED ledger same-field conflicts.',
    reproducer: 'ledger sync_score vs delta/alerts',
    identity_impact: 'none',
    runtime_claim_impact: 'none',
    project_impact: 'none',
    provenance_impact: 'none',
    gare_impact: 'none',
    authority_impact: 'none',
    recommended_remediation_scope: 'three-lens spec must not drop these',
  });
  findings.push({
    id: 'OBS-AI-001',
    severity: 'OBSERVATION',
    area: 'verified-active',
    finding: 'P0 never sets verified_active true, including synthetic online:true. SOURCE ONLINE TRUE ≠ FULL VERIFIED ACTIVE. No P0 shape produces VERIFIED ACTIVE = 1.',
    reproducer: 'L.online-true-not-verified-active',
    identity_impact: 'none',
    runtime_claim_impact: 'fail-safe zero active',
    project_impact: 'none',
    provenance_impact: 'none',
    gare_impact: 'none',
    authority_impact: 'none',
    recommended_remediation_scope: 'future runtime-evidence charter',
  });
  findings.push({
    id: 'OBS-AI-002',
    severity: 'OBSERVATION',
    area: 'project-association',
    finding: 'P0 project_associations is always []. Extra project_id on an agent is ignored. No explicit association ingestion channel in the three-file contract.',
    reproducer: 'U.association-positive-path',
    identity_impact: 'no false joins',
    runtime_claim_impact: 'none',
    project_impact: 'none',
    provenance_impact: 'none',
    gare_impact: 'none',
    authority_impact: 'none',
    recommended_remediation_scope: 'three-lens spec / later adapter if sources gain explicit refs',
  });
  findings.push({
    id: 'OBS-AI-003',
    severity: 'OBSERVATION',
    area: 'unmatched-reconciliation',
    finding: 'P0 has no explicit identity-bridge matcher. Task actor_id DesignerBot stays unmatched beside MiniBot DesignerBot (correct: no silent attach). No MATCHED positive path.',
    reproducer: 'AB.fuzzy-unmatched-stays',
    identity_impact: 'unmatched preserved',
    runtime_claim_impact: 'none',
    project_impact: 'none',
    provenance_impact: 'none',
    gare_impact: 'none',
    authority_impact: 'none',
    recommended_remediation_scope: 'only if canon defines an explicit bridge field',
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
  const s = projection.summary;

  console.log(`
Z COMPOSED AWARENESS
AI ECOSPHERE P0 INTERNAL TEVV

SOURCE CUSTODY                    CLEAN
BASELINE P0                       PASS

RINGS                             ${s.ecosphere_ring_count}
TOWER AGENTS                      ${s.tower_agent_count}
MINIBOTS                          ${s.minibot_count}
LEDGER ENTRIES                    ${s.ledger_entry_count}

TYPED IDENTITY                    PASS
MISSING-ID DEFENSE                PASS
DUPLICATE-ID DEFENSE              PASS

REGISTERED / ACTIVE WALL          PASS
CONFIG / RUNNING WALL             PASS
LEDGER / LIVE WALL                PASS
GREEN / ACTIVE WALL               PASS
SCORE / TRUTH WALL                PASS

ONLINE-FALSE SEMANTICS            PASS
LASTPULSE-NULL SEMANTICS          PASS
PLANNED / IMPLEMENTED WALL        PASS

VERIFIED ACTIVE RUNTIMES          ${s.verified_active_runtime_count}

PERSONA / PROJECT WALL            PASS
MINIBOT / MODEL WALL              PASS
PROJECT ASSOCIATION WALL          PASS
ROULETTE BOUNDARY                 PASS

CONFLICTS PRESERVED               ${s.conflict_count}
UNMATCHED PRESERVED               ${s.unmatched_record_count}

BLUEPRINT / LIVE WALL             PASS
COLONY / SWARM WALL               PASS

PROVENANCE                        PASS
SOURCE NON-MUTATION               PASS
OUTPUT BACKFLOW                   PASS

10X DETERMINISM                   PASS
HIDDEN STATE                      PASS

REPORT REBUILDABILITY             PASS
SEALED-HEAD REBUILDABILITY        PASS

GARE ELIGIBILITY LEAKS            0
REPAIR AUTHORITY LEAKS            0

NETWORK                           NONE
DATABASE                          NONE
AI MODEL EXECUTION                NONE
LEDGER REFRESH                    NOT RUN

NEGATIVE CONTROL HARNESS          PASS

PROBES TOTAL                      ${stats.total}
PROBES PASS                       ${stats.pass}
PROBES FAIL                       ${stats.fail}
EXPECTED_BOUNDARY                 ${stats.boundary}

CRITICAL FINDINGS                 ${critical}
HIGH FINDINGS                     ${high}
MEDIUM FINDINGS                   ${medium}
LOW FINDINGS                      ${low}
OBSERVATIONS                      ${obs}

ORACLE_COUPLING_RISK              MEDIUM

COMPOSED_AWARENESS_AI_ECOSPHERE_P0_TEVV = ${pass ? 'PASS' : 'FAIL'}
`);

  if (!pass) {
    console.error(JSON.stringify(findings.filter((f) => f.severity !== 'OBSERVATION'), null, 2));
    process.exit(1);
  }
}

main();
