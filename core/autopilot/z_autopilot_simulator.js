// Z: core\autopilot\z_autopilot_simulator.js
// Simulation Mode (sandboxed, dry-run).
(function () {
  const toggleBtn = document.getElementById('zSimToggleBtn');
  const startBtn = document.getElementById('zSimStartBtn');
  const stopBtn = document.getElementById('zSimStopBtn');
  const scenarioSelect = document.getElementById('zSimScenarioSelect');
  const readoutEl = document.getElementById('zSimReadout');
  const chaosBtn = document.getElementById('zSimChaosBtn');
  const stressBtn = document.getElementById('zSimStressBtn');
  const freezeBtn = document.getElementById('zSimFreezeBtn');
  const fullBtn = document.getElementById('zSimFullBtn');
  const resetBtn = document.getElementById('zSimResetBtn');
  const statusEl = document.getElementById('zSimStatus');

  if (!toggleBtn || !startBtn || !stopBtn || !scenarioSelect) return;

  const STORAGE_KEYS = [
    'zPanelState',
    'zLayoutPreset',
    'zLayoutPresetLast',
    'zCalmMode',
    'zNightModeOverride',
    'zAutoLayoutEnabled',
  ];

  const shadowStorage = new Map();
  let backup = null;
  let stressTimer = null;
  let guidanceNote = '';

  function setStatus(text) {
    if (statusEl) statusEl.textContent = text;
  }

  function clamp01(value) {
    return Math.max(0, Math.min(1, value));
  }

  function getGuidance() {
    const metrics = window.ZSystemMetrics?.get?.() || {};
    const stress = Number.isFinite(metrics.stress) ? metrics.stress : 0.3;
    const risk = metrics.riskClass || 'low';
    const highStress = stress >= 0.7 || risk === 'high' || risk === 'sacred';
    return {
      highStress,
      note: highStress
        ? 'RKPK guidance: Calm simulation recommended (slower tick).'
        : 'Simulation guidance: steady.',
    };
  }

  function applyGuidance() {
    const guidance = getGuidance();
    guidanceNote = guidance.note;
    if (guidance.highStress) {
      ZSim.tickMs = Math.max(ZSim.tickMs, 2200);
      if (!ZSim.ctx.notes.includes('RKPK guidance: Calm simulation recommended.')) {
        ZSim.ctx.notes.push('RKPK guidance: Calm simulation recommended.');
      }
    }
    return guidance;
  }

  function safeReplay(entry) {
    try {
      if (window.ZAutopilotReplay?.record) {
        window.ZAutopilotReplay.record(entry);
      } else if (window.ZAutopilotReplay?.log) {
        window.ZAutopilotReplay.log(entry);
      } else {
        console.log('Replay:', entry);
      }
    } catch (err) {
      console.log('Replay blocked (sim storage).');
    }
  }

  const ZSim = {
    enabled: false,
    scenario: 'baseline',
    tickMs: 1500,
    timer: null,
    ctx: {
      mood: 'neutral',
      stress: 0.2,
      fatigue: 0.2,
      chaos: 0.2,
      notes: [],
    },
    _origFetch: null,
    _origStorage: null,
    _origRemoveItem: null,
    _origClear: null,
    _origGetItem: null,
    _origSetItem: null,
    _towerFrozen: null,

    enable() {
      if (this.enabled) return;
      this.enabled = true;
      window.ZSimulationActive = true;
      snapshotState();

      this._origFetch = window.fetch;
      window.fetch = async () => {
        throw new Error('ZSim enabled: network calls blocked.');
      };

      this._origGetItem = localStorage.getItem;
      this._origSetItem = localStorage.setItem;
      this._origRemoveItem = localStorage.removeItem;
      this._origClear = localStorage.clear;

      localStorage.getItem = (key) => {
        if (shadowStorage.has(key)) return shadowStorage.get(key);
        return this._origGetItem.call(localStorage, key);
      };
      localStorage.setItem = (key, value) => {
        shadowStorage.set(key, String(value));
      };
      localStorage.removeItem = (key) => {
        shadowStorage.delete(key);
      };
      localStorage.clear = () => {
        shadowStorage.clear();
      };

      this._towerFrozen = window.ZAITower?.frozen ?? null;
      setStatus('Simulation enabled.');
    },

    disable() {
      if (!this.enabled) return;
      this.enabled = false;
      window.ZSimulationActive = false;

      if (this._origFetch) window.fetch = this._origFetch;
      if (this._origGetItem) localStorage.getItem = this._origGetItem;
      if (this._origSetItem) localStorage.setItem = this._origSetItem;
      if (this._origRemoveItem) localStorage.removeItem = this._origRemoveItem;
      if (this._origClear) localStorage.clear = this._origClear;

      if (window.ZAITower && this._towerFrozen !== null) {
        window.ZAITower.frozen = this._towerFrozen;
        window.ZAITower.status = this._towerFrozen ? 'frozen' : 'online';
      }

      this.stop();
      shadowStorage.clear();
      restoreState();
      setStatus('Simulation disabled.');
    },

    setScenario(name) {
      this.scenario = name;
      applyScenario(name);
      render();
      safeReplay({
        agent: 'ZSim',
        action: 'scenario_set',
        reason: `Scenario set: ${name}`,
        context: { scenario: name },
        simulated: true,
      });
    },

    start() {
      if (!this.enabled) this.enable();
      if (this.timer) return;
      this.timer = setInterval(() => this.tick(), this.tickMs);
      setStatus('Simulation running.');
    },

    stop() {
      if (!this.timer) return;
      clearInterval(this.timer);
      this.timer = null;
      setStatus('Simulation stopped.');
    },

    tick() {
      this.ctx.stress = clamp01(this.ctx.stress + (Math.random() - 0.5) * 0.08);
      this.ctx.chaos = clamp01(this.ctx.chaos + (Math.random() - 0.5) * 0.1);
      this.ctx.fatigue = clamp01(this.ctx.fatigue + (Math.random() - 0.5) * 0.06);

      const governance = {
        sim: true,
        skkFreeze: this.scenario === 'skk_governance_freeze',
        rkpkRescue:
          this.ctx.stress > 0.7 || this.ctx.fatigue > 0.8 || this.scenario === 'rkpk_calm_rescue',
        panelChaos: this.ctx.chaos > 0.8 || this.scenario === 'panel_chaos_storm',
      };

      const simContext = {
        ...this.ctx,
        governance,
        source: 'ZSim',
        time: new Date().toISOString(),
      };

      if (window.ZAITower) {
        window.ZAITower.frozen = governance.skkFreeze;
        window.ZAITower.status = governance.skkFreeze ? 'frozen' : 'online';
        window.ZAITower.runAllAgents?.(simContext, { dryRun: true });
      }

      safeReplay({
        agent: 'ZSim',
        action: 'tick',
        reason: 'Simulation tick executed (dry-run).',
        context: simContext,
        governance: {
          skk: governance.skkFreeze ? 'freeze' : 'ok',
          rkpk: governance.rkpkRescue ? 'rescue' : 'ok',
        },
        simulated: true,
      });

      render();
    },
  };

  function snapshotState() {
    if (backup) return;
    backup = {};
    STORAGE_KEYS.forEach((key) => {
      backup[key] = localStorage.getItem(key);
    });
  }

  function restoreState() {
    if (!backup) return;
    STORAGE_KEYS.forEach((key) => {
      const value = backup[key];
      if (value === null || value === undefined) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, value);
      }
    });
    backup = null;
    if (window.ZLayoutOS?.applyLayout) {
      window.ZLayoutOS.applyLayout();
      window.ZLayoutOS.refreshPanelDirectoryState?.();
    }
  }

  function applyScenario(name) {
    ZSim.ctx = { mood: 'neutral', stress: 0.2, fatigue: 0.2, chaos: 0.2, notes: [] };
    if (name === 'rkpk_calm_rescue') {
      ZSim.ctx.mood = 'tired';
      ZSim.ctx.stress = 0.75;
      ZSim.ctx.fatigue = 0.85;
      ZSim.ctx.chaos = 0.4;
      ZSim.ctx.notes.push('High fatigue and stress -> RKPK should trigger calm.');
    }
    if (name === 'skk_governance_freeze') {
      ZSim.ctx.mood = 'alert';
      ZSim.ctx.stress = 0.55;
      ZSim.ctx.fatigue = 0.25;
      ZSim.ctx.chaos = 0.65;
      ZSim.ctx.notes.push('Governance check active -> SKK freeze should lock actions.');
    }
    if (name === 'panel_chaos_storm') {
      ZSim.ctx.mood = 'overwhelmed';
      ZSim.ctx.stress = 0.9;
      ZSim.ctx.fatigue = 0.6;
      ZSim.ctx.chaos = 0.95;
      ZSim.ctx.notes.push('Panel chaos rising -> stabilize preset and rescue.');
    }
    if (name === 'baseline') {
      ZSim.ctx.notes.push('Stable baseline. Expect maintain-balance decisions.');
    }
  }

  function render() {
    if (!readoutEl) return;
    const c = ZSim.ctx;
    readoutEl.textContent = [
      `Enabled : ${ZSim.enabled}`,
      `Scenario: ${ZSim.scenario}`,
      `Mood    : ${c.mood}`,
      `Stress  : ${Math.round(c.stress * 100)}%`,
      `Fatigue : ${Math.round(c.fatigue * 100)}%`,
      `Chaos   : ${Math.round(c.chaos * 100)}%`,
      `Guidance: ${guidanceNote || 'none'}`,
      `Notes   : ${c.notes.join(' | ') || 'none'}`,
    ].join('\n');
  }

  function injectChaos() {
    snapshotState();
    ZSim.setScenario('panel_chaos_storm');
    ZSim.tick();
    setStatus('Chaos injected (sim).');
  }

  function injectStress() {
    snapshotState();
    ZSim.setScenario('rkpk_calm_rescue');
    ZSim.tick();
    setStatus('Stress injected (sim).');
  }

  function injectFreeze() {
    snapshotState();
    ZSim.setScenario('skk_governance_freeze');
    ZSim.tick();
    setStatus('Freeze injected (sim).');
  }

  function runFullTest() {
    injectChaos();
    setTimeout(injectStress, 3000);
    setTimeout(injectFreeze, 6000);
    setStatus('Full test running (sim).');
  }

  function resetSim() {
    if (stressTimer) clearTimeout(stressTimer);
    restoreState();
    setStatus('Simulation reset.');
    render();
  }

  toggleBtn.addEventListener('click', () => {
    if (!ZSim.enabled) {
      ZSim.enable();
      toggleBtn.textContent = 'Disable';
    } else {
      ZSim.disable();
      toggleBtn.textContent = 'Enable';
    }
    render();
  });

  startBtn.addEventListener('click', () => {
    const guidance = applyGuidance();
    if (guidance && guidance.highStress) {
      setStatus(guidance.note);
    }
    ZSim.start();
    render();
  });
  stopBtn.addEventListener('click', () => {
    ZSim.stop();
    render();
  });
  scenarioSelect.addEventListener('change', (event) => {
    ZSim.setScenario(event.target.value);
    applyGuidance();
    render();
  });

  if (chaosBtn) chaosBtn.addEventListener('click', injectChaos);
  if (stressBtn) stressBtn.addEventListener('click', injectStress);
  if (freezeBtn) freezeBtn.addEventListener('click', injectFreeze);
  if (fullBtn) fullBtn.addEventListener('click', runFullTest);
  if (resetBtn) resetBtn.addEventListener('click', resetSim);

  window.ZSim = ZSim;
  applyScenario(ZSim.scenario);
  applyGuidance();
  render();
  setStatus('Idle.');
})();
