// Z: Amk_Goku Worldwide Loterry\exports\lottery_app_pack_20260131T150734Z\core\z_chronicle.js
// Z-Chronicle (v1) — append-only local log
// Read-only by default; safe for UI observers.

(function () {
  const KEY = 'zChronicle.v1';
  const MAX = 2000;

  function load() {
    try {
      return JSON.parse(localStorage.getItem(KEY)) || [];
    } catch {
      return [];
    }
  }

  function save(items) {
    localStorage.setItem(KEY, JSON.stringify(items.slice(-MAX)));
  }

  function record(entry = {}) {
    const items = load();
    const evt = { ts: new Date().toISOString(), ...entry };
    items.push(evt);
    save(items);
    return evt;
  }

  function all() {
    return load();
  }

  function recent(seconds = 3600) {
    const cutoff = Date.now() - seconds * 1000;
    return load().filter((e) => Date.parse(e.ts || '') >= cutoff);
  }

  window.ZChronicle = { record, all, recent };
})();
