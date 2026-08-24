const CARD_FIELDS = [
  'id',
  'type',
  'path',
  'owner_layer',
  'dependencies',
  'hash_optional',
  'rebuild_rule',
  'risk',
  'status',
];

export function adaptManifest(manifest) {
  const shardsIn = Array.isArray(manifest?.shards) ? manifest.shards : [];
  const ids = [];
  const shards = [];
  for (const raw of shardsIn) {
    if (!raw || typeof raw.id !== 'string' || raw.id.length === 0) {
      return { hard_stop: 'CRYSTAL_DNA_P0_DUPLICATE_SHARD_ID', reason: 'SOURCE_ID_MISSING' };
    }
    ids.push(raw.id);
    const source_declared = {};
    for (const key of CARD_FIELDS) {
      if (Object.prototype.hasOwnProperty.call(raw, key)) {
        source_declared[key] = { value: raw[key], origin: 'REAL_SOURCE', label: 'SOURCE_DECLARED' };
      } else {
        source_declared[key] = { posture: 'MISSING' };
      }
    }
    shards.push({
      source_namespace: 'crystal_dna_manifest',
      source_id: raw.id,
      namespaced_id: `crystal_dna_manifest::${raw.id}`,
      origin: 'DERIVED_REAL',
      join_as_project: 'NON_PROJECT_ASSET',
      status: {
        namespace: 'CRYSTAL_DNA_CARD',
        value: raw.status,
        origin: 'REAL_SOURCE',
        note: 'CRYSTAL_DNA_CARD GREEN ≠ CURRENT / project health / deploy / GARE eligibility',
      },
      rebuild_rule: {
        value: raw.rebuild_rule,
        origin: 'REAL_SOURCE',
        posture: 'DECLARATIVE_RECOVERY_HINT',
        note: 'rebuild_rule ≠ PRE-AUTHORIZED GARE REPAIR RECIPE; not executed',
      },
      source_declared,
      provenance: {
        path: 'data/z_crystal_dna_asset_manifest.json',
        source_id: raw.id,
      },
    });
  }
  if (new Set(ids).size !== ids.length) {
    return { hard_stop: 'CRYSTAL_DNA_P0_DUPLICATE_SHARD_ID' };
  }
  shards.sort((a, b) => (a.source_id < b.source_id ? -1 : a.source_id > b.source_id ? 1 : 0));
  return { shards, shard_id_set: new Set(ids) };
}

export function adaptDependencies(manifest, shardIds) {
  const shardsIn = Array.isArray(manifest?.shards) ? manifest.shards : [];
  const edges = [];
  for (const raw of shardsIn) {
    const deps = Array.isArray(raw.dependencies) ? raw.dependencies : [];
    for (const to of deps) {
      edges.push({
        from_shard: raw.id,
        to_shard: to,
        source: 'data/z_crystal_dna_asset_manifest.json#shards[].dependencies',
        direction: 'DEPENDS_ON',
        resolution: shardIds.has(to) ? 'RESOLVED' : 'UNRESOLVED',
        origin: 'DERIVED_REAL',
        note: 'DEPENDENCY ≠ OWNERSHIP',
      });
    }
  }
  edges.sort((a, b) => {
    if (a.from_shard !== b.from_shard) return a.from_shard < b.from_shard ? -1 : 1;
    return a.to_shard < b.to_shard ? -1 : a.to_shard > b.to_shard ? 1 : 0;
  });
  return edges;
}
