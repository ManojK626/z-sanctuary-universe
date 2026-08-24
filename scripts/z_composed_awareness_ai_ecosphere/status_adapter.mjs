import { NS, SOURCE_PATHS } from './constants.mjs';
import { namespacedId, sortById, uniqueRequiredIds } from './identity.mjs';

function prov(record) {
  return {
    path: SOURCE_PATHS.status,
    source_record: record,
    source_namespace: 'AI_STATUS',
    generated_at: undefined,
    origin: 'REAL_SOURCE',
  };
}

export function adaptStatus(status) {
  const agentsIn = Array.isArray(status?.agents) ? status.agents : [];
  const agentIds = agentsIn.map((a) => a?.id);
  const u1 = uniqueRequiredIds(agentIds, 'AI_ECOSPHERE_P0_MISSING_AI_ID', 'AI_ECOSPHERE_P0_DUPLICATE_AI_ID');
  if (u1.hard_stop) return u1;

  const botsIn = Array.isArray(status?.miniai) ? status.miniai : [];
  const botKeys = botsIn.map((b) => b?.name);
  const u2 = uniqueRequiredIds(botKeys, 'AI_ECOSPHERE_P0_MISSING_AI_ID', 'AI_ECOSPHERE_P0_DUPLICATE_AI_ID');
  if (u2.hard_stop) return u2;

  const generated_at = status.generated_at;
  const tower = status.ai_tower || {};

  const tower_agents = sortById(
    agentsIn.map((a) => ({
      family: NS.AGENT,
      source_id: a.id,
      namespaced_id: namespacedId(NS.AGENT, a.id),
      owner: a.owner,
      source_status: a.status,
      lastPulse: a.lastPulse === undefined ? 'MISSING' : a.lastPulse,
      lastPulse_note:
        a.lastPulse === null
          ? 'NO RECORDED PULSE — not proven offline/dead/broken'
          : 'SOURCE_DECLARED',
      planned: a.status === 'planned',
      verified_active: false,
      live_llm: false,
      model_provider: 'NOT_PRESENT',
      origin: 'DERIVED_REAL',
      provenance: { ...prov(`agents[id=${a.id}]`), generated_at },
    })),
    'source_id',
  );

  const minibots = sortById(
    botsIn.map((b) => ({
      family: NS.MINIBOT,
      source_id: b.name,
      namespaced_id: namespacedId(NS.MINIBOT, b.name),
      source_online: b.online,
      mode: b.mode,
      verified_active: false,
      live_llm: false,
      model_provider: 'NOT_PRESENT',
      online_note:
        b.online === false
          ? 'source_online=false preserved — not universal DORMANT/DEAD/DISABLED'
          : 'SOURCE_DECLARED',
      origin: 'DERIVED_REAL',
      provenance: { ...prov(`miniai[name=${b.name}]`), generated_at },
    })),
    'source_id',
  );

  const unmatched_records = [];
  for (const key of ['hygiene', 'disturbance_watch', 'super_ghost_feed', 'qosmei_core']) {
    if (status[key] && typeof status[key] === 'object') {
      unmatched_records.push({
        reason: 'NOT_TYPED_AI_IDENTITY',
        source_key: key,
        source_value: status[key],
        origin: 'DERIVED_REAL',
        provenance: { ...prov(key), generated_at },
        note: 'Retained; qosmei_core in status ≠ QOSMEI manifest consume; ≠ swarm live',
      });
    }
  }

  return {
    tower_meta: {
      status: tower.status,
      frozen: tower.frozen,
      agent_count: tower.agent_count,
      planned_rollout_only: tower.planned_rollout_only,
      tower_phase: tower.tower_phase,
      intent_surface: tower.intent_surface,
      notes: status.notes,
      generated_at,
      origin: 'DERIVED_REAL',
      provenance: { ...prov('ai_tower'), generated_at },
    },
    tower_agents,
    minibots,
    unmatched_records,
  };
}
