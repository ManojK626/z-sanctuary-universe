import { NS, SOURCE_PATHS } from './constants.mjs';
import { namespacedId, sortById, uniqueRequiredIds } from './identity.mjs';

export function adaptConfig(config) {
  const ringsIn = Array.isArray(config?.rings) ? config.rings : [];
  const ids = ringsIn.map((r) => r?.id);
  const uniq = uniqueRequiredIds(ids, 'AI_ECOSPHERE_P0_MISSING_AI_ID', 'AI_ECOSPHERE_P0_DUPLICATE_AI_ID');
  if (uniq.hard_stop) return uniq;

  const rings = sortById(
    ringsIn.map((r) => ({
      family: NS.RING,
      source_id: r.id,
      namespaced_id: namespacedId(NS.RING, r.id),
      label: r.label,
      registration: {
        source_namespace: 'AI_ECOSPHERE_CONFIG',
        source_value: 'DECLARED_IN_CONFIG',
        note: 'DECLARED_IN_CONFIG ≠ ACTIVE',
      },
      origin: 'DERIVED_REAL',
      provenance: {
        path: SOURCE_PATHS.config,
        source_record: `rings[id=${r.id}]`,
        source_namespace: 'AI_ECOSPHERE_CONFIG',
        origin: 'REAL_SOURCE',
      },
    })),
    'source_id',
  );

  return {
    rings,
    actor_classes: Array.isArray(config.actor_classes) ? [...config.actor_classes] : [],
    purpose: config.purpose,
    schema_version: config.schema_version,
  };
}
