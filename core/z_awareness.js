// Z: core\z_awareness.js
/**
 * Z-Awareness
 * Lightweight awareness layer for UI and mini-AI context.
 */

const ZAwareness = (() => {
  const STORAGE_KEY = 'zChronicleEvents';
  const LISTENING_KEY = 'zListeningConsent';
  const MAX_EVENTS = 50;
  const DEFAULT_ENDPOINT = 'http://127.0.0.1:3333/chronicle';
  const SYNC_INTERVAL_MS = 10000;
  const state = {
    mood: 'neutral',
    focus: 'balanced',
    energy: 0.5,
    trend: 'steady',
    updatedAt: null,
  };

  function safeParse(raw) {
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      return [];
    }
  }

  function loadEvents() {
    if (typeof localStorage === 'undefined') return [];
    return safeParse(localStorage.getItem(STORAGE_KEY));
  }

  function isListeningAllowed() {
    if (typeof window !== 'undefined' && window.ZConsent) {
      return window.ZConsent.listening === true;
    }
    if (typeof localStorage === 'undefined') return false;
    return (
      localStorage.getItem(LISTENING_KEY) === '1' || localStorage.getItem(LISTENING_KEY) === 'true'
    );
  }

  function saveEvents(events) {
    if (typeof localStorage === 'undefined') return;
    const trimmed = events.slice(-MAX_EVENTS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  }

  function normalizeEvent(entry) {
    if (!entry || typeof entry !== 'object') return null;
    const ts = entry.ts || entry.time || entry.timestamp || new Date().toISOString();
    const type = entry.type || 'status';
    const message =
      entry.message || entry.note || entry.file || entry.rule_id || entry.trigger_event_type || '';
    const mood = entry.mood || moodFromType(type) || 'neutral';
    return { ts, type, message, mood };
  }

  function mergeEvents(localEvents, incoming) {
    const merged = new Map();
    const add = (evt) => {
      if (!evt) return;
      const key = `${evt.ts}|${evt.type}|${evt.message}`;
      merged.set(key, evt);
    };
    localEvents.forEach(add);
    incoming.forEach(add);
    return Array.from(merged.values()).slice(-MAX_EVENTS);
  }

  function moodFromType(type) {
    switch (type) {
      case 'error':
        return 'stressed';
      case 'warning':
        return 'alert';
      case 'active':
        return 'focused';
      default:
        return 'neutral';
    }
  }

  function moodFromEmotion() {
    if (!window.ZEmotionFilter || !window.ZEmotionFilter.getEmotionalState) return null;
    const coherence = window.ZEmotionFilter.getEmotionalState().coherence;
    if (coherence > 80) return 'uplifted';
    if (coherence > 65) return 'focused';
    if (coherence > 45) return 'steady';
    return 'tired';
  }

  function getCoherence() {
    if (!window.ZEmotionFilter || !window.ZEmotionFilter.getEmotionalState) return null;
    const coherence = window.ZEmotionFilter.getEmotionalState().coherence;
    return Number.isFinite(coherence) ? Math.round(coherence) : null;
  }

  function focusFromEmotion() {
    if (!window.ZEmotionFilter || !window.ZEmotionFilter.getEmotionalState) return 'balanced';
    const coherence = window.ZEmotionFilter.getEmotionalState().coherence;
    if (coherence > 75) return 'focused';
    if (coherence > 55) return 'balanced';
    return 'scattered';
  }

  function energyFromSystem(events) {
    if (window.ZEnergyResponse && window.ZEnergyResponse.getEnergy) {
      return Math.min(1, Math.max(0, window.ZEnergyResponse.getEnergy() / 100));
    }
    return Math.min(1, Math.max(0.2, events.length / 10));
  }

  function inferMood(events) {
    if (!events.length) return moodFromEmotion() || 'neutral';
    const counts = events.reduce((acc, entry) => {
      const mood = entry.mood || moodFromType(entry.type);
      acc[mood] = (acc[mood] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'neutral';
  }

  function scanChronicle() {
    const events = loadEvents().slice(-10);
    const mood = inferMood(events);
    const focus = focusFromEmotion();
    const energy = energyFromSystem(events);
    let trend = 'steady';
    if (energy >= 0.75) trend = 'rising';
    if (energy <= 0.35) trend = 'dipping';
    if (events.length >= 2) {
      const prevMood = events[events.length - 2]?.mood;
      if (prevMood && prevMood !== mood) trend = 'shifting';
    }

    state.mood = mood;
    state.focus = focus;
    state.energy = energy;
    state.trend = trend;
    state.updatedAt = Date.now();
    return { ...state };
  }

  function summary() {
    const energyPct = Math.round(state.energy * 100);
    const coherence = getCoherence();
    const coherenceText = coherence !== null ? ` | Coherence: ${coherence}%` : '';
    return `System Health: ${state.mood} | Focus: ${state.focus} | Energy: ${energyPct}% | Trend: ${state.trend}${coherenceText}`;
  }

  function updatePanel() {
    const el = document.getElementById('zAwarenessState');
    if (el) el.textContent = summary();
  }

  function recordEvent(entry) {
    const events = loadEvents();
    const normalized = normalizeEvent({
      ts: new Date().toISOString(),
      type: entry && entry.type ? entry.type : 'status',
      message: entry && entry.message ? entry.message : '',
      mood:
        (entry && entry.mood) ||
        moodFromType(entry && entry.type) ||
        moodFromEmotion() ||
        'neutral',
    });
    if (normalized) {
      events.push(normalized);
      saveEvents(events);
    }
    scanChronicle();
    if (typeof document !== 'undefined') updatePanel();
    return normalized;
  }

  async function syncFromServer() {
    if (typeof fetch === 'undefined') return;
    if (!isListeningAllowed()) return;
    const endpoint =
      (typeof window !== 'undefined' && window.ZChronicleEndpoint) || DEFAULT_ENDPOINT;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    try {
      const resp = await fetch(`${endpoint}?limit=${MAX_EVENTS}`, { signal: controller.signal });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const payload = await resp.json();
      const incoming = Array.isArray(payload) ? payload : payload.events || [];
      const normalizedIncoming = incoming.map(normalizeEvent).filter(Boolean);
      const merged = mergeEvents(loadEvents(), normalizedIncoming);
      saveEvents(merged);
      scanChronicle();
      updatePanel();
    } catch (err) {
      /* ignore sync errors */
    } finally {
      clearTimeout(timeout);
    }
  }

  function init() {
    scanChronicle();
    updatePanel();
    syncFromServer();
    setInterval(syncFromServer, SYNC_INTERVAL_MS);
    setInterval(() => {
      scanChronicle();
      updatePanel();
    }, 5000);
  }

  return {
    state,
    init,
    scanChronicle,
    recordEvent,
    summary,
    getState: () => ({ ...state }),
  };
})();

if (typeof window !== 'undefined') {
  window.ZAwareness = ZAwareness;
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    ZAwareness.init();
  });
}
