// Z: core\z_wisdom_ring.js
// Wisdom Ring: inter-chain reflection and gentle suggestions.
(function () {
  const STORAGE_KEY = 'zWisdomNotes';
  const MAX_NOTES = 40;
  const REFRESH_MS = 60000;
  let latestSuggestion = null;

  function loadNotes() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      return [];
    }
  }

  function saveNotes(notes) {
    const trimmed = notes.slice(-MAX_NOTES);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    } catch (err) {
      // ignore
    }
  }

  function clamp01(value) {
    return Math.max(0, Math.min(1, value));
  }

  function ethicsScore(edge) {
    const ethics = edge.ethics || {};
    const transparency = ethics.transparency ?? 0.7;
    const reversibility = ethics.reversibility ?? 0.7;
    const humanImpact = ethics.humanImpact ?? 0.7;
    const escalationRisk = ethics.escalationRisk ?? 0.4;
    return clamp01((transparency + reversibility + humanImpact + (1 - escalationRisk)) / 4);
  }

  function compareChains() {
    const history = window.ZChainHistory?.getWeeklyHeatSummary?.() || [];
    const edges = window.ZChainRegistry?.getEdges?.() || [];
    const edgeMap = new Map(edges.map((edge) => [edge.id, edge]));
    if (history.length < 2) return null;

    for (let i = 0; i < history.length; i += 1) {
      for (let j = i + 1; j < history.length; j += 1) {
        const a = history[i];
        const b = history[j];
        if (Math.abs(a.avgHeat - b.avgHeat) > 0.15) continue;
        const edgeA = edgeMap.get(a.id);
        const edgeB = edgeMap.get(b.id);
        if (!edgeA || !edgeB) continue;
        const ethicsA = ethicsScore(edgeA);
        const ethicsB = ethicsScore(edgeB);
        if (ethicsB > ethicsA + 0.1) {
          return {
            from: a.id,
            to: b.id,
            message: `Chain ${b.source} -> ${b.target} resolved similar stress with gentler ethics.`,
          };
        }
      }
    }
    return null;
  }

  function refresh() {
    const suggestion = compareChains();
    if (!suggestion) return;
    latestSuggestion = {
      ...suggestion,
      t: Date.now(),
    };
    const notes = loadNotes();
    notes.push({
      t: latestSuggestion.t,
      context: 'inter-chain',
      lesson: suggestion.message,
      confidence: 0.72,
    });
    saveNotes(notes);
  }

  function getLatestSuggestion() {
    return latestSuggestion;
  }

  function getNotes() {
    return loadNotes();
  }

  window.ZWisdomRing = {
    refresh,
    getLatestSuggestion,
    getNotes,
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      refresh();
      setInterval(refresh, REFRESH_MS);
    });
  } else {
    refresh();
    setInterval(refresh, REFRESH_MS);
  }
})();
