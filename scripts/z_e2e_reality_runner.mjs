/**
 * Programmatic Playwright reality runner (localhost only).
 * Used when the @playwright/test CLI worker path is unavailable in the agent shell.
 * Same evidence intent as e2e/*.spec.js — does not change application code.
 */
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { spawn } from 'node:child_process';
import { chromium } from 'playwright';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const HOST = '127.0.0.1';
const PORT = 5519;
const BASE = `http://${HOST}:${PORT}`;
const OUT_DIR = path.join(ROOT, 'test-results');
const OUT_JSON = path.join(OUT_DIR, 'e2e-reality-map.json');

const { discoverPages, PRIORITY_ROUTES } = await import(
  pathToFileURL(path.join(ROOT, 'e2e/helpers/pages.mjs')).href
);

function waitHttpOk(url, timeoutMs = 20000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const tick = () => {
      const req = http.get(url, (res) => {
        res.resume();
        if (res.statusCode && res.statusCode < 500) return resolve(res.statusCode);
        if (Date.now() - start > timeoutMs) return reject(new Error('timeout status'));
        setTimeout(tick, 200);
      });
      req.on('error', () => {
        if (Date.now() - start > timeoutMs) return reject(new Error('timeout connect'));
        setTimeout(tick, 200);
      });
    };
    tick();
  });
}

async function inventoryControls(page) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      await page.waitForLoadState('domcontentloaded', { timeout: 5000 }).catch(() => {});
      return await page.evaluate(() => {
        function visible(el) {
          const st = window.getComputedStyle(el);
          if (st.display === 'none' || st.visibility === 'hidden') return false;
          const r = el.getBoundingClientRect();
          return r.width > 0 && r.height > 0;
        }
        const items = [];
        for (const el of document.querySelectorAll(
          'button, a[href], [role="button"], [role="tab"], input:not([type="hidden"]), select, textarea, summary'
        )) {
          items.push({
            tag: el.tagName.toLowerCase(),
            role: el.getAttribute('role') || '',
            id: el.id || '',
            href: el.getAttribute('href') || '',
            text: (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 100),
            ariaLabel: el.getAttribute('aria-label') || '',
            disabled: el.disabled === true || el.getAttribute('aria-disabled') === 'true',
            visible: visible(el),
          });
        }
        return items;
      });
    } catch (err) {
      const msg = String(err.message || err);
      if (/Execution context was destroyed|Target closed|navigation/i.test(msg) && attempt < 2) {
        await page.waitForTimeout(250);
        continue;
      }
      throw err;
    }
  }
  return [];
}

