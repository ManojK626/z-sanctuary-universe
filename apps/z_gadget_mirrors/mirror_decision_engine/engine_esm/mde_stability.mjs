function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function clone(x) {
  return JSON.parse(JSON.stringify(x));
}

function overrideSelectedPrice(pricingBundle, newPrice) {
  const pb = clone(pricingBundle || {});
  pb.selected = pb.selected || {};
  pb.selected.price = Math.round(newPrice);
  pb.selected.source = `${pb.selected.source || 'unknown'}:stress_test`;
  pb.selected.strategy = pb.selected.strategy || 'stress_test_override';
  pb.timestamp = new Date().toISOString();
  return pb;
}

function buildStressGrid() {
  return {
    priceFactors: [0.8, 0.9, 1.0, 1.1, 1.2],
    repairMultipliers: [0.8, 1.0, 1.2],
    lockInMultipliers: [0.8, 1.0, 1.2],
    holdingYears: [1, 2, 3, 4],
  };
}

export async function computeStability({ baseReport, recomputeFn, maxRuns = 60 }) {
  const baseAction = baseReport?.recommendation?.action || 'unknown';
  const pricing = baseReport?.pricing || {};
  const basePrice =
    pricing?.selected?.price ?? pricing?.fallback_estimator?.estimated_price ?? 0;
  const baseHolding = Number(baseReport?.forecast?.tco?.holding_years ?? 2);

  const grid = buildStressGrid();
  const results = [];
  let flips = 0;
  let runs = 0;

  let priceFlipCount = 0;
  let repairFlipCount = 0;
  let lockInFlipCount = 0;
  let holdingFlipCount = 0;

  for (const pf of grid.priceFactors) {
    for (const rm of grid.repairMultipliers) {
      for (const lm of grid.lockInMultipliers) {
        for (const hy of grid.holdingYears) {
          if (runs >= maxRuns) break;

          const priceOverride = basePrice * pf;
          const pricingBundleOverride = overrideSelectedPrice(pricing, priceOverride);
          const scenarioOverride = {
            name: `StressTest(p=${pf},r=${rm},l=${lm},y=${hy})`,
            holdingYears: hy,
            repairMultiplier: rm,
            lockInMultiplier: lm,
          };

          const r = await recomputeFn({ pricingBundleOverride, scenarioOverride });
          const action = r?.recommendation?.action || 'unknown';
          const flipped = action !== baseAction;

          results.push({
            priceFactor: pf,
            repairMultiplier: rm,
            lockInMultiplier: lm,
            holdingYears: hy,
            action,
            flipped,
          });

          runs += 1;
          if (flipped) {
            flips += 1;
            if (pf !== 1.0) priceFlipCount += 1;
            if (rm !== 1.0) repairFlipCount += 1;
            if (lm !== 1.0) lockInFlipCount += 1;
            if (hy !== baseHolding) holdingFlipCount += 1;
          }
        }
        if (runs >= maxRuns) break;
      }
      if (runs >= maxRuns) break;
    }
    if (runs >= maxRuns) break;
  }

  const flipRate = runs ? flips / runs : 1;
  const stabilityIndex = clamp(Math.round(100 * Math.pow(1 - flipRate, 1.6)), 0, 100);
  const riskLevel =
    stabilityIndex >= 90
      ? 'rock_solid'
      : stabilityIndex >= 70
      ? 'stable'
      : stabilityIndex >= 50
      ? 'sensitive'
      : 'fragile';

  const topDrivers = [
    ['price_volatility', priceFlipCount],
    ['repair_risk', repairFlipCount],
    ['lock_in_risk', lockInFlipCount],
    ['holding_period_sensitivity', holdingFlipCount],
  ]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([driver, flipCount]) => ({ driver, flipCount }));

  return {
    baseAction,
    runs,
    flips,
    flipRate: Number(flipRate.toFixed(2)),
    stabilityIndex,
    riskLevel,
    topDrivers,
    grid: results,
  };
}
