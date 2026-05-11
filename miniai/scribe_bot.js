// Z: miniai\scribe_bot.js
/**
 * ScribeBot
 * Records summaries and notes.
 */
(function () {
  const base = window.ZBaseBot || {};

  const ScribeBot = Object.assign({}, base, {
    name: 'ScribeBot',
    record(message, meta) {
      this.log('record', { message, meta });
    },
  });

  window.ZScribeBot = ScribeBot;
})();
