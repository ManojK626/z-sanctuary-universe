// Z: core\safe_pack_engine.js
(function () {
  const STORAGE_KEY = 'zSafePacks';
  const WEBHOOK_KEY = 'zSafePackWebhookHistory';
  const MAX_HISTORY = 100;
  const ALLOWLIST = {
    markdownlint: ['MD009', 'MD022', 'MD024', 'MD032'],
    eslint: ['no-unused-vars'],
    moduleHealth: ['module-health-update'],
  };

  let webhookConfig = { enabled: false, url: '' };
  const moduleHealthState = {};

  function loadPacks() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      return [];
    }
  }

  function savePacks(packs) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(packs.slice(-MAX_HISTORY)));
  }

  function isSafePack(pack) {
    if (!pack || pack.class !== 'safe') return false;
    if (pack.reversible === false || pack.touchesLogic) return false;
    const family = ALLOWLIST[pack.family];
    return !!family && family.includes(pack.rule);
  }

  function notifyWebhookStatus(status = 'disabled') {
    const node = document.getElementById('zSafePackWebhookStatus');
    if (!node) return;
    if (webhookConfig.enabled && webhookConfig.url) {
      node.textContent = `Webhook: ${status}`;
      node.setAttribute('data-status', status);
    } else {
      node.textContent = 'Webhook disabled.';
      node.setAttribute('data-status', 'disabled');
    }
  }

  function getWebhookHistory() {
    const raw = localStorage.getItem(WEBHOOK_KEY);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      localStorage.removeItem(WEBHOOK_KEY);
      return [];
    }
  }

  function logWebhookHistory(entry) {
    const history = getWebhookHistory();
    const payload = entry.payload || {};
    const record = {
      ts: new Date().toISOString(),
      status: entry.status,
      event: entry.event || payload.event || 'webhook',
      detail: payload.pack?.rule || payload.description || '',
    };
    history.push(record);
    localStorage.setItem(WEBHOOK_KEY, JSON.stringify(history.slice(-20)));
    const list = document.getElementById('zSafePackWebhookHistory');
    if (list) {
      list.innerHTML = history
        .slice(-10)
        .reverse()
        .map(
          (item) =>
            `<div class="z-webhook-row"><span>${item.ts}</span><span>${item.event}</span><span>${item.status}</span><span>${item.detail}</span></div>`
        )
        .join('');
    }
    return history;
  }

  async function sendWebhook(payload, attempt = 1) {
    if (!webhookConfig.enabled || !webhookConfig.url) return;
    const max = 3;
    try {
      const res = await fetch(webhookConfig.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const status = res.ok ? 'ok' : `error:${res.status}`;
      notifyWebhookStatus(status);
      logWebhookHistory({ status, payload });
      return true;
    } catch (err) {
      logWebhookHistory({ status: 'error', payload });
      if (attempt < max) {
        const delay = 500 * attempt;
        await new Promise((resolve) => setTimeout(resolve, delay));
        return sendWebhook(payload, attempt + 1);
      }
      notifyWebhookStatus('error');
      return false;
    }
  }

  async function loadWebhookConfig() {
    try {
      const res = await fetch('/data/safe_pack_webhook.json', { cache: 'no-store' });
      if (!res.ok) throw new Error('missing webhook config');
      webhookConfig = await res.json();
    } catch {
      webhookConfig = { enabled: false, url: '' };
    }
    notifyWebhookStatus();
    const payload = { enabled: webhookConfig.enabled };
    logWebhookHistory({ status: 'synced', event: 'webhook.sync', payload });
  }

  async function exportWebhookHistory() {
    const history = getWebhookHistory();
    if (!history.length) return null;
    const payload = { event: 'safe_pack.webhook_history_export', data: history };
    logWebhookHistory({ status: 'exported', event: payload.event, payload });
    sendWebhook(payload);
    window.ZSuperGhost?.ingest?.({ type: 'z.safe_pack.export', payload });
    return history;
  }

  function tracePack(pack, status) {
    const entry = {
      id: pack.id,
      file: pack.file,
      rule: pack.rule,
      family: pack.family,
      status,
      ts: new Date().toISOString(),
    };
    const packs = loadPacks();
    if (status === 'rollback') {
      const remaining = packs.filter((p) => p.id !== pack.id);
      savePacks(remaining);
    } else {
      packs.push(entry);
      savePacks(packs);
    }
    window.ZChronicle?.write?.({ type: `z.safe_pack.${status}`, pack: entry });
    sendWebhook({ event: `safe_pack.${status}`, pack: entry });
    return entry;
  }

  function addPack(pack) {
    return tracePack(pack, 'applied');
  }

  function rollbackPack(packId) {
    const packs = loadPacks();
    const pack = packs.find((p) => p.id === packId) || { id: packId };
    return tracePack(pack, 'rollback');
  }

  function updateModuleHealth(id, status, metadata = {}) {
    moduleHealthState[id] = {
      id,
      status,
      metadata,
      ts: new Date().toISOString(),
    };
    window.ZChronicle?.write?.({ type: 'z.module_health.update', module: moduleHealthState[id] });
    sendWebhook({ event: 'module_health.update', module: moduleHealthState[id] });
    return moduleHealthState[id];
  }

  window.ZSafePack = window.ZSafePack || {};
  window.ZSafePack.list = () => loadPacks();
  window.ZSafePack.applyPack = function (pack) {
    if (!isSafePack(pack)) return null;
    return addPack(pack);
  };
  window.ZSafePack.rollback = function (packId) {
    return rollbackPack(packId);
  };
  window.ZSafePack.getSummary = function () {
    const packs = loadPacks();
    return {
      total: packs.length,
      applied: packs.filter((p) => p.status === 'applied').length,
      rollback: packs.filter((p) => p.status === 'rollback').length,
    };
  };
  window.ZSafePack.getWebhookHistory = getWebhookHistory;
  window.ZSafePack.getModuleHealth = () => ({ ...moduleHealthState });
  window.ZSafePack.updateModuleHealth = updateModuleHealth;
  window.ZSafePack.notifyWebhookStatus = notifyWebhookStatus;
  window.ZSafePack.exportWebhookHistory = exportWebhookHistory;

  loadWebhookConfig();
})();
