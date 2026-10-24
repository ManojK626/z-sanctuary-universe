'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const runtime = require('../core/z_adaptive_runtime.cjs');

function media(map) {
  return function (query) {
    if (!Object.prototype.hasOwnProperty.call(map, query)) return { matches: false };
    return { matches: map[query] };
  };
}

function box(width, height, scale) {
  return {
    visualViewport: { width, height, scale },
    innerWidth: width - 20,
    innerHeight: height - 20,
  };
}

assert.strictEqual(runtime.layoutFromWidth(859), 'mobile');
assert.strictEqual(runtime.layoutFromWidth(860), 'compact');
assert.strictEqual(runtime.layoutFromWidth(1279), 'compact');
assert.strictEqual(runtime.layoutFromWidth(1280), 'standard');
assert.strictEqual(runtime.layoutFromWidth(1599), 'standard');
assert.strictEqual(runtime.layoutFromWidth(1600), 'wide');
assert.strictEqual(runtime.layoutFromWidth(320), 'mobile');
assert.strictEqual(runtime.layoutFromWidth(390), 'mobile');
assert.strictEqual(runtime.layoutFromWidth(768), 'mobile');
assert.strictEqual(runtime.layoutFromWidth(1024), 'compact');
assert.strictEqual(runtime.layoutFromWidth(1366), 'standard');
assert.strictEqual(runtime.layoutFromWidth(1440), 'standard');
assert.strictEqual(runtime.layoutFromWidth(1920), 'wide');
assert.strictEqual(runtime.layoutFromWidth(2560), 'wide');

const zoomed = runtime.availableBox(box(1366, 768, 2));
assert.strictEqual(zoomed.width, 1366);
assert.strictEqual(zoomed.height, 768);
assert.strictEqual(zoomed.scale, 2);
assert.strictEqual(zoomed.source, 'visualViewport');
assert.strictEqual(runtime.layoutFromWidth(zoomed.width), 'standard');

const fallback = runtime.availableBox({ innerWidth: 390, innerHeight: 844 });
assert.strictEqual(fallback.source, 'innerWidth');
assert.strictEqual(fallback.width, 390);
assert.strictEqual(runtime.orientationFromBox({ width: 390, height: 844 }), 'portrait');
assert.strictEqual(runtime.orientationFromBox({ width: 1024, height: 768 }), 'landscape');
assert.strictEqual(runtime.orientationFromBox({ width: 0, height: 0 }), 'unknown');

assert.strictEqual(runtime.primaryPointer(null), 'unknown');
assert.strictEqual(runtime.primaryPointer(media({ '(pointer: coarse)': true, '(pointer: fine)': false })), 'coarse');
assert.strictEqual(runtime.primaryPointer(media({ '(pointer: coarse)': false, '(pointer: fine)': true })), 'fine');
assert.strictEqual(runtime.primaryPointer(media({ '(pointer: coarse)': true, '(pointer: fine)': true })), 'unknown');
assert.strictEqual(runtime.primaryPointer(media({})), 'unknown');
assert.strictEqual(runtime.primaryHover(null), 'unknown');
assert.strictEqual(runtime.primaryHover(media({ '(hover: hover)': true, '(hover: none)': false })), 'hover');
assert.strictEqual(runtime.primaryHover(media({ '(hover: hover)': false, '(hover: none)': true })), 'none');
assert.strictEqual(runtime.primaryHover(media({ '(hover: hover)': true, '(hover: none)': true })), 'unknown');
assert.strictEqual(runtime.motion(null), 'unknown');
assert.strictEqual(runtime.motion(media({ '(prefers-reduced-motion: reduce)': true })), 'reduce');
assert.strictEqual(runtime.motion(media({ '(prefers-reduced-motion: reduce)': false })), 'no-preference');
assert.strictEqual(runtime.connectivity(null), 'unknown');
assert.strictEqual(runtime.connectivity({ onLine: false }), 'offline');
assert.strictEqual(runtime.connectivity({ onLine: true }), 'online');

const reading = runtime.read({
  visualViewport: { width: 1440, height: 900, scale: 3 },
  matchMedia: media({ '(pointer: fine)': true, '(pointer: coarse)': false, '(hover: hover)': true }),
  navigator: { onLine: true },
});
assert.strictEqual(reading.layout, 'standard');
assert.strictEqual(reading.viewportScale, 3);
assert.strictEqual(reading.pointer, 'fine');
assert.notStrictEqual(reading.layout, 'ultra');

const helper = fs.readFileSync(path.join(__dirname, '..', 'core', 'z_adaptive_runtime.cjs'), 'utf8');
const helperCode = helper.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
assert.ok(!/colorDepth|pixelDepth|deviceMemory|hardwareConcurrency|gpu|quarantine|approval/i.test(helperCode));
assert.ok(!helper.includes('z-status-rail'));
assert.ok(!helper.includes('zvp-'));

const engine = fs.readFileSync(path.join(__dirname, '..', 'core', 'z_layout_engine.js'), 'utf8');
assert.ok(engine.includes('ZAdaptiveRuntime'));
assert.ok(!engine.includes('raw / viewportScale'));
assert.ok(engine.includes('runLegacy'));

console.log('Z_ADAPTIVE_RUNTIME_UNIT: PASS');
