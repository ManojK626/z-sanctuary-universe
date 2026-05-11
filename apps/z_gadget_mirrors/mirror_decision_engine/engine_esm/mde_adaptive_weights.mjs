function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function avg(arr) {
  if (!arr?.length) return null;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function pct(arr, predicate) {
  if (!arr?.length) return 0;
  return arr.filter(predicate).length / arr.length;
}

function countBy(arr, getKey) {
  const map = {};
  for (const x of arr) {
    const k = String(getKey(x) ?? 'unknown');
    map[k] = (map[k] || 0) + 1;
  }
  return map;
}

function topK(map, k = 2) {
  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .slice(0, k);
}

export function suggestWeights({ reports, currentWeights }) {
  const recent = (reports || []).slice(0, 30);
  const base = { cost: 6, privacy: 5, durability: 5, sustainability: 7, freedom: 4 };
  const cur = currentWeights && typeof currentWeights === 'object' ? currentWeights : base;

  if (!recent.length) {
    return {
      weights: base,
      confidence: 55,
      reasons: ['No history yet. Using balanced defaults.'],
      stats: { sampleSize: 0 },
    };
  }

  const deltas = recent
    .map((r) => Number(r?.scores?.cost_delta_eur))
    .filter((v) => Number.isFinite(v));
  const friction = recent
    .map((r) => Number(r?.scores?.friction_score))
    .filter((v) => Number.isFinite(v));
  const repairHintRate = pct(
    recent,
    (r) => r?.scores?.sustainability_delta?.repair_vs_replace_hint === 'repair_recommended'
  );
  const budgetRate = pct(
    recent,
    (r) => (r?.recommendation?.reason_codes || []).includes('budget_constraint')
  );
  const lockInRate = pct(
    recent,
    (r) => (r?.recommendation?.reason_codes || []).includes('high_lock_in_cost')
  );
  const sustainabilityGainRate = pct(
    recent,
    (r) => (r?.recommendation?.reason_codes || []).includes('sustainability_gain')
  );
  const topRoles = topK(countBy(recent, (r) => r?.inputs?.primary_role), 2);
  const avgDelta = avg(deltas);
  const avgFriction = avg(friction);

  const w = { ...base, ...cur };
  const reasons = [];
  let confidence = 60;

  if (budgetRate >= 0.25 || (avgDelta != null && avgDelta > 600)) {
    w.cost = clamp(w.cost + 2, 0, 10);
    reasons.push('Budget pressure detected. Increasing Cost weight.');
    confidence += 8;
  }
  if (lockInRate >= 0.2 || (avgFriction != null && avgFriction > 60)) {
    w.freedom = clamp(w.freedom + 2, 0, 10);
    reasons.push('Lock-in/friction pressure detected. Increasing Freedom weight.');
    confidence += 8;
  }
  if (repairHintRate >= 0.2) {
    w.sustainability = clamp(w.sustainability + 2, 0, 10);
    w.durability = clamp(w.durability + 1, 0, 10);
    reasons.push('Frequent repair recommendations. Increasing Sustainability + Durability.');
    confidence += 8;
  }
  if (sustainabilityGainRate >= 0.25) {
    w.sustainability = clamp(w.sustainability + 1, 0, 10);
    reasons.push('Sustainability gains are common. Keeping Sustainability elevated.');
    confidence += 6;
  }
  if (w.privacy < 6 && topRoles.some(([role]) => role === 'enterprise' || role === 'health')) {
    w.privacy = clamp(w.privacy + 1, 0, 10);
    reasons.push('Role pattern suggests privacy sensitivity. Nudging Privacy up.');
    confidence += 4;
  }

  if (!reasons.length) {
    return {
      weights: { ...cur },
      confidence: 58,
      reasons: ['No strong pattern detected. Keeping current weights.'],
      stats: { sampleSize: recent.length, avgCostDelta: avgDelta, avgFriction },
    };
  }

  return {
    weights: w,
    confidence: clamp(confidence, 50, 90),
    reasons,
    stats: {
      sampleSize: recent.length,
      avgCostDelta: avgDelta,
      avgFriction,
      budgetRate,
      lockInRate,
      repairHintRate,
      sustainabilityGainRate,
      topRoles,
    },
  };
}
