// Z: core\module_registry_panel.js
(function () {
  const readiness = document.getElementById('zModuleReadinessStrip');
  const registry = document.getElementById('zModuleRegistryList');
  if (!readiness || !registry) return;

  const statusColors = {
    ready: '#3bffb5',
    partial: '#fee58b',
    blocked: '#ff6f6f',
    unknown: '#9fa8c8',
  };

  function createBadge(count, label, color) {
    const badge = document.createElement('span');
    badge.className = 'z-module-badge';
    badge.textContent = `${label}: ${count}`;
    badge.style.borderColor = color;
    badge.style.color = color;
    return badge;
  }

  function createStatusChip(state = 'unknown', reasons = []) {
    const chip = document.createElement('span');
    chip.className = 'z-status-chip';
    chip.textContent = state.toUpperCase();
    const color = statusColors[state] || statusColors.unknown;
    chip.style.borderColor = color;
    chip.style.color = color;
    if (reasons.length) chip.title = reasons.join(' · ');
    return chip;
  }

  function createModuleCard(module, health, state) {
    const card = document.createElement('div');
    card.className = 'z-insight-card';
    const title = document.createElement('h4');
    title.textContent = module.ZName || module.name || module.ZId || module.id;
    const description = document.createElement('p');
    description.textContent =
      module.ZDescription || module.description || 'No description provided.';
    const meta = document.createElement('span');
    meta.className = 'z-insight-meta';
    meta.textContent = `Category: ${module.ZCategory || module.category || 'Core'}`;
    const chip = createStatusChip(state, (health?.metadata?.reasons || health?.reasons) ?? []);
    const actions = document.createElement('div');
    actions.className = 'z-panel-tree-actions';
    const openBtn = document.createElement('button');
    openBtn.className = 'z-button z-button-subtle';
    openBtn.dataset.moduleOpen = module.panelId || module.ZId || module.id;
    openBtn.textContent = 'Reveal';
    const launchBtn = document.createElement('button');
    launchBtn.className = 'z-button z-button-subtle';
    launchBtn.dataset.moduleLaunch = module.ZLaunchTask || module.launchTask || '';
    launchBtn.textContent = 'Launch Task';
    actions.appendChild(openBtn);
    actions.appendChild(launchBtn);
    card.appendChild(title);
    card.appendChild(description);
    card.appendChild(meta);
    card.appendChild(chip);
    card.appendChild(actions);
    return card;
  }

  function getHealthMap() {
    return window.ZSafePack?.getModuleHealth?.() || {};
  }

  function renderModules(modules = []) {
    registry.innerHTML = '';
    if (!modules.length) {
      const empty = document.createElement('div');
      empty.className = 'z-empty-state';
      empty.textContent = 'No modules registered yet.';
      registry.appendChild(empty);
      return;
    }
    const grouped = modules.reduce((acc, module) => {
      const group = module.ZCategory || module.category || 'Core';
      acc[group] = acc[group] || [];
      acc[group].push(module);
      return acc;
    }, {});
    const healthMap = getHealthMap();
    const counts = { ready: 0, partial: 0, blocked: 0 };
    Object.entries(grouped).forEach(([category, list]) => {
      const section = document.createElement('div');
      section.className = 'z-tree-group';
      const summary = document.createElement('summary');
      summary.textContent = category;
      section.appendChild(summary);
      const grid = document.createElement('div');
      grid.className = 'z-module-grid';
      list.forEach((module) => {
        const moduleId = module.ZId || module.id || module.ZEntry || module.entry;
        const health = healthMap[moduleId];
        const state = (
          health?.status ||
          module.ZStatus ||
          module.status ||
          'partial'
        ).toLowerCase();
        counts[state] = (counts[state] || 0) + 1;
        grid.appendChild(createModuleCard(module, health, state));
      });
      section.appendChild(grid);
      registry.appendChild(section);
    });
    readiness.innerHTML = '';
    readiness.appendChild(createBadge(counts.ready, 'READY', statusColors.ready));
    readiness.appendChild(createBadge(counts.partial, 'PARTIAL', statusColors.partial));
    readiness.appendChild(createBadge(counts.blocked, 'BLOCKED', statusColors.blocked));
  }

  function refresh() {
    fetch('data/Z_module_manifest.json')
      .then((res) =>
        res.ok ? res.json() : fetch('data/z_module_manifest.json').then((r) => r.json())
      )
      .then((data) => renderModules(data.ZModules || data.modules || []))
      .catch(() => {
        registry.innerHTML = '';
        const error = document.createElement('div');
        error.className = 'z-empty-state';
        error.textContent = 'Unable to load module manifest';
        registry.appendChild(error);
      });
  }

  registry.addEventListener('click', (event) => {
    const open = event.target.closest('[data-module-open]');
    const launch = event.target.closest('[data-module-launch]');
    if (open) {
      const moduleId = open.dataset.moduleOpen;
      window.ZLayoutOS?.revealPanel?.(moduleId, { userInitiated: true });
    }
    if (launch && launch.dataset.moduleLaunch) {
      window.ZLayoutOS?.log?.('trigger task', launch.dataset.moduleLaunch);
    }
  });

  refresh();
  setInterval(refresh, 120000);
})();
