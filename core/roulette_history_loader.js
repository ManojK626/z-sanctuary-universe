// Z: core\roulette_history_loader.js
(function () {
  async function loadHistory() {
    try {
      const [historyRes, metaRes] = await Promise.all([
        fetch('/data/roulette_history.json'),
        fetch('/data/last_import.json'),
      ]);
      if (historyRes.ok) {
        const history = await historyRes.json();
        window.ZRouletteHistoryData = history;
      }
      if (metaRes.ok) {
        const meta = await metaRes.json();
        window.ZRouletteHistoryMetadata = meta;
        if (window.ZRouletteIntelligence?.recordImportSummary) {
          window.ZRouletteIntelligence.recordImportSummary(meta);
        }
        window.dispatchEvent(new CustomEvent('zRouletteHistoryImported', { detail: meta }));
      }
    } catch (err) {
      console.warn('Roulette history loader failed', err);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadHistory);
  } else {
    loadHistory();
  }
})();
