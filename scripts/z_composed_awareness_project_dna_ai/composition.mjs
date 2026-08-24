import { composeProjectWorldAndDna } from '../z_composed_awareness_project_dna/composition.mjs';
import { deepClone } from '../z_composed_awareness_project_dna/canonical_json.mjs';
import { COMPOSITION_ID, COMPOSITION_VERSION, SCHEMA_VERSION } from './constants.mjs';
import { deriveCrossLensConflicts } from './conflict_channel.mjs';
import { gateChildVersions } from './version_gate.mjs';

function attachAiLens(ai) {
  return {
    projection_id: ai.projection_id,
    schema_version: ai.schema_version,
    projection_version: ai.projection_version,
    adapter_version: ai.adapter_version,
    posture: ai.posture,
    origin: ai.origin,
    ecosphere_rings: deepClone(ai.ecosphere_rings || []),
    tower_agents: deepClone(ai.tower_agents || []),
    minibots: deepClone(ai.minibots || []),
    advisory_ledger: deepClone(ai.advisory_ledger || {}),
    runtime_evidence: deepClone(ai.runtime_evidence || []),
    project_associations: deepClone(ai.project_associations || []),
    model_provider_evidence: ai.model_provider_evidence,
    sources: deepClone(ai.sources || []),
    summary: deepClone(ai.summary || {}),
  };
}

export function composeProjectDnaAi(projectWorld, crystalDna, aiEcosphere, inputMeta) {
  const gated = gateChildVersions(projectWorld, crystalDna, aiEcosphere);
  if (!gated.ok) return gated;

  const twoMeta = (inputMeta && inputMeta.two_lens_input) || {};
  const twoLens = composeProjectWorldAndDna(projectWorld, crystalDna, twoMeta);
  if (twoLens.hard_stop) return twoLens;

  const ai = deepClone(aiEcosphere);
  const claims = (inputMeta && inputMeta.comparable_cross_lens_claims) || [];
  const cross_lens_conflicts = deriveCrossLensConflicts(claims);

  const aiConflicts = deepClone(ai.conflicts || []);
  const unmatched = deepClone(ai.unmatched_records || []);

  const verifiedActive =
    typeof ai.summary?.verified_active_runtime_count === 'number'
      ? ai.summary.verified_active_runtime_count
      : (ai.runtime_evidence || []).filter((r) => r.verified_active === true).length;

  const assocCount =
    typeof ai.summary?.verified_project_association_count === 'number'
      ? ai.summary.verified_project_association_count
      : (ai.project_associations || []).length;

  return {
    schema_version: SCHEMA_VERSION,
    composition_id: COMPOSITION_ID,
    composition_version: COMPOSITION_VERSION,
    posture: 'DERIVED_COMPOSITION',
    origin: 'DERIVED',
    inputs: inputMeta || {},
    project_world: twoLens.project_world,
    crystal_dna_lens: twoLens.crystal_dna_lens,
    ai_ecosphere_lens: attachAiLens(ai),
    project_dna_coverage: twoLens.project_dna_coverage,
    project_dna_verified_links: twoLens.cross_lens_links,
    cross_lens_relationships: [],
    relationship_counts: {
      project_dna_verified: twoLens.cross_lens_links.length,
      ai_project_verified: assocCount,
      ai_dna_verified: 0,
      ai_dna_family: 'UNDEFINED',
    },
    lens_conflicts: {
      project_world: deepClone(twoLens.project_world.conflicts || []),
      crystal_dna: deepClone(crystalDna.conflicts || []),
      ai_ecosphere: aiConflicts,
    },
    cross_lens_conflicts,
    unmatched: {
      ai_ecosphere: unmatched,
    },
    governance: deepClone(twoLens.governance),
    summary: {
      origin: 'DERIVED',
      project_count: twoLens.summary.project_count,
      dna_shard_count: twoLens.summary.dna_shard_count,
      dna_dependency_count: twoLens.summary.dna_dependency_count,
      dna_drift_finding_count: twoLens.summary.dna_drift_finding_count,
      project_dna_verified_link_count: twoLens.summary.verified_project_dna_link_count,
      project_dna_coverage_row_count: twoLens.summary.coverage_row_count,
      ai_ring_count: (ai.ecosphere_rings || []).length,
      ai_tower_agent_count: (ai.tower_agents || []).length,
      ai_minibot_count: (ai.minibots || []).length,
      ai_ledger_entry_count: (ai.advisory_ledger?.entries || []).length,
      ai_verified_active_runtime_count: verifiedActive,
      ai_project_verified_association_count: assocCount,
      ai_internal_conflict_count: aiConflicts.length,
      ai_unmatched_record_count: unmatched.length,
      cross_lens_conflict_count: cross_lens_conflicts.length,
      ai_dna_verified_relationship_count: 0,
    },
  };
}
