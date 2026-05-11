/**
 * AI entity lane permissions (§06) — static policy table for simulation.
 */

/** @typedef {'MASTER'|'SHADOW'|'GHOST'|'ASSISTANT'|'MINIBOT'} LaneId */

/** @type {Partial<Record<LaneId, string[]>>} */
const DEFAULT_FORBIDDEN = {
  SHADOW: ['customer_data_export_live'],
  GHOST: ['production_mutation', 'billing_change'],
  ASSISTANT: ['cross_tenant_memory_write'],
  MINIBOT: ['iam_wide_change'],
  MASTER: [],
};

/**
 * Whether the lane may perform action (forbidden wins).
 * @param {string} lane
 * @param {string} action
 * @param {Partial<Record<LaneId, string[]>>} [forbiddenOverrides]
 */
export function canPerformAction(lane, action, forbiddenOverrides) {
  const L = /** @type {LaneId | 'UNKNOWN'} */ (String(lane || 'UNKNOWN').toUpperCase());
  const act = String(action || '');
  const table = forbiddenOverrides ? { ...DEFAULT_FORBIDDEN, ...forbiddenOverrides } : DEFAULT_FORBIDDEN;

  /** @type {LaneId[]} */
  const known = ['MASTER', 'SHADOW', 'GHOST', 'ASSISTANT', 'MINIBOT'];
  const laneIsKnown = /** @type {LaneId[]} */ (known).includes(/** @type {LaneId} */ (L));
  const forb = laneIsKnown ? table[/** @type {LaneId} */ (L)] ?? [] : ['unknown_lane_default_deny'];

  const blocked = forb.includes(act);
  return {
    lane: L,
    action: act,
    allowed: !blocked && laneIsKnown,
    reason: blocked ? 'policy_forbid' : !laneIsKnown ? 'lane_unknown' : 'ok',
  };
}
