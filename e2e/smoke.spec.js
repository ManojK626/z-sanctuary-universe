import { test, expect } from '@playwright/test';
import { discoverPages, PRIORITY_ROUTES } from './helpers/pages.mjs';
import { attachMonitors } from './helpers/controls.mjs';

test.describe('E2E smoke — browser + local shell', () => {
  test('browser launches and dashboard stub loads', async ({ page }) => {
    const mon = await attachMonitors(page);
    const res = await page.goto('/dashboard/index.html', { waitUntil: 'domcontentloaded' });
    expect(res, 'response').toBeTruthy();
    expect(res.status(), 'status').toBeLessThan(400);
    await expect(page.locator('body')).toBeVisible();
    await expect(page.locator('h1')).toContainText(/Z-Sanctuary/i);
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
    const snap = mon.snapshot();
    expect(snap.pageErrors, `pageerrors: ${JSON.stringify(snap.pageErrors)}`).toEqual([]);
    // Stub must not navigate off localhost origin for its own load.
    expect(page.url()).toMatch(/^http:\/\/127\.0\.0\.1:5519\//);
  });

  test('main SKK/RKPK shell appears without fatal startup exception', async ({ page }) => {
    const mon = await attachMonitors(page);
    const res = await page.goto('/dashboard/Html/index-skk-rkpk.html', {
      waitUntil: 'domcontentloaded',
    });
    expect(res.status()).toBeLessThan(400);
    await expect(page.locator('body.z-dashboard-organism')).toBeVisible();
    await expect(page.locator('a.z-skip-link')).toBeVisible();
    const snap = mon.snapshot();
    // Fatal = pageerror only for smoke; console.error may be pre-existing.
    expect(snap.pageErrors, JSON.stringify(snap.pageErrors)).toEqual([]);
  });

  test('priority pages load (no fatal pageerror)', async ({ page }) => {
    const pages = discoverPages().filter((p) => PRIORITY_ROUTES.includes(p.source));
    expect(pages.length).toBeGreaterThanOrEqual(5);
    const failures = [];
    for (const p of pages) {
      const mon = await attachMonitors(page);
      const res = await page.goto(p.route, { waitUntil: 'domcontentloaded' });
      const status = res ? res.status() : 0;
      const snap = mon.snapshot();
      if (status >= 400 || snap.pageErrors.length) {
        failures.push({ route: p.route, status, pageErrors: snap.pageErrors });
      }
    }
    expect(failures, JSON.stringify(failures, null, 2)).toEqual([]);
  });
});
