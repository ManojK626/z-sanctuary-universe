'use strict';

const { chromium } = require('C:/Cursor Projects Organiser/Z_Sanctuary_Universe/node_modules/playwright');

const BASE = process.env.Z_ADAPTIVE_BASE || 'http://127.0.0.1:4195';
const HOST = '/dashboard/Html/index-skk-rkpk.html';
const LEGACY = '/tests/fixtures/z_adaptive_legacy_host.html';
const SHADOW = '/dashboard/Html/shadow/index-skk-rkpk.workbench.html';
const SIZES = [
  [320, 568],
  [360, 640],
  [390, 844],
  [430, 932],
  [600, 960],
  [768, 1024],
  [1024, 768],
  [1280, 720],
  [1366, 768],
  [1440, 900],
  [1920, 1080],
  [2560, 1440],
];

function layoutFromWidth(width) {
  if (width >= 1600) return 'wide';
  if (width >= 1280) return 'standard';
  if (width >= 860) return 'compact';
  return 'mobile';
}

const COMPAT = {
  mobile: ['zvp-mobile'],
  compact: ['zvp-tablet'],
  standard: ['zvp-compact-desktop', 'zvp-desktop'],
  wide: ['zvp-wide'],
};

async function readHost(page) {
  return page.evaluate(() => {
    const body = document.body;
    const root = document.documentElement;
    const headings = [...document.querySelectorAll('h1,h2,h3')]
      .map((el) => (el.textContent || '').replace(/\s+/g, ' ').trim())
      .filter(Boolean);
    const hrefs = [...document.querySelectorAll('a[href]')]
      .map((el) => el.getAttribute('href'))
      .filter(Boolean);
    window.scrollTo(800, 0);
    const scrollX = window.scrollX || document.documentElement.scrollLeft || 0;
    window.scrollTo(0, 0);
    const clipped = [...document.querySelectorAll('h1,h2,h3,#zAnyDevicesPanel,.z-skip-link')].filter((el) => {
      const style = getComputedStyle(el);
      const hidden = style.overflowX === 'hidden' || style.overflowX === 'clip';
      return hidden && el.scrollWidth > el.clientWidth + 4 && el.clientWidth > 0;
    }).length;
    const required = ['#zHiveRoot', '#zAnyDevicesPanel', '#zAnyDevicesBody', '#zAnyDevicesBadge', '.z-skip-link'].map(
      (sel) => {
        const el = document.querySelector(sel);
        if (!el) return { sel, present: false };
        el.scrollIntoView({ block: 'nearest', inline: 'nearest' });
        const rect = el.getBoundingClientRect();
        const style = getComputedStyle(el);
        return {
          sel,
          present: true,
          hidden: style.display === 'none' || style.visibility === 'hidden',
          text: (el.textContent || '').trim().length,
          inView: rect.bottom > 0 && rect.right > 0 && rect.top < window.innerHeight && rect.left < window.innerWidth,
        };
      }
    );
    const vv = window.visualViewport;
    return {
      optIn: body.classList.contains('z-anydevice-adaptive'),
      classes: [...body.classList],
      layout: root.getAttribute('z-layout'),
      viewport: root.getAttribute('z-viewport'),
      orientation: root.getAttribute('z-orientation'),
      pointer: root.getAttribute('z-pointer'),
      hover: root.getAttribute('z-hover'),
      motion: root.getAttribute('z-motion'),
      offline: root.getAttribute('z-offline'),
      density: root.getAttribute('z-density'),
      profile: window.__Z_VIEWPORT_PROFILE__ || null,
      vv: vv ? { width: vv.width, height: vv.height, scale: vv.scale } : null,
      scrollX,
      clipped,
      headings,
      hrefs,
      required,
      viewportMeta: document.querySelector('meta[name="viewport"]')?.getAttribute('content') || '',
      scripts: [...document.querySelectorAll('script[src]')].map((el) => el.getAttribute('src')),
      sheets: [...document.querySelectorAll('link[rel="stylesheet"]')].map((el) => el.getAttribute('href')),
      queries: {
        coarse: window.matchMedia('(pointer: coarse)').matches,
        fine: window.matchMedia('(pointer: fine)').matches,
        hover: window.matchMedia('(hover: hover)').matches,
        hoverNone: window.matchMedia('(hover: none)').matches,
        reduce: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      },
    };
  });
}

