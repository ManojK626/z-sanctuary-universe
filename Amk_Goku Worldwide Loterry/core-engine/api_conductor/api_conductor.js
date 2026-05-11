// Z: Amk_Goku Worldwide Loterry\core-engine\api_conductor\api_conductor.js
const fs = require('fs');
const path = require('path');

const registryPath = path.join(__dirname, 'registry', 'api_registry.json');

function readRegistry() {
  try {
    const raw = fs.readFileSync(registryPath, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    return { _meta: { error: 'registry_unavailable' } };
  }
}

function getApiStatus(name) {
  const registry = readRegistry();
  for (const group of Object.values(registry)) {
    if (group && group[name]) return group[name];
  }
  return { status: 'unknown', tier: 'unknown', notes: 'Not registered' };
}

function listApisByCategory(category) {
  const registry = readRegistry();
  const results = [];
  for (const [groupName, group] of Object.entries(registry)) {
    if (groupName === '_meta') continue;
    for (const [name, cfg] of Object.entries(group)) {
      if (cfg.category === category) results.push({ name, ...cfg });
    }
  }
  return results;
}

module.exports = { readRegistry, getApiStatus, listApisByCategory };
