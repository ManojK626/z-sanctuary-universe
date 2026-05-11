// Z: core\super_ghost_reflection_ui.js
(function () {
  /**
   * Living Workspace Tag: Super Ghost Reflection UI
   * Description: renders the weekly reflection card with export/run controls and pattern summary.
   */
  const container = document.getElementById('zInsightCards');
  if (!container) return;

  const card = document.createElement('div');
  card.className = 'z-insight-card';
  card.id = 'zReflectionCard';
  card.innerHTML = `
    <h4>Super Ghost Reflection</h4>
    <p id="zReflectionSummary">Loading weekly reflection…</p>
    <div id="zPatternConstellationInfo" class="z-insight-meta" style="margin-top:4px;font-size:11px;"></div>
    <div class="z-button-row" style="margin-top:8px;">
      <button id="zReflectionRun" class="z-button" data-harisha-action="Run Super Ghost reflection">Run reflection now</button>
      <button id="zReflectionExport" class="z-button" data-harisha-action="Export reflection log">Export reflection</button>
    </div>
  `;
  container.appendChild(card);

  function getReflection() {
    const q = window.ZChronicle?.query?.({ event: 'super_ghost.weekly_reflection' });
    if (Array.isArray(q) && q.length) {
      return q[q.length - 1];
    }
    const all = window.ZChronicle?.all?.() || window.ZChronicle?.getAll?.() || [];
    return all.filter((entry) => entry.event === 'super_ghost.weekly_reflection').pop();
  }

  function getConstellationSummary() {
    const raw = localStorage.getItem('zPatternConstellationMemory');
    if (!raw) return null;
    try {
      const memory = JSON.parse(raw);
      const last = memory[memory.length - 1];
      if (!last) return null;
      return `${last.patterns?.length || 0} pattern(s) stored`;
    } catch {
      return null;
    }
  }

  function render() {
    const summaryEl = document.getElementById('zReflectionSummary');
    const patternEl = document.getElementById('zPatternConstellationInfo');
    const reflection = getReflection();
    if (summaryEl) {
      summaryEl.textContent = reflection
        ? reflection.payload?.narrative || 'Reflection logged. Check Chronicle for details.'
        : 'No reflection recorded yet.';
    }
    if (patternEl) {
      const patternSummary = getConstellationSummary();
      patternEl.textContent = patternSummary || 'Pattern constellation quiet.';
    }
  }

  function exportReflection() {
    const reflection = getReflection();
    if (!reflection) return;
    const blob = new Blob([JSON.stringify(reflection, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `super-ghost-reflection-${new Date(reflection.ts).toISOString().replace(/[:.]/g, '-')}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    window.ZChronicle?.log('super_ghost.reflection_export', { ts: new Date().toISOString() });
  }

  function runReflectionNow() {
    const result = window.ZSuperGhostReflection?.runWeeklyReflection?.();
    if (result) {
      window.ZChronicle?.log('super_ghost.reflection_manual', {
        narrative: result.message || 'Manual reflection triggered',
        ts: new Date().toISOString(),
      });
      render();
    }
  }

  document.getElementById('zReflectionRun')?.addEventListener('click', () => runReflectionNow());
  document.getElementById('zReflectionExport')?.addEventListener('click', () => exportReflection());

  render();
  setInterval(render, 55 * 1000);
})();
