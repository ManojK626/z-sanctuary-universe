// Z: core\z_miniai_boot.js
// Mini-AI Boot
// Initializes bots and connects them to core pulses.

(function () {
  const BOT_INTERVAL_MS = 4000;
  const botDefs = [
    {
      key: 'ScribeBot',
      label: 'S',
      id: 'scribe',
      owner: 'SKK',
      description: 'Records logs, summaries, and reflections.',
      ref: () => window.ZScribeBot,
    },
    {
      key: 'ProtectorBot',
      label: 'P',
      id: 'protector',
      owner: 'SKK',
      description: 'Security and runtime monitor.',
      ref: () => window.ZProtectorBot,
    },
    {
      key: 'DesignerBot',
      label: 'D',
      id: 'designer',
      owner: 'RKPK',
      description: 'UI and style advisor.',
      ref: () => window.ZDesignerBot,
    },
    {
      key: 'NavigatorBot',
      label: 'N',
      id: 'navigator',
      owner: 'SKK',
      description: 'Suggests next safe steps.',
      ref: () => window.ZNavigatorBot,
    },
    {
      key: 'FolderManagerBot',
      label: 'F',
      id: 'folder-manager',
      owner: 'SKK',
      description: 'Protocol-guarded folder/file snapshot + recreate monitor.',
      ref: () => window.ZFolderManagerBot,
    },
  ];

  function renderStatus() {
    const el = document.getElementById('zMiniAiStatus');
    if (!el) return;
    el.textContent = '';
    let onlineCount = 0;
    botDefs.forEach((bot) => {
      const instance = bot.ref();
      const line = document.createElement('div');
      const isOnline = instance && typeof instance.init === 'function';
      if (isOnline) onlineCount += 1;
      line.textContent = `[${bot.label}] ${bot.key}: ${isOnline ? 'online' : 'missing'}`;
      line.className = isOnline ? 'z-status-ok' : 'z-status-warn';
      el.appendChild(line);
    });
    if (onlineCount === 0) {
      const hint = document.createElement('div');
      hint.className = 'z-muted';
      hint.textContent = 'Bots missing. Check Live Server root or /miniai paths.';
      el.appendChild(hint);
    }
  }

  function initBots() {
    const bots = [
      window.ZScribeBot,
      window.ZProtectorBot,
      window.ZDesignerBot,
      window.ZNavigatorBot,
      window.ZFolderManagerBot,
    ];
    bots.forEach((bot) => {
      if (bot && typeof bot.init === 'function') {
        bot.init(bot.name);
      }
      if (bot && typeof bot.start === 'function') {
        bot.start();
      }
    });
    renderStatus();
  }

  function registerAgents() {
    if (!window.ZAITower || typeof window.ZAITower.registerAgent !== 'function') {
      return false;
    }
    botDefs.forEach((bot) => {
      const instance = bot.ref();
      if (!instance) return;
      window.ZAITower.registerAgent({
        id: bot.id,
        owner: bot.owner,
        description: bot.description,
        status: 'active',
        ref: instance,
      });
    });
    return true;
  }

  function refreshPanels(reason) {
    if (window.ZLayoutOS?.autoRefreshPanels) {
      window.ZLayoutOS.autoRefreshPanels(reason);
    }
  }

  function runPulse() {
    if (!window.ZEnergyResponse || !window.ZEmotionFilter) return;
    const state = window.ZEnergyResponse.getState();
    const emotional = window.ZEmotionFilter.getEmotionalState();
    const mode = emotional.mode || window.ZEmotionFilter.evaluateResponseMode();

    if (window.ZScribeBot && typeof window.ZScribeBot.record === 'function') {
      window.ZScribeBot.record(`Mode: ${mode}`, {
        energy: state.energy,
        harmony: state.harmony,
        load: state.load,
      });
    }

    if (window.ZProtectorBot && typeof window.ZProtectorBot.scan === 'function') {
      window.ZProtectorBot.scan(state);
    }

    if (window.ZDesignerBot && typeof window.ZDesignerBot.suggestPalette === 'function') {
      window.ZDesignerBot.suggestPalette(mode);
      refreshPanels('designer_pulse');
    }

    if (window.ZNavigatorBot && typeof window.ZNavigatorBot.suggestNext === 'function') {
      window.ZNavigatorBot.suggestNext(mode);
      refreshPanels('navigator_pulse');
    }

    if (window.ZFolderManagerBot && typeof window.ZFolderManagerBot.sync === 'function') {
      window.ZFolderManagerBot.sync();
    }
  }

  function start() {
    initBots();
    if (!registerAgents()) {
      setTimeout(registerAgents, 1000);
    }
    runPulse();
    setInterval(runPulse, BOT_INTERVAL_MS);
    refreshPanels('miniai_boot');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
