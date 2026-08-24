function exactJoin(shardId, projectId) {
  return typeof shardId === 'string' && typeof projectId === 'string' && shardId === projectId;
}

export function uniqueProjectIds(projects) {
  const ids = projects.map((p) => p.id).filter((id) => typeof id === 'string' && id.length > 0);
  return new Set(ids).size === ids.length;
}

export function projectCoverage(pcRoot, shards) {
  const projects = Array.isArray(pcRoot?.projects) ? pcRoot.projects : [];
  if (!uniqueProjectIds(projects)) {
    return { hard_stop: 'CRYSTAL_DNA_P0_PRIMARY_PROJECT_ID_AMBIGUITY' };
  }
  const coverage = [];
  for (const p of projects) {
    const matches = shards.filter((s) => exactJoin(s.source_id, p.id));
    coverage.push({
      project_id: p.id,
      crystal_dna_presence: matches.length ? 'PRESENT' : 'MISSING',
      matching_source_records: matches.map((s) => s.namespaced_id),
      join_rule: matches.length ? 'EXACT_CANONICAL_ID' : 'NONE',
      origin: 'DERIVED_REAL',
      note: 'MISSING CRYSTAL DNA = NO VERIFIED DNA EVIDENCE ATTACHED (≠ HEALTHY ≠ UNHEALTHY ≠ GREEN)',
      provenance: { path: 'data/z_pc_root_projects.json', source_id: p.id },
    });
  }
  coverage.sort((a, b) => (a.project_id < b.project_id ? -1 : a.project_id > b.project_id ? 1 : 0));
  return { coverage };
}
