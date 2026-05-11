export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function scoreFriction(fromProfile, toProfile, userDevice) {
  const from = fromProfile.metrics;
  const to = toProfile.metrics;
  let friction = 0;

  if (fromProfile.ecosystem !== toProfile.ecosystem) friction += 25;
  friction += Math.abs(from.lock_in - to.lock_in) * 3;
  friction += Math.abs(from.customization - to.customization) * 2;

  const intensity = userDevice?.usage?.intensity || 'medium';
  if (intensity === 'heavy') friction *= 1.2;
  if (intensity === 'light') friction *= 0.9;

  return clamp(Math.round(friction), 0, 100);
}

export function estimateLearningHours(fromProfile, toProfile) {
  const delta = Math.abs(fromProfile.metrics.customization - toProfile.metrics.customization);
  return delta * 2 + (fromProfile.ecosystem !== toProfile.ecosystem ? 8 : 0);
}
