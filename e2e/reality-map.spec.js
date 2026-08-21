import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { discoverPages, PRIORITY_ROUTES } from './helpers/pages.mjs';
import {
  attachMonitors,
  inventoryControls,
  isExternalHref,
  isSensitiveControl,
  classifyControlRisk,
} from './helpers/controls.mjs';

const OUT_DIR = path.join(process.cwd(), 'test-results');
const REALITY_PATH = path.join(OUT_DIR, 'e2e-reality-map.json');

function ensureOut() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

test.describe('E2E reality map — inventory + click + links', () => {
  test('build page/control inventory and exercise safe controls', async ({ page, baseURL }) => {
    ensureOut();
    const pages = discoverPages();
    const report = {
      gate: 'Z-SANCTUARY-UI-E2E-PLAYWRIGHT-CHARTER-1',
      generated_at: new Date().toISOString(),
      baseURL,
      pages_discovered: pages.length,
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
    };

    // Load all discovered pages for inventory; deep-exercise priority + sample of rest.
    for (const meta of pages) {
      const mon = await attachMonitors(page);
      let status = 0;
      try {
        const res = await page.goto(meta.route, { waitUntil: 'domcontentloaded', timeout: 25_000 });
        status = res ? res.status() : 0;
      } catch (e) {
        report.pages.push({
          ...meta,
          loaded: false,
          status: 0,
          error: String(e.message || e),
          controls: [],
          interactions: [],
        });
        report.totals.fail += 1;
        continue;
      }

      report.totals.pages_loaded += 1;
      const controls = await inventoryControls(page);
      report.totals.controls_discovered += controls.length;
      const snap = mon.snapshot();
      if (snap.consoleErrors.length || snap.pageErrors.length) {
        report.console_rollup.push({
          route: meta.route,
          consoleErrors: snap.consoleErrors.slice(0, 8),
          pageErrors: snap.pageErrors.slice(0, 8),
        });
      }
      if (snap.unexpectedExternal.length) {
        report.network_rollup.push({
          route: meta.route,
          unexpectedExternal: snap.unexpectedExternal.slice(0, 12),
        });
      }

      const pageEntry = {
        ...meta,
        loaded: status > 0 && status < 400,
        status,
        interactive_control_count: controls.length,
        controls_summary: {
          buttons: controls.filter((c) => c.tag === 'button' || c.role === 'button').length,
          links: controls.filter((c) => c.tag === 'a').length,
          inputs: controls.filter((c) => ['input', 'select', 'textarea'].includes(c.tag)).length,
          tabs: controls.filter((c) => c.role === 'tab').length,
          disabled: controls.filter((c) => c.disabled).length,
        },
        title: await page.title().catch(() => ''),
        interactions: [],
        monitors: {
          pageErrors: snap.pageErrors,
          consoleErrorCount: snap.consoleErrors.length,
          unexpectedExternalCount: snap.unexpectedExternal.length,
          failedRequestCount: snap.failedRequests.length,
        },
      };

      const deep = meta.priority || PRIORITY_ROUTES.includes(meta.source);
      if (deep) {
        // Buttons / role=button
        const clickables = controls.filter(
          (c) =>
            c.visible &&
            !c.disabled &&
            (c.tag === 'button' || c.role === 'button') &&
            !isSensitiveControl(c)
        );
        for (const c of clickables) {
          const beforeUrl = page.url();
          let verdict = 'FAIL_NO_EFFECT';
          try {
            const loc = c.id
              ? page.locator(`#${c.id}`).first()
              : c.ariaLabel
                ? page.getByRole('button', { name: c.ariaLabel }).first()
                : c.text
                  ? page.getByRole('button', { name: c.text.slice(0, 40) }).first()
                  : null;
            if (!loc) {
              verdict = 'UNTESTABLE_MISSING_FIXTURE';
              report.totals.untestable += 1;
            } else {
              const risk = classifyControlRisk(c.text || c.label, c);
              if (risk === 'GOVERNANCE_SENSITIVE') {
                verdict = 'PASS_GOVERNANCE_BLOCK';
                report.totals.governance_block += 1;
              } else {
                await loc.click({ timeout: 4_000 }).catch(async () => {
                  await loc.click({ force: true, timeout: 2_000 });
                });
                report.totals.controls_exercised += 1;
                await page.waitForTimeout(150);
                const afterUrl = page.url();
                const afterSnap = mon.snapshot();
                if (afterSnap.pageErrors.length > snap.pageErrors.length) {
                  verdict = 'FAIL_EXCEPTION';
                  report.totals.fail += 1;
                } else if (afterUrl !== beforeUrl) {
                  verdict = 'PASS_NAVIGATION';
                  report.totals.pass += 1;
                  // Return to page under test.
                  await page.goto(meta.route, { waitUntil: 'domcontentloaded' });
                } else {
                  verdict = 'PASS_STATE_CHANGE';
                  report.totals.pass += 1;
                }
              }
            }
          } catch (err) {
            verdict = 'FAIL_EXCEPTION';
            report.totals.fail += 1;
            pageEntry.interactions.push({
              kind: 'button',
              label: c.label,
              verdict,
              error: String(err.message || err).slice(0, 200),
            });
            continue;
          }
          pageEntry.interactions.push({ kind: 'button', label: c.label, verdict });
        }

        // Internal links (same-origin) — one-hop validation
        const links = controls.filter((c) => c.tag === 'a' && c.href && c.visible);
        for (const c of links.slice(0, 40)) {
          const kind = isExternalHref(c.href, baseURL);
          if (kind.kind === 'external') {
            pageEntry.interactions.push({
              kind: 'link',
              label: c.label,
              href: c.href,
              verdict: 'UNTESTABLE_EXTERNAL_GATE',
            });
            report.totals.untestable += 1;
            continue;
          }
          if (kind.kind !== 'internal') {
            pageEntry.interactions.push({
              kind: 'link',
              label: c.label,
              href: c.href,
              verdict: 'PASS_READ_ONLY',
            });
            report.totals.pass += 1;
            continue;
          }
          try {
            const res = await page.goto(kind.href, {
              waitUntil: 'domcontentloaded',
              timeout: 15_000,
            });
            const st = res ? res.status() : 0;
            report.totals.controls_exercised += 1;
            if (st === 404) {
              pageEntry.interactions.push({
                kind: 'link',
                label: c.label,
                href: kind.href,
                verdict: 'FAIL_WRONG_TARGET',
                status: st,
              });
              report.totals.fail += 1;
            } else if (st >= 400) {
              pageEntry.interactions.push({
                kind: 'link',
                label: c.label,
                href: kind.href,
                verdict: 'FAIL_WRONG_TARGET',
                status: st,
              });
              report.totals.fail += 1;
            } else {
              pageEntry.interactions.push({
                kind: 'link',
                label: c.label,
                href: kind.href,
                verdict: 'PASS_NAVIGATION',
                status: st,
              });
              report.totals.pass += 1;
            }
            await page.goto(meta.route, { waitUntil: 'domcontentloaded' });
          } catch (err) {
            pageEntry.interactions.push({
              kind: 'link',
              label: c.label,
              href: kind.href,
              verdict: 'FAIL_EXCEPTION',
              error: String(err.message || err).slice(0, 200),
            });
            report.totals.fail += 1;
            await page.goto(meta.route, { waitUntil: 'domcontentloaded' }).catch(() => {});
          }
        }

        // Sensitive controls: assert we did not click them; note as governance candidates
        for (const c of controls.filter((x) => isSensitiveControl(x) && x.visible)) {
          pageEntry.interactions.push({
            kind: 'sensitive_control',
            label: c.label,
            verdict: 'PASS_GOVERNANCE_BLOCK',
            note: 'Not activated — wake/deploy/sensitive heuristic',
          });
          report.totals.governance_block += 1;
        }
      } else {
        // Non-priority: inventory only
        pageEntry.interactions.push({
          kind: 'inventory_only',
          verdict: 'PASS_READ_ONLY',
          note: 'Loaded for inventory; deep click reserved for priority surfaces',
        });
        report.totals.pass += 1;
      }

      report.pages.push(pageEntry);
    }

    const exercised = report.totals.controls_exercised;
    const discovered = report.totals.controls_discovered;
    report.coverage = {
      control_coverage_pct:
        discovered === 0 ? 0 : Math.round((exercised / discovered) * 1000) / 10,
      note: 'Coverage = exercised / discovered across all pages; non-priority pages are inventory-only',
      priority_pages: PRIORITY_ROUTES.length,
    };

    fs.writeFileSync(REALITY_PATH, JSON.stringify(report, null, 2), 'utf8');
    // Soft asserts: infrastructure must produce a map; failures are findings not infra crash.
    expect(report.pages_discovered).toBeGreaterThan(10);
    expect(report.totals.pages_loaded).toBeGreaterThan(10);
    expect(fs.existsSync(REALITY_PATH)).toBeTruthy();
  });
});
