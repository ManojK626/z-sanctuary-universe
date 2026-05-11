// Z: core\autopilot\z_autopilot_replay.js
// Autopilot replay log (local, ring-buffered).
(function () {
  const STORAGE_KEY = 'zAutopilotReplayLog';
  const MAX_ENTRIES = 200;
  let memoryLog = null;

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      return memoryLog || [];
    }
  }

  function save(entries) {
    const trimmed = entries.slice(-MAX_ENTRIES);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    } catch (err) {
      memoryLog = trimmed;
    }
  }

  function log(entry) {
    if (!entry || !entry.action) return;
    const id =
      entry.id ||
      (window.crypto && typeof window.crypto.randomUUID === 'function'
        ? window.crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`);
    const next = load();
    next.push({
      id,
      t: new Date().toISOString(),
      source: entry.source || 'autopilot',
      action: entry.action,
      value: entry.value || '',
      reason: entry.reason || {},
      state: entry.state || {},
    });
    save(next);
    if (window.ZLensStatus?.set) {
      window.ZLensStatus.set('autopilot');
    }
    if (window.ZInsightFeed?.push) {
      window.ZInsightFeed.push({
        id,
        channel: 'replay',
        source: entry.source || 'autopilot',
        summary: `${entry.action}${entry.value ? `:${entry.value}` : ''}`,
        metadata: {
          reason: entry.reason,
          state: entry.state,
        },
      });
    }
  }

  function list(options = {}) {
    const limit = Number.isFinite(options.limit) ? options.limit : 30;
    const action = options.action || 'all';
    const items = load().slice().reverse();
    const filtered = action === 'all' ? items : items.filter((item) => item.action === action);
    return filtered.slice(0, limit);
  }

  function all() {
    return load().slice();
  }

  function get(id) {
    return load().find((item) => item.id === id);
  }

  function restore() {
    return load();
  }

  function clear() {
    localStorage.removeItem(STORAGE_KEY);
    memoryLog = null;
  }

  function exportJson() {
    const payload = load();
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'z_autopilot_replay.json';
    link.click();
    URL.revokeObjectURL(url);
  }

  window.ZAutopilotReplay = {
    log,
    record: log,
    list,
    all,
    get,
    restore,
    clear,
    exportJson,
  };
})();
