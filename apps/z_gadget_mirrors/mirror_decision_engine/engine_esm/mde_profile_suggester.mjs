export function suggestProfile({ reports }) {
  if (!reports?.length) {
    return {
      suggestion: null,
      confidence: 50,
      reasons: ['No usage history yet.'],
      metrics: null,
    };
  }

  const recent = reports.slice(0, 30);
  const avg = (arr) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0);

  const costDeltas = recent
    .map((r) => Number(r?.scores?.cost_delta_eur))
    .filter((n) => Number.isFinite(n));
  const frictions = recent
    .map((r) => Number(r?.scores?.friction_score))
    .filter((n) => Number.isFinite(n));

  const repairRate =
    recent.filter((r) => r?.scores?.sustainability_delta?.repair_vs_replace_hint === 'repair_recommended')
      .length / recent.length;
  const lockInRate =
    recent.filter((r) => (r?.recommendation?.reason_codes || []).includes('high_lock_in_cost')).length /
    recent.length;
  const sustainabilityRate =
    recent.filter((r) => (r?.recommendation?.reason_codes || []).includes('sustainability_gain')).length /
    recent.length;

  const avgCost = avg(costDeltas);
  const avgFriction = avg(frictions);

  const reasons = [];
  let suggestion = null;
  let confidence = 60;

  if (repairRate > 0.3 || sustainabilityRate > 0.35) {
    suggestion = 'sustainability';
    reasons.push('Frequent sustainability/repair signals detected.');
    confidence += 15;
  }

  if (lockInRate > 0.3 || avgFriction > 65) {
    suggestion = 'creator';
    reasons.push('High lock-in or friction patterns detected.');
    confidence += 10;
  }

  if (avgCost > 800) {
    suggestion = 'balanced';
    reasons.push('Large cost deltas detected, stabilizing profile suggested.');
    confidence += 8;
  }

  if (!suggestion) {
    suggestion = 'balanced';
    reasons.push('No dominant pattern detected.');
  }

  return {
    suggestion,
    confidence: Math.min(confidence, 90),
    reasons,
    metrics: {
      avgCost,
      avgFriction,
      repairRate,
      sustainabilityRate,
      lockInRate,
    },
  };
}
