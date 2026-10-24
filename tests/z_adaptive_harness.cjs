'use strict';

const runtime = require('../core/z_adaptive_runtime.cjs');

const EVIDENCE_CLASSES = {
  SYNTHETIC_VIEWPORT_EVIDENCE: 'PLAYWRIGHT_VIEWPORT',
  BROWSER_FAMILY_EVIDENCE: 'ENGINE_LAUNCH',
  PHYSICAL_DEVICE_EVIDENCE: 'NOT_COLLECTED',
};

const MATRIX = [
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

const MEDIA = [
  '(pointer: coarse)',
  '(pointer: fine)',
  '(hover: hover)',
  '(hover: none)',
  '(prefers-reduced-motion: reduce)',
];

function layoutFor(width) {
  return runtime.layoutFromWidth(width);
}

async function readSurface(page, host) {
  return page.evaluate((spec) => {
    const root = document.documentElement;
    const body = document.body;
    const optIn =
      spec.optInTarget === 'body'
        ? body.classList.contains('z-anydevice-adaptive')
        : root.classList.contains('z-anydevice-adaptive');
    const headings = [...document.querySelectorAll(spec.headingSelector)]
      .map((el) => (el.textContent || '').replace(/\s+/g, ' ').trim())
      .filter(Boolean);
    const links = [...document.querySelectorAll(spec.linkSelector)]
      .map((el) => el.getAttribute('href'))
      .filter(Boolean);
    window.scrollTo(800, 0);
    const scrollX = window.scrollX || root.scrollLeft || 0;
    window.scrollTo(0, 0);
    const clipped = [...document.querySelectorAll(spec.headingSelector)].filter((el) => {
      const style = getComputedStyle(el);
      const hidden = style.overflowX === 'hidden' || style.overflowX === 'clip';
      return hidden && el.scrollWidth > el.clientWidth + 4 && el.clientWidth > 0;
    }).length;
    const critical = spec.criticalSelectors.map((sel) => {
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
        reachable: rect.width > 0 || rect.height > 0 || style.position === 'absolute' || el.getClientRects().length > 0,
      };
    });
    const media = {};
    for (const query of spec.media) {
      try {
        media[query] = window.matchMedia(query).matches;
      } catch {
        media[query] = null;
      }
    }
    const governance = (spec.governanceSelectors || []).map((sel) => ({
      sel,
      present: Boolean(document.querySelector(sel)),
    }));
    const vv = window.visualViewport;
    let css = '';
    for (const sheet of document.styleSheets) {
      try {
        for (const rule of sheet.cssRules) css += `${rule.cssText}\n`;
      } catch {
        /* unreadable sheet */
      }
    }
    return {
      optIn,
      layout: root.getAttribute('z-layout'),
      orientation: root.getAttribute('z-orientation'),
      pointer: root.getAttribute('z-pointer'),
      hover: root.getAttribute('z-hover'),
      motion: root.getAttribute('z-motion'),
      offline: root.getAttribute('z-offline'),
      density: root.getAttribute('z-density'),
      onLine: typeof navigator.onLine === 'boolean' ? navigator.onLine : null,
      headings,
      links,
      scrollX,
      clipped,
      critical,
      governance,
      media,
      viewportMeta: document.querySelector('meta[name="viewport"]')?.getAttribute('content') || '',
      vv: vv ? { width: vv.width, height: vv.height, scale: vv.scale } : null,
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
      css,
    };
  }, {
    optInTarget: host.optInTarget,
    headingSelector: host.headingSelector,
    linkSelector: host.linkSelector,
    criticalSelectors: host.criticalSelectors,
    governanceSelectors: host.governanceSelectors || [],
    media: MEDIA,
  });
}

function expectSignals(snap) {
  const matchMedia = (query) => ({ matches: snap.media[query] === true });
  const box = snap.vv
    ? { width: snap.vv.width, height: snap.vv.height }
    : { width: snap.innerWidth, height: snap.innerHeight };
  return {
    layout: layoutFor(box.width),
    orientation: runtime.orientationFromBox(box),
    pointer: runtime.primaryPointer(matchMedia),
    hover: runtime.primaryHover(matchMedia),
    motion: runtime.motion(matchMedia),
    offline: runtime.connectivity({ onLine: snap.onLine }),
  };
}

function sameList(left, right) {
  return JSON.stringify([...left].sort()) === JSON.stringify([...right].sort());
}

