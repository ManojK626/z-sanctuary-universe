// Z: core\harisha_tooltips.js
/**
 * Living Workspace Tag: Harisha Tooltip Helper
 * Description: builds tooltips for Harisha-driven automation actions.
 */
const HARISHA_TOOLTIP_ATTR = 'data-harisha-action';

function getHarishaContext() {
  const score = window.ZHarisha?.getScore?.() ?? 100;
  const state = score >= 80 ? 'calm' : score >= 60 ? 'alert' : score >= 40 ? 'tense' : 'critical';
  return { score, state };
}

function guidanceText(score, tone) {
  if (tone === 'calm') return `Harisha ${score}: running normal operations.`;
  if (tone === 'alert') return `Harisha ${score}: prefer review before automated changes.`;
  if (tone === 'tense') return `Harisha ${score}: observe-only preferred.`;
  return `Harisha ${score}: hold actions; stabilize first.`;
}

function tooltipForAction(action, score, state) {
  return `${guidanceText(score, state)} Action context: ${action}.`;
}

export function refreshHarishaTooltips() {
  const { score, state } = getHarishaContext();
  document.querySelectorAll(`[${HARISHA_TOOLTIP_ATTR}]`).forEach((el) => {
    const action = el.dataset.harishaAction;
    if (!action) return;
    el.title = tooltipForAction(action, score, state);
  });
  return { score, state };
}

export function buildHarishaTooltip(action, score, state) {
  return tooltipForAction(action, score, state);
}
