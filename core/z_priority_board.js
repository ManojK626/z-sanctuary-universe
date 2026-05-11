// Z: core\z_priority_board.js
// Priority Board: merges manual queue + codex repeat blockers.
(function () {
  const listEl = document.getElementById('zPriorityList');
  const updatedEl = document.getElementById('zPriorityUpdated');
  const openCountEl = document.getElementById('zPriorityOpenCount');
  const p1CountEl = document.getElementById('zPriorityP1Count');
  const auditTotalEl = document.getElementById('zPriorityAuditTotal');
  const auditOpenEl = document.getElementById('zPriorityAuditOpen');
  const auditP1El = document.getElementById('zPriorityAuditP1');
  const auditUpdatedEl = document.getElementById('zPriorityAuditUpdated');
  const priorityBadgeEl = document.getElementById('zPriorityOpenBadge');

  if (!listEl) return;

  const QUEUE_URL = '/data/Z_priority_queue.json';
  const CODEX_URL = '/data/Z_codex_report.json';
  const AUDIT_URL = '/data/reports/z_priority_audit.json';

  const priorityWeight = {
    P0: 0,
    P1: 1,
    P2: 2,
    P3: 3,
  };

  const statusWeight = {
    open: 0,
    in_progress: 1,
    blocked: 2,
    done: 3,
  };

  function normalizeQueue(queue) {
    const rawItems = Array.isArray(queue.ZItems)
      ? queue.ZItems
      : Array.isArray(queue.items)
        ? queue.items
        : [];
    const items = rawItems.map((item) => ({
      id: item.ZId || item.id,
      title: item.ZTitle || item.title,
      priority: item.ZPriority || item.priority,
      status: item.ZStatus || item.status,
      source: item.ZSource || item.source,
      tags: item.ZTags || item.tags,
      createdAt: item.ZCreatedAt || item.createdAt,
    }));
    return {
      updatedAt: queue.ZUpdatedAt || queue.updatedAt || '',
      items,
    };
  }

  function codexBlockers(report) {
    const repeaters = Array.isArray(report.ZRepeatIssues)
      ? report.ZRepeatIssues
      : Array.isArray(report.repeatIssues)
        ? report.repeatIssues
        : Array.isArray(report.ZIssues)
          ? report.ZIssues
          : Array.isArray(report.issues)
            ? report.issues
            : [];
    return repeaters.map((issue, idx) => {
      const code =
        issue.ZCode || issue.code || issue.ZRule || issue.rule || issue.id || `repeat-${idx + 1}`;
      const title =
        issue.ZMessage ||
        issue.message ||
        issue.ZTitle ||
        issue.title ||
        issue.ZRule ||
        issue.rule ||
        'Repeat issue';
      return {
        id: `codex:${code}`,
        title: `Repeat: ${title}`,
        priority: 'P1',
        status: 'open',
        source: 'codex',
        tags: issue.tags || ['codex'],
        createdAt: issue.firstSeen || '',
      };
    });
  }

  function mergeItems(queueItems, blockers) {
    const seen = new Set();
    const merged = [];
    queueItems.concat(blockers).forEach((item) => {
      if (!item || !item.id) return;
      if (seen.has(item.id)) return;
      seen.add(item.id);
      merged.push(item);
    });
    return merged;
  }

  function sortItems(items) {
    return items.slice().sort((a, b) => {
      const pA = priorityWeight[a.priority] ?? 9;
      const pB = priorityWeight[b.priority] ?? 9;
      if (pA !== pB) return pA - pB;
      const sA = statusWeight[a.status] ?? 9;
      const sB = statusWeight[b.status] ?? 9;
      if (sA !== sB) return sA - sB;
      const tA = a.createdAt || '';
      const tB = b.createdAt || '';
      return tA.localeCompare(tB);
    });
  }

  function openReplayFor(item) {
    const query = item.id || item.title || '';
    window.ZLayoutOS?.revealPanel?.('zAutopilotReplayPanel', {
      userInitiated: true,
      intent: 'attention',
      label: 'Autopilot Replay',
    });
    if (window.ZAutopilotReplayUI?.focusByQuery) {
      window.ZAutopilotReplayUI.focusByQuery(query);
    }
  }

  function render(items) {
    listEl.innerHTML = '';
    if (!items.length) {
      const empty = document.createElement('li');
      empty.className = 'z-muted';
      empty.textContent = 'No priority items yet.';
      listEl.appendChild(empty);
      return;
    }
    items.forEach((item) => {
      const li = document.createElement('li');
      li.className = `z-priority-item z-priority-${item.status || 'open'}`;
      const badge = document.createElement('span');
      badge.className = `z-priority-badge z-priority-${item.priority || 'P3'}`;
      badge.textContent = item.priority || 'P3';
      const title = document.createElement('span');
      title.className = 'z-priority-title';
      title.textContent = item.title || item.id;
      const meta = document.createElement('span');
      meta.className = 'z-priority-meta';
      const source = item.source ? ` | ${item.source}` : '';
      meta.textContent = `${item.id}${source}`;
      if ((item.status || '') === 'done') {
        li.classList.add('z-priority-done');
      }
      const canPromote = item.priority !== 'P0' && (item.status || 'open') !== 'done';
      li.appendChild(badge);
      li.appendChild(title);
      li.appendChild(meta);
      const openReplay = document.createElement('button');
      openReplay.className = 'z-priority-action';
      openReplay.type = 'button';
      openReplay.textContent = 'Open Replay';
      openReplay.addEventListener('click', () => {
        openReplayFor(item);
      });
      li.appendChild(openReplay);

      if (canPromote) {
        const promote = document.createElement('button');
        promote.className = 'z-priority-action';
        promote.type = 'button';
        promote.textContent = 'Promote P0';
        promote.addEventListener('click', async () => {
          const cmd = `npm run priority -- promote ${item.id} --priority P0`;
          try {
            await navigator.clipboard.writeText(cmd);
            if (window.ZStatusConsole?.log) {
              window.ZStatusConsole.log(`[PRIORITY] Copied: ${cmd}`, 'active');
            }
          } catch (err) {
            window.prompt('Copy this command:', cmd);
          }
        });
        li.appendChild(promote);
      }
      listEl.appendChild(li);
    });
  }

  function updateCounts(items) {
    const openCount = items.filter((item) => (item.status || 'open') !== 'done').length;
    const p1Count = items.filter(
      (item) => (item.priority || '') === 'P1' && item.status !== 'done'
    ).length;
    if (openCountEl) openCountEl.textContent = String(openCount);
    if (p1CountEl) p1CountEl.textContent = String(p1Count);
  }

  async function refresh() {
    let queue = { updatedAt: '', items: [] };
    let codex = { repeatIssues: [] };
    let audit = null;

    try {
      let resp = await fetch(QUEUE_URL, { cache: 'no-store' });
      if (!resp.ok) {
        resp = await fetch('/data/z_priority_queue.json', { cache: 'no-store' });
      }
      if (resp.ok) queue = await resp.json();
    } catch {
      queue = { updatedAt: '', items: [] };
    }

    try {
      let resp = await fetch(CODEX_URL, { cache: 'no-store' });
      if (!resp.ok) {
        resp = await fetch('/data/z_codex_report.json', { cache: 'no-store' });
      }
      if (resp.ok) codex = await resp.json();
    } catch {
      codex = { repeatIssues: [] };
    }

    try {
      let resp = await fetch(AUDIT_URL, { cache: 'no-store' });
      if (!resp.ok) {
        resp = await fetch('/data/reports/z_priority_audit.json', { cache: 'no-store' });
      }
      if (resp.ok) audit = await resp.json();
    } catch {
      audit = null;
    }

    const normalized = normalizeQueue(queue);
    const blockers = codexBlockers(codex);
    const merged = mergeItems(normalized.items, blockers);
    const sorted = sortItems(merged);
    render(sorted);
    updateCounts(sorted);
    if (updatedEl) {
      const ts = normalized.updatedAt || new Date().toISOString();
      updatedEl.textContent = new Date(ts).toLocaleTimeString();
    }
    if (audit) {
      if (auditTotalEl) auditTotalEl.textContent = String(audit.total ?? '—');
      if (auditOpenEl) auditOpenEl.textContent = String(audit.open ?? '—');
      if (auditP1El) auditP1El.textContent = String(audit.by_priority?.P1 ?? 0);
      if (priorityBadgeEl) {
        const openCount = audit.open ?? '—';
        priorityBadgeEl.textContent = `Priority: ${openCount}`;
        priorityBadgeEl.classList.remove('edge-status-good', 'edge-status-warn', 'edge-status-bad');
        if (typeof openCount === 'number') {
          if (openCount <= 5) {
            priorityBadgeEl.classList.add('edge-status-good');
          } else if (openCount <= 12) {
            priorityBadgeEl.classList.add('edge-status-warn');
          } else {
            priorityBadgeEl.classList.add('edge-status-bad');
          }
        }
      }
      if (auditUpdatedEl) {
        const ts = audit.generated_at || audit.generatedAt || new Date().toISOString();
        auditUpdatedEl.textContent = new Date(ts).toLocaleTimeString();
      }
    } else {
      if (auditTotalEl) auditTotalEl.textContent = '—';
      if (auditOpenEl) auditOpenEl.textContent = '—';
      if (auditP1El) auditP1El.textContent = '—';
      if (priorityBadgeEl) {
        priorityBadgeEl.textContent = 'Priority: --';
        priorityBadgeEl.classList.remove('edge-status-good', 'edge-status-warn', 'edge-status-bad');
      }
      if (auditUpdatedEl) auditUpdatedEl.textContent = '--';
    }
  }

  refresh();
  setInterval(refresh, 20000);
})();
