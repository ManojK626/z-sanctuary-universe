import { ADAPTER_VERSION, IMPLEMENTATION_VERSION, PROJECTION_ID, SCHEMA_VERSION, SOURCE_PATHS } from './constants.mjs';
import { adaptDrift } from './drift_adapter.mjs';
import { adaptDependencies, adaptManifest } from './manifest_adapter.mjs';
import { projectCoverage } from './project_coverage.mjs';

export function projectCrystalDnaP0(loaded) {
  const adapted = adaptManifest(loaded.manifest.data);
  if (adapted.hard_stop) return adapted;
  const dependencies = adaptDependencies(loaded.manifest.data, adapted.shard_id_set);
  const drift = adaptDrift(loaded.drift.data);
  const cov = projectCoverage(loaded.pc_root.data, adapted.shards);
  if (cov.hard_stop) return cov;

  const status_counts = {};
  for (const s of adapted.shards) {
    const k = s.status.value;
    status_counts[k] = (status_counts[k] || 0) + 1;
  }

  const present = cov.coverage.filter((c) => c.crystal_dna_presence === 'PRESENT').length;
  const resolved = dependencies.filter((d) => d.resolution === 'RESOLVED').length;

  return {
    schema_version: SCHEMA_VERSION,
    projection_id: PROJECTION_ID,
    posture: 'DERIVED_READ_MODEL',
    origin: 'DERIVED_REAL',
    implementation_version: IMPLEMENTATION_VERSION,
    adapter_version: ADAPTER_VERSION,
    ordering_rule:
      'shards by source_id; dependencies by from then to; coverage by project_id; drift findings by code+refs+message (UTF-16 lexical)',
    sources: [
      { role: 'dna_manifest', path: SOURCE_PATHS.manifest, sha256: loaded.manifest.sha256 },
      { role: 'drift_report', path: SOURCE_PATHS.drift, sha256: loaded.drift.sha256 },
      { role: 'pc_root_coverage_only', path: SOURCE_PATHS.pc_root, sha256: loaded.pc_root.sha256 },
    ],
    shards: adapted.shards,
    dependencies,
    drift,
    project_coverage: cov.coverage,
    unmatched_as_projects: adapted.shards.map((s) => ({
      source_id: s.source_id,
      classification: 'NON_PROJECT_ASSET',
      origin: 'DERIVED',
    })),
    conflicts: [],
    summary: {
      origin: 'DERIVED',
      shard_count: adapted.shards.length,
      dependency_edge_count: dependencies.length,
      resolved_dependency_count: resolved,
      unresolved_dependency_count: dependencies.length - resolved,
      drift_finding_count: drift.findings.length,
      project_exact_join_count: present,
      project_alias_join_count: 0,
      project_missing_count: cov.coverage.length - present,
      project_ambiguous_count: 0,
      status_counts,
    },
  };
}
