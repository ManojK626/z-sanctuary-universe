// Z: core/z_ai_status_check.js
// Live AI Status checker for Insight Lab panel.
(function () {
  const btn = document.getElementById('zLiveAiStatusBtn');
  const exportBtn = document.getElementById('zLiveAiStatusExportBtn');
  const out = document.getElementById('zLiveAiStatusOutput');
  if (!btn || !out) return;

  function line(label, value) {
    return `${label}: ${value}`;
  }

  function getAgentIds() {
    const registry = window.ZModuleRegistry?.modules || {};
    return Object.keys(registry).filter((id) => id.startsWith('ai-agent-'));
  }

  function buildSnapshot() {
    const towerStatus = window.ZAITower?.status || 'offline';
    const towerFrozen = window.ZAITower?.frozen ? 'yes' : 'no';

    const bots = {
      scribe: !!window.ZScribeBot,
      protector: !!window.ZProtectorBot,
      designer: !!window.ZDesignerBot,
      navigator: !!window.ZNavigatorBot,
    };

    const ghostReady = typeof window.ZSuperGhost?.getInsight === 'function';
    const agents = getAgentIds();
    return {
      ts: new Date().toISOString(),
      tower: {
        status: towerStatus,
        frozen: towerFrozen,
      },
      superGhost: ghostReady ? 'OK' : 'Missing',
      miniai: {
        scribe: bots.scribe ? 'OK' : 'Missing',
        protector: bots.protector ? 'OK' : 'Missing',
        designer: bots.designer ? 'OK' : 'Missing',
        navigator: bots.navigator ? 'OK' : 'Missing',
      },
      agents: agents.length ? agents : [],
    };
  }

  function render(snapshot) {
    const lines = [
      'Zuno AI — Live Status',
      `Time: ${new Date(snapshot.ts).toLocaleString()}`,
      line('AI Tower', snapshot.tower.status),
      line('Tower Frozen', snapshot.tower.frozen),
      line('Super Ghost', snapshot.superGhost),
      line('MiniAI Scribe', snapshot.miniai.scribe),
      line('MiniAI Protector', snapshot.miniai.protector),
      line('MiniAI Designer', snapshot.miniai.designer),
      line('MiniAI Navigator', snapshot.miniai.navigator),
      line('Agents Registered', snapshot.agents.length ? snapshot.agents.join(', ') : 'none'),
    ];

    out.textContent = lines.join('\n');
  }

  function run() {
    const snapshot = buildSnapshot();
    render(snapshot);

    if (window.ZChronicle?.write) {
      window.ZChronicle.write({ type: 'ai.status.snapshot', ...snapshot });
    }

    if (window.ZInsightFeed?.push) {
      window.ZInsightFeed.push({
        id: `ai-status-${Date.now()}`,
        channel: 'status',
        source: 'ai-status-check',
        summary: 'AI status snapshot recorded.',
        metadata: snapshot,
      });
    }
  }

  btn.addEventListener('click', run);
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      const snapshot = buildSnapshot();
      const blob = new Blob([JSON.stringify(snapshot, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `z_ai_status_${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      render(snapshot);
    });
  }
  setInterval(run, 60000);
})();
