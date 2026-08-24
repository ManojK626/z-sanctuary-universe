import { ADAPTER_VERSION, IMPLEMENTATION_VERSION, NS, PROJECTION_ID, SCHEMA_VERSION, SOURCE_PATHS } from './constants.mjs';
import { adaptConfig } from './config_adapter.mjs';
import { adaptLedger } from './ledger_adapter.mjs';
import { adaptStatus } from './status_adapter.mjs';

export function isAcceptedProjection(p) {
  return (
    p &&
    p.projection_id === PROJECTION_ID &&
    p.schema_version === SCHEMA_VERSION &&
    p.projection_version === IMPLEMENTATION_VERSION
  );
}

export function projectAiEcosphereP0(loaded) {
  const cfg = adaptConfig(loaded.config.data);
  if (cfg.hard_stop) return cfg;
  const st = adaptStatus(loaded.status.data);
  if (st.hard_stop) return st;
  const led = adaptLedger(loaded.ledger.data);
  if (led.hard_stop) return led;

  const runtime_evidence = [];
  for (const a of st.tower_agents) {
    runtime_evidence.push({
      namespaced_id: a.namespaced_id,
      family: NS.AGENT,
      source_status: a.source_status,
      lastPulse: a.lastPulse,
      verified_active: false,
      origin: 'DERIVED_REAL',
      provenance: a.provenance,
    });
  }
  for (const b of st.minibots) {
    runtime_evidence.push({
      namespaced_id: b.namespaced_id,
      family: NS.MINIBOT,
      source_online: b.source_online,
      mode: b.mode,
      verified_active: false,
      origin: 'DERIVED_REAL',
      provenance: b.provenance,
    });
  }

  const unmatched_records = [...st.unmatched_records, ...led.unmatched_records].sort((a, b) =>
    a.source_key < b.source_key ? -1 : a.source_key > b.source_key ? 1 : 0,
  );

  const conflicts = [...led.conflicts].sort((a, b) =>
    a.entity_ref < b.entity_ref ? -1 : a.entity_ref > b.entity_ref ? 1 : 0,
  );

  return {
    schema_version: SCHEMA_VERSION,
    projection_id: PROJECTION_ID,
    projection_version: IMPLEMENTATION_VERSION,
    adapter_version: ADAPTER_VERSION,
    posture: 'DERIVED_READ_MODEL',
    origin: 'DERIVED_REAL',
    ordering_rule: 'rings/agents/minibots/ledger RING entries by source_id; conflicts by entity_ref; unmatched by source_key',
    sources: [
      {
        role: 'DECLARED_CONFIGURATION_REGISTRATION',
        path: SOURCE_PATHS.config,
        sha256: loaded.config.sha256,
        canonical_json_sha256: loaded.config.canonical_json_sha256,
        origin: 'REAL_SOURCE',
      },
      {
        role: 'DERIVED_ADVISORY_LEDGER',
        path: SOURCE_PATHS.ledger,
        sha256: loaded.ledger.sha256,
        canonical_json_sha256: loaded.ledger.canonical_json_sha256,
        origin: 'DERIVED_REAL',
      },
      {
        role: 'DECLARED_TOWER_MINIBOT_STATUS',
        path: SOURCE_PATHS.status,
        sha256: loaded.status.sha256,
        canonical_json_sha256: loaded.status.canonical_json_sha256,
        origin: 'REAL_SOURCE',
      },
    ],
    configuration: {
      actor_classes: cfg.actor_classes,
      purpose: cfg.purpose,
      config_schema_version: cfg.schema_version,
      note: 'CONFIG FILE ≠ PROCESS RUNNING',
      origin: 'DERIVED_REAL',
    },
    tower_meta: st.tower_meta,
    ecosphere_rings: cfg.rings,
    tower_agents: st.tower_agents,
    minibots: st.minibots,
    advisory_ledger: {
      governance_note: led.governance_note,
      generated_at: led.generated_at,
      entries: led.entries,
    },
    project_associations: [],
    runtime_evidence,
    conflicts,
    unmatched_records,
    model_provider_evidence: 'NOT_PRESENT',
    summary: {
      origin: 'DERIVED',
      ecosphere_ring_count: cfg.rings.length,
      tower_agent_count: st.tower_agents.length,
      minibot_count: st.minibots.length,
      ledger_entry_count: led.entries.length,
      verified_project_association_count: 0,
      verified_active_runtime_count: runtime_evidence.filter((r) => r.verified_active === true).length,
      unverified_runtime_evidence_count: runtime_evidence.length,
      conflict_count: conflicts.length,
      unmatched_record_count: unmatched_records.length,
      dormant_classification: 'UNKNOWN',
      note: 'No collapsed universal AI total. dormant numeric count omitted (not source-deterministic).',
    },
  };
}
