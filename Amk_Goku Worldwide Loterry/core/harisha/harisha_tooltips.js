// Z: Amk_Goku Worldwide Loterry\core\harisha\harisha_tooltips.js
const HARISHA_TOOLTIP_ATTR = 'data-harisha-action';

function getHarishaContext() {
  const score = window.ZHarisha?.getScore?.() ?? 100;
  const state = score >= 80 ? 'calm' : score >= 60 ? 'alert' : score >= 40 ? 'tense' : 'critical';
  return { score, state };
}

function tooltipForAction(action, score, state) {
  const prompt =
    state === 'calm'
      ? 'calm operations → standard automations allowed'
      : state === 'alert'
        ? 'review before automation'
        : state === 'tense'
          ? 'observe-only; no automated writes'
          : 'hold actions; stabilize first';
  return `Harisha ${score} (${state}) — ${prompt}. Action context: ${action}.`;
}

export function refreshHarishaTooltips() {
  const { score, state } = getHarishaContext();
  document.querySelectorAll(`[${HARISHA_TOOLTIP_ATTR}]`).forEach((el) => {
    const action = el.dataset.harishaAction;
    el.title = tooltipForAction(action, score, state);
  });
}
