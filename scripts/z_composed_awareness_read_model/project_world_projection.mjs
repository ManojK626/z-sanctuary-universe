import { ADAPTER_VERSION, IMPLEMENTATION_VERSION, PROJECTION_ID, SCHEMA_VERSION, SOURCE_PATHS } from './constants.mjs';
import { loadCapsuleIfPath } from './capsule_adapter.mjs';
import { joinAwarenessRows } from './ecosystem_awareness_adapter.mjs';
import { adaptPcRootProjects } from './identity_adapter.mjs';

function missingList(parts) {
  return parts.filter(Boolean);
}

function composeOne(pc, join, capsule, provenanceSources) {
  const missing = [];
  const awarenessJoin = join || null;

  let capsuleBlock;
  if (!awarenessJoin) {
    missing.push({ field: 'awareness.ecosystem_row', posture: 'MISSING' });
    capsuleBlock = { posture: 'MISSING', present: 'MISSING' };
    missing.push({ field: 'awareness.capsule', posture: 'MISSING' });
  } else if (awarenessJoin.row.capsule_path === '' || awarenessJoin.row.capsule_path == null) {
    capsuleBlock = { posture: 'MISSING', present: 'MISSING' };
    missing.push({ field: 'awareness.capsule', posture: 'MISSING' });
  } else {
    capsuleBlock = capsule;
    if (capsule.posture !== 'PRESENT') {
      missing.push({ field: 'awareness.capsule', posture: capsule.posture });
    }
  }

  const source_ids = [`pc_root::${pc.source_id}`];
  const aliases = [];
  if (awarenessJoin && awarenessJoin.row.project_id !== pc.source_id) {
    source_ids.push(`ecosystem_awareness::${awarenessJoin.row.project_id}`);
    aliases.push(awarenessJoin.row.project_id);
  } else if (awarenessJoin) {
    source_ids.push(`ecosystem_awareness::${awarenessJoin.row.project_id}`);
  }

  const deployment = awarenessJoin
    ? {
        source_domain: 'PROJECT_DEPLOYMENT',
        value: awarenessJoin.row.deployment_status,
        origin: 'REAL_SOURCE',
        label: 'SOURCE_DECLARED',
        note: 'SAME WORD ≠ SAME SEMANTICS — not Z Logic HOLD/BLOCK/STOP',
      }
    : { posture: 'MISSING' };

  const maturity = capsuleBlock?.source_declared?.growth_percent
    ? {
        growth_percent: capsuleBlock.source_declared.growth_percent,
        note: 'SOURCE_DECLARED capsule field — not a global Sanctuary maturity percentage',
      }
    : { posture: 'MISSING' };

  const runtime = capsuleBlock?.source_declared?.current_signal
    ? {
        current_signal: capsuleBlock.source_declared.current_signal,
        note: 'SOURCE_DECLARED capsule health/signal — not a universal project status',
      }
    : { posture: 'MISSING' };

  const freshness = {
    pc_root_updated_at: provenanceSources.pc_root_updated_at,
    origin: provenanceSources.pc_root_updated_at ? 'REAL_SOURCE' : undefined,
    note: 'P0 preserves source timestamps only; CURRENT/AGING/STALE thresholds not canonized',
  };
  if (!provenanceSources.pc_root_updated_at) {
    freshness.posture = 'MISSING';
    delete freshness.origin;
  }

  return {
    project_id: pc.source_id,
    display_name: pc.display_name,
    origin: 'DERIVED_REAL',
    identity: {
      canonical_id: pc.source_id,
      source_ids,
      aliases,
      reconciliation_relation: pc.reconciliation,
      join_rule: awarenessJoin ? awarenessJoin.rule : 'NONE',
    },
    ecosystem: awarenessJoin
      ? {
          source: SOURCE_PATHS.ecosystem_awareness,
          identity: awarenessJoin.row.project_id,
          membership: awarenessJoin.row.project_type,
          origin: 'REAL_SOURCE',
        }
      : { posture: 'MISSING' },
    sovereignty: {
      ...pc.sovereignty,
      origin_record: 'DERIVED_REAL',
      source_value_origin: 'REAL_SOURCE',
    },
    awareness: {
      capsule: capsuleBlock,
      ecosystem_row: awarenessJoin
        ? { posture: 'PRESENT', present: 'PRESENT', source_declared: awarenessJoin.row }
        : { posture: 'MISSING', present: 'MISSING' },
    },
    maturity,
    runtime,
    deployment,
    freshness,
    provenance: {
      sources: missingList([
        { path: SOURCE_PATHS.pc_root, source_id: pc.source_id, namespace: 'pc_root' },
        awarenessJoin
          ? {
              path: SOURCE_PATHS.ecosystem_awareness,
              source_id: awarenessJoin.row.project_id,
              namespace: 'ecosystem_awareness',
              join_rule: awarenessJoin.rule,
            }
          : null,
        capsuleBlock?.source_path
          ? { path: capsuleBlock.source_path, namespace: 'awareness_capsule', sha256: capsuleBlock.sha256 }
          : null,
      ]),
    },
    missing,
    conflicts: [],
  };
}

