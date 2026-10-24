'use strict';

const fs = require('fs');
const http = require('http');
const path = require('path');
const { execFileSync } = require('child_process');
const playwright = require('C:/Cursor Projects Organiser/Z_Sanctuary_Universe/node_modules/playwright');
const harness = require('./z_adaptive_harness.cjs');
const hosts = require('./z_adaptive_hosts.cjs');
const runtime = require('../core/z_adaptive_runtime.cjs');

const ROOT = path.join(__dirname, '..');
const PORT = Number(process.env.Z_CONNECT_CANDIDATE_PORT || 4215);
const DASH = 'http://127.0.0.1:' + PORT;
const WEB = process.env.Z_ADAPTIVE_WEB_BASE || 'http://127.0.0.1:4216';
const FOUNDATION = '05c594bf760fdb91a1ea3d59480484b91d94bc9b';
const MATRIX = harness.MATRIX || [
  [320, 568], [360, 640], [390, 844], [430, 932], [600, 960], [768, 1024],
  [1024, 768], [1280, 720], [1366, 768], [1440, 900], [1920, 1080], [2560, 1440],
];
const TRUTH = [
  'Z-Connect',
  'Soulmates is a name, not a promise.',
  'LOCAL_RUNTIME_CANDIDATE',
  'Limited information',
  'does not offer a destiny',
  'compatibility percentage',
  'ranking of a person\'s worth',
  'does not call a model',
  'Reflect is not part of this foundation.',
];
const TARGETS = ['a.skip', '#discovery-consent-control', '#grant-discovery', '#decline-discovery'];

function candidateHost() {
  return {
    id: 'Z_CONNECT_CONTRACT_CANDIDATE',
    architecture: 'traditional-html',
    base: DASH,
    path: '/apps/z-connect-candidate/index.html',
    ready: 'document.documentElement.getAttribute(\'z-layout\') && window.ZConnectCandidateView',
    optInTarget: 'body',
    headingSelector: 'h1, h2, #reflect-placeholder',
    linkSelector: 'a.skip',
    criticalSelectors: ['h1', '#welcome-panel', '#decline-discovery', '#grant-discovery', '#discovery-consent', '#reflect-placeholder'],
    keyboardSelector: '#decline-discovery',
    density: 'absent',
    cssNeedles: ['100dvh', 'safe-area-inset', 'prefers-reduced-motion'],
    settleMs: 50,
  };
}

