// Z: core\exp_smooth_predict.js
// Exponential smoothing for next-step prediction
function expSmooth(arr, alpha = 0.3) {
  if (!arr.length) return 0;
  let s = arr[0];
  for (let i = 1; i < arr.length; i++) {
    s = alpha * arr[i] + (1 - alpha) * s;
  }
  return s;
}
window.predictExpSmooth = function (arr) {
  return expSmooth(arr).toFixed(1);
};
