// Z: core\z_chronicle_hud.js
/**
 * Z-Chronicle HUD
 * Visual interface for Chronicle system
 * Renders top indicator bar and bottom tools bar
 */

const ZChronicleHUD = (() => {
  let indicatorBar = null;
  let toolsBar = null;
  let isInitialized = false;

  /**
   * Create the top indicator bar element
   */
  const createIndicatorBar = () => {
    const bar = document.createElement('div');
    bar.id = 'zIndicatorBar';
    bar.className = 'z-indicator-bar';
    bar.setAttribute('role', 'region');
    bar.setAttribute('aria-label', 'System status indicators');

    // Fallback inline styles if CSS hasn't loaded
    bar.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 3.5rem;
      background: linear-gradient(135deg, rgba(10, 14, 39, 0.96) 0%, rgba(20, 26, 50, 0.96) 100%);
      border-bottom: 2px solid rgba(0, 212, 255, 0.3);
      display: flex;
      align-items: center;
      gap: 1.5rem;
      padding: 0.75rem 1.5rem;
      z-index: 9001;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
      overflow-x: auto;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    `;

    // System Health indicator
    const healthBadge = document.createElement('div');
    healthBadge.className = 'z-indicator-badge z-indicator-health';
    healthBadge.innerHTML = `
      <span class="z-indicator-dot"></span>
      <span class="z-indicator-label">System Health</span>
      <span class="z-indicator-value">steady | focus: balanced</span>
    `;

    // Energy level indicator
    const energyBadge = document.createElement('div');
    energyBadge.className = 'z-indicator-badge z-indicator-energy';
    energyBadge.innerHTML = `
      <span class="z-indicator-dot"></span>
      <span class="z-indicator-label">Energy</span>
      <span class="z-indicator-value" id="zHUDEnergyValue">70%</span>
    `;

    // Harmony indicator
    const harmonyBadge = document.createElement('div');
    harmonyBadge.className = 'z-indicator-badge z-indicator-harmony';
    harmonyBadge.innerHTML = `
      <span class="z-indicator-dot"></span>
      <span class="z-indicator-label">Harmony</span>
      <span class="z-indicator-value" id="zHUDHarmonyValue">45%</span>
    `;

    // Coherence indicator
    const coherenceBadge = document.createElement('div');
    coherenceBadge.className = 'z-indicator-badge z-indicator-coherence';
    coherenceBadge.innerHTML = `
      <span class="z-indicator-dot"></span>
      <span class="z-indicator-label">Coherence</span>
      <span class="z-indicator-value" id="zHUDCoherenceValue">64%</span>
    `;

    // Module status
    const moduleBadge = document.createElement('div');
    moduleBadge.className = 'z-indicator-badge z-indicator-modules';
    moduleBadge.innerHTML = `
      <span class="z-indicator-label">Modules</span>
      <span class="z-indicator-value" id="zHUDModuleCount">6/6 Online</span>
    `;

    bar.appendChild(healthBadge);
    bar.appendChild(energyBadge);
    bar.appendChild(harmonyBadge);
    bar.appendChild(coherenceBadge);
    bar.appendChild(moduleBadge);

    return bar;
  };

  /**
   * Create the bottom tools bar element
   */
  const createToolsBar = () => {
    const bar = document.createElement('div');
    bar.id = 'zToolsBar';
    bar.className = 'z-tools-bar';
    bar.setAttribute('role', 'toolbar');
    bar.setAttribute('aria-label', 'Chronicle recording and control tools');

    // Fallback inline styles if CSS hasn't loaded
    bar.style.cssText = `
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: 4rem;
      background: linear-gradient(180deg, rgba(10, 14, 39, 0.96) 0%, rgba(6, 10, 25, 0.98) 100%);
      border-top: 2px solid rgba(0, 212, 255, 0.3);
      display: flex;
      align-items: center;
      gap: 2rem;
      padding: 0.75rem 1.5rem;
      z-index: 9001;
      box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.4);
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    `;

    // Recording status
    const recordStatus = document.createElement('div');
    recordStatus.className = 'z-tools-status';
    recordStatus.innerHTML = `
      <span id="zRecordingStatus" class="z-tools-status-text">Ready to record</span>
    `;

    // Recording controls
    const recordControls = document.createElement('div');
    recordControls.className = 'z-tools-controls';

    const startBtn = document.createElement('button');
    startBtn.id = 'zHUDStartRecordBtn';
    startBtn.className = 'z-tools-btn z-tools-btn-primary';
    startBtn.textContent = '⏺ Start Recording';
    startBtn.title = 'Start recording Chronicle session';
    startBtn.addEventListener('click', () => {
      if (window.ZChronicle && typeof window.ZChronicle.startRecord === 'function') {
        window.ZChronicle.startRecord();
        updateRecordingStatus('Recording...');
      }
    });

    const stopBtn = document.createElement('button');
    stopBtn.id = 'zHUDStopRecordBtn';
    stopBtn.className = 'z-tools-btn z-tools-btn-secondary';
    stopBtn.textContent = '⏹ Stop Recording';
    stopBtn.title = 'Stop recording and save session';
    stopBtn.disabled = true;
    stopBtn.addEventListener('click', () => {
      if (window.ZChronicle && typeof window.ZChronicle.stopRecord === 'function') {
        window.ZChronicle.stopRecord();
        updateRecordingStatus('Recording saved');
      }
    });

    const clearBtn = document.createElement('button');
    clearBtn.id = 'zHUDClearBtn';
    clearBtn.className = 'z-tools-btn z-tools-btn-subtle';
    clearBtn.textContent = '🗑 Clear';
    clearBtn.title = 'Clear current recording data';
    clearBtn.addEventListener('click', () => {
      if (window.ZChronicle && typeof window.ZChronicle.clear === 'function') {
        window.ZChronicle.clear();
        updateRecordingStatus('Data cleared');
      }
    });

    recordControls.appendChild(startBtn);
    recordControls.appendChild(stopBtn);
    recordControls.appendChild(clearBtn);

    // Statistics display
    const stats = document.createElement('div');
    stats.className = 'z-tools-stats';
    stats.innerHTML = `
      <span class="z-tools-stat-item">
        <span class="z-tools-stat-label">Entries:</span>
        <span id="zHUDEntryCount">0</span>
      </span>
      <span class="z-tools-stat-item">
        <span class="z-tools-stat-label">Duration:</span>
        <span id="zHUDDuration">0s</span>
      </span>
      <span class="z-tools-stat-item">
        <span class="z-tools-stat-label">Mode:</span>
        <span id="zHUDMode">Neutral</span>
      </span>
    `;

    bar.appendChild(recordStatus);
    bar.appendChild(recordControls);
    bar.appendChild(stats);

    return bar;
  };

  /**
   * Update recording status text
   */
  const updateRecordingStatus = (text) => {
    const statusEl = document.getElementById('zRecordingStatus');
    if (statusEl) statusEl.textContent = text;
  };

  /**
   * Update indicator values from energy/harmony/emotion data
   */
  const updateIndicators = () => {
    // Get energy and harmony from ZEnergyResponse
    if (window.ZEnergyResponse && typeof window.ZEnergyResponse.getEnergy === 'function') {
      const energy = Math.round(window.ZEnergyResponse.getEnergy());
      const harmony = Math.round(window.ZEnergyResponse.getHarmony());

      const energyEl = document.getElementById('zHUDEnergyValue');
      const harmonyEl = document.getElementById('zHUDHarmonyValue');

      if (energyEl) energyEl.textContent = `${energy}%`;
      if (harmonyEl) harmonyEl.textContent = `${harmony}%`;
    }

    // Get emotional coherence from ZEmotionFilter
    if (window.ZEmotionFilter && typeof window.ZEmotionFilter.getEmotionalState === 'function') {
      const emotionalState = window.ZEmotionFilter.getEmotionalState();
      const coherenceEl = document.getElementById('zHUDCoherenceValue');
      const modeEl = document.getElementById('zHUDMode');

      if (coherenceEl) coherenceEl.textContent = `${emotionalState.coherence}%`;
      if (modeEl)
        modeEl.textContent =
          emotionalState.mode.charAt(0).toUpperCase() + emotionalState.mode.slice(1);
    }

    // Update bar colors based on coherence
    updateBarColors();
  };

  /**
   * Update bar visual state based on system health
   */
  const updateBarColors = () => {
    if (!indicatorBar) return;

    const coherence = window.ZEmotionFilter?.getEmotionalState?.()?.coherence || 50;

    if (coherence > 80) {
      indicatorBar.className = 'z-indicator-bar z-indicator-bar-amplified';
    } else if (coherence > 65) {
      indicatorBar.className = 'z-indicator-bar z-indicator-bar-receptive';
    } else if (coherence > 45) {
      indicatorBar.className = 'z-indicator-bar z-indicator-bar-damped';
    } else {
      indicatorBar.className = 'z-indicator-bar z-indicator-bar-neutral';
    }
  };

  /**
   * Initialize HUD - create and insert bars into DOM
   */
  const init = () => {
    if (isInitialized) return;

    // Always wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', performInit);
    } else if (document.readyState === 'interactive') {
      // DOM is interactive but might still be loading scripts
      requestAnimationFrame(performInit);
    } else {
      // DOM is completely ready
      performInit();
    }
  };

  const performInit = () => {
    try {
      if (isInitialized) return; // Guard against multiple calls

      // Create bars
      indicatorBar = createIndicatorBar();
      toolsBar = createToolsBar();

      // Insert at top of body
      if (indicatorBar) {
        document.body.insertBefore(indicatorBar, document.body.firstChild);
      }

      // Insert at bottom of body
      if (toolsBar) {
        document.body.appendChild(toolsBar);
      }

      isInitialized = true;

      // Start updating indicators every 2 seconds
      setInterval(updateIndicators, 2000);
      updateIndicators();

      if (window.ZStatusConsole && typeof window.ZStatusConsole.log === 'function') {
        window.ZStatusConsole.log('[HUD] Indicator and tools bars initialized', 'active');
      } else {
        console.log('[HUD] Z-Chronicle HUD bars created and rendering');
      }
    } catch (e) {
      console.error('[HUD] Failed to initialize bars:', e);
    }
  };

  /**
   * Display chronicle data (called when recording completes)
   */
  const display = (data) => {
    if (!data) return;

    // Update entry count
    const entryCountEl = document.getElementById('zHUDEntryCount');
    if (entryCountEl && data.entries) {
      entryCountEl.textContent = data.entries.length;
    }

    // Update duration
    const durationEl = document.getElementById('zHUDDuration');
    if (durationEl && data.duration) {
      const seconds = Math.round(data.duration / 1000);
      durationEl.textContent = `${seconds}s`;
    }

    console.log('[HUD] Chronicle data displayed:', data);
  };

  return {
    init,
    display,
    updateIndicators,
  };
})();

window.ZChronicleHUD = ZChronicleHUD;

// Initialize on script load
ZChronicleHUD.init();
