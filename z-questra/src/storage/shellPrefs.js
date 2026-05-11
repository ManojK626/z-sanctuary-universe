/**
 * Optional local persistence (opt-in). Browser only; no sync to Z-Sanctuary.
 */
export const SHELL_PREFS_KEY = 'z-questra-shell-prefs-v1';

export function readShellPrefs() {
  if (typeof localStorage === 'undefined') return null;
  try {
    const raw = localStorage.getItem(SHELL_PREFS_KEY);
    if (!raw) return null;
    const o = JSON.parse(raw);
    if (!o || typeof o !== 'object' || o.version !== 1) return null;
    return o;
  } catch {
    return null;
  }
}

export function writeShellPrefs(payload) {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(SHELL_PREFS_KEY, JSON.stringify({ version: 1, ...payload }));
}

export function clearShellPrefs() {
  if (typeof localStorage === 'undefined') return;
  localStorage.removeItem(SHELL_PREFS_KEY);
}
