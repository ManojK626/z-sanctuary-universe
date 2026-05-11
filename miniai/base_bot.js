// Z: miniai\base_bot.js
/**
 * BaseBot
 * Shared Mini-AI utilities.
 */
(function () {
  function formatData(data) {
    if (data === undefined) return '';
    if (typeof data === 'string') return data;
    try {
      return JSON.stringify(data);
    } catch (err) {
      return '[unserializable]';
    }
  }

  const MAX_FEED_ITEMS = 5;

  const BaseBot = {
    name: 'BaseBot',
    init(name) {
      this.name = name || this.name;
      this.log('init', 'online', 'active');
      this.log('sepc', 'dual-pass SKK + RKPK active', 'status');
    },
    log(eventType, data, level = 'status') {
      const ts = new Date().toISOString();
      const payload = formatData(data);
      const msg = `[${this.name}:${eventType}] ${ts}${payload ? ' ' + payload : ''}`;
      console.log(msg);
      if (window.ZStatusConsole && typeof window.ZStatusConsole.log === 'function') {
        window.ZStatusConsole.log(msg, level);
      }
      if (window.ZMiniAiFeedPaused) return;
      const feed = typeof document !== 'undefined' ? document.getElementById('zMiniAiFeed') : null;
      if (feed) {
        if (feed.textContent === 'No bot activity yet.') feed.textContent = '';
        const line = document.createElement('div');
        line.className = 'z-mini-feed-item';
        line.textContent = msg;
        feed.prepend(line);
        const items = feed.querySelectorAll('.z-mini-feed-item');
        if (items.length > MAX_FEED_ITEMS) {
          items[items.length - 1].remove();
        }
      }
    },
  };

  window.ZBaseBot = BaseBot;
})();
