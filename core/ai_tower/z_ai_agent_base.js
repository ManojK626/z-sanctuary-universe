// Z: core\ai_tower\z_ai_agent_base.js
// Base AI agent factory for Z-AI Tower.
function recordReplay(entry) {
  const replay = window.ZAutopilotReplay;
  if (!replay) return;
  if (typeof replay.record === 'function') {
    replay.record(entry);
    return;
  }
  if (typeof replay.log === 'function') {
    replay.log(entry);
  }
}

export function createAIAgent(config) {
  if (!config || !config.id) {
    throw new Error('Agent id required');
  }
  const agent = {
    id: config.id,
    owner: config.owner || 'AI Tower',
    description: config.description || '',
    status: config.status || 'active',
    act(context) {
      if (window.ZAITower?.frozen) {
        console.log(`Agent ${config.id} paused (tower frozen)`);
        recordReplay({
          agent: config.id,
          action: 'paused',
          reason: 'AI Tower frozen by governance',
          context,
          governance: { skk: 'approved', rkpk: 'approved' },
        });
        return null;
      }
      const decision = typeof config.act === 'function' ? config.act(context) : null;
      recordReplay({
        agent: config.id,
        action: decision?.suggestion || decision?.action || (decision ? 'action' : 'no_action'),
        reason: decision?.reason || 'No explicit reason provided',
        context,
        governance: { skk: 'approved', rkpk: 'approved' },
      });
      window.ZAITower?.log?.(`${config.id} decision recorded`);
      return decision;
    },
  };

  window.ZAITower?.registerAgent(agent);
  return agent;
}
