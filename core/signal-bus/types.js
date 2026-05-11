// Z: core/signal-bus/types.js
/**
 * @typedef {'info' | 'warn' | 'critical'} Severity
 * @typedef {'Z-OCTAVE'} ProductId
 * @typedef {'PRODUCT_READINESS' | 'ETHICS_FLAG' | 'PILOT_METRIC' | 'STOP_GATE'} SignalKind
 *
 * @typedef {Object} ProductReadiness
 * @property {'PRODUCT_READINESS'} kind
 * @property {ProductId} product
 * @property {'red' | 'amber' | 'green'} readiness
 * @property {string} reason
 * @property {string} timestamp
 *
 * @typedef {Object} EthicsFlag
 * @property {'ETHICS_FLAG'} kind
 * @property {ProductId} product
 * @property {Severity} severity
 * @property {'claims'|'privacy'|'safety'|'consent'|'kids'|'ngo'|'manufacturing'} tag
 * @property {string} message
 * @property {string} timestamp
 *
 * @typedef {Object} PilotMetric
 * @property {'PILOT_METRIC'} kind
 * @property {ProductId} product
 * @property {'personal'|'school'|'ngo'} track
 * @property {'would_use_again'|'comfort_change'|'exit_reason'|'durability_flag'} metric
 * @property {number|string} value
 * @property {string} timestamp
 *
 * @typedef {Object} StopGate
 * @property {'STOP_GATE'} kind
 * @property {ProductId} product
 * @property {'SKK'|'RKPK'} gate
 * @property {'PASS'|'BLOCK'} state
 * @property {string} reason
 * @property {string} timestamp
 *
 * @typedef {ProductReadiness|EthicsFlag|PilotMetric|StopGate} SanctuarySignal
 */
