// Z: Amk_Goku Worldwide Loterry\ui\drift_watch\drift_watch.js
async function loadJSON(path) {
  try {
    const r = await fetch(path);
    return await r.json();
  } catch {
    return null;
  }
}

(async function () {
  const root = document.getElementById('drift-root');

  const summary = await loadJSON('../../data/drift_watch/summary.json');
  const entries = summary?.history || [];

  if (!entries.length) {
    root.innerHTML = '<div class="box muted">No drift history recorded yet.</div>';
    return;
  }

  root.innerHTML = `
    <h2>Drift Timeline</h2>
    <div class="box">
      ${entries
        .map(
          (e) => `
        <div class="row">
          <div>
            <b>${e.run_id}</b>
            <div class="muted">${e.ts}</div>
          </div>
          <div>
            <span class="tag">${e.status}</span>
          </div>
        </div>
        <div class="muted" style="margin-bottom:8px;">
          ${e.notes || '—'}
        </div>
      `
        )
        .join('')}
    </div>

    <h2>Current Status</h2>
    <div class="box">
      <div>Status: <b>${summary.status || 'unknown'}</b></div>
      <div class="muted">${summary.notes || 'No additional notes.'}</div>
    </div>
  `;
})();
