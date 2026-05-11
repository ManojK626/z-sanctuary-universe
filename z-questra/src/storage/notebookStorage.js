export const NOTEBOOK_REMEMBER_KEY = 'zq_notebook_remember_v1';
export const NOTEBOOK_DATA_KEY = 'zq_notebook_pages_v1';

export function readNotebookRemember() {
  if (typeof localStorage === 'undefined') return false;
  try {
    return localStorage.getItem(NOTEBOOK_REMEMBER_KEY) === '1';
  } catch {
    return false;
  }
}

export function writeNotebookRemember(on) {
  if (typeof localStorage === 'undefined') return;
  try {
    if (on) {
      localStorage.setItem(NOTEBOOK_REMEMBER_KEY, '1');
    } else {
      localStorage.removeItem(NOTEBOOK_REMEMBER_KEY);
      localStorage.removeItem(NOTEBOOK_DATA_KEY);
    }
  } catch {
    /* ignore quota */
  }
}

export function loadNotebookPages() {
  if (!readNotebookRemember()) return null;
  if (typeof localStorage === 'undefined') return null;
  try {
    const raw = localStorage.getItem(NOTEBOOK_DATA_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.version !== 1 || !Array.isArray(parsed.pages)) return null;
    return parsed.pages.filter((p) => p && typeof p.id === 'string' && typeof p.title === 'string');
  } catch {
    return null;
  }
}

export function saveNotebookPages(pages) {
  if (!readNotebookRemember()) return;
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(NOTEBOOK_DATA_KEY, JSON.stringify({ version: 1, pages }));
  } catch {
    /* ignore quota */
  }
}

export function buildNotebookExportPayload(pages) {
  return {
    app: 'z-questra',
    kind: 'local-notebook',
    version: 1,
    exportedAt: new Date().toISOString(),
    pages,
  };
}