function sourceGuard() {
  const failures = [];
  const adapter = fs.readFileSync(path.join(ROOT, 'apps/z-connect-candidate/z_anydevice_z_connect_candidate_host.js'), 'utf8');
  const css = fs.readFileSync(path.join(ROOT, 'apps/z-connect-candidate/z-anydevice-z-connect-candidate-host.css'), 'utf8');
  const html = fs.readFileSync(path.join(ROOT, 'apps/z-connect-candidate/index.html'), 'utf8');
  if (/\b860\b|\b1280\b|\b1600\b|layoutFromWidth|matchMedia|devicePixelRatio/.test(adapter + css)) {
    failures.push('adapter duplicates adaptive rules');
  }
  if (/allowDiscoveryJourney|consentRecord|grantDiscovery|declineDiscovery|localStorage|fetch\(/.test(adapter)) {
    failures.push('adapter touches consent or storage');
  }
  if (!html.includes('z-anydevice-adaptive') || !html.includes('../../core/z_adaptive_runtime.cjs')) {
    failures.push('candidate opt-in incomplete');
  }
  const foundation = fs.readFileSync(path.join(ROOT, 'interface/z_adaptive_foundation.css'), 'utf8');
  if (!/min-height:\s*100vh/.test(foundation) || !/min-height:\s*100svh/.test(foundation) || !/min-height:\s*100dvh/.test(foundation)) {
    failures.push('shared dynamic viewport missing');
  }
  if (/height:\s*100(?:sv|dv|v)h/.test(css)) failures.push('host forces full-screen height');
  if (!html.includes('LOCAL_RUNTIME_CANDIDATE') || /canonical runtime|live Z-Connect/i.test(html)) {
    failures.push('authority overclaim');
  }
  const trace = execFileSync('git', ['diff', '--name-only', 'HEAD', '--', 'docs/z-connect-runtime-candidate/Z_CONNECT_RUNTIME_TRACEABILITY_0_1.md'], {
    cwd: ROOT,
    encoding: 'utf8',
  }).trim();
  if (trace) failures.push('traceability changed');
  const foundationCommit = execFileSync('git', ['rev-parse', FOUNDATION + '^{commit}'], { cwd: ROOT, encoding: 'utf8' }).trim();
  if (foundationCommit !== FOUNDATION) failures.push('foundation sha moved');
  try {
    execFileSync('git', ['merge-base', '--is-ancestor', FOUNDATION, 'HEAD'], { cwd: ROOT, stdio: 'ignore' });
  } catch (error) {
    failures.push('foundation sha moved ' + (error && error.status));
  }
  const registry = execFileSync('git', ['status', '--porcelain', '--', 'data/z_anydevice_adaptive_adoption_registry.json'], {
    cwd: ROOT,
    encoding: 'utf8',
  }).trim();
  if (registry) failures.push('registry changed');
  return failures;
}

function serve() {
  const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.cjs': 'text/javascript', '.json': 'application/json' };
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const raw = decodeURIComponent((req.url || '/').split('?')[0]);
      const name = raw === '/' ? 'index.html' : raw.replace(/^\/+/, '');
      const file = path.normalize(path.join(ROOT, name));
      if (!file.startsWith(ROOT)) {
        res.writeHead(403);
        res.end();
        return;
      }
      fs.readFile(file, (error, body) => {
        if (error) {
          res.writeHead(404);
          res.end();
          return;
        }
        res.writeHead(200, { 'content-type': types[path.extname(file)] || 'application/octet-stream' });
        res.end(body);
      });
    });
    server.listen(PORT, '127.0.0.1', () => resolve(server));
  });
}

async function view(page) {
  return page.evaluate(() => window.ZConnectCandidateView());
}

async function pageText(page) {
  return page.evaluate(() => document.body.textContent);
}

function truthFailures(text, label) {
  const failures = [];
  TRUTH.forEach((needle) => {
    if (!text.includes(needle)) failures.push(label + ' missing ' + needle);
  });
  if (/\d+\s*%|destiny score|guaranteed compatibility|live Z-Connect|canonical runtime/i.test(text)) {
    failures.push(label + ' business truth drift');
  }
  return failures;
}

async function privacy(page) {
  return page.evaluate(async () => {
    const bases = indexedDB.databases ? await indexedDB.databases() : [];
    return {
      cookie: document.cookie,
      localStorage: localStorage.length,
      sessionStorage: sessionStorage.length,
      databases: bases.length,
    };
  });
}