async function openHost(page, host) {
  await page.goto(host.base + host.path, { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.waitForFunction(host.ready, null, { timeout: 30000 });
  if (host.settleMs) await page.waitForTimeout(host.settleMs);
}

async function runMatrix(page, host) {
  const failures = [];
  const rows = [];
  const truth = {};
  for (const [width, height] of MATRIX) {
    await page.setViewportSize({ width, height });
    await openHost(page, host);
    const snap = await readSurface(page, host);
    const expected = expectSignals(snap);
    const label = `${width}x${height}`;
    const row = { label, layout: snap.layout, scrollX: snap.scrollX };
    rows.push(row);
    if (!snap.optIn) failures.push(`${host.id} ${label} missing opt-in`);
    if (snap.layout !== expected.layout) failures.push(`${host.id} ${label} layout ${snap.layout} != ${expected.layout}`);
    if (snap.orientation !== expected.orientation) {
      failures.push(`${host.id} ${label} orientation ${snap.orientation} != ${expected.orientation}`);
    }
    if (snap.pointer !== expected.pointer) failures.push(`${host.id} ${label} pointer ${snap.pointer} != ${expected.pointer}`);
    if (snap.hover !== expected.hover) failures.push(`${host.id} ${label} hover ${snap.hover} != ${expected.hover}`);
    if (snap.motion !== expected.motion) failures.push(`${host.id} ${label} motion ${snap.motion} != ${expected.motion}`);
    if (snap.offline !== 'online') failures.push(`${host.id} ${label} offline ${snap.offline}`);
    if (snap.scrollX !== 0) failures.push(`${host.id} ${label} horizontal scrollX ${snap.scrollX}`);
    if (snap.clipped) failures.push(`${host.id} ${label} clipped headings ${snap.clipped}`);
    if (snap.vv && snap.vv.scale && snap.vv.scale !== 1) {
      const divided = layoutFor(snap.vv.width / snap.vv.scale);
      if (divided !== expected.layout && snap.layout === divided) {
        failures.push(`${host.id} ${label} layout followed visualViewport.scale`);
      }
    }
    for (const item of snap.critical) {
      if (!item.present || item.hidden || !item.reachable) failures.push(`${host.id} ${label} control ${item.sel}`);
    }
    for (const item of snap.governance || []) {
      if (!item.present) failures.push(`${host.id} ${label} governance missing ${item.sel}`);
    }
    if (!snap.viewportMeta.includes('viewport-fit=cover')) failures.push(`${host.id} ${label} viewport-fit missing`);
    if (host.density === 'absent' && snap.density) failures.push(`${host.id} invented z-density ${snap.density}`);
    const bucket = expected.layout;
    if (!truth[bucket]) truth[bucket] = snap;
  }
  const sampleCss = Object.values(truth)[0];
  if (sampleCss) {
    for (const needle of host.cssNeedles) {
      if (!sampleCss.css.includes(needle)) failures.push(`${host.id} missing css ${needle}`);
    }
  }
  const base = truth.mobile;
  for (const name of ['mobile', 'compact', 'standard', 'wide']) {
    if (!truth[name]) failures.push(`${host.id} missing ${name} sample`);
    else if (base && !sameList(truth[name].headings, base.headings)) failures.push(`${host.id} headings differ at ${name}`);
    else if (base && !sameList(truth[name].links, base.links)) failures.push(`${host.id} links differ at ${name}`);
  }
  return { failures, rows, truthLayouts: Object.keys(truth) };
}

async function runKeyboard(page, host) {
  await page.locator(host.keyboardSelector).first().focus();
  return page.evaluate((selector) => {
    const el = document.activeElement;
    const rect = el ? el.getBoundingClientRect() : null;
    return {
      matches: Boolean(el && el.matches(selector)),
      tag: el && el.tagName,
      left: rect && rect.left,
      top: rect && rect.top,
    };
  }, host.keyboardSelector);
}

async function runReducedMotion(browser, host) {
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();
  await openHost(page, host);
  const snap = await readSurface(page, host);
  await context.close();
  return snap.motion === 'reduce' ? 'PASS' : `FAIL ${snap.motion}`;
}

async function runOffline(browser, host) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await openHost(page, host);
  await context.setOffline(true);
  await page.evaluate(() => window.dispatchEvent(new Event('offline')));
  await page.waitForTimeout(300);
  const snap = await readSurface(page, host);
  await context.close();
  if (snap.offline !== 'offline') return `FAIL ${snap.offline}`;
  if (snap.layout !== 'standard') return `FAIL layout ${snap.layout}`;
  return 'PASS';
}

async function runDpr(browser, host) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 3,
  });
  const page = await context.newPage();
  await openHost(page, host);
  const snap = await readSurface(page, host);
  await context.close();
  return snap.layout === 'standard' ? 'PASS' : `FAIL ${snap.layout}`;
}

async function runCoarseProbe(page) {
  try {
    const client = await page.context().newCDPSession(page);
    await client.send('Emulation.setEmulatedMedia', {
      media: 'screen',
      features: [
        { name: 'pointer', value: 'coarse' },
        { name: 'hover', value: 'none' },
      ],
    });
    await page.waitForTimeout(250);
    const media = await page.evaluate(() => ({
      coarse: window.matchMedia('(pointer: coarse)').matches,
      fine: window.matchMedia('(pointer: fine)').matches,
      hover: window.matchMedia('(hover: hover)').matches,
      hoverNone: window.matchMedia('(hover: none)').matches,
    }));
    if (media.coarse && !media.fine && media.hoverNone && !media.hover) return 'PASS';
    return 'NOT_AVAILABLE';
  } catch {
    return 'NOT_AVAILABLE';
  }
}

module.exports = {
  EVIDENCE_CLASSES,
  MATRIX,
  layoutFor,
  runMatrix,
  runKeyboard,
  runReducedMotion,
  runOffline,
  runDpr,
  runCoarseProbe,
  readSurface,
  openHost,
};
