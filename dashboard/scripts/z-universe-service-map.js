/**
 * NAV-1 — Shared config + category accents for Universal Workstation Navigator.
 * Read-only; no fetch side-effects.
 */
(function (global) {
  var cfg = {
    catalogUrl: '../../data/z_universe_service_catalog.json',
    detailOpenAttr: 'data-open',
    railExpandedAttr: 'data-expanded',
    railCollapsedAttr: 'data-collapsed',
  };

  var accentByCategory = {
    overview: '268 52% 62%',
    zuno_ai_builder: '185 52% 58%',
    governance_drp: '142 45% 52%',
    z_zuno_reports: '205 58% 62%',
    z_car2: '24 78% 58%',
    tools_comfort: '310 48% 62%',
    z_zebras: '43 72% 58%',
    notebook_knowledge: '350 55% 62%',
    playgarden_visual: '276 58% 68%',
    creative_engines: '158 48% 52%',
    magical_visual: '280 58% 62%',
    products_services: '38 82% 58%',
    orchestration: '210 55% 58%',
    cross_project_bridges: '12 70% 58%',
  };

  global.ZUniverseNavigatorMap = {
    config: cfg,
    accentForCategory: function (catId) {
      return accentByCategory[catId] || '215 20% 58%';
    },
  };
})(typeof window !== 'undefined' ? window : globalThis);
