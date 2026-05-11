// Z: Amk_Goku Worldwide Loterry\education\learning_registry.js
// Learning Registry (read-only)
(function () {
  const REGISTRY_PATH = 'data/learning/learning_cards.json';
  let registry = {};

  async function loadRegistry() {
    try {
      const res = await fetch(REGISTRY_PATH, { cache: 'no-store' });
      if (!res.ok) return {};
      const payload = await res.json();
      const cards = payload.cards || [];
      registry = Object.fromEntries(cards.map((card) => [card.id, card]));
      return registry;
    } catch {
      return {};
    }
  }

  function get(id) {
    return registry[id];
  }

  window.ZLearningRegistry = registry;
  window.ZLearningRegistryLoad = loadRegistry;
  window.ZLearningRegistryGet = get;
})();
