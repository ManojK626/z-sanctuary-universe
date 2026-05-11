// Z: core\harisha_guidance.js
/**
 * Living Workspace Tag: Harisha Guidance Card
 * Description: updates the textual guidance chip with the current Harisha score.
 */
function guidanceText(score, tone) {
  if (tone === 'calm') return `Harisha ${score}: running normal operations.`;
  if (tone === 'alert') return `Harisha ${score}: prefer review before autopilot changes.`;
  if (tone === 'tense') return `Harisha ${score}: suggest observation-only actions.`;
  return `Harisha ${score}: hold new actions, stay in observe mode.`;
}

function tooltipText(action, score, state) {
  const tone = state || 'calm';
  const base = guidanceText(score, tone);
  return `${base} Action: ${action}.`;
}

function safeWorkWindowText(state) {
  return state === 'calm' ? 'Safe work window' : state === 'alert' ? 'Slow & observe' : 'Observe-only';
}

function applyHarishaContext({ score = 100, state = 'calm' } = {}) {
  const chip = document.getElementById('harishaGuidance');
  if (chip) {
    chip.textContent = guidanceText(score, state);
    chip.dataset.tone = state;
  }

  document.querySelectorAll('[data-harisha-action]').forEach((el) => {
    const action = el.dataset.harishaAction;
    if (!action) return;
    el.title = tooltipText(action, score, state);
  });

  const overlay = document.getElementById('harishaOverlay');
  if (overlay) {
    overlay.textContent = `Harisha ${score} (${state}) — ${safeWorkWindowText(state)}.`;
  }

  // Bottom status strip (dashboard): running ops + Safe work window (old view)
  const opsEl = document.getElementById('zBottomHarishaOps');
  if (opsEl) opsEl.textContent = guidanceText(score, state);
  const windowEl = document.getElementById('zBottomHarishaWindow');
  if (windowEl) windowEl.textContent = `Harisha ${score}: ${safeWorkWindowText(state)}.`;
}

function createHarishaOverlay() {
  let overlay = document.getElementById('harishaOverlay');
  if (overlay) return overlay;
  overlay = document.createElement('div');
  overlay.id = 'harishaOverlay';
  overlay.className = 'z-harisha-overlay';
  overlay.setAttribute('role', 'status');
  overlay.setAttribute('aria-live', 'polite');
  overlay.textContent = 'Harisha overlay initializing…';
  document.body.appendChild(overlay);
  return overlay;
}

document.addEventListener('DOMContentLoaded', () => {
  createHarishaOverlay();
  applyHarishaContext({}); // initial baseline
});

document.addEventListener('harisha:update', (event) => {
  if (!event?.detail) return;
  applyHarishaContext(event.detail);
});
