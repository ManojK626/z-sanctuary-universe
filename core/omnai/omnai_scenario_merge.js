/**
 * Shallow-merge scenario fragments for chain runs (deterministic replay).
 */

/**
 * @param {Record<string, unknown>} base
 * @param {Record<string, unknown>} patch
 */
export function mergeScenarios(base, patch) {
  const b = base && typeof base === 'object' ? /** @type {Record<string, unknown>} */ ({ ...base }) : {};
  const p = patch && typeof patch === 'object' ? patch : {};

  const out = { ...b, ...p };

  if ('brains' in p) out.brains = p.brains;

  const bAnts = typeof b.ants === 'object' && b.ants !== null ? /** @type {Record<string, unknown>} */ (b.ants) : {};
  const pAnts = typeof p.ants === 'object' && p.ants !== null ? /** @type {Record<string, unknown>} */ (p.ants) : null;
  if (pAnts) out.ants = { ...bAnts, ...pAnts };

  const bPath = typeof b.pathway === 'object' && b.pathway !== null ? /** @type {Record<string, unknown>} */ (b.pathway) : {};
  const pPath = typeof p.pathway === 'object' && p.pathway !== null ? /** @type {Record<string, unknown>} */ (p.pathway) : null;
  if (pPath) out.pathway = { ...bPath, ...pPath };

  const bEnt = typeof b.entity === 'object' && b.entity !== null ? /** @type {Record<string, unknown>} */ (b.entity) : {};
  const pEnt = typeof p.entity === 'object' && p.entity !== null ? /** @type {Record<string, unknown>} */ (p.entity) : null;
  if (pEnt) out.entity = { ...bEnt, ...pEnt };

  return out;
}
