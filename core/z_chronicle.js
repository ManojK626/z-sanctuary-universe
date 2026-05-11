// Z: core\z_chronicle.js
(function () {
  const STORE_KEY = 'zChronicle.events';
  const MAX_EVENTS = 500;

  function load() {
    try {
      return JSON.parse(localStorage.getItem(STORE_KEY)) || [];
    } catch {
      return [];
    }
  }

  function save(events) {
    localStorage.setItem(STORE_KEY, JSON.stringify(events.slice(-MAX_EVENTS)));
  }

  function record(event) {
    const events = load();
    const entry = {
      ts: new Date().toISOString(),
      ...event,
    };
    events.push(entry);
    save(events);
    return entry;
  }

  window.ZChronicle = {
    record,
    all: load,
    clear() {
      localStorage.removeItem(STORE_KEY);
    },
  };
})();
