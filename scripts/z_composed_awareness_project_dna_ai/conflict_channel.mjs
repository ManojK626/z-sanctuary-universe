/**
 * Cross-lens conflict channel. Accepts already-resolved comparable claims only.
 * Does not match identities, names, paths, or scores.
 */
function claimProvenanceOk(claim) {
  return Boolean(claim && claim.provenance && typeof claim.provenance === 'object');
}

function valuesIncompatible(a, b) {
  return JSON.stringify(a) !== JSON.stringify(b);
}

function sortConflicts(list) {
  return [...list].sort((x, y) => {
    if (x.entity_ref !== y.entity_ref) return x.entity_ref < y.entity_ref ? -1 : 1;
    if (x.semantic_field !== y.semantic_field) return x.semantic_field < y.semantic_field ? -1 : 1;
    return x.conflict_id < y.conflict_id ? -1 : x.conflict_id > y.conflict_id ? 1 : 0;
  });
}

/**
 * @param {Array<{ entity_ref: string, semantic_field: string, claims: Array<{ lens: string, value: unknown, provenance: object }> }>} comparableClaims
 */
export function deriveCrossLensConflicts(comparableClaims) {
  const out = [];
  for (const group of comparableClaims || []) {
    const entity_ref = group && group.entity_ref;
    const semantic_field = group && group.semantic_field;
    const claims = Array.isArray(group && group.claims) ? group.claims : [];
    if (typeof entity_ref !== 'string' || entity_ref.length === 0) continue;
    if (typeof semantic_field !== 'string' || semantic_field.length === 0) continue;
    if (claims.length < 2) continue;
    if (!claims.every(claimProvenanceOk)) continue;
    const lenses = new Set(claims.map((c) => c.lens).filter((l) => typeof l === 'string' && l.length > 0));
    if (lenses.size < 2) continue;
    let incompatible = false;
    for (let i = 0; i < claims.length; i += 1) {
      for (let j = i + 1; j < claims.length; j += 1) {
        if (valuesIncompatible(claims[i].value, claims[j].value)) incompatible = true;
      }
    }
    if (!incompatible) continue;
    out.push({
      conflict_id: `xlc:${entity_ref}:${semantic_field}`,
      semantic_field,
      entity_refs: [entity_ref],
      claims: claims.map((c) => ({
        lens: c.lens,
        value: c.value,
        provenance: c.provenance,
      })),
      lens_refs: [...lenses].sort(),
      provenance: claims.map((c) => c.provenance),
      posture: 'UNRESOLVED',
      origin: 'DERIVED_FROM_COMPARABLE_EXPLICIT_CLAIMS',
    });
  }
  return sortConflicts(out);
}
