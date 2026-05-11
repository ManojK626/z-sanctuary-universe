// Z: core\autopilot\z_governance_reports.js
// Governance reports from Autopilot replay log.
(function () {
  const STORAGE_KEY = 'zGovernanceReportLast';
  const LAST_RUN_KEY = 'zGovernanceReportLastAt';
  const AUTO_DAYS = 7;

  const outputEl = document.getElementById('zGovReportOutput');
  const lastRunEl = document.getElementById('zGovReportLastRun');
  const generateBtn = document.getElementById('zGovReportGenerateBtn');
  const exportJsonBtn = document.getElementById('zGovReportExportJsonBtn');
  const exportMdBtn = document.getElementById('zGovReportExportMdBtn');

  if (!outputEl || !generateBtn || !window.ZAutopilotReplay) return;

  function loadReport() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (err) {
      return null;
    }
  }

  function saveReport(report) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(report));
    localStorage.setItem(LAST_RUN_KEY, report.generatedAt);
  }

  function formatDate(value) {
    if (!value) return 'unknown';
    try {
      return new Date(value).toLocaleString();
    } catch (err) {
      return value;
    }
  }

  function buildReport() {
    const events = window.ZAutopilotReplay.all();
    const actions = {};
    const presets = {};
    let overrideCount = 0;
    let nightCount = 0;
    let calmCount = 0;
    let freezeCount = 0;

    events.forEach((event) => {
      actions[event.action] = (actions[event.action] || 0) + 1;
      if (event.value) {
        presets[event.value] = (presets[event.value] || 0) + 1;
      }
      if (event.state?.override) overrideCount += 1;
      if (event.state?.night) nightCount += 1;
      if (event.state?.calm) calmCount += 1;
      if (event.state?.freeze) freezeCount += 1;
    });

    const start = events.length ? events[0].t : null;
    const end = events.length ? events[events.length - 1].t : null;
    const chainHeat = window.ZChainHistory?.getWeeklyHeatSummary?.() || [];
    const chainTrends = window.ZChainHistory?.getTrendWarnings?.() || [];

    return {
      generatedAt: new Date().toISOString(),
      period: { start, end, events: events.length },
      actions,
      presets,
      chainHeat,
      chainTrends,
      stateCounts: {
        override: overrideCount,
        night: nightCount,
        calm: calmCount,
        freeze: freezeCount,
      },
    };
  }

  function formatReportText(report) {
    if (!report) return 'No report generated yet.';
    return [
      'GOVERNANCE REPORT',
      '-----------------',
      `Generated : ${formatDate(report.generatedAt)}`,
      `Events    : ${report.period.events}`,
      `Window    : ${formatDate(report.period.start)} -> ${formatDate(report.period.end)}`,
      '',
      'ACTIONS',
      '-------',
      ...(Object.keys(report.actions).length
        ? Object.entries(report.actions).map(([key, value]) => `${key}: ${value}`)
        : ['none']),
      '',
      'PRESETS',
      '-------',
      ...(Object.keys(report.presets).length
        ? Object.entries(report.presets).map(([key, value]) => `${key}: ${value}`)
        : ['none']),
      '',
      'STATE FLAGS',
      '-----------',
      `override: ${report.stateCounts.override}`,
      `night: ${report.stateCounts.night}`,
      `calm: ${report.stateCounts.calm}`,
      `freeze: ${report.stateCounts.freeze}`,
      '',
      'CHAIN HEAT (WEEK)',
      '-----------------',
      ...(report.chainHeat && report.chainHeat.length
        ? report.chainHeat.map(
            (item) => `${item.id}: avg=${item.avgHeat.toFixed(2)} peak=${item.peakHeat.toFixed(2)}`
          )
        : ['none']),
      '',
      'CHAIN TRENDS',
      '------------',
      ...(report.chainTrends && report.chainTrends.length
        ? report.chainTrends.map((trend) => `${trend.id}: ${trend.trend}`)
        : ['none']),
    ].join('\n');
  }

  function formatReportMarkdown(report) {
    if (!report) return '# Governance Report\n\nNo report generated yet.';
    return [
      '# Governance Report',
      '',
      `- Generated: ${formatDate(report.generatedAt)}`,
      `- Events: ${report.period.events}`,
      `- Window: ${formatDate(report.period.start)} -> ${formatDate(report.period.end)}`,
      '',
      '## Actions',
      ...(Object.keys(report.actions).length
        ? Object.entries(report.actions).map(([key, value]) => `- ${key}: ${value}`)
        : ['- none']),
      '',
      '## Presets',
      ...(Object.keys(report.presets).length
        ? Object.entries(report.presets).map(([key, value]) => `- ${key}: ${value}`)
        : ['- none']),
      '',
      '## State Flags',
      `- override: ${report.stateCounts.override}`,
      `- night: ${report.stateCounts.night}`,
      `- calm: ${report.stateCounts.calm}`,
      `- freeze: ${report.stateCounts.freeze}`,
      '',
      '## Chain Heat (Week)',
      ...(report.chainHeat && report.chainHeat.length
        ? report.chainHeat.map(
            (item) =>
              `- ${item.id}: avg=${item.avgHeat.toFixed(2)} peak=${item.peakHeat.toFixed(2)}`
          )
        : ['- none']),
      '',
      '## Chain Trends',
      ...(report.chainTrends && report.chainTrends.length
        ? report.chainTrends.map((trend) => `- ${trend.id}: ${trend.trend}`)
        : ['- none']),
    ].join('\n');
  }

  function render(report) {
    if (lastRunEl) {
      lastRunEl.textContent = report ? formatDate(report.generatedAt) : 'never';
    }
    outputEl.textContent = formatReportText(report);
  }

  function generateReport() {
    const report = buildReport();
    saveReport(report);
    render(report);
    return report;
  }

  function exportJson() {
    const report = loadReport();
    if (!report) return;
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'z_governance_report.json';
    link.click();
    URL.revokeObjectURL(url);
  }

  function exportMarkdown() {
    const report = loadReport();
    if (!report) return;
    const content = formatReportMarkdown(report);
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'z_governance_report.md';
    link.click();
    URL.revokeObjectURL(url);
  }

  function shouldAutoRun() {
    const last = localStorage.getItem(LAST_RUN_KEY);
    if (!last) return true;
    const lastTime = new Date(last).getTime();
    if (!Number.isFinite(lastTime)) return true;
    const days = (Date.now() - lastTime) / (1000 * 60 * 60 * 24);
    return days >= AUTO_DAYS;
  }

  generateBtn.addEventListener('click', generateReport);
  if (exportJsonBtn) exportJsonBtn.addEventListener('click', exportJson);
  if (exportMdBtn) exportMdBtn.addEventListener('click', exportMarkdown);

  const existing = loadReport();
  if (existing) render(existing);
  if (shouldAutoRun()) generateReport();

  window.ZGovernanceReport = {
    generate: generateReport,
    getLast: loadReport,
    formatText: formatReportText,
    formatMarkdown: formatReportMarkdown,
  };
})();
