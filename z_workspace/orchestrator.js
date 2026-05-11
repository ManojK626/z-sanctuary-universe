// Z: z_workspace\orchestrator.js
const fs = require('fs');
const path = require('path');

const statePath = path.join(__dirname, 'state.json');
const lensesPath = path.join(__dirname, 'lenses.json');

function loadJSON(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, 'utf8').trim();
  return raw ? JSON.parse(raw) : null;
}

const lenses = loadJSON(lensesPath);
const { addEntry } = require('./automation_log.cjs');

function snapshot(name) {
  const lens = lenses?.lenses?.[name];
  if (!lens) {
    console.error('Unknown lens:', name);
    return null;
  }

  const payload = {
    activeLens: name,
    activatedAt: new Date().toISOString(),
    config: lens,
  };
  fs.writeFileSync(statePath, JSON.stringify(payload, null, 2), 'utf8');
  return payload;
}

const lensArg = process.argv[2];
if (lensArg) {
  snapshot(lensArg);
  addEntry({
    type: 'lens.switch',
    lens: lensArg,
    ts: new Date().toISOString(),
  });
} else {
  console.log('Available lenses:', Object.keys(lenses?.lenses || {}));
}
