// Z: Amk_Goku Worldwide Loterry\core\circles\circles_store.js
// Z-Circles Store (browser-safe, localStorage-backed)
// Read-only by default; safe mutations are explicit functions.

(function () {
  const LS_KEY = 'zCircles.data.v1';
  const DEFAULT_PATHS = {
    circlesJson: 'data/circles/circles.json',
    notebooksJson: 'data/circles/circle_notebooks.json',
    trustPacksJson: 'data/circles/circle_trust_packs.json',
    learningPackJson: 'data/learning/circle_learning_pack.json',
  };

  function nowIso() {
    return new Date().toISOString();
  }

  async function fetchJson(path) {
    const res = await fetch(path, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Failed to load ${path} (${res.status})`);
    return res.json();
  }

  function loadLocal() {
    try {
      return JSON.parse(localStorage.getItem(LS_KEY)) || null;
    } catch {
      return null;
    }
  }

  function saveLocal(state) {
    localStorage.setItem(LS_KEY, JSON.stringify(state));
  }

  function chronicle(entry) {
    if (window.ZChronicle?.record) {
      window.ZChronicle.record({
        source: 'circles',
        ...entry,
      });
    }
    if (window.ZSuperGhost?.ingest) {
      window.ZSuperGhost.ingest({
        module: 'circles',
        intent: 'observe',
        angleDeg: 0,
        space: 'module',
        cellIndex: [0, 0],
        meta: entry,
      });
    }
  }

  async function bootstrap(paths = DEFAULT_PATHS) {
    let state = loadLocal();
    if (!state) {
      const [circles, notebooks, trustPacks, learningPack] = await Promise.all([
        fetchJson(paths.circlesJson),
        fetchJson(paths.notebooksJson),
        fetchJson(paths.trustPacksJson),
        fetchJson(paths.learningPackJson),
      ]);

      state = {
        ts: nowIso(),
        circles: circles.circles || [],
        notes: notebooks.notes || [],
        trust_packs: trustPacks.trust_packs || [],
        learning_packs: learningPack.packs || [],
      };
      saveLocal(state);
      chronicle({
        type: 'CIRCLES_BOOTSTRAP',
        payload: { circles: state.circles.length, notes: state.notes.length },
      });
    }
    return state;
  }

  function getState() {
    return (
      loadLocal() || { ts: nowIso(), circles: [], notes: [], trust_packs: [], learning_packs: [] }
    );
  }

  function listCircles() {
    return getState().circles || [];
  }

  function getCircle(circleId) {
    return listCircles().find((c) => c.id === circleId) || null;
  }

  function listNotes(circleId) {
    return (getState().notes || []).filter((n) => n.circle_id === circleId);
  }

  function getTrustPack(circleId) {
    return (getState().trust_packs || []).find((t) => t.circle_id === circleId) || null;
  }

  function getLearningPack(circleId) {
    return (getState().learning_packs || []).find((p) => p.circle_id === circleId) || null;
  }

  function setRhythm(circleId, newRhythm, actor = 'unknown') {
    const state = getState();
    const idx = (state.circles || []).findIndex((c) => c.id === circleId);
    if (idx < 0) throw new Error(`Circle not found: ${circleId}`);

    const prev = state.circles[idx].rhythm;
    state.circles[idx].rhythm = newRhythm;
    state.circles[idx].updated_at = nowIso();
    state.ts = nowIso();
    saveLocal(state);

    chronicle({
      type: 'RHYTHM_CHANGED',
      circle_id: circleId,
      actor,
      payload: { from: prev, to: newRhythm },
    });

    document.dispatchEvent(new CustomEvent('zcircles:update', { detail: { circle_id: circleId } }));
  }

  function addNote(circleId, text, actor = 'unknown', kind = 'reflection', tags = []) {
    const state = getState();
    const id = `note-${Math.random().toString(16).slice(2)}`;
    const note = { id, circle_id: circleId, ts: nowIso(), author: actor, kind, text, tags };
    state.notes = state.notes || [];
    state.notes.push(note);
    state.ts = nowIso();
    saveLocal(state);

    chronicle({
      type: 'NOTE_ADDED',
      circle_id: circleId,
      actor,
      payload: { kind, tags, note_id: id },
    });

    document.dispatchEvent(new CustomEvent('zcircles:update', { detail: { circle_id: circleId } }));
    return note;
  }

  window.ZCircles = {
    bootstrap,
    getState,
    listCircles,
    getCircle,
    listNotes,
    getTrustPack,
    getLearningPack,
    setRhythm,
    addNote,
  };
})();