export function projectWorldP0(root, loaded) {
  const { adapted, invalid } = adaptPcRootProjects(loaded.pc.data);
  const joinResult = joinAwarenessRows(adapted, loaded.eco.data);

  if (joinResult.ambiguous.length > 0) {
    return {
      hard_stop: 'P0_IDENTITY_AMBIGUITY_REQUIRES_STEWARD_RECONCILIATION',
      ambiguous: joinResult.ambiguous,
    };
  }

  const joinByPc = new Map(joinResult.joins.map((j) => [j.pc_root_id, j]));
  const capsuleFiles = [];
  const projects = [];

  for (const pc of adapted) {
    const join = joinByPc.get(pc.source_id);
    let capsule = { posture: 'MISSING', present: 'MISSING' };
    if (join && typeof join.row.capsule_path === 'string' && join.row.capsule_path.length > 0) {
      capsule = loadCapsuleIfPath(root, join.row.capsule_path);
      if (capsule.sha256) {
        capsuleFiles.push({ path: capsule.source_path, sha256: capsule.sha256 });
      }
    }
    const record = composeOne(pc, join, capsule, {
      pc_root_updated_at: loaded.pc.data.updated_at
        ? { value: loaded.pc.data.updated_at, origin: 'REAL_SOURCE', label: 'SOURCE_DECLARED' }
        : null,
    });
    if (join && join.rule === 'EXPLICIT_HUB_FOLDER_REGISTRY_RELATION' && pc.source_id !== join.row.project_id) {
      record.conflicts.push({
        field: 'identity.source_ids',
        source_a: { namespace: 'pc_root', source_id: pc.source_id, value: pc.source_id },
        source_b: {
          namespace: 'ecosystem_awareness',
          source_id: join.row.project_id,
          value: join.row.project_id,
        },
        resolution: 'UNRESOLVED',
        note: 'Explicit hub-folder link; identifiers are not rewritten into each other.',
      });
    }
    projects.push(record);
  }

  projects.sort((a, b) => (a.project_id < b.project_id ? -1 : a.project_id > b.project_id ? 1 : 0));

  const capsulePresent = projects.filter((p) => p.awareness.capsule.posture === 'PRESENT').length;
  const awarenessPresent = projects.filter((p) => p.awareness.ecosystem_row.posture === 'PRESENT').length;
  const sovereignty_counts = {};
  for (const p of projects) {
    const key = p.sovereignty.composed_posture;
    sovereignty_counts[key] = (sovereignty_counts[key] || 0) + 1;
  }

  const allConflicts = [
    ...joinResult.conflicts,
    ...projects.flatMap((p) => p.conflicts),
  ];
  const conflictSeen = new Set();
  const conflicts = [];
  for (const c of allConflicts) {
    const k = JSON.stringify(c);
    if (conflictSeen.has(k)) continue;
    conflictSeen.add(k);
    conflicts.push(c);
  }

  const sources = [
    { role: 'project_identity', path: SOURCE_PATHS.pc_root, sha256: loaded.pc.sha256 },
    {
      role: 'identity_reconciliation',
      path: SOURCE_PATHS.identity_reconciliation,
      sha256: loaded.identity.sha256,
    },
    { role: 'ecosystem_awareness', path: SOURCE_PATHS.ecosystem_awareness, sha256: loaded.eco.sha256 },
    ...capsuleFiles.map((c) => ({ role: 'awareness_capsule', path: c.path, sha256: c.sha256 })),
  ];

  return {
    schema_version: SCHEMA_VERSION,
    projection_id: PROJECTION_ID,
    posture: 'DERIVED_READ_MODEL',
    implementation_version: IMPLEMENTATION_VERSION,
    adapter_version: ADAPTER_VERSION,
    origin: 'DERIVED_REAL',
    ordering_rule: 'projects sorted by project_id UTF-16 code unit lexical order (pc_root source id)',
    sources,
    projects,
    unmatched_source_records: [...invalid, ...joinResult.unmatched],
    conflicts,
    summary: {
      origin: 'DERIVED',
      project_count: projects.length,
      capsule_present_count: capsulePresent,
      capsule_missing_count: projects.length - capsulePresent,
      awareness_row_present_count: awarenessPresent,
      awareness_row_missing_count: projects.length - awarenessPresent,
      sovereignty_counts,
      conflict_count: conflicts.length,
      unmatched_source_record_count: invalid.length + joinResult.unmatched.length,
      explicit_joins: joinResult.joins.length,
      ambiguous_joins: 0,
    },
  };
}
