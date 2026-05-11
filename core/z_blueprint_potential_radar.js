// Z: core/z_blueprint_potential_radar.js
// Illustrative Chart.js radar in Z Blueprint — swap data source for live scores later.
(function () {
  function init() {
    const Chart = window.Chart;
    const canvas = document.getElementById('zBlueprintPotentialRadar');
    if (!Chart || !canvas || canvas.dataset.zRadarInit === '1') return;
    canvas.dataset.zRadarInit = '1';
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const labels = [
      'Technical depth',
      'Compassion / DRP',
      'Governance & safety',
      'Reach & UX',
      'Evidence & truth (QADP)'
    ];
    const demo = [82, 94, 88, 76, 90];

    // eslint-disable-next-line no-new
    new Chart(ctx, {
      type: 'radar',
      data: {
        labels,
        datasets: [
          {
            label: 'Illustrative potential (demo)',
            data: demo,
            borderColor: 'rgba(124, 179, 255, 0.95)',
            backgroundColor: 'rgba(124, 179, 255, 0.2)',
            pointBackgroundColor: 'rgba(0, 212, 255, 0.9)',
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: '#c8d0da' } }
        },
        scales: {
          r: {
            beginAtZero: true,
            min: 0,
            max: 100,
            ticks: { color: '#9aa0a6', backdropColor: 'transparent' },
            grid: { color: 'rgba(255,255,255,0.08)' },
            angleLines: { color: 'rgba(255,255,255,0.08)' },
            pointLabels: { color: '#b8c0cc', font: { size: 10 } }
          }
        }
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
