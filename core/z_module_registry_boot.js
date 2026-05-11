// Z: core\z_module_registry_boot.js
// Registers core modules with the Z-Sanctuary Module Registry.
(function () {
  function statusFor(ref) {
    return ref ? 'online' : 'offline';
  }

  function registerCore() {
    if (!window.ZModuleRegistry) return;

    window.ZModuleRegistry.register({
      id: 'core-dashboard',
      layer: 'core',
      owner: 'SKK',
      status: statusFor(window.ZDashboard),
      description: 'Sanctuary dashboard runtime and analytics.',
    });

    window.ZModuleRegistry.register({
      id: 'core-status-console',
      layer: 'core',
      owner: 'SKK',
      status: statusFor(window.ZStatusConsole),
      description: 'System status console + log router.',
    });

    window.ZModuleRegistry.register({
      id: 'core-energy-response',
      layer: 'core',
      owner: 'SKK',
      status: statusFor(window.ZEnergyResponse),
      description: 'Energy and harmony pulse engine.',
    });

    window.ZModuleRegistry.register({
      id: 'core-emotion-filter',
      layer: 'core',
      owner: 'SKK',
      status: statusFor(window.ZEmotionFilter),
      description: 'Emotional coherence and mode filter.',
    });

    window.ZModuleRegistry.register({
      id: 'core-chronicle',
      layer: 'core',
      owner: 'SKK',
      status: statusFor(window.ZChronicle),
      description: 'Chronicle capture and timeline memory.',
    });

    window.ZModuleRegistry.register({
      id: 'core-chronicle-hud',
      layer: 'core',
      owner: 'SKK',
      status: statusFor(window.ZChronicleHUD),
      description: 'Chronicle HUD display layer.',
    });

    window.ZModuleRegistry.register({
      id: 'core-module-registry',
      layer: 'core',
      owner: 'SKK',
      status: statusFor(window.ZModuleRegistry),
      description: 'Module registry and visibility layer.',
    });

    window.ZModuleRegistry.register({
      id: 'z-gadget-mirrors',
      layer: 'technology-intelligence',
      owner: 'SKK+RKPK',
      status: 'active',
      description:
        'Deterministic device-switching intelligence module (local-first, auditable, no OS emulation).',
      governance: 'SKK+RKPK',
    });

    window.ZModuleRegistry.register({
      id: 'autopilot-engine',
      layer: 'core',
      owner: 'SKK',
      status: statusFor(window.ZAutoPilot),
      description: 'Super Saiyan Autopilot control plane.',
    });

    window.ZModuleRegistry.register({
      id: 'autopilot-replay',
      layer: 'governance',
      owner: 'SKK',
      status: statusFor(window.ZAutopilotReplay),
      description: 'Explainable Autopilot replay and trace log.',
      chainTo: ['dependency-graph', 'autopilot-simulation'],
    });

    window.ZModuleRegistry.register({
      id: 'autopilot-simulation',
      layer: 'governance',
      owner: 'RKPK',
      status: statusFor(window.ZSim),
      description: 'Simulation mode for safe testing.',
      chainTo: ['dependency-graph'],
    });

    window.ZModuleRegistry.register({
      id: 'dependency-graph',
      layer: 'governance',
      owner: 'SKK+RKPK',
      status: statusFor(window.ZChainView),
      description: 'Chain view and dependency graph overlay.',
      chainTo: ['governance-report'],
    });

    window.ZModuleRegistry.register({
      id: 'governance-report',
      layer: 'governance',
      owner: 'SKK',
      status: statusFor(window.ZGovernanceReport),
      description: 'Weekly governance reports and summaries.',
      chainTo: ['governance-review'],
    });

    window.ZModuleRegistry.register({
      id: 'governance-review',
      layer: 'governance',
      owner: 'SKK+RKPK',
      status: statusFor(window.ZGovernanceReview),
      description: 'Companion-guided governance review.',
    });

    window.ZModuleRegistry.register({
      id: 'sepc-governance',
      layer: 'governance',
      owner: 'SKK+RKPK',
      status: 'active',
      description: 'Security, Etiquette, Protocol & Compassion gate.',
    });

    window.ZModuleRegistry.register({
      id: 'skk-companion',
      layer: 'ai-companion',
      owner: 'SKK',
      status: 'active',
      description: 'Wisdom, structure, and lawful stability.',
    });

    window.ZModuleRegistry.register({
      id: 'rkpk-companion',
      layer: 'ai-companion',
      owner: 'RKPK',
      status: 'active',
      description: 'Compassion, gentle resolution, human care.',
    });

    window.ZModuleRegistry.register({
      id: 'ai-tower',
      layer: 'ai-tower',
      owner: 'SKK+RKPK',
      status: window.ZAITower ? 'online' : 'initializing',
      description: 'Multi-agent reasoning and oversight tower.',
    });

    const botEntries = [
      {
        id: 'ai-agent-scribe',
        owner: 'SKK',
        description: 'Records logs, summaries, and reflections.',
        online: Boolean(window.ZScribeBot),
      },
      {
        id: 'ai-agent-protector',
        owner: 'SKK',
        description: 'Security and runtime monitor.',
        online: Boolean(window.ZProtectorBot),
      },
      {
        id: 'ai-agent-designer',
        owner: 'RKPK',
        description: 'UI and style advisor.',
        online: Boolean(window.ZDesignerBot),
      },
      {
        id: 'ai-agent-navigator',
        owner: 'SKK',
        description: 'Suggests next safe steps.',
        online: Boolean(window.ZNavigatorBot),
      },
    ];

    botEntries.forEach((bot) => {
      window.ZModuleRegistry.register({
        id: bot.id,
        layer: 'ai-agent',
        owner: bot.owner,
        status: bot.online ? 'active' : 'offline',
        description: bot.description,
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', registerCore);
  } else {
    registerCore();
  }
})();
