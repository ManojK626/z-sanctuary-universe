export function uniqueRequiredIds(ids, missingCode, duplicateCode) {
  const missing = ids.filter((id) => typeof id !== 'string' || id.length === 0);
  if (missing.length) return { hard_stop: missingCode };
  if (new Set(ids).size !== ids.length) return { hard_stop: duplicateCode };
  return { ok: true };
}

export function namespacedId(ns, id) {
  return `${ns}::${id}`;
}

export function sortById(list, key) {
  return [...list].sort((a, b) => (a[key] < b[key] ? -1 : a[key] > b[key] ? 1 : 0));
}

export function conflictRecord({ entity_ref, semantic_field, claims, source_refs }) {
  return {
    entity_ref,
    semantic_field,
    claims,
    source_refs,
    posture: 'UNRESOLVED',
    origin: 'DERIVED_REAL',
    note: 'SAME-FIELD CONFLICT — no auto-winner',
  };
}
