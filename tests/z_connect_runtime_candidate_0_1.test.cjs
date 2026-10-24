'use strict';

const fs = require('fs');
const http = require('http');
const path = require('path');
const { execFileSync } = require('child_process');
const playwright = require('C:/Cursor Projects Organiser/Z_Sanctuary_Universe/node_modules/playwright');
const state = require('../apps/z-connect-candidate/candidate-state.cjs');

const ROOT = path.join(__dirname, '..');
const CANDIDATE = path.join(ROOT, 'apps/z-connect-candidate');
const FIXTURE_WT = 'C:/Cursor Projects Organiser/Z_Sanctuary_Universe_wt_z_connect_preview_0_1';
const SEALED = 'ba13df8b6a97f922b95468eadacd36f3a94e65ad';
const failures = [];

function check(ok, message) {
  if (!ok) failures.push(message);
}

function read(name) {
  return fs.readFileSync(path.join(CANDIDATE, name), 'utf8');
}

function sourceGuard() {
  const html = read('index.html');
  const logic = read('candidate-state.cjs');
  const welcome = read('welcome.cjs');
  const joined = html + logic + welcome;
  check(html.includes('>Z-Connect<') || html.includes('Z-Connect'), 'identity missing');
  check(html.includes('Soulmates is a name, not a promise.'), 'disclaimer missing');
  check(html.includes('AI assists. People decide.'), 'human-first line missing');
  check(html.includes('Limited information'), 'confidence vocabulary missing');
  check(html.includes('does not offer a destiny'), 'destiny boundary missing');
  check(html.includes('compatibility percentage'), 'percentage boundary missing');
  check(html.includes('ranking of a person\'s worth'), 'ranking boundary missing');
  check(!html.includes('checked'), 'consent box is pre-checked');
  check(!/\d+\s*%/.test(joined), 'percentage figure present');
  check(!/92%|destiny score|guaranteed compatibility/i.test(joined), 'certainty claim present');
  check(html.includes('LOCAL_RUNTIME_CANDIDATE'), 'authority label missing');
  check(!/live Z-Connect|canonical runtime/i.test(joined), 'authority overclaim present');
  check(!/fetch\(|localStorage|sessionStorage|indexedDB|document\.cookie|WebSocket|XMLHttpRequest/.test(joined), 'network or persistence API present');
  check(html.includes('../../core/z_adaptive_runtime.cjs'), 'shared runtime opt-in missing');
  check(!/\b860\b|\b1280\b|\b1600\b|layoutFromWidth|matchMedia|allowDiscoveryJourney|consentRecord/.test(read('z_anydevice_z_connect_candidate_host.js') + read('z-anydevice-z-connect-candidate-host.css')), 'second adaptive engine or consent write');
  check(html.includes('Reflect is not part of this foundation.'), 'reflect placeholder missing');
}

function behaviorGuard() {
  const visit = state.createVisit('2026-10-24T17:00:00.000Z');
  check(visit.authority === 'LOCAL_RUNTIME_CANDIDATE', 'authority drifted');
  check(visit.persistence === 'in_memory', 'persistence drifted');
  check(visit.dataClass === 'SYNTHETIC_ONLY', 'data class drifted');
  check(visit.surface === 'welcome', 'welcome did not load in state');
  check(visit.privacySettings.allowDiscoveryJourney === false, 'discovery defaulted open');
  check(state.formalDiscoveryAllowed(visit) === false, 'formal discovery started without consent');
  state.declineDiscovery(visit);
  check(visit.penalty === null, 'decline carried a penalty');
  check(visit.surface === 'welcome', 'decline left welcome');
  check(visit.discoveryStatus === 'unavailable_no_penalty', 'decline status drifted');
  check(state.formalDiscoveryAllowed(visit) === false, 'declined discovery still open');
  state.grantDiscovery(visit, '2026-10-24T17:01:00.000Z');
  check(state.formalDiscoveryAllowed(visit) === true, 'granted discovery stayed locked');
  check(visit.discoveryStatus === 'boundary_only', 'grant opened a full journey');
  check(visit.consentRecord.scope.scopeId === 'discovery_journey', 'scope drifted');
  check(visit.consentRecord.userId === state.SYNTHETIC_USER_ID, 'user id is not the synthetic fixture id');
  check(visit.privacySettings.allowDiscoveryJourney === true, 'privacy flag stayed false');
  state.returnToWelcome(visit);
  check(visit.surface === 'welcome', 'return left the boundary in state');
  check(visit.consentRecord !== null, 'return cleared a granted visit-local record');
  state.declineDiscovery(visit);
  check(visit.consentRecord === null, 'decline left a stored record');
}

function lineageGuard() {
  const head = execFileSync('git', ['rev-parse', 'cursor/soulmates/private-fixture-preview-0-1'], {
    cwd: ROOT,
    encoding: 'utf8',
  }).trim();
  check(head === SEALED, 'fixture branch moved');
  const porcelain = execFileSync('git', ['status', '--porcelain'], {
    cwd: FIXTURE_WT,
    encoding: 'utf8',
  }).trim();
  const lines = porcelain ? porcelain.split(/\r?\n/) : [];
  lines.forEach((line) => {
    check(line === '?? apps/soulmates-universe-preview/.vscode/', 'fixture worktree changed: ' + line);
  });
  const registryStatus = execFileSync('git', ['status', '--porcelain', '--', 'data/z_anydevice_adaptive_adoption_registry.json'], {
    cwd: ROOT,
    encoding: 'utf8',
  }).trim();
  check(registryStatus === '', 'registry changed');
}

function serve() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const raw = decodeURIComponent((req.url || '/').split('?')[0]);
      const name = raw === '/' ? 'index.html' : raw.replace(/^\/+/, '');
      const file = path.join(CANDIDATE, name);
      if (!file.startsWith(CANDIDATE)) {
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
        res.writeHead(200);
        res.end(body);
      });
    });
    server.listen(0, '127.0.0.1', () => resolve(server));
  });
}

