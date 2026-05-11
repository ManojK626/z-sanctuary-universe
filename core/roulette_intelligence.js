// Z: core\roulette_intelligence.js
(function () {
  function evaluatePattern(data) {
    if (!Array.isArray(data)) {
      return { status: 'invalid', message: 'No spins available' };
    }
    const counts = data.reduce((acc, entry) => {
      const num = entry.number;
      if (typeof num === 'number') {
        acc[num] = (acc[num] || 0) + 1;
      }
      return acc;
    }, {});
    return { status: 'ok', unique: Object.keys(counts).length };
  }
  window.ZRouletteIntel = { evaluatePattern };
})();