async function resizeParity(page) {
  const failures = [];
  const layouts = new Set();
  async function across(expected, phase) {
    for (const [width, height] of MATRIX) {
      await page.setViewportSize({ width, height });
      await page.waitForTimeout(80);
      const snap = await page.evaluate(() => {
        const root = document.documentElement;
        const box = window.visualViewport;
        return {
          state: window.ZConnectCandidateView(),
          layout: root.getAttribute('z-layout'),
          orientation: root.getAttribute('z-orientation'),
          pointer: root.getAttribute('z-pointer'),
          hover: root.getAttribute('z-hover'),
          motion: root.getAttribute('z-motion'),
          offline: root.getAttribute('z-offline'),
          density: root.getAttribute('z-density'),
          width: box ? box.width : window.innerWidth,
          scale: box ? box.scale : null,
          source: box && box.width > 0 ? 'visualViewport' : 'innerWidth',
          boundaryHidden: document.getElementById('discovery-boundary').hidden,
          welcomeHidden: document.getElementById('welcome-panel').hidden,
          scrollX: window.scrollX || 0,
        };
      });
      layouts.add(runtime.layoutFromWidth(snap.width));
      if (snap.layout !== runtime.layoutFromWidth(snap.width)) failures.push(phase + ' layout ' + width);
      if (snap.scale && snap.scale !== 1 && snap.layout === runtime.layoutFromWidth(snap.width / snap.scale) && runtime.layoutFromWidth(snap.width / snap.scale) !== snap.layout) {
        failures.push(phase + ' scale drove layout');
      }
      if (snap.density) failures.push(phase + ' density');
      if (snap.source !== 'visualViewport') failures.push(phase + ' viewport source ' + snap.source);
      if (snap.scale && snap.scale !== 1) {
        const visual = runtime.layoutFromWidth(snap.width);
        const divided = runtime.layoutFromWidth(snap.width / snap.scale);
        if (divided !== visual && snap.layout === divided) failures.push(phase + ' scale drove layout');
      }
      if (snap.scrollX !== 0) failures.push(phase + ' scroll ' + width);
      if (snap.welcomeHidden) failures.push(phase + ' welcome hidden ' + width);
      if (JSON.stringify(snap.state) !== JSON.stringify(expected)) failures.push(phase + ' state changed at ' + width);
      if (phase === 'before' && (!snap.boundaryHidden || snap.state.allowDiscoveryJourney || snap.state.scopeId)) {
        failures.push(phase + ' discovery opened ' + width);
      }
      if (phase === 'granted' && (snap.boundaryHidden || snap.state.surface !== 'discovery_boundary')) {
        failures.push(phase + ' gate closed ' + width);
      }
      if (phase === 'declined' && (!snap.boundaryHidden || snap.state.scopeId || snap.state.penalty !== null)) {
        failures.push(phase + ' decline drifted ' + width);
      }
      const text = await pageText(page);
      failures.push(...truthFailures(text, phase + ' ' + width));
      const stored = await privacy(page);
      if (stored.cookie || stored.localStorage || stored.sessionStorage || stored.databases) {
        failures.push(phase + ' persistence ' + width);
      }
    }
  }
  await page.setViewportSize({ width: 390, height: 844 });
  const before = await view(page);
  if (before.allowDiscoveryJourney || before.scopeId || before.surface !== 'welcome') failures.push('initial consent');
  await across(before, 'before');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.check('#discovery-consent');
  await page.click('#grant-discovery');
  const granted = await view(page);
  if (!granted.allowDiscoveryJourney || granted.scopeId !== 'discovery_journey' || granted.surface !== 'discovery_boundary') {
    failures.push('grant failed ' + JSON.stringify(granted));
  }
  await across(granted, 'granted');
  await page.click('#decline-discovery');
  const declined = await view(page);
  if (declined.allowDiscoveryJourney || declined.scopeId || declined.surface !== 'welcome' || declined.penalty !== null) {
    failures.push('decline failed ' + JSON.stringify(declined));
  }
  const note = await page.locator('#consent-note').innerText();
  if (!note.includes('There is no penalty.')) failures.push('penalty copy');
  await across(declined, 'declined');
  ['mobile', 'compact', 'standard', 'wide'].forEach((name) => {
    if (!layouts.has(name)) failures.push('missing layout ' + name);
  });
  return failures;
}

