// Z: core\trend_predict.js
// Simple linear regression for next-step prediction
function linearRegression(y) {
  const n = y.length;
  if (n < 2) return { slope: 0, intercept: 0, predict: () => y[n - 1] || 0 };
  const x = Array.from({ length: n }, (_, i) => i + 1);
  const mx = x.reduce((a, b) => a + b, 0) / n;
  const my = y.reduce((a, b) => a + b, 0) / n;
  let num = 0,
    den = 0;
  for (let i = 0; i < n; i++) {
    num += (x[i] - mx) * (y[i] - my);
    den += (x[i] - mx) ** 2;
  }
  const slope = num / den;
  const intercept = my - slope * mx;
  return {
    slope,
    intercept,
    predict: (xnext) => slope * xnext + intercept,
  };
}
window.predictNextHarmony = function (harmonyArr) {
  const reg = linearRegression(harmonyArr);
  return reg.predict(harmonyArr.length + 1).toFixed(1);
};