function sameList(a, b) {
  return JSON.stringify([...a].sort()) === JSON.stringify([...b].sort());
}

(async () => {
  const failures = [];
  const notes = [];
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const truth = {};
  for (const [width, height] of SIZES) {
    await page.setViewportSize({ width, height });
    await page.goto(BASE + HOST, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForFunction(() => document.documentElement.getAttribute('z-layout'), null, { timeout: 15000 });
    await page.waitForTimeout(200);
    const snap = await readHost(page);
    const expectLayout = layoutFromWidth(snap.vv ? snap.vv.width : width);
    const label = `${width}x${height}`;
    if (snap.layout !== expectLayout) failures.push(`${label} layout ${snap.layout} != ${expectLayout}`);
    if (snap.profile && snap.profile.layout_class !== expectLayout) {
      failures.push(`${label} profile layout ${snap.profile.layout_class}`);
    }
    if (snap.vv && Math.abs(snap.profile.width - snap.vv.width) > 1) {
      failures.push(`${label} width ${snap.profile.width} != visualViewport ${snap.vv.width}`);
    }
    if (snap.vv && snap.vv.scale && Math.abs(snap.profile.width - snap.vv.width / snap.vv.scale) < 1 && snap.vv.scale !== 1) {
      failures.push(`${label} width was divided by visualViewport.scale`);
    }
    for (const name of COMPAT[expectLayout]) {
      if (!snap.classes.includes(name)) failures.push(`${label} missing ${name}`);
    }
    if (snap.classes.includes('zvp-ultra')) failures.push(`${label} set zvp-ultra`);
    if (!snap.classes.includes(`z-layout-${expectLayout}`)) failures.push(`${label} missing layout class`);
    if (snap.scrollX !== 0) failures.push(`${label} horizontal scrollX ${snap.scrollX}`);
    if (snap.clipped) failures.push(`${label} clipped critical text ${snap.clipped}`);
    if (snap.orientation !== (height >= width ? 'portrait' : 'landscape')) {
      failures.push(`${label} orientation ${snap.orientation}`);
    }
    const expectedPointer =
      snap.queries.coarse && !snap.queries.fine ? 'coarse' : snap.queries.fine && !snap.queries.coarse ? 'fine' : 'unknown';
    const expectedHover =
      snap.queries.hover && !snap.queries.hoverNone ? 'hover' : snap.queries.hoverNone && !snap.queries.hover ? 'none' : 'unknown';
    if (snap.pointer !== expectedPointer) failures.push(`${label} pointer ${snap.pointer} != ${expectedPointer}`);
    if (snap.hover !== expectedHover) failures.push(`${label} hover ${snap.hover} != ${expectedHover}`);
    if (snap.offline !== 'online') failures.push(`${label} offline signal ${snap.offline}`);
    for (const item of snap.required) {
      if (!item.present || item.hidden) failures.push(`${label} missing ${item.sel}`);
      if (item.sel !== '.z-skip-link' && item.sel !== '#zAnyDevicesBadge' && item.text === 0) {
        failures.push(`${label} empty ${item.sel}`);
      }
    }
    if (['390x844', '1024x768', '1440x900', '1920x1080'].includes(label)) truth[expectLayout] = snap;
    if (label === '1440x900') {
      notes.push(`POINTER_OBSERVED ${snap.pointer}`);
      notes.push(`HOVER_OBSERVED ${snap.hover}`);
      notes.push(`MEASUREMENT ${snap.profile.measurement}`);
      notes.push(`VIEWPORT_SCALE ${snap.vv && snap.vv.scale}`);
    }
  }

  const layouts = ['mobile', 'compact', 'standard', 'wide'];
  const baseTruth = truth.mobile;
  if (!baseTruth) failures.push('missing mobile truth sample');
  for (const name of layouts) {
    if (!truth[name]) failures.push(`missing ${name} truth sample`);
    else if (baseTruth && !sameList(truth[name].headings, baseTruth.headings)) {
      failures.push(`headings differ at ${name}`);
    }     else if (baseTruth && !sameList(truth[name].hrefs, baseTruth.hrefs)) {
      const missing = baseTruth.hrefs.filter((href) => !truth[name].hrefs.includes(href));
      const extra = truth[name].hrefs.filter((href) => !baseTruth.hrefs.includes(href));
      failures.push(`links differ at ${name} missing=${missing.slice(0, 3).join('|')} extra=${extra.slice(0, 3).join('|')}`);
    }
  }
  if (truth.standard && truth.standard.density === 'standard') failures.push('density copied from layout');
  if (truth.wide && truth.wide.density === 'wide') failures.push('wide density copied from layout');
  if (truth.mobile && truth.mobile.density === 'mobile') failures.push('mobile density copied from layout');

  await page.locator('body').focus();
  await page.keyboard.press('Tab');
  const focused = await page.evaluate(() => {
    const el = document.activeElement;
    return {
      tag: el && el.tagName,
      className: el && String(el.className || ''),
    };
  });
  if (focused.className.includes('z-skip-link') === false && !['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'].includes(focused.tag)) {
    failures.push(`keyboard focus ${focused.tag} ${focused.className}`);
  }
  await page.locator('.z-skip-link').focus();
  const skip = await page.evaluate(() => {
    const el = document.activeElement;
    const rect = el.getBoundingClientRect();
    return { className: String(el.className || ''), left: rect.left, top: rect.top };
  });
  if (!skip.className.includes('z-skip-link')) failures.push('skip link did not take focus');
  if (skip.left < 0 || skip.top < 0) failures.push(`skip link stayed offscreen ${skip.left},${skip.top}`);

  await context.close();

  const dprContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 3,
  });
  const dprPage = await dprContext.newPage();
  await dprPage.goto(BASE + HOST, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await dprPage.waitForFunction(() => document.documentElement.getAttribute('z-layout'), null, { timeout: 15000 });
  const dpr = await readHost(dprPage);
  if (dpr.layout !== 'standard') failures.push(`dpr3 layout ${dpr.layout}`);
  if (dpr.profile && dpr.profile.dpi !== 3) notes.push(`DPR_REPORTED ${dpr.profile && dpr.profile.dpi}`);
  await dprContext.close();

  const motionContext = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    reducedMotion: 'reduce',
  });
  const motionPage = await motionContext.newPage();
  await motionPage.goto(BASE + HOST, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await motionPage.waitForFunction(() => document.documentElement.getAttribute('z-motion'), null, { timeout: 15000 });
  const motion = await readHost(motionPage);
  if (motion.motion !== 'reduce') failures.push(`reduced motion ${motion.motion}`);
  if (!motion.viewportMeta.includes('viewport-fit=cover')) failures.push('viewport-fit missing');
  if (!motion.sheets.some((href) => href && href.includes('z_adaptive_foundation.css'))) {
    failures.push('foundation css not linked');
  }
  if (!motion.scripts.some((src) => src && src.includes('z_anydevices_panel.js'))) failures.push('anydevice panel script missing');
  if (!motion.scripts.some((src) => src && src.includes('z_anydevices_badge.js'))) failures.push('anydevice badge script missing');
  await motionContext.close();

  const offlineContext = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const offlinePage = await offlineContext.newPage();
  await offlineContext.setOffline(true);
  await offlinePage.goto(BASE + HOST, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch((error) => {
    notes.push(`OFFLINE_NAVIGATION ${error.message}`);
  });
  await offlineContext.setOffline(false);
  await offlinePage.goto(BASE + HOST, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await offlinePage.waitForFunction(() => document.documentElement.getAttribute('z-offline'), null, { timeout: 15000 });
  await offlineContext.setOffline(true);
  await offlinePage.evaluate(() => window.dispatchEvent(new Event('offline')));
  await offlinePage.waitForTimeout(300);
  const offline = await readHost(offlinePage);
  if (offline.offline !== 'offline') failures.push(`offline signal ${offline.offline}`);
  if (offline.layout !== 'standard') failures.push(`offline changed layout ${offline.layout}`);
  await offlineContext.close();

  const manualContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const manualPage = await manualContext.newPage();
  await manualPage.addInitScript(() => localStorage.setItem('zUiDensity', 'normal'));
  await manualPage.goto(BASE + HOST, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await manualPage.waitForFunction(() => document.documentElement.getAttribute('z-layout') === 'mobile', null, {
    timeout: 15000,
  });
  const manual = await readHost(manualPage);
  if (manual.density !== 'normal') failures.push(`manual density ${manual.density}`);
  if (manual.layout !== 'mobile') failures.push(`manual layout ${manual.layout}`);
  await manualContext.close();

  const legacyContext = await browser.newContext({ viewport: { width: 1000, height: 800 } });
  const legacyPage = await legacyContext.newPage();
  await legacyPage.goto(BASE + LEGACY, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await legacyPage.waitForTimeout(400);
  const legacyNarrow = await readHost(legacyPage);
  if (legacyNarrow.optIn) failures.push('legacy host opted in');
  if (legacyNarrow.layout) failures.push(`legacy host gained z-layout ${legacyNarrow.layout}`);
  if (!legacyNarrow.classes.includes('zvp-tablet')) failures.push(`legacy 1000 classes ${legacyNarrow.classes.join(' ')}`);
  if (legacyNarrow.classes.includes('z-layout-compact') || legacyNarrow.classes.includes('z-layout-mobile')) {
    failures.push('legacy host gained contract layout class');
  }
  if (legacyNarrow.scripts.some((src) => src && src.includes('z_adaptive_runtime'))) {
    failures.push('legacy host loads shared runtime');
  }
  await legacyPage.setViewportSize({ width: 1440, height: 900 });
  await legacyPage.reload({ waitUntil: 'domcontentloaded' });
  await legacyPage.waitForTimeout(400);
  const legacyWide = await readHost(legacyPage);
  if (legacyWide.layout) failures.push(`legacy 1440 z-layout ${legacyWide.layout}`);
  if (!legacyWide.classes.includes('zvp-compact-desktop')) failures.push('legacy 1440 missing compact-desktop');
  if (legacyWide.classes.includes('zvp-desktop')) failures.push('legacy 1440 gained contract zvp-desktop');
  if (legacyWide.viewport !== 'desktop') failures.push(`legacy viewport ${legacyWide.viewport}`);
  await legacyContext.close();

  const shadowContext = await browser.newContext();
  const shadowPage = await shadowContext.newPage();
  const shadowStatus = [];
  shadowPage.on('response', (response) => {
    if (response.url().includes('z_layout_engine')) shadowStatus.push(response.status());
  });
  await shadowPage.goto(BASE + SHADOW, { waitUntil: 'domcontentloaded', timeout: 60000 });
  const shadow = await shadowPage.evaluate(() => ({
    optIn: document.body.classList.contains('z-anydevice-adaptive'),
    runtime: [...document.scripts].some((script) => (script.src || '').includes('z_adaptive_runtime')),
    foundation: [...document.querySelectorAll('link')].some((link) => (link.href || '').includes('z_adaptive_foundation')),
  }));
  if (shadow.optIn || shadow.runtime || shadow.foundation) failures.push('shadow host received the adaptive opt-in');
  notes.push(`SHADOW_ENGINE_HTTP ${shadowStatus.join(',') || 'NONE'}`);
  await shadowContext.close();

  const pointerPage = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await pointerPage.goto(BASE + HOST, { waitUntil: 'domcontentloaded', timeout: 60000 });
  let coarseAvailable = 'NOT_AVAILABLE';
  try {
    const client = await pointerPage.context().newCDPSession(pointerPage);
    await client.send('Emulation.setEmulatedMedia', {
      media: 'screen',
      features: [
        { name: 'pointer', value: 'coarse' },
        { name: 'hover', value: 'none' },
      ],
    });
    await pointerPage.waitForTimeout(250);
    const emulated = await readHost(pointerPage);
    if (emulated.queries.coarse && emulated.pointer === 'coarse' && emulated.hover === 'none') {
      coarseAvailable = 'PASS';
    }
  } catch (error) {
    notes.push(`POINTER_EMULATION ${error.message}`);
  }
  notes.push(`COARSE_POINTER ${coarseAvailable}`);
  await pointerPage.close();
  await browser.close();

  const result = {
    failures,
    notes,
    CHROMIUM: failures.length ? 'FAIL' : 'PASS',
    COARSE_POINTER: coarseAvailable,
  };
  console.log(JSON.stringify(result, null, 2));
  if (failures.length) process.exit(1);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
