// Z: core\z_emotion_filter.js
/**
 * Z-Emotion Filter
 * Processes energy and experience through emotional lenses
 * Maintains coherent emotional state across the system
 */

const ZEmotionFilter = (() => {
  // Emotional dimensions (0-100 scale)
  let serenity = 65; // calm vs. agitation
  let resonance = 70; // harmony with surroundings
  let vitality = 75; // aliveness vs. depletion
  let clarity = 60; // perception clarity vs. confusion

  // Internal state tracking
  let emotionalHistory = [];
  let responseMode = 'receptive'; // receptive, amplified, damped, neutral

  /**
   * Process incoming energy signal through emotional filter
   * Returns transformed state
   */
  const filterEnergy = (rawEnergy, rawHarmony) => {
    // Emotional response to energy
    if (rawEnergy > 85) {
      // High energy -> potential for excitement or overwhelm
      serenity = Math.max(40, serenity - 5);
      vitality = Math.min(100, vitality + 8);
    } else if (rawEnergy < 50) {
      // Low energy -> lethargy
      vitality = Math.max(30, vitality - 3);
      serenity = Math.min(90, serenity + 2);
    }

    // Harmony influences resonance
    resonance = 0.7 * resonance + 0.3 * rawHarmony;

    // Mutual influence between emotions
    clarity = 0.8 * clarity + 0.1 * serenity + 0.1 * resonance;

    // Apply decay to prevent drift
    serenity = 0.98 * serenity + 0.02 * 65; // drift toward baseline
    vitality = 0.98 * vitality + 0.02 * 75;
    resonance = 0.98 * resonance + 0.02 * 70;

    evaluateResponseMode();
    recordState();
    return getEmotionalState();
  };

  /**
   * Determine how strongly to respond to changes
   */
  const evaluateResponseMode = () => {
    const coherence = (serenity + resonance + vitality + clarity) / 4;

    if (coherence > 80) {
      responseMode = 'amplified';
    } else if (coherence > 65) {
      responseMode = 'receptive';
    } else if (coherence > 45) {
      responseMode = 'damped';
    } else {
      responseMode = 'neutral';
    }

    return responseMode;
  };

  /**
   * Record emotional state snapshot
   */
  const recordState = () => {
    emotionalHistory.push({
      timestamp: Date.now(),
      serenity,
      resonance,
      vitality,
      clarity,
      mode: responseMode,
    });

    // Keep only last 100 entries
    if (emotionalHistory.length > 100) {
      emotionalHistory.shift();
    }
  };

  /**
   * Get current emotional state snapshot
   */
  const getEmotionalState = () => ({
    serenity: Math.round(serenity),
    resonance: Math.round(resonance),
    vitality: Math.round(vitality),
    clarity: Math.round(clarity),
    mode: responseMode,
    coherence: Math.round((serenity + resonance + vitality + clarity) / 4),
  });

  /**
   * Get emotional signature (emoji representation)
   */
  const getSignature = () => {
    const state = getEmotionalState();

    if (state.coherence > 80) return '[TRANSCENDENT]'; // Transcendent
    if (state.coherence > 70) return '[HARMONY]'; // Harmony
    if (state.coherence > 55) return '[BALANCED]'; // Balanced
    if (state.coherence > 40) return '[TENTATIVE]'; // Tentative
    return '[DEPLETED]'; // Depleted
  };

  /**
   * Influence emotional state (used by external events)
   */
  const resonateWith = (stimulus) => {
    // stimulus: { type: 'joy'|'sorrow'|'tension'|'calm', intensity: 0-100 }
    const intensity = Math.min(100, Math.max(0, stimulus.intensity || 50));

    switch (stimulus.type) {
      case 'joy':
        serenity = Math.min(100, serenity + intensity * 0.3);
        vitality = Math.min(100, vitality + intensity * 0.5);
        break;
      case 'sorrow':
        vitality = Math.max(20, vitality - intensity * 0.4);
        serenity = Math.max(30, serenity - intensity * 0.2);
        break;
      case 'tension':
        serenity = Math.max(20, serenity - intensity * 0.5);
        clarity = Math.max(30, clarity - intensity * 0.3);
        break;
      case 'calm':
        serenity = Math.min(100, serenity + intensity * 0.4);
        clarity = Math.min(100, clarity + intensity * 0.2);
        break;
    }

    evaluateResponseMode();
    recordState();
    return getEmotionalState();
  };

  /**
   * Get history for analysis
   */
  const getHistory = (limit = 10) => {
    return emotionalHistory.slice(-limit);
  };

  const init = () => {
    console.log('[INIT] Z-Emotion Filter initialized');
  };

  return {
    init,
    filterEnergy,
    resonateWith,
    getEmotionalState,
    getSignature,
    evaluateResponseMode,
    getHistory,
  };
})();

window.ZEmotionFilter = ZEmotionFilter;

ZEmotionFilter.init();
