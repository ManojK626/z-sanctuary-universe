// Z: core\extension-loader.js
// Extension Loader: Loads and validates extension manifests
const fs = require('fs');
const path = require('path');

function loadExtensions(dir = './extensions') {
  const exts = [];
  for (const extDir of fs.readdirSync(dir)) {
    const manifestPath = path.join(dir, extDir, 'manifest.json');
    if (fs.existsSync(manifestPath)) {
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      // Only allow declared capabilities
      if (
        Array.isArray(manifest.capabilities) &&
        !manifest.capabilities.some((c) => c === 'execute_actions' || c === 'bypass_consent')
      ) {
        exts.push(manifest);
      }
    }
  }
  return exts;
}

module.exports = { loadExtensions };
