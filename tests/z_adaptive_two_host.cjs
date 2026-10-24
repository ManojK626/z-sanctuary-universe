'use strict';

const fs = require('fs');
const path = require('path');
const { chromium } = require('C:/Cursor Projects Organiser/Z_Sanctuary_Universe/node_modules/playwright');
const harness = require('./z_adaptive_harness.cjs');
const hosts = require('./z_adaptive_hosts.cjs');

const DASHBOARD_BASE = process.env.Z_ADAPTIVE_DASHBOARD_BASE || 'http://127.0.0.1:4195';
const WEB_BASE = process.env.Z_ADAPTIVE_WEB_BASE || 'http://127.0.0.1:4196';
const ROOT = path.join(__dirname, '..');

function sourceGuard() {
  const adapter = fs.readFileSync(path.join(ROOT, 'apps/web/src/components/adaptive/ZAdaptiveHost.jsx'), 'utf8');
  const failures = [];
  if (/\b860\b|\b1280\b|\b1600\b|layoutFromWidth|pointer:\s*coarse/.test(adapter)) {
    failures.push('apps/web adapter duplicates adaptive rules');
  }
  if (adapter.includes('z_layout_engine')) failures.push('apps/web imports the dashboard engine');
  if (!adapter.includes('z_adaptive_runtime.cjs')) failures.push('apps/web adapter misses shared runtime');
  if (/colorDepth|pixelDepth|z_anydevices|quarantine|gpu/i.test(adapter)) {
    failures.push('apps/web adapter couples to trust or hardware identity');
  }
  const harnessSource = fs.readFileSync(path.join(__dirname, 'z_adaptive_harness.cjs'), 'utf8');
  if (harnessSource.includes('z-status-rail') || harnessSource.includes('zvp-')) {
    failures.push('shared harness encodes dashboard chrome');
  }
  if (!harnessSource.includes('z_adaptive_runtime.cjs')) failures.push('harness does not use shared runtime');
  return failures;
}

async function legacyRegression(browser) {
  const failures = [];
  const host = hosts.legacyFixture(DASHBOARD_BASE);
  const context = await browser.newContext({ viewport: { width: 1000, height: 800 } });
  const page = await context.newPage();
  await page.goto(host.base + host.path, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForFunction(() => document.documentElement.getAttribute('z-viewport'), null, { timeout: 10000 });
  const narrow = await page.evaluate(() => ({
    layout: document.documentElement.getAttribute('z-layout'),
    viewport: document.documentElement.getAttribute('z-viewport'),
    classes: [...document.body.classList],
    runtime: [...document.scripts].some((script) => (script.src || '').includes('z_adaptive_runtime')),
    optIn: document.body.classList.contains('z-anydevice-adaptive'),
  }));
  if (narrow.optIn || narrow.layout || narrow.runtime) failures.push('legacy fixture opted in');
  if (!narrow.classes.includes('zvp-tablet')) failures.push(`legacy 1000 ${narrow.classes.join(' ')}`);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => document.documentElement.getAttribute('z-viewport'), null, { timeout: 10000 });
  const wide = await page.evaluate(() => ({
    layout: document.documentElement.getAttribute('z-layout'),
    viewport: document.documentElement.getAttribute('z-viewport'),
    classes: [...document.body.classList],
  }));
  if (wide.layout) failures.push(`legacy 1440 z-layout ${wide.layout}`);
  if (!wide.classes.includes('zvp-compact-desktop')) failures.push('legacy 1440 missing compact-desktop');
  if (wide.classes.includes('zvp-desktop')) failures.push('legacy 1440 gained zvp-desktop');
  if (wide.viewport !== 'desktop') failures.push(`legacy viewport ${wide.viewport}`);
  await context.close();
  return failures;
}

async function serverHtmlHasLayout(url) {
  const response = await fetch(url);
  const text = await response.text();
  return /z-layout=/.test(text);
}

function browserFamilies() {
  const root = path.join(process.env.USERPROFILE || '', 'AppData', 'Local', 'ms-playwright');
  let names = [];
  try {
    names = fs.readdirSync(root);
  } catch {
    names = [];
  }
  return {
    CHROMIUM: names.some((name) => name.startsWith('chromium')) ? 'PRESENT' : 'NOT_AVAILABLE',
    FIREFOX: names.some((name) => name.startsWith('firefox')) ? 'PRESENT' : 'NOT_AVAILABLE',
    WEBKIT: names.some((name) => name.startsWith('webkit')) ? 'PRESENT' : 'NOT_AVAILABLE',
  };
}

