import { SEALED_IDENTITY_FACTS } from './constants.mjs';

const OVERLAY_BY_ROLE = {
  hub: { composed_posture: 'INTERNAL', mapping_rule: 'spec overlay: pc_root.role hub → INTERNAL' },
  member: { composed_posture: 'MEMBER', mapping_rule: 'spec overlay: pc_root.role member → MEMBER' },
};

function overlayForRow(row) {
  const role = row.role;
  if (OVERLAY_BY_ROLE[role]) {
    return {
      source_posture: role,
      composed_posture: OVERLAY_BY_ROLE[role].composed_posture,
      mapping_rule: OVERLAY_BY_ROLE[role].mapping_rule,
      source_reference: 'data/z_pc_root_projects.json#projects[].role',
    };
  }
  if (role === 'external') {
    const hosting = row.hosting;
    const composed =
      row.id === 'replit-roulette-z-amk-goku-mdcp'
        ? 'SEPARATE'
        : 'EXTERNAL_LINKED';
    return {
      source_posture: role,
      hosting: hosting === undefined ? { posture: 'MISSING' } : hosting,
      composed_posture: composed,
      mapping_rule:
        composed === 'SEPARATE'
          ? 'sealed identity: replit-roulette-z-amk-goku-mdcp SEPARATE_PROJECT / sovereign product — not hub internal'
          : 'spec overlay: pc_root.role external → EXTERNAL_LINKED (CONNECTED ≠ MERGED)',
      source_reference: 'data/z_pc_root_projects.json#projects[].role',
    };
  }
  return {
    source_posture: role === undefined ? { posture: 'MISSING' } : role,
    composed_posture: 'UNKNOWN',
    mapping_rule: 'no explicit overlay for this pc_root.role',
    source_reference: 'data/z_pc_root_projects.json#projects[].role',
  };
}

export function adaptPcRootProjects(pcRoot) {
  const rows = Array.isArray(pcRoot?.projects) ? pcRoot.projects : [];
  const adapted = [];
  const invalid = [];
  for (const row of rows) {
    if (!row || typeof row.id !== 'string' || row.id.length === 0) {
      invalid.push({ source: 'pc_root', reason: 'SOURCE_ID_MISSING' });
      continue;
    }
    const fact = SEALED_IDENTITY_FACTS[row.id];
    adapted.push({
      source_namespace: 'pc_root',
      source_id: row.id,
      display_name: typeof row.name === 'string' ? row.name : { posture: 'MISSING' },
      path: Object.prototype.hasOwnProperty.call(row, 'path') ? row.path : { posture: 'MISSING' },
      sovereignty: overlayForRow(row),
      reconciliation: fact
        ? {
            identity_relation: fact.identity_relation,
            vs: fact.vs,
            note: fact.note,
            origin: 'REAL_SOURCE',
            source_path: 'docs/PROJECT_IDENTITY_RECONCILIATION.md',
          }
        : { posture: 'NOT_APPLICABLE', origin: 'DERIVED_REAL' },
      raw_role: row.role,
      hosting: Object.prototype.hasOwnProperty.call(row, 'hosting') ? row.hosting : { posture: 'NOT_APPLICABLE' },
    });
  }
  return { adapted, invalid };
}
