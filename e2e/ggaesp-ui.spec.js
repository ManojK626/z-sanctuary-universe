import { test, expect } from '@playwright/test';
import { attachMonitors } from './helpers/controls.mjs';

test.describe('E2E GGAESP UI integration (presentation only)', () => {
  test('ggaesp panel loads pipeline result with GO/PREPARE/BLOCK vocabulary', async ({ page }) => {
    const mon = await attachMonitors(page);
    const res = await page.goto('/dashboard/panels/ggaesp_panel.html', {
      waitUntil: 'networkidle',
    });
    expect(res.status()).toBeLessThan(400);
    const out = page.locator('#zGgaespOut');
    await expect(out).toBeVisible();
    // Wait until Loading… is replaced by JSON (or timeout soft).
    await expect
      .poll(async () => (await out.innerText()).includes('"decision"'), { timeout: 15_000 })
      .toBeTruthy();
    const text = await out.innerText();
    expect(text).toMatch(/"decision"\s*:\s*"(GO|PREPARE|BLOCK)"/);
    // Sample on panel historically matches roulette_ai MEDIUM → GO
    expect(text).toMatch(/"decision"\s*:\s*"GO"/);
    const summary = page.locator('#zGgaespSummary');
    await expect(summary).toBeVisible();
    // Save Memory Capsule is export — click should not navigate away or throw.
    const save = page.locator('#zGgaespSaveMemBtn');
    if (await save.count()) {
      await save.click();
      expect(page.url()).toContain('ggaesp_panel.html');
    }
    expect(mon.snapshot().pageErrors).toEqual([]);
  });
});
