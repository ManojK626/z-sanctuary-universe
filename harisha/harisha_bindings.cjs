const { startHarishaLoop, getScore } = require('./harisha_monitor.cjs');
const { render } = require('./harisha_overlay.cjs');

function initHarisha() {
  startHarishaLoop();
  setInterval(() => {
    const score = getScore();
    render(score);
  }, 1000);
}

module.exports = { initHarisha };
