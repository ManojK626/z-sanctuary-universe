// Z: Amk_Goku Worldwide Loterry\core\z_rhythm_engine.js
// Z-RHYTHM Engine (observer-only)
// Evaluates system status into a rhythm state.

(function () {
  function evaluateRhythm(systemStatus) {
    if (!systemStatus) {
      return 'CALM';
    }

    const driftCodes = systemStatus.drift_codes || [];
    const driftCount = Array.isArray(driftCodes)
      ? driftCodes.length
      : String(driftCodes).split(',').filter(Boolean).length;
    const coverage = systemStatus.data_coverage?.available || 0;
    const jail = systemStatus.observatory?.jailcell_total || 0;

    if (jail > 0) return 'CALM';
    if (driftCount === 0 && coverage === 0) return 'CALM';
    if (driftCount <= 2) return 'ADAPTIVE';
    return 'REGENERATION';
  }

  window.ZRhythm = {
    evaluateRhythm,
  };
})();
