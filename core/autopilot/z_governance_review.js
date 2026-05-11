// Z: core\autopilot\z_governance_review.js
// Companion-guided governance review (SKK + RKPK).
(function () {
  const outputSkk = document.getElementById('zGovReviewSkk');
  const outputRkpk = document.getElementById('zGovReviewRkpk');
  const metaEl = document.getElementById('zGovReviewMeta');
  const generateBtn = document.getElementById('zGovReviewGenerateBtn');

  if (!outputSkk || !outputRkpk || !generateBtn) return;

  function getReport() {
    if (window.ZGovernanceReport?.getLast) return window.ZGovernanceReport.getLast();
    try {
      const raw = localStorage.getItem('zGovernanceReportLast');
      return raw ? JSON.parse(raw) : null;
    } catch (err) {
      return null;
    }
  }

  function buildSkkSummary(report) {
    if (!report) return 'Generate a governance report to review.';
    const trends = report.chainTrends || [];
    const heat = report.chainHeat || [];
    const hot = heat.filter((item) => item.avgHeat >= 0.7 || item.peakHeat >= 0.85);
    const rising = trends.filter((t) => t.trend === 'rising');

    if (!hot.length && !rising.length) {
      return 'Systems are stable. No rising chain risks detected.';
    }

    const parts = [];
    if (hot.length) {
      parts.push(
        `High-heat chains detected: ${hot
          .slice(0, 2)
          .map((h) => h.id)
          .join(', ')}`
      );
    }
    if (rising.length) {
      parts.push(
        `Rising trend signals: ${rising
          .slice(0, 2)
          .map((t) => t.id)
          .join(', ')}`
      );
    }
    return parts.join('. ') + '.';
  }

  function buildRkpkReflection(report) {
    if (!report) return 'When ready, generate a report and we will reflect gently.';
    const stress = window.ZSystemMetrics?.get?.().stress ?? 0.4;
    const override = report.stateCounts?.override || 0;
    if (stress > 0.7 || override > 3) {
      return 'The system has been under pressure. Consider slowing the pace or testing in Simulation Mode.';
    }
    return 'The system feels steady. Keep the pace gentle and consistent.';
  }

  function render() {
    const report = getReport();
    outputSkk.textContent = buildSkkSummary(report);
    outputRkpk.textContent = buildRkpkReflection(report);
    if (metaEl) {
      metaEl.textContent = report
        ? `Last report: ${new Date(report.generatedAt).toLocaleString()}`
        : 'No report available yet.';
    }
  }

  generateBtn.addEventListener('click', render);
  render();

  window.ZGovernanceReview = {
    render,
  };
})();
