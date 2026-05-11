// Z: core\z_ui_extras.js
// UI extras: layout, panel controls, heatmap, playback, chronicle sync status.
(function () {
  const STORAGE_KEY = 'zPanelState';
  const FEED_PAUSE_KEY = 'zMiniAiFeedPaused';
  const NIGHT_KEY = 'zNightModeOverride';
  const LAYOUT_PRESET_KEY = 'zLayoutPreset';
  const LAST_PRESET_KEY = 'zLayoutPresetLast';
  const CALM_MODE_KEY = 'zCalmMode';
  const COMPACT_CONTROLS_KEY = 'zCompactPanelControls';
  const COMPACT_EDGEBAR_KEY = 'zCompactEdgebar';
  const UI_DENSITY_KEY = 'zUiDensity';
  const REDUCE_MOTION_KEY = 'zReduceMotion';
  const ACCESSIBLE_ACTIONS_KEY = 'zAccessibleActions';
  const SINGLE_TAP_MODE_KEY = 'zSingleTapMode';
  const UI_GUARD_METRICS_KEY = 'zUiGuardMetrics';
  const FOCUS_QUEUE_MODE_KEY = 'zFocusQueueMode';
  const AUTO_SCROLL_SPEED_KEY = 'zAutoScrollSpeed';
  const AUTO_SCROLL_PANEL_SPEEDS_KEY = 'zAutoScrollPanelSpeeds';
  const TOP_TAB_ROTATION_KEY = 'zTopTabRotationEnabled';
  const TOP_TAB_ROTATION_SPEED_KEY = 'zTopTabRotationSpeed';
  const TOP_TAB_ROTATION_SCOPE_KEY = 'zTopTabRotationScope';
  const PRIORITY_RESOLUTION_MEMORY_KEY = 'zPriorityResolutionMemory';
  const HIVE_GLOW_KEY = 'zHiveGlow';
  const HIVE_SPIN_KEY = 'zHiveSpin';
  const HIVE_SPIN_SPEED_KEY = 'zHiveSpinSpeed';
  const HIVE_3D_KEY = 'zHive3d';
  const VOICE_CONTROL_KEY = 'zVoiceControlEnabled';
  const LISTENING_KEY = 'zListeningConsent';
  const VOICE_WHISPER_KEY = 'zVoiceWhisperEnabled';
  const AUTO_LAYOUT_KEY = 'zAutoLayoutEnabled';
  const AUTOPILOT_ENABLED_KEY = 'zAutopilotDevEnabled';
  const AUTOPILOT_OVERRIDE_KEY = 'zAutopilotOverrideUntil';
  const AUTOPILOT_FREEZE_KEY = 'zAutopilotFreeze';
  const AUTOPILOT_LAST_ACTION_KEY = 'zAutopilotLastAction';
  const SPLIT_LAYOUT_KEY = 'zSplitLayoutMode';
  const UI_ZOOM_KEY = 'zUiZoomLevel';
  const UI_ZOOM_DEVICE_PROFILES_KEY = 'zUiZoomDeviceProfiles';
  const UI_ZOOM_DEFAULT = 0.5;
  const UI_ZOOM_MIN = 0.5;
  const UI_ZOOM_MAX = 1.2;
  const GRID_LAYOUT_KEY = 'zLayoutGridV1';
  const HIVE_LAYOUT_KEY = 'zHiveLayout';
  const STATUS_RAIL_COLLAPSED_KEY = 'zStatusRailCollapsed';
  let zPopoutTabRef = null;
  const INTELLIGENCE_OPTIN_KEY = 'zIntelligencePanelOptIn';
  const INTELLIGENCE_LOCK_KEY = 'zIntelligencePanelLocked';
  const LOCKED_PANELS = new Set(['zGovernance', 'zCompanion3dPanel']);
  const layoutDefaults = {
    panels: {
      zDashboard: { docked: true, column: 'center', order: 1 },
      zPanelDirectory: { docked: true, column: 'left', order: 2 },
      zAwarenessPanel: { docked: true, column: 'center', order: 2 },
      zChroniclePanel: { docked: true, column: 'center', order: 3 },
      zGovernance: { docked: true, column: 'center', order: 4 },
      zPriorityPanel: { docked: true, column: 'right', order: 2 },
      zWisdomRingPanel: { docked: true, column: 'right', order: 3 },
      zModuleRegistryPanel: { docked: true, column: 'right', order: 4 },
      zTaskListPanel: { docked: true, column: 'right', order: 4.5 },
      zGovTimelinePanel: { docked: true, column: 'right', order: 5 },
      zAutopilotStatusPanel: { docked: true, column: 'right', order: 6 },
      zCodexPanel: { docked: true, column: 'right', order: 7 },
      zCreatorProtocolPanel: { docked: true, column: 'right', order: 8 },
      zCodexSuggestionsPanel: { docked: true, column: 'right', order: 9 },
      zCompanion3dPanel: { docked: true, column: 'right', order: 10 },
      zAutopilotDebugPanel: { docked: true, column: 'right', order: 11 },
      zAutopilotReplayPanel: { docked: true, column: 'right', order: 12 },
      zAutopilotSimPanel: { docked: true, column: 'right', order: 13 },
      zGovernanceReportPanel: { docked: true, column: 'right', order: 14 },
      zGovernanceReviewPanel: { docked: true, column: 'right', order: 15 },
      zChainViewPanel: { docked: true, column: 'right', order: 16 },
      zScreenRecorderPanel: { docked: true, column: 'right', order: 17 },
      zInsightLabPanel: { docked: true, column: 'center', order: 5 },
      zIntelligencePanel: { docked: true, column: 'right', order: 19 },
      zSocialPanel: { docked: true, column: 'right', order: 20 },
      zFormulaRegistryPanel: { docked: true, column: 'right', order: 21 },
      zFolderManagerPanel: { docked: true, column: 'right', order: 22 },
      zVaultStatusPanel: { docked: true, column: 'right', order: 0.5 },
      zPublicMirrorPanel: { docked: true, column: 'right', order: 0.75 },
      'trust-certificate': { docked: true, column: 'right', order: 0.85 },
      zMasterControlPanel: { docked: false, column: 'right', order: 6 },
      zAutocompletePanel: { docked: false, column: 'left', order: 3 },
      zRecentSuggestions: { docked: false, column: 'right', order: 4 },
    },
  };

  const PANEL_SIZE_CONFIG_PATH = '../config/z_panel_size_base.json';
  const PANEL_SIZE_MAP = {};
  const PANEL_COLUMN_HINTS = {};
  const PANEL_SIZE_DEFAULTS = { length: 'medium' };
  const PANEL_LENGTH_PRIORITY = { short: 0, medium: 1, tall: 2 };

  async function loadPanelSizeConfig() {
    try {
      const response = await fetch(PANEL_SIZE_CONFIG_PATH, { cache: 'no-store' });
      if (!response.ok) return;
      const payload = await response.json();
      if (payload?.defaults?.length) {
        PANEL_SIZE_DEFAULTS.length = payload.defaults.length;
      }
      if (payload?.panels && typeof payload.panels === 'object') {
        Object.assign(PANEL_SIZE_MAP, payload.panels);
        if (typeof applyLayout === 'function') {
          applyLayout(layoutDefaults);
        }
      }
      if (payload?.columns && typeof payload.columns === 'object') {
        Object.entries(payload.columns).forEach(([length, column]) => {
          if (typeof length === 'string' && typeof column === 'string') {
            PANEL_COLUMN_HINTS[length] = column;
          }
        });
      }
    } catch {
      // Ignore fetch failures; defaults remain.
    }
  }

  function panelLengthPriority(panel) {
    if (!panel) return PANEL_LENGTH_PRIORITY.medium;
    const length = panel.dataset.length || PANEL_SIZE_DEFAULTS.length;
    return PANEL_LENGTH_PRIORITY[length] ?? PANEL_LENGTH_PRIORITY.medium;
  }

  loadPanelSizeConfig();

  const LAYOUT_PRESETS = {
    focus: {
      label: 'Focus',
      mode: 'focus',
      panels: ['zDashboard', 'zAwarenessPanel', 'zCompanion3dPanel'],
    },
    analysis: {
      label: 'Analysis',
      mode: 'grid',
      panels: [
        'zDashboard',
        'zPanelDirectory',
        'zAwarenessPanel',
        'zChroniclePanel',
        'zModuleRegistryPanel',
        'zCodexSuggestionsPanel',
        'zIntelligencePanel',
        'zSocialPanel',
      ],
    },
    governance: {
      label: 'Governance',
      mode: 'grid',
      panels: [
        'zPanelDirectory',
        'zGovernance',
        'zPriorityPanel',
        'zWisdomRingPanel',
        'zModuleRegistryPanel',
        'zGovTimelinePanel',
        'zCodexPanel',
        'zCreatorProtocolPanel',
        'zCompanion3dPanel',
        'zAutopilotDebugPanel',
        'zAutopilotReplayPanel',
        'zGovernanceReportPanel',
        'zGovernanceReviewPanel',
        'zChainViewPanel',
        'zInsightLabPanel',
        'zIntelligencePanel',
        'zSocialPanel',
      ],
    },
    calm: {
      label: 'Calm',
      mode: 'focus',
      calmMode: true,
      panels: ['zCompanion3dPanel', 'zDashboard', 'zAwarenessPanel'],
    },
  };

  getSetting(LAYOUT_PRESET_KEY, 'analysis');
  let draggedPanel = null;
  let voiceController = null;
  let nightModeToggleBtn = null;
  let nightModeStatusEl = null;
  let prioritySnapshot = { updatedAt: '', items: [] };
  let focusQueueAutoState = { active: false, lastSwitchAt: 0 };
  const PRIORITY_PIN_RULES = {
    critical: { p0: 1, p1: 8, open: 12 },
    elevated: { p1: 3, open: 6 },
    recover: { p0: 0, p1: 1, open: 3 },
  };

  const PRIORITY_QUEUE_URL = '/data/Z_priority_queue.json';
  const CODEX_REPORT_URL = '/data/Z_codex_report.json';

  function readJson(raw, fallback) {
    try {
      return JSON.parse(raw);
    } catch (err) {
      return fallback;
    }
  }

  async function loadTaskList() {
    const list = document.getElementById('zTaskListItems');
    const activeEl = document.getElementById('zTaskActiveCount');
    const pendingEl = document.getElementById('zTaskPendingCount');
    const plannedEl = document.getElementById('zTaskPlannedCount');
    if (!list || !activeEl || !pendingEl || !plannedEl) return;
    try {
      let data = null;
      const res = await fetch('../data/Z_task_list.json', { cache: 'no-store' });
      if (res.ok) {
        data = await res.json();
      } else {
        const legacy = await fetch('../data/z_task_list.json', { cache: 'no-store' });
        if (!legacy.ok) throw new Error('Task list unavailable');
        data = await legacy.json();
      }
      const tasks = Array.isArray(data?.ZTasks)
        ? data.ZTasks
        : Array.isArray(data?.tasks)
          ? data.tasks
          : [];
      const normalizeStatus = (value) => String(value || '').toLowerCase();
      const active = tasks.filter((t) => normalizeStatus(t.ZStatus ?? t.status) === 'active');
      const pending = tasks.filter((t) => normalizeStatus(t.ZStatus ?? t.status) === 'pending');
      const planned = tasks.filter((t) => normalizeStatus(t.ZStatus ?? t.status) === 'planned');
      activeEl.textContent = String(active.length);
      pendingEl.textContent = String(pending.length);
      plannedEl.textContent = String(planned.length);
      list.innerHTML = '';
      tasks.slice(0, 6).forEach((task) => {
        const li = document.createElement('li');
        li.textContent = withZPrefix(task.ZTitle || task.title || task.ZId || task.id || 'Task');
        list.appendChild(li);
      });
    } catch {
      list.innerHTML = '<li>Task list pending sync.</li>';
      activeEl.textContent = '0';
      pendingEl.textContent = '0';
      plannedEl.textContent = '0';
    }
  }

  function withZPrefix(label) {
    if (!label) return label;
    const trimmed = String(label).trim();
    if (!trimmed) return trimmed;
    if (trimmed.startsWith('Z-') || trimmed.startsWith('Z ')) return trimmed;
    return `Z ${trimmed}`;
  }

  function getStoredState() {
    return readJson(localStorage.getItem(STORAGE_KEY) || '{}', {});
  }

  function saveStoredState(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function updatePanelVisibility(panelId, visible, authority = 'preset') {
    const state = getStoredState();
    const current = state[panelId] || {};
    const entry = {
      ...current,
      hidden: !visible,
      authority,
      lastUpdated: Date.now(),
    };
    state[panelId] = entry;
    saveStoredState(state);
    refreshLens(authority);
    return entry;
  }

  function setHidden(panelId, hidden, options = {}) {
    if (!panelId || LOCKED_PANELS.has(panelId)) return;
    const authority = options.authority || (options.manual ? 'manual' : 'preset');
    const visible = !hidden;
    return updatePanelVisibility(panelId, visible, authority);
  }

  function setLensMode(mode) {
    updateLensMode(mode);
  }

  let currentAuthority = 'preset';
  let governanceHoldActive = false;
  const LENS_THRESHOLDS = {
    calm: { stress: 0.68 },
    focus: { scatter: 0.65 },
    governance: { risk: 0.5 },
  };
  const SUGGESTION_COOLDOWN = 5 * 60 * 1000;
  window.Z_LENS_STATE = { mode: 'neutral' };
  window.Z_LENS_SUGGESTION = { lastSuggested: null, cooldownUntil: 0 };
  window.Z_LENS_MEMORY = readJson(localStorage.getItem('zLensMemory') || '{}', {
    calm: { accepted: 0, dismissed: 0 },
    focus: { accepted: 0, dismissed: 0 },
    governance: { accepted: 0, dismissed: 0 },
  });
  const lenses = ['calm', 'focus', 'governance'];
  window.Z_LENS_STATE = { mode: 'neutral' };

  function updateLensMode(mode) {
    const normalized = lenses.includes(mode) ? mode : 'neutral';
    window.Z_LENS_STATE.mode = normalized;
    document.body.setAttribute('data-lens-mode', normalized);
    document.querySelectorAll('#lens-mode-toggle button').forEach((btn) => {
      const btnMode = btn.dataset.lensMode;
      if (!btnMode) return;
      btn.classList.toggle('active', btnMode === normalized);
    });
  }

  function initLensModeControls() {
    const container = document.getElementById('lens-mode-toggle');
    if (!container) return;
    container.addEventListener('click', (event) => {
      const button = event.target.closest('button');
      if (!button) return;
      const mode = button.dataset.lensMode;
      updateLensMode(mode);
    });
    updateLensMode('neutral');
  }

  function lensConfidence(mode) {
    const entry = window.Z_LENS_MEMORY[mode];
    if (!entry) return 0.5;
    const total = entry.accepted + entry.dismissed;
    if (!total) return 0.5;
    return entry.accepted / total;
  }

  function lensNarrator(mode) {
    if (mode === 'governance') return 'SKK: This lens reasons with proofs.';
    return 'RKPK: You chose this before; it helped.';
  }

  function dismissLensSuggestion(toast, cooldown = false) {
    if (!toast) return;
    toast.remove();
    if (cooldown) {
      window.Z_LENS_SUGGESTION.cooldownUntil = Date.now() + SUGGESTION_COOLDOWN;
      recordLensMemory(window.Z_LENS_SUGGESTION.lastSuggested, false);
    }
  }

  function showLensSuggestion(mode, reason) {
    dismissLensSuggestion(document.querySelector('.lens-suggestion'));
    const toast = document.createElement('div');
    toast.className = 'lens-suggestion';
    const narrator = lensNarrator(mode);
    toast.innerHTML = `
      <span>${reason}. ${narrator}</span>
      <div>
        <button data-accept type="button">Apply</button>
        <button data-dismiss type="button">Dismiss</button>
      </div>
    `;
    document.body.appendChild(toast);
    toast.querySelector('[data-accept]').addEventListener('click', () => {
      setLensMode(mode, true);
      recordLensMemory(mode, true);
      dismissLensSuggestion(toast);
    });
    toast.querySelector('[data-dismiss]').addEventListener('click', () => {
      dismissLensSuggestion(toast, true);
    });
    window.Z_LENS_SUGGESTION.lastSuggested = mode;
  }

  function evaluateLensSuggestion() {
    const now = Date.now();
    if (now < window.Z_LENS_SUGGESTION.cooldownUntil) return;
    const status = window.ZAutoPilot?.getStatus?.();
    const signals = {
      stress: status?.stress ?? 0.3,
      scatter: getVisiblePanelsCount() / 18,
      risk: window.ZGovernanceHUD?.getState?.().riskScore ?? 0.25,
    };
    let suggestion = null;
    let reason = '';
    if (signals.stress > LENS_THRESHOLDS.calm.stress) {
      suggestion = 'calm';
      reason = 'Stress levels rose';
    } else if (signals.scatter > LENS_THRESHOLDS.focus.scatter) {
      suggestion = 'focus';
      reason = 'Attention is scattered';
    } else if (signals.risk > LENS_THRESHOLDS.governance.risk) {
      suggestion = 'governance';
      reason = 'Governance tension is rising';
    }
    if (
      suggestion &&
      suggestion !== window.Z_LENS_STATE.mode &&
      lensConfidence(suggestion) >= 0.35
    ) {
      showLensSuggestion(suggestion, reason);
    }
  }

  function initLensSuggestionLoop() {
    setInterval(evaluateLensSuggestion, 8000);
  }

  function refreshLens(authority) {
    if (authority) currentAuthority = authority;
    window.ZLensStatus?.set(currentAuthority, governanceHoldActive);
  }

  function setGovernanceHold(active) {
    governanceHoldActive = Boolean(active);
    window.ZLensStatus?.set(currentAuthority, governanceHoldActive);
  }

  function resetManualOverrides() {
    const state = getStoredState();
    let changed = false;
    Object.entries(state).forEach(([panelId, entry]) => {
      if (entry.authority === 'manual') {
        state[panelId] = { ...entry, authority: 'preset' };
        changed = true;
      }
    });
    if (changed) {
      saveStoredState(state);
      applyLayout(layoutDefaults);
      refreshPanelDirectoryState();
      noteUserLayoutChange();
    }
    return changed;
  }

  function recordLensMemory(mode, accepted) {
    if (!mode || !window.Z_LENS_MEMORY[mode]) return;
    const entry = window.Z_LENS_MEMORY[mode];
    if (accepted) entry.accepted += 1;
    else entry.dismissed += 1;
    localStorage.setItem('zLensMemory', JSON.stringify(window.Z_LENS_MEMORY));
  }

  function getSetting(key, fallback) {
    try {
      const value = localStorage.getItem(key);
      return value === null ? fallback : value;
    } catch (err) {
      return fallback;
    }
  }

  function setSetting(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (err) {
      // Ignore storage failures.
    }
  }

  function getBooleanSetting(key, fallback = false) {
    const raw = getSetting(key, null);
    if (raw === null) return fallback;
    return raw === 'true' || raw === '1';
  }

  function readUiGuardMetrics() {
    try {
      const raw = localStorage.getItem(UI_GUARD_METRICS_KEY);
      if (!raw) return { version: 1, updated_at: null, totals: {}, panels: {} };
      const parsed = JSON.parse(raw);
      return {
        version: 1,
        updated_at: parsed?.updated_at || null,
        totals: parsed?.totals || {},
        panels: parsed?.panels || {},
      };
    } catch {
      return { version: 1, updated_at: null, totals: {}, panels: {} };
    }
  }

  function writeUiGuardMetrics(next) {
    try {
      localStorage.setItem(UI_GUARD_METRICS_KEY, JSON.stringify(next));
    } catch {
      // Ignore storage failures.
    }
  }

  function recordUiGuardEvent(panelId, eventName) {
    if (!panelId || !eventName) return;
    const now = new Date().toISOString();
    const metrics = readUiGuardMetrics();
    const totals = { ...(metrics.totals || {}) };
    const panels = { ...(metrics.panels || {}) };
    const currentPanel = { ...(panels[panelId] || {}) };
    totals[eventName] = Number(totals[eventName] || 0) + 1;
    currentPanel[eventName] = Number(currentPanel[eventName] || 0) + 1;
    panels[panelId] = currentPanel;
    const next = { version: 1, updated_at: now, totals, panels };
    writeUiGuardMetrics(next);
    window.ZChronicle?.write?.({
      type: 'z.ui.interaction_guard',
      panel_id: panelId,
      event: eventName,
      ts: now,
    });
  }

  function isListeningAllowed() {
    return getBooleanSetting(LISTENING_KEY, false);
  }

  function isVoiceWhisperAllowed() {
    return getBooleanSetting(VOICE_WHISPER_KEY, false);
  }

  function refreshConsentGlobals() {
    window.ZConsent = {
      listening: isListeningAllowed(),
      voiceWhisper: isVoiceWhisperAllowed(),
      setListening: (enabled) => setListeningConsent(enabled, { announce: false }),
      setVoiceWhisper: (enabled) => setVoiceWhisper(enabled, { announce: false }),
    };
  }

  function applyNightMode() {
    const override = getSetting(NIGHT_KEY, 'auto');
    const hour = new Date().getHours();
    const autoEnabled = hour >= 22 || hour < 6;
    const enabled = override === 'on' ? true : override === 'off' ? false : autoEnabled;

    document.body.classList.toggle('z-night-mode', enabled);
    window.ZNightMode = enabled;
    try {
      window.dispatchEvent(new CustomEvent('znightmodechange', { detail: { enabled, override } }));
    } catch (err) {
      // Ignore missing CustomEvent support.
    }

    if (!window.ZNightModeControl) {
      window.ZNightModeControl = {
        set: (on) => setNightModeOverride(on ? 'on' : 'off'),
        isOn: () => document.body.classList.contains('z-night-mode'),
      };
    }

    if (nightModeToggleBtn) {
      const label = override === 'on' ? 'On' : override === 'off' ? 'Off' : 'Auto';
      nightModeToggleBtn.textContent = `Night Mode: ${label}`;
    }
    if (nightModeStatusEl) {
      nightModeStatusEl.textContent = enabled ? 'Active' : 'Inactive';
    }
  }

  function normalizePriorityQueue(queue) {
    const rawItems = Array.isArray(queue.ZItems)
      ? queue.ZItems
      : Array.isArray(queue.items)
        ? queue.items
        : [];
    const items = rawItems.map((item) => ({
      id: item.ZId || item.id,
      title: item.ZTitle || item.title,
      priority: item.ZPriority || item.priority,
      status: item.ZStatus || item.status,
      source: item.ZSource || item.source,
      createdAt: item.ZCreatedAt || item.createdAt,
    }));
    return {
      updatedAt: queue.ZUpdatedAt || queue.updatedAt || '',
      items,
    };
  }

  function codexRepeatBlockers(report) {
    const repeaters = Array.isArray(report.ZRepeatIssues)
      ? report.ZRepeatIssues
      : Array.isArray(report.repeatIssues)
        ? report.repeatIssues
        : Array.isArray(report.ZIssues)
          ? report.ZIssues
          : [];
    return repeaters.map((issue, idx) => {
      const code =
        issue.ZCode || issue.code || issue.ZRule || issue.rule || issue.id || `repeat-${idx + 1}`;
      return {
        id: `codex:${String(code).trim().replace(/\s+/g, '-')}`,
        title:
          issue.ZMessage ||
          issue.message ||
          issue.ZTitle ||
          issue.title ||
          issue.ZRule ||
          issue.rule ||
          issue.ZCode ||
          issue.code ||
          'Repeat issue',
        priority: 'P1',
        status: 'open',
        source: 'codex',
        createdAt: issue.ZFirstSeen || issue.firstSeen || '',
      };
    });
  }

  function mergePriorityItems(queueItems, blockers) {
    const seen = new Set();
    const merged = [];
    queueItems.concat(blockers).forEach((item) => {
      if (!item || !item.id) return;
      if (seen.has(item.id)) return;
      seen.add(item.id);
      merged.push(item);
    });
    return merged;
  }

  function sortPriorityItems(items) {
    const weight = { P0: 0, P1: 1, P2: 2, P3: 3 };
    const statusWeight = { open: 0, in_progress: 1, blocked: 2, done: 3 };
    return items.slice().sort((a, b) => {
      const pa = weight[a.priority] ?? 9;
      const pb = weight[b.priority] ?? 9;
      if (pa !== pb) return pa - pb;
      const sa = statusWeight[a.status] ?? 9;
      const sb = statusWeight[b.status] ?? 9;
      if (sa !== sb) return sa - sb;
      return String(a.createdAt || '').localeCompare(String(b.createdAt || ''));
    });
  }

  function getPriorityBlockers() {
    return sortPriorityItems(
      (prioritySnapshot.items || []).filter(
        (item) => (item.status || 'open') !== 'done' && ['P0', 'P1'].includes(item.priority)
      )
    ).slice(0, 5);
  }

  function readPriorityResolutionMemory() {
    try {
      const raw = localStorage.getItem(PRIORITY_RESOLUTION_MEMORY_KEY);
      if (!raw) return { items: {} };
      const parsed = JSON.parse(raw);
      return { items: parsed?.items || {} };
    } catch {
      return { items: {} };
    }
  }

  function writePriorityResolutionMemory(next) {
    try {
      localStorage.setItem(PRIORITY_RESOLUTION_MEMORY_KEY, JSON.stringify(next));
    } catch {
      // ignore storage failures
    }
  }

  function clearPriorityResolutionMemory() {
    try {
      localStorage.removeItem(PRIORITY_RESOLUTION_MEMORY_KEY);
      return true;
    } catch {
      return false;
    }
  }

  function updatePriorityResolutionMemory(items) {
    const memory = readPriorityResolutionMemory();
    const known = { ...(memory.items || {}) };
    const nowIso = new Date().toISOString();
    (Array.isArray(items) ? items : []).forEach((item) => {
      const id = String(item?.id || '').trim();
      if (!id) return;
      const prev = known[id] || {};
      known[id] = {
        id,
        source: item.source || prev.source || 'unknown',
        priority: String(item.priority || prev.priority || 'P3').toUpperCase(),
        status: String(item.status || prev.status || 'open').toLowerCase(),
        createdAt: item.createdAt || prev.createdAt || nowIso,
        firstSeenAt: prev.firstSeenAt || nowIso,
        lastSeenAt: nowIso,
        seenCount: Number(prev.seenCount || 0) + 1,
      };
    });
    writePriorityResolutionMemory({ items: known, updatedAt: nowIso });
    return { items: known };
  }

  function daysBetweenIso(fromIso, toIso = new Date().toISOString()) {
    const from = Date.parse(fromIso || '');
    const to = Date.parse(toIso || '');
    if (!Number.isFinite(from) || !Number.isFinite(to)) return 0;
    return Math.max(0, Math.floor((to - from) / (24 * 60 * 60 * 1000)));
  }

  function isKnownRecurringDebt(item, memory) {
    if (!item || !memory) return false;
    if (String(item.source || '').toLowerCase() !== 'codex') return false;
    const record = memory.items?.[item.id];
    if (!record) return false;
    const seenCount = Number(record.seenCount || 0);
    const ageDays = daysBetweenIso(record.firstSeenAt || item.createdAt);
    const priority = String(item.priority || '').toUpperCase();
    const status = String(item.status || 'open').toLowerCase();
    if (status === 'done') return false;
    if (priority === 'P0') return false;
    return seenCount >= 3 && ageDays >= 7;
  }

  function getPriorityPressure() {
    const items = Array.isArray(prioritySnapshot.items) ? prioritySnapshot.items : [];
    const memory = updatePriorityResolutionMemory(items);
    const actionable = items.filter((item) => {
      const status = String(item.status || 'open').toLowerCase();
      if (status === 'done') return false;
      if (isKnownRecurringDebt(item, memory)) return false;
      return true;
    });
    const open = actionable.length;
    const p1 = actionable.filter(
      (item) => String(item.priority || '').toUpperCase() === 'P1'
    ).length;
    const p0 = actionable.filter(
      (item) => String(item.priority || '').toUpperCase() === 'P0'
    ).length;
    const deferred = items.filter((item) => isKnownRecurringDebt(item, memory)).length;
    return { open, p1, p0, deferred };
  }

  function applyStatusPriorityPinning() {
    const rightColumn = document.querySelector('.z-layout-col[data-column="right"]');
    if (!rightColumn) return;
    const pressure = getPriorityPressure();
    const severe =
      pressure.p0 >= PRIORITY_PIN_RULES.critical.p0 ||
      pressure.p1 >= PRIORITY_PIN_RULES.critical.p1 ||
      pressure.open >= PRIORITY_PIN_RULES.critical.open;
    const elevated =
      !severe &&
      (pressure.p1 >= PRIORITY_PIN_RULES.elevated.p1 ||
        pressure.open >= PRIORITY_PIN_RULES.elevated.open);
    const pinMode = severe ? 'critical' : elevated ? 'elevated' : 'normal';
    document.body.setAttribute('data-priority-pin-mode', pinMode);
    const pinBadge = document.getElementById('zPriorityPinModeBadge');
    if (pinBadge) {
      if (pinBadge.dataset.bound !== '1') {
        pinBadge.dataset.bound = '1';
        pinBadge.setAttribute('role', 'button');
        pinBadge.setAttribute('tabindex', '0');
        pinBadge.style.cursor = 'pointer';
        const jumpToPriority = () => {
          revealPanel('zPriorityPanel', {
            userInitiated: true,
            intent: 'governance',
            label: 'Priority Board',
          });
        };
        pinBadge.addEventListener('click', jumpToPriority);
        pinBadge.addEventListener('keydown', (event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            jumpToPriority();
          }
        });
      }
      const label =
        pinMode === 'critical' ? 'CRITICAL' : pinMode === 'elevated' ? 'ELEVATED' : 'NORMAL';
      pinBadge.textContent = `Pin: ${label}`;
      pinBadge.title = `Priority pin mode (${label}) · open=${pressure.open}, p1=${pressure.p1}, p0=${pressure.p0}, deferred=${pressure.deferred || 0}`;
      pinBadge.classList.remove('edge-status-good', 'edge-status-warn', 'edge-status-bad');
      if (pinMode === 'critical') pinBadge.classList.add('edge-status-bad');
      else if (pinMode === 'elevated') pinBadge.classList.add('edge-status-warn');
      else pinBadge.classList.add('edge-status-good');
    }
    const sequence = severe
      ? [
          'zPriorityPanel',
          'zGovernance',
          'zAutopilotReplayPanel',
          'zTaskListPanel',
          'zModuleRegistryPanel',
        ]
      : elevated
        ? [
            'zPriorityPanel',
            'zTaskListPanel',
            'zGovernance',
            'zAutopilotReplayPanel',
            'zModuleRegistryPanel',
          ]
        : [
            'zGovernance',
            'zPriorityPanel',
            'zTaskListPanel',
            'zModuleRegistryPanel',
            'zAutopilotReplayPanel',
          ];

    rightColumn.querySelectorAll('.z-panel').forEach((panel) => {
      panel.removeAttribute('data-priority-pin');
      panel.removeAttribute('data-priority-pin-label');
    });

    sequence.forEach((panelId, index) => {
      const panel = document.getElementById(panelId);
      if (!panel) return;
      if (panel.dataset.docked !== 'true') return;
      panel.style.order = String(index + 0.1);
      if (pinMode === 'normal') return;
      panel.dataset.priorityPin = pinMode;
      panel.dataset.priorityPinLabel =
        pinMode === 'critical' ? 'Pinned: Critical' : 'Pinned: Elevated';
    });
  }

  function isFocusQueueModeEnabled() {
    return getSetting(FOCUS_QUEUE_MODE_KEY, '1') !== '0';
  }

  function setFocusQueueMode(enabled, options = {}) {
    setSetting(FOCUS_QUEUE_MODE_KEY, enabled ? '1' : '0');
    const btn = document.getElementById('zFocusQueueModeBtn');
    if (btn) {
      btn.textContent = enabled ? 'Focus Queue: Auto' : 'Focus Queue: Off';
      btn.setAttribute('aria-pressed', enabled ? 'true' : 'false');
    }
    if (!enabled) {
      focusQueueAutoState = { active: false, lastSwitchAt: Date.now() };
    }
    if (!options.skipNote) {
      noteUserLayoutChange();
    }
  }

  function applyFocusQueueAutoswitch() {
    if (!isFocusQueueModeEnabled()) return;
    const now = Date.now();
    const cooldownMs = 45000;
    if (now - focusQueueAutoState.lastSwitchAt < cooldownMs) return;
    const pressure = getPriorityPressure();
    const severe =
      pressure.p0 >= PRIORITY_PIN_RULES.critical.p0 ||
      pressure.p1 >= PRIORITY_PIN_RULES.critical.p1 ||
      pressure.open >= PRIORITY_PIN_RULES.critical.open;
    const recovered =
      pressure.p0 <= PRIORITY_PIN_RULES.recover.p0 &&
      pressure.p1 <= PRIORITY_PIN_RULES.recover.p1 &&
      pressure.open <= PRIORITY_PIN_RULES.recover.open;
    const currentPreset = getSetting(LAYOUT_PRESET_KEY, 'analysis');

    if (severe && !focusQueueAutoState.active && currentPreset !== 'governance') {
      setSetting(LAST_PRESET_KEY, currentPreset);
      focusQueueAutoState = { active: true, lastSwitchAt: now };
      applyLayoutPreset('governance', { force: true });
      revealPanel('zPriorityPanel', { intent: 'governance' });
      return;
    }

    if (focusQueueAutoState.active && recovered && currentPreset === 'governance') {
      const fallback = getSetting(LAST_PRESET_KEY, 'analysis');
      focusQueueAutoState = { active: false, lastSwitchAt: now };
      applyLayoutPreset(fallback, { force: true });
    }
  }

  function applyPriorityDrivenLayout() {
    applyStatusPriorityPinning();
    applyFocusQueueAutoswitch();
  }

  async function refreshPrioritySnapshot() {
    let queue = { updatedAt: '', items: [] };
    let codex = { repeatIssues: [] };
    try {
      let resp = await fetch(PRIORITY_QUEUE_URL, { cache: 'no-store' });
      if (!resp.ok) {
        resp = await fetch('/data/z_priority_queue.json', { cache: 'no-store' });
      }
      if (resp.ok) {
        const data = await resp.json();
        queue = {
          updatedAt: data.ZUpdatedAt ?? data.updatedAt ?? '',
          items: Array.isArray(data.ZItems)
            ? data.ZItems
            : Array.isArray(data.items)
              ? data.items
              : [],
        };
      }
    } catch (err) {
      queue = { updatedAt: '', items: [] };
    }
    try {
      let resp = await fetch(CODEX_REPORT_URL, { cache: 'no-store' });
      if (!resp.ok) {
        resp = await fetch('/data/z_codex_report.json', { cache: 'no-store' });
      }
      if (resp.ok) {
        const data = await resp.json();
        codex = {
          repeatIssues: Array.isArray(data.ZRepeatIssues)
            ? data.ZRepeatIssues
            : Array.isArray(data.repeatIssues)
              ? data.repeatIssues
              : Array.isArray(data.ZIssues)
                ? data.ZIssues
                : Array.isArray(data.issues)
                  ? data.issues
                  : [],
        };
      }
    } catch (err) {
      codex = { repeatIssues: [] };
    }
    const normalized = normalizePriorityQueue(queue);
    const blockers = codexRepeatBlockers(codex);
    prioritySnapshot = {
      updatedAt: normalized.updatedAt,
      items: mergePriorityItems(normalized.items, blockers),
    };
    applyPriorityDrivenLayout();
  }

  function isLockedPanel(panelId) {
    return LOCKED_PANELS.has(panelId);
  }

  function getFocusPanels() {
    const params = new URLSearchParams(window.location.search);
    const raw = params.get('panels');
    if (!raw) return new Set();
    return new Set(
      raw
        .split(',')
        .map((id) => id.trim())
        .filter(Boolean)
    );
  }

  function isPopoutMode() {
    const params = new URLSearchParams(window.location.search);
    return params.get('popout') === '1';
  }

  function applyFocusMode(focusPanels, presetMode) {
    const shouldFocus = focusPanels.size > 0 || presetMode === 'focus';
    document.body.classList.toggle('layout-focus', shouldFocus);
  }

  function openPopout(panelIds) {
    const url = new URL(window.location.href);
    url.searchParams.set('layout', 'focus');
    url.searchParams.set('panels', panelIds.join(','));
    url.searchParams.set('popout', '1');
    const targetName = 'zSanctuaryPopoutTab';
    if (zPopoutTabRef && !zPopoutTabRef.closed) {
      try {
        zPopoutTabRef.location.href = url.toString();
        zPopoutTabRef.focus();
        return;
      } catch {
        // Fallback to window.open if browser blocks direct reference access.
      }
    }
    zPopoutTabRef = window.open(url.toString(), targetName);
    if (zPopoutTabRef) {
      try {
        zPopoutTabRef.focus();
      } catch {
        // Ignore focus errors.
      }
    }
  }

  function initStatusRailToggle() {
    const btn = document.getElementById('zStatusRailToggleBtn');
    if (!btn) return;

    const apply = () => {
      const collapsed = getBooleanSetting(STATUS_RAIL_COLLAPSED_KEY, false);
      document.body.classList.toggle('z-status-rail-collapsed', collapsed);
      btn.textContent = collapsed ? 'Status Rail: Off' : 'Status Rail: On';
      btn.setAttribute('aria-pressed', collapsed ? 'true' : 'false');
    };

    btn.addEventListener('click', () => {
      const next = !getBooleanSetting(STATUS_RAIL_COLLAPSED_KEY, false);
      setSetting(STATUS_RAIL_COLLAPSED_KEY, next ? '1' : '0');
      apply();
      noteUserLayoutChange();
    });

    apply();
  }

  function initDashboardSearch() {
    const root = document.getElementById('zDashboardSearch');
    const input = document.getElementById('zDashboardSearchInput');
    const goBtn = document.getElementById('zDashboardSearchBtn');
    const clearBtn = document.getElementById('zDashboardSearchClearBtn');
    const suggestEl = document.getElementById('zDashboardSearchSuggest');
    if (!root || !input || !goBtn || !clearBtn || !suggestEl) return;
    root.classList.add('z-search-force-visible');
    root.style.display = 'flex';
    root.style.visibility = 'visible';
    root.style.opacity = '1';
    root.style.pointerEvents = 'auto';
    if (!document.body.classList.contains('z-popout-mode')) {
      root.style.left = '1rem';
      root.style.top = '2.6rem';
    }

    const allPanelIds = Object.keys(layoutDefaults?.panels || {});
    let activeSuggestionIndex = -1;
    let currentSuggestions = [];

    const getPanelLabel = (panel) => {
      if (!panel) return '';
      const explicit = panel.dataset?.title || '';
      if (explicit) return explicit;
      const titleEl = panel.querySelector('.z-panel-title, h3');
      return titleEl?.textContent?.trim() || panel.id || '';
    };

    const clearHighlights = () => {
      document
        .querySelectorAll('.z-panel.z-locate-pulse, .z-panel.z-locate-muted')
        .forEach((panel) => {
          panel.classList.remove('z-locate-pulse', 'z-locate-muted');
        });
    };

    const escapeHtml = (value) =>
      String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

    const highlightMatch = (text, query) => {
      const rawText = String(text || '');
      const q = String(query || '').trim();
      if (!q) return escapeHtml(rawText);
      const escapedQ = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(${escapedQ})`, 'ig');
      const parts = rawText.split(regex);
      return parts
        .map((part, idx) => (idx % 2 === 1 ? `<mark>${escapeHtml(part)}</mark>` : escapeHtml(part)))
        .join('');
    };

    const findPanelMatches = (query) => {
      const q = String(query || '')
        .trim()
        .toLowerCase();
      if (!q) return [];

      const panels = allPanelIds.map((id) => document.getElementById(id)).filter(Boolean);

      const scored = panels.map((panel) => {
        const title = getPanelLabel(panel).toLowerCase();
        const id = String(panel.id || '').toLowerCase();
        const content = String(panel.textContent || '')
          .toLowerCase()
          .slice(0, 8000);

        const titleStarts = title.startsWith(q) ? 100 : 0;
        const idStarts = id.startsWith(q) ? 80 : 0;
        const titleHas = title.includes(q) ? 60 : 0;
        const idHas = id.includes(q) ? 45 : 0;
        const contentHas = content.includes(q) ? 20 : 0;
        const score = titleStarts + idStarts + titleHas + idHas + contentHas;
        return { panel, title, id, score };
      });

      return scored
        .filter((x) => x.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 8);
    };

    const closeSuggestions = () => {
      suggestEl.classList.remove('is-open');
      suggestEl.innerHTML = '';
      activeSuggestionIndex = -1;
      currentSuggestions = [];
    };

    const revealMatch = (match) => {
      if (!match?.panel) return;
      const label = getPanelLabel(match.panel);
      window.ZLayoutOS?.revealPanel?.(match.panel.id, { userInitiated: true, label });
      pulsePanel(match.panel, { intent: 'info' });
    };

    const renderSuggestions = (matches) => {
      currentSuggestions = matches;
      activeSuggestionIndex = matches.length ? 0 : -1;
      if (!matches.length) {
        closeSuggestions();
        return;
      }

      suggestEl.innerHTML = matches
        .map((m, idx) => {
          const raw = String(m.panel.textContent || '')
            .replace(/\s+/g, ' ')
            .trim();
          const snippet = raw.slice(0, 90);
          const activeClass = idx === activeSuggestionIndex ? ' is-active' : '';
          const title = getPanelLabel(m.panel);
          const meta = `${m.panel.id} · ${snippet}`;
          const query = input.value.trim();
          return `
            <button class="z-dashboard-search-item${activeClass}" type="button" data-suggest-index="${idx}">
              <div class="z-dashboard-search-item-title">${highlightMatch(title, query)}</div>
              <div class="z-dashboard-search-item-meta">${highlightMatch(meta, query)}</div>
            </button>
          `;
        })
        .join('');
      suggestEl.classList.add('is-open');

      suggestEl.querySelectorAll('[data-suggest-index]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const idx = Number(btn.getAttribute('data-suggest-index'));
          const selected = currentSuggestions[idx];
          if (selected) {
            input.value = getPanelLabel(selected.panel);
            clearHighlights();
            revealMatch(selected);
          }
          closeSuggestions();
        });
      });
    };

    const updateSuggestions = () => {
      const q = input.value.trim();
      if (!q) {
        closeSuggestions();
        return;
      }
      const matches = findPanelMatches(q);
      renderSuggestions(matches);
    };

    const runSearch = () => {
      const q = input.value.trim();
      clearHighlights();
      const matches = findPanelMatches(q);
      if (!matches.length) return;
      const index = activeSuggestionIndex >= 0 ? activeSuggestionIndex : 0;
      const selected = matches[index] || matches[0];
      input.value = getPanelLabel(selected.panel);
      revealMatch(selected);
      closeSuggestions();
    };

    goBtn.addEventListener('click', runSearch);
    input.addEventListener('input', updateSuggestions);
    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        runSearch();
      } else if (event.key === 'ArrowDown') {
        if (!currentSuggestions.length) return;
        event.preventDefault();
        activeSuggestionIndex = (activeSuggestionIndex + 1) % currentSuggestions.length;
        renderSuggestions(currentSuggestions);
      } else if (event.key === 'ArrowUp') {
        if (!currentSuggestions.length) return;
        event.preventDefault();
        activeSuggestionIndex =
          (activeSuggestionIndex - 1 + currentSuggestions.length) % currentSuggestions.length;
        renderSuggestions(currentSuggestions);
      } else if (event.key === 'Escape') {
        input.value = '';
        clearHighlights();
        closeSuggestions();
      }
    });

    clearBtn.addEventListener('click', () => {
      input.value = '';
      clearHighlights();
      closeSuggestions();
      input.focus();
    });

    document.addEventListener('click', (event) => {
      if (!root.contains(event.target)) {
        closeSuggestions();
      }
    });

    window.addEventListener('keydown', (event) => {
      if (event.defaultPrevented) return;
      const target = event.target;
      const editable =
        target &&
        (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);
      if (editable) return;
      if (event.key === '/') {
        event.preventDefault();
        input.focus();
        input.select();
        updateSuggestions();
      }
    });
  }

  function ensureLayoutContainer() {
    let layout = document.getElementById('zLayout');
    if (layout) return layout;
    layout = document.createElement('div');
    layout.id = 'zLayout';
    layout.className = 'z-layout';
    ['left', 'center', 'right'].forEach((col) => {
      const column = document.createElement('div');
      column.className = 'z-layout-col';
      column.dataset.column = col;
      layout.appendChild(column);
    });
    document.body.appendChild(layout);
    return layout;
  }

  function getColumn(layout, column) {
    return layout.querySelector(`.z-layout-col[data-column="${column}"]`);
  }

  function storeDefaultPosition(panel) {
    if (panel.dataset.posStored) return;
    panel.dataset.posLeft = panel.style.left || '';
    panel.dataset.posTop = panel.style.top || '';
    panel.dataset.posRight = panel.style.right || '';
    panel.dataset.posBottom = panel.style.bottom || '';
    panel.dataset.posWidth = panel.style.width || '';
    panel.dataset.posHeight = panel.style.height || '';
    panel.dataset.posStored = 'true';
  }

  function applyFloatingPosition(panel, state) {
    panel.style.left = state.left ?? panel.dataset.posLeft ?? '';
    panel.style.top = state.top ?? panel.dataset.posTop ?? '';
    panel.style.right = state.right ?? panel.dataset.posRight ?? '';
    panel.style.bottom = state.bottom ?? panel.dataset.posBottom ?? '';
    panel.style.width = state.width ?? panel.dataset.posWidth ?? '';
    panel.style.height = state.height ?? panel.dataset.posHeight ?? '';
  }

  function setDocked(panel, docked, config, state) {
    const layout = ensureLayoutContainer();
    const resolvedColumn = state?.column || config.column || 'left';
    const resolvedOrder = state?.order ?? config.order ?? 0;
    const column = getColumn(layout, resolvedColumn) || getColumn(layout, 'left');
    panel.classList.toggle('z-panel-docked', docked);
    panel.classList.toggle('z-panel-floating', !docked);
    panel.dataset.docked = docked ? 'true' : 'false';
    if (docked && column) {
      panel.style.gridColumn = '';
      panel.style.order = resolvedOrder;
      panel.dataset.column = resolvedColumn;
      panel.dataset.order = String(resolvedOrder);
      if (panel.parentElement !== column) {
        column.appendChild(panel);
      }
    } else {
      panel.style.order = '';
      if (panel.parentElement !== document.body) {
        document.body.appendChild(panel);
      }
      applyFloatingPosition(panel, state || {});
    }

    const body = panel.querySelector('.z-panel-body');
    if (body) {
      if (state?.bodyMaxHeight) {
        body.style.maxHeight = state.bodyMaxHeight;
      } else if (!docked) {
        body.style.maxHeight = '';
      }
    }
  }

  function setCollapsed(panel, collapsed) {
    panel.classList.toggle('z-panel-collapsed', collapsed);
    panel.dataset.collapsed = collapsed ? 'true' : 'false';
  }

  function setMinimized(panel, minimized) {
    panel.classList.toggle('z-panel-minimized', minimized);
    panel.dataset.minimized = minimized ? 'true' : 'false';
  }

  function setMaximized(panel, maximized) {
    panel.classList.toggle('z-panel-maximized', maximized);
    panel.dataset.maximized = maximized ? 'true' : 'false';
  }

  function storeMaximizeState(panel) {
    if (!panel || panel.dataset.maximizedSnapshot) return;
    const rect = panel.getBoundingClientRect();
    panel.dataset.maximizedSnapshot = JSON.stringify({
      left: panel.style.left || '',
      top: panel.style.top || '',
      right: panel.style.right || '',
      bottom: panel.style.bottom || '',
      width: panel.style.width || '',
      height: panel.style.height || '',
      rectLeft: rect.left,
      rectTop: rect.top,
      rectWidth: rect.width,
      rectHeight: rect.height,
    });
  }

  function restoreMaximizeState(panel) {
    if (!panel || !panel.dataset.maximizedSnapshot) return;
    try {
      const snapshot = JSON.parse(panel.dataset.maximizedSnapshot);
      panel.style.left = snapshot.left;
      panel.style.top = snapshot.top;
      panel.style.right = snapshot.right;
      panel.style.bottom = snapshot.bottom;
      panel.style.width = snapshot.width || `${snapshot.rectWidth}px`;
      panel.style.height = snapshot.height || `${snapshot.rectHeight}px`;
    } catch {
      panel.style.left = '';
      panel.style.top = '';
      panel.style.right = '';
      panel.style.bottom = '';
      panel.style.width = '';
      panel.style.height = '';
    }
    delete panel.dataset.maximizedSnapshot;
  }

  function fitPanelContent(panel, options = {}) {
    if (!panel) return false;
    const body = panel.querySelector('.z-panel-body');
    if (!body) return false;
    const viewportCap = Math.round(window.innerHeight * 0.72);
    const desired = Math.round(Math.min(viewportCap, Math.max(140, body.scrollHeight + 10)));
    body.style.maxHeight = `${desired}px`;
    if (desired <= 260) panel.dataset.length = 'short';
    else if (desired <= 420) panel.dataset.length = 'medium';
    else panel.dataset.length = 'tall';
    panel.dataset.fitMode = 'fit';
    applyPanelLengthClasses(panel);

    const persist = options.persist !== false;
    if (persist) {
      const state = getStoredState();
      state[panel.id] = {
        ...(state[panel.id] || {}),
        bodyMaxHeight: body.style.maxHeight,
        length: panel.dataset.length || 'medium',
        fitMode: panel.dataset.fitMode,
      };
      saveStoredState(state);
    }
    return true;
  }

  function bringPanelToFront(panel) {
    if (!panel) return;
    document.querySelectorAll('.z-panel.z-panel-layer-top').forEach((p) => {
      p.classList.remove('z-panel-layer-top');
    });
    panel.classList.add('z-panel-layer-top');
    let maxZ = 9099;
    document.querySelectorAll('.z-panel').forEach((p) => {
      const zi = parseInt(p.style.zIndex, 10);
      if (!Number.isNaN(zi) && zi > maxZ) maxZ = zi;
    });
    panel.style.zIndex = String(Math.min(9995, maxZ + 1));
  }

  /** Smart expand: exit maximize if needed, uncollapse, fit height to content, multi-layer z-order. */
  function panelRunAutoFlex(panel) {
    if (!panel || isUiFrozen()) return false;
    if (isLockedPanel(panel.id)) return false;

    if (panel.dataset.maximized === 'true') {
      restoreMaximizeState(panel);
      setMaximized(panel, false);
      if (panel.dataset.docked === 'true') {
        panel.style.position = '';
        panel.style.left = '';
        panel.style.top = '';
        panel.style.right = '';
        panel.style.bottom = '';
        panel.style.width = '';
        panel.style.height = '';
      }
    }

    setCollapsed(panel, false);
    setMinimized(panel, false);
    bringPanelToFront(panel);

    document.querySelectorAll('.z-panel').forEach((node) => {
      const active = node.id === panel.id;
      node.classList.toggle('z-panel-active', active);
      node.classList.toggle('z-panel-autoscroll', active);
    });

    fitPanelContent(panel, { persist: true });

    const state = getStoredState();
    const body = panel.querySelector('.z-panel-body');
    state[panel.id] = {
      ...(state[panel.id] || {}),
      collapsed: false,
      minimized: false,
      maximized: false,
      length: panel.dataset.length,
      fitMode: panel.dataset.fitMode,
      bodyMaxHeight: body?.style?.maxHeight || '',
    };
    saveStoredState(state);
    noteUserLayoutChange();

    if (body && body.scrollHeight > body.clientHeight + 2) {
      body.scrollTop = 0;
    }
    panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    return true;
  }

  /** Any primary click on a panel surface raises it above sibling panels (multi-layer stack). */
  function initPanelClickRaiseLayer() {
    document.addEventListener(
      'pointerdown',
      (event) => {
        if (event.button !== 0) return;
        const el = event.target;
        if (!el || typeof el.closest !== 'function') return;
        if (el.closest('#zDashboardSearch')) return;
        if (el.closest('.z-top-indicator-panel')) return;
        if (el.closest('.dashboard-edge-bar')) return;
        if (el.closest('#zBottomStatusStrip')) return;
        if (el.closest('#zStatusRail')) return;
        if (el.closest('#zNarrowHealthStrip')) return;
        if (el.closest('#zLivingPulseWrap')) return;
        if (el.closest('.z-harisha-overlay')) return;
        if (el.closest('#devToggle')) return;
        if (el.closest('#summonCompanionFab')) return;
        if (el.closest('#summonRoot7Fab')) return;
        if (el.closest('.lens-mode-toggle')) return;
        const panel = el.closest('.z-panel');
        if (!panel || !panel.id) return;
        if (panel.dataset.maximized === 'true') return;
        if (panel.dataset.hidden === 'true' || panel.style.display === 'none') return;
        bringPanelToFront(panel);
      },
      true
    );
  }

  function resetPanelSizes(options = {}) {
    const state = getStoredState();
    let changed = false;
    document.querySelectorAll('.z-panel').forEach((panel) => {
      const entry = { ...(state[panel.id] || {}) };
      const hadSizing =
        Boolean(entry.width || entry.height || entry.bodyMaxHeight || entry.length) ||
        Boolean(panel.style.width || panel.style.height);
      if (!hadSizing) return;
      delete entry.width;
      delete entry.height;
      delete entry.bodyMaxHeight;
      delete entry.length;
      delete entry.fitMode;
      state[panel.id] = entry;
      panel.style.width = '';
      panel.style.height = '';
      const body = panel.querySelector('.z-panel-body');
      if (body) body.style.maxHeight = '';
      panel.dataset.length = 'medium';
      panel.dataset.fitMode = '';
      applyPanelLengthClasses(panel);
      changed = true;
    });
    if (!changed) return false;
    saveStoredState(state);
    applyPanelLengthHints();
    if (options.skipApply !== true) {
      applyLayout(layoutDefaults);
    }
    refreshPanelDirectoryState();
    noteUserLayoutChange();
    return true;
  }

  function applyPanelLockState(panel) {
    const locked = isLockedPanel(panel.id);
    panel.classList.toggle('z-panel-locked', locked);
    panel.dataset.locked = locked ? 'true' : 'false';
    return locked;
  }

  function isUiFrozen() {
    return document.body.classList.contains('z-freeze');
  }

  function isCompactControls() {
    return document.body.classList.contains('z-compact-controls');
  }

  function isAccessibleActionsEnabled() {
    return getBooleanSetting(ACCESSIBLE_ACTIONS_KEY, false);
  }

  function applyCompactControls(enabled) {
    document.body.classList.toggle('z-compact-controls', enabled);
    const toggle = document.getElementById('zCompactControlsToggle');
    if (toggle) toggle.checked = enabled;
    refreshAllPanelActionLabels();
  }

  function applyDensity(mode) {
    const normalized = mode === 'ultra' ? 'ultra' : mode === 'compact' ? 'compact' : 'normal';
    document.body.classList.toggle('z-density-compact', normalized === 'compact');
    document.body.classList.toggle('z-density-ultra', normalized === 'ultra');
    const compactToggle = document.getElementById('zCompactModeToggle');
    const ultraToggle = document.getElementById('zUltraCompactToggle');
    if (compactToggle) compactToggle.checked = normalized === 'compact';
    if (ultraToggle) ultraToggle.checked = normalized === 'ultra';
  }

  function setDensity(mode, options = {}) {
    const manual = options.manual !== false;
    const persist = options.persist !== false;
    const normalized = mode === 'ultra' ? 'ultra' : mode === 'compact' ? 'compact' : 'normal';
    if (persist) {
      setSetting(UI_DENSITY_KEY, normalized);
    }
    window.__Z_USER_OVERRIDE_DENSITY__ = manual;
    applyDensity(normalized);
    const label = document.getElementById('zDensityPresetLabel');
    if (label) {
      label.textContent = `Density: ${normalized === 'ultra' ? 'Ultra' : normalized === 'compact' ? 'Compact' : 'Normal'}`;
    }
  }

  function applyReduceMotion(enabled) {
    document.body.classList.toggle('z-reduce-motion', enabled);
    const toggle = document.getElementById('zReduceMotionToggle');
    if (toggle) toggle.checked = enabled;
    const label = document.getElementById('zReduceMotionLabel');
    if (label) {
      const mode = getSetting(REDUCE_MOTION_KEY, null) === null ? 'OS-synced' : 'Manual';
      const icon = enabled ? '🧘' : '🌙';
      label.textContent = `${icon} Motion: ${mode} · ${enabled ? 'On' : 'Off'}`;
    }
    if (enabled) {
      setSetting(HIVE_SPIN_KEY, '0');
      applyHiveSpin(false);
      const spinToggle = document.getElementById('zHiveSpinToggle');
      if (spinToggle) spinToggle.checked = false;
      setSetting(HIVE_3D_KEY, '0');
      applyHive3D(false);
      const hive3dToggle = document.getElementById('zHive3dToggle');
      if (hive3dToggle) hive3dToggle.checked = false;
      setSetting(HIVE_GLOW_KEY, '0');
      applyHiveGlow(false);
      const glowToggle = document.getElementById('zHiveGlowToggle');
      if (glowToggle) glowToggle.checked = false;
    }
  }

  function applyAccessibleActions(enabled) {
    document.body.classList.toggle('z-accessible-actions', enabled);
    const toggle = document.getElementById('zAccessibleActionsToggle');
    if (toggle) toggle.checked = enabled;
  }

  function applySingleTapMode(enabled) {
    document.body.classList.toggle('z-single-tap-mode', enabled);
    const toggle = document.getElementById('zSingleTapModeToggle');
    if (toggle) toggle.checked = enabled;
  }

  function applyHiveGlow(enabled) {
    document.body.classList.toggle('z-hive-glow', enabled);
    const toggle = document.getElementById('zHiveGlowToggle');
    if (toggle) toggle.checked = enabled;
  }

  function applyHiveSpin(enabled) {
    const reduceMotion = document.body.classList.contains('z-reduce-motion');
    const safeEnabled = reduceMotion ? false : enabled;
    document.body.classList.toggle('z-hive-spin', safeEnabled);
    const threads = document.getElementById('zHiveThreads');
    if (threads && document.body.classList.contains('z-hive-3d')) {
      threads.classList.toggle('z-hive-3d-rotate', safeEnabled);
    }
    const toggle = document.getElementById('zHiveSpinToggle');
    if (toggle) toggle.checked = safeEnabled;
  }

  function layoutHive3D() {
    const root = document.getElementById('zHiveRoot');
    const threads = document.querySelectorAll('.z-hive-thread');
    if (!root || !threads.length) return;
    const count = threads.length;
    const width = window.innerWidth || root.clientWidth || 1200;
    const height = window.innerHeight || 800;
    const radius = Math.min(520, Math.max(220, Math.min(width, height) * 0.34));
    const cardWidth = Math.min(320, Math.max(210, width * 0.22));
    const hiveHeight = Math.min(640, Math.max(360, height * 0.6));
    document.documentElement.style.setProperty('--z-hive-3d-radius', `${radius}px`);
    document.documentElement.style.setProperty('--z-hive-3d-card-width', `${cardWidth}px`);
    document.documentElement.style.setProperty('--z-hive-3d-height', `${hiveHeight}px`);
    threads.forEach((thread, index) => {
      const angle = (360 / count) * index;
      thread.style.transform = `translate(-50%, -50%) rotateY(${angle}deg) translateZ(${radius}px)`;
      thread.dataset.hiveAngle = String(angle);
    });
  }

  function applyHive3D(enabled) {
    const reduceMotion = document.body.classList.contains('z-reduce-motion');
    const safeEnabled = reduceMotion ? false : enabled;
    document.body.classList.toggle('z-hive-3d', safeEnabled);
    const toggle = document.getElementById('zHive3dToggle');
    if (toggle) toggle.checked = safeEnabled;
    if (safeEnabled) {
      layoutHive3D();
    } else {
      document.querySelectorAll('.z-hive-thread').forEach((thread) => {
        thread.style.transform = '';
        thread.dataset.hiveAngle = '';
      });
    }
  }

  function applyHiveSpinSpeed(value) {
    const root = document.documentElement;
    const clamped = Math.max(40, Math.min(240, Number(value) || 90));
    root.style.setProperty('--z-hive-spin-duration', `${clamped}s`);
    const display = document.getElementById('zHiveSpinSpeedLabel');
    if (display) display.textContent = `${clamped}s`;
    setSetting(HIVE_SPIN_SPEED_KEY, String(clamped));
  }

  function setHiveActiveLabel(label) {
    const activeLabel = document.getElementById('zHiveActiveThread');
    if (activeLabel) activeLabel.textContent = `Active: ${label || '--'}`;
  }

  /** Raise all docked panels in a hive thread (multi-layer stack for workflow focus). */
  function raiseHiveThreadPanels(threadEl) {
    if (!threadEl) return;
    const panels = threadEl.querySelectorAll(':scope > .z-panel');
    panels.forEach((p) => bringPanelToFront(p));
  }

  function pauseHiveSpin() {
    const root = document.documentElement;
    root.style.setProperty('--z-hive-spin-play', 'paused');
  }

  function resumeHiveSpin() {
    const root = document.documentElement;
    root.style.setProperty('--z-hive-spin-play', 'running');
  }

  function initHiveFocusSnap() {
    const threads = document.querySelectorAll('.z-hive-thread');
    if (!threads.length) return;

    threads.forEach((thread) => {
      thread.addEventListener('click', (event) => {
        const target = event.target.closest('.z-hive-thread');
        if (!target) return;
        document.querySelectorAll('.z-hive-thread.is-focus').forEach((el) => {
          el.classList.remove('is-focus');
        });
        target.classList.add('is-focus');
        pauseHiveSpin();
        const title = target.querySelector('.z-hive-thread-title')?.textContent || '--';
        setHiveActiveLabel(title);
        raiseHiveThreadPanels(target);
        saveHiveLayout();
      });
    });

    document.addEventListener('click', (event) => {
      const hit = event.target.closest('.z-hive-thread');
      if (hit) return;
      document.querySelectorAll('.z-hive-thread.is-focus').forEach((el) => {
        el.classList.remove('is-focus');
      });
      resumeHiveSpin();
      setHiveActiveLabel(null);
      saveHiveLayout();
    });
  }

  function initHiveSpinPresets() {
    const slow = document.getElementById('zHiveSpinSlow');
    const calm = document.getElementById('zHiveSpinCalm');
    const focus = document.getElementById('zHiveSpinFocus');
    const toggle = document.getElementById('zHiveSpinToggle');

    const applyPreset = (value) => {
      applyHiveSpinSpeed(value);
      if (toggle) {
        toggle.checked = true;
        setSetting(HIVE_SPIN_KEY, '1');
        applyHiveSpin(true);
      }
    };

    if (slow) slow.addEventListener('click', () => applyPreset(180));
    if (calm) calm.addEventListener('click', () => applyPreset(120));
    if (focus) focus.addEventListener('click', () => applyPreset(60));
  }

  function initHiveCenterSnap() {
    const btn = document.getElementById('zHiveCenterSnap');
    if (!btn) return;
    btn.addEventListener('click', () => {
      document.querySelectorAll('.z-hive-thread.is-focus').forEach((el) => {
        el.classList.remove('is-focus');
      });
      resumeHiveSpin();
      setHiveActiveLabel(null);
      applyDensity('compact');
      setSetting(UI_ZOOM_KEY, String(UI_ZOOM_DEFAULT));
      applyUiZoom(UI_ZOOM_DEFAULT);
      const root = document.getElementById('zHiveRoot');
      if (root) root.scrollIntoView({ behavior: 'smooth', block: 'start' });
      saveHiveLayout();
    });
  }

  function applyCompactEdgebar(enabled) {
    document.body.classList.toggle('z-compact-edgebar', enabled);
    const toggle = document.getElementById('zCompactEdgebarToggle');
    if (toggle) toggle.checked = enabled;
    document.querySelectorAll('.dashboard-edge-bar button').forEach((btn) => {
      const shortLabel = btn.dataset.short;
      const label = btn.dataset.label;
      if (!shortLabel || !label) return;
      btn.textContent = enabled ? shortLabel : label;
    });
  }

  function updatePanelActionLabel(btn, label, icon) {
    if (!btn) return;
    const compact = isCompactControls();
    btn.textContent = compact ? icon : label;
    btn.setAttribute('aria-label', label);
    btn.title = label;
  }

  function normalizePanelActionButtons(panel) {
    if (!panel) return;
    const allowed = new Set([
      'autoflex',
      'expand',
      'collapse',
      'minimize',
      'maximize',
      'popout',
      'fit',
    ]);
    const seen = new Set();
    const buttons = panel.querySelectorAll(
      '.z-panel-actions .z-panel-btn, .z-panel-actions .z-panel-quick-action'
    );
    buttons.forEach((btn) => {
      if (!btn.classList.contains('z-panel-quick-action')) {
        btn.classList.add('z-panel-quick-action');
      }
      const action = btn.dataset.action;
      if (!action || !allowed.has(action)) {
        btn.remove();
        return;
      }
      if (seen.has(action)) {
        btn.remove();
        return;
      }
      seen.add(action);
    });
  }

  function applySplitLayout(mode) {
    document.body.classList.remove('layout-split-2', 'layout-split-4');
    if (mode === 'split-2') {
      document.body.classList.add('layout-split-2');
    }
    if (mode === 'split-4') {
      document.body.classList.add('layout-split-4');
    }
    const select = document.getElementById('zSplitLayoutSelect');
    if (select) select.value = mode || 'auto';
  }

  function applyUiZoom(value) {
    // Apply global internal zoom so all layers scale together (panels + overlays).
    const zoom = Math.min(UI_ZOOM_MAX, Math.max(UI_ZOOM_MIN, Number(value) || UI_ZOOM_DEFAULT));
    if (document.body) {
      document.body.style.zoom = String(zoom);
    }
    // Keep text scale normalized because geometry now scales via body zoom.
    const derivedScale = 1;
    document.documentElement.style.setProperty('--z-ui-zoom', '1');
    document.documentElement.style.setProperty('--z-ui-scale', String(derivedScale));
    const search = document.getElementById('zDashboardSearch');
    if (search) {
      const compensate = Math.min(1.8, Math.max(1, 0.75 / zoom));
      search.style.zoom = String(compensate);
    }
    const resetBtn = document.getElementById('zZoomResetBtn');
    if (resetBtn) resetBtn.textContent = `${Math.round(zoom * 100)}%`;
  }

  function clampZoomValue(value, fallback = UI_ZOOM_DEFAULT) {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) return fallback;
    return Math.min(UI_ZOOM_MAX, Math.max(UI_ZOOM_MIN, parsed));
  }

  function getZoomDeviceFingerprint() {
    const sw = window.screen?.width || window.innerWidth || 0;
    const sh = window.screen?.height || window.innerHeight || 0;
    const iw = window.innerWidth || 0;
    const ih = window.innerHeight || 0;
    const dpr = window.devicePixelRatio || 1;
    const platform = String(navigator.platform || 'unknown').toLowerCase();
    return `${platform}|sw:${sw}x${sh}|vw:${iw}x${ih}|dpr:${dpr}`;
  }

  function readZoomDeviceProfiles() {
    try {
      const raw = localStorage.getItem(UI_ZOOM_DEVICE_PROFILES_KEY);
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch {
      return {};
    }
  }

  function writeZoomDeviceProfiles(profiles) {
    try {
      localStorage.setItem(UI_ZOOM_DEVICE_PROFILES_KEY, JSON.stringify(profiles || {}));
    } catch {
      // Ignore storage failures.
    }
  }

  function rememberZoomForCurrentDevice(value, source = 'manual') {
    const zoom = clampZoomValue(value);
    const key = getZoomDeviceFingerprint();
    const profiles = readZoomDeviceProfiles();
    profiles[key] = {
      zoom,
      source,
      updated_at: new Date().toISOString(),
      screen: {
        width: window.screen?.width || null,
        height: window.screen?.height || null,
        dpr: window.devicePixelRatio || 1,
      },
    };
    writeZoomDeviceProfiles(profiles);
  }

  function resolveZoomForCurrentDevice() {
    const key = getZoomDeviceFingerprint();
    const profiles = readZoomDeviceProfiles();
    const entry = profiles[key];
    if (!entry) return null;
    return clampZoomValue(entry.zoom, null);
  }

  function applyGridLayoutV1() {
    const enabled = getSetting(GRID_LAYOUT_KEY, '1') !== '0';
    document.body.classList.toggle('layout-grid-v1', enabled);
    if (!enabled) return;

    const gridMap = {
      left: [
        'zMasterControlPanel',
        'zPanelDirectory',
        'zAutocompletePanel',
        'zDashboard',
        'zSswsStatusPanel',
      ],
      center: [
        'zAwarenessPanel',
        'zChroniclePanel',
        'zInsightLabPanel',
        'zCodexSuggestionsPanel',
        'zRecentSuggestions',
        'zIntelligencePanel',
        'zSocialPanel',
      ],
      right: [
        'zVaultStatusPanel',
        'zPublicMirrorPanel',
        'trust-certificate',
        'zGovernance',
        'zPriorityPanel',
        'zWisdomRingPanel',
        'zModuleRegistryPanel',
        'zGovTimelinePanel',
        'zCodexPanel',
        'zCreatorProtocolPanel',
        'zCompanion3dPanel',
        'zFormulaRegistryPanel',
        'zFolderManagerPanel',
        'zAutopilotStatusPanel',
        'zGovernanceReportPanel',
        'zGovernanceReviewPanel',
        'zChainViewPanel',
        'zAutopilotDebugPanel',
        'zAutopilotReplayPanel',
        'zAutopilotSimPanel',
      ],
    };

    const state = getStoredState();
    Object.entries(gridMap).forEach(([column, ids]) => {
      ids.forEach((id, index) => {
        const panel = document.getElementById(id);
        if (!panel) return;
        const entry = state[id] || {};
        state[id] = {
          ...entry,
          docked: true,
          column,
          order: index + 1,
        };
      });
    });
    saveStoredState(state);
    applyLayout(layoutDefaults);
    window.ZLayoutOS?.refreshPanelControls?.(true);
  }

  function movePanelToThread(panelId, threadId) {
    const panel = document.getElementById(panelId);
    const thread = document.getElementById(threadId);
    if (!panel || !thread) return;
    panel.classList.add('z-hive-cell');
    panel.dataset.hiveCell = 'true';
    panel.style.position = 'relative';
    panel.style.left = '';
    panel.style.top = '';
    panel.style.right = '';
    panel.style.bottom = '';
    panel.style.width = '100%';
    panel.style.height = 'auto';
    thread.appendChild(panel);
  }

  function initHiveDocking() {
    const draggables = document.querySelectorAll('.z-panel .z-panel-header, .z-panel h3');
    draggables.forEach((header) => {
      header.setAttribute('draggable', 'true');
      if (!header.querySelector('.z-hive-home-btn')) {
        const homeBtn = document.createElement('button');
        homeBtn.className = 'z-panel-btn z-hive-home-btn';
        homeBtn.dataset.action = 'hive-home';
        homeBtn.title = 'Return to thread';
        homeBtn.textContent = '⟲';
        homeBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const panel = header.closest('.z-panel');
          if (!panel) return;
          applyHiveLayout();
          noteUserLayoutChange();
        });
        header.appendChild(homeBtn);
      }
      header.addEventListener('dragstart', (e) => {
        const panel = header.closest('.z-panel');
        if (!panel) return;
        e.dataTransfer?.setData('text/plain', panel.id);
        document.querySelectorAll('.z-hive-thread').forEach((thread) => {
          thread.classList.add('z-hive-drop');
        });
      });
      header.addEventListener('dragend', () => {
        document.querySelectorAll('.z-hive-thread').forEach((thread) => {
          thread.classList.remove('z-hive-drop');
        });
      });
    });

    document.querySelectorAll('.z-hive-thread').forEach((thread) => {
      thread.addEventListener('dragover', (e) => {
        e.preventDefault();
      });
      thread.addEventListener('drop', (e) => {
        e.preventDefault();
        const panelId = e.dataTransfer?.getData('text/plain');
        if (!panelId) return;
        movePanelToThread(panelId, thread.id);
        saveHiveLayout();
        noteUserLayoutChange();
      });
    });
  }

  function saveHiveLayout() {
    const layout = {};
    document.querySelectorAll('.z-hive-thread').forEach((thread) => {
      const ids = Array.from(thread.querySelectorAll('.z-panel'))
        .map((panel) => panel.id)
        .filter(Boolean);
      layout[thread.id] = ids;
    });
    const active = document.querySelector('.z-hive-thread.is-focus');
    layout.__activeThreadId = active ? active.id : null;
    setSetting(HIVE_LAYOUT_KEY, JSON.stringify(layout));
  }

  function loadHiveLayout() {
    const raw = getSetting(HIVE_LAYOUT_KEY, '');
    if (!raw) return false;
    try {
      const layout = JSON.parse(raw);
      Object.entries(layout).forEach(([threadId, ids]) => {
        if (threadId === '__activeThreadId') return;
        if (!Array.isArray(ids)) return;
        ids.forEach((panelId) => movePanelToThread(panelId, threadId));
      });
      if (layout.__activeThreadId) {
        const thread = document.getElementById(layout.__activeThreadId);
        if (thread) {
          document.querySelectorAll('.z-hive-thread.is-focus').forEach((el) => {
            el.classList.remove('is-focus');
          });
          thread.classList.add('is-focus');
          const label = thread.querySelector('.z-hive-thread-title')?.textContent;
          const activeLabel = document.getElementById('zHiveActiveThread');
          if (activeLabel) activeLabel.textContent = `Active: ${label || '--'}`;
          pauseHiveSpin();
        }
      }
      return true;
    } catch {
      return false;
    }
  }

  function applyHiveLayout() {
    const enabled = getSetting(HIVE_LAYOUT_KEY, '1') !== '0';
    if (!enabled) return;
    const root = document.getElementById('zHiveRoot');
    if (!root) return;
    document.body.classList.add('z-hive-layout');
    document.body.classList.remove('layout-grid-v1');

    document.querySelectorAll('.z-panel').forEach((panel) => {
      panel.dataset.hiveCell = '';
    });

    movePanelToThread('zAwarenessPanel', 'zHiveObserve');
    movePanelToThread('zCommanderPanel', 'zHiveObserve');
    movePanelToThread('zVaultStatusPanel', 'zHiveObserve');
    movePanelToThread('zPublicMirrorPanel', 'zHiveObserve');

    movePanelToThread('zInsightLabPanel', 'zHiveThink');
    movePanelToThread('zChroniclePanel', 'zHiveThink');
    movePanelToThread('zCodexSuggestionsPanel', 'zHiveThink');
    movePanelToThread('zRecentSuggestions', 'zHiveThink');
    movePanelToThread('zIntelligencePanel', 'zHiveThink');

    movePanelToThread('zPanelDirectory', 'zHiveBuild');
    movePanelToThread('zAutocompletePanel', 'zHiveBuild');
    movePanelToThread('zMasterControlPanel', 'zHiveBuild');

    movePanelToThread('zGovernance', 'zHiveGovern');
    movePanelToThread('zPriorityPanel', 'zHiveGovern');
    movePanelToThread('zWisdomRingPanel', 'zHiveGovern');
    movePanelToThread('zGovTimelinePanel', 'zHiveGovern');

    movePanelToThread('zModuleRegistryPanel', 'zHiveRegistry');
    movePanelToThread('zFormulaRegistryPanel', 'zHiveRegistry');
    movePanelToThread('zTaskListPanel', 'zHiveRegistry');

    movePanelToThread('zSocialPanel', 'zHiveSocial');
    movePanelToThread('zCreatorProtocolPanel', 'zHiveSocial');
    movePanelToThread('zCompanion3dPanel', 'zHiveSocial');

    if (document.body.classList.contains('z-hive-3d')) {
      layoutHive3D();
    }
  }

  function panelsOverlap(rectA, rectB) {
    return !(
      rectA.right <= rectB.left ||
      rectA.left >= rectB.right ||
      rectA.bottom <= rectB.top ||
      rectA.top >= rectB.bottom
    );
  }

  function shouldForceGridLayout() {
    if (document.body.classList.contains('layout-grid-v1')) return false;
    if (window.innerWidth < 1200) return false;
    const panels = Array.from(document.querySelectorAll('.z-panel')).filter((panel) => {
      if (panel.style.display === 'none') return false;
      if (panel.classList.contains('z-panel-docked')) return false;
      if (panel.dataset.maximized === 'true') return false;
      return true;
    });
    for (let i = 0; i < panels.length; i += 1) {
      const rectA = panels[i].getBoundingClientRect();
      for (let j = i + 1; j < panels.length; j += 1) {
        const rectB = panels[j].getBoundingClientRect();
        if (panelsOverlap(rectA, rectB)) return true;
      }
    }
    return false;
  }

  function enforceGridLayoutWhenWide() {
    if (!shouldForceGridLayout()) return;
    setSetting(GRID_LAYOUT_KEY, '1');
    applyGridLayoutV1();
  }

  function initUiZoomControls() {
    const rawStored = getSetting(UI_ZOOM_KEY, null);
    let stored = parseFloat(rawStored ?? String(UI_ZOOM_DEFAULT));
    // One-time migration from legacy defaults that rendered too large.
    if (
      rawStored === null ||
      rawStored === '1' ||
      rawStored === '0.9' ||
      rawStored === '0.67' ||
      (!Number.isNaN(stored) && stored >= 0.95)
    ) {
      stored = UI_ZOOM_DEFAULT;
      setSetting(UI_ZOOM_KEY, String(UI_ZOOM_DEFAULT));
    }
    if (!Number.isFinite(stored)) stored = UI_ZOOM_DEFAULT;
    const devicePreferred = resolveZoomForCurrentDevice();
    const bootZoom =
      rawStored === 'auto' ? (devicePreferred ?? smartZoomPreset()) : (devicePreferred ?? stored);
    applyUiZoom(bootZoom);
    if (rawStored !== 'auto') {
      setSetting(UI_ZOOM_KEY, String(clampZoomValue(bootZoom)));
    }
    rememberZoomForCurrentDevice(bootZoom, rawStored === 'auto' ? 'auto_boot' : 'boot');
    const zoomOut = document.getElementById('zZoomOutBtn');
    const zoomIn = document.getElementById('zZoomInBtn');
    const zoomReset = document.getElementById('zZoomResetBtn');
    const step = 0.05;

    if (zoomOut) {
      zoomOut.addEventListener('click', () => {
        const current =
          parseFloat(getSetting(UI_ZOOM_KEY, String(UI_ZOOM_DEFAULT))) || UI_ZOOM_DEFAULT;
        const next = Math.max(UI_ZOOM_MIN, current - step);
        setSetting(UI_ZOOM_KEY, String(next));
        applyUiZoom(next);
        rememberZoomForCurrentDevice(next, 'manual_zoom_out');
        noteUserLayoutChange();
      });
    }

    if (zoomIn) {
      zoomIn.addEventListener('click', () => {
        const current =
          parseFloat(getSetting(UI_ZOOM_KEY, String(UI_ZOOM_DEFAULT))) || UI_ZOOM_DEFAULT;
        const next = Math.min(UI_ZOOM_MAX, current + step);
        setSetting(UI_ZOOM_KEY, String(next));
        applyUiZoom(next);
        rememberZoomForCurrentDevice(next, 'manual_zoom_in');
        noteUserLayoutChange();
      });
    }

    if (zoomReset) {
      zoomReset.addEventListener('click', () => {
        setSetting(UI_ZOOM_KEY, String(UI_ZOOM_DEFAULT));
        applyUiZoom(UI_ZOOM_DEFAULT);
        rememberZoomForCurrentDevice(UI_ZOOM_DEFAULT, 'reset');
        noteUserLayoutChange();
      });
    }
  }

  function initSmartZoomToggle() {
    const toggle = document.getElementById('zSmartZoomToggle');
    if (!toggle) return;
    const stored = getSetting(UI_ZOOM_KEY, 'auto');
    toggle.checked = stored === 'auto';
    toggle.addEventListener('change', () => {
      if (toggle.checked) {
        setSetting(UI_ZOOM_KEY, 'auto');
        const recommended = resolveZoomForCurrentDevice() ?? smartZoomPreset();
        setSetting(UI_ZOOM_KEY, String(recommended));
        applyUiZoom(recommended);
        rememberZoomForCurrentDevice(recommended, 'auto_toggle');
      } else {
        if (getSetting(UI_ZOOM_KEY, 'auto') === 'auto') {
          setSetting(UI_ZOOM_KEY, String(UI_ZOOM_DEFAULT));
          applyUiZoom(UI_ZOOM_DEFAULT);
          rememberZoomForCurrentDevice(UI_ZOOM_DEFAULT, 'auto_toggle_off');
        }
      }
      noteUserLayoutChange();
    });
  }

  function initZoomPresets() {
    const presets = [
      { id: 'zZoomPresetWindows', value: 0.5 },
      { id: 'zZoomPresetMac', value: 0.56 },
      { id: 'zZoomPresetLinux', value: 0.53 },
    ];
    presets.forEach((preset) => {
      const btn = document.getElementById(preset.id);
      if (!btn) return;
      btn.addEventListener('click', () => {
        setSetting(UI_ZOOM_KEY, String(preset.value));
        applyUiZoom(preset.value);
        rememberZoomForCurrentDevice(preset.value, `preset_${preset.id}`);
        const smartToggle = document.getElementById('zSmartZoomToggle');
        if (smartToggle) smartToggle.checked = false;
        noteUserLayoutChange();
      });
    });
  }

  function smartZoomPreset() {
    const screenWidth =
      window.screen && window.screen.width ? window.screen.width : window.innerWidth;
    const screenHeight =
      window.screen && window.screen.height ? window.screen.height : window.innerHeight;
    const devicePixelRatio = window.devicePixelRatio || 1;
    const aspectRatio = screenWidth && screenHeight ? screenWidth / screenHeight : 1.6;
    const platform = (navigator.platform || navigator.userAgent || '').toLowerCase();
    let recommended = UI_ZOOM_DEFAULT;

    if (screenWidth <= 1366) {
      recommended = 0.5;
    } else if (screenWidth <= 1600) {
      recommended = 0.52;
    } else if (screenWidth <= 1920) {
      recommended = 0.54;
    } else {
      recommended = 0.58;
    }

    if (screenHeight <= 800) {
      recommended = Math.min(recommended, 0.52);
    } else if (screenHeight <= 900) {
      recommended = Math.min(recommended, 0.53);
    }

    if (aspectRatio >= 2.1) {
      recommended = Math.min(recommended, 0.52);
    } else if (aspectRatio >= 1.9) {
      recommended = Math.min(recommended, 0.53);
    }

    if (devicePixelRatio >= 1.5 && recommended > 0.53) {
      recommended = Math.max(0.5, recommended - 0.03);
    }

    if (platform.includes('mac')) {
      recommended = Math.min(0.62, recommended + 0.02);
    } else if (platform.includes('linux')) {
      recommended = Math.max(0.5, recommended - 0.01);
    }

    const viewWidth = window.innerWidth || screenWidth;
    const viewHeight = window.innerHeight || screenHeight;
    if (viewWidth && viewHeight && viewHeight < 700) {
      recommended = Math.min(recommended, 0.52);
    }
    if (viewWidth && viewWidth < 1200) {
      recommended = Math.min(recommended, 0.52);
    }
    return Math.min(0.7, Math.max(0.5, recommended));
  }

  function initSmartZoomPreset() {
    const stored = getSetting(UI_ZOOM_KEY, 'auto');
    if (stored === 'auto') {
      const recommended = resolveZoomForCurrentDevice() ?? smartZoomPreset();
      setSetting(UI_ZOOM_KEY, String(recommended));
      applyUiZoom(recommended);
      rememberZoomForCurrentDevice(recommended, 'auto_init');
    }
  }

  function refreshPanelActionLabels(panel) {
    if (!panel) return;
    const actions = panel.querySelectorAll(
      '.z-panel-actions .z-panel-btn, .z-panel-actions .z-panel-quick-action'
    );
    const collapsed = panel.dataset.collapsed === 'true';
    const minimized = panel.dataset.minimized === 'true';
    const maximized = panel.dataset.maximized === 'true';

    actions.forEach((btn) => {
      switch (btn.dataset.action) {
        case 'expand':
          updatePanelActionLabel(btn, 'Expand', 'E');
          break;
        case 'collapse':
          updatePanelActionLabel(btn, collapsed ? 'Expand' : 'Collapse', collapsed ? '▸' : '▾');
          break;
        case 'minimize':
          updatePanelActionLabel(btn, minimized ? 'Restore' : 'Minimize', minimized ? '▢' : '—');
          break;
        case 'maximize':
          updatePanelActionLabel(btn, maximized ? 'Restore' : 'Maximize', maximized ? '▢' : '⬜');
          break;
        case 'popout':
          updatePanelActionLabel(btn, 'Popout', '↗');
          break;
        case 'fit':
          updatePanelActionLabel(btn, 'Fit', 'F');
          break;
        case 'autoflex':
          updatePanelActionLabel(btn, 'Auto-Flex', '⚡');
          break;
        default:
          break;
      }
    });
  }

  function refreshAllPanelActionLabels() {
    document.querySelectorAll('.z-panel').forEach((panel) => {
      refreshPanelActionLabels(panel);
    });
  }

  const PANEL_CONTROLS_VERSION = 'v4';

  function resetPanelEnhancement(panel) {
    const body = panel.querySelector('.z-panel-body');
    const header = panel.querySelector('.z-panel-header');
    if (body) {
      while (body.firstChild) {
        panel.appendChild(body.firstChild);
      }
      body.remove();
    }
    if (header) header.remove();
    panel.dataset.enhanced = 'false';
    delete panel.dataset.controlsVersion;
  }

  function enhancePanel(panel) {
    if (!panel) return;
    const locked = applyPanelLockState(panel);
    if (panel.dataset.enhanced === 'true') {
      if (panel.dataset.controlsVersion === PANEL_CONTROLS_VERSION) return;
      resetPanelEnhancement(panel);
    }
    storeDefaultPosition(panel);
    const heading = panel.querySelector('h3, h4');
    const rawTitle =
      panel.dataset.title || (heading ? heading.textContent.trim() : panel.id || 'Panel');
    const titleText = withZPrefix(rawTitle);
    if (heading) heading.remove();

    const body = document.createElement('div');
    body.className = 'z-panel-body';
    while (panel.firstChild) {
      body.appendChild(panel.firstChild);
    }

    const header = document.createElement('div');
    header.className = 'z-panel-header';

    const title = document.createElement('div');
    title.className = 'z-panel-title';
    title.textContent = titleText;
    title.title = 'Single click: Auto-Flex. Double click: popout';
    title.setAttribute(
      'aria-label',
      `${titleText}. Single click runs Auto-Flex (fit + layer). Double click opens popout.`
    );
    title.dataset.cycleHint = '1:Auto-Flex 2:Popout';

    const actions = document.createElement('div');
    actions.className = 'z-panel-actions';
    actions.setAttribute('aria-label', 'Panel quick actions');

    const quickActions = [
      { id: 'autoflex', label: 'Auto-Flex — fit height, bring to front', short: '⚡' },
      { id: 'maximize', label: 'Maximize or restore', short: '⬜' },
      { id: 'popout', label: 'Popout', short: '↗' },
    ];
    quickActions.forEach((item) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'z-panel-quick-action z-panel-btn';
      btn.dataset.action = item.id;
      btn.title = item.label;
      btn.setAttribute('aria-label', item.label);
      btn.textContent = item.short;
      actions.appendChild(btn);
    });
    header.appendChild(title);
    header.appendChild(actions);

    panel.appendChild(header);
    panel.appendChild(body);
    panel.dataset.enhanced = 'true';
    panel.dataset.controlsVersion = PANEL_CONTROLS_VERSION;
    normalizePanelActionButtons(panel);

    if (locked) {
      header.title = 'Locked by SKK';
    }
    const isA11yMode = () =>
      isAccessibleActionsEnabled() || document.body.classList.contains('z-reduce-motion');
    header.draggable = !locked && !isA11yMode();
    header.style.cursor = locked ? 'default' : isA11yMode() ? 'pointer' : 'grab';
    header.classList.add('z-panel-drag-handle');
    header.addEventListener('dragstart', (event) => {
      if (event.target.closest('.z-panel-actions')) {
        event.preventDefault();
        return;
      }
      if (locked || isUiFrozen() || panel.dataset.docked !== 'true') {
        event.preventDefault();
        return;
      }
      draggedPanel = panel;
      panel.classList.add('z-panel-dragging');
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', panel.id);
    });
    header.addEventListener('dragend', () => {
      if (draggedPanel === panel) {
        draggedPanel = null;
      }
      panel.classList.remove('z-panel-dragging');
    });

    const canMutate = () => !locked && !isUiFrozen();

    function persistPartial(patch) {
      const state = getStoredState();
      state[panel.id] = { ...(state[panel.id] || {}), ...patch };
      saveStoredState(state);
      noteUserLayoutChange();
    }

    if (!panel.querySelector('.z-panel-resize-handle')) {
      const resizeHandle = document.createElement('div');
      resizeHandle.className = 'z-panel-resize-handle';
      resizeHandle.title = 'Drag to resize panel';
      panel.appendChild(resizeHandle);

      let resizeState = null;
      const onPointerMove = (event) => {
        if (!resizeState) return;
        const dx = (event.clientX || 0) - resizeState.startX;
        const dy = (event.clientY || 0) - resizeState.startY;
        const dockedNow = panel.dataset.docked === 'true';
        if (dockedNow) {
          const body = panel.querySelector('.z-panel-body');
          if (!body) return;
          const nextMax = Math.round(
            Math.max(120, Math.min(window.innerHeight * 0.82, resizeState.startBodyMax + dy))
          );
          body.style.maxHeight = `${nextMax}px`;
          panel.dataset.length = 'tall';
          return;
        }

        const nextWidth = Math.round(
          Math.max(260, Math.min(window.innerWidth * 0.92, resizeState.startWidth + dx))
        );
        const nextHeight = Math.round(
          Math.max(160, Math.min(window.innerHeight * 0.88, resizeState.startHeight + dy))
        );
        panel.style.width = `${nextWidth}px`;
        panel.style.height = `${nextHeight}px`;
      };

      const onPointerUp = () => {
        if (!resizeState) return;
        const dockedNow = panel.dataset.docked === 'true';
        if (dockedNow) {
          const body = panel.querySelector('.z-panel-body');
          persistPartial({
            bodyMaxHeight: body?.style?.maxHeight || '',
            length: panel.dataset.length || 'medium',
          });
        } else {
          persistPartial({
            width: panel.style.width || '',
            height: panel.style.height || '',
          });
        }
        resizeState = null;
        document.removeEventListener('pointermove', onPointerMove);
        document.removeEventListener('pointerup', onPointerUp);
      };

      resizeHandle.addEventListener('pointerdown', (event) => {
        if (isUiFrozen() || panel.dataset.maximized === 'true') return;
        event.preventDefault();
        event.stopPropagation();
        const body = panel.querySelector('.z-panel-body');
        const rect = panel.getBoundingClientRect();
        const currentBodyMax = body
          ? Number.parseFloat(window.getComputedStyle(body).maxHeight) ||
            body.getBoundingClientRect().height
          : 260;
        resizeState = {
          startX: event.clientX || 0,
          startY: event.clientY || 0,
          startWidth: rect.width,
          startHeight: rect.height,
          startBodyMax: currentBodyMax,
        };
        document.addEventListener('pointermove', onPointerMove);
        document.addEventListener('pointerup', onPointerUp, { once: false });
      });
    }

    function doCollapseToggle() {
      if (!canMutate()) return;
      const collapsed = panel.dataset.collapsed !== 'true';
      if (panel.dataset.minimized === 'true') {
        setMinimized(panel, false);
      }
      setCollapsed(panel, collapsed);
      persistPartial({ collapsed, minimized: false });
    }

    function doMinimizeToggle() {
      if (!canMutate()) return;
      const minimized = panel.dataset.minimized !== 'true';
      if (panel.dataset.collapsed === 'true') {
        setCollapsed(panel, false);
      }
      setMinimized(panel, minimized);
      persistPartial({ minimized, collapsed: false });
    }

    function doMaximizeToggle() {
      if (!canMutate()) return;
      const maximized = panel.dataset.maximized !== 'true';
      if (maximized) {
        bringPanelToFront(panel);
        storeMaximizeState(panel);
      } else {
        restoreMaximizeState(panel);
      }
      setMaximized(panel, maximized);
      if (maximized) {
        setCollapsed(panel, false);
        setMinimized(panel, false);
      }
      if (maximized) {
        panel.style.position = 'fixed';
        panel.style.left = '1rem';
        panel.style.top = '1rem';
        panel.style.right = '1rem';
        panel.style.bottom = '1rem';
        panel.style.width = 'auto';
        panel.style.height = 'auto';
      } else if (panel.dataset.docked === 'true') {
        panel.style.position = '';
        panel.style.left = '';
        panel.style.top = '';
        panel.style.right = '';
        panel.style.bottom = '';
        panel.style.width = '';
        panel.style.height = '';
      }
      persistPartial({ maximized, collapsed: false, minimized: false });
    }

    function doPopout() {
      if (!canMutate()) return;
      openPopout([panel.id]);
      noteUserLayoutChange();
    }
    function doAutoFlex() {
      if (!canMutate()) return;
      panelRunAutoFlex(panel);
      showQuickActions();
    }

    function doExpandMedium() {
      doAutoFlex();
    }

    let lastTouchTapTs = 0;
    let titleTouchTs = 0;
    let titlePointerDownTs = 0;
    let titlePointerDownPos = null;
    let quickHideTimer = null;

    function showQuickActions() {
      panel.classList.add('z-panel-quick-actions-visible');
    }

    function hideQuickActionsWithDelay(delay = 120) {
      if (isA11yMode()) {
        showQuickActions();
        return;
      }
      if (quickHideTimer) clearTimeout(quickHideTimer);
      quickHideTimer = setTimeout(() => {
        panel.classList.remove('z-panel-quick-actions-visible');
      }, delay);
    }

    function movedTooFar(event) {
      if (!titlePointerDownPos) return false;
      const dx = Math.abs((event.clientX || 0) - titlePointerDownPos.x);
      const dy = Math.abs((event.clientY || 0) - titlePointerDownPos.y);
      return dx > 6 || dy > 6;
    }

    // Pre-activate visual cue (hover/touch focus)
    panel.addEventListener('mouseenter', () => {
      panel.classList.add('z-panel-preactive');
      showQuickActions();
    });
    panel.addEventListener('mouseleave', () => {
      panel.classList.remove('z-panel-preactive');
      hideQuickActionsWithDelay(80);
    });
    panel.addEventListener('focusin', () => {
      panel.classList.add('z-panel-preactive');
      showQuickActions();
    });
    panel.addEventListener('focusout', () => {
      panel.classList.remove('z-panel-preactive');
      hideQuickActionsWithDelay(80);
    });
    title.addEventListener(
      'touchstart',
      () => {
        titleTouchTs = Date.now();
        panel.classList.add('z-panel-preactive');
        showQuickActions();
      },
      { passive: true }
    );
    title.addEventListener(
      'touchend',
      () => {
        const now = Date.now();
        if (now - lastTouchTapTs < 380) {
          doPopout();
        } else {
          doAutoFlex();
        }
        lastTouchTapTs = now;
        hideQuickActionsWithDelay(1400);
      },
      { passive: true }
    );

    title.addEventListener('pointerdown', (event) => {
      titlePointerDownTs = Date.now();
      titlePointerDownPos = { x: event.clientX || 0, y: event.clientY || 0 };
    });

    title.addEventListener('click', (event) => {
      event.preventDefault();
      // Avoid ghost-clicks after touch and drag-end misfires.
      if (Date.now() - titleTouchTs < 450) {
        recordUiGuardEvent(panel.id, 'ghost_click_blocked');
        return;
      }
      if (Date.now() - titlePointerDownTs > 800) {
        recordUiGuardEvent(panel.id, 'stale_click_blocked');
        return;
      }
      if (movedTooFar(event)) {
        recordUiGuardEvent(panel.id, 'drag_misfire_blocked');
        return;
      }
      doAutoFlex();
    });

    title.addEventListener('dblclick', (event) => {
      event.preventDefault();
      doPopout();
    });

    title.addEventListener('keydown', (event) => {
      const key = String(event.key || '');
      if (key === 'Enter' || key === ' ') {
        event.preventDefault();
        doAutoFlex();
        return;
      }
      if (key.toLowerCase() === 'p') {
        event.preventDefault();
        doPopout();
      }
    });

    actions.querySelectorAll('.z-panel-quick-action').forEach((btn) => {
      btn.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        const action = btn.dataset.action;
        recordUiGuardEvent(panel.id, `quick_action_${String(action || 'unknown')}`);
        if (action === 'autoflex') doAutoFlex();
        if (action === 'expand') doExpandMedium();
        if (action === 'collapse') doCollapseToggle();
        if (action === 'minimize') doMinimizeToggle();
        if (action === 'maximize') doMaximizeToggle();
        if (action === 'popout') doPopout();
        if (action === 'fit') {
          fitPanelContent(panel, { persist: true });
        }
      });
      btn.addEventListener('pointerdown', (event) => event.stopPropagation());
      btn.addEventListener('mousedown', (event) => event.stopPropagation());
    });

    refreshPanelActionLabels(panel);
  }

  function applyLayout(layoutConfig) {
    const stored = getStoredState();
    const panels = layoutConfig.panels || {};
    const entries = Object.keys(panels).map((id) => ({ id, config: panels[id] }));
    entries.sort((a, b) => (a.config.order || 0) - (b.config.order || 0));
    const focusPanels = getFocusPanels();
    const popoutMode = isPopoutMode();
    const presetName = getSetting(LAYOUT_PRESET_KEY, 'analysis');
    const presetConfig = LAYOUT_PRESETS[presetName] || LAYOUT_PRESETS.analysis;
    const focusMode = focusPanels.size > 0 || presetConfig.mode === 'focus';
    applyFocusMode(focusPanels, presetConfig.mode);

    entries.forEach(({ id, config }) => {
      const panel = document.getElementById(id);
      if (!panel) return;
      const defaultHidden = panel.style.display === 'none';
      const saved = stored[id] || {};
      const forceExpanded = popoutMode && focusPanels.has(id);
      const docked = forceExpanded ? true : (saved.docked ?? config.docked);
      const collapsed = forceExpanded ? false : (saved.collapsed ?? false);
      const minimized = forceExpanded ? false : (saved.minimized ?? false);
      const maximized = saved.maximized ?? false;
      const sizeConfig = PANEL_SIZE_MAP[id] || {};
      const savedLength = typeof saved.length === 'string' ? saved.length : null;
      const locked = isLockedPanel(id);
      const focusHidden =
        focusPanels.size > 0 ? !focusPanels.has(id) : (saved.hidden ?? defaultHidden);
      const hidden = locked && !focusMode ? false : focusHidden;
      if (hidden) {
        panel.style.display = 'none';
        return;
      }
      if (panel.style.display === 'none') {
        panel.style.display = '';
      }
      enhancePanel(panel);
      const panelLength = savedLength || sizeConfig.length || PANEL_SIZE_DEFAULTS.length;
      panel.dataset.length = panelLength;
      panel.dataset.fitMode = saved.fitMode || '';
      applyPanelLengthClasses(panel);
      const columnHint = PANEL_COLUMN_HINTS[panelLength];
      const finalColumn = sizeConfig.column || columnHint || config.column;
      const configWithSize = { ...config, column: finalColumn };
      if (finalColumn === undefined) {
        delete configWithSize.column;
      }
      setDocked(panel, docked, configWithSize, saved);
      setCollapsed(panel, collapsed);
      setMinimized(panel, minimized);
      if (savedLength) {
        panel.dataset.length = savedLength;
      } else {
        const defaultLength = sizeConfig.length || PANEL_SIZE_DEFAULTS.length;
        panel.dataset.length = defaultLength;
      }
      if (maximized) {
        bringPanelToFront(panel);
        storeMaximizeState(panel);
        setMaximized(panel, true);
        panel.style.position = 'fixed';
        panel.style.left = '1rem';
        panel.style.top = '1rem';
        panel.style.right = '1rem';
        panel.style.bottom = '1rem';
        panel.style.width = 'auto';
        panel.style.height = 'auto';
      } else {
        setMaximized(panel, false);
      }
    });
    applyStatusPriorityPinning();
  }

  function getPanelIds() {
    return Object.keys(layoutDefaults.panels);
  }

  function setLayoutPresetLabel(name) {
    const label = document.getElementById('zLayoutPresetLabel');
    const preset = LAYOUT_PRESETS[name] || LAYOUT_PRESETS.analysis;
    if (label) {
      label.textContent = `Active: ${preset.label}`;
    }
  }

  function refreshPanelDirectoryState() {
    const container = document.getElementById('zPanelDirectoryTree');
    if (!container) return;
    const state = getStoredState();
    container.querySelectorAll('input[data-panel-id]').forEach((input) => {
      const panelId = input.dataset.panelId;
      const panel = document.getElementById(panelId);
      const defaultHidden = panel ? panel.style.display === 'none' : false;
      const hidden = state[panelId]?.hidden ?? defaultHidden;
      const resolvedHidden = isLockedPanel(panelId) ? false : hidden;
      input.checked = !resolvedHidden;
      input.disabled = isLockedPanel(panelId);
    });
  }

  const GOVERNANCE_PANELS = new Set([
    'zGovernance',
    'zPriorityPanel',
    'zGovTimelinePanel',
    'zGovernanceReportPanel',
    'zGovernanceReviewPanel',
    'zChainViewPanel',
    'zAutopilotReplayPanel',
  ]);

  const ATTENTION_PANELS = new Set([
    'zAutopilotDebugPanel',
    'zAutopilotSimPanel',
    'zAutopilotStatusPanel',
    'zMasterControlPanel',
    'zAutocompletePanel',
    'zRecentSuggestions',
  ]);

  function resolveIntent(panelId, options = {}) {
    if (options.intent) return options.intent;
    if (GOVERNANCE_PANELS.has(panelId)) {
      const risk = window.ZGovernanceHUD?.getState?.().riskClass || 'low';
      if (risk === 'high' || risk === 'sacred') return 'critical';
      return 'governance';
    }
    if (ATTENTION_PANELS.has(panelId)) return 'attention';
    return 'info';
  }

  function speakWhisper(text, opts = {}) {
    if (!text) return;
    if (!isVoiceWhisperAllowed()) return;
    if (document.body.classList.contains('z-night-mode')) return;
    if (!window.speechSynthesis) return;
    const muted = localStorage.getItem('zCompanionMute') === 'true';
    if (muted) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = opts.rate || 0.92;
    utter.pitch = opts.pitch || 1.05;
    window.speechSynthesis.speak(utter);
  }

  function maybeWhisper(panel, options = {}) {
    if (!panel) return;
    if (!options.userInitiated) return;
    const intent = resolveIntent(panel.id, options);
    if (intent === 'critical') return;
    const label = options.label || panel.dataset.title || panel.id;
    const message =
      intent === 'governance'
        ? 'This panel is safe to review.'
        : `Here you are. Take your time with ${label}.`;
    speakWhisper(message);
  }

  function pulsePanel(panel, options = {}) {
    if (!panel) return;
    const intent = resolveIntent(panel.id, options);
    panel.dataset.pulseIntent = intent;
    panel.classList.remove('z-locate-pulse');
    panel.classList.remove('z-locate-muted');
    void panel.offsetWidth;
    if (intent === 'critical') {
      panel.classList.add('z-locate-muted');
      setTimeout(() => {
        panel.classList.remove('z-locate-muted');
      }, 1800);
      return;
    }
    panel.classList.add('z-locate-pulse');
    setTimeout(() => {
      panel.classList.remove('z-locate-pulse');
    }, 1800);
  }

  function revealPanel(panelId, options = {}) {
    const panel = document.getElementById(panelId);
    if (!panel) return;
    if (panelId === 'zIntelligencePanel') {
      if (getSetting(INTELLIGENCE_LOCK_KEY, '1') === '1') {
        return;
      }
      setSetting(INTELLIGENCE_OPTIN_KEY, '1');
    }
    const state = getStoredState();
    if (state[panelId]?.hidden) {
      setHidden(panelId, false, { manual: true });
      applyLayout(layoutDefaults);
      refreshPanelDirectoryState();
    } else if (panel.style.display === 'none') {
      panel.style.display = '';
    }
    bringPanelToFront(panel);
    const column = panel.closest('.z-layout-col');
    if (column) {
      const offset = panel.offsetTop - column.clientHeight / 2;
      column.scrollTo({ top: Math.max(0, offset), behavior: 'smooth' });
    } else {
      panel.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    if (panel.classList.contains('z-panel-floating')) {
      const rect = panel.getBoundingClientRect();
      const offscreen =
        rect.right < 0 ||
        rect.bottom < 0 ||
        rect.left > window.innerWidth ||
        rect.top > window.innerHeight;
      if (offscreen) {
        panel.style.left = '8%';
        panel.style.top = '10%';
        panel.style.right = 'auto';
        panel.style.bottom = 'auto';
      }
    }
    pulsePanel(panel, options);
    maybeWhisper(panel, options);
  }

  function applyLayoutPreset(name, options = {}) {
    const preset = LAYOUT_PRESETS[name] || LAYOUT_PRESETS.analysis;
    const force = options.force === true;
    setSetting(LAYOUT_PRESET_KEY, name);

    if (!options.skipCalm) {
      setCalmMode(Boolean(preset.calmMode));
    }

    const state = getStoredState();
    getPanelIds().forEach((panelId) => {
      const shouldShow =
        preset.panels.includes(panelId) || (isLockedPanel(panelId) && preset.mode !== 'focus');
      const entry = state[panelId] || {};
      const authority = entry.authority || 'preset';
      if (authority === 'manual' && !force) return;
      const updated = updatePanelVisibility(panelId, shouldShow, 'preset');
      state[panelId] = updated;
    });
    setLayoutPresetLabel(name);
    if (!options.skipApply) {
      applyLayout(layoutDefaults);
      refreshPanelDirectoryState();
    }
  }

  function setCalmMode(enabled, options = {}) {
    document.body.classList.toggle('calm-mode', enabled);
    if (!options.skipPersist) {
      setSetting(CALM_MODE_KEY, enabled ? '1' : '0');
    }
    const toggle = document.getElementById('zCalmModeToggle');
    if (toggle) {
      toggle.checked = enabled;
    }
  }

  function toggleCalmMode(enabled, options = {}) {
    const currentPreset = getSetting(LAYOUT_PRESET_KEY, 'analysis');
    const force = options.force === true;
    if (enabled) {
      if (currentPreset !== 'calm') {
        setSetting(LAST_PRESET_KEY, currentPreset);
      }
      setCalmMode(true);
      applyLayoutPreset('calm', { skipCalm: true, force });
    } else {
      setCalmMode(false);
      const lastPreset = getSetting(LAST_PRESET_KEY, 'analysis');
      applyLayoutPreset(lastPreset, { skipCalm: true, force });
    }
  }

  function noteUserLayoutChange() {
    if (window.ZAutoPilot?.recordToggleEvent) {
      window.ZAutoPilot.recordToggleEvent();
    }
    if (window.ZAutoPilot?.setUserOverride) {
      window.ZAutoPilot.setUserOverride(120000);
    }
  }

  function updatePanelOrderFromDom() {
    const layout = document.getElementById('zLayout');
    if (!layout) return;
    const state = getStoredState();
    layout.querySelectorAll('.z-layout-col').forEach((column) => {
      const columnId = column.dataset.column;
      const panels = Array.from(column.querySelectorAll('.z-panel'));
      panels.forEach((panel, index) => {
        panel.style.order = index + 1;
        panel.dataset.column = columnId;
        panel.dataset.order = String(index + 1);
        state[panel.id] = {
          ...(state[panel.id] || {}),
          column: columnId,
          order: index + 1,
          docked: true,
        };
      });
    });
    saveStoredState(state);
  }

  function initDragAndDrop(layout) {
    if (!layout || layout.dataset.dragReady === 'true') return;
    layout.dataset.dragReady = 'true';

    layout.addEventListener('dragover', (event) => {
      if (!draggedPanel) return;
      if (isUiFrozen()) return;
      event.preventDefault();
    });

    layout.addEventListener('drop', (event) => {
      if (!draggedPanel) return;
      if (isUiFrozen()) return;
      event.preventDefault();
      const column = event.target.closest('.z-layout-col');
      if (!column) return;
      const targetPanel = event.target.closest('.z-panel');
      if (targetPanel && targetPanel !== draggedPanel) {
        targetPanel.before(draggedPanel);
      } else {
        column.appendChild(draggedPanel);
      }
      updatePanelOrderFromDom();
      noteUserLayoutChange();
      draggedPanel = null;
    });
  }

  async function initLayout() {
    let config = layoutDefaults;
    try {
      const resp = await fetch('/data/ui_layout.json');
      if (resp.ok) {
        config = await resp.json();
      }
    } catch (err) {
      config = layoutDefaults;
    }
    const stored = getStoredState();
    const hasStoredState = Object.keys(stored).length > 0;
    const presetName = getSetting(LAYOUT_PRESET_KEY, 'analysis');
    if (!hasStoredState && getFocusPanels().size === 0) {
      applyLayoutPreset(presetName, { skipApply: true, skipCalm: true });
    } else {
      setLayoutPresetLabel(presetName);
    }
    applyLayout(config);
    applyGridLayoutV1();
    initDragAndDrop(ensureLayoutContainer());
  }

  function initLayoutPresets() {
    const focusBtn = document.getElementById('zLayoutPresetFocusBtn');
    const analysisBtn = document.getElementById('zLayoutPresetAnalysisBtn');
    const governanceBtn = document.getElementById('zLayoutPresetGovernanceBtn');

    if (focusBtn) {
      focusBtn.addEventListener('click', () => {
        applyLayoutPreset('focus', { force: true });
        noteUserLayoutChange();
      });
    }
    if (analysisBtn) {
      analysisBtn.addEventListener('click', () => {
        applyLayoutPreset('analysis', { force: true });
        noteUserLayoutChange();
      });
    }
    if (governanceBtn) {
      governanceBtn.addEventListener('click', () => {
        applyLayoutPreset('governance', { force: true });
        noteUserLayoutChange();
      });
    }
  }

  function initCalmModeToggle() {
    const toggle = document.getElementById('zCalmModeToggle');
    if (!toggle) return;
    const enabled = getBooleanSetting(CALM_MODE_KEY, false);
    if (enabled) {
      toggleCalmMode(true);
    } else {
      setCalmMode(false, { skipPersist: true });
    }
    toggle.addEventListener('change', () => {
      toggleCalmMode(toggle.checked, { force: true });
      noteUserLayoutChange();
    });
  }

  function refreshVoiceControlAvailability() {
    const toggle = document.getElementById('zVoiceControlToggle');
    if (!toggle) return;
    const listening = isListeningAllowed();
    toggle.disabled = !listening;
    if (!listening && getBooleanSetting(VOICE_CONTROL_KEY, false)) {
      setVoiceControlEnabled(false);
    }
  }

  function setListeningConsent(enabled, options = {}) {
    setSetting(LISTENING_KEY, enabled ? '1' : '0');
    refreshConsentGlobals();
    refreshVoiceControlAvailability();
    if (!enabled) {
      stopVoiceControl();
    } else if (getBooleanSetting(VOICE_CONTROL_KEY, false)) {
      startVoiceControl();
    }
    if (options.announce !== false) {
      logConsentEvent('listening', enabled);
    }
  }

  function setVoiceWhisper(enabled, options = {}) {
    setSetting(VOICE_WHISPER_KEY, enabled ? '1' : '0');
    refreshConsentGlobals();
    if (options.announce !== false) {
      logConsentEvent('voice_whisper', enabled);
    }
  }

  function logConsentEvent(feature, enabled) {
    if (!window.ZAutopilotReplay?.log) return;
    window.ZAutopilotReplay.log({
      source: 'consent',
      action: 'consent_change',
      value: `${feature}:${enabled ? 'on' : 'off'}`,
      reason: { feature, enabled },
    });
  }

  function initListeningToggle() {
    const toggle = document.getElementById('zListeningToggle');
    if (!toggle) return;
    const enabled = isListeningAllowed();
    toggle.checked = enabled;
    toggle.addEventListener('change', () => {
      setListeningConsent(toggle.checked);
      noteUserLayoutChange();
    });
    refreshVoiceControlAvailability();
  }

  function initVoiceWhisperToggle() {
    const toggle = document.getElementById('zVoiceWhisperToggle');
    if (!toggle) return;
    const enabled = isVoiceWhisperAllowed();
    toggle.checked = enabled;
    toggle.addEventListener('change', () => {
      setVoiceWhisper(toggle.checked);
      noteUserLayoutChange();
    });
  }

  function speak(text) {
    if (!text || !window.speechSynthesis) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 0.95;
    utter.pitch = 0.95;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  }

  function handleVoiceCommand(command) {
    const text = command.toLowerCase();
    if (text.includes('calm mode on') || text.includes('rkpk calm') || text.includes('calm mode')) {
      toggleCalmMode(true, { force: true });
      speak('Calm mode on.');
      noteUserLayoutChange();
      return;
    }
    if (text.includes('calm mode off')) {
      toggleCalmMode(false, { force: true });
      speak('Calm mode off.');
      noteUserLayoutChange();
      return;
    }
    if (text.includes('focus layout') || text.includes('skk focus')) {
      applyLayoutPreset('focus', { force: true });
      speak('Focus layout active.');
      noteUserLayoutChange();
      return;
    }
    if (text.includes('analysis layout')) {
      applyLayoutPreset('analysis', { force: true });
      speak('Analysis layout active.');
      noteUserLayoutChange();
      return;
    }
    if (text.includes('governance layout')) {
      applyLayoutPreset('governance', { force: true });
      speak('Governance layout active.');
      noteUserLayoutChange();
    }
  }

  function startVoiceControl() {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) return false;
    if (!isListeningAllowed()) return false;
    if (voiceController) return true;
    const recognizer = new Recognition();
    recognizer.lang = 'en-US';
    recognizer.continuous = true;
    recognizer.interimResults = false;
    recognizer.onresult = (event) => {
      const result = event.results[event.results.length - 1][0];
      if (result && result.transcript) {
        handleVoiceCommand(result.transcript.trim());
      }
    };
    recognizer.onerror = () => {};
    recognizer.onend = () => {
      if (voiceController) {
        setTimeout(() => recognizer.start(), 800);
      }
    };
    recognizer.start();
    voiceController = recognizer;
    return true;
  }

  function stopVoiceControl() {
    if (!voiceController) return;
    voiceController.onend = null;
    voiceController.stop();
    voiceController = null;
  }

  function setVoiceControlEnabled(enabled) {
    const toggle = document.getElementById('zVoiceControlToggle');
    if (toggle) {
      toggle.checked = enabled;
    }
    setSetting(VOICE_CONTROL_KEY, enabled ? '1' : '0');
    if (enabled && !isListeningAllowed()) {
      if (toggle) toggle.checked = false;
      setSetting(VOICE_CONTROL_KEY, '0');
      return;
    }
    if (enabled) {
      const started = startVoiceControl();
      if (!started && toggle) {
        toggle.checked = false;
        setSetting(VOICE_CONTROL_KEY, '0');
      }
    } else {
      stopVoiceControl();
    }
  }

  function initVoiceControl() {
    const toggle = document.getElementById('zVoiceControlToggle');
    const enabled = getBooleanSetting(VOICE_CONTROL_KEY, false);
    if (toggle) {
      toggle.checked = enabled;
      toggle.addEventListener('change', () => {
        setVoiceControlEnabled(toggle.checked);
        noteUserLayoutChange();
      });
    }
    refreshVoiceControlAvailability();
    if (enabled) {
      if (isListeningAllowed()) {
        const started = startVoiceControl();
        if (!started) {
          setVoiceControlEnabled(false);
        }
      } else {
        setVoiceControlEnabled(false);
      }
    }
  }

  function exportLayoutState() {
    updatePanelOrderFromDom();
    const payload = {
      version: 1,
      preset: getSetting(LAYOUT_PRESET_KEY, 'analysis'),
      calmMode: getBooleanSetting(CALM_MODE_KEY, false),
      autoLayout: getBooleanSetting(AUTO_LAYOUT_KEY, false),
      compactControls: getBooleanSetting(COMPACT_CONTROLS_KEY, true),
      splitLayout: getSetting(SPLIT_LAYOUT_KEY, 'auto'),
      compactEdgebar: getBooleanSetting(COMPACT_EDGEBAR_KEY, false),
      uiZoom: getSetting(UI_ZOOM_KEY, String(UI_ZOOM_DEFAULT)),
      uiZoomDeviceProfiles: readZoomDeviceProfiles(),
      uiDensity: getSetting(UI_DENSITY_KEY, 'normal'),
      reduceMotion: getBooleanSetting(REDUCE_MOTION_KEY, false),
      accessibleActions: getBooleanSetting(ACCESSIBLE_ACTIONS_KEY, false),
      singleTapMode: getBooleanSetting(SINGLE_TAP_MODE_KEY, false),
      panelState: getStoredState(),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'z_layout.json';
    link.click();
    URL.revokeObjectURL(url);
  }

  function importLayoutState(payload) {
    if (!payload || typeof payload !== 'object') return false;
    if (payload.panelState) {
      saveStoredState(payload.panelState);
    }
    if (payload.preset) {
      setSetting(LAYOUT_PRESET_KEY, payload.preset);
      setLayoutPresetLabel(payload.preset);
    }
    if (typeof payload.calmMode === 'boolean') {
      setSetting(CALM_MODE_KEY, payload.calmMode ? '1' : '0');
      setCalmMode(payload.calmMode, { skipPersist: true });
    }
    if (typeof payload.autoLayout === 'boolean') {
      setSetting(AUTO_LAYOUT_KEY, payload.autoLayout ? '1' : '0');
      const toggle = document.getElementById('zAutoLayoutToggle');
      if (toggle) toggle.checked = payload.autoLayout;
    }
    if (typeof payload.compactControls === 'boolean') {
      setSetting(COMPACT_CONTROLS_KEY, payload.compactControls ? '1' : '0');
      applyCompactControls(payload.compactControls);
    }
    if (typeof payload.splitLayout === 'string') {
      setSetting(SPLIT_LAYOUT_KEY, payload.splitLayout);
      applySplitLayout(payload.splitLayout);
    }
    if (typeof payload.compactEdgebar === 'boolean') {
      setSetting(COMPACT_EDGEBAR_KEY, payload.compactEdgebar ? '1' : '0');
      applyCompactEdgebar(payload.compactEdgebar);
    }
    if (payload.uiZoom) {
      setSetting(UI_ZOOM_KEY, String(payload.uiZoom));
      const nextZoom = clampZoomValue(parseFloat(payload.uiZoom) || UI_ZOOM_DEFAULT);
      applyUiZoom(nextZoom);
      rememberZoomForCurrentDevice(nextZoom, 'layout_import');
    }
    if (payload.uiZoomDeviceProfiles && typeof payload.uiZoomDeviceProfiles === 'object') {
      writeZoomDeviceProfiles(payload.uiZoomDeviceProfiles);
    }
    if (payload.uiDensity) {
      setSetting(UI_DENSITY_KEY, payload.uiDensity);
      applyDensity(payload.uiDensity);
    }
    if (typeof payload.reduceMotion === 'boolean') {
      setSetting(REDUCE_MOTION_KEY, payload.reduceMotion ? '1' : '0');
      applyReduceMotion(payload.reduceMotion);
    }
    if (typeof payload.accessibleActions === 'boolean') {
      setSetting(ACCESSIBLE_ACTIONS_KEY, payload.accessibleActions ? '1' : '0');
      applyAccessibleActions(payload.accessibleActions);
    }
    if (typeof payload.singleTapMode === 'boolean') {
      setSetting(SINGLE_TAP_MODE_KEY, payload.singleTapMode ? '1' : '0');
      applySingleTapMode(payload.singleTapMode);
    }
    applyLayout(layoutDefaults);
    refreshPanelDirectoryState();
    if (window.ZAutoPilot?.freezeFor) {
      window.ZAutoPilot.freezeFor(AUTOPILOT_CONFIG.freeze.freezeOnExportImportMs, {
        source: 'layout_import',
        reason: 'layout_import',
      });
    }
    noteUserLayoutChange();
    return true;
  }

  function importLayoutFromFile(file) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const payload = JSON.parse(reader.result);
        if (!importLayoutState(payload)) {
          speak('Import failed.');
        }
      } catch (err) {
        speak('Import failed.');
      }
    };
    reader.readAsText(file);
  }

  function initLayoutTransfer() {
    const exportBtn = document.getElementById('zLayoutExportBtn');
    const importBtn = document.getElementById('zLayoutImportBtn');
    const auditBtn = document.getElementById('zAuditFormulaVaultBtn');
    if (exportBtn) {
      exportBtn.addEventListener('click', exportLayoutState);
    }
    if (importBtn) {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'application/json';
      input.style.display = 'none';
      input.addEventListener('change', () => {
        const file = input.files && input.files[0];
        if (file) importLayoutFromFile(file);
        input.value = '';
      });
      document.body.appendChild(input);
      importBtn.addEventListener('click', () => input.click());
    }
    if (auditBtn) {
      auditBtn.addEventListener('click', () => {
        window.ZChronicle?.write?.({
          type: 'z.formula.audit_requested',
          ts: new Date().toISOString(),
        });
        window.alert('Formula vault audit requires running: python scripts/audit_formula_vault.py');
      });
    }
  }

  function detectScreenTier() {
    const width = window.innerWidth;
    if (width >= 1800) return 'xl';
    if (width >= 1400) return 'lg';
    if (width >= 1100) return 'md';
    return 'sm';
  }

  function initAutoLayout() {
    const toggle = document.getElementById('zAutoLayoutToggle');
    let lastTier = null;

    const applyTierLayout = (tier) => {
      if (tier === 'sm') {
        applyLayoutPreset('focus', { skipCalm: true });
      } else if (tier === 'md') {
        applyLayoutPreset('analysis', { skipCalm: true });
      } else {
        applyLayoutPreset('analysis', { skipCalm: true });
      }
    };

    const tick = () => {
      if (!getBooleanSetting(AUTO_LAYOUT_KEY, false)) return;
      const tier = detectScreenTier();
      if (tier !== lastTier) {
        lastTier = tier;
        applyTierLayout(tier);
      }
    };

    if (toggle) {
      toggle.checked = getBooleanSetting(AUTO_LAYOUT_KEY, false);
      toggle.addEventListener('change', () => {
        setSetting(AUTO_LAYOUT_KEY, toggle.checked ? '1' : '0');
        if (toggle.checked) {
          tick();
        }
        noteUserLayoutChange();
      });
    }

    window.addEventListener('resize', tick);
    tick();
  }

  function initSplitLayout() {
    const select = document.getElementById('zSplitLayoutSelect');
    const mode = getSetting(SPLIT_LAYOUT_KEY, 'auto');
    applySplitLayout(mode);
    if (select) {
      select.value = mode;
      select.addEventListener('change', () => {
        const next = select.value || 'auto';
        setSetting(SPLIT_LAYOUT_KEY, next);
        applySplitLayout(next);
        noteUserLayoutChange();
      });
    }
  }

  function initCompactControls() {
    const toggle = document.getElementById('zCompactControlsToggle');
    const enabled = getBooleanSetting(COMPACT_CONTROLS_KEY, true);
    applyCompactControls(enabled);
    if (toggle) {
      toggle.checked = enabled;
      toggle.addEventListener('change', () => {
        setSetting(COMPACT_CONTROLS_KEY, toggle.checked ? '1' : '0');
        applyCompactControls(toggle.checked);
        noteUserLayoutChange();
      });
    }
  }

  function initReduceMotionToggle() {
    const toggle = document.getElementById('zReduceMotionToggle');
    const enabled = getBooleanSetting(REDUCE_MOTION_KEY, false);
    applyReduceMotion(enabled);
    if (toggle) {
      toggle.checked = enabled;
      toggle.addEventListener('change', () => {
        setSetting(REDUCE_MOTION_KEY, toggle.checked ? '1' : '0');
        applyReduceMotion(toggle.checked);
        noteUserLayoutChange();
      });
    }
  }

  function initAccessibleActionsToggle() {
    const toggle = document.getElementById('zAccessibleActionsToggle');
    const enabled = getBooleanSetting(ACCESSIBLE_ACTIONS_KEY, false);
    applyAccessibleActions(enabled);
    if (toggle) {
      toggle.checked = enabled;
      toggle.addEventListener('change', () => {
        setSetting(ACCESSIBLE_ACTIONS_KEY, toggle.checked ? '1' : '0');
        applyAccessibleActions(toggle.checked);
        // Rebind panel title drag cursor behavior immediately.
        window.ZLayoutOS?.refreshPanelControls?.(true);
        noteUserLayoutChange();
      });
    }
  }

  function initSingleTapModeToggle() {
    const toggle = document.getElementById('zSingleTapModeToggle');
    const enabled = getBooleanSetting(SINGLE_TAP_MODE_KEY, false);
    applySingleTapMode(enabled);
    if (toggle) {
      toggle.checked = enabled;
      toggle.addEventListener('change', () => {
        setSetting(SINGLE_TAP_MODE_KEY, toggle.checked ? '1' : '0');
        applySingleTapMode(toggle.checked);
        noteUserLayoutChange();
      });
    }
  }

  function getAutoScrollSpeedPreset() {
    const runtime = window.__Z_RUNTIME_AUTO_SCROLL_SPEED__;
    if (runtime === 'calm' || runtime === 'fast' || runtime === 'balanced') return runtime;
    const raw = getSetting(AUTO_SCROLL_SPEED_KEY, 'balanced');
    if (raw === 'calm' || raw === 'fast' || raw === 'balanced') return raw;
    return 'balanced';
  }

  function getPanelAutoScrollSpeedMap() {
    try {
      const parsed = JSON.parse(getSetting(AUTO_SCROLL_PANEL_SPEEDS_KEY, '{}') || '{}');
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch {
      return {};
    }
  }

  function setPanelAutoScrollSpeed(panelId, preset) {
    const next =
      preset === 'calm' || preset === 'balanced' || preset === 'fast' ? preset : 'inherit';
    const map = getPanelAutoScrollSpeedMap();
    if (next === 'inherit') {
      delete map[panelId];
    } else {
      map[panelId] = next;
    }
    setSetting(AUTO_SCROLL_PANEL_SPEEDS_KEY, JSON.stringify(map));
  }

  function resolveSpeedPresetForElement(el) {
    const panel = el?.closest?.('.z-panel');
    if (!panel) return getAutoScrollSpeedPreset();
    const map = getPanelAutoScrollSpeedMap();
    return map[panel.id] || getAutoScrollSpeedPreset();
  }

  function getAutoScrollSpeedProfileForPreset(preset) {
    if (preset === 'calm') {
      return { name: 'calm', speedMul: 0.72, accelMul: 0.7, maxMul: 0.8 };
    }
    if (preset === 'fast') {
      return { name: 'fast', speedMul: 1.35, accelMul: 1.3, maxMul: 1.45 };
    }
    return { name: 'balanced', speedMul: 1, accelMul: 1, maxMul: 1 };
  }

  function isInteractiveFocusActive() {
    const active = document.activeElement;
    if (!active) return false;
    const tag = (active.tagName || '').toLowerCase();
    return tag === 'input' || tag === 'textarea' || tag === 'select' || active.isContentEditable;
  }

  function initAutoScrollSpeedControl() {
    const select = document.getElementById('zAutoScrollSpeedSelect');
    const label = document.getElementById('zAutoScrollSpeedLabel');
    window.__Z_USER_OVERRIDE_SCROLL_SPEED__ = localStorage.getItem(AUTO_SCROLL_SPEED_KEY) !== null;

    function setAutoScrollSpeedPreset(preset, options = {}) {
      const next = preset === 'calm' || preset === 'fast' ? preset : 'balanced';
      const manual = options.manual !== false;
      const persist = options.persist !== false;
      if (persist) {
        setSetting(AUTO_SCROLL_SPEED_KEY, next);
      }
      window.__Z_USER_OVERRIDE_SCROLL_SPEED__ = manual;
      window.__Z_RUNTIME_AUTO_SCROLL_SPEED__ = next;
      if (select) select.value = next;
      if (label) {
        label.textContent = `Auto scroll: ${next.charAt(0).toUpperCase()}${next.slice(1)}`;
      }
    }

    window.setZAutoScrollSpeedPreset = (preset, options = {}) =>
      setAutoScrollSpeedPreset(preset, options);
    const preset = getAutoScrollSpeedPreset();
    if (select) {
      select.value = preset;
      select.addEventListener('change', () => {
        setAutoScrollSpeedPreset(select.value, { manual: true, persist: true });
        noteUserLayoutChange();
      });
    }
    setAutoScrollSpeedPreset(preset, {
      manual: window.__Z_USER_OVERRIDE_SCROLL_SPEED__,
      persist: false,
    });

    window.addEventListener('z-display-profile-changed', (event) => {
      if (window.__Z_USER_OVERRIDE_SCROLL_SPEED__) return;
      if (isInteractiveFocusActive()) return;
      const profile = event?.detail?.profile || 'desktop';
      const presetByProfile = {
        ultra: 'fast',
        wide: 'balanced',
        desktop: 'balanced',
        'compact-desktop': 'balanced',
        tablet: 'calm',
        mobile: 'calm',
      };
      setAutoScrollSpeedPreset(presetByProfile[profile] || 'balanced', {
        manual: false,
        persist: false,
      });
    });
  }

  function initAutoScrollPanelOverrides() {
    const controls = [
      { panelId: 'zChroniclePanel', selectId: 'zAutoScrollChronicleSelect' },
      { panelId: 'zCodexSuggestionsPanel', selectId: 'zAutoScrollCodexSelect' },
      { panelId: 'zAwarenessPanel', selectId: 'zAutoScrollAwarenessSelect' },
    ];
    const map = getPanelAutoScrollSpeedMap();
    controls.forEach(({ panelId, selectId }) => {
      const select = document.getElementById(selectId);
      if (!select) return;
      select.value = map[panelId] || 'inherit';
      select.addEventListener('change', () => {
        const next = select.value;
        setPanelAutoScrollSpeed(panelId, next);
        noteUserLayoutChange();
      });
    });
  }

  function initReduceMotionPreference() {
    if (!window.matchMedia) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const stored = getSetting(REDUCE_MOTION_KEY, null);
    if (stored === null) {
      applyReduceMotion(prefersReduced.matches);
      setSetting(REDUCE_MOTION_KEY, prefersReduced.matches ? '1' : '0');
    }
    prefersReduced.addEventListener('change', (event) => {
      if (getSetting(REDUCE_MOTION_KEY, null) === null) {
        applyReduceMotion(event.matches);
      }
    });
  }

  function initHiveEffects() {
    const glowToggle = document.getElementById('zHiveGlowToggle');
    const spinToggle = document.getElementById('zHiveSpinToggle');
    const hive3dToggle = document.getElementById('zHive3dToggle');
    const spinSpeed = document.getElementById('zHiveSpinSpeed');
    const glowEnabled = getBooleanSetting(HIVE_GLOW_KEY, true);
    const spinEnabled = getBooleanSetting(HIVE_SPIN_KEY, false);
    const spinSpeedValue = getSetting(HIVE_SPIN_SPEED_KEY, '90');
    const hive3dEnabled = getBooleanSetting(HIVE_3D_KEY, false);
    applyHiveGlow(glowEnabled);
    applyHiveSpin(spinEnabled);
    applyHiveSpinSpeed(spinSpeedValue);
    applyHive3D(hive3dEnabled);

    if (glowToggle) {
      glowToggle.checked = glowEnabled;
      glowToggle.addEventListener('change', () => {
        setSetting(HIVE_GLOW_KEY, glowToggle.checked ? '1' : '0');
        applyHiveGlow(glowToggle.checked);
        noteUserLayoutChange();
      });
    }
    if (spinToggle) {
      spinToggle.checked = spinEnabled;
      spinToggle.addEventListener('change', () => {
        setSetting(HIVE_SPIN_KEY, spinToggle.checked ? '1' : '0');
        applyHiveSpin(spinToggle.checked);
        noteUserLayoutChange();
      });
    }
    if (hive3dToggle) {
      hive3dToggle.checked = hive3dEnabled;
      hive3dToggle.addEventListener('change', () => {
        setSetting(HIVE_3D_KEY, hive3dToggle.checked ? '1' : '0');
        applyHive3D(hive3dToggle.checked);
        noteUserLayoutChange();
      });
    }
    if (spinSpeed) {
      spinSpeed.value = spinSpeedValue;
      spinSpeed.addEventListener('input', () => {
        applyHiveSpinSpeed(spinSpeed.value);
      });
    }

    window.addEventListener('resize', () => {
      if (document.body.classList.contains('z-hive-3d')) {
        layoutHive3D();
      }
    });
  }

  function initDensityToggles() {
    const compactToggle = document.getElementById('zCompactModeToggle');
    const ultraToggle = document.getElementById('zUltraCompactToggle');
    const stored = getSetting(UI_DENSITY_KEY, 'normal');
    window.__Z_USER_OVERRIDE_DENSITY__ = localStorage.getItem(UI_DENSITY_KEY) !== null;
    window.setZDensity = (mode, options = {}) => setDensity(mode, options);
    applyDensity(stored);

    if (compactToggle) {
      compactToggle.addEventListener('change', () => {
        if (compactToggle.checked) {
          if (ultraToggle) ultraToggle.checked = false;
          setDensity('compact');
        } else if (!ultraToggle?.checked) {
          setDensity('normal');
        }
        noteUserLayoutChange();
      });
    }

    if (ultraToggle) {
      ultraToggle.addEventListener('change', () => {
        if (ultraToggle.checked) {
          if (compactToggle) compactToggle.checked = false;
          setDensity('ultra');
        } else if (!compactToggle?.checked) {
          setDensity('normal');
        }
        noteUserLayoutChange();
      });
    }
  }

  function initDensityPresets() {
    const presets = [
      { id: 'zDensityPresetNormal', value: 'normal' },
      { id: 'zDensityPresetCompact', value: 'compact' },
      { id: 'zDensityPresetUltra', value: 'ultra' },
    ];

    presets.forEach((preset) => {
      const btn = document.getElementById(preset.id);
      if (!btn) return;
      btn.addEventListener('click', () => {
        setDensity(preset.value);
        noteUserLayoutChange();
      });
    });
  }

  function initCompactEdgebar() {
    const toggle = document.getElementById('zCompactEdgebarToggle');
    const enabled = getBooleanSetting(COMPACT_EDGEBAR_KEY, false);
    applyCompactEdgebar(enabled);
    if (toggle) {
      toggle.checked = enabled;
      toggle.addEventListener('change', () => {
        setSetting(COMPACT_EDGEBAR_KEY, toggle.checked ? '1' : '0');
        applyCompactEdgebar(toggle.checked);
        noteUserLayoutChange();
      });
    }
  }

  function initGridLayoutToggle() {
    const toggle = document.getElementById('zGridLayoutToggle');
    if (!toggle) return;
    const enabled = getSetting(GRID_LAYOUT_KEY, '1') !== '0';
    toggle.checked = enabled;
    toggle.addEventListener('change', () => {
      setSetting(GRID_LAYOUT_KEY, toggle.checked ? '1' : '0');
      applyGridLayoutV1();
      noteUserLayoutChange();
    });
  }

  function initPanelAutoRefreshHooks() {
    const allowedBots = new Set(['ScribeBot', 'ProtectorBot', 'DesignerBot', 'NavigatorBot']);
    const cooldownMs = 20000;
    let lastTs = 0;

    window.ZPanelRefresh = {
      request(source = 'manual') {
        const now = Date.now();
        if (now - lastTs < cooldownMs) return false;
        lastTs = now;
        return window.ZLayoutOS?.autoRefreshPanels?.(source);
      },
      notifyBot(botName) {
        if (!allowedBots.has(botName)) return false;
        return window.ZPanelRefresh.request(`bot:${botName}`);
      },
    };

    window.addEventListener('z-bot-complete', (event) => {
      const botName = event?.detail?.bot;
      if (!botName || !allowedBots.has(botName)) return;
      window.ZPanelRefresh.request(`bot:${botName}`);
    });
  }

  function initLayoutOS() {
    window.ZLayoutOS = {
      applyLayout: () => applyLayout(layoutDefaults),
      applyLayoutPreset,
      refreshPanelDirectoryState,
      revealPanel,
      bringPanelToFront,
      panelRunAutoFlex: (panelId) => {
        const p = document.getElementById(panelId);
        return p ? panelRunAutoFlex(p) : false;
      },
      pulsePanel,
      fitPanelContent: (panelId) => {
        const panel = document.getElementById(panelId);
        if (!panel) return false;
        return fitPanelContent(panel, { persist: true });
      },
      resetPanelSizes: () => resetPanelSizes(),
      resetPriorityResolutionMemory: () => {
        const ok = clearPriorityResolutionMemory();
        if (ok) applyPriorityDrivenLayout();
        return ok;
      },
      setFocusQueueMode,
      isListeningAllowed,
      isVoiceWhisperAllowed,
      setListeningConsent,
      setVoiceWhisper,
      resetManualOverrides,
      setPanelHidden: (panelId, hidden) => {
        if (!panelId) return;
        setHidden(panelId, hidden, { manual: true });
        applyLayout(layoutDefaults);
        refreshPanelDirectoryState();
      },
      getStoredState,
      saveStoredState,
      setCalmMode,
      toggleCalmMode,
      setNightModeOverride,
      applyNightMode,
      setVoiceControlEnabled,
      auditPanels: () => {
        const report = [];
        document.querySelectorAll('.z-panel').forEach((panel) => {
          const header = panel.querySelector('.z-panel-header');
          const actions = panel.querySelectorAll('.z-panel-actions [data-action]');
          const actionKeys = new Set();
          actions.forEach((btn) => {
            if (btn.dataset.action) actionKeys.add(btn.dataset.action);
          });
          const missing = ['autoflex', 'maximize', 'popout'].filter((key) => !actionKeys.has(key));
          report.push({
            id: panel.id,
            enhanced: Boolean(header),
            actionCount: actions.length,
            missingActions: missing,
            hidden: panel.style.display === 'none' || panel.dataset.hidden === 'true',
            collapsed: panel.dataset.collapsed === 'true',
            minimized: panel.dataset.minimized === 'true',
            maximized: panel.dataset.maximized === 'true',
          });
        });
        return report;
      },
      repairPanels: () => {
        const stored = getStoredState();
        document.querySelectorAll('.z-panel').forEach((panel) => {
          const saved = stored[panel.id] || {};
          const collapsed = saved.collapsed ?? false;
          const minimized = saved.minimized ?? false;
          enhancePanel(panel);
          setCollapsed(panel, collapsed);
          setMinimized(panel, minimized);
        });
        refreshPanelDirectoryState();
      },
      refreshPanelControls: (force = false) => {
        const stored = getStoredState();
        document.querySelectorAll('.z-panel').forEach((panel) => {
          const needsRefresh = force || panel.dataset.controlsVersion !== PANEL_CONTROLS_VERSION;
          if (!needsRefresh) return;
          resetPanelEnhancement(panel);
          const saved = stored[panel.id] || {};
          const collapsed = saved.collapsed ?? false;
          enhancePanel(panel);
          setCollapsed(panel, collapsed);
          setMinimized(panel, saved.minimized ?? false);
          setMaximized(panel, saved.maximized ?? false);
          normalizePanelActionButtons(panel);
        });
        refreshPanelDirectoryState();
      },
      autoRefreshPanels: (reason = 'auto') => {
        const now = Date.now();
        const last = window.ZLayoutOS?._lastPanelRefreshTs || 0;
        const cooldownMs = 15000;
        if (now - last < cooldownMs) return false;
        window.ZLayoutOS._lastPanelRefreshTs = now;
        window.ZLayoutOS?.refreshPanelControls?.(true);
        window.ZChronicle?.write?.({
          type: 'z.ui.auto_refresh_panels',
          reason,
          ts: new Date().toISOString(),
        });
        return true;
      },
      getInteractionGuardMetrics: () => readUiGuardMetrics(),
    };
  }

  const AUTOPILOT_CONFIG = {
    chaos: {
      maxVisiblePanels: 8,
      rapidTogglesCount: 3,
      rapidTogglesWindowMs: 10000,
      scrollOverflowFactor: 2,
      settleDelayMs: 350,
      cooldownMs: 20000,
    },
    rescue: {
      stressThreshold: 0.72,
      idleToRescueMs: 45000,
      cooldownMs: 120000,
    },
    freeze: {
      freezeDuringGovernanceMs: 25000,
      freezeOnExportImportMs: 12000,
    },
    rotation: {
      schedule: [
        { start: '05:00', end: '10:00', layout: 'focus', calm: true, night: false },
        { start: '10:00', end: '18:00', layout: 'analysis', calm: false, night: false },
        { start: '18:00', end: '22:00', layout: 'governance', calm: false, night: false },
        { start: '22:00', end: '05:00', layout: 'focus', calm: true, night: true },
      ],
      applyOnlyIfIdleMs: 60000,
    },
  };

  let autopilotToggleEvents = [];
  let lastRescueAt = 0;
  let lastChaosAt = 0;

  function getAutopilotState() {
    const saved = readJson(localStorage.getItem('zAutopilotState') || '{}', {});
    const active =
      typeof saved.active === 'boolean'
        ? saved.active
        : getBooleanSetting(AUTOPILOT_ENABLED_KEY, true);
    const paused = typeof saved.paused === 'boolean' ? saved.paused : false;
    return { active, paused, lastAction: saved.lastAction || '' };
  }

  function isAutopilotEnabled() {
    const state = getAutopilotState();
    return state.active && !state.paused;
  }

  function setAutopilotEnabled(enabled, options = {}) {
    setSetting(AUTOPILOT_ENABLED_KEY, enabled ? '1' : '0');
    const saved = readJson(localStorage.getItem('zAutopilotState') || '{}', {});
    const next = {
      ...saved,
      active: enabled,
      paused: false,
      lastAction: options.skipLastAction
        ? saved.lastAction || 'Autopilot state updated'
        : enabled
          ? 'Autopilot dev enabled'
          : 'Autopilot dev disabled',
    };
    localStorage.setItem('zAutopilotState', JSON.stringify(next));
    const toggle = document.getElementById('zAutopilotToggle');
    if (toggle) toggle.checked = enabled;
    if (enabled) {
      window.ZLensStatus?.set('autopilot', governanceHoldActive);
    } else {
      refreshLens('preset');
    }
  }

  function setUserOverride(ms = 120000) {
    setSetting(AUTOPILOT_OVERRIDE_KEY, String(Date.now() + ms));
  }

  function userOverrideRemaining() {
    const until = parseInt(getSetting(AUTOPILOT_OVERRIDE_KEY, '0'), 10) || 0;
    return Math.max(0, until - Date.now());
  }

  function userOverrideActive() {
    return userOverrideRemaining() > 0;
  }

  function markUserAction() {
    setSetting(AUTOPILOT_LAST_ACTION_KEY, String(Date.now()));
  }

  function userIdleMs() {
    const last = parseInt(getSetting(AUTOPILOT_LAST_ACTION_KEY, '0'), 10) || 0;
    if (!last) return 999999;
    return Date.now() - last;
  }

  function setFreeze(enabled) {
    document.body.classList.toggle('z-freeze', enabled);
    setSetting(AUTOPILOT_FREEZE_KEY, enabled ? '1' : '0');
    setGovernanceHold(enabled);
  }

  function captureAutopilotState() {
    return {
      calm: document.body.classList.contains('calm-mode'),
      night: document.body.classList.contains('z-night-mode'),
      freeze: document.body.classList.contains('z-freeze'),
      override: userOverrideActive(),
      preset: getSetting(LAYOUT_PRESET_KEY, 'analysis'),
    };
  }

  function summarizeReason(reason) {
    if (!reason) return 'No explicit reason logged.';
    if (typeof reason === 'string') return reason;
    if (reason.summary) return reason.summary;
    if (reason.message) return reason.message;
    if (reason.reason) return reason.reason;
    return Object.entries(reason)
      .map(([key, value]) => `${key}: ${value}`)
      .slice(0, 3)
      .join(', ');
  }

  function composeNarrative(action, reason = {}, state = {}) {
    const base = summarizeReason(reason);
    let skk = '';
    let rkpk = '';
    switch (action) {
      case 'freeze':
        skk = 'SKK: Governance kept the system grounded.';
        rkpk = 'RKPK: Calm was restored before chaos grew.';
        break;
      case 'rescue_calm':
        skk = 'SKK: Calm took priority to protect clarity.';
        rkpk = 'RKPK: A soft pause helped the body and code breathe.';
        break;
      case 'layout_stabilize':
        skk = 'SKK: Stability locked into place before drift.';
        rkpk = 'RKPK: Connections stayed steady for the humans.';
        break;
      case 'rotation':
        skk = 'SKK: Root-first priorities guided the reshuffle.';
        rkpk = 'RKPK: Gentle rotation kept the flow balanced.';
        break;
      default:
        skk = 'SKK: The root rules were observed.';
        rkpk = 'RKPK: The system remained calm and kind.';
        break;
    }
    if (!skk.includes('SKK')) skk = `SKK: ${skk}`;
    if (!rkpk.includes('RKPK')) rkpk = `RKPK: ${rkpk}`;
    return {
      skk,
      rkpk,
      context: base || `Action ${action} recorded.`,
      stateSummary: `Calm:${state.calm ? 'yes' : 'no'} | Night:${state.night ? 'yes' : 'no'} | Freeze:${state.freeze ? 'yes' : 'no'}`,
    };
  }

  function logAutopilotAction(action, value, reason, source) {
    if (!window.ZAutopilotReplay?.log) return;
    const currentState = captureAutopilotState();
    const narrative = composeNarrative(action, reason, currentState);
    window.ZAutopilotReplay.log({
      action,
      value,
      reason,
      state: currentState,
      source: source || 'autopilot',
      narrative,
    });
  }

  function freezeFor(ms, meta = {}) {
    setFreeze(true);
    setTimeout(() => setFreeze(false), ms);
    logAutopilotAction('freeze', `${ms}ms`, meta.reason || meta, meta.source);
  }

  function recordToggleEvent() {
    autopilotToggleEvents.push(Date.now());
    autopilotToggleEvents = autopilotToggleEvents.slice(-30);
    chaosStabilizeTick();
  }

  function getVisiblePanelsCount() {
    let count = 0;
    document.querySelectorAll('.z-panel').forEach((panel) => {
      const hidden = panel.style.display === 'none' || getComputedStyle(panel).display === 'none';
      if (!hidden) count += 1;
    });
    return count;
  }

  function getChaosSignals() {
    const visible = getVisiblePanelsCount();
    const overflow =
      document.documentElement.scrollHeight >
      window.innerHeight * AUTOPILOT_CONFIG.chaos.scrollOverflowFactor;
    const recentToggles = autopilotToggleEvents.filter(
      (ts) => Date.now() - ts < AUTOPILOT_CONFIG.chaos.rapidTogglesWindowMs
    ).length;
    const signals = {
      visible,
      overflow,
      recentToggles,
      flags: {
        tooManyPanels: visible > AUTOPILOT_CONFIG.chaos.maxVisiblePanels,
        overflow,
        rapidToggles: recentToggles >= AUTOPILOT_CONFIG.chaos.rapidTogglesCount,
      },
    };
    return signals;
  }

  function detectChaos() {
    const signals = getChaosSignals();
    const activeSignals = Object.values(signals.flags).filter(Boolean).length;
    return activeSignals >= 2;
  }

  function bestPreset() {
    const govState = window.ZGovernanceHUD?.getState?.();
    if (govState && ['high', 'sacred'].includes(govState.riskClass)) {
      return 'governance';
    }
    if (document.body.classList.contains('z-night-mode')) {
      return 'focus';
    }
    return 'analysis';
  }

  function chaosStabilizeTick() {
    if (!isAutopilotEnabled() || userOverrideActive()) return;
    if (!detectChaos()) return;
    if (Date.now() - lastChaosAt < AUTOPILOT_CONFIG.chaos.cooldownMs) return;
    lastChaosAt = Date.now();
    setTimeout(() => {
      if (!isAutopilotEnabled() || userOverrideActive()) return;
      applyLayoutPreset(bestPreset(), { skipCalm: true });
      logAutopilotAction('layout_stabilize', getSetting(LAYOUT_PRESET_KEY, 'analysis'), {
        chaos: getChaosSignals(),
      });
    }, AUTOPILOT_CONFIG.chaos.settleDelayMs);
  }

  function getStressLevel() {
    if (window.ZEmotionFilter?.getEmotionalState) {
      const coherence = window.ZEmotionFilter.getEmotionalState().coherence;
      if (Number.isFinite(coherence)) {
        return Math.max(0, Math.min(1, 1 - coherence / 100));
      }
    }
    if (window.ZAwareness?.state?.energy !== undefined) {
      const energy = window.ZAwareness.state.energy;
      if (Number.isFinite(energy)) {
        return Math.max(0, Math.min(1, 1 - energy));
      }
    }
    return detectChaos() ? 0.75 : 0.2;
  }

  function rescueTick() {
    if (!isAutopilotEnabled() || userOverrideActive()) return;
    const stress = getStressLevel();
    const idle = userIdleMs();
    if (Date.now() - lastRescueAt < AUTOPILOT_CONFIG.rescue.cooldownMs) return;
    if (
      stress >= AUTOPILOT_CONFIG.rescue.stressThreshold &&
      idle >= AUTOPILOT_CONFIG.rescue.idleToRescueMs
    ) {
      toggleCalmMode(true);
      lastRescueAt = Date.now();
      speak('Calm mode activated.');
      logAutopilotAction('rescue_calm', 'calm_on', { stress, idleMs: idle });
    }
  }

  function parseHHMM(value) {
    const parts = value.split(':');
    const hours = Number(parts[0]) || 0;
    const mins = Number(parts[1]) || 0;
    return hours * 60 + mins;
  }

  function timeInRange(mins, start, end) {
    const startMin = parseHHMM(start);
    const endMin = parseHHMM(end);
    if (startMin <= endMin) return mins >= startMin && mins < endMin;
    return mins >= startMin || mins < endMin;
  }

  function setNightModeOverride(value) {
    setSetting(NIGHT_KEY, value);
    applyNightMode();
  }

  function rotationTick() {
    if (!isAutopilotEnabled() || userOverrideActive()) return;
    if (!getBooleanSetting(AUTO_LAYOUT_KEY, false)) return;
    if (userIdleMs() < AUTOPILOT_CONFIG.rotation.applyOnlyIfIdleMs) return;
    const mins = new Date().getHours() * 60 + new Date().getMinutes();
    const slot = AUTOPILOT_CONFIG.rotation.schedule.find((entry) =>
      timeInRange(mins, entry.start, entry.end)
    );
    if (!slot) return;
    setCalmMode(Boolean(slot.calm));
    setNightModeOverride(slot.night ? 'on' : 'off');
    applyLayoutPreset(slot.layout, { skipCalm: true });
    logAutopilotAction('rotation', slot.layout, { slot });
  }

  function initAutopilotDevMode() {
    if (
      getSetting(AUTOPILOT_ENABLED_KEY, null) === null &&
      !localStorage.getItem('zAutopilotState')
    ) {
      setAutopilotEnabled(true, { skipLastAction: true });
    }
    setFreeze(false);
    window.ZAutoPilot = {
      config: AUTOPILOT_CONFIG,
      isEnabled: isAutopilotEnabled,
      getStatus: () => ({
        enabled: isAutopilotEnabled(),
        paused: getAutopilotState().paused,
        overrideRemainingMs: userOverrideRemaining(),
        freeze: document.body.classList.contains('z-freeze'),
        calm: document.body.classList.contains('calm-mode'),
        night: document.body.classList.contains('z-night-mode'),
        stress: getStressLevel(),
        visiblePanels: getVisiblePanelsCount(),
        chaosSignals: getChaosSignals(),
        idleMs: userIdleMs(),
        preset: getSetting(LAYOUT_PRESET_KEY, 'analysis'),
        autoLayout: getBooleanSetting(AUTO_LAYOUT_KEY, false),
      }),
      setUserOverride,
      recordToggleEvent,
      markUserAction,
      freezeFor,
      isFrozen: () => document.body.classList.contains('z-freeze'),
      governanceFreeze: () =>
        freezeFor(AUTOPILOT_CONFIG.freeze.freezeDuringGovernanceMs, {
          source: 'governance',
          reason: 'governance_check',
        }),
      chaosStabilizeTick,
      rescueTick,
      rotationTick,
    };

    ['click', 'keydown', 'pointerdown'].forEach((eventName) => {
      window.addEventListener(
        eventName,
        () => {
          markUserAction();
        },
        { passive: true }
      );
    });

    setInterval(() => {
      chaosStabilizeTick();
      rescueTick();
      rotationTick();
    }, 2000);
  }

  function initAutopilotToggle() {
    const toggle = document.getElementById('zAutopilotToggle');
    const enabled = isAutopilotEnabled();
    if (toggle) {
      toggle.checked = enabled;
      toggle.addEventListener('change', () => {
        setAutopilotEnabled(toggle.checked);
        noteUserLayoutChange();
      });
    }
  }

  function initAutopilotDebugPanel() {
    const output = document.getElementById('zAutopilotDebugOutput');
    if (!output) return;

    const formatDuration = (ms) => {
      if (!ms || ms <= 0) return '0s';
      return `${Math.round(ms / 1000)}s`;
    };

    const render = () => {
      const status = window.ZAutoPilot?.getStatus?.();
      if (!status) return;
      const chaosFlags = status.chaosSignals?.flags || {};
      const blockers = getPriorityBlockers();
      const blockerLines = blockers.length
        ? blockers.map((item) => `- ${item.priority} ${item.id}: ${item.title}`)
        : ['none'];
      output.textContent = [
        'AUTOPILOT',
        '---------',
        `Enabled        : ${status.enabled ? 'YES' : 'NO'}`,
        `Paused         : ${status.paused ? 'YES' : 'NO'}`,
        `Override       : ${status.overrideRemainingMs > 0 ? formatDuration(status.overrideRemainingMs) : 'none'}`,
        `Freeze         : ${status.freeze ? 'YES' : 'NO'}`,
        `Calm Mode      : ${status.calm ? 'YES' : 'NO'}`,
        `Night Mode     : ${status.night ? 'YES' : 'NO'}`,
        '',
        'SIGNALS',
        '-------',
        `Stress         : ${status.stress.toFixed(2)}`,
        `Visible Panels : ${status.visiblePanels}`,
        `Chaos Flags    : ${
          [
            chaosFlags.tooManyPanels ? 'panels' : null,
            chaosFlags.overflow ? 'overflow' : null,
            chaosFlags.rapidToggles ? 'toggles' : null,
          ]
            .filter(Boolean)
            .join(', ') || 'none'
        }`,
        '',
        'STATE',
        '-----',
        `Preset         : ${status.preset}`,
        `Auto Layout    : ${status.autoLayout ? 'YES' : 'NO'}`,
        `Idle           : ${formatDuration(status.idleMs)}`,
        '',
        'PRIORITY',
        '--------',
        `P0/P1 Open     : ${blockers.length}`,
        ...blockerLines,
      ].join('\n');
    };

    render();
    setInterval(render, 1000);
  }

  function initMiniAiFeedToggle() {
    const btn = document.getElementById('miniAiFeedToggleBtn');
    const feed = document.getElementById('zMiniAiFeed');
    if (!btn || !feed) return;
    let paused = localStorage.getItem(FEED_PAUSE_KEY) === 'true';
    let autoPaused = false;
    let pausedBeforeNight = paused;
    window.ZMiniAiFeedPaused = paused;

    function updateButton() {
      const night = window.ZNightMode === true;
      btn.disabled = night;
      btn.textContent = night ? 'Feed: Night Pause' : paused ? 'Resume Feed' : 'Pause Feed';
      feed.classList.toggle('z-mini-feed-paused', paused || night);
    }

    btn.addEventListener('click', () => {
      if (window.ZNightMode === true) {
        updateButton();
        return;
      }
      paused = !paused;
      window.ZMiniAiFeedPaused = paused;
      localStorage.setItem(FEED_PAUSE_KEY, paused ? 'true' : 'false');
      updateButton();
    });

    window.addEventListener('znightmodechange', (event) => {
      const enabled = event && event.detail ? event.detail.enabled : false;
      if (enabled) {
        if (!autoPaused) {
          pausedBeforeNight = paused;
          autoPaused = true;
        }
        paused = true;
        window.ZMiniAiFeedPaused = true;
      } else if (autoPaused) {
        paused = pausedBeforeNight;
        window.ZMiniAiFeedPaused = paused;
        autoPaused = false;
      }
      localStorage.setItem(FEED_PAUSE_KEY, paused ? 'true' : 'false');
      updateButton();
    });

    updateButton();
  }

  function initMiniAiFeedClear() {
    const btn = document.getElementById('miniAiFeedClearBtn');
    const feed = document.getElementById('zMiniAiFeed');
    if (!btn || !feed) return;
    btn.addEventListener('click', () => {
      feed.innerHTML = '';
      feed.textContent = 'No bot activity yet.';
    });
  }

  function initChroniclePing() {
    const statusEl = document.getElementById('chronicleServerStatus');
    const pingBtn = document.getElementById('chroniclePingBtn');
    const copyBtn = document.getElementById('chronicleCopyCmdBtn');
    const startBtn = document.getElementById('chronicleStartBtn');
    const textEl = document.getElementById('chronicleServerText');
    if (!statusEl || !pingBtn) return;

    function setStatus(message, className) {
      if (textEl) {
        textEl.textContent = message;
      } else {
        statusEl.textContent = message;
      }
      statusEl.classList.remove('z-status-ok', 'z-status-warn', 'z-status-error');
      statusEl.classList.toggle('z-muted', !className);
      if (className) statusEl.classList.add(className);
    }

    async function pingServer() {
      const endpoint =
        (window.ZChronicleEndpoint || 'http://127.0.0.1:3333/chronicle') + '?limit=1';
      setStatus('Checking...', 'z-status-warn');
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 4000);
      try {
        const resp = await fetch(endpoint, { signal: controller.signal });
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const payload = await resp.json();
        const count = payload.count || (payload.events ? payload.events.length : 0);
        setStatus(`Online (${count})`, 'z-status-ok');
      } catch (err) {
        const events = JSON.parse(localStorage.getItem('zChronicleEvents') || '[]');
        setStatus(
          events.length ? 'Local only' : 'Offline',
          events.length ? 'z-status-warn' : 'z-status-error'
        );
      } finally {
        clearTimeout(timeout);
      }
    }

    pingBtn.addEventListener('click', pingServer);
    setTimeout(pingServer, 1500);
    setInterval(pingServer, 15000);

    if (copyBtn) {
      copyBtn.addEventListener('click', async () => {
        const cmd = 'node scripts/chronicle_server.js';
        try {
          await navigator.clipboard.writeText(cmd);
          setStatus('Start cmd copied', 'z-status-ok');
        } catch (err) {
          window.prompt('Copy this command:', cmd);
        }
      });
    }

    if (startBtn) {
      startBtn.addEventListener('click', async () => {
        const cmd = 'node scripts/chronicle_server.js';
        const taskUri =
          'vscode://command/workbench.action.tasks.runTask?%5B%22Z-Flow:%20Chronicle%20Sync%20Server%22%5D';
        try {
          window.open(taskUri, '_blank');
        } catch (err) {
          // Ignore failures; clipboard fallback below.
        }
        try {
          await navigator.clipboard.writeText(cmd);
          setStatus('Start cmd copied', 'z-status-ok');
        } catch (err) {
          setStatus('Run task or copy cmd', 'z-status-warn');
          window.prompt('Copy this command:', cmd);
        }
      });
    }
  }

  function initHeatmap() {
    function drawHeatmap() {
      const canvas = document.getElementById('zHeatmapCanvas');
      if (!canvas || !window.ZAwareness) return;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const events =
        window.ZAwareness.scanChronicle && window.ZAwareness.scanChronicle()
          ? JSON.parse(localStorage.getItem('zChronicleEvents') || '[]')
          : [];
      const moodColors = {
        joy: '#ffe066',
        focused: '#00d4ff',
        sorrow: '#6c63ff',
        neutral: '#a0e4cb',
        alert: '#ffb700',
        stressed: '#ff006e',
        uplifted: '#b3ffb3',
        steady: '#a0e4cb',
        tired: '#bdbdbd',
      };
      const w = canvas.width;
      const h = canvas.height;
      const n = events.length || 1;
      events.forEach((e, i) => {
        const x = (i / n) * w;
        const color = moodColors[e.mood] || '#888';
        ctx.fillStyle = color;
        ctx.fillRect(x, 0, Math.max(2, w / n), h);
      });
    }
    setInterval(drawHeatmap, 3000);
    drawHeatmap();
  }

  function initMoodTheme() {
    function applyMoodTheme() {
      if (!window.ZAwareness) return;
      const mood = window.ZAwareness.state.mood || 'neutral';
      document.body.classList.remove('mood-joy', 'mood-focused', 'mood-sorrow', 'mood-neutral');
      let theme = 'mood-neutral';
      if (mood === 'joy' || mood === 'uplifted') theme = 'mood-joy';
      else if (mood === 'focused' || mood === 'alert' || mood === 'steady') theme = 'mood-focused';
      else if (mood === 'sorrow' || mood === 'stressed' || mood === 'tired') theme = 'mood-sorrow';
      document.body.classList.add(theme);
    }
    setInterval(applyMoodTheme, 5000);
    applyMoodTheme();
  }

  function initPlayback() {
    let playbackTimer = null;
    let playbackIdx = 0;
    let playbackSpeed = 1;
    let playbackPaused = false;

    function updatePlaybackTimeline(idx, events) {
      const timeline = document.getElementById('playbackTimeline');
      if (!timeline) return;
      timeline.innerHTML = '';
      const w = timeline.offsetWidth || 320;
      events.forEach((e, i) => {
        const div = document.createElement('div');
        div.style.display = 'inline-block';
        div.style.width = Math.max(2, w / events.length) + 'px';
        div.style.height = '100%';
        div.style.background = i === idx ? '#ff006e' : '#00d4ff';
        div.title = `${e.mood} @ ${e.ts}`;
        timeline.appendChild(div);
      });
    }

    function playbackStep() {
      const events = JSON.parse(localStorage.getItem('zChronicleEvents') || '[]');
      if (!events.length) return;
      if (playbackIdx >= events.length) {
        playbackIdx = 0;
        playbackPaused = true;
        togglePlaybackBtns();
        return;
      }
      const e = events[playbackIdx];
      const el = document.getElementById('zAwarenessState');
      if (el) el.textContent = `System Health: ${e.mood} | ${e.message}`;
      updatePlaybackTimeline(playbackIdx, events);
      playbackIdx += 1;
    }

    function togglePlaybackBtns() {
      const startBtn = document.getElementById('playbackStartBtn');
      const pauseBtn = document.getElementById('playbackPauseBtn');
      if (!startBtn || !pauseBtn) return;
      startBtn.style.display = playbackPaused ? '' : 'none';
      pauseBtn.style.display = playbackPaused ? 'none' : '';
    }

    const startBtn = document.getElementById('playbackStartBtn');
    const pauseBtn = document.getElementById('playbackPauseBtn');
    const speedInput = document.getElementById('playbackSpeed');
    if (startBtn) {
      startBtn.onclick = function () {
        playbackPaused = false;
        togglePlaybackBtns();
        if (playbackTimer) clearInterval(playbackTimer);
        playbackTimer = setInterval(() => {
          if (!playbackPaused) playbackStep();
        }, 1000 / playbackSpeed);
      };
    }
    if (pauseBtn) {
      pauseBtn.onclick = function () {
        playbackPaused = true;
        togglePlaybackBtns();
        if (playbackTimer) clearInterval(playbackTimer);
      };
    }
    if (speedInput) {
      speedInput.oninput = function () {
        playbackSpeed = parseFloat(this.value);
        const label = document.getElementById('playbackSpeedLabel');
        if (label) label.textContent = `${playbackSpeed}x`;
        if (playbackTimer) {
          clearInterval(playbackTimer);
          if (!playbackPaused) {
            playbackTimer = setInterval(() => {
              if (!playbackPaused) playbackStep();
            }, 1000 / playbackSpeed);
          }
        }
      };
    }

    togglePlaybackBtns();
  }

  function initCodexLauncher() {
    const btn = document.getElementById('openCodexBundleBtn');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const docs = [
        '../docs/codex/Z_AUTO_CODEX.md',
        '../docs/codex/Z_CREATOR_PROTOCOL.md',
        '../docs/codex/Z_THINKING_RULES.md',
        '../docs/codex/Z_MAINTENANCE_RITUAL.md',
      ];
      docs.forEach((doc) => window.open(doc, '_blank', 'noopener'));
    });
  }

  function initPanelDirectory() {
    const container = document.getElementById('zPanelDirectoryTree');
    if (!container) return;
    if (getFocusPanels().size > 0) return;

    const showAllBtn = document.getElementById('zPanelShowAllBtn');
    const hideAllBtn = document.getElementById('zPanelHideAllBtn');
    const popoutBtn = document.getElementById('zPanelPopoutBtn');
    const resetSizesBtn = document.getElementById('zPanelResetSizesBtn');
    const resetPriorityMemoryBtn = document.getElementById('zPriorityMemoryResetBtn');
    const resetOverridesBtn = document.getElementById('zPanelResetOverridesBtn');
    const focusQueueModeBtn = document.getElementById('zFocusQueueModeBtn');

    const panelDirectory = [
      {
        id: 'system',
        label: 'System',
        groups: [
          {
            id: 'system-layout',
            label: 'Layout',
            panels: [{ id: 'zPanelDirectory', label: 'Panel Directory' }],
          },
          {
            id: 'system-diagnostics',
            label: 'Diagnostics',
            panels: [
              { id: 'zAutopilotDebugPanel', label: 'Autopilot Debug' },
              { id: 'zAutopilotReplayPanel', label: 'Autopilot Replay' },
              { id: 'zAutopilotSimPanel', label: 'Autopilot Simulation' },
              { id: 'zChainViewPanel', label: 'Chain View', locate: true },
            ],
          },
        ],
      },
      {
        id: 'core',
        label: 'Core Systems',
        groups: [
          {
            id: 'core-live',
            label: 'Live Signals',
            panels: [
              { id: 'zControlCentrePanel', label: 'Control Centre' },
              { id: 'zCommanderPanel', label: 'AMK-Goku Commander' },
              { id: 'zProductSovereignRegistryLitePanel', label: 'Z-Product Sovereign Registry Lite' },
              { id: 'zAwarenessPanel', label: 'AI Awareness' },
            ],
          },
          {
            id: 'core-registry',
            label: 'Registry',
            panels: [
              { id: 'zModuleRegistryPanel', label: 'Module Registry' },
              { id: 'zTaskListPanel', label: 'Z Task List' },
            ],
          },
          {
            id: 'core-chronicle',
            label: 'Chronicle',
            panels: [{ id: 'zChroniclePanel', label: 'Z-Chronicle Feed' }],
          },
        ],
      },
      {
        id: 'governance',
        label: 'Governance',
        groups: [
          {
            id: 'gov-console',
            label: 'Console',
            panels: [
              { id: 'zGovernance', label: 'Governance Console' },
              { id: 'zPriorityPanel', label: 'Priority Board' },
            ],
          },
          {
            id: 'gov-wisdom',
            label: 'Wisdom Ring',
            panels: [{ id: 'zWisdomRingPanel', label: 'Wisdom Ring' }],
          },
          {
            id: 'gov-timeline',
            label: 'Timeline',
            panels: [{ id: 'zGovTimelinePanel', label: 'Governance Timeline' }],
          },
          {
            id: 'gov-codex',
            label: 'Codex',
            panels: [
              { id: 'zCodexPanel', label: 'Codex' },
              { id: 'zCreatorProtocolPanel', label: 'Creator Protocol' },
              { id: 'zCodexSuggestionsPanel', label: 'Codex Suggestions' },
            ],
          },
          {
            id: 'gov-reports',
            label: 'Reports',
            panels: [
              { id: 'zGovernanceReportPanel', label: 'Governance Report' },
              { id: 'zGovernanceReviewPanel', label: 'Governance Review' },
            ],
          },
        ],
      },
      {
        id: 'autonomy',
        label: 'Autonomy',
        groups: [
          {
            id: 'auto-controls',
            label: 'Autopilot',
            panels: [
              { id: 'zAutopilotStatusPanel', label: 'Autopilot Status' },
              { id: 'zMasterControlPanel', label: 'Master Control' },
            ],
          },
        ],
      },
      {
        id: 'guidance',
        label: 'Guidance',
        groups: [
          {
            id: 'guide-companion',
            label: 'Companion',
            panels: [{ id: 'zCompanion3dPanel', label: 'SKK + RKPK 3D' }],
          },
          {
            id: 'guide-suggestions',
            label: 'Suggestions',
            panels: [{ id: 'zRecentSuggestions', label: 'Recent Suggestions' }],
          },
          {
            id: 'guide-insight',
            label: 'Insight Lab',
            panels: [{ id: 'zInsightLabPanel', label: 'Insight Lab' }],
          },
          {
            id: 'guide-intelligence',
            label: 'Intelligence',
            panels: [{ id: 'zIntelligencePanel', label: 'Intelligence Engine' }],
          },
          {
            id: 'guide-social',
            label: 'Social Arena',
            panels: [{ id: 'zSocialPanel', label: 'Social Arena' }],
          },
        ],
      },
      {
        id: 'tools',
        label: 'Tools',
        groups: [
          {
            id: 'tools-authoring',
            label: 'Authoring',
            panels: [{ id: 'zAutocompletePanel', label: 'Autocomplete' }],
          },
          {
            id: 'tools-media',
            label: 'Media',
            panels: [{ id: 'zScreenRecorderPanel', label: 'Screen Recorder' }],
          },
        ],
      },
    ];

    const checkboxById = new Map();

    const isHidden = (panelId) => {
      const state = getStoredState();
      const panel = document.getElementById(panelId);
      const defaultHidden = panel ? panel.style.display === 'none' : false;
      const entry = state[panelId];
      return entry?.hidden ?? defaultHidden;
    };

    const buildCheckbox = (panelId, label, options = {}) => {
      const row = document.createElement('div');
      row.className = 'z-tree-item';
      row.dataset.panelId = panelId;
      const input = document.createElement('input');
      input.type = 'checkbox';
      const safeId = `z-panel-toggle-${String(panelId).replace(/[^a-zA-Z0-9_-]/g, '_')}`;
      input.id = safeId;
      input.checked = !isHidden(panelId);
      input.dataset.panelId = panelId;
      const locked = isLockedPanel(panelId);
      if (locked) {
        input.disabled = true;
        row.classList.add('z-tree-item-locked');
        row.title = 'Locked by SKK';
      }
      input.addEventListener('change', () => {
        setHidden(panelId, !input.checked, { manual: true });
        applyLayout(layoutDefaults);
        if (input.checked) {
          revealPanel(panelId);
        }
        noteUserLayoutChange();
      });
      const text = document.createElement('label');
      text.setAttribute('for', safeId);
      text.textContent = withZPrefix(label);
      row.appendChild(input);
      row.appendChild(text);
      row.addEventListener('click', (event) => {
        const target = event.target;
        if (target === input || target.tagName === 'INPUT' || target.tagName === 'BUTTON') {
          return;
        }
        if (locked) return;
        input.checked = !input.checked;
        setHidden(panelId, !input.checked, { manual: true });
        applyLayout(layoutDefaults);
        if (input.checked) {
          revealPanel(panelId);
        }
        noteUserLayoutChange();
      });
      if (options.locate !== false) {
        const locateBtn = document.createElement('button');
        locateBtn.type = 'button';
        locateBtn.className = 'z-tree-action';
        locateBtn.textContent = 'Locate';
        locateBtn.addEventListener('click', (event) => {
          event.preventDefault();
          event.stopPropagation();
          window.ZLayoutOS?.revealPanel?.(panelId, { userInitiated: true, label });
        });
        locateBtn.addEventListener('mousedown', (event) => {
          event.preventDefault();
          event.stopPropagation();
        });
        row.appendChild(locateBtn);
      }
      checkboxById.set(panelId, input);
      return row;
    };

    container.innerHTML = '';
    panelDirectory.forEach((category) => {
      const categoryEl = document.createElement('details');
      categoryEl.className = 'z-tree-group';
      categoryEl.open = true;
      const summary = document.createElement('summary');
      summary.textContent = category.label;
      categoryEl.appendChild(summary);

      category.groups.forEach((group) => {
        const groupEl = document.createElement('details');
        groupEl.className = 'z-tree-subgroup';
        groupEl.open = true;
        const groupSummary = document.createElement('summary');
        groupSummary.textContent = group.label;
        groupEl.appendChild(groupSummary);

        const list = document.createElement('div');
        list.className = 'z-tree-list';
        group.panels.forEach((panel) => {
          list.appendChild(buildCheckbox(panel.id, panel.label, panel));
        });
        groupEl.appendChild(list);
        categoryEl.appendChild(groupEl);
      });

      container.appendChild(categoryEl);
    });

    if (showAllBtn) {
      showAllBtn.addEventListener('click', () => {
        checkboxById.forEach((checkbox, panelId) => {
          checkbox.checked = true;
          setHidden(panelId, false, { manual: true });
        });
        applyLayout(layoutDefaults);
        refreshPanelDirectoryState();
        noteUserLayoutChange();
      });
    }

    if (hideAllBtn) {
      hideAllBtn.addEventListener('click', () => {
        checkboxById.forEach((checkbox, panelId) => {
          if (isLockedPanel(panelId)) {
            checkbox.checked = true;
            setHidden(panelId, false, { authority: 'preset' });
            return;
          }
          checkbox.checked = false;
          setHidden(panelId, true, { manual: true });
        });
        applyLayout(layoutDefaults);
        refreshPanelDirectoryState();
        noteUserLayoutChange();
      });
    }

    if (popoutBtn) {
      popoutBtn.addEventListener('click', () => {
        const selected = [];
        checkboxById.forEach((checkbox, panelId) => {
          if (checkbox.checked) selected.push(panelId);
        });
        if (selected.length === 0) {
          window.alert('Select at least one panel to pop out.');
          return;
        }
        openPopout(selected);
        noteUserLayoutChange();
      });
    }

    if (resetOverridesBtn) {
      resetOverridesBtn.addEventListener('click', () => {
        const changed = resetManualOverrides();
        if (!changed) {
          console.log('[Z] No manual overrides to reset.');
        }
      });
    }

    if (resetSizesBtn) {
      resetSizesBtn.addEventListener('click', () => {
        const changed = resetPanelSizes();
        if (!changed) {
          console.log('[Z] No panel size overrides to reset.');
        }
      });
    }

    if (resetPriorityMemoryBtn) {
      resetPriorityMemoryBtn.addEventListener('click', () => {
        const ok = clearPriorityResolutionMemory();
        if (!ok) {
          console.log('[Z] Could not clear learned priority memory.');
          return;
        }
        applyPriorityDrivenLayout();
        console.log('[Z] Learned priority memory cleared.');
      });
    }

    if (focusQueueModeBtn) {
      setFocusQueueMode(isFocusQueueModeEnabled(), { skipNote: true });
      focusQueueModeBtn.addEventListener('click', () => {
        setFocusQueueMode(!isFocusQueueModeEnabled());
      });
    }

    refreshPanelDirectoryState();
  }

  function initCompanionSummon() {
    const btn = document.getElementById('summonCompanionBtn');
    const fab = document.getElementById('summonCompanionFab');
    const panel = document.getElementById('zCompanion3dPanel');
    if (!panel) return;

    const summon = () => {
      if (panel.dataset.collapsed === 'true') {
        const collapseBtn = panel.querySelector('.z-panel-actions .z-panel-btn');
        if (collapseBtn) {
          collapseBtn.click();
        } else {
          setCollapsed(panel, false);
        }
      }

      panel.classList.remove('z-panel-collapsed');
      panel.classList.add('z-panel-summoned');
      setTimeout(() => panel.classList.remove('z-panel-summoned'), 1600);
      panel.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    const pulseFab = () => {
      if (fab) {
        fab.classList.add('pulse');
      }
    };

    if (btn) {
      btn.addEventListener('click', () => {
        summon();
        if (fab) fab.classList.remove('pulse');
      });
    }

    if (fab) {
      fab.addEventListener('click', () => {
        summon();
        fab.classList.remove('pulse');
      });
    }

    window.ZSummonCompanions = summon;
    window.ZSignalCompanionPulse = pulseFab;
  }

  function initNightMode() {
    nightModeToggleBtn = document.getElementById('nightModeToggleBtn');
    nightModeStatusEl = document.getElementById('nightModeStatus');

    function cycleOverride() {
      const current = getSetting(NIGHT_KEY, 'auto');
      const next = current === 'auto' ? 'on' : current === 'on' ? 'off' : 'auto';
      setNightModeOverride(next);
      noteUserLayoutChange();
    }

    if (nightModeToggleBtn) {
      nightModeToggleBtn.addEventListener('click', cycleOverride);
    }

    applyNightMode();
    setInterval(applyNightMode, 60000);
  }

  let lastActivePanel = null;

  function setLastActivePanel(panel) {
    if (!panel) return;
    lastActivePanel = panel;
  }

  function getActivePanel() {
    const active = document.activeElement?.closest?.('.z-panel');
    return active || lastActivePanel;
  }

  function wirePanelFocusTracking() {
    document.querySelectorAll('.z-panel').forEach((panel) => {
      panel.addEventListener('mousedown', () => setLastActivePanel(panel));
      panel.addEventListener('click', () => setLastActivePanel(panel));
    });
  }

  function triggerPanelAction(panel, action) {
    if (!panel) return;
    if (action === 'expand' || action === 'autoflex') {
      panelRunAutoFlex(panel);
      return;
    }
    const buttons = panel.querySelectorAll(
      '.z-panel-actions .z-panel-btn, .z-panel-actions .z-panel-quick-action'
    );
    if (!buttons || !buttons.length) {
      if (action === 'close') {
        setHidden(panel.id, true, { manual: true });
      }
      return;
    }
    const label = action.toLowerCase();
    const match = Array.from(buttons).find((btn) => {
      const dataAction = btn.dataset.action ? btn.dataset.action.toLowerCase() : '';
      const title = btn.title ? btn.title.toLowerCase() : '';
      const text = btn.textContent ? btn.textContent.toLowerCase() : '';
      return dataAction === label || title.includes(label) || text.includes(label);
    });
    if (match) {
      match.click();
      return;
    }
    if (action === 'collapse') {
      const collapsed = panel.dataset.collapsed === 'true';
      setCollapsed(panel, !collapsed);
      return;
    }
    if (action === 'minimize') {
      const minimized = panel.dataset.minimized === 'true';
      setMinimized(panel, !minimized);
      return;
    }
    if (action === 'maximize') {
      const maximized = panel.dataset.maximized === 'true';
      if (!maximized) {
        bringPanelToFront(panel);
        storeMaximizeState(panel);
      } else {
        restoreMaximizeState(panel);
      }
      setMaximized(panel, !maximized);
      return;
    }
    if (action === 'popout') {
      openPopout([panel.id]);
      return;
    }
    if (action === 'fit') {
      fitPanelContent(panel, { persist: true });
      return;
    }
    if (action === 'close') {
      setHidden(panel.id, true, { manual: true });
    }
  }

  function initPanelTitleBehavior() {
    document.querySelectorAll('.z-panel').forEach((panel) => {
      if (panel.dataset.enhanced === 'true') return;
      const title = panel.querySelector('.z-panel-title, h3');
      if (!title || title.dataset.bound === '1') return;
      title.dataset.bound = '1';
      title.classList.add('z-panel-title');
      title.setAttribute('role', 'button');
      title.setAttribute('tabindex', '0');

      function toggle() {
        if (panel.style.display === 'none' || panel.dataset.hidden === 'true') {
          ensurePanelVisible(panel.id);
          return;
        }
        triggerPanelAction(panel, 'expand');
      }

      title.addEventListener('click', toggle);
      title.addEventListener('dblclick', (event) => {
        event.preventDefault();
        triggerPanelAction(panel, 'popout');
      });
      title.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          toggle();
        }
      });
    });
  }

  const PANEL_LENGTH_CLASSES = ['short', 'medium', 'tall'];

  function applyPanelLengthClasses(panel) {
    if (!panel) return;
    PANEL_LENGTH_CLASSES.forEach((length) => {
      panel.classList.remove(`z-panel-length-${length}`);
    });
    panel.classList.remove('z-panel-fit-mode');
    const length = panel.dataset.length || PANEL_SIZE_DEFAULTS.length || 'medium';
    panel.classList.add(`z-panel-length-${length}`);
    if (panel.dataset.fitMode === 'fit') {
      panel.classList.add('z-panel-fit-mode');
    }
  }

  function applyPanelLengthHints() {
    const lengthMap = {
      short: ['zVaultStatusPanel', 'zPublicMirrorPanel', 'trust-certificate'],
      medium: [
        'zMasterControlPanel',
        'zAutopilotStatusPanel',
        'zPanelDirectory',
        'zAutocompletePanel',
      ],
      tall: ['zChroniclePanel', 'zAwarenessPanel', 'zInsightLabPanel'],
    };
    Object.entries(lengthMap).forEach(([length, ids]) => {
      ids.forEach((id) => {
        const panel = document.getElementById(id);
        if (!panel) return;
        panel.dataset.length = length;
        panel.dataset.fitMode = panel.dataset.fitMode || '';
        applyPanelLengthClasses(panel);
      });
    });
  }

  function initAutoLengthObserver() {
    const threshold = 520;
    const observer = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        const panel = entry.target.closest('.z-panel');
        if (!panel) return;
        const body = panel.querySelector('.z-panel-body');
        if (!body) return;
        const current = panel.dataset.length;
        if (body.scrollHeight > threshold) {
          panel.dataset.length = 'tall';
        } else if (current === 'tall') {
          panel.dataset.length = 'medium';
        }
      });
    });
    document.querySelectorAll('.z-panel .z-panel-body').forEach((body) => {
      observer.observe(body);
    });
  }

  function initPanelAutoScroll() {
    const prefersReduced = window.matchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)')
      : null;
    const states = new Map();
    const selector =
      '.z-panel .z-panel-body, .dashboard-edge-bar.edge-top, .z-status-rail, .z-action-row';

    function axisFor(el) {
      const canX = el.scrollWidth > el.clientWidth + 2;
      const canY = el.scrollHeight > el.clientHeight + 2;
      if (canX) return 'x';
      if (canY) return 'y';
      return null;
    }

    function ensureState(el) {
      if (!el || states.has(el)) return;
      const isActivePanelBody = el.matches('.z-panel .z-panel-body');
      const profile = getAutoScrollSpeedProfileForPreset(resolveSpeedPresetForElement(el));
      const startsSlow = (isActivePanelBody ? 0.16 : 0.22) * profile.speedMul;
      states.set(el, {
        dir: 1,
        pauseUntil: Date.now() + 1000,
        speed: el.matches('.dashboard-edge-bar.edge-top, .z-action-row') ? 0.28 : startsSlow,
        minSpeed: el.matches('.dashboard-edge-bar.edge-top, .z-action-row') ? 0.28 : startsSlow,
        maxSpeed: (isActivePanelBody ? 2.8 : 0.42) * profile.maxMul,
        accel: (isActivePanelBody ? 0.012 : 0.0025) * profile.accelMul,
      });

      const pause = (ms = 3200) => {
        const state = states.get(el);
        if (!state) return;
        state.pauseUntil = Date.now() + ms;
      };

      el.addEventListener('mouseenter', () => pause(2800), { passive: true });
      el.addEventListener('mouseleave', () => pause(900), { passive: true });
      el.addEventListener('focusin', () => pause(3200), { passive: true });
      el.addEventListener('wheel', () => pause(3600), { passive: true });
      el.addEventListener('touchstart', () => pause(4200), { passive: true });
      el.addEventListener('pointerdown', () => pause(4200), { passive: true });
      el.addEventListener('scroll', () => pause(1800), { passive: true });
    }

    function scan() {
      document.querySelectorAll(selector).forEach((el) => ensureState(el));
    }

    function tick() {
      if (document.body.classList.contains('z-reduce-motion') || prefersReduced?.matches) {
        requestAnimationFrame(tick);
        return;
      }

      const now = Date.now();
      states.forEach((state, el) => {
        if (!el || !el.isConnected) {
          states.delete(el);
          return;
        }
        const axis = axisFor(el);
        if (!axis) return;
        if (el.matches(':hover') || el.matches(':focus-within')) return;
        if (now < state.pauseUntil) return;

        if (axis === 'x') {
          const max = Math.max(0, el.scrollWidth - el.clientWidth);
          if (max < 2) return;
          if (el.scrollLeft <= 0) state.dir = 1;
          if (el.scrollLeft >= max - 1) state.dir = -1;
          el.scrollLeft = Math.max(0, Math.min(max, el.scrollLeft + state.speed * state.dir));
          return;
        }

        const maxY = Math.max(0, el.scrollHeight - el.clientHeight);
        if (maxY < 2) return;
        const profile = getAutoScrollSpeedProfileForPreset(resolveSpeedPresetForElement(el));
        const activePanel = el.closest('.z-panel.z-panel-autoscroll');
        const largeRatio = el.scrollHeight / Math.max(1, el.clientHeight);
        if (activePanel) {
          const baseMin = 0.16 * profile.speedMul;
          const baseMax = (largeRatio >= 1.8 ? 3.2 : 2.8) * profile.maxMul;
          const accel = 0.012 * profile.accelMul;
          state.minSpeed = baseMin;
          state.maxSpeed = baseMax;
          state.accel = accel;
          state.speed = Math.min(baseMax, Math.max(baseMin, state.speed + accel));
          if (el.scrollTop >= maxY - 1) {
            el.scrollTop = 0;
            state.speed = baseMin;
            return;
          }
          el.scrollTop = Math.min(maxY, el.scrollTop + state.speed);
          return;
        }
        if (el.scrollTop <= 0) state.dir = 1;
        if (el.scrollTop >= maxY - 1) state.dir = -1;
        el.scrollTop = Math.max(0, Math.min(maxY, el.scrollTop + state.speed * state.dir));
      });

      requestAnimationFrame(tick);
    }

    scan();
    setInterval(scan, 2500);
    requestAnimationFrame(tick);
  }

  function updateColumnDensity() {
    const layout = document.getElementById('zLayout');
    if (!layout) return;
    const columns = Array.from(layout.querySelectorAll('.z-layout-col'));
    if (!columns.length) return;
    const counts = columns.map((col) => col.querySelectorAll('.z-panel').length);
    const maxCount = Math.max(...counts);
    const minCount = Math.min(...counts);
    const crowded = maxCount >= 7 || maxCount - minCount >= 4;
    document.body.classList.toggle('z-density-tight', crowded);
  }

  function initDensityAutoShrink() {
    updateColumnDensity();
    const layout = document.getElementById('zLayout');
    if (!layout || !window.MutationObserver) return;
    const observer = new MutationObserver(() => updateColumnDensity());
    observer.observe(layout, { childList: true, subtree: true });
    window.addEventListener('resize', updateColumnDensity);
  }

  function balanceGridColumns() {
    const layout = document.getElementById('zLayout');
    if (!layout) return;
    const columns = Array.from(layout.querySelectorAll('.z-layout-col'));
    if (columns.length !== 3) return;
    const state = getStoredState();
    const getCount = (col) => col.querySelectorAll('.z-panel').length;
    let attempts = 0;
    while (attempts < 6) {
      const counts = columns.map(getCount);
      const maxCount = Math.max(...counts);
      const minCount = Math.min(...counts);
      if (maxCount - minCount <= 2) break;
      const maxIndex = counts.indexOf(maxCount);
      const minIndex = counts.indexOf(minCount);
      const fromCol = columns[maxIndex];
      const toCol = columns[minIndex];
      const movable = Array.from(fromCol.querySelectorAll('.z-panel')).filter((panel) => {
        if (isLockedPanel(panel.id)) return false;
        if (panel.dataset.docked !== 'true') return false;
        return true;
      });
      if (!movable.length) break;
      const panel = movable.reduce((best, candidate) => {
        if (!best) return candidate;
        return panelLengthPriority(candidate) < panelLengthPriority(best) ? candidate : best;
      }, movable[0]);
      if (!panel) break;
      panel.dataset.column = toCol.dataset.column;
      toCol.appendChild(panel);
      state[panel.id] = {
        ...(state[panel.id] || {}),
        column: toCol.dataset.column,
      };
      attempts += 1;
    }
    saveStoredState(state);
  }

  function initPanelContextMenu() {
    if (document.getElementById('zPanelContextMenu')) return;
    const menu = document.createElement('div');
    menu.id = 'zPanelContextMenu';
    menu.className = 'z-panel-context';
    menu.innerHTML = `
      <button type="button" data-action="collapse">Collapse</button>
      <button type="button" data-action="minimize">Minimize</button>
      <button type="button" data-action="maximize">Maximize</button>
      <button type="button" data-action="fit">Fit Content</button>
      <button type="button" data-action="popout">Popout</button>
      <button type="button" data-action="close">Close</button>
    `;
    document.body.appendChild(menu);

    const hideMenu = () => {
      menu.style.display = 'none';
      menu.removeAttribute('data-panel');
    };

    document.addEventListener('click', hideMenu);
    document.addEventListener('scroll', hideMenu, true);
    window.addEventListener('resize', hideMenu);

    menu.addEventListener('click', (event) => {
      const button = event.target.closest('button[data-action]');
      if (!button) return;
      const panelId = menu.dataset.panel;
      const panel = panelId ? document.getElementById(panelId) : null;
      if (!panel) return hideMenu();
      triggerPanelAction(panel, button.dataset.action);
      hideMenu();
    });

    document.querySelectorAll('.z-panel-title, .z-panel-header').forEach((target) => {
      target.addEventListener('contextmenu', (event) => {
        const panel = event.target.closest('.z-panel');
        if (!panel) return;
        event.preventDefault();
        menu.dataset.panel = panel.id;
        menu.style.display = 'flex';
        menu.style.left = `${Math.min(event.clientX + 8, window.innerWidth - 160)}px`;
        menu.style.top = `${Math.min(event.clientY + 8, window.innerHeight - 200)}px`;
      });
    });
  }

  function forceHidePanel(panelId, authority = 'preset') {
    if (!panelId) return;
    const state = getStoredState();
    const current = state[panelId] || {};
    state[panelId] = { ...current, hidden: true };
    saveStoredState(state);
    setHidden(panelId, true, { authority });
  }

  function wirePanelShortcuts() {
    window.addEventListener('keydown', (event) => {
      if (!event.altKey) return;
      const panel = getActivePanel();
      if (!panel) return;
      const key = event.key.toLowerCase();
      if (key === 'c') {
        event.preventDefault();
        triggerPanelAction(panel, 'collapse');
      }
      if (key === 'm') {
        event.preventDefault();
        triggerPanelAction(panel, 'minimize');
      }
      if (key === 'x') {
        event.preventDefault();
        triggerPanelAction(panel, 'maximize');
      }
      if (key === 'w') {
        event.preventDefault();
        triggerPanelAction(panel, 'close');
      }
    });
  }

  function init() {
    if (isPopoutMode()) {
      document.body.classList.add('z-popout-mode');
    }
    initLayout();
    initStatusRailToggle();
    initDashboardSearch();
    document.body.classList.add('z-tight-mode');
    initLayoutOS();
    initPanelClickRaiseLayer();
    initMiniAiFeedToggle();
    initMiniAiFeedClear();
    initChroniclePing();
    initHeatmap();
    initMoodTheme();
    initPlayback();
    initNightMode();
    initCodexLauncher();
    initCompanionSummon();
    initPanelDirectory();
    initLayoutPresets();
    initPanelTitleBehavior();
    applyPanelLengthHints();
    initPanelContextMenu();
    initAutoLengthObserver();
    initPanelAutoScroll();
    initDensityAutoShrink();
    initCalmModeToggle();
    refreshConsentGlobals();
    initListeningToggle();
    initVoiceWhisperToggle();
    initLayoutTransfer();
    initVoiceControl();
    initAutoLayout();
    initCompactControls();
    initReduceMotionToggle();
    initAccessibleActionsToggle();
    initSingleTapModeToggle();
    initReduceMotionPreference();
    initHiveEffects();
    initAutoScrollSpeedControl();
    initAutoScrollPanelOverrides();
    initDensityToggles();
    initDensityPresets();
    initSplitLayout();
    initCompactEdgebar();
    initGridLayoutToggle();
    applyGridLayoutV1();
    if (!loadHiveLayout()) {
      applyHiveLayout();
    }
    initHiveDocking();
    initHiveRadialShell();
    initHiveFocusSnap();
    initHiveSpinPresets();
    initHiveCenterSnap();
    enforceGridLayoutWhenWide();
    balanceGridColumns();
    initUiZoomControls();
    initSmartZoomPreset();
    initSmartZoomToggle();
    initZoomPresets();
    initAutopilotDevMode();
    initAutopilotToggle();
    initAutopilotDebugPanel();
    initLensModeControls();
    refreshPrioritySnapshot();
    setInterval(refreshPrioritySnapshot, 20000);
    refreshLens('preset');
    initLensSuggestionLoop();
    initTopTabContainerRotation();
    initEdgeBarButtons();
    initContributorGuideButton();
    wirePanelFocusTracking();
    wirePanelShortcuts();
    initPanelAutoRefreshHooks();
    loadTaskList();
    window.ZLayoutOS?.repairPanels?.();
    window.ZLayoutOS?.refreshPanelControls?.(true);
    if (getSetting(INTELLIGENCE_LOCK_KEY, '1') === '1') {
      forceHidePanel('zIntelligencePanel', 'preset');
    } else if (getSetting(INTELLIGENCE_OPTIN_KEY, '0') !== '1') {
      forceHidePanel('zIntelligencePanel', 'preset');
    }
    if (window.ZChronicle?.write) {
      window.ZChronicle.write({ type: 'z.ui.repair_panels', ts: new Date().toISOString() });
    }
    // Silent self-heal: no toast by default.
  }

  function initHiveRadialShell() {
    const root = document.getElementById('zHiveRoot');
    if (!root) return;
    root.classList.add('z-hive-radial');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function initEdgeBarButtons() {
    const buttons = document.querySelectorAll('.dashboard-edge-bar button[data-panel]');
    buttons.forEach((button) => {
      const label = button.dataset.label || button.textContent;
      if (label) {
        button.textContent = withZPrefix(label);
      }
      button.addEventListener('click', () => {
        const panelId = button.dataset.panel;
        if (!panelId) return;
        const label = button.dataset.label || panelId;
        window.ZLayoutOS?.revealPanel?.(panelId, {
          userInitiated: true,
          label,
        });
        const panel = document.getElementById(panelId);
        if (panel) {
          pulsePanel(panel, { intent: 'info' });
        }
        window.ZAutoPilot?.recordToggleEvent?.();
        button.classList.add('is-active');
        setTimeout(() => button.classList.remove('is-active'), 900);
      });
    });
  }

  function initTopTabContainerRotation() {
    const rail =
      document.getElementById('zTopTabContainer') ||
      document.querySelector('.dashboard-edge-bar.edge-top');
    if (!rail) return;
    rail.classList.add('z-tab-container');

    const allItems = Array.from(rail.querySelectorAll('button, .edge-status-badge'));
    if (!allItems.length) return;

    allItems.forEach((item, index) => {
      item.classList.add('z-top-tab-item');
      item.dataset.zTabIndex = String(index);
      if (!item.hasAttribute('tabindex')) item.setAttribute('tabindex', '0');
      if (item.tagName === 'BUTTON' && !item.hasAttribute('role')) {
        item.setAttribute('role', 'tab');
      }
    });

    let activeIndex = 0;
    let rotateEnabled = getSetting(TOP_TAB_ROTATION_KEY, '1') !== '0';
    window.__Z_USER_OVERRIDE_ROTATION_SPEED__ =
      localStorage.getItem(TOP_TAB_ROTATION_SPEED_KEY) !== null;
    let rotateSpeed = getSetting(TOP_TAB_ROTATION_SPEED_KEY, 'normal');
    let rotateScope = getSetting(TOP_TAB_ROTATION_SCOPE_KEY, 'buttons+badges');
    let pauseUntil = Date.now() + 1500;
    const speedToMs = {
      slow: 4200,
      normal: 2800,
      fast: 1600,
    };

    const getRotatingItems = () => {
      if (rotateScope === 'buttons-only') {
        return allItems.filter((item) => item.tagName === 'BUTTON');
      }
      return allItems;
    };

    const activate = (index, mode = 'auto') => {
      const rotatingItems = getRotatingItems();
      if (!rotatingItems.length) return;
      activeIndex = ((index % rotatingItems.length) + rotatingItems.length) % rotatingItems.length;
      allItems.forEach((item) => item.classList.remove('is-rotating-tab'));
      rotatingItems.forEach((item, idx) => {
        item.classList.toggle('is-rotating-tab', idx === activeIndex);
      });
      const active = rotatingItems[activeIndex];
      if (!active) return;
      active.scrollIntoView({
        behavior: mode === 'auto' ? 'smooth' : 'auto',
        inline: 'center',
        block: 'nearest',
      });
    };

    const pause = (ms = 4200) => {
      pauseUntil = Date.now() + ms;
    };

    const setEnabled = (enabled) => {
      rotateEnabled = Boolean(enabled);
      setSetting(TOP_TAB_ROTATION_KEY, rotateEnabled ? '1' : '0');
      if (toggleBtn) {
        toggleBtn.textContent = `Z Tabs: ${rotateEnabled ? 'On' : 'Off'}`;
      }
    };

    const setSpeed = (value, options = {}) => {
      const next = value === 'slow' || value === 'fast' ? value : 'normal';
      const manual = options.manual !== false;
      const persist = options.persist !== false;
      rotateSpeed = next;
      window.__Z_USER_OVERRIDE_ROTATION_SPEED__ = manual;
      if (persist) {
        setSetting(TOP_TAB_ROTATION_SPEED_KEY, next);
      }
      if (speedSelect && speedSelect.value !== next) speedSelect.value = next;
    };

    const setScope = (value) => {
      const next = value === 'buttons-only' ? 'buttons-only' : 'buttons+badges';
      rotateScope = next;
      setSetting(TOP_TAB_ROTATION_SCOPE_KEY, next);
      if (scopeSelect && scopeSelect.value !== next) scopeSelect.value = next;
      activeIndex = 0;
      activate(0, 'manual');
    };

    const controls = document.createElement('div');
    controls.className = 'z-top-tab-controls';
    controls.setAttribute('aria-label', 'Top tab rotation controls');
    controls.innerHTML = `
      <button type="button" class="z-top-tab-toggle">Z Tabs: ${rotateEnabled ? 'On' : 'Off'}</button>
      <select class="z-top-tab-speed" aria-label="Top tab rotation speed">
        <option value="slow">Slow</option>
        <option value="normal">Normal</option>
        <option value="fast">Fast</option>
      </select>
      <select class="z-top-tab-scope" aria-label="Top tab rotation scope">
        <option value="buttons-only">Buttons only</option>
        <option value="buttons+badges">Buttons + badges</option>
      </select>
    `;

    const navLeft = document.createElement('button');
    navLeft.type = 'button';
    navLeft.className = 'z-top-tab-nav z-top-tab-nav-left';
    navLeft.setAttribute('aria-label', 'Z Scroll top rail left');
    navLeft.title = 'Z Move top rail left';
    navLeft.textContent = 'Z◀';

    const navRight = document.createElement('button');
    navRight.type = 'button';
    navRight.className = 'z-top-tab-nav z-top-tab-nav-right';
    navRight.setAttribute('aria-label', 'Z Scroll top rail right');
    navRight.title = 'Z Move top rail right';
    navRight.textContent = 'Z▶';

    const scrollRail = (direction = 1) => {
      const viewportClass =
        window.__Z_VIEWPORT_PROFILE__?.viewport_class ||
        document.documentElement.getAttribute('z-viewport') ||
        'desktop';
      const ratioByViewport = {
        ultra: 0.24,
        wide: 0.26,
        desktop: 0.28,
        tablet: 0.32,
        mobile: 0.36,
      };
      const ratio = ratioByViewport[viewportClass] || 0.28;
      const step = Math.max(120, rail.clientWidth * ratio);
      rail.scrollBy({ left: direction * step, behavior: 'smooth' });
      pause(3600);
      activate(activeIndex + (direction > 0 ? 1 : -1), 'manual');
    };

    const updateTopRailInsets = () => {
      const rootStyle = document.documentElement?.style;
      if (!rootStyle) return;
      const searchRoot = document.getElementById('zDashboardSearch');
      const clearBtn = document.getElementById('zDashboardSearchClearBtn');
      const inlineNav = document.getElementById('zTopRailInlineNav');
      const modeRoot = document.getElementById('lens-mode-toggle');
      const searchEnd = inlineNav
        ? inlineNav.getBoundingClientRect().right
        : clearBtn
          ? clearBtn.getBoundingClientRect().right
          : searchRoot
            ? searchRoot.getBoundingClientRect().right
            : 286;
      const leftGap = Math.ceil(searchEnd + 26);
      const rightGap = modeRoot ? Math.ceil(modeRoot.getBoundingClientRect().width + 24) : 224;
      rootStyle.setProperty('--z-top-rail-search-reserve', `${leftGap}px`);
      rootStyle.setProperty('--z-top-rail-mode-reserve', `${rightGap}px`);
      rail.style.left = `${leftGap}px`;
      rail.style.right = `${rightGap}px`;
    };

    const pulseNav = (btn) => {
      if (!btn) return;
      btn.classList.add('is-active');
      setTimeout(() => btn.classList.remove('is-active'), 420);
    };

    navLeft.addEventListener('click', () => {
      pulseNav(navLeft);
      scrollRail(-1);
    });
    navRight.addEventListener('click', () => {
      pulseNav(navRight);
      scrollRail(1);
    });

    const inlineLeft = document.getElementById('zTopRailInlineNavLeft');
    const inlineRight = document.getElementById('zTopRailInlineNavRight');
    inlineLeft?.addEventListener('click', () => {
      pulseNav(inlineLeft);
      scrollRail(-1);
    });
    inlineRight?.addEventListener('click', () => {
      pulseNav(inlineRight);
      scrollRail(1);
    });

    updateTopRailInsets();
    window.addEventListener('resize', updateTopRailInsets, { passive: true });
    setTimeout(updateTopRailInsets, 280);

    rail.insertBefore(navLeft, rail.firstChild);
    rail.appendChild(controls);
    rail.appendChild(navRight);
    const toggleBtn = controls.querySelector('.z-top-tab-toggle');
    const speedSelect = controls.querySelector('.z-top-tab-speed');
    const scopeSelect = controls.querySelector('.z-top-tab-scope');
    if (speedSelect) speedSelect.value = rotateSpeed;
    if (scopeSelect) scopeSelect.value = rotateScope;
    toggleBtn?.addEventListener('click', () => {
      setEnabled(!rotateEnabled);
      pause(2200);
    });
    speedSelect?.addEventListener('change', () => {
      setSpeed(speedSelect.value, { manual: true, persist: true });
      pause(1500);
    });
    scopeSelect?.addEventListener('change', () => {
      setScope(scopeSelect.value);
      pause(1800);
    });

    rail.addEventListener('mouseenter', () => pause(6000), { passive: true });
    rail.addEventListener('mouseleave', () => pause(1300), { passive: true });
    rail.addEventListener('touchstart', () => pause(6000), { passive: true });
    rail.addEventListener('wheel', () => pause(5200), { passive: true });
    rail.addEventListener('focusin', () => pause(6000), { passive: true });

    allItems.forEach((item) => {
      item.addEventListener('click', () => {
        pause(7000);
        const rotatingItems = getRotatingItems();
        const nextIndex = rotatingItems.indexOf(item);
        if (nextIndex >= 0) activate(nextIndex, 'manual');
      });
      item.addEventListener('focus', () => {
        pause(7000);
        const rotatingItems = getRotatingItems();
        const nextIndex = rotatingItems.indexOf(item);
        if (nextIndex >= 0) activate(nextIndex, 'manual');
      });
      if (item.tagName === 'BUTTON' && item.dataset.panel) {
        item.addEventListener('dblclick', (event) => {
          event.preventDefault();
          const panelId = item.dataset.panel;
          if (!panelId) return;
          const panel = document.getElementById(panelId);
          if (!panel) return;
          triggerPanelAction(panel, 'popout');
          pause(8000);
        });
      }
    });

    let nextRotateAt = Date.now() + (speedToMs[rotateSpeed] || speedToMs.normal);
    window.addEventListener('z-display-profile-changed', (event) => {
      if (window.__Z_USER_OVERRIDE_ROTATION_SPEED__) return;
      if (isInteractiveFocusActive()) return;
      const profile = event?.detail?.profile || 'desktop';
      const speedByProfile = {
        ultra: 'fast',
        wide: 'normal',
        desktop: 'normal',
        'compact-desktop': 'normal',
        tablet: 'slow',
        mobile: 'slow',
      };
      setSpeed(speedByProfile[profile] || 'normal', { manual: false, persist: false });
      nextRotateAt = Date.now() + (speedToMs[rotateSpeed] || speedToMs.normal);
    });
    setInterval(() => {
      if (!rotateEnabled) return;
      if (Date.now() < pauseUntil) return;
      if (rail.matches(':hover') || rail.matches(':focus-within')) return;
      if (Date.now() < nextRotateAt) return;
      activate(activeIndex + 1, 'auto');
      nextRotateAt = Date.now() + (speedToMs[rotateSpeed] || speedToMs.normal);
    }, 220);

    activate(0, 'manual');
  }

  function initContributorGuideButton() {
    const btn = document.getElementById('openContributeGuide');
    if (!btn) return;
    btn.addEventListener('click', () => {
      window.open('docs/CONTRIBUTE_GUIDE.md', '_blank', 'noopener');
      window.ZChronicle?.write?.({ type: 'z.insight.open_contributor_guide' });
    });
  }

  function ensurePanelVisible(panelId) {
    if (!panelId) return;
    setHidden(panelId, false, { manual: true });
    revealPanel(panelId);
  }

  document.addEventListener('keydown', (event) => {
    if (!event.ctrlKey || !event.altKey) return;
    const shortcuts = {
      KeyI: 'zIntelligencePanel',
      KeyS: 'zSocialPanel',
    };
    const target = shortcuts[event.code];
    if (target) {
      event.preventDefault();
      ensurePanelVisible(target);
    }
  });
})();