(async () => {
  const failures = sourceGuard();
  const families = browserFamilies();
  if (families.CHROMIUM !== 'PRESENT') failures.push('chromium binary missing');
  const ssrMarked = await serverHtmlHasLayout(WEB_BASE + '/');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  const hydrationErrors = [];
  page.on('pageerror', (error) => {
    const text = String(error);
    if (/hydration|did not match/i.test(text)) hydrationErrors.push(text.slice(0, 240));
  });

  const dashboard = hosts.unifiedDashboard(DASHBOARD_BASE);
  const web = hosts.appsWeb(WEB_BASE);
  const dashboardMatrix = await harness.runMatrix(page, dashboard);
  const webMatrix = await harness.runMatrix(page, web);
  failures.push(...dashboardMatrix.failures, ...webMatrix.failures);

  await harness.openHost(page, dashboard);
  const dashboardKeys = await harness.runKeyboard(page, dashboard);
  if (!dashboardKeys.matches || dashboardKeys.left < 0) failures.push(`dashboard keyboard ${JSON.stringify(dashboardKeys)}`);
  await harness.openHost(page, web);
  const webKeys = await harness.runKeyboard(page, web);
  if (!webKeys.matches) failures.push(`apps/web keyboard ${JSON.stringify(webKeys)}`);

  const coarse = await harness.runCoarseProbe(page);
  const dashboardMotion = await harness.runReducedMotion(browser, dashboard);
  const webMotion = await harness.runReducedMotion(browser, web);
  const dashboardOffline = await harness.runOffline(browser, dashboard);
  const webOffline = await harness.runOffline(browser, web);
  const dashboardDpr = await harness.runDpr(browser, dashboard);
  const webDpr = await harness.runDpr(browser, web);
  if (dashboardMotion !== 'PASS') failures.push(`dashboard motion ${dashboardMotion}`);
  if (webMotion !== 'PASS') failures.push(`apps/web motion ${webMotion}`);
  if (dashboardOffline !== 'PASS') failures.push(`dashboard offline ${dashboardOffline}`);
  if (webOffline !== 'PASS') failures.push(`apps/web offline ${webOffline}`);
  if (dashboardDpr !== 'PASS') failures.push(`dashboard dpr ${dashboardDpr}`);
  if (webDpr !== 'PASS') failures.push(`apps/web dpr ${webDpr}`);
  if (hydrationErrors.length) failures.push(`hydration ${hydrationErrors[0]}`);
  if (ssrMarked) failures.push('apps/web server HTML already contained z-layout');

  const legacyFailures = await legacyRegression(browser);
  failures.push(...legacyFailures);

  let shadowStatus = 'NONE';
  const shadow = await context.newPage();
  shadow.on('response', (response) => {
    if (response.url().includes('z_layout_engine.js')) shadowStatus = String(response.status());
  });
  await shadow.goto(`${DASHBOARD_BASE}/dashboard/Html/shadow/index-skk-rkpk.workbench.html`, {
    waitUntil: 'domcontentloaded',
    timeout: 60000,
  });
  await browser.close();

  const report = {
    EVIDENCE_CLASSES: harness.EVIDENCE_CLASSES,
    failures,
    HOST_1_MATRIX: dashboardMatrix.failures.length ? 'FAIL' : 'PASS',
    HOST_2_MATRIX: webMatrix.failures.length ? 'FAIL' : 'PASS',
    COARSE_POINTER_EVIDENCE: coarse === 'PASS' ? 'PASS' : 'OUTSTANDING',
    NO_HOVER_EVIDENCE: coarse === 'PASS' ? 'PASS' : 'OUTSTANDING',
    FIREFOX_RESULT: families.FIREFOX === 'PRESENT' ? 'PRESENT_NOT_RUN' : 'NOT_AVAILABLE',
    WEBKIT_RESULT: families.WEBKIT === 'PRESENT' ? 'PRESENT_NOT_RUN' : 'NOT_AVAILABLE',
    CHROMIUM_RESULT: failures.length ? 'FAIL' : 'PASS',
    SSR_LAYOUT_IN_HTML: ssrMarked,
    HYDRATION_ERRORS: hydrationErrors.length,
    PRE_EXISTING_SHADOW_404: shadowStatus === '404' ? 'CARRIED_P2' : shadowStatus,
    Z_DENSITY_HOST_2: 'NOT_APPLICABLE',
  };
  console.log(JSON.stringify(report, null, 2));
  if (failures.length) process.exit(1);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
