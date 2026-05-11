import { scoreFriction, estimateLearningHours } from './mde_scoring.mjs';
import { migrationDifficulty, chooseTargetPrice } from './mde_costing.mjs';
import { sustainabilityDelta } from './mde_sustainability.mjs';

export function generateSwitchingReport({
  userId,
  fromDevice,
  fromProfile,
  toProfile,
  baseline,
  inputs,
  pricingBundle,
}) {
  const friction = scoreFriction(fromProfile, toProfile, fromDevice);
  const learningHours = estimateLearningHours(fromProfile, toProfile);
  const migration = migrationDifficulty(fromProfile, toProfile);
  const sustain = sustainabilityDelta(fromProfile, toProfile, fromDevice, baseline);
  const chosen = chooseTargetPrice(pricingBundle, toProfile);

  const currentValue = Number(fromDevice?.estimated_price_eur ?? 0);
  const costDelta = Math.round((chosen.target_price_eur - currentValue) * 100) / 100;
  const budget = Number(inputs?.budget_eur ?? 0);

  let action = 'stay_put';
  let confidence = 60;
  const reasonCodes = [];

  if (sustain.repair_vs_replace_hint === 'repair_recommended') {
    action = 'delay_and_repair';
    confidence = 78;
    reasonCodes.push('low_battery_health');
  } else if (friction > 70) {
    action = 'delay_and_save';
    confidence = 70;
    reasonCodes.push('high_lock_in_cost');
  } else if (budget > 0 && costDelta > budget) {
    action = 'delay_and_save';
    confidence = 72;
    reasonCodes.push('budget_constraint');
  } else {
    action = 'switch_now';
    confidence = 74;
    reasonCodes.push('lower_friction');
  }

  return {
    id: `report_${Date.now()}`,
    user_id: userId,
    from_device_id: fromDevice.id,
    to_device_profile_id: toProfile.id,
    inputs: inputs || {},
    scores: {
      friction_score: friction,
      cost_delta_eur: costDelta,
      learning_hours_est: learningHours,
      migration_difficulty: migration,
      sustainability_delta: sustain,
      pricing_source: chosen.pricing_source,
      target_price_eur: chosen.target_price_eur,
    },
    pricing: pricingBundle || null,
    recommendation: {
      action,
      confidence,
      reason_codes: reasonCodes,
      plain_summary: `Friction: ${friction}/100 • Cost delta: €${costDelta} • Learning: ~${learningHours}h • Migration: ${migration} • CO2 delta: ${sustain.co2_kg_est}kg`,
    },
    created_at: new Date().toISOString(),
  };
}
