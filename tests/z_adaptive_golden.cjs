'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const playwright = require('C:/Cursor Projects Organiser/Z_Sanctuary_Universe/node_modules/playwright');
const harness = require('./z_adaptive_harness.cjs');
const hosts = require('./z_adaptive_hosts.cjs');
const runtime = require('../core/z_adaptive_runtime.cjs');

const ROOT = path.join(__dirname, '..');
const DASH = process.env.Z_ADAPTIVE_DASHBOARD_BASE || 'http://127.0.0.1:4205';
const WEB = process.env.Z_ADAPTIVE_WEB_BASE || 'http://127.0.0.1:4206';
const REGISTRY = path.join(ROOT, 'data', 'z_anydevice_adaptive_adoption_registry.json');
const PUBLIC_JS = path.join(ROOT, 'docs/golden-website/shell/data/gw-approved-public-safe.js');
const PUBLIC_JSON = path.join(ROOT, 'data/golden-website/public/gw_approved_public_safe_adapter.json');
const LAYOUTS = [[390, 844], [1024, 768], [1440, 900], [1920, 1080]];
const TRUTH = [
  'The Golden Website',
  'not published',
  'not deployed',
  'QUALIFIED is not VERIFIED',
  'Coming through evidence gates',
  'Z-Sanctuary Core',
  'Universal Workstation Navigator',
  '14 DRP Protocols',
  'Z-EAII',
  'Grounded Questions (QADP)',
  'Cycle Observe',
];