async function targets(page) {
  return page.evaluate((selectors) => {
    const nodes = selectors.map((sel) => document.querySelector(sel)).filter(Boolean);
    const samples = nodes.map((el) => {
      el.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      const rect = el.getBoundingClientRect();
      return { sel: el.id || el.className, w: Math.round(rect.width), h: Math.round(rect.height) };
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
  }, TARGETS);
}

async function keyboardPath(page) {
  await page.locator('a.skip').focus();
  const seen = [];
  for (let i = 0; i < 8; i += 1) {
    const current = await page.evaluate(() => {
      const el = document.activeElement;
      const style = el ? getComputedStyle(el) : null;
      return {
        id: el && el.id,
        tag: el && el.tagName,
        outline: style ? style.outlineStyle : '',
      };
    });
    seen.push(current);
    await page.keyboard.press('Tab');
  }
  return seen;
}

(async () => {
  const failures = sourceGuard();
  const injected = [];
  const external = [];
  const server = await serve();
  const host = candidateHost();
  const summary = {};
  try {
    for (const engine of ['chromium', 'firefox', 'webkit']) {
      const browser = await playwright[engine].launch({ headless: true, timeout: 30000 });
      const fresh = engine !== 'chromium';
      const spec = Object.assign({}, host, { freshPage: fresh });
      const originalContext = browser.newContext.bind(browser);
      browser.newContext = async function (options) {
        const created = await originalContext(options);
        created.on('request', (req) => {
          const url = req.url();
          if (url.startsWith(DASH + '/') || url.startsWith(WEB + '/')) return;
          if (url.includes('kaspersky-labs.com')) {
            injected.push(engine + ' ' + url);
            return;
          }
          external.push(engine + ' ' + url);
        });
        return created;
      };
      const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
      const page = await context.newPage();
      const matrix = await harness.runMatrix(fresh ? null : page, spec, browser);
      failures.push(...matrix.failures.map((item) => engine + ' ' + item));
      summary[engine + 'Layouts'] = matrix.truthLayouts;
      if (engine === 'chromium') failures.push(...(await resizeParity(page)).map((item) => 'parity ' + item));
      await harness.openHost(page, host);
      const keys = await harness.runKeyboard(page, host);
      if (!keys.matches) failures.push(engine + ' keyboard');
      const motion = await harness.runReducedMotion(browser, host);
      if (motion !== 'PASS') failures.push(engine + ' motion ' + motion);
      const dpr = await harness.runDpr(browser, host);
      if (dpr !== 'PASS') failures.push(engine + ' dpr ' + dpr);
      const touch = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true });
      const touchPage = await touch.newPage();
      await harness.openHost(touchPage, host);
      await touchPage.waitForFunction(() => document.documentElement.getAttribute('z-pointer') === 'coarse', null, { timeout: 12000 });
      const coarse = await targets(touchPage);
      if (coarse.pointer !== 'coarse' || coarse.hover !== 'none') failures.push(engine + ' coarse signal');
      coarse.samples.forEach((sample) => {
        if (sample.w < 44 || sample.h < 44) failures.push(engine + ' target ' + sample.sel + ' ' + sample.w + 'x' + sample.h);
      });
      if (coarse.collisions) failures.push(engine + ' collisions ' + coarse.collisions);
      await touchPage.check('#discovery-consent');
      await touchPage.click('#grant-discovery');
      const back = await touchPage.evaluate(() => {
        const el = document.getElementById('back-welcome');
        el.scrollIntoView({ block: 'nearest' });
        const rect = el.getBoundingClientRect();
        return { w: Math.round(rect.width), h: Math.round(rect.height), hidden: el.closest('[hidden]') !== null };
      });
      if (back.hidden || back.w < 44 || back.h < 44) failures.push(engine + ' return target ' + JSON.stringify(back));
      const wideTouch = await browser.newContext({ viewport: { width: 1920, height: 1080 }, hasTouch: true });
      const widePage = await wideTouch.newPage();
      await harness.openHost(widePage, host);
      const wide = await widePage.evaluate(() => ({
        layout: document.documentElement.getAttribute('z-layout'),
        pointer: document.documentElement.getAttribute('z-pointer'),
        state: window.ZConnectCandidateView(),
      }));
      if (wide.layout !== 'wide' || wide.pointer !== 'coarse') failures.push(engine + ' wide coarse ' + JSON.stringify(wide));
      if (wide.state.allowDiscoveryJourney) failures.push(engine + ' wide coarse granted consent');
      const fine = await browser.newContext({ viewport: { width: 1440, height: 900 }, hasTouch: false });
      const finePage = await fine.newPage();
      await harness.openHost(finePage, host);
      const fineSnap = await finePage.evaluate(() => ({
        pointer: document.documentElement.getAttribute('z-pointer'),
        hover: document.documentElement.getAttribute('z-hover'),
      }));
      if (fineSnap.pointer !== 'fine') failures.push(engine + ' fine ' + fineSnap.pointer);
      if (fineSnap.hover !== 'hover') failures.push(engine + ' hover ' + fineSnap.hover);
      const pathKeys = await keyboardPath(finePage);
      const ids = pathKeys.map((item) => item.id).filter(Boolean);
      ['discovery-consent', 'grant-discovery', 'decline-discovery'].forEach((id) => {
        if (!ids.includes(id)) failures.push(engine + ' key path missing ' + id);
      });
      if (pathKeys.some((item) => item.id && item.outline === 'none')) failures.push(engine + ' focus outline missing');
      await finePage.check('#discovery-consent');
      await finePage.click('#grant-discovery');
      await finePage.locator('#back-welcome').focus();
      const backFocus = await finePage.evaluate(() => document.activeElement && document.activeElement.id);
      if (backFocus !== 'back-welcome') failures.push(engine + ' return focus');
      const safe = await finePage.evaluate(() => {
        const body = getComputedStyle(document.body);
        const top = document.querySelector('a.skip').getBoundingClientRect().top;
        return {
          pad: parseFloat(body.paddingTop),
          top,
          css: [...document.styleSheets].some((sheet) => {
            try {
              return [...sheet.cssRules].some((rule) => rule.cssText.includes('safe-area-inset'));
            } catch (error) {
              return false;
            }
          }),
        };
      });
      if (safe.pad < 16 || safe.top < 0 || !safe.css) failures.push(engine + ' safe area ' + JSON.stringify(safe));
      await browser.close();
      console.log(engine, 'candidate', failures.filter((item) => item.startsWith(engine) || item.startsWith('parity')).length);
    }

    const browser = await playwright.chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    const dash = await harness.runMatrix(page, hosts.unifiedDashboard(DASH));
    const web = await harness.runMatrix(page, hosts.appsWeb(WEB));
    const mission = await harness.runMatrix(page, hosts.amkMainControl(DASH));
    const golden = await harness.runMatrix(page, hosts.goldenWebsite(DASH));
    failures.push(...dash.failures.map((item) => 'host1 ' + item));
    failures.push(...web.failures.map((item) => 'host2 ' + item));
    failures.push(...mission.failures.map((item) => 'host3 ' + item));
    failures.push(...golden.failures.map((item) => 'host4 ' + item));
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
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }

  const report = {
    failures,
    injected: injected.length,
    external: external.length,
    CHROMIUM: failures.some((item) => item.startsWith('chromium ') || item.startsWith('parity ')) ? 'FAIL' : 'PASS',
    FIREFOX: failures.some((item) => item.startsWith('firefox ')) ? 'FAIL' : 'PASS',
    WEBKIT: failures.some((item) => item.startsWith('webkit ')) ? 'FAIL' : 'PASS',
    HOST_1: failures.some((item) => item.startsWith('host1 ')) ? 'FAIL' : 'PASS',
    HOST_2: failures.some((item) => item.startsWith('host2 ')) ? 'FAIL' : 'PASS',
    HOST_3: failures.some((item) => item.startsWith('host3 ')) ? 'FAIL' : 'PASS',
    HOST_4: failures.some((item) => item.startsWith('host4 ')) ? 'FAIL' : 'PASS',
    LEGACY: failures.some((item) => item.startsWith('legacy ')) ? 'FAIL' : 'PASS',
    layouts: summary,
  };
  console.log(JSON.stringify(report, null, 2));
  if (failures.length || external.length) process.exit(1);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
