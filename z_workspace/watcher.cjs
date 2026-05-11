const fs = require('fs');
const path = require('path');
const { enforcePolicy } = require('../safe_pack/lens_enforcer.cjs');

const statePath = path.join(__dirname, 'state.json');
const { addEntry } = require('./automation_log.cjs');

function logPolicy(lens, policy) {
  addEntry({
    type: 'safe_pack.policy',
    lens,
    mode: policy?.mode || 'unknown',
    ts: new Date().toISOString(),
  });
}

function watchState() {
  if (!fs.existsSync(statePath)) return;
  enforcePolicy();
  const initialState = JSON.parse(fs.readFileSync(statePath, 'utf8'));
  logPolicy(initialState.activeLens, global.ZSafePackPolicy);
  fs.watchFile(statePath, { interval: 500 }, () => {
    enforcePolicy();
    const state = JSON.parse(fs.readFileSync(statePath, 'utf8'));
    logPolicy(state.activeLens, global.ZSafePackPolicy);
  });
  console.log('[Workspace] Lens watcher running');
}

watchState();
