// Z: core\insight_cards.js
(function () {
  const container = document.getElementById('zInsightCards');
  if (!container) return;

  function createCard(title, value, detail) {
    const card = document.createElement('div');
    card.className = 'z-insight-card';
    const header = document.createElement('h4');
    header.textContent = title;
    const body = document.createElement('p');
    body.textContent = value;
    const meta = document.createElement('span');
    meta.className = 'z-insight-meta';
    meta.textContent = detail;
    card.appendChild(header);
    card.appendChild(body);
    card.appendChild(meta);
    return card;
  }

  function render() {
    container.innerHTML = '';
    const statusUrls = [
      '../Amk_Goku Worldwide Loterry/data/reports/system_status.json',
      '../Amk_Goku%20Worldwide%20Loterry/data/reports/system_status.json',
    ];
    const safeSummary = window.ZSafePack?.getSummary?.() ?? { total: 0, applied: 0, rollback: 0 };
    container.appendChild(
      createCard(
        'Safe Pack Health',
        `${safeSummary.applied} applied / ${safeSummary.rollback} rollbacks`,
        `${safeSummary.total} total safe actions`
      )
    );
    const webhookStatus = window.ZSafePackStatus?.getLatest?.();
    const webhookHistory = window.ZSafePack?.getWebhookHistory?.() || [];
    if (webhookStatus) {
      container.appendChild(
        createCard(
          'Safe Pack Webhook',
          `Status: ${webhookStatus.status}`,
          `${webhookStatus.event} @ ${new Date(webhookStatus.ts).toLocaleTimeString()}`
        )
      );
    }
    if (window.ZTrustPackChip) {
      container.appendChild(
        createCard(
          'Trust Pack',
          'Reference baseline',
          'Trust Pack status is active in the lens bar'
        )
      );
    }
    if (webhookHistory.length) {
      const counts = webhookHistory.reduce((acc, item) => {
        acc[item.status] = (acc[item.status] || 0) + 1;
        return acc;
      }, {});
      const summary = Object.entries(counts)
        .map(([status, value]) => `${status}: ${value}`)
        .join(' • ');
      container.appendChild(
        createCard('Safe Pack Webhooks', summary, 'Totals from stored history')
      );
    }
    const statusPromises = statusUrls.map((url) =>
      fetch(url, { cache: 'no-store' })
        .then((res) => (res.ok ? res.json() : null))
        .catch(() => null)
    );
    Promise.any(statusPromises)
      .then((status) => {
        if (!status) throw new Error('status unavailable');
        const quiet = status?.quiet_mode;
        const stateLabel = quiet?.active ? 'active' : 'inactive';
        const reason = quiet?.reason || 'n/a';
        const nextReview = quiet?.next_review || 'n/a';
        container.appendChild(
          createCard(
            'Quiet Mode',
            `State: ${stateLabel}`,
            `Reason: ${reason} · Next review: ${nextReview}`
          )
        );
      })
      .catch(() => {
        container.appendChild(createCard('Quiet Mode', 'unknown', 'Status unavailable'));
      });
    fetch('z_workspace/automation_log.json')
      .then((r) => r.json())
      .then((entries) => {
        const last = entries[entries.length - 1];
        if (last) {
          container.appendChild(
            createCard(
              'Automation Log',
              `${last.type} (${last.lens || ''})`,
              `${new Date(last.ts).toLocaleTimeString()} · mode ${last.mode || 'n/a'}`
            )
          );
        }
      })
      .catch(() => {});

    fetch('data/Z_module_manifest.json')
      .then((r) =>
        r.ok ? r.json() : fetch('data/z_module_manifest.json').then((res) => res.json())
      )
      .then((data) => {
        const counts = (data.ZModules || data.modules || []).reduce((acc, module) => {
          const status = (module.ZStatus || module.status || 'unknown').toLowerCase();
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        }, {});
        const statuses = Object.entries(counts)
          .map(([status, count]) => `${status}: ${count}`)
          .join(', ');
        container.appendChild(
          createCard(
            'Module Registry',
            statuses || 'unknown',
            'Live status badges update every 90s'
          )
        );
      })
      .catch(() => {
        container.appendChild(createCard('Module Registry', 'unknown', 'Manifest unavailable'));
      });

    const nextTasks = ['Boot Everything', 'Import Roulette Data', 'Run Doctor'];
    container.appendChild(
      createCard('Upcoming Tasks', nextTasks.join(' • '), 'Run via Ctrl+Shift+P → Run Task')
    );
    const guideCard = createCard(
      'Living Workspace Guide',
      'Open the living workspace brief',
      'Click to open the current briefing doc'
    );
    const guideLink = document.createElement('a');
    guideLink.href = '../docs/Living-Workspace-Brief.md';
    guideLink.target = '_blank';
    guideLink.textContent = 'Open living workspace brief';
    guideLink.style.display = 'inline-block';
    guideLink.style.marginTop = '4px';
    guideLink.className = 'z-link';
    guideCard.appendChild(guideLink);
    container.appendChild(guideCard);
  }

  setInterval(render, 60000);
  render();
})();
