// Z: core\z_energy_response.js
/**
 * Z-Energy Response System
 * Autonomously maintains energy and harmony metrics
 * Integrates with emotional state via Z-Emotion Filter
 */

const ZEnergyResponse = (() => {
  let energyLevel = 75;
  let harmonyBalance = 50;
  let systemLoad = 40; // processing/activity level
  let resonanceFrequency = 0; // oscillation phase

  // Track pulse history for trend analysis
  let pulseHistory = [];
  const MAX_HISTORY = 50;

  /**
   * Core pulse: updates energy and harmony
   * Called every 2 seconds autonomously
   */
  const pulse = () => {
    // Energy fluctuates based on system state
    const energyDelta = (Math.random() - 0.5) * 8;
    energyLevel = Math.max(20, Math.min(100, energyLevel + energyDelta));

    // Harmony oscillates with smooth sine wave (phase-locked to time)
    resonanceFrequency = (Date.now() % 10000) / 10000; // 0-1 over 10 seconds
    harmonyBalance = 50 + Math.sin(resonanceFrequency * Math.PI * 2) * 30;

    // System load gradually normalizes
    systemLoad = 0.95 * systemLoad + 0.05 * 40;

    // Pass through emotion filter if available
    let emotionalImpact = null;
    if (window.ZEmotionFilter && typeof window.ZEmotionFilter.filterEnergy === 'function') {
      emotionalImpact = window.ZEmotionFilter.filterEnergy(energyLevel, harmonyBalance);
    }

    recordPulse(emotionalImpact);
    reportStatus();
  };

  /**
   * Record this pulse in history for trend analysis
   */
  const recordPulse = (emotionalState) => {
    pulseHistory.push({
      timestamp: Date.now(),
      energy: energyLevel,
      harmony: harmonyBalance,
      load: systemLoad,
      emotion: emotionalState,
    });

    if (pulseHistory.length > MAX_HISTORY) {
      pulseHistory.shift();
    }
  };

  /**
   * Log system status to console (all three levels)
   */
  const reportStatus = () => {
    const emoji = getEmoji();
    const emotional = window.ZEmotionFilter
      ? ` | Coherence: ${window.ZEmotionFilter.getEmotionalState().coherence}%`
      : '';

    console.log(
      `${emoji} Energy: ${energyLevel.toFixed(1)}% | Harmony: ${harmonyBalance.toFixed(1)}% | Load: ${systemLoad.toFixed(0)}%${emotional}`
    );

    // Also log to ZStatusConsole if available
    if (window.ZStatusConsole && typeof window.ZStatusConsole.log === 'function') {
      window.ZStatusConsole.log(
        `[ENERGY] E:${energyLevel.toFixed(0)}% H:${harmonyBalance.toFixed(0)}% L:${systemLoad.toFixed(0)}%${emotional}`,
        'status'
      );
    }
  };

  /**
   * Get appropriate emoji based on system state
   */
  const getEmoji = () => {
    const coherence = (energyLevel + harmonyBalance) / 2;
    if (coherence > 80) return '[HIGH]';
    if (coherence > 60) return '[OK]';
    if (coherence > 40) return '[LOW]';
    return '[LOW]';
  };

  /**
   * Apply external stimulus (e.g., user interaction, event)
   */
  const stimulate = (stimulus) => {
    // stimulus: { type: 'interaction'|'rest'|'surge', intensity: 0-100 }
    const intensity = Math.min(100, Math.max(0, stimulus.intensity || 50));

    switch (stimulus.type) {
      case 'interaction':
        energyLevel = Math.min(100, energyLevel + intensity * 0.3);
        systemLoad = Math.min(100, systemLoad + intensity * 0.5);
        break;
      case 'rest':
        energyLevel = Math.min(100, energyLevel + intensity * 0.2);
        systemLoad = Math.max(20, systemLoad - intensity * 0.4);
        break;
      case 'surge':
        energyLevel = Math.min(100, energyLevel + intensity * 0.6);
        systemLoad = Math.min(100, systemLoad + intensity * 0.3);
        break;
    }

    pulse(); // Immediate recalculation
  };

  /**
   * Public accessors
   */
  const getEnergy = () => energyLevel;
  const getHarmony = () => harmonyBalance;
  const getLoad = () => systemLoad;
  const getState = () => ({
    energy: energyLevel,
    harmony: harmonyBalance,
    load: systemLoad,
    resonance: resonanceFrequency,
  });

  /**
   * Get trend data
   */
  const getTrend = (limit = 10) => {
    return pulseHistory.slice(-limit);
  };

  const init = () => {
    console.log('[ENERGY] Energy Response System initialized');
    // Auto-pulse every 2 seconds
    setInterval(() => ZEnergyResponse.pulse(), 2000);
  };

  return {
    init,
    pulse,
    stimulate,
    getEnergy,
    getHarmony,
    getLoad,
    getState,
    getTrend,
    reportStatus,
  };
})();

window.ZEnergyResponse = ZEnergyResponse;

ZEnergyResponse.init();

// WebSocket bridge integration for Mini-AI engine
(function () {
  let ws;
  function sendToBridge(data) {
    if (!ws || ws.readyState !== 1) return;
    ws.send(JSON.stringify(data));
  }
  function setupWS() {
    ws = new window.WebSocket('ws://localhost:8765');
    ws.onopen = () => console.log('[WS] Connected to Mini-AI WebSocket bridge');
    ws.onclose = () => setTimeout(setupWS, 2000);
  }
  setupWS();
  // Patch ZEnergyResponse to send data on each pulse
  const origPulse = window.ZEnergyResponse && window.ZEnergyResponse.pulse;
  if (origPulse) {
    window.ZEnergyResponse.pulse = function () {
      const result = origPulse.apply(this, arguments);
      const state = window.ZEnergyResponse.getState();
      sendToBridge({
        type: 'energy_pulse',
        energy: state.energy,
        harmony: state.harmony,
        load: state.load,
        timestamp: Date.now(),
      });
      return result;
    };
  }
})();
