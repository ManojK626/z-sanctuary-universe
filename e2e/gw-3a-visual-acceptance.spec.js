/**
 * GW-3A — local Golden Foundation Shell visual + keyboard acceptance.
 * Does not publish, deploy, or load private registries.
 */
import fs from 'node:fs';
import path from 'node:path';
import { test, expect } from '@playwright/test';

const SHELL = '/docs/golden-website/shell';
const SHOT_DIR = path.join('docs', 'golden-website', 'gw-3a', 'screenshots');
const METRICS_PATH = path.join('docs', 'golden-website', 'gw-3a', 'visual_pass_metrics.json');

function shellUrl(pageFile) {
  return `${SHELL}/${pageFile}`;
}

function overflowMetrics() {
  const doc = document.documentElement;
  return {
    scrollWidth: doc.scrollWidth,
    clientWidth: doc.clientWidth,
    overflowX: doc.scrollWidth > doc.clientWidth + 2,
  };
}

test.describe('GW-3A Golden Foundation Shell visual acceptance', () => {
  test.beforeAll(() => {
    fs.mkdirSync(SHOT_DIR, { recursive: true });
  });

  test('Home: first-minute identity, QUALIFIED ≠ VERIFIED, evidence mode, locked doors', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(shellUrl('index.html'), { waitUntil: 'domcontentloaded' });

    await expect(page.locator('html')).toHaveAttribute('data-disable-auto-compass', '');
    await expect(page.locator('h1')).toHaveText('The Golden Website');
    await expect(page.locator('body')).toContainText('Gateway to the Z-Sanctuary Universe');
    await expect(page.locator('body')).toContainText(
      'Z-Sanctuary is a governed multi-project AI development ecosystem',
    );
    await expect(page.locator('body')).toContainText('QUALIFIED is not VERIFIED');
    await expect(page.getByRole('link', { name: 'Explore Z-Sanctuary' })).toBeVisible();
    await expect(page.getByRole('button', { name: "Show Me What's Real" }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Explore the Navigator' })).toBeVisible();
    await expect(page.locator('#gw-evidence-board')).toBeHidden();

    await page.screenshot({ path: path.join(SHOT_DIR, '01-home-desktop.png') });

    await page.locator('#gw-evidence-cta').click();
    await expect(page.locator('body')).toHaveClass(/evidence-mode/);
    await expect(page.locator('#gw-evidence-board')).toBeVisible();
    await expect(page.locator('#gw-evidence-board')).toContainText('Z-Sanctuary Core');
    await expect(page.locator('#gw-evidence-board')).toContainText('QUALIFIED');
    await expect(page.locator('#gw-evidence-board')).toContainText('PASS');
    await expect(page.locator('#gw-evidence-board')).toContainText('Universal Workstation Navigator');
    await expect(page.locator('#gw-evidence-board')).toContainText('SEALED');
    await expect(page.locator('#gw-evidence-board')).toContainText('WORKING LOCAL');
    await expect(page.locator('#gw-evidence-board')).toContainText('Public production: NO');
    await expect(page.locator('#gw-evidence-toggle')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('#gw-evidence-toggle')).toHaveText('Evidence mode on');

    await page.locator('#gw-evidence-board').screenshot({
      path: path.join(SHOT_DIR, '02-home-evidence-board.png'),
    });
    await page.screenshot({ path: path.join(SHOT_DIR, '03-home-evidence-desktop.png') });

    const locked = page.locator('#gw-locked li');
    await expect(locked).toHaveCount(9);
    await expect(locked.first()).toContainText('Coming through evidence gates');
    await expect(page.locator('#gw-locked button')).toHaveCount(0);
    await expect(page.locator('body')).toContainText('These are not broken links');

    const names = await page.locator('#gw-locked li span, #gw-locked li').allTextContents();
    const blob = names.join(' ');
    expect(blob).toMatch(/Golden Universe Map/);
    expect(blob).toMatch(/Golden Guide AI/);
    expect(blob).not.toMatch(/z_icis/i);
  });

  test('Core and Navigator pages keep production/evidence discipline', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(shellUrl('core.html'), { waitUntil: 'domcontentloaded' });
    await expect(page.locator('h1')).toHaveText('Z-Sanctuary Core');
    await expect(page.locator('body')).toContainText('Evidence state: QUALIFIED');
    await expect(page.locator('body')).toContainText('Public evidence gate: PASS');
    await expect(page.locator('body')).toContainText('Not VERIFIED');
    await expect(page.locator('body')).not.toContainText('Evidence state: VERIFIED');
    await page.screenshot({ path: path.join(SHOT_DIR, '04-core-desktop.png') });

    await page.goto(shellUrl('navigator.html'), { waitUntil: 'domcontentloaded' });
    await expect(page.locator('h1')).toHaveText('Universal Workstation Navigator');
    await expect(page.locator('body')).toContainText('WORKING local UI');
    await expect(page.locator('body')).toContainText('Public production: NO');
    await expect(page.locator('body')).toContainText('not Golden Universe Map');
    await expect(page.locator('body')).toContainText('no execution authority');
    await expect(page.getByRole('link', { name: 'Preview How Z-Sanctuary Is Explored' })).toBeVisible();
    await expect(page.locator('#gw-preview-rail button')).toHaveCount(2);
    await page.locator('#gw-preview-rail button').nth(1).click();
    await expect(page.locator('#gw-preview-panel')).toContainText('Universal Workstation Navigator');
    await expect(page.locator('#gw-preview-panel')).toContainText('Not a production');
    await page.screenshot({ path: path.join(SHOT_DIR, '05-navigator-desktop.png') });
  });

  test('Keyboard: skip link, evidence toggle, navigator rail arrows', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(shellUrl('index.html'), { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => sessionStorage.removeItem('gwEvidenceMode'));
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.keyboard.press('Tab');
    const skipFocused = await page.evaluate(() => {
      const el = document.activeElement;
      return el && el.classList.contains('skip');
    });
    expect(skipFocused, 'first Tab should land on skip link').toBeTruthy();
    await page.screenshot({ path: path.join(SHOT_DIR, '06-home-skip-focus.png') });
    await page.keyboard.press('Enter');
    const mainFocused = await page.evaluate(() => document.activeElement && document.activeElement.id);
    expect(mainFocused === 'main' || (await page.evaluate(() => location.hash))).toBeTruthy();

    await page.locator('#gw-evidence-toggle').focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('body')).toHaveClass(/evidence-mode/);
    await page.keyboard.press('Enter');
    await expect(page.locator('body')).not.toHaveClass(/evidence-mode/);

    await page.goto(shellUrl('navigator.html'), { waitUntil: 'domcontentloaded' });
    const firstTab = page.locator('#gw-preview-rail button').first();
    await firstTab.focus();
    await page.keyboard.press('ArrowDown');
    await expect(page.locator('#gw-preview-panel h3')).toHaveText('Universal Workstation Navigator');
  });

  test('Desktop / tablet / mobile: no material overflow; screenshots', async ({ page }) => {
    const viewports = [
      { name: 'desktop', width: 1440, height: 900, file: '01-home-desktop.png' },
      { name: 'tablet', width: 768, height: 1024, file: '07-home-tablet.png' },
      { name: 'mobile', width: 390, height: 844, file: '08-home-mobile.png' },
    ];
    const metrics = [];

    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      for (const pageFile of ['index.html', 'core.html', 'navigator.html']) {
        await page.goto(shellUrl(pageFile), { waitUntil: 'domcontentloaded' });
        const m = await page.evaluate(overflowMetrics);
        metrics.push({ viewport: vp.name, page: pageFile, ...m });
        expect(m.overflowX, `${pageFile} @ ${vp.name} horizontal overflow`).toBeFalsy();
      }
    }

    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(shellUrl('index.html'), { waitUntil: 'domcontentloaded' });
    await page.screenshot({ path: path.join(SHOT_DIR, '07-home-tablet.png') });

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(shellUrl('index.html'), { waitUntil: 'domcontentloaded' });
    await page.screenshot({ path: path.join(SHOT_DIR, '08-home-mobile.png') });
    await page.goto(shellUrl('navigator.html'), { waitUntil: 'domcontentloaded' });
    await page.screenshot({ path: path.join(SHOT_DIR, '09-navigator-mobile.png') });

    const unnamed = await page.evaluate(() => {
      const bad = [];
      for (const el of document.querySelectorAll('button, a[href], [role="button"]')) {
        const name =
          el.getAttribute('aria-label') ||
          el.getAttribute('title') ||
          (el.textContent || '').trim();
        if (!name) {
          bad.push(el.tagName + (el.id ? `#${el.id}` : ''));
        }
      }
      return bad;
    });
    expect(unnamed, `unnamed controls: ${JSON.stringify(unnamed)}`).toEqual([]);

    fs.writeFileSync(
      METRICS_PATH,
      JSON.stringify(
        {
          generated_at: new Date().toISOString(),
          phase: 'GW-3A',
          overflow: metrics,
          unnamed_controls_on_navigator_mobile: unnamed,
        },
        null,
        2,
      ),
    );
  });

  test('Two approved records only; no private catalog leak in DOM', async ({ page }) => {
    await page.goto(shellUrl('index.html'), { waitUntil: 'domcontentloaded' });
    const body = await page.locator('body').innerText();
    expect(body).not.toMatch(/dashboard\/Html/i);
    expect(body).not.toMatch(/127\.0\.0\.1/);
    expect(body).not.toMatch(/C:\\/);
    const recordCount = await page.evaluate(() => window.GW_APPROVED && window.GW_APPROVED.records.length);
    expect(recordCount).toBe(2);
    expect(await page.evaluate(() => window.GW_APPROVED.publication_authorized)).toBe(false);
    expect(await page.evaluate(() => window.GW_APPROVED.twin_live_records)).toBe(0);
  });
});
