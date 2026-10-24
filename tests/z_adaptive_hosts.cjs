'use strict';

function unifiedDashboard(base) {
  return {
    id: 'UNIFIED_DASHBOARD',
    architecture: 'traditional-html',
    base,
    path: '/dashboard/Html/index-skk-rkpk.html',
    ready: 'document.documentElement.getAttribute(\'z-layout\')',
    optInTarget: 'body',
    headingSelector: 'h1,h2,h3',
    linkSelector: 'a[href]',
    criticalSelectors: ['#zHiveRoot', '.z-skip-link'],
    governanceSelectors: ['#zAnyDevicesPanel', '#zAnyDevicesBadge'],
    keyboardSelector: '.z-skip-link',
    density: 'application-owned',
    cssNeedles: ['100dvh', 'safe-area-inset', 'prefers-reduced-motion'],
    settleMs: 200,
  };
}

function appsWeb(base) {
  return {
    id: 'APPS_WEB',
    architecture: 'next-react',
    base,
    path: '/',
    ready: 'document.documentElement.getAttribute(\'z-layout\') && document.querySelector(\'main h1\')',
    optInTarget: 'documentElement',
    headingSelector: 'main h1, .sanctuary-focus-column h2',
    linkSelector: 'header.sanctuary-tv-header nav a[href]',
    criticalSelectors: ['main h1', 'header.sanctuary-tv-header nav', 'main'],
    keyboardSelector: 'header.sanctuary-tv-header nav a',
    density: 'absent',
    cssNeedles: ['100dvh', 'safe-area-inset', 'prefers-reduced-motion'],
    settleMs: 400,
  };
}

function legacyFixture(base) {
  return {
    id: 'LEGACY_NON_OPT_IN',
    base,
    path: '/tests/fixtures/z_adaptive_legacy_host.html',
  };
}

module.exports = { unifiedDashboard, appsWeb, legacyFixture };
