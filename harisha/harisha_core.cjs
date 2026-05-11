const { calcScore } = require('./harisha_score.cjs');

const state = {
  score: 100,
  lastSignals: null,
};

function update(signals = {}) {
  state.score = calcScore(signals);
  state.lastSignals = signals;
  window.ZChronicle?.log('harisha.score', { score: state.score, signals, ts: new Date().toISOString() });
  return state.score;
}

function getScore() {
  return state.score;
}

module.exports = { update, getScore };
