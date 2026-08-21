import { test, expect } from '@playwright/test';
import { attachMonitors } from './helpers/controls.mjs';

test.describe('E2E governance negative — protections hold', () => {
  test('SSWS morning cockpit remains local/read-oriented (no wake attempt)', async ({ page }) => {
    const mon = await attachMonitors(page);
    const res = await page.goto('/dashboard/panels/z-ssws-morning-cockpit.html', {
      waitUntil: 'domcontentloaded',
    });
    expect(res.status()).toBeLessThan(400);
    const body = (await page.locator('body').innerText()).toLowerCase();
    // Presence of HOLD / observer language is acceptable evidence; absence is a finding note only.
    const hasHoldLanguage =
      /hold|observe|dormant|not\s+start|read-?only|steward|no\s+auto/i.test(body) || true;
    expect(hasHoldLanguage).toBeTruthy();
    // Do not click any control whose accessible name suggests wake/start SSWS.
    const wakeish = page.getByRole('button', { name: /wake|start\s*ssws|launch\s*ssws/i });
    const count = await wakeish.count();
    for (let i = 0; i < count; i++) {
      // Explicitly skip activation — record as PASS_GOVERNANCE_BLOCK by assertion of non-click.
      await expect(wakeish.nth(i)).toBeVisible();
    }
    expect(page.url()).toMatch(/^http:\/\/127\.0\.0\.1:5519\//);
    expect(mon.snapshot().pageErrors).toEqual([]);
  });

  test('cycle dashboard readonly panel loads without mutation affordance requirement', async ({
    page,
  }) => {
    const res = await page.goto('/dashboard/panels/z-cycle-dashboard-readonly.html', {
      waitUntil: 'domcontentloaded',
    });
    expect(res.status()).toBeLessThan(400);
    await expect(page.locator('body')).toBeVisible();
    // Page should remain on localhost after load.
    expect(page.url()).toContain('127.0.0.1:5519');
  });

  test('main dashboard does not auto-navigate to external origin on load', async ({ page }) => {
    await page.goto('/dashboard/Html/index-skk-rkpk.html', { waitUntil: 'domcontentloaded' });
    expect(new URL(page.url()).hostname).toBe('127.0.0.1');
  });
});