async function browserGuard() {
  const server = await serve();
  const port = server.address().port;
  const base = 'http://127.0.0.1:' + port;
  const browser = await playwright.chromium.launch({ headless: true });
  const page = await browser.newPage();
  const external = [];
  page.on('request', (req) => {
    const url = req.url();
    if (url.startsWith(base + '/')) return;
    if (url.includes('kaspersky-labs.com')) return;
    external.push(url);
  });
  try {
    await page.goto(base + '/index.html', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('h1');
    const welcome = await page.locator('h1').innerText();
    check(welcome.includes('Z-Connect'), 'welcome did not load');
    check(await page.locator('#discovery-consent').isChecked() === false, 'box started checked');
    check(await page.locator('#discovery-boundary').isHidden(), 'boundary opened early');
    await page.click('#decline-discovery');
    const declined = await page.locator('#consent-note').innerText();
    check(declined.includes('There is no penalty.'), 'penalty copy appeared');
    check(await page.locator('#discovery-boundary').isHidden(), 'decline opened discovery');
    await page.click('#grant-discovery');
    const stillClosed = await page.locator('#consent-note').innerText();
    check(stillClosed.includes('Discovery stays closed'), 'unchecked grant opened discovery');
    await page.check('#discovery-consent');
    await page.click('#grant-discovery');
    check(await page.locator('#discovery-boundary').isVisible(), 'consented boundary stayed hidden');
    const boundary = await page.locator('#discovery-boundary').innerText();
    check(boundary.includes('not implemented'), 'boundary claimed a full journey');
    await page.click('#back-welcome');
    check(await page.locator('#welcome-panel').isVisible(), 'return left welcome');
    const stored = await page.evaluate(function () {
      return {
        cookie: document.cookie,
        localStorage: localStorage.length,
        sessionStorage: sessionStorage.length,
        indexedDB: typeof indexedDB === 'undefined',
      };
    });
    check(stored.cookie === '', 'cookie was written');
    check(stored.localStorage === 0, 'localStorage was written');
    check(stored.sessionStorage === 0, 'sessionStorage was written');
    check(stored.indexedDB === false, 'indexedDB missing from the browser');
    check(external.length === 0, 'network calls ' + external.join(','));
  } finally {
    await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }
}

(async () => {
  sourceGuard();
  behaviorGuard();
  lineageGuard();
  await browserGuard();
  if (failures.length) {
    console.log(JSON.stringify({ failures }, null, 2));
    process.exit(1);
  }
  console.log(JSON.stringify({ failures: [], WELCOME: 'PASS', CONTRACT_TRACEABILITY: 'PASS' }));
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
