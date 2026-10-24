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

function amkMainControl(base) {
  return {
    id: 'AMK_GOKU_MAIN_CONTROL',
    architecture: 'traditional-html',
    base,
    path: '/dashboard/Html/amk-goku-main-control.html',
    ready: 'document.documentElement.getAttribute(\'z-layout\') && document.getElementById(\'zAnyDeviceEvidenceMount\') && document.getElementById(\'zAnyDeviceEvidenceMount\').textContent.indexOf(\'NOT_TESTED\') !== -1',
    optInTarget: 'body',
    headingSelector: '#amkMapPageTitle, #zAnyDeviceEvidenceMount h3, #zAnyDeviceEvidenceMount h4',
    linkSelector: 'nav.amk-dash-ribbon-nav a[href]',
    criticalSelectors: ['#amkMapPageTitle', '#zAnyDeviceEvidenceMount', 'a.amk-map-skip'],
    governanceSelectors: [],
    keyboardSelector: '#zAnyDeviceEvidenceMount button',
    density: 'absent',
    cssNeedles: ['100dvh', 'safe-area-inset', 'prefers-reduced-motion'],
    skipCssWalk: true,
    settleMs: 500,
  };
}

function legacyFixture(base) {
  return {
    id: 'LEGACY_NON_OPT_IN',
    base,
    path: '/tests/fixtures/z_adaptive_legacy_host.html',
  };
}

function goldenWebsite(base) {
  return {
    id: 'Z_GOLDEN_WEBSITE',
    architecture: 'traditional-html',
    base,
    path: '/docs/golden-website/shell/index.html',
    ready: 'document.documentElement.getAttribute(\'z-layout\') && document.querySelector(\'h1\') && document.body.textContent.indexOf(\'not published\') !== -1 && document.body.textContent.indexOf(\'QUALIFIED is not VERIFIED\') !== -1',
    optInTarget: 'body',
    headingSelector: 'h1, #gw-portfolio h3, #gw-locked li span',
    linkSelector: 'nav.primary a[href]',
    criticalSelectors: ['h1', 'nav.primary', 'a.skip'],
    governanceSelectors: [],
    keyboardSelector: 'nav.primary a',
    density: 'absent',
    cssNeedles: ['100dvh', 'safe-area-inset', 'prefers-reduced-motion'],
    skipCssWalk: true,
    settleMs: 300,
  };
}

module.exports = { unifiedDashboard, appsWeb, amkMainControl, goldenWebsite, legacyFixture };
