// Z: Amk_Goku Worldwide Loterry\exports\lottery_app_pack_20260131T130222Z\core\feeling\z_feeling_analyzer.js
// Z-Feeling Analyzer (read-only, auditable)
// Produces "Feeling Field" snapshots from existing signals.

(function () {
  function clamp(n, lo, hi) {
    return Math.max(lo, Math.min(hi, n));
  }

  function computeFromSignals(signals = {}) {
    const harisha = signals.harishaState || 'calm';
    const rhythm = signals.circleRhythm || 'ACTIVE';
    const drift = typeof signals.driftLevel === 'number' ? signals.driftLevel : 0;
    const world =
      typeof signals.worldPulseIntensity === 'number' ? signals.worldPulseIntensity : 0.3;
    const notes = typeof signals.noteRate === 'number' ? signals.noteRate : 0.2;
    const causes = typeof signals.rootCauses === 'number' ? signals.rootCauses : 0;

    let pressure = drift * 40 + world * 30 + clamp(causes, 0, 10) * 3 + notes * 15;
    if (rhythm === 'REST' || rhythm === 'RITUAL') pressure *= 0.7;
    if (harisha !== 'calm') pressure *= 1.15;

    let stability = 100 - pressure;
    if (rhythm === 'REST' || rhythm === 'RITUAL') stability += 10;
    stability = clamp(stability, 0, 100);

    let coherence =
      70 + (rhythm === 'LEARNING' ? 8 : 0) - drift * 25 - (harisha === 'alert' ? 10 : 0);
    coherence = clamp(coherence, 0, 100);

    const alignment = clamp(coherence * 0.55 + stability * 0.45, 0, 100);

    let suggested = 'ACTIVE';
    const reasons = [];
    if (pressure > 70 || stability < 35) {
      suggested = 'REST';
      reasons.push('High pressure / low stability');
    }
    if (rhythm === 'RITUAL') {
      suggested = 'RITUAL';
      reasons.push('Circle in ritual');
    }
    if (rhythm === 'LEARNING' && pressure < 65) {
      suggested = 'LEARNING';
      reasons.push('Learning mode stable');
    }

    let angleDeg = 0;
    if (suggested === 'REST') angleDeg = 180;
    else if (pressure > 55) angleDeg = 90;
    else angleDeg = 270;

    return {
      coherenceScore: coherence,
      pressureScore: clamp(pressure, 0, 100),
      stabilityScore: stability,
      alignmentScore: alignment,
      suggestedRhythm: suggested,
      ring: { angleDeg, magnitude: clamp(pressure / 100, 0, 1) },
      reasons,
    };
  }

  function emitEvent({
    space = 'system',
    cellIndex = [0, 0],
    signals = {},
    actor = 'observer',
  } = {}) {
    const out = computeFromSignals(signals);
    const evt = {
      ts: new Date().toISOString(),
      module: 'feeling_analyzer',
      cell: { space, index: cellIndex },
      ring: out.ring,
      field: {
        coherenceScore: out.coherenceScore,
        pressureScore: out.pressureScore,
        stabilityScore: out.stabilityScore,
        alignmentScore: out.alignmentScore,
        suggestedRhythm: out.suggestedRhythm,
        reasons: out.reasons,
      },
      meta: { actor, signalsUsed: Object.keys(signals) },
    };

    window.ZChronicle?.record?.({ source: 'feeling_analyzer', event: evt });
    window.ZSuperGhost?.ingest?.(evt);

    return evt;
  }

  window.ZFeelingAnalyzer = { computeFromSignals, emitEvent };
})();
