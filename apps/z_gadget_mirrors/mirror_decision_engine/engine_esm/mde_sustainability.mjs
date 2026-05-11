export function sustainabilityDelta(fromProfile, toProfile, userDevice, baseline) {
  const battery = Number(userDevice?.usage?.battery_health_percent ?? 100);
  const repairThreshold = Number(baseline?.thresholds?.repair_recommended_battery_below ?? 80);
  const repairRecommended = battery < repairThreshold;

  const co2Estimate = repairRecommended ? -25 : 40;
  return {
    co2_kg_est: co2Estimate,
    e_waste_risk: repairRecommended ? 'lower' : 'higher',
    repair_vs_replace_hint: repairRecommended ? 'repair_recommended' : 'replace_ok',
  };
}
