// Z: core\ai_tower\z_ai_tower_core.js
// Z-Sanctuary AI Tower Core
(function () {
  const tower = {
    status: 'initializing',
    agents: {},
    frozen: false,
    formulaRegistry: null,
    init() {
      if (window.ZModuleRegistry) {
        window.ZModuleRegistry.register({
          id: 'ai-tower',
          layer: 'ai-tower',
          owner: 'SKK+RKPK',
          status: 'online',
          description: 'Multi-agent reasoning and oversight tower.',
        });
      }
      this.status = 'online';
      this.loadFormulaRegistry();
      this.log('AI Tower initialized');
    },
    async loadFormulaRegistry() {
      try {
        const resp = await fetch('rules/Z_FORMULA_REGISTRY.json', { cache: 'no-store' });
        if (!resp.ok) throw new Error('Registry unavailable');
        this.formulaRegistry = await resp.json();
        window.ZChronicle?.write?.({
          type: 'z.formula.registry_loaded',
          ts: new Date().toISOString(),
        });
      } catch (err) {
        this.formulaRegistry = { status: 'unavailable', error: err.message };
      }
    },
    getFormulaRegistry() {
      return this.formulaRegistry;
    },
    freeze(reason = 'Governance check') {
      this.frozen = true;
      this.status = 'frozen';
      this.log(`Tower frozen: ${reason}`);
      window.ZModuleRegistry?.update('ai-tower', { status: 'frozen' });
    },
    resume() {
      this.frozen = false;
      this.status = 'online';
      this.log('Tower resumed');
      window.ZModuleRegistry?.update('ai-tower', { status: 'online' });
    },
    registerAgent(agent) {
      if (!agent || !agent.id) return;
      this.agents[agent.id] = agent;
      window.ZModuleRegistry?.register({
        id: `ai-agent-${agent.id}`,
        layer: 'ai-agent',
        owner: agent.owner || 'AI Tower',
        status: agent.status || 'active',
        description: agent.description || 'AI agent',
      });
      this.log(`Agent registered: ${agent.id}`);
    },
    runAllAgents(context = {}, options = {}) {
      const dryRun = Boolean(options.dryRun);
      Object.values(this.agents).forEach((agent) => {
        if (!agent || typeof agent.act !== 'function') return;
        if (this.frozen) {
          this.log(`Agent ${agent.id} paused (tower frozen)`);
          return;
        }
        const decision = agent.act({ ...context, dryRun });
        if (!dryRun && typeof agent.execute === 'function' && decision) {
          agent.execute(decision, context);
        }
      });
    },
    log(message) {
      console.log(`AI Tower: ${message}`);
    },
  };

  window.ZAITower = tower;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => tower.init());
  } else {
    tower.init();
  }
})();
