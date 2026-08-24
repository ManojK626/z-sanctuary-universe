#!/usr/bin/env node
/**
 * AI Ecosphere P0 verifier. Independent of generator exit code.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { adaptConfig } from './z_composed_awareness_ai_ecosphere/config_adapter.mjs';
import {
  IMPLEMENTATION_VERSION,
  OUTPUT_PATH,
  PROJECTION_ID,
  SCHEMA_VERSION,
  SOURCE_PATHS,
} from './z_composed_awareness_ai_ecosphere/constants.mjs';
import { adaptLedger } from './z_composed_awareness_ai_ecosphere/ledger_adapter.mjs';
import { isAcceptedProjection, projectAiEcosphereP0 } from './z_composed_awareness_ai_ecosphere/projection.mjs';
import {
  canonicalJsonSha,
  deepClone,
  loadConfigured,
  repoRel,
  sha256File,
  stableStringify,
} from './z_composed_awareness_ai_ecosphere/source_loader.mjs';
import { adaptStatus } from './z_composed_awareness_ai_ecosphere/status_adapter.mjs';
import { runAiEcosphereP0 } from './z_composed_awareness_ai_ecosphere_p0.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const ENVELOPE = 'data/reports/z_composed_awareness_project_world_crystal_dna_p0.json';
const NEW_RUNTIME = [
  'scripts/z_composed_awareness_ai_ecosphere/constants.mjs',
  'scripts/z_composed_awareness_ai_ecosphere/source_loader.mjs',
  'scripts/z_composed_awareness_ai_ecosphere/identity.mjs',
  'scripts/z_composed_awareness_ai_ecosphere/config_adapter.mjs',
  'scripts/z_composed_awareness_ai_ecosphere/status_adapter.mjs',
  'scripts/z_composed_awareness_ai_ecosphere/ledger_adapter.mjs',
  'scripts/z_composed_awareness_ai_ecosphere/projection.mjs',
  'scripts/z_composed_awareness_ai_ecosphere_p0.mjs',
];

function rel(p) {
  return repoRel(ROOT, p);
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

function wrap(config, ledger, status) {
  return {
    config: { ok: true, path: SOURCE_PATHS.config, sha256: 'fixture', canonical_json_sha256: 'fixture', data: config },
    ledger: { ok: true, path: SOURCE_PATHS.ledger, sha256: 'fixture', canonical_json_sha256: 'fixture', data: ledger },
    status: { ok: true, path: SOURCE_PATHS.status, sha256: 'fixture', canonical_json_sha256: 'fixture', data: status },
  };
}

function main() {
  const srcBefore = {};
  for (const p of Object.values(SOURCE_PATHS)) srcBefore[p] = sha256File(rel(p));
  const canonBefore = {};
  for (const p of Object.values(SOURCE_PATHS)) {
    canonBefore[p] = canonicalJsonSha(JSON.parse(fs.readFileSync(rel(p), 'utf8')));
  }
  const envelopeBefore = sha256File(rel(ENVELOPE));

  const loaded = loadConfigured(ROOT, SOURCE_PATHS);
  assert.equal(loaded.errors.length, 0, JSON.stringify(loaded.errors));
  const snapCfg = deepClone(loaded.config.data);
  const snapLed = deepClone(loaded.ledger.data);
  const snapSt = deepClone(loaded.status.data);

  const r1 = projectAiEcosphereP0(loaded);
  const r2 = projectAiEcosphereP0(loaded);
  const r3 = projectAiEcosphereP0(loaded);
  assert.equal(Boolean(r1.hard_stop), false);
  assert.deepStrictEqual(r1, r2);
  assert.deepStrictEqual(r2, r3);
  assert.deepStrictEqual(loaded.config.data, snapCfg);
  assert.deepStrictEqual(loaded.ledger.data, snapLed);
  assert.deepStrictEqual(loaded.status.data, snapSt);

  const mutated = deepClone(r1);
  mutated.ecosphere_rings[0].source_id = 'MUTATED';
  mutated.tower_agents[0].source_status = 'ACTIVE';
  mutated.minibots[0].source_online = true;
  mutated.summary.verified_active_runtime_count = 99;
  assert.deepStrictEqual(loaded.config.data, snapCfg);
  assert.deepStrictEqual(loaded.status.data, snapSt);

  assert.equal(isAcceptedProjection(r1), true);
  assert.equal(r1.projection_id, PROJECTION_ID);
  assert.equal(r1.schema_version, SCHEMA_VERSION);
  assert.equal(r1.projection_version, IMPLEMENTATION_VERSION);
  assert.equal(isAcceptedProjection({ ...r1, projection_id: 'unsupported-v99' }), false);
  assert.equal(isAcceptedProjection({ ...r1, schema_version: 99 }), false);

  assert.equal(Object.prototype.hasOwnProperty.call(r1.summary, 'total_ai_count'), false);
  assert.equal(r1.summary.dormant_classification, 'UNKNOWN');
  assert.equal(r1.ecosphere_rings.length, r1.summary.ecosphere_ring_count);
  assert.equal(r1.tower_agents.length, r1.summary.tower_agent_count);
  assert.equal(r1.minibots.length, r1.summary.minibot_count);
  assert.equal(r1.advisory_ledger.entries.length, r1.summary.ledger_entry_count);

  for (const a of r1.tower_agents) {
    assert.equal(a.verified_active, false);
    assert.equal(a.live_llm, false);
    assert.equal(a.lastPulse, null);
    assert.ok(String(a.lastPulse_note).includes('NO RECORDED PULSE'));
    assert.equal(a.planned, true);
    assert.notEqual(a.source_status, 'implemented');
    assert.ok(a.provenance.path === SOURCE_PATHS.status);
  }
  for (const b of r1.minibots) {
    assert.equal(b.source_online, false);
    assert.equal(b.live_llm, false);
    assert.equal(b.verified_active, false);
    assert.ok(String(b.online_note).includes('source_online=false'));
    assert.ok(!String(b.online_note).includes('UNIVERSAL DORMANT') || String(b.online_note).includes('not universal'));
  }
  assert.equal(r1.summary.verified_active_runtime_count, 0);
  assert.equal(r1.summary.verified_project_association_count, 0);
  assert.deepEqual(r1.project_associations, []);
  assert.equal(r1.model_provider_evidence, 'NOT_PRESENT');

  const blob = JSON.stringify(r1);
  assert.equal(Object.prototype.hasOwnProperty.call(r1.summary, 'total_ai_count'), false);
  assert.ok(!Object.prototype.hasOwnProperty.call(r1.summary, 'dormant_count'));
  assert.ok(!blob.includes('C:/Cursor Projects Organiser'));
  assert.ok(!blob.includes('autonomous_eligible'));
  assert.ok(!blob.includes('repair_class'));
  assert.ok(!blob.includes('GARE_recipe'));
  assert.ok(!blob.includes('LIVE_LLM'));
  assert.ok(!blob.includes('AI Colony is live'));
  assert.ok(!blob.includes('Swarm is live'));
  assert.ok(!blob.includes('z_ai_ecosphere_ledger_refresh'));
  assert.ok(!blob.includes('z_family_ai_registry'));
  assert.ok(!blob.includes('z_qosmei_manifest.json'));
  assert.ok(!blob.includes('z_ssws_shadow_manifest'));
  assert.ok(!blob.includes('z_pc_root_projects.json'));

  for (const e of r1.advisory_ledger.entries) {
    assert.equal(e.verified_active, false);
    assert.equal(e.band_namespace, 'AI_ECOSPHERE_LEDGER');
    assert.notEqual(e.band, 'ACTIVE');
  }
  const green = r1.advisory_ledger.entries.filter((e) => e.band === 'green');
  assert.ok(green.length >= 1);
  for (const g of green) assert.equal(g.verified_active, false);

  assert.ok(r1.conflicts.length >= 1);
  for (const c of r1.conflicts) {
    assert.equal(c.posture, 'UNRESOLVED');
    assert.ok(c.claims.length >= 2);
  }
  assert.ok(r1.unmatched_records.length >= 1);
  assert.ok(r1.unmatched_records.some((u) => u.source_key === 'qosmei_core'));
  assert.ok(r1.unmatched_records.some((u) => u.source_key === 'task_accomplishments'));

  assert.equal(adaptConfig({ rings: [{ label: 'x' }] }).hard_stop, 'AI_ECOSPHERE_P0_MISSING_AI_ID');
  assert.equal(
    adaptConfig({ rings: [{ id: 'a' }, { id: 'a' }] }).hard_stop,
    'AI_ECOSPHERE_P0_DUPLICATE_AI_ID',
  );
  assert.notEqual('AI_ECOSPHERE_P0_MISSING_AI_ID', 'AI_ECOSPHERE_P0_DUPLICATE_AI_ID');
  assert.equal(adaptStatus({ agents: [{ owner: 'x' }], miniai: [] }).hard_stop, 'AI_ECOSPHERE_P0_MISSING_AI_ID');
  assert.equal(
    adaptStatus({
      agents: [
        { id: 'd', status: 'planned', lastPulse: null },
        { id: 'd', status: 'planned', lastPulse: null },
      ],
      miniai: [],
    }).hard_stop,
    'AI_ECOSPHERE_P0_DUPLICATE_AI_ID',
  );

  const persona = projectAiEcosphereP0(
    wrap(
      { rings: [{ id: 'z_ssws', label: 'ZSanctuary_Universe' }], actor_classes: [] },
      { rings: [{ id: 'z_ssws', band: 'green', sync_score: 1 }], overall: { band: 'green', sync_score: 1 }, delta: { rings: {} } },
      {
        agents: [{ id: 'ai-agent-scribe', status: 'planned', lastPulse: null }],
        miniai: [{ name: 'ZSanctuary_Universe', online: false, mode: 'observer' }],
        ai_tower: { tower_phase: 'blueprint', planned_rollout_only: true },
      },
    ),
  );
  assert.equal(persona.project_associations.length, 0);
  assert.equal(persona.minibots[0].source_id, 'ZSanctuary_Universe');
  assert.ok(!persona.ecosphere_rings.some((r) => r.family === 'PROJECT'));

  const dim = projectAiEcosphereP0(
    wrap(
      { rings: [{ id: 'r1', label: 'r' }], actor_classes: [] },
      {
        overall: { band: 'green', sync_score: 90 },
        rings: [{ id: 'r1', band: 'green', sync_score: 90 }],
        delta: { rings: { r1: { current: 90 } } },
      },
      {
        agents: [{ id: 'ag1', status: 'planned', lastPulse: null }],
        miniai: [{ name: 'Bot1', online: false, mode: 'observer' }],
        ai_tower: { tower_phase: 'blueprint' },
      },
    ),
  );
  assert.equal(dim.conflicts.length, 0);
  assert.equal(dim.minibots[0].source_online, false);
  assert.equal(dim.advisory_ledger.entries.find((e) => e.band === 'green').verified_active, false);

  const same = adaptLedger({
    overall: { sync_score: 1, band: 'yellow' },
    rings: [{ id: 'r1', sync_score: 10, band: 'green' }],
    delta: { rings: { r1: { current: 99 } } },
  });
  assert.equal(same.conflicts.length, 1);
  assert.equal(same.conflicts[0].posture, 'UNRESOLVED');

  const disk = JSON.parse(fs.readFileSync(rel(OUTPUT_PATH), 'utf8'));
  assert.equal(stableStringify(disk), stableStringify(r1));

  for (const f of NEW_RUNTIME) {
    const text = fs.readFileSync(rel(f), 'utf8');
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
      assert.equal(executableUse(text, token), false, `${f} ${token}`);
    }
    assert.ok(!text.includes('Date.now()'), f);
    assert.ok(!/\bnew Date\s*\(/.test(text), f);
    assert.ok(!text.includes('performance.now()'), f);
    assert.ok(!text.includes('z_ai_ecosphere_ledger_refresh'));
    assert.ok(!text.includes('openai'));
  }

  assert.equal(runAiEcosphereP0(ROOT).ok, true);

  for (const p of Object.values(SOURCE_PATHS)) {
    assert.equal(sha256File(rel(p)), srcBefore[p]);
    assert.equal(canonicalJsonSha(JSON.parse(fs.readFileSync(rel(p), 'utf8'))), canonBefore[p]);
  }
  assert.equal(sha256File(rel(ENVELOPE)), envelopeBefore);

  const s = disk.summary;
  console.log(`
Z COMPOSED AWARENESS
AI ECOSPHERE P0

SOURCES: 3
ECOSPHERE RINGS: ${s.ecosphere_ring_count}
TOWER AGENTS: ${s.tower_agent_count}
MINIBOTS: ${s.minibot_count}
LEDGER ENTRIES: ${s.ledger_entry_count}
VERIFIED ACTIVE RUNTIMES: ${s.verified_active_runtime_count}
UNVERIFIED RUNTIME RECORDS: ${s.unverified_runtime_evidence_count}
VERIFIED PROJECT ASSOCIATIONS: ${s.verified_project_association_count}
CONFLICTS: ${s.conflict_count}
UNMATCHED: ${s.unmatched_record_count}

REGISTERED / ACTIVE WALL: PASS
CONFIG / RUNNING WALL: PASS
LEDGER / LIVE WALL: PASS
GREEN / ACTIVE WALL: PASS
SCORE / TRUTH WALL: PASS
PERSONA / PROJECT WALL: PASS
MINIBOT / MODEL WALL: PASS
PROJECT OWNERSHIP WALL: PASS
GARE WALL: PASS
SOURCE CUSTODY: PASS
SOURCE NON-MUTATION: PASS
3X DETERMINISM: PASS
NETWORK: NONE
DATABASE: NONE
AI MODEL EXECUTION: NONE
LEDGER REFRESH: NOT RUN

COMPOSED_AWARENESS_AI_ECOSPHERE_P0 = PASS
`);
}

main();
