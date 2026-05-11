// Z: core\harisha_zone_panel.js
(function () {
  /**
   * Living Workspace Tag: Harisha Zone Panel
   * Description: surfaces Harisha score, zone status, and reflection summary for automation oversight.
   */
  const panel = document.getElementById('zHarishaStatusPanel');
  if (!panel) return;

  const scoreEl = panel.querySelector('#zHarishaScoreValue');
  const moodEl = panel.querySelector('#zHarishaMood');
  const zoneEl = panel.querySelector('#zHarishaZoneValue');
  const reasonEl = panel.querySelector('#zHarishaZoneReason');
  const reflectionEl = panel.querySelector('#zHarishaReflectionSummary');
  const runButton = panel.querySelector('#zReflectionQuickRun');

  function getHarishaScore() {
    const score = window.ZHarisha?.getScore?.() ?? 100;
    const state = score >= 80 ? 'calm' : score >= 60 ? 'alert' : score >= 40 ? 'tense' : 'critical';
    return { score, state };
  }

  function updateHarishaDisplay() {
    const { score, state } = getHarishaScore();
    if (scoreEl) scoreEl.textContent = `${score}`;
    if (moodEl) moodEl.textContent = `State: ${state}`;
  }

  function updateZoneDisplay() {
    const state = window.ZZoningState ?? window.ZZoning?.getZoningState?.();
    const currentZone = state?.currentZone || 'unknown';
    const reason = state?.reason || 'awaiting lens switch';
    if (zoneEl) zoneEl.textContent = currentZone;
    if (reasonEl) reasonEl.textContent = `Reason: ${reason}`;
  }

  function getReflectionSummary() {
    const q = window.ZChronicle?.query?.({ event: 'super_ghost.weekly_reflection' });
    const reflection =
      (Array.isArray(q) && q.length ? q[q.length - 1] : null) ||
      window.ZChronicle?.all?.()
        ?.filter((entry) => entry.event === 'super_ghost.weekly_reflection')
        .pop();
    return reflection?.payload?.narrative || 'No reflection logged yet.';
  }

  function updateReflectionDisplay() {
    if (reflectionEl) {
      reflectionEl.textContent = getReflectionSummary();
    }
  }

  function bindReflectionRun() {
    if (!runButton) return;
    runButton.addEventListener('click', () => {
      window.ZSuperGhostReflection?.runWeeklyReflection?.();
      updateReflectionDisplay();
    });
  }

  document.addEventListener('harisha:update', () => updateHarishaDisplay());
  document.addEventListener('z-world-pulse', () => updateHarishaDisplay());
  document.addEventListener('zoning.changed', () => updateZoneDisplay());

  setInterval(updateReflectionDisplay, 60 * 1000);
  updateHarishaDisplay();
  updateZoneDisplay();
  updateReflectionDisplay();
  bindReflectionRun();

  window.ZHarishaZonePanel = {
    refresh() {
      updateHarishaDisplay();
      updateZoneDisplay();
      updateReflectionDisplay();
    },
  };
})();
