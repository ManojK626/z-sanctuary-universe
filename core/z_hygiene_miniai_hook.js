// Z: core/z_hygiene_miniai_hook.js
// MiniAI bridge: publish hygiene status changes to bot feed (read-only).
(function () {
  const REPORT_URL = '/data/reports/z_hygiene_status.json';
  const POLL_MS = 90000;
  let lastSignature = '';

  async function loadJson() {
    try {
      const res = await fetch(REPORT_URL, { cache: 'no-store' });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  function computeSignature(payload) {
    if (!payload) return 'none';
    const failed = (payload.checks || [])
      .filter((c) => c && c.pass === false)
      .map((c) => c.id)
      .sort();
    return `${payload.status || 'unknown'}|${failed.join(',')}`;
  }

  function publish(payload) {
    const status = String(payload?.status || 'unknown').toUpperCase();
    const failed = (payload?.checks || []).filter((c) => c.pass === false);
    const message = failed.length
      ? `hygiene ${status} - failed: ${failed.map((f) => f.id).join(', ')}`
      : `hygiene ${status} - all checks passed`;

    if (window.ZScribeBot?.record) {
      window.ZScribeBot.record(message, {
        pending_total: payload?.metrics?.pending_total ?? null,
        raw_files: payload?.metrics?.raw_files ?? null,
      });
    } else if (window.ZBaseBot?.log) {
      window.ZBaseBot.log('hygiene', message, failed.length ? 'warning' : 'active');
    }

    if (failed.length && window.ZProtectorBot?.scan) {
      window.ZProtectorBot.scan({
        hygiene: payload.status,
        failed_checks: failed.map((f) => f.id),
      });
    }
  }

  async function refresh() {
    const payload = await loadJson();
    if (!payload) return;
    const sig = computeSignature(payload);
    if (sig === lastSignature) return;
    lastSignature = sig;
    publish(payload);
  }

  refresh();
  setInterval(refresh, POLL_MS);
})();
