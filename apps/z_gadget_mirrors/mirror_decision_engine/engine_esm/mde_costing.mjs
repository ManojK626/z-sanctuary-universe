export function migrationDifficulty(fromProfile, toProfile) {
  if (fromProfile.ecosystem !== toProfile.ecosystem) return 'high';
  const delta = Math.abs(fromProfile.metrics.customization - toProfile.metrics.customization);
  if (delta > 5) return 'medium';
  return 'low';
}

export function estimateFallbackTargetPrice(profile) {
  const msrp = Number(profile?.msrp_eur ?? 800);
  const releaseYear = Number(profile?.released_year ?? new Date().getFullYear());
  const age = Math.max(0, new Date().getFullYear() - releaseYear);
  const depreciation = Math.min(0.75, age * 0.15);
  return Math.round(msrp * (1 - depreciation));
}

export function chooseTargetPrice(pricingBundle, toProfile) {
  if (pricingBundle?.selected?.price != null) {
    return {
      target_price_eur: Number(pricingBundle.selected.price),
      pricing_source: String(pricingBundle.selected.source || 'pricing_bundle'),
    };
  }
  if (pricingBundle?.fallback_estimator?.estimated_price != null) {
    return {
      target_price_eur: Number(pricingBundle.fallback_estimator.estimated_price),
      pricing_source: 'fallback_estimator',
    };
  }
  return {
    target_price_eur: estimateFallbackTargetPrice(toProfile),
    pricing_source: 'fallback_estimator_local',
  };
}
