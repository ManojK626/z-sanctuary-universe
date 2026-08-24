import { tryExactJoin, tryHubFolderJoin } from './identity_match.mjs';

function declaredRow(row) {
  return {
    project_id: row.project_id,
    display_name: row.display_name,
    project_type: row.project_type,
    capsule_path: row.capsule_path,
    deployment_status: row.deployment_status,
    cloudflare_status: row.cloudflare_status,
    owner_or_steward: row.owner_or_steward,
    autonomy_level: row.autonomy_level,
    known_hold_reason: row.known_hold_reason,
    origin: 'REAL_SOURCE',
    label: 'SOURCE_DECLARED',
  };
}

export function joinAwarenessRows(pcAdapted, ecoRegistry) {
  const rows = Array.isArray(ecoRegistry?.projects) ? ecoRegistry.projects : [];
  const used = new Set();
  const joins = [];
  const conflicts = [];
  const ambiguous = [];

  for (const pc of pcAdapted) {
    const exactHits = [];
    const hubHits = [];
    for (let i = 0; i < rows.length; i += 1) {
      const row = rows[i];
      if (!row || typeof row.project_id !== 'string') continue;
      if (tryExactJoin(pc.source_id, row.project_id).matched) exactHits.push(i);
      if (tryHubFolderJoin({ role: pc.raw_role, path: pc.path, id: pc.source_id }, ecoRegistry, row).matched) {
        hubHits.push(i);
      }
    }
    const hitSet = [...new Set([...exactHits, ...hubHits])];
    if (hitSet.length > 1) {
      ambiguous.push({
        pc_root_id: pc.source_id,
        awareness_indexes: hitSet,
        reason: 'IDENTITY_AMBIGUOUS',
      });
      continue;
    }
    if (hitSet.length === 1) {
      const idx = hitSet[0];
      used.add(idx);
      const row = rows[idx];
      const rule = exactHits.includes(idx) ? 'EXACT_CANONICAL_ID' : 'EXPLICIT_HUB_FOLDER_REGISTRY_RELATION';
      if (rule === 'EXPLICIT_HUB_FOLDER_REGISTRY_RELATION' && pc.source_id !== row.project_id) {
        conflicts.push({
          field: 'identity.source_ids',
          source_a: { namespace: 'pc_root', source_id: pc.source_id, value: pc.source_id },
          source_b: { namespace: 'ecosystem_awareness', source_id: row.project_id, value: row.project_id },
          resolution: 'UNRESOLVED',
          note: 'Explicit hub-folder link; identifiers are not rewritten into each other.',
        });
      }
      joins.push({
        pc_root_id: pc.source_id,
        awareness_index: idx,
        rule,
        row: declaredRow(row),
      });
    }
  }

  const unmatched = [];
  for (let i = 0; i < rows.length; i += 1) {
    const row = rows[i];
    if (used.has(i)) continue;
    if (!row || typeof row.project_id !== 'string' || row.project_id.length === 0) {
      unmatched.push({ source: 'ecosystem_awareness', source_id: null, reason: 'SOURCE_ID_MISSING' });
      continue;
    }
    unmatched.push({
      source: 'ecosystem_awareness',
      source_id: row.project_id,
      reason: 'NO_EXPLICIT_IDENTITY_MATCH',
      display_name: row.display_name,
      capsule_path: row.capsule_path,
    });
  }

  return { joins, unmatched, conflicts, ambiguous };
}
