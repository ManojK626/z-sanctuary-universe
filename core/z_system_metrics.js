// Z: core\z_system_metrics.js
// System metrics aggregator (stress, load, risk).
(function () {
  function clamp01(value) {
    return Math.max(0, Math.min(1, value));
  }

  function riskToNumber(riskClass) {
    switch (riskClass) {
      case 'sacred':
        return 1;
      case 'high':
        return 0.8;
      case 'medium':
        return 0.6;
      case 'low':
        return 0.3;
      default:
        return 0.4;
    }
  }

  function getMetrics() {
    const emotion = window.ZEmotionFilter?.getEmotionalState?.();
    const coherence = Number.isFinite(emotion?.coherence) ? emotion.coherence : null;
    const energyState = window.ZEnergyResponse?.getState?.();
    const load = Number.isFinite(energyState?.load) ? energyState.load / 100 : null;
    const energy = Number.isFinite(energyState?.energy) ? energyState.energy / 100 : null;
    const riskClass = window.ZGovernanceHUD?.getState?.().riskClass || 'unknown';
    const risk = riskToNumber(riskClass);
    const stress = coherence === null ? 0.35 : clamp01(1 - coherence / 100);

    return {
      stress,
      load: load === null ? 0.4 : clamp01(load),
      energy: energy === null ? 0.5 : clamp01(energy),
      coherence,
      risk,
      riskClass,
      timestamp: Date.now(),
    };
  }

  window.ZSystemMetrics = {
    get: getMetrics,
  };
})();
