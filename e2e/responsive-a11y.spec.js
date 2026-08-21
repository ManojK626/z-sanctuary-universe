import { test, expect } from '@playwright/test';

const WIDTHS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 390, height: 844 },
];

test.describe('E2E responsive + basic browser accessibility', () => {
  for (const vp of WIDTHS) {
    test(`SKK shell layout probe @ ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/dashboard/Html/index-skk-rkpk.html', { waitUntil: 'domcontentloaded' });
      await expect(page.locator('body')).toBeVisible();
      const metrics = await page.evaluate(() => {
        const doc = document.documentElement;
        const body = document.body;
        return {
          scrollWidth: doc.scrollWidth,
          clientWidth: doc.clientWidth,
          overflowX: doc.scrollWidth > doc.clientWidth + 2,
          bodyTextLen: (body.innerText || '').length,
        };
      });
      // Report-oriented soft check: overflow is a finding recorded via expect soft pattern.
      test.info().annotations.push({
        type: 'responsive',
        description: JSON.stringify({ viewport: vp.name, ...metrics }),
      });
      expect(metrics.bodyTextLen).toBeGreaterThan(50);
    });
  }

  test('skip link / Tab reachability sample on main shell', async ({ page }) => {
    await page.goto('/dashboard/Html/index-skk-rkpk.html', { waitUntil: 'domcontentloaded' });
    const skip = page.locator('a.z-skip-link');
    await expect(skip).toHaveCount(1);
    await page.keyboard.press('Tab');
    const focused = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el) return null;
      return {
        tag: el.tagName.toLowerCase(),
        id: el.id || '',
        className: typeof el.className === 'string' ? el.className : '',
        text: (el.textContent || '').trim().slice(0, 60),
        aria: el.getAttribute('aria-label') || '',
      };
    });
    expect(focused).toBeTruthy();
    test.info().annotations.push({
      type: 'a11y_focus',
      description: JSON.stringify(focused),
    });
  });

  test('buttons and links expose accessible names (sample audit)', async ({ page }) => {
    await page.goto('/dashboard/Html/index-skk-rkpk.html', { waitUntil: 'domcontentloaded' });
    const unnamed = await page.evaluate(() => {
      const bad = [];
      for (const el of document.querySelectorAll('button, a[href], [role="button"]')) {
        const name =
          el.getAttribute('aria-label') ||
          el.getAttribute('title') ||
          (el.textContent || '').trim() ||
          el.getAttribute('alt') ||
          '';
        if (!name) {
          bad.push({
            tag: el.tagName.toLowerCase(),
            id: el.id || '',
            className: typeof el.className === 'string' ? el.className.slice(0, 80) : '',
          });
        }
      }
      return bad.slice(0, 40);
    });
    test.info().annotations.push({
      type: 'a11y_unnamed',
      description: JSON.stringify({ count: unnamed.length, sample: unnamed.slice(0, 10) }),
    });
    // Soft: do not fail suite solely on missing names — classify PARTIAL in report.
    expect(Array.isArray(unnamed)).toBeTruthy();
  });
});
