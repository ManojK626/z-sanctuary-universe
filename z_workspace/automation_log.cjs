const fs = require('fs');
const path = require('path');

const logPath = path.join(__dirname, 'automation_log.json');

function readLog() {
  if (!fs.existsSync(logPath)) return [];
  try {
    return JSON.parse(fs.readFileSync(logPath, 'utf8'));
  } catch {
    return [];
  }
}

function addEntry(entry) {
  const log = readLog();
  log.push(entry);
  fs.writeFileSync(logPath, JSON.stringify(log.slice(-50), null, 2), 'utf8');
}

module.exports = { addEntry, readLog };
