const STORAGE_KEY = 'zq_z_music_observer_v1';
const MAX_EVENTS = 200;

/**
 * @param {string} type
 * @param {Record<string, unknown>} payload
 */
export function appendMusicObserverEvent(type, payload = {}) {
  if (typeof localStorage === 'undefined') return;
  try {
    const row = { type, payload, createdAt: new Date().toISOString() };
    const raw = localStorage.getItem(STORAGE_KEY);
    const prev = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(prev)) return;
    prev.push(row);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prev.slice(-MAX_EVENTS)));
  } catch {
    /* ignore quota / private mode */
  }
}

/** @returns {Array<{ type: string, payload: Record<string, unknown>, createdAt: string }>} */
export function readMusicObserverLog() {
  if (typeof localStorage === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const prev = raw ? JSON.parse(raw) : [];
    return Array.isArray(prev) ? prev : [];
  } catch {
    return [];
  }
}

export function clearMusicObserverLog() {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}
