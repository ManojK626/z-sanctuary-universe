// mde_weighted.mjs
// Deterministic weighting overlay for recommendations.
// No randomness. No external dependencies.

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function normalizeWeights(w) {
  const keys = ['cost', 'privacy', 'durability', 'sustainability', 'freedom'];
  const vals = keys.map((k) => clamp(Number(w?.[k] ?? 5), 0, 10));
  const sum = vals.reduce((a, b) => a + b, 0) || 1;
  const norm = {};
  keys.forEach((k, i) => (norm[k] = vals[i] / sum));
  return norm;
}

/**
 * Converts a base report + profiles into a weighted score 0..100 (higher is better to switch).
 * Designed so users can "steer" priorities but still see transparent math.
 * `fromProfile` and `baseline` are accepted for future use / API stability.
 */
export function computeWeightedSwitchScore({
  baseReport,
  fromProfile,
  toProfile,
  baseline,
  inputs,
}) {
  void fromProfile;
  void baseline;
  const W = normalizeWeights(inputs?.priority_weights);

  const costDelta = Number(baseReport?.scores?.cost_delta_eur ?? 0);
  const budget = Number(inputs?.budget_eur ?? 0);

  let costScore = 70;
  if (budget > 0) {
    const ratio = costDelta / budget;
    costScore = clamp(Math.round(100 - ratio * 70), 0, 100);
  } else {
    costScore = clamp(Math.round(100 - (costDelta / 800) * 60), 0, 100);
  }

  const privacyMap = { open: 100, mixed: 65, closed: 40, unknown: 50 };
  const privacyPosture = toProfile?.metrics?.privacy_posture;
  const privacyScore = clamp(privacyMap[privacyPosture] ?? 50, 0, 100);

  const durabilityScore = clamp(
    Math.round((Number(toProfile?.metrics?.durability ?? 5) / 10) * 100),
    0,
    100
  );

  const repairability = Number(toProfile?.metrics?.repairability ?? 5);
  const supportYears = Number(toProfile?.metrics?.software_support_years ?? 4);

  const hint = baseReport?.scores?.sustainability_delta?.repair_vs_replace_hint;
  const hintPenalty = hint === 'repair_recommended' ? 30 : 0;

  let sustainabilityScore = clamp(
    Math.round((repairability / 10) * 60 + clamp(supportYears, 0, 10) * 4),
    0,
    100
  );
  sustainabilityScore = clamp(sustainabilityScore - hintPenalty, 0, 100);

  const lockIn = Number(toProfile?.metrics?.lock_in ?? 5);
  const freedomScore = clamp(Math.round(100 - (lockIn / 10) * 100), 0, 100);

  const friction = Number(baseReport?.scores?.friction_score ?? 50);
  const frictionDesirability = clamp(100 - friction, 0, 100);

  const raw =
    W.cost * costScore +
    W.privacy * privacyScore +
    W.durability * durabilityScore +
    W.sustainability * sustainabilityScore +
    W.freedom * freedomScore;

  const finalScore = clamp(
    Math.round(raw * (0.65 + 0.35 * (frictionDesirability / 100))),
    0,
    100
  );

  return {
    final_score: finalScore,
    components: {
      costScore,
      privacyScore,
      durabilityScore,
      sustainabilityScore,
      freedomScore,
      frictionDesirability,
    },
    normalized_weights: W,
  };
}

export function decideActionFromWeightedScore({ weightedScore, baseReport }) {
  const s = Number(weightedScore?.final_score ?? 50);
  const sustainHint = baseReport?.scores?.sustainability_delta?.repair_vs_replace_hint;

  if (sustainHint === 'repair_recommended' && s < 85) {
    return {
      action: 'delay_and_repair',
      confidence: 82,
      reason_codes: ['low_battery_health', 'sustainability_gain'],
    };
  }

  if (s >= 75) {
    return { action: 'switch_now', confidence: 78, reason_codes: ['lower_friction'] };
  }
  if (s >= 55) {
    return { action: 'try_refurbished', confidence: 70, reason_codes: ['budget_constraint'] };
  }
  return { action: 'stay_put', confidence: 68, reason_codes: ['high_lock_in_cost'] };
}
