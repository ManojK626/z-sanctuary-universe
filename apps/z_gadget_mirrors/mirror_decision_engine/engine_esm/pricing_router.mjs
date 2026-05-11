import { chooseTargetPrice } from './mde_costing.mjs';

export function buildFallbackPricingBundle(toProfile) {
  const pick = chooseTargetPrice(null, toProfile);
  return {
    query: `${toProfile?.brand || 'unknown'} ${toProfile?.model_name || toProfile?.id || ''}`.trim(),
    currency: 'EUR',
    region: 'IE',
    sources: [],
    fallback_estimator: {
      enabled: true,
      estimated_price: pick.target_price_eur,
      model: 'msrp_depreciation_v1',
      timestamp: new Date().toISOString(),
    },
    selected: {
      strategy: 'prefer_refurb_if_available_else_retail_else_fallback',
      price: pick.target_price_eur,
      source: pick.pricing_source,
      condition: 'unknown',
    },
  };
}
