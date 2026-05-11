// Z: core/z_ai_status_export.js
// AI status export for Zuno AI reports (read-only, no execution authority).
(function () {
  const EXPORT_INTERVAL_MS = 60_000;

  function collectAgents() {
    const tower = window.ZAITower;
    const agents = tower?.agents ? Object.values(tower.agents) : [];
    if (!agents.length) return [];
    return agents.map((agent) => ({
      id: agent.id || agent.key || 'unknown',
      owner: agent.owner || 'AI Tower',
      status: agent.status || 'unknown',
      lastPulse: agent.lastPulse || null,
    }));
  }

  function collectBots() {
    const bots = [
      window.ZScribeBot,
      window.ZProtectorBot,
      window.ZDesignerBot,
      window.ZNavigatorBot,
    ];
    return bots.map((bot) => ({
      name: bot?.name || 'unknown',
      online: Boolean(bot && typeof bot.init === 'function'),
    }));
  }

  function buildSnapshot() {
    const tower = window.ZAITower;
    return {
      generated_at: new Date().toISOString(),
      ai_tower: {
        status: tower?.status || (tower?.frozen ? 'frozen' : 'unknown'),
        frozen: Boolean(tower?.frozen),
        agent_count: tower?.agents?.length || 0,
      },
      agents: collectAgents(),
      miniai: collectBots(),
      notes: 'Observational only. No execution authority.',
    };
  }

  function exportSnapshot() {
    const snapshot = buildSnapshot();
    try {
      const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'z_ai_status.json';
      link.click();
      URL.revokeObjectURL(link.href);
    } catch {
      // Silent fallback if Blob or download not available.
    }

    // Chronicle echo (if available)
    if (window.ZChronicle?.write) {
      window.ZChronicle.write({ type: 'z.ai_status.snapshot', payload: snapshot });
    }
    return snapshot;
  }

  function tick() {
    // Soft export to in-memory only; UI can call exportSnapshot for file.
    window.ZAIStatusLatest = buildSnapshot();
  }

  function start() {
    tick();
    setInterval(tick, EXPORT_INTERVAL_MS);
  }

  window.ZAIStatus = {
    exportSnapshot,
    getLatest: () => window.ZAIStatusLatest || null,
    start,
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
