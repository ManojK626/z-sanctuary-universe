// Z: Amk_Goku Worldwide Loterry\ui\education\edu_mode.js
async function loadJSON(path) {
  try {
    const r = await fetch(path);
    return await r.json();
  } catch {
    return null;
  }
}

(async function () {
  const root = document.getElementById('edu-root');

  const jail = await loadJSON('../../data/jailcell/public_summary.json');
  const drift = await loadJSON('../../data/drift_watch/summary.json');
  const trust = await loadJSON('../../data/reports/trust/summary.json');

  root.innerHTML = `
    <h2>1) Uncertainty is expected</h2>
    <div class="box">
      Real-world data is incomplete, delayed, or malformed.
      An observatory does not panic or fix forward.
      It records uncertainty as a first-class signal.
    </div>

    <h2>2) How anomalies are handled (Z-JAILCELL)</h2>
    <div class="box">
      <div>Total observed anomalies: <b>${jail?.total ?? '—'}</b></div>
      <div class="muted">
        Categories: ${jail?.by_category ? Object.keys(jail.by_category).join(', ') : '—'}
      </div>
      <p class="muted">
        Anomalies are quarantined, labeled, and studied.
        They never trigger actions or predictions.
      </p>
    </div>

    <h2>3) Drift is monitored, not hidden</h2>
    <div class="box">
      <div>Status: <b>${drift?.status || 'unknown'}</b></div>
      <div class="muted">
        Drift indicates change in data behavior over time.
        When detected, outputs are frozen or flagged.
      </div>
    </div>

    <h2>4) Trust is built by showing limits</h2>
    <div class="box">
      <div>Covered domains: ${trust?.covered?.join(', ') || '—'}</div>
      <div class="muted">
        Missing or skipped data is disclosed openly.
        No silent assumptions are made.
      </div>
    </div>

    <h2>5) Why the system does not act</h2>
    <div class="box muted">
      Z-Sanctuary separates understanding from execution.
      Recommendation is not permission.
      Observation is not control.
    </div>
  `;
})();
