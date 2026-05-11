// Z: core\insight_feed.js
// Insight feed for downstream automation & API wiring.
(function () {
  const STORAGE_KEY = 'zInsightFeedEntries';
  const MAX_ENTRIES = 60;

  function loadFeed() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  function saveFeed(entries) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(-MAX_ENTRIES)));
    } catch {
      // ignore
    }
  }

  function emit(entry) {
    window.dispatchEvent(
      new CustomEvent('zInsightFeed', {
        detail: entry,
      })
    );
  }

  function push(entry) {
    if (!entry || typeof entry !== 'object') return;
    const next = loadFeed();
    const payload = {
      t: new Date().toISOString(),
      id: entry.id || `feed-${Date.now()}-${next.length}`,
      channel: entry.channel || 'insight',
      source: entry.source || 'super-ghost',
      summary: entry.summary || entry.action || 'event',
      metadata: entry.metadata || {},
      reflection: entry.reflection || entry.metadata?.reflection || null,
      driftMessage: entry.driftMessage || entry.metadata?.driftMessage || null,
      lens: entry.metadata?.lens || null,
    };
    next.push(payload);
    saveFeed(next);
    emit(payload);
    return payload;
  }

  function list(limit = 20) {
    const entries = loadFeed();
    return entries.slice(-Math.min(limit, entries.length)).reverse();
  }

  function getLatest() {
    const entries = loadFeed();
    return entries[entries.length - 1] || null;
  }

  window.ZInsightFeed = {
    push,
    list,
    getLatest,
  };
})();
