/**
 * Octo-Ant overseer evaluations (§05) — boolean checks + advisory remediation text.
 */

/**
 * @typedef {{
 *   reasoningDagCycles?: number,
 *   ingestIntegrityOk?: boolean,
 *   secretsDetected?: boolean,
 *   ciGreen?: boolean,
 *   formulaStable?: boolean,
 *   pathwayDiverging?: boolean,
 *   hiveSkewPct?: number,
 *   recursionDepth?: number,
 *   recursionLimit?: number,
 * }} AntSnapshot
 */

/**
 * Evaluate all ants; any hard fail aggregates to veto_recommended true (simulation semantics).
 * @param {AntSnapshot} s
 */
export function evaluateAnts(s = {}) {
  const depth = Number(s.recursionDepth ?? 0);
  const limit = Number(s.recursionLimit ?? 64);
  const skew = Number(s.hiveSkewPct ?? 0);
  const cycles = Number(s.reasoningDagCycles ?? 0);

  const ants = [
    {
      ant: 'ANT-1',
      ok: cycles < 1000,
      detail: cycles >= 1000 ? 'reasoning_dag_large' : 'ok',
      action: cycles >= 1000 ? 'replan_strip_branches' : null,
    },
    {
      ant: 'ANT-2',
      ok: !!s.ingestIntegrityOk,
      detail: !s.ingestIntegrityOk ? 'ingest_blocked' : 'ok',
      action: !s.ingestIntegrityOk ? 'quarantine_batch' : null,
    },
    {
      ant: 'ANT-3',
      ok: !s.secretsDetected,
      detail: s.secretsDetected ? 'secrets_pattern' : 'ok',
      action: s.secretsDetected ? 'block_merge_candidate' : null,
    },
    {
      ant: 'ANT-4',
      ok: !!s.ciGreen,
      detail: !s.ciGreen ? 'ci_not_green' : 'ok',
      action: !s.ciGreen ? 'freeze_deploy_lane' : null,
    },
    {
      ant: 'ANT-5',
      ok: !!s.formulaStable,
      detail: !s.formulaStable ? 'formula_instability_signal' : 'ok',
      action: !s.formulaStable ? 'rollback_formula_tier_advisory' : null,
    },
    {
      ant: 'ANT-6',
      ok: !s.pathwayDiverging,
      detail: s.pathwayDiverging ? 'route_diverge' : 'ok',
      action: s.pathwayDiverging ? 'recompute_argmax_route' : null,
    },
    {
      ant: 'ANT-7',
      ok: skew < 25,
      detail: skew >= 25 ? 'hive_skew' : 'ok',
      action: skew >= 25 ? 'resync_pulse' : null,
    },
    {
      ant: 'ANT-8',
      ok: depth < limit,
      detail: depth >= limit ? 'recursion_near_limit' : 'ok',
      action: depth >= limit ? 'hard_stop_snapshot_advisory' : null,
    },
  ];

  const failed = ants.filter((a) => !a.ok);
  return {
    ants,
    all_ok: failed.length === 0,
    veto_recommended: failed.some((f) =>
      ['ANT-3', 'ANT-8', 'ANT-4'].includes(f.ant)),
    posture: failed.length === 0 ? 'GREEN' : failed.length < 4 ? 'YELLOW' : 'RED_REVIEW',
  };
}
