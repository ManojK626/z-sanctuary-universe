// Z: core/z_arrbce_last_run_badge.js
// Edge badge: last successful Z-ARRBCE bulk refresh (data/reports/z_arrbce_last_run.json).
(function () {
  const PATH = '/data/reports/z_arrbce_last_run.json';
  const badgeEl = document.getElementById('zARRBCEBadge');
  if (!badgeEl) return;

  function setTone(tone) {
    badgeEl.classList.remove('edge-status-good', 'edge-status-warn', 'edge-status-bad');
    badgeEl.classList.add(tone === 'good' ? 'edge-status-good' : tone === 'warn' ? 'edge-status-warn' : 'edge-status-bad');
  }

  async function loadJson(url) {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }

  function relLabel(iso) {
    const t = Date.parse(String(iso || ''));
    if (Number.isNaN(t)) return null;
    const sec = Math.floor((Date.now() - t) / 1000);
    if (sec < 90) return `${sec}s ago`;
    const m = Math.floor(sec / 60);
    if (m < 90) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 48) return `${h}h ago`;
    const d = Math.floor(h / 24);
    return `${d}d ago`;
  }

  function ageHours(iso) {
    const t = Date.parse(String(iso || ''));
    if (Number.isNaN(t)) return Infinity;
    return (Date.now() - t) / 36e5;
  }

  function render(data) {
    const iso = data?.completed_at_iso;
    const mode = String(data?.mode || 'core');
    const rel = relLabel(iso);
    if (!rel) {
      badgeEl.textContent = 'ARRBCE: --';
      badgeEl.title = 'No Z-ARRBCE run recorded. Run: npm run arrbce:bulk-refresh';
      setTone('warn');
      return;
    }
    const h = ageHours(iso);
    badgeEl.textContent = `ARRBCE: ${rel}`;
    badgeEl.title = `Z-ARRBCE last success · mode=${mode} · ${iso}`;
    if (h <= 24) setTone('good');
    else if (h <= 24 * 7) setTone('warn');
    else setTone('bad');
  }

  async function refresh() {
    try {
      const data = await loadJson(PATH);
      if (!data?.ok) throw new Error('not_ok');
      render(data);
    } catch {
      badgeEl.textContent = 'ARRBCE: --';
      badgeEl.title = 'Run npm run arrbce:bulk-refresh after bulk-load days to stamp core reports.';
      setTone('warn');
    }
  }

  refresh();
  setInterval(refresh, 60_000);
})();
