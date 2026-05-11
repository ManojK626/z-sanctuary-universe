// Z: core\z_dashboard.js
(function () {
  // --- Z-Chronicle Feed and Awareness Panel Integration ---
  // Chronicle Feed: display last 10 chronicle events
  window.ZDashboard = window.ZDashboard || {};
  window.ZDashboard.refreshLastEvent = function (entry) {
    const log = document.getElementById('zChronicleFeed');
    if (log) {
      const line = `[${new Date(entry.time).toLocaleTimeString()}] ${entry.file.split('/').pop()} - ${entry.note} (${entry.mood})`;
      const div = document.createElement('div');
      div.textContent = line;
      log.prepend(div);
    }
  };
  window.ZDashboard.renderHistory = function () {
    const container = document.getElementById('zChronicleFeed');
    try {
      const data = require('fs')
        .readFileSync('./data/chronicle_events.json', 'utf8')
        .trim()
        .split('\n');
      container.innerHTML = '';
      data
        .slice(-10)
        .reverse()
        .forEach((line) => {
          const e = JSON.parse(line);
          const div = document.createElement('div');
          div.textContent = `[${new Date(e.time).toLocaleTimeString()}] ${e.file.split('/').pop()} - ${e.note}`;
          container.appendChild(div);
        });
    } catch {
      container.innerHTML = 'No events yet.';
    }
  };
  window.ZDashboard.renderAwareness = function () {
    try {
      const { ZAwareness } = require('./z_awareness.js');
      ZAwareness.scanChronicle();
      const el = document.getElementById('zAwarenessState');
      if (el) el.textContent = `🧠 ${ZAwareness.summary()}`;
    } catch {
      // ignore if not available
    }
  };
  setInterval(() => {
    if (window.ZDashboard && window.ZDashboard.renderAwareness) {
      window.ZDashboard.renderAwareness();
    }
  }, 30000);
})();
// Sanctuary Dashboard: Chart.js analytics for energy, harmony, emotion
(function () {
  if (!window.Chart) return;
  const Chart = window.Chart;
  const energyCtx = document.getElementById('energyChart').getContext('2d');
  const harmonyCtx = document.getElementById('harmonyChart').getContext('2d');
  const emotionCtx = document.getElementById('emotionChart').getContext('2d');
  const emotionBreakdownCtx = document.getElementById('emotionBreakdown').getContext('2d');
  const maxPoints = 50;
  const energyData = { labels: [], data: [] };
  const harmonyData = { labels: [], data: [] };
  const emotionData = { labels: [], data: [] };
  let lastEmo = { serenity: 0, resonance: 0, vitality: 0, clarity: 0 };
  const energyChart = new Chart(energyCtx, {
    type: 'line',
    data: {
      labels: energyData.labels,
      datasets: [
        { label: 'Energy', data: energyData.data, borderColor: '#00d4ff', fill: false },
        {
          label: 'Energy (MA)',
          data: [],
          borderColor: '#7fe6ff',
          borderDash: [4, 4],
          pointRadius: 0,
          fill: false,
        },
      ],
    },
    options: { animation: false, scales: { x: { display: false }, y: { min: 0, max: 100 } } },
  });
  const harmonyChart = new Chart(harmonyCtx, {
    type: 'line',
    data: {
      labels: harmonyData.labels,
      datasets: [
        { label: 'Harmony', data: harmonyData.data, borderColor: '#a0e4cb', fill: false },
        {
          label: 'Harmony (MA)',
          data: [],
          borderColor: '#c2f1e0',
          borderDash: [4, 4],
          pointRadius: 0,
          fill: false,
        },
      ],
    },
    options: { animation: false, scales: { x: { display: false }, y: { min: 0, max: 100 } } },
  });
  const emotionChart = new Chart(emotionCtx, {
    type: 'line',
    data: {
      labels: emotionData.labels,
      datasets: [
        { label: 'Coherence', data: emotionData.data, borderColor: '#ff006e', fill: false },
        {
          label: 'Coherence (MA)',
          data: [],
          borderColor: '#ff7fb3',
          borderDash: [4, 4],
          pointRadius: 0,
          fill: false,
        },
      ],
    },
    options: { animation: false, scales: { x: { display: false }, y: { min: 0, max: 100 } } },
  });
  const breakdownChart = new Chart(emotionBreakdownCtx, {
    type: 'bar',
    data: {
      labels: ['Serenity', 'Resonance', 'Vitality', 'Clarity'],
      datasets: [
        {
          label: 'Emotion Breakdown',
          data: [0, 0, 0, 0],
          backgroundColor: ['#00d4ff', '#a0e4cb', '#ff006e', '#f0f0f0'],
        },
      ],
    },
    options: { animation: false, scales: { y: { min: 0, max: 100 } } },
  });
  function stats(arr) {
    if (!arr.length) return { min: 0, max: 0, avg: 0 };
    let min = Math.min(...arr),
      max = Math.max(...arr),
      avg = arr.reduce((a, b) => a + b, 0) / arr.length;
    return { min, max, avg: avg.toFixed(1) };
  }
  // Moving average helper
  function movingAvg(arr, window = 5) {
    if (arr.length < window) return [];
    let out = [];
    for (let i = 0; i <= arr.length - window; i++) {
      out.push((arr.slice(i, i + window).reduce((a, b) => a + b, 0) / window).toFixed(1));
    }
    return Array(window - 1)
      .fill(null)
      .concat(out);
  }
  // Trend indicator helper
  function trendArrow(arr) {
    if (arr.length < 2) return '';
    const d = arr[arr.length - 1] - arr[arr.length - 2];
    if (d > 1) return '^';
    if (d < -1) return 'v';
    return '->';
  }
  // Predictive model selector
  const summaryRoot = document.getElementById('zSummary');
  const summaryContent = document.createElement('div');
  summaryContent.id = 'zSummaryContent';
  summaryRoot.appendChild(summaryContent);
  const modelSelector = document.createElement('select');
  modelSelector.innerHTML =
    '<option value="linear">Linear Regression</option><option value="exp">Exponential Smoothing</option>';
  modelSelector.style.marginLeft = '1rem';
  summaryRoot.appendChild(modelSelector);
  let selectedModel = 'linear';
  modelSelector.onchange = function () {
    selectedModel = this.value;
    updateSummary();
  };
  function updateSummary() {
    const eStats = stats(energyData.data);
    const hStats = stats(harmonyData.data);
    const cStats = stats(emotionData.data);
    summaryContent.innerHTML =
      `<b>Energy</b>: ${energyData.data.slice(-1)[0] || 0} ${trendArrow(energyData.data)} (min ${eStats.min}, max ${eStats.max}, avg ${eStats.avg})<br>` +
      `<b>Harmony</b>: ${harmonyData.data.slice(-1)[0] || 0} ${trendArrow(harmonyData.data)} (min ${hStats.min}, max ${hStats.max}, avg ${hStats.avg})<br>` +
      `<b>Coherence</b>: ${emotionData.data.slice(-1)[0] || 0} ${trendArrow(emotionData.data)} (min ${cStats.min}, max ${cStats.max}, avg ${cStats.avg})`;
    // Predict next harmony (selected model)
    let pred = '';
    if (selectedModel === 'linear' && window.predictNextHarmony) {
      pred = window.predictNextHarmony(harmonyData.data);
      summaryContent.innerHTML += `<br><b>Predicted Next Harmony (Linear):</b> ${pred}`;
    } else if (selectedModel === 'exp' && window.predictExpSmooth) {
      pred = window.predictExpSmooth(harmonyData.data);
      summaryContent.innerHTML += `<br><b>Predicted Next Harmony (Exp. Smoothing):</b> ${pred}`;
    }
  }
  // Load custom thresholds
  let thresholds = {
    energy: { min: 20, max: 85, spike: 15 },
    harmony: { min: 30, max: 80, spike: 12 },
    coherence: { min: 40, max: 90, spike: 10 },
  };
  fetch('thresholds.json')
    .then((r) => r.json())
    .then((t) => {
      thresholds = t;
    });
  // Anomaly detection: highlight spikes using thresholds
  function findAnomalies(arr, metric) {
    let out = [];
    const t = thresholds[metric] || { spike: 15 };
    for (let i = 1; i < arr.length; i++) {
      if (Math.abs(arr[i] - arr[i - 1]) > t.spike) out.push(i);
      if (arr[i] < t.min || arr[i] > t.max) out.push(i);
    }
    return [...new Set(out)];
  }
  // Store emotion history for correlation
  const emotionHistory = [];
  // Store external data for correlation
  const externalHistory = [];
  function updateCharts() {
    if (analyticsPaused) return;
    if (window.ZEnergyResponse && window.ZEmotionFilter) {
      const t = new Date().toLocaleTimeString();
      const e = window.ZEnergyResponse.getEnergy();
      const h = window.ZEnergyResponse.getHarmony();
      const c = window.ZEmotionFilter.getEmotionalState().coherence;
      const emo = window.ZEmotionFilter.getEmotionalState();
      [energyData, harmonyData, emotionData].forEach((d) => d.labels.push(t));
      energyData.data.push(e);
      harmonyData.data.push(h);
      emotionData.data.push(c);
      lastEmo = emo;
      breakdownChart.data.datasets[0].data = [
        emo.serenity,
        emo.resonance,
        emo.vitality,
        emo.clarity,
      ];
      if (energyData.data.length > maxPoints) {
        [energyData, harmonyData, emotionData].forEach((d) => {
          d.labels.shift();
          d.data.shift();
        });
      }
      energyChart.update();
      harmonyChart.update();
      emotionChart.update();
      breakdownChart.update();
    }
    if (window.ZEmotionFilter) {
      const emo = window.ZEmotionFilter.getEmotionalState();
      emotionHistory.push({
        serenity: emo.serenity,
        resonance: emo.resonance,
        vitality: emo.vitality,
        clarity: emo.clarity,
      });
      if (emotionHistory.length > maxPoints) emotionHistory.shift();
    }
    // Update moving averages
    const energyAvg = movingAvg(energyData.data);
    const harmonyAvg = movingAvg(harmonyData.data);
    const emotionAvg = movingAvg(emotionData.data);
    if (energyChart.data.datasets[1]) energyChart.data.datasets[1].data = energyAvg;
    if (harmonyChart.data.datasets[1]) harmonyChart.data.datasets[1].data = harmonyAvg;
    if (emotionChart.data.datasets[1]) emotionChart.data.datasets[1].data = emotionAvg;
    // Highlight anomalies using thresholds
    [energyChart, harmonyChart, emotionChart].forEach((chart, idx) => {
      const arr = [energyData.data, harmonyData.data, emotionData.data][idx];
      const metric = ['energy', 'harmony', 'coherence'][idx];
      const anomalies = findAnomalies(arr, metric);
      chart.data.datasets[0].pointBackgroundColor = arr.map((v, i) =>
        anomalies.includes(i) ? '#ff006e' : '#00d4ff'
      );
      chart.update();
    });
    updateSummary();
    updateCorrelation();
    updateExternalCorrelation();
  }
  // Show emotion correlation matrix
  function updateCorrelation() {
    if (!window.computeEmotionCorrelations) return;
    const corr = window.computeEmotionCorrelations(emotionHistory, emotionData.data);
    let html = '<b>Emotion/Coherence Correlation:</b><br>';
    for (const k in corr) html += `${k}: <b>${corr[k]}</b> `;
    summaryContent.innerHTML += '<br>' + html;
  }
  // Visualize external data correlation (e.g., harmony vs. external metric)
  function updateExternalCorrelation() {
    if (!externalHistory.length) return;
    // Example: correlate harmony with external 'value' field
    const extVals = externalHistory.map((d) => d.value || 0);
    const harmonyVals = harmonyData.data.slice(-extVals.length);
    if (
      extVals.length &&
      harmonyVals.length === extVals.length &&
      window.computeEmotionCorrelations
    ) {
      const corr = window.computeEmotionCorrelations(
        extVals.map((v) => ({ serenity: v, resonance: v, vitality: v, clarity: v })),
        harmonyVals
      );
      let html = '<b>External/Harmony Correlation:</b> ';
      for (const k in corr) html += `${k}: <b>${corr[k]}</b> `;
      summaryContent.innerHTML += '<br>' + html;
    }
  }
  // Export logic
  function toCSV() {
    let csv = 'Time,Energy,Harmony,Coherence\n';
    for (let i = 0; i < energyData.data.length; i++) {
      csv += `${energyData.labels[i]},${energyData.data[i]},${harmonyData.data[i]},${emotionData.data[i]}\n`;
    }
    return csv;
  }
  function toJSON() {
    return JSON.stringify(
      {
        time: energyData.labels,
        energy: energyData.data,
        harmony: harmonyData.data,
        coherence: emotionData.data,
        emotionBreakdown: lastEmo,
      },
      null,
      2
    );
  }
  document.getElementById('exportCSV').onclick = function () {
    const blob = new Blob([toCSV()], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'sanctuary_data.csv';
    a.click();
  };
  document.getElementById('exportJSON').onclick = function () {
    const blob = new Blob([toJSON()], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'sanctuary_data.json';
    a.click();
  };
  // Download analytics report
  document.getElementById('downloadReport').onclick = function () {
    let summary = summaryContent.innerText;
    let blob = new Blob(
      [
        'Z-Sanctuary Analytics Report\n',
        'Generated: ' + new Date().toLocaleString() + '\n\n',
        summary + '\n\n',
        'See attached chart images.',
      ],
      { type: 'text/plain' }
    );
    let a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'sanctuary_report.txt';
    a.click();
    // Download chart images
    [energyChart, harmonyChart, emotionChart, breakdownChart].forEach((chart, i) => {
      let img = chart.toBase64Image();
      let link = document.createElement('a');
      link.href = img;
      link.download = `chart_${i + 1}.png`;
      link.click();
    });
  };
  // Data source connector (stub)
  let externalWS = null;
  document.getElementById('connectSourceBtn').onclick = function () {
    const url = document.getElementById('dataSourceInput').value;
    if (!url) {
      showFeedback('connectSourceBtn', 'No URL', 'error');
      return;
    }
    if (url.startsWith('ws://') || url.startsWith('wss://')) {
      showFeedback('connectSourceBtn', 'Connecting...', 'success');
      if (externalWS) externalWS.close();
      externalWS = new window.WebSocket(url);
      externalWS.onopen = () =>
        window.ZStatusConsole &&
        window.ZStatusConsole.log('[WS] Connected to external data source', 'active');
      externalWS.onmessage = (evt) => {
        if (analyticsPaused) return;
        try {
          const data = JSON.parse(evt.data);
          // Accept {energy, harmony, coherence, emotionBreakdown}
          if (typeof data.energy === 'number') energyData.data.push(data.energy);
          if (typeof data.harmony === 'number') harmonyData.data.push(data.harmony);
          if (typeof data.coherence === 'number') emotionData.data.push(data.coherence);
          if (data.emotionBreakdown)
            breakdownChart.data.datasets[0].data = [
              data.emotionBreakdown.serenity || 0,
              data.emotionBreakdown.resonance || 0,
              data.emotionBreakdown.vitality || 0,
              data.emotionBreakdown.clarity || 0,
            ];
          // Keep arrays in sync
          const t = new Date().toLocaleTimeString();
          [energyData, harmonyData, emotionData].forEach((d) => d.labels.push(t));
          if (energyData.data.length > maxPoints) {
            [energyData, harmonyData, emotionData].forEach((d) => {
              d.labels.shift();
              d.data.shift();
            });
          }
          energyChart.update();
          harmonyChart.update();
          emotionChart.update();
          breakdownChart.update();
          updateSummary();
        } catch (e) {
          window.ZStatusConsole &&
            window.ZStatusConsole.log('[ERROR] Data source error: ' + e, 'error');
        }
      };
      externalWS.onerror = () =>
        window.ZStatusConsole &&
        window.ZStatusConsole.log('[ERROR] Data source connection error', 'error');
      externalWS.onclose = () =>
        window.ZStatusConsole &&
        window.ZStatusConsole.log('[DISCONNECT] Data source disconnected', 'warning');
    } else {
      showFeedback('connectSourceBtn', 'Bad URL', 'error');
      alert('Only ws:// or wss:// sources supported in this version.');
    }
  };
  // External API fetcher
  document.getElementById('fetchApiBtn').onclick = function () {
    const url = document.getElementById('apiSourceInput').value;
    if (!url) {
      showFeedback('fetchApiBtn', 'No URL', 'error');
      return;
    }
    if (!url.startsWith('http')) {
      showFeedback('fetchApiBtn', 'Bad URL', 'error');
      alert('Enter a valid API URL.');
      return;
    }
    showFeedback('fetchApiBtn', 'Fetching...', 'success');
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        if (analyticsPaused) return;
        window.ZStatusConsole && window.ZStatusConsole.log('[API] API data fetched', 'active');
        // Example: if API returns {energy, harmony, coherence}
        if (typeof data.energy === 'number') energyData.data.push(data.energy);
        if (typeof data.harmony === 'number') harmonyData.data.push(data.harmony);
        if (typeof data.coherence === 'number') emotionData.data.push(data.coherence);
        // Store for correlation
        externalHistory.push(data);
        if (externalHistory.length > maxPoints) externalHistory.shift();
        // Keep arrays in sync
        const t = new Date().toLocaleTimeString();
        [energyData, harmonyData, emotionData].forEach((d) => d.labels.push(t));
        if (energyData.data.length > maxPoints) {
          [energyData, harmonyData, emotionData].forEach((d) => {
            d.labels.shift();
            d.data.shift();
          });
        }
        energyChart.update();
        harmonyChart.update();
        emotionChart.update();
        updateSummary();
        // Start polling
        startApiPolling(url, 60000);
      })
      .catch((e) => {
        window.ZStatusConsole &&
          window.ZStatusConsole.log('[ERROR] API fetch error: ' + e, 'error');
      });
  };
  // Automated API polling
  let apiPollInterval = null;
  function startApiPolling(url, interval = 60000) {
    if (apiPollInterval) clearInterval(apiPollInterval);
    apiPollInterval = setInterval(() => {
      if (analyticsPaused) return;
      fetch(url)
        .then((r) => r.json())
        .then((data) => {
          window.ZStatusConsole && window.ZStatusConsole.log('[API] API data polled', 'active');
          if (typeof data.energy === 'number') energyData.data.push(data.energy);
          if (typeof data.harmony === 'number') harmonyData.data.push(data.harmony);
          if (typeof data.coherence === 'number') emotionData.data.push(data.coherence);
          const t = new Date().toLocaleTimeString();
          [energyData, harmonyData, emotionData].forEach((d) => d.labels.push(t));
          if (energyData.data.length > maxPoints) {
            [energyData, harmonyData, emotionData].forEach((d) => {
              d.labels.shift();
              d.data.shift();
            });
          }
          energyChart.update();
          harmonyChart.update();
          emotionChart.update();
          updateSummary();
        });
    }, interval);
  }
  // Save dashboard data for daily report/backup
  function saveDashboardData() {
    const data = {
      time: energyData.labels,
      energy: energyData.data,
      harmony: harmonyData.data,
      coherence: emotionData.data,
      emotionBreakdown: lastEmo,
    };
    try {
      fetch('z_dashboard_data.json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } catch {
      /* ignore in browser-only mode */
    }
  }
  setInterval(updateCharts, 2000);
  setInterval(saveDashboardData, 60000); // Save every minute
  // Editable thresholds
  const savedT = localStorage.getItem('zThresholds');
  if (savedT) thresholds = JSON.parse(savedT);
  // Editable model alpha
  let expAlpha = 0.3;
  const savedA = localStorage.getItem('zExpAlpha');
  if (savedA) expAlpha = Number(savedA);
  // Pause/Resume analytics
  let analyticsPaused = false;
  let nightAutoPaused = false;
  let pausedBeforeNight = false;

  function syncAnalyticsButtons() {
    const pauseBtn = document.getElementById('pauseAnalytics');
    const resumeBtn = document.getElementById('resumeAnalytics');
    if (!pauseBtn || !resumeBtn) return;
    pauseBtn.style.display = analyticsPaused ? 'none' : '';
    resumeBtn.style.display = analyticsPaused ? '' : 'none';
    const night = window.ZNightMode === true;
    pauseBtn.disabled = night;
    resumeBtn.disabled = night;
  }

  function applyNightPause(enabled) {
    if (enabled) {
      if (!nightAutoPaused) {
        pausedBeforeNight = analyticsPaused;
        nightAutoPaused = true;
      }
      analyticsPaused = true;
    } else if (nightAutoPaused) {
      analyticsPaused = pausedBeforeNight;
      nightAutoPaused = false;
    }
    syncAnalyticsButtons();
  }

  window.addEventListener('znightmodechange', (event) => {
    const enabled = event && event.detail ? event.detail.enabled : false;
    applyNightPause(enabled);
  });
  // Patch exp smoothing to use alpha
  if (window.predictExpSmooth) {
    window.predictExpSmooth = function (arr) {
      if (!arr.length) return 0;
      let s = arr[0];
      for (let i = 1; i < arr.length; i++) {
        s = expAlpha * arr[i] + (1 - expAlpha) * s;
      }
      return s.toFixed(1);
    };
  }
  // Error handling for data sources and predictions
  function safeFetch(url, opts) {
    return fetch(url, opts)
      .then((r) => {
        if (!r.ok) throw new Error('Network error: ' + r.status);
        return r.json();
      })
      .catch((e) => {
        window.ZStatusConsole &&
          window.ZStatusConsole.log('[ERROR]Data fetch error: ' + e.message, 'error');
        return null;
      });
  }
  // Error handling for predictions
  function safePredict(fn, ...args) {
    try {
      return fn(...args);
    } catch (e) {
      window.ZStatusConsole &&
        window.ZStatusConsole.log('[ERROR]Prediction error: ' + e.message, 'error');
      return null;
    }
  }
  // Utility: show temporary UI feedback
  function showFeedback(el, msg, type) {
    el = typeof el === 'string' ? document.getElementById(el) : el;
    if (!el) return;
    const orig = el.innerText;
    el.innerText = msg;
    el.classList.add('z-feedback-' + type);
    setTimeout(() => {
      el.innerText = orig;
      el.classList.remove('z-feedback-' + type);
    }, 1200);
  }
  // Add feedback CSS (success/error)
  (function () {
    const style = document.createElement('style');
    style.innerHTML = `
      .z-feedback-success { background: #a0e4cb !important; color: #0a0e27 !important; transition: background 0.3s; }
      .z-feedback-error { background: #ff006e !important; color: #fff !important; transition: background 0.3s; }
    `;
    document.head.appendChild(style);
  })();
  // Patch Save Thresholds button
  document.getElementById('saveThresholds').onclick = function () {
    thresholds.energy.min =
      Number(document.getElementById('energyMin').value) || thresholds.energy.min;
    thresholds.energy.max =
      Number(document.getElementById('energyMax').value) || thresholds.energy.max;
    thresholds.harmony.min =
      Number(document.getElementById('harmonyMin').value) || thresholds.harmony.min;
    thresholds.harmony.max =
      Number(document.getElementById('harmonyMax').value) || thresholds.harmony.max;
    localStorage.setItem('zThresholds', JSON.stringify(thresholds));
    window.ZStatusConsole && window.ZStatusConsole.log('[OK] Thresholds updated', 'active');
    showFeedback('saveThresholds', 'Saved!', 'success');
  };
  // Patch Save Alpha button
  document.getElementById('saveAlpha').onclick = function () {
    expAlpha = Number(document.getElementById('expAlpha').value) || 0.3;
    localStorage.setItem('zExpAlpha', expAlpha);
    window.ZStatusConsole &&
      window.ZStatusConsole.log('[OK] Exp. smoothing alpha set to ' + expAlpha, 'active');
    showFeedback('saveAlpha', 'Set!', 'success');
  };
  // On load, restore UI from localStorage
  window.addEventListener('DOMContentLoaded', function () {
    // Restore thresholds
    const savedT = localStorage.getItem('zThresholds');
    if (savedT) {
      thresholds = JSON.parse(savedT);
      document.getElementById('energyMin').value = thresholds.energy.min;
      document.getElementById('energyMax').value = thresholds.energy.max;
      document.getElementById('harmonyMin').value = thresholds.harmony.min;
      document.getElementById('harmonyMax').value = thresholds.harmony.max;
      window.ZStatusConsole &&
        window.ZStatusConsole.log('[SAVE] Thresholds loaded from localStorage', 'status');
    }
    // Restore expAlpha
    const savedA = localStorage.getItem('zExpAlpha');
    if (savedA) {
      expAlpha = Number(savedA);
      document.getElementById('expAlpha').value = expAlpha;
      window.ZStatusConsole &&
        window.ZStatusConsole.log('[SAVE] Model alpha loaded from localStorage', 'status');
    }
    // Restore analyticsPaused
    const paused = localStorage.getItem('zAnalyticsPaused');
    if (paused === 'true') {
      analyticsPaused = true;
      document.getElementById('pauseAnalytics').style.display = 'none';
      document.getElementById('resumeAnalytics').style.display = '';
      window.ZStatusConsole &&
        window.ZStatusConsole.log('[SAVE] Analytics pause state restored', 'status');
    }
    syncAnalyticsButtons();
  });
  // Save analyticsPaused state
  document.getElementById('pauseAnalytics').onclick = function () {
    if (window.ZNightMode === true) {
      showFeedback('pauseAnalytics', 'Night Mode', 'error');
      return;
    }
    analyticsPaused = true;
    this.style.display = 'none';
    document.getElementById('resumeAnalytics').style.display = '';
    localStorage.setItem('zAnalyticsPaused', 'true');
    window.ZStatusConsole && window.ZStatusConsole.log('[PAUSE] Analytics paused', 'warning');
    showFeedback('pauseAnalytics', 'Paused', 'success');
    syncAnalyticsButtons();
  };
  document.getElementById('resumeAnalytics').onclick = function () {
    if (window.ZNightMode === true) {
      showFeedback('resumeAnalytics', 'Night Mode', 'error');
      return;
    }
    analyticsPaused = false;
    this.style.display = 'none';
    document.getElementById('pauseAnalytics').style.display = '';
    localStorage.setItem('zAnalyticsPaused', 'false');
    window.ZStatusConsole && window.ZStatusConsole.log('[RESUME] Analytics resumed', 'active');
    showFeedback('resumeAnalytics', 'Resumed', 'success');
    syncAnalyticsButtons();
  };
  // TEST: Simulate fetch and prediction errors for dashboard feedback
  window.testDashboardErrors = function () {
    // Simulate fetch error
    safeFetch('/not-a-real-endpoint').then((data) => {
      if (data === null)
        window.ZStatusConsole &&
          window.ZStatusConsole.log('[OK] Fetch error feedback test passed', 'status');
    });
    // Simulate prediction error
    function badPredict() {
      throw new Error('Simulated prediction failure');
    }
    const result = safePredict(badPredict);
    if (result === null)
      window.ZStatusConsole &&
        window.ZStatusConsole.log('[OK] Prediction error feedback test passed', 'status');
  };
})();
