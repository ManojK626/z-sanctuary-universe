// Z: core\z_safe_pack_status.js
// Z-Safe Pack Status Observer
(function () {
  const STORAGE_KEY = 'zSafePackWebhookHistory';

  function loadHistory() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      return [];
    }
  }

  function getLatest() {
    const history = loadHistory();
    if (!history.length) return null;
    const last = history[history.length - 1];
    return {
      ts: last.ts,
      status: last.status,
      event: last.event,
      detail: last.detail,
    };
  }

  window.ZSafePackStatus = { getLatest };
})();
