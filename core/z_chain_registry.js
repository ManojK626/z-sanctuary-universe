// Z: core\z_chain_registry.js
// Chain registry: edges, ethics, explanations, alternatives.
(function () {
  const edges = [
    {
      source: 'autopilot-replay',
      target: 'dependency-graph',
      explain: {
        skk: 'Replay feeds evidence into the dependency graph so governance decisions are based on observed behavior.',
      },
      ethics: {
        transparency: 0.9,
        reversibility: 0.8,
        humanImpact: 0.7,
        escalationRisk: 0.3,
      },
      alternatives: [
        {
          path: ['autopilot-replay', 'autopilot-simulation', 'dependency-graph'],
          reason: 'Simulation allows safe exploration before graph impact.',
        },
      ],
    },
    {
      source: 'autopilot-replay',
      target: 'autopilot-simulation',
      explain: {
        skk: 'Replay can branch into simulation to test risky decisions safely.',
      },
      ethics: {
        transparency: 0.95,
        reversibility: 0.95,
        humanImpact: 0.85,
        escalationRisk: 0.2,
      },
    },
    {
      source: 'autopilot-simulation',
      target: 'dependency-graph',
      explain: {
        skk: 'Simulation results inform the dependency graph without touching live state.',
      },
      ethics: {
        transparency: 0.85,
        reversibility: 0.9,
        humanImpact: 0.8,
        escalationRisk: 0.25,
      },
    },
    {
      source: 'dependency-graph',
      target: 'governance-report',
      explain: {
        skk: 'The graph aggregates relationships into weekly governance summaries.',
      },
      ethics: {
        transparency: 0.8,
        reversibility: 0.7,
        humanImpact: 0.75,
        escalationRisk: 0.35,
      },
    },
    {
      source: 'governance-report',
      target: 'governance-review',
      explain: {
        skk: 'Reports feed companion-guided governance reviews for balanced reflection.',
      },
      ethics: {
        transparency: 0.85,
        reversibility: 0.9,
        humanImpact: 0.9,
        escalationRisk: 0.2,
      },
    },
  ];

  function edgeId(edge) {
    return `${edge.source}->${edge.target}`;
  }

  function getEdges() {
    return edges.map((edge) => ({ ...edge, id: edgeId(edge) }));
  }

  function getEdge(source, target) {
    return edges.find((edge) => edge.source === source && edge.target === target);
  }

  function buildPathNarrative(pathEdges) {
    return pathEdges
      .map((edge) => edge.explain?.skk)
      .filter(Boolean)
      .join(' ');
  }

  function updateRegistry() {
    if (!window.ZModuleRegistry) return;
    const chainMap = {};
    edges.forEach((edge) => {
      if (!chainMap[edge.source]) chainMap[edge.source] = [];
      chainMap[edge.source].push(edge.target);
    });
    Object.entries(chainMap).forEach(([source, targets]) => {
      window.ZModuleRegistry.register({
        id: source,
        chainTo: targets,
      });
    });
  }

  window.ZChainRegistry = {
    getEdges,
    getEdge,
    edgeId,
    buildPathNarrative,
    updateRegistry,
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateRegistry);
  } else {
    updateRegistry();
  }
})();
