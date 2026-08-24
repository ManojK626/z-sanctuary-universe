/**
 * Cross-lens coverage alignment (exact project ID only).
 * Coverage ≠ verified shard↔project link.
 */
export function uniqueIds(ids, missingCode, duplicateCode) {
  const missing = ids.filter((id) => typeof id !== 'string' || id.length === 0);
  if (missing.length) return { hard_stop: missingCode };
  if (new Set(ids).size !== ids.length) return { hard_stop: duplicateCode };
  return { ok: true };
}

export function composeCoverage(projects, dnaCoverage, links) {
  const pwIds = projects.map((p) => p.project_id);
  const dnaIds = dnaCoverage.map((c) => c.project_id);
  const u1 = uniqueIds(pwIds, 'COMPOSITION_MISSING_PROJECT_ID', 'COMPOSITION_DUPLICATE_PROJECT_ID');
  if (u1.hard_stop) return u1;
  const u2 = uniqueIds(dnaIds, 'COMPOSITION_MISSING_PROJECT_ID', 'COMPOSITION_DUPLICATE_PROJECT_ID');
  if (u2.hard_stop) return u2;
  const a = [...pwIds].sort();
  const b = [...dnaIds].sort();
  if (JSON.stringify(a) !== JSON.stringify(b)) {
    return { hard_stop: 'PROJECT_DNA_COVERAGE_ID_SET_MISMATCH' };
  }
  const byCov = Object.fromEntries(dnaCoverage.map((c) => [c.project_id, c]));
  const coverage = [];
  for (const p of projects) {
    const cov = byCov[p.project_id];
    const verified = links.filter((l) => l.project_id === p.project_id);
    coverage.push({
      project_id: p.project_id,
      dna_presence: cov.crystal_dna_presence,
      verified_link_count: verified.length,
      verified_links: verified.map((l) => l.shard_id),
      evidence_refs: [
        { role: 'project_world_project', project_id: p.project_id },
        {
          role: 'crystal_dna_coverage',
          project_id: p.project_id,
          path: cov.provenance?.path || 'data/z_pc_root_projects.json',
        },
      ],
      origin: 'DERIVED',
      note: 'COVERAGE ALIGNMENT ≠ DNA SHARD LINK. MISSING = NO VERIFIED PROJECT↔DNA RELATION (≠ HEALTHY ≠ UNHEALTHY)',
    });
  }
  coverage.sort((x, y) => (x.project_id < y.project_id ? -1 : x.project_id > y.project_id ? 1 : 0));
  return { coverage };
}
