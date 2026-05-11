function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function round(n) {
  return Math.round(Number(n) || 0);
}

export function estimateResaleValue({ purchasePrice, yearsHeld }) {
  const y = clamp(Number(yearsHeld) || 1, 1, 5);
  const rates = { 1: 0.8, 2: 0.65, 3: 0.5, 4: 0.35, 5: 0.35 };
  return round((Number(purchasePrice) || 0) * (rates[y] ?? 0.35));
}

export function estimateRepairProbability({ frictionScore, durabilityScore }) {
  const f = clamp(Number(frictionScore) || 0, 0, 100);
  const d = clamp(Number(durabilityScore) || 50, 0, 100);
  let p = 0.18;
  p += (f / 100) * 0.12;
  p -= (d / 100) * 0.1;
  return clamp(p, 0.05, 0.45);
}

export function estimateExpectedRepairCost({ purchasePrice, repairProb }) {
  const price = Number(purchasePrice) || 0;
  const p = clamp(Number(repairProb) || 0.2, 0.05, 0.7);
  const eventCost = price * 0.06;
  return round(p * eventCost);
}

export function forecastLockIn({ baseLockInScore, freedomScore, years = 2 }) {
  const base = clamp(Number(baseLockInScore) || 30, 0, 100);
  const freedom = clamp(Number(freedomScore) || 50, 0, 100);
  const growthPerYear = clamp(Math.round((100 - freedom) * 0.15), 2, 18);

  const series = [];
  let current = base;
  for (let i = 1; i <= years; i += 1) {
    current = clamp(current + growthPerYear, 0, 100);
    series.push({ year: i, lock_in_score: current });
  }
  return { growthPerYear, series };
}

export function forecastDecisionImpact({
  pricingBundle,
  toProfile,
  baseReport,
  scenario = { name: 'Normal Usage', holdingYears: 2, repairMultiplier: 1, lockInMultiplier: 1 },
}) {
  const selectedPrice =
    pricingBundle?.selected?.price ?? pricingBundle?.fallback_estimator?.estimated_price ?? 0;
  const friction = Number(baseReport?.scores?.friction_score ?? 50);
  const durabilityMetric = Number(toProfile?.metrics?.durability ?? 6);
  const durability = clamp(Math.round((durabilityMetric / 10) * 100), 0, 100);
  const freedom = Number(baseReport?._weighted?.components?.freedomScore ?? 50);
  const baseLockIn = clamp(
    Math.round(Number(toProfile?.metrics?.lock_in ?? 5) * 10),
    0,
    100
  );

  const holding = clamp(Number(scenario?.holdingYears ?? 2), 1, 5);
  let repairProb = estimateRepairProbability({ frictionScore: friction, durabilityScore: durability });
  repairProb = clamp(repairProb * Number(scenario?.repairMultiplier ?? 1), 0.05, 0.7);

  const expectedRepairAnnual = estimateExpectedRepairCost({ purchasePrice: selectedPrice, repairProb });
  const resale = estimateResaleValue({ purchasePrice: selectedPrice, yearsHeld: holding });
  const tco = round(selectedPrice + expectedRepairAnnual * holding - resale);

  const lockIn = forecastLockIn({ baseLockInScore: baseLockIn, freedomScore: freedom, years: holding });
  lockIn.growthPerYear = round(lockIn.growthPerYear * Number(scenario?.lockInMultiplier ?? 1));

  const sustainHint = baseReport?.scores?.sustainability_delta?.repair_vs_replace_hint;
  const sustainDelta = sustainHint === 'repair_recommended' ? 1 : 0;
  const sustainTrend = sustainDelta > 0 ? 'improves' : 'neutral';

  return {
    scenario: scenario?.name || 'custom',
    pricing: {
      selected_price_eur: round(selectedPrice),
      source: pricingBundle?.selected?.source || 'fallback_estimator',
      timestamp:
        pricingBundle?.sources?.[0]?.timestamp ||
        pricingBundle?.fallback_estimator?.timestamp ||
        new Date().toISOString(),
      strategy: pricingBundle?.selected?.strategy || 'unknown',
    },
    repair: {
      annual_repair_probability: Number(repairProb.toFixed(2)),
      expected_annual_cost_eur: expectedRepairAnnual,
    },
    resale: {
      holding_year_estimated_eur: resale,
    },
    tco: {
      holding_years: holding,
      total_eur: tco,
    },
    lock_in: lockIn,
    sustainability: {
      score_delta: sustainDelta,
      trend: sustainTrend,
    },
    assumptions: [
      'Depreciation uses fixed transparent curve.',
      'Repair probability is a friction/durability heuristic.',
      'Expected repair cost scales with price using a fixed event-cost ratio.',
      'Lock-in growth increases when freedom is low.',
    ],
  };
}
