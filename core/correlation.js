// Z: core\correlation.js
// Compute Pearson correlation between two arrays
function pearson(x, y) {
  const n = x.length;
  if (n !== y.length || n < 2) return 0;
  const mx = x.reduce((a, b) => a + b, 0) / n;
  const my = y.reduce((a, b) => a + b, 0) / n;
  let num = 0,
    dx = 0,
    dy = 0;
  for (let i = 0; i < n; i++) {
    num += (x[i] - mx) * (y[i] - my);
    dx += (x[i] - mx) ** 2;
    dy += (y[i] - my) ** 2;
  }
  return dx && dy ? (num / Math.sqrt(dx * dy)).toFixed(2) : 0;
}
window.computeEmotionCorrelations = function (emotionArr, coherenceArr) {
  // emotionArr: [{serenity, resonance, vitality, clarity}, ...]
  // coherenceArr: [number, ...]
  const keys = ['serenity', 'resonance', 'vitality', 'clarity'];
  const result = {};
  keys.forEach((k) => {
    const emoVals = emotionArr.map((e) => e[k]);
    result[k] = pearson(emoVals, coherenceArr);
  });
  return result;
};
