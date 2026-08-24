import { composeCoverage, uniqueIds } from './coverage_composer.mjs';
import { deepClone } from './canonical_json.mjs';
import { COMPOSITION_ID, COMPOSITION_VERSION, HUB_REGISTRY_SHARD, SCHEMA_VERSION } from './constants.mjs';

/** Exact canonical ID only. No case-fold, path, owner_layer, or substring. */
export function extractExactIdLinks(projects, shards) {
  const links = [];
  for (const shard of shards) {
    const sid = shard.source_id;
    if (typeof sid !== 'string' || sid.length === 0) continue;
    for (const p of projects) {
      if (p.project_id === sid) {
        links.push({
          project_id: p.project_id,
          shard_id: sid,
          relation: 'EXACT_CANONICAL_ID',
          origin: 'DERIVED',
          provenance: {
            composition: COMPOSITION_ID,
            rule: 'exact project_id === shard.source_id',
            project_ref: p.project_id,
            shard_ref: sid,
          },
        });
      }
    }
  }
  links.sort((a, b) => {
    if (a.project_id !== b.project_id) return a.project_id < b.project_id ? -1 : 1;
    return a.shard_id < b.shard_id ? -1 : a.shard_id > b.shard_id ? 1 : 0;
  });
  return links;
}

/** Ambiguous candidate: more than one project_id for one shard → no winner. */
export function resolveExplicitLinkCandidates(candidates) {
  const links = [];
  const conflicts = [];
  for (const c of candidates || []) {
    const ids = Array.isArray(c.project_ids) ? c.project_ids : [];
    if (ids.length === 1 && typeof c.shard_id === 'string') {
      links.push({
        project_id: ids[0],
        shard_id: c.shard_id,
        relation: 'EXPLICIT_CANDIDATE',
        origin: 'DERIVED',
        provenance: { composition: COMPOSITION_ID, rule: 'single explicit candidate' },
      });
    } else {
      conflicts.push({
        kind: 'COMPOSITION_CONFLICT',
        reason: 'AMBIGUOUS_CROSS_LENS_CANDIDATE',
        shard_id: c.shard_id,
        project_ids: ids,
        resolution: 'NO_LINK',
        origin: 'DERIVED',
      });
    }
  }
  return { links, conflicts };
}

export function composeProjectWorldAndDna(projectWorld, crystalDna, inputMeta) {
  const pw = deepClone(projectWorld);
  const dna = deepClone(crystalDna);
  const projects = Array.isArray(pw.projects) ? pw.projects : [];
  const shards = Array.isArray(dna.shards) ? dna.shards : [];
  const shardIds = shards.map((s) => s.source_id);
  const miss = uniqueIds(shardIds, 'COMPOSITION_MISSING_SHARD_ID', 'COMPOSITION_DUPLICATE_SHARD_ID');
  if (miss.hard_stop) return miss;
  const pid = uniqueIds(
    projects.map((p) => p.project_id),
    'COMPOSITION_MISSING_PROJECT_ID',
    'COMPOSITION_DUPLICATE_PROJECT_ID',
  );
  if (pid.hard_stop) return pid;

  const links = extractExactIdLinks(projects, shards);
  const cov = composeCoverage(projects, dna.project_coverage || [], links);
  if (cov.hard_stop) return cov;

  const hubLinks = links.filter((l) => l.shard_id === HUB_REGISTRY_SHARD);
  if (hubLinks.length) {
    return { hard_stop: 'HUB_REGISTRY_SHARD_PROJECT_JOIN_FORBIDDEN', links: hubLinks };
  }

  const present = cov.coverage.filter((c) => c.verified_link_count > 0).length;
  const unmatchedShards = shards.filter((s) => !links.some((l) => l.shard_id === s.source_id));

  return {
    schema_version: SCHEMA_VERSION,
    composition_id: COMPOSITION_ID,
    composition_version: COMPOSITION_VERSION,
    posture: 'DERIVED_COMPOSITION',
    origin: 'DERIVED',
    inputs: inputMeta || {},
    project_world: {
      projection_id: pw.projection_id,
      implementation_version: pw.implementation_version,
      projects: deepClone(projects),
      conflicts: deepClone(pw.conflicts || []),
      unmatched_source_records: deepClone(pw.unmatched_source_records || []),
      summary: deepClone(pw.summary || {}),
    },
    crystal_dna_lens: {
      projection_id: dna.projection_id,
      implementation_version: dna.implementation_version,
      shards: deepClone(shards),
      dependencies: deepClone(dna.dependencies || []),
      drift: deepClone(dna.drift || {}),
      unmatched_as_projects: deepClone(dna.unmatched_as_projects || []),
    },
    project_dna_coverage: cov.coverage,
    cross_lens_links: links,
    conflicts: [],
    governance: {
      gare: {
        policy: 'POLICY_DEFINED',
        executor: 'NOT_IMPLEMENTED',
        asset_level_eligibility: 'UNDECLARED',
        note: 'GARE policy ≠ asset eligibility; rebuild_rule remains DECLARATIVE_RECOVERY_HINT',
      },
    },
    summary: {
      origin: 'DERIVED',
      project_count: projects.length,
      dna_shard_count: shards.length,
      dna_dependency_count: (dna.dependencies || []).length,
      dna_drift_finding_count: (dna.drift?.findings || []).length,
      verified_project_dna_link_count: links.length,
      projects_with_dna_count: present,
      projects_missing_dna_count: projects.length - present,
      dna_assets_without_project_join_count: unmatchedShards.length,
      cross_lens_conflict_count: 0,
      coverage_row_count: cov.coverage.length,
    },
  };
}
