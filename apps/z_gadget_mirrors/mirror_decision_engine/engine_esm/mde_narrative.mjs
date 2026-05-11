function pct(x) {
  if (x == null || Number.isNaN(Number(x))) return null;
  return Math.round(Number(x) * 100);
}

function money(n) {
  const v = Number(n);
  if (!Number.isFinite(v)) return 'N/A';
  return `EUR ${Math.round(v)}`;
}

function stabilityLabel(idx) {
  if (idx >= 90) return 'rock solid';
  if (idx >= 70) return 'stable';
  if (idx >= 50) return 'sensitive';
  return 'fragile';
}

function actionFraming(action) {
  switch (action) {
    case 'switch_now':
      return 'The engine favors switching now based on current costs, friction, and forecast.';
    case 'stay_put':
      return 'The engine favors staying with your current setup under present assumptions.';
    case 'delay_and_repair':
      return 'The engine favors delaying purchase and improving the current device first.';
    case 'try_refurbished':
      return 'The engine favors a switch path, but with a refurbished route to reduce risk.';
    default:
      return 'The engine produced an action outside the common recommendation set.';
  }
}

function driverAdvice(driver) {
  switch (driver) {
    case 'price_volatility':
      return 'Use refurb path, set budget cap, or delay until prices normalize.';
    case 'repair_risk':
      return 'Increase durability priority and account for repair reserve.';
    case 'lock_in_risk':
      return 'Raise freedom priority and reduce ecosystem dependency.';
    case 'holding_period_sensitivity':
      return 'Align scenario with your real ownership duration.';
    default:
      return 'Re-run with alternative scenario assumptions.';
  }
}

export function buildDecisionNarrative(report) {
  const lines = [];
  const s = report?.stability;
  const f = report?.forecast;
  const p = report?.pricing;
  const action = report?.recommendation?.action || 'unknown';

  if (s?.stabilityIndex != null) {
    lines.push(`Stability: ${stabilityLabel(s.stabilityIndex)} (${s.stabilityIndex}/100).`);
  } else {
    lines.push('Stability: N/A.');
  }

  lines.push(`Recommendation: ${action}. ${actionFraming(action)}`);
  if (report?.recommendation?.confidence != null) {
    lines.push(`Confidence: ${report.recommendation.confidence}% (model confidence, not a promise).`);
  }

  if (f?.tco?.total_eur != null) {
    lines.push(
      `Forecast (${f?.scenario || 'scenario'}): holding ${f.tco.holding_years}y, projected TCO ${money(
        f.tco.total_eur
      )}.`
    );
  }
  if (f?.repair?.annual_repair_probability != null) {
    lines.push(
      `Repair expectation: ${pct(f.repair.annual_repair_probability)}%/yr, expected ${money(
        f.repair.expected_annual_cost_eur
      )} per year.`
    );
  }
  if (f?.lock_in?.growthPerYear != null) {
    lines.push(`Lock-in trend: +${f.lock_in.growthPerYear}/year on a 0-100 risk scale.`);
  }
  if (f?.sustainability?.trend) {
    lines.push(`Sustainability outlook: ${f.sustainability.trend} (delta ${f.sustainability.score_delta}).`);
  }

  const selectedPrice =
    p?.selected?.price ?? p?.fallback_estimator?.estimated_price ?? report?.scores?.target_price_eur;
  const selectedSource = p?.selected?.source || report?.scores?.pricing_source || 'fallback_estimator';
  if (selectedPrice != null) {
    lines.push(`Price used: ${money(selectedPrice)} from ${selectedSource}.`);
  }

  if (s?.flipRate != null && s?.runs != null) {
    lines.push(`Sensitivity: recommendation flipped in ${pct(s.flipRate)}% of stress tests (${s.flips}/${s.runs}).`);
  }

  if (s?.topDrivers?.length) {
    lines.push('Top risk drivers:');
    for (const d of s.topDrivers.slice(0, 2)) {
      lines.push(`- ${d.driver}: ${driverAdvice(d.driver)}`);
    }
  }

  lines.push('Next step:');
  if ((s?.stabilityIndex ?? 100) < 70) {
    lines.push('- Compare at least two scenarios and apply one mitigation action.');
  } else {
    lines.push('- Proceed if this matches your constraints, otherwise tune scenario/weights and rerun.');
  }

  return lines.join('\n');
}
