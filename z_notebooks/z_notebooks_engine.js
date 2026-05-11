// Z: z_notebooks\z_notebooks_engine.js
const STORAGE_KEY = 'z_notebooks.entries';
const MAX_ENTRIES = 200;

function loadEntries() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch (error) {
    console.warn('Z-Notebooks load failed', error);
    return [];
  }
}

function saveEntries(entries) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(-MAX_ENTRIES)));
}

function logEntry(entry) {
  window.ZChronicle?.log('z_notebooks.note', entry);
  window.ZInsight?.ingest?.({ type: 'z_notebook', data: entry });
  window.ZWorldPulse?.ingest?.(entry);
}

function normalize(entry) {
  return {
    ...entry,
    tags: Array.isArray(entry.tags) ? entry.tags : [],
    created_at: entry.created_at || new Date().toISOString(),
    note_id: entry.note_id || `note_${Date.now()}`,
    tone: entry.tone || 'reflective',
  };
}

const ZNotebooks = {
  addNote(payload) {
    const note = normalize(payload);
    const entries = loadEntries();
    entries.push(note);
    saveEntries(entries);
    logEntry(note);
    window.dispatchEvent(new CustomEvent('z-notebook-updated'));
    return note;
  },

  listRecent(limit = 5) {
    const entries = loadEntries();
    return entries.slice(-limit).reverse();
  },

  findByAuthor(authorType) {
    return loadEntries().filter((entry) => entry.author_type === authorType);
  },
};

if (typeof window !== 'undefined') {
  window.ZNotebooks = ZNotebooks;
}

export { ZNotebooks };