function sha(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

function sourceGuard() {
  const failures = [];
  const host = fs.readFileSync(path.join(ROOT, 'docs/golden-website/shell/js/z_anydevice_golden_host.js'), 'utf8');
  const html = fs.readFileSync(path.join(ROOT, 'docs/golden-website/shell/index.html'), 'utf8');
  const siblings = [
    'portfolio.html', 'universe-map.html', 'gallery.html', 'museum.html',
    'guide-sandbox.html', 'gateway.html', 'ai-integrity.html', 'core.html', 'navigator.html',
  ];
  if (/\b860\b|\b1280\b|\b1600\b|layoutFromWidth|matchMedia/.test(host)) failures.push('adapter duplicates adaptive rules');
  if (/z-density|writeFile|quarantine|approval|records\.filter/.test(host)) failures.push('adapter filters or certifies');
  if (!html.includes('z-anydevice-adaptive') || !html.includes('z_adaptive_runtime.cjs') || !html.includes('viewport-fit=cover')) {
    failures.push('home opt-in incomplete');
  }
  siblings.forEach((name) => {
    const page = fs.readFileSync(path.join(ROOT, 'docs/golden-website/shell', name), 'utf8');
    if (page.includes('z-anydevice-adaptive') || page.includes('z_adaptive_runtime')) failures.push('sibling opted in ' + name);
  });
  return failures;
}

async function truthAt(browser, width, height) {
  const context = await browser.newContext({ viewport: { width, height } });
  const page = await context.newPage();
  try {
    await page.goto(DASH + '/docs/golden-website/shell/index.html', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForFunction(() => {
      return document.documentElement.getAttribute('z-layout') && document.body.textContent.indexOf('QUALIFIED is not VERIFIED') !== -1;
    }, null, { timeout: 15000 });
    return await page.evaluate((needles) => {
      window.scrollTo(800, 0);
      const scrollX = window.scrollX || 0;
      window.scrollTo(0, 0);
      const text = document.body.textContent;
      const root = document.documentElement;
      const records = window.GW_APPROVED && window.GW_APPROVED.records
        ? window.GW_APPROVED.records.map((row) => row.canonical_id).sort()
        : [];
      return {
        layout: root.getAttribute('z-layout'),
        pointer: root.getAttribute('z-pointer'),
        density: root.getAttribute('z-density'),
        scrollX,
        width: window.visualViewport ? window.visualViewport.width : window.innerWidth,
        records,
        missing: needles.filter((needle) => !text.includes(needle)),
      };
    }, TRUTH);
  } finally {
    await context.close();
  }
}

(async () => {
  const failures = sourceGuard();
  const beforeRegistry = fs.readFileSync(REGISTRY);
  const beforeJs = sha(PUBLIC_JS);
  const beforeJson = sha(PUBLIC_JSON);
  const host = hosts.goldenWebsite(DASH);
  for (const engine of ['chromium', 'firefox', 'webkit']) {
    const browser = await playwright[engine].launch({ headless: true, timeout: 30000 });
    const fresh = engine !== 'chromium';
    const spec = Object.assign({}, host, { freshPage: fresh });
    const page = fresh ? null : await browser.newPage({ viewport: { width: 1440, height: 900 } });
    const matrix = await harness.runMatrix(page, spec, browser);
    failures.push(...matrix.failures.map((item) => engine + ' ' + item));
    for (const [width, height] of LAYOUTS) {
      const snap = await truthAt(browser, width, height);
      if (snap.layout !== runtime.layoutFromWidth(snap.width)) failures.push(engine + ' truth layout ' + width);
      if (snap.scrollX !== 0) failures.push(engine + ' truth scroll ' + width);
      if (snap.density) failures.push(engine + ' invented density');
      if (engine === 'chromium' && width === 390 && snap.pointer !== 'fine') failures.push('fine pointer inferred from width');
      snap.missing.forEach((needle) => failures.push(engine + ' missing ' + needle + ' at ' + width));
    }
    let keyPage = page;
    let keyContext = null;
    if (!keyPage) {
      keyContext = await browser.newContext({ viewport: { width: 1280, height: 800 } });
      keyPage = await keyContext.newPage();
      await keyPage.goto(host.base + host.path, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await keyPage.waitForFunction(host.ready, null, { timeout: 15000 });
    }
    const keys = await harness.runKeyboard(keyPage, host);
    if (keyContext) await keyContext.close();
    if (!keys.matches) failures.push(engine + ' keyboard');
    const motion = await harness.runReducedMotion(browser, host);
    if (motion !== 'PASS') failures.push(engine + ' motion ' + motion);
    const touch = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true });
    const touchPage = await touch.newPage();
    await touchPage.goto(host.base + host.path, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await touchPage.waitForFunction(() => document.documentElement.getAttribute('z-pointer') === 'coarse', null, { timeout: 12000 });
    await touchPage.locator('a.skip').focus();
    const targets = await touchPage.evaluate(() => {
      const nodes = ['nav.primary a', '#gw-evidence-toggle', '#gw-portfolio a.cta', 'a.skip']
        .map((sel) => document.querySelector(sel))
        .filter(Boolean);
      const samples = nodes.map((el) => {
        const rect = el.getBoundingClientRect();
        return { sel: el.id || el.textContent.trim().slice(0, 24), w: Math.round(rect.width), h: Math.round(rect.height) };
      });
      let collisions = 0;
      for (let i = 0; i < nodes.length; i += 1) {
        const a = nodes[i].getBoundingClientRect();
        if (a.width < 8 || a.bottom < 0 || a.top > window.innerHeight) continue;
        for (let j = i + 1; j < nodes.length; j += 1) {
          const b = nodes[j].getBoundingClientRect();
          if (b.width < 8 || b.bottom < 0 || b.top > window.innerHeight) continue;
          const x = Math.min(a.right, b.right) - Math.max(a.left, b.left);
          const y = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
          if (x > 2 && y > 2) collisions += 1;
        }
      }
      return {
        pointer: document.documentElement.getAttribute('z-pointer'),
        hover: document.documentElement.getAttribute('z-hover'),
        samples,
        collisions,
      };
    });
    if (targets.pointer !== 'coarse' || targets.hover !== 'none') failures.push(engine + ' coarse signal');
    targets.samples.forEach((sample) => {
      if (sample.w < 44 || sample.h < 44) failures.push(engine + ' target ' + sample.sel + ' ' + sample.w + 'x' + sample.h);
    });
    if (targets.collisions) failures.push(engine + ' collisions ' + targets.collisions);
    const wideTouch = await browser.newContext({ viewport: { width: 1920, height: 1080 }, hasTouch: true });
    const widePage = await wideTouch.newPage();
    await widePage.goto(host.base + host.path, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await widePage.waitForFunction(() => document.documentElement.getAttribute('z-layout'), null, { timeout: 12000 });
    const widePointer = await widePage.evaluate(() => ({
      layout: document.documentElement.getAttribute('z-layout'),
      pointer: document.documentElement.getAttribute('z-pointer'),
    }));
    if (widePointer.layout !== 'wide' || widePointer.pointer !== 'coarse') failures.push(engine + ' wide coarse ' + JSON.stringify(widePointer));
    await browser.close();
    console.log(engine, 'done', failures.filter((item) => item.startsWith(engine)).length);
  }

  const browser = await playwright.chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const dash = await harness.runMatrix(page, hosts.unifiedDashboard(DASH));
  const web = await harness.runMatrix(page, hosts.appsWeb(WEB));
  const mission = await harness.runMatrix(page, hosts.amkMainControl(DASH));
  failures.push(...dash.failures.map((item) => 'host1 ' + item));
  failures.push(...web.failures.map((item) => 'host2 ' + item));
  failures.push(...mission.failures.map((item) => 'host3 ' + item));
  const legacy = await browser.newContext({ viewport: { width: 1000, height: 800 } });
  const legacyPage = await legacy.newPage();
  await legacyPage.goto(DASH + '/tests/fixtures/z_adaptive_legacy_host.html', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await legacyPage.waitForFunction(() => document.documentElement.getAttribute('z-viewport'), null, { timeout: 12000 });
  const legacySnap = await legacyPage.evaluate(() => ({
    layout: document.documentElement.getAttribute('z-layout'),
    tablet: document.body.classList.contains('zvp-tablet'),
    optIn: document.body.classList.contains('z-anydevice-adaptive'),
  }));
  if (legacySnap.layout || legacySnap.optIn || !legacySnap.tablet) failures.push('legacy ' + JSON.stringify(legacySnap));
  await browser.close();
  if (!beforeRegistry.equals(fs.readFileSync(REGISTRY))) failures.push('registry bytes changed');
  if (beforeJs !== sha(PUBLIC_JS) || beforeJson !== sha(PUBLIC_JSON)) failures.push('public record set changed');
  const registry = JSON.parse(beforeRegistry.toString('utf8'));
  const golden = registry.candidate_backlog.find((row) => row.project_id === 'z-golden');
  if (!golden || golden.status !== 'NOT_TESTED') failures.push('golden registry status moved');
  console.log(JSON.stringify({
    failures,
    GOLDEN: failures.some((item) => /^(chromium|firefox|webkit) /.test(item)) ? 'FAIL' : 'PASS',
    HOST_1: failures.some((item) => item.startsWith('host1 ')) ? 'FAIL' : 'PASS',
    HOST_2: failures.some((item) => item.startsWith('host2 ')) ? 'FAIL' : 'PASS',
    HOST_3: failures.some((item) => item.startsWith('host3 ')) ? 'FAIL' : 'PASS',
  }, null, 2));
  if (failures.length) process.exit(1);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