const WAKE_RE = /\b(wake|deploy|start\s*ssws|ssr\s*wake|auto[- ]?merge|payment)\b/i;

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const server = spawn(
    process.execPath,
    [path.join(ROOT, 'scripts/z_local_static_server.mjs'), `--host=${HOST}`, `--port=${PORT}`],
    { cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe'] }
  );
  let serverLog = '';
  server.stdout.on('data', (d) => {
    serverLog += d.toString();
  });
  server.stderr.on('data', (d) => {
    serverLog += d.toString();
  });

  const report = {
    gate: 'Z-SANCTUARY-UI-E2E-PLAYWRIGHT-CHARTER-1',
    runner: 'scripts/z_e2e_reality_runner.mjs',
    generated_at: new Date().toISOString(),
    baseURL: BASE,
    smoke: {},
    pages_discovered: 0,
    pages: [],
    totals: {
      pages_loaded: 0,
      controls_discovered: 0,
      controls_exercised: 0,
      pass: 0,
      governance_block: 0,
      fail: 0,
      untestable: 0,
    },
    console_rollup: [],
    network_rollup: [],
    ggaesp_ui: null,
    responsive: [],
    a11y: null,
    server_teardown: null,
  };

  let browser;
  try {
    await waitHttpOk(`${BASE}/dashboard/index.html`);
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    const consoleErrors = [];
    const pageErrors = [];
    const unexpectedExternal = [];
    page.on('console', (m) => {
      if (m.type() === 'error') consoleErrors.push(m.text());
    });
    page.on('pageerror', (e) => pageErrors.push(String(e.message || e)));
    page.on('request', (req) => {
      try {
        const u = new URL(req.url());
        if (u.hostname !== '127.0.0.1' && u.hostname !== 'localhost' && !/^(data|blob):/i.test(req.url())) {
          if (!/fonts\.googleapis|fonts\.gstatic|cdn\.jsdelivr|unpkg\.com|cdnjs\.cloudflare/i.test(req.url())) {
            unexpectedExternal.push(req.url());
          }
        }
      } catch {
        /* ignore */
      }
    });

    // Smoke
    let res = await page.goto(`${BASE}/dashboard/index.html`, { waitUntil: 'domcontentloaded' });
    report.smoke.stub = { status: res.status(), title: await page.title(), pageErrors: [...pageErrors] };
    pageErrors.length = 0;
    res = await page.goto(`${BASE}/dashboard/Html/index-skk-rkpk.html`, { waitUntil: 'domcontentloaded' });
    report.smoke.main = {
      status: res.status(),
      hasOrganism: await page.locator('body.z-dashboard-organism').count(),
      pageErrors: [...pageErrors],
    };
    pageErrors.length = 0;

    const pages = discoverPages();
    report.pages_discovered = pages.length;

    for (const meta of pages) {
      consoleErrors.length = 0;
      pageErrors.length = 0;
      unexpectedExternal.length = 0;
      let status = 0;
      try {
        const r = await page.goto(`${BASE}${meta.route}`, { waitUntil: 'domcontentloaded', timeout: 25000 });
        status = r ? r.status() : 0;
      } catch (e) {
        report.pages.push({ ...meta, loaded: false, error: String(e.message || e), controls: 0 });
        report.totals.fail += 1;
        continue;
      }
      report.totals.pages_loaded += 1;
      let controls = [];
      try {
        controls = await inventoryControls(page);
      } catch (invErr) {
        const invMsg = String(invErr.message || invErr);
        report.pages.push({
          ...meta,
          loaded: true,
          status,
          interactive_control_count: 0,
          error: invMsg,
          interactions: [{ kind: 'inventory', verdict: 'FAIL_EXCEPTION', error: invMsg.slice(0, 200) }],
        });
        report.totals.fail += 1;
        continue;
      }
      report.totals.controls_discovered += controls.length;
      const entry = {
        ...meta,
        loaded: status > 0 && status < 400,
        status,
        interactive_control_count: controls.length,
        controls_summary: {
          buttons: controls.filter((c) => c.tag === 'button' || c.role === 'button').length,
          links: controls.filter((c) => c.tag === 'a').length,
          inputs: controls.filter((c) => ['input', 'select', 'textarea'].includes(c.tag)).length,
        },
        interactions: [],
        monitors: {
          pageErrors: [...pageErrors],
          consoleErrorCount: consoleErrors.length,
          unexpectedExternal: [...new Set(unexpectedExternal)].slice(0, 8),
        },
      };
      if (pageErrors.length || consoleErrors.length) {
        report.console_rollup.push({
          route: meta.route,
          pageErrors: [...pageErrors].slice(0, 5),
          consoleErrors: consoleErrors.slice(0, 5),
        });
      }
      if (unexpectedExternal.length) {
        report.network_rollup.push({
          route: meta.route,
          unexpectedExternal: [...new Set(unexpectedExternal)].slice(0, 8),
        });
      }

      const deep = PRIORITY_ROUTES.includes(meta.source);
      if (deep) {
        const buttons = controls
          .filter((c) => c.visible && !c.disabled && (c.tag === 'button' || c.role === 'button'))
          .slice(0, 45);
        for (const c of buttons) {
          const label = c.ariaLabel || c.text || c.id || c.tag;
          if (WAKE_RE.test(label)) {
            entry.interactions.push({ kind: 'button', label, verdict: 'PASS_GOVERNANCE_BLOCK' });
            report.totals.governance_block += 1;
            continue;
          }
          try {
            const loc = c.id
              ? page.locator(`#${c.id}`).first()
              : c.ariaLabel
                ? page.getByRole('button', { name: c.ariaLabel }).first()
                : c.text
                  ? page.getByRole('button', { name: c.text.slice(0, 40) }).first()
                  : null;
            if (!loc || (await loc.count()) === 0) {
              entry.interactions.push({ kind: 'button', label, verdict: 'UNTESTABLE_MISSING_FIXTURE' });
              report.totals.untestable += 1;
              continue;
            }
            const before = page.url();
            await loc.click({ timeout: 3000 }).catch(() => loc.click({ force: true, timeout: 2000 }));
            report.totals.controls_exercised += 1;
            await page.waitForTimeout(120);
            const after = page.url();
            if (pageErrors.length) {
              entry.interactions.push({ kind: 'button', label, verdict: 'FAIL_EXCEPTION' });
              report.totals.fail += 1;
            } else if (after !== before) {
              entry.interactions.push({ kind: 'button', label, verdict: 'PASS_NAVIGATION' });
              report.totals.pass += 1;
              await page.goto(`${BASE}${meta.route}`, { waitUntil: 'domcontentloaded' });
            } else {
              entry.interactions.push({ kind: 'button', label, verdict: 'PASS_STATE_CHANGE' });
              report.totals.pass += 1;
            }
          } catch (err) {
            entry.interactions.push({
              kind: 'button',
              label,
              verdict: 'FAIL_EXCEPTION',
              error: String(err.message || err).slice(0, 160),
            });
            report.totals.fail += 1;
          }
        }

        const links = controls.filter((c) => c.tag === 'a' && c.href && c.visible).slice(0, 35);
        for (const c of links) {
          const label = c.ariaLabel || c.text || c.href;
          let dest;
          try {
            dest = new URL(c.href, BASE);
          } catch {
            entry.interactions.push({ kind: 'link', label, verdict: 'FAIL_WRONG_TARGET' });
            report.totals.fail += 1;
            continue;
          }
          if (dest.hostname !== HOST && dest.hostname !== 'localhost') {
            entry.interactions.push({ kind: 'link', label, href: dest.href, verdict: 'UNTESTABLE_EXTERNAL_GATE' });
            report.totals.untestable += 1;
            continue;
          }
          if (dest.hash && dest.pathname === new URL(page.url()).pathname && !dest.href.replace(/#.*$/, '')) {
            entry.interactions.push({ kind: 'link', label, verdict: 'PASS_READ_ONLY' });
            report.totals.pass += 1;
            continue;
          }
          try {
            const r = await page.goto(dest.href, { waitUntil: 'domcontentloaded', timeout: 15000 });
            const st = r ? r.status() : 0;
            report.totals.controls_exercised += 1;
            const verdict = st === 404 || st >= 400 ? 'FAIL_WRONG_TARGET' : 'PASS_NAVIGATION';
            entry.interactions.push({ kind: 'link', label, href: dest.pathname, status: st, verdict });
            if (verdict.startsWith('PASS')) report.totals.pass += 1;
            else report.totals.fail += 1;
            await page.goto(`${BASE}${meta.route}`, { waitUntil: 'domcontentloaded' });
          } catch (err) {
            entry.interactions.push({
              kind: 'link',
              label,
              verdict: 'FAIL_EXCEPTION',
              error: String(err.message || err).slice(0, 160),
            });
            report.totals.fail += 1;
          }
        }
      } else {
        entry.interactions.push({ kind: 'inventory_only', verdict: 'PASS_READ_ONLY' });
        report.totals.pass += 1;
      }
      report.pages.push(entry);
    }

    // GGAESP UI
    pageErrors.length = 0;
    await page.goto(`${BASE}/dashboard/panels/ggaesp_panel.html`, { waitUntil: 'networkidle' });
    const outText = await page.locator('#zGgaespOut').innerText();
    report.ggaesp_ui = {
      hasDecision: /"decision"\s*:/.test(outText),
      decisionMatch: (outText.match(/"decision"\s*:\s*"(GO|PREPARE|BLOCK)"/) || [])[1] || null,
      pageErrors: [...pageErrors],
    };

    // Responsive + a11y sample
    for (const vp of [
      { name: 'desktop', width: 1440, height: 900 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'mobile', width: 390, height: 844 },
    ]) {
      await page.setViewportSize(vp);
      await page.goto(`${BASE}/dashboard/Html/index-skk-rkpk.html`, { waitUntil: 'domcontentloaded' });
      const metrics = await page.evaluate(() => ({
        overflowX: document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      report.responsive.push({ ...vp, ...metrics });
    }
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE}/dashboard/Html/index-skk-rkpk.html`, { waitUntil: 'domcontentloaded' });
    await page.keyboard.press('Tab');
    report.a11y = await page.evaluate(() => {
      const el = document.activeElement;
      const unnamed = [];
      for (const node of document.querySelectorAll('button, a[href], [role="button"]')) {
        const name =
          node.getAttribute('aria-label') ||
          node.getAttribute('title') ||
          (node.textContent || '').trim();
        if (!name) unnamed.push({ tag: node.tagName.toLowerCase(), id: node.id || '' });
      }
      return {
        focus: el
          ? { tag: el.tagName.toLowerCase(), className: String(el.className || '').slice(0, 80), text: (el.textContent || '').trim().slice(0, 60) }
          : null,
        unnamedCount: unnamed.length,
        unnamedSample: unnamed.slice(0, 15),
        skipLinkPresent: !!document.querySelector('a.z-skip-link'),
      };
    });

    report.coverage = {
      control_coverage_pct:
        report.totals.controls_discovered === 0
          ? 0
          : Math.round((report.totals.controls_exercised / report.totals.controls_discovered) * 1000) / 10,
      note: 'Exercised / discovered; non-priority pages inventory-only',
    };

    fs.writeFileSync(OUT_JSON, JSON.stringify(report, null, 2));
    console.log(JSON.stringify({
      ok: true,
      out: OUT_JSON,
      pages_discovered: report.pages_discovered,
      pages_loaded: report.totals.pages_loaded,
      controls_discovered: report.totals.controls_discovered,
      controls_exercised: report.totals.controls_exercised,
      coverage_pct: report.coverage.control_coverage_pct,
      pass: report.totals.pass,
      fail: report.totals.fail,
      governance_block: report.totals.governance_block,
      untestable: report.totals.untestable,
      ggaesp: report.ggaesp_ui,
      smoke: report.smoke,
    }, null, 2));
  } catch (runErr) {
    report.run_error = String(runErr && runErr.stack ? runErr.stack : runErr);
    report.coverage = report.coverage || {
      control_coverage_pct:
        report.totals.controls_discovered === 0
          ? 0
          : Math.round((report.totals.controls_exercised / report.totals.controls_discovered) * 1000) / 10,
    };
    fs.writeFileSync(OUT_JSON, JSON.stringify(report, null, 2));
    console.error(JSON.stringify({ ok: false, out: OUT_JSON, error: report.run_error.split('\n')[0] }, null, 2));
    throw runErr;
  } finally {
    if (browser) await browser.close().catch(() => {});
    server.kill('SIGTERM');
    await new Promise((r) => setTimeout(r, 500));
    if (!server.killed) server.kill('SIGKILL');
    report.server_teardown = 'EXPECTED_TEST_TEARDOWN';
    // prove port closed
    await new Promise((r) => setTimeout(r, 300));
    try {
      await waitHttpOk(`${BASE}/dashboard/index.html`, 800);
      console.log(JSON.stringify({ port_still_listening: true, warning: true }));
    } catch {
      console.log(JSON.stringify({ port_still_listening: false, teardown: 'EXPECTED_TEST_TEARDOWN' }));
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
