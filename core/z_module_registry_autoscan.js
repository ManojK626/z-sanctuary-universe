// Z: core\z_module_registry_autoscan.js
// Auto-register planned modules from /core and /miniai.
(function () {
  const CORE_PATHS = ['/core/', './'];
  const MINI_PATH = '/miniai/';
  const MANIFEST_URL = '/data/Z_module_manifest.json';
  const REGISTRY_DOC_URL = '/docs/z_module_registry.json';
  const AUTO_SYNC_DOCS = false;

  function isJsFile(name) {
    return name.endsWith('.js') || name.endsWith('.mjs');
  }

  function stripQuery(name) {
    return name.split('?')[0].split('#')[0];
  }

  function parseLinks(html) {
    const links = [];
    const regex = /href="([^"]+)"/gi;
    let match = regex.exec(html);
    while (match) {
      links.push(match[1]);
      match = regex.exec(html);
    }
    return links;
  }

  async function fetchListing(url) {
    try {
      const resp = await fetch(url, { cache: 'no-store' });
      if (!resp.ok) return [];
      const text = await resp.text();
      return parseLinks(text);
    } catch (err) {
      return [];
    }
  }

  function hasAgentRegistration(base) {
    if (!window.ZModuleRegistry) return false;
    const agentId = `ai-agent-${base}`;
    return Boolean(window.ZModuleRegistry.modules[agentId]);
  }

  function normalizeCoreId(base) {
    let name = base;
    if (name.startsWith('z_')) name = name.slice(2);
    name = name.replace(/_/g, '-');
    return `core-${name}`;
  }

  function normalizeAgentId(base) {
    let name = base.replace(/_bot$/, '');
    name = name.replace(/_/g, '-');
    return `ai-agent-${name}`;
  }

  function inferLayer(id) {
    const name = String(id || '').toLowerCase();
    if (name.startsWith('core-') || name.startsWith('dashboard')) return 'core';
    if (name.startsWith('sepc') || name.includes('governance')) return 'governance';
    if (name.startsWith('ai-') || name.includes('tower') || name.includes('bot')) return 'ai';
    return 'milestone';
  }

  function registerPlanned(files, layer, owner, prefix) {
    if (!window.ZModuleRegistry) return;
    files.forEach((file) => {
      const clean = stripQuery(file);
      if (!isJsFile(clean)) return;
      if (clean.includes('..')) return;
      const name = clean.split('/').pop();
      if (!name) return;
      const base = name.replace(/\.[^.]+$/, '');
      if (prefix === 'miniai' && hasAgentRegistration(base.replace('_bot', ''))) {
        return;
      }
      const id = prefix === 'core' ? normalizeCoreId(base) : normalizeAgentId(base);
      if (window.ZModuleRegistry.modules[id]) return;
      window.ZModuleRegistry.register({
        id,
        layer,
        owner,
        status: 'planned',
        description: `Planned module from ${prefix}/${name}`,
      });
    });
  }

  function registerFromManifest(modules) {
    if (!window.ZModuleRegistry) return;
    if (!Array.isArray(modules)) return;
    modules.forEach((module) => {
      const id = module.ZId || module.id;
      if (!module || !id) return;
      if (window.ZModuleRegistry.modules[id]) return;
      window.ZModuleRegistry.register({
        id,
        layer: module.ZLayer || module.layer || 'unknown',
        owner: module.ZOwner || module.owner || 'system',
        status: module.ZStatus || module.status || 'planned',
        description: module.ZDescription || module.description || '',
      });
    });
  }

  function registerFromRegistryDoc(modules) {
    if (!window.ZModuleRegistry) return;
    if (!Array.isArray(modules)) return;
    modules.forEach((module) => {
      if (!module || !module.id) return;
      const id = String(module.id);
      const existing = window.ZModuleRegistry.modules[id];
      const desiredStatus = module.done ? 'online' : 'planned';
      if (!existing) {
        window.ZModuleRegistry.register({
          id,
          layer: inferLayer(id),
          owner: 'SKK',
          status: desiredStatus,
          description: module.description || 'Planned module from docs registry.',
        });
        return;
      }
      if (module.done && !['online', 'active'].includes(String(existing.status || ''))) {
        window.ZModuleRegistry.update(id, { status: 'online' });
      }
    });
  }

  async function scanCore() {
    for (const path of CORE_PATHS) {
      const links = await fetchListing(path);
      if (links.length) {
        registerPlanned(links, 'core', 'SKK', 'core');
        break;
      }
    }
  }

  async function scanMiniai() {
    const links = await fetchListing(MINI_PATH);
    if (!links.length) return;
    registerPlanned(links, 'ai-agent', 'AI Tower', 'miniai');
  }

  async function scanManifest() {
    try {
      let resp = await fetch(MANIFEST_URL, { cache: 'no-store' });
      if (!resp.ok) {
        resp = await fetch('/data/z_module_manifest.json', { cache: 'no-store' });
      }
      if (!resp.ok) return;
      const data = await resp.json();
      registerFromManifest(data.ZModules || data.modules);
    } catch (err) {
      // Ignore missing manifest.
    }
  }

  async function scanRegistryDoc() {
    try {
      const resp = await fetch(REGISTRY_DOC_URL, { cache: 'no-store' });
      if (!resp.ok) return;
      const data = await resp.json();
      registerFromRegistryDoc(data.modules);
    } catch (err) {
      // Ignore missing registry doc.
    }
  }

  async function run() {
    await scanManifest();
    if (AUTO_SYNC_DOCS) {
      await scanRegistryDoc();
    }
    await scanCore();
    await scanMiniai();
  }

  window.ZModuleRegistrySyncFromDocs = async function () {
    await scanRegistryDoc();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
