// Z: core\z_module_registry.js
// Z-Sanctuary Module Registry: single source of truth.
(function () {
  const STORAGE_KEY = 'zModuleRegistry';

  const registry = {
    modules: {},
    register(module) {
      if (!module || !module.id) {
        console.warn('Module missing id', module);
        return;
      }
      const existing = this.modules[module.id] || {};
      this.modules[module.id] = {
        ...existing,
        ...module,
        status: module.status || existing.status || 'offline',
        layer: module.layer || existing.layer || 'unknown',
        owner: module.owner || existing.owner || 'system',
        description: module.description || existing.description || '',
        governance: module.governance || existing.governance || 'SKK+RKPK',
        lastUpdate: new Date().toISOString(),
      };
      this.persist();
    },
    update(id, patch = {}) {
      if (!id || !this.modules[id]) return;
      this.modules[id] = {
        ...this.modules[id],
        ...patch,
        lastUpdate: new Date().toISOString(),
      };
      this.persist();
    },
    list() {
      return Object.entries(this.modules).map(([id, module]) => ({ id, ...module }));
    },
    persist() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.modules, null, 2));
      } catch (err) {
        // Ignore storage failures.
      }
    },
    restore() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) this.modules = JSON.parse(raw);
      } catch (err) {
        this.modules = {};
      }
    },
  };

  registry.restore();
  window.ZModuleRegistry = registry;
})();
