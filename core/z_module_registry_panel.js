// Z: core\z_module_registry_panel.js
(function () {
  const listEl = document.getElementById('zModuleRegistryList');
  if (!listEl) return;

  const countEl = document.getElementById('zModuleRegistryCount');
  const agentCountEl = document.getElementById('zModuleRegistryAgentCount');
  const onlineCountEl = document.getElementById('zModuleRegistryOnlineCount');
  const plannedCountEl = document.getElementById('zModuleRegistryPlannedCount');
  const updatedEl = document.getElementById('zModuleRegistryUpdated');
  const coverageEl = document.getElementById('zModuleRegistryCoverage');
  const doneEl = document.getElementById('zModuleRegistryDoneCount');
  const auditUpdatedEl = document.getElementById('zModuleRegistryAuditUpdated');
  const coverageBadgeEl = document.getElementById('zModuleCoverageBadge');

  const AUDIT_URL = '/data/reports/z_module_registry_audit.json';

  function createModuleRow(module, state) {
    const row = document.createElement('div');
    row.className = 'z-module-row';
    const title = document.createElement('div');
    title.className = 'z-module-row-title';
    title.textContent = module.ZName || module.name || module.ZId || module.id;
    const badge = document.createElement('span');
    badge.className = `z-status-chip z-status-${state}`;
    badge.textContent = state.toUpperCase();
    const actions = document.createElement('div');
    actions.className = 'z-module-row-actions';
    const openBtn = document.createElement('button');
    openBtn.className = 'z-button z-button-subtle';
    openBtn.dataset.moduleOpen = module.panelId || module.ZId || module.id;
    openBtn.textContent = 'Reveal';
    const launchBtn = document.createElement('button');
    launchBtn.className = 'z-button z-button-subtle';
    launchBtn.dataset.moduleLaunch = module.ZLaunchTask || module.launchTask || '';
    launchBtn.textContent = 'Launch';
    actions.appendChild(openBtn);
    actions.appendChild(launchBtn);
    row.appendChild(title);
    row.appendChild(badge);
    row.appendChild(actions);
    return row;
  }

  function render(modules = []) {
    listEl.innerHTML = '';
    if (!modules.length) {
      const empty = document.createElement('div');
      empty.className = 'z-empty-state';
      empty.textContent = 'No modules registered yet.';
      listEl.appendChild(empty);
      if (countEl) countEl.textContent = '0';
      if (agentCountEl) agentCountEl.textContent = '0';
      if (onlineCountEl) onlineCountEl.textContent = '0';
      if (plannedCountEl) plannedCountEl.textContent = '0';
      return;
    }
    const total = modules.length;
    const agentCount = modules.filter((m) =>
      String(m.ZLayer || m.layer || '')
        .toLowerCase()
        .startsWith('ai')
    ).length;
    const onlineCount = modules.filter((m) => {
      const status = String(m.ZStatus || m.status || '').toLowerCase();
      return ['online', 'ready', 'active'].includes(status);
    }).length;
    const plannedCount = modules.filter((m) => {
      const status = String(m.ZStatus || m.status || '').toLowerCase();
      return status === 'planned';
    }).length;
    if (countEl) countEl.textContent = String(total);
    if (agentCountEl) agentCountEl.textContent = String(agentCount);
    if (onlineCountEl) onlineCountEl.textContent = String(onlineCount);
    if (plannedCountEl) plannedCountEl.textContent = String(plannedCount);
    modules.forEach((module) => {
      const state = (module.ZStatus || module.status || 'partial').toLowerCase();
      listEl.appendChild(createModuleRow(module, state));
    });
  }

  listEl.addEventListener('click', (event) => {
    const open = event.target.closest('[data-module-open]');
    const launch = event.target.closest('[data-module-launch]');
    if (open) {
      const id = open.dataset.moduleOpen;
      window.ZLayoutOS?.revealPanel?.(id, { userInitiated: true });
    }
    if (launch && launch.dataset.moduleLaunch) {
      window.ZLayoutOS?.log?.('trigger task', launch.dataset.moduleLaunch);
    }
  });

  fetch('/data/Z_module_registry.json')
    .then((res) =>
      res.ok
        ? res.json()
        : fetch('/data/Z_module_manifest.json').then((r) =>
            r.ok ? r.json() : fetch('/data/z_module_manifest.json').then((x) => x.json())
          )
    )
    .then((data) => {
      const modules = data.ZModules || data.modules || [];
      render(modules);
      if (updatedEl) {
        const ts = data.ZUpdatedAt || data.updatedAt || data.updated_at || new Date().toISOString();
        updatedEl.textContent = new Date(ts).toLocaleTimeString();
      }
    })
    .catch(() => render([]));

  fetch(AUDIT_URL, { cache: 'no-store' })
    .then((res) => (res.ok ? res.json() : null))
    .then((audit) => {
      if (!audit) return;
      if (coverageEl) coverageEl.textContent = `${audit.coverage_percent ?? 0}%`;
      if (doneEl) doneEl.textContent = String(audit.done ?? 0);
      if (coverageBadgeEl) {
        const percent = audit.coverage_percent ?? 0;
        coverageBadgeEl.textContent = `Coverage: ${percent}%`;
        coverageBadgeEl.classList.remove('edge-status-good', 'edge-status-warn', 'edge-status-bad');
        if (percent >= 60) {
          coverageBadgeEl.classList.add('edge-status-good');
        } else if (percent >= 30) {
          coverageBadgeEl.classList.add('edge-status-warn');
        } else {
          coverageBadgeEl.classList.add('edge-status-bad');
        }
      }
      if (auditUpdatedEl) {
        const ts = audit.generated_at || audit.generatedAt || new Date().toISOString();
        auditUpdatedEl.textContent = new Date(ts).toLocaleTimeString();
      }
    })
    .catch(() => {
      if (coverageEl) coverageEl.textContent = '—';
      if (doneEl) doneEl.textContent = '—';
      if (coverageBadgeEl) {
        coverageBadgeEl.textContent = 'Coverage: --';
        coverageBadgeEl.classList.remove('edge-status-good', 'edge-status-warn', 'edge-status-bad');
      }
      if (auditUpdatedEl) auditUpdatedEl.textContent = '--';
    });
})();
