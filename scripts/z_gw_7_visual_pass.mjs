#!/usr/bin/env node
/** GW-7 file:// visual pass: gallery lightbox + museum truth panel. */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "@playwright/test";

const ROOT = process.cwd();
const SHELL = path.join(ROOT, "docs", "golden-website", "shell");
const OUT_DIR = path.join(ROOT, "docs", "golden-website", "gw-7", "screenshots");
const METRICS = path.join(ROOT, "docs", "golden-website", "gw-7", "visual_pass_metrics.json");
const findings = [];
const errors = [];

function pageUrl(file) {
  return pathToFileURL(path.join(SHELL, file)).href;
}
function note(ok, id, detail) {
  findings.push({ ok, id, detail });
  console.log(`${ok ? "PASS" : "FAIL"}  ${id}${detail ? ` — ${detail}` : ""}`);
  if (!ok) errors.push(`${id}: ${detail}`);
}

fs.mkdirSync(OUT_DIR, { recursive: true });
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ reducedMotion: "reduce" });
const page = await context.newPage();

await page.setViewportSize({ width: 1440, height: 900 });
await page.goto(pageUrl("gallery.html"), { waitUntil: "domcontentloaded" });
const gBody = await page.locator("body").innerText();
note((await page.locator(".gallery-card").count()) === 6, "six-visuals", String(await page.locator(".gallery-card").count()));
note((await page.locator(".gallery-card--historical").count()) === 1, "one-historical", "");
note(gBody.includes("HISTORICAL REAL UI CAPTURE"), "historical-label", "");
note(gBody.includes("earlier two-record Golden Foundation Shell"), "historical-copy", "");
note(!gBody.includes("Knowledge Ask") && !gBody.includes("Cycle Dashboard") && !gBody.includes("Ecosphere"), "no-gated-names", "");
note((await page.locator(".gallery-open img").evaluateAll((imgs) => imgs.every((img) => img.naturalWidth > 0))), "images-loaded", "");

await page.locator(".gallery-open").first().click();
note(await page.locator("#gw-gallery-dialog").evaluate((el) => !el.hidden), "click-opens-large-view", "");
await page.screenshot({ path: path.join(OUT_DIR, "01-gallery-desktop-largeview.png") });
await page.keyboard.press("Escape");
note(await page.locator("#gw-gallery-dialog").evaluate((el) => el.hidden), "escape-closes", "");

await page.locator(".gallery-card--historical .gallery-open").focus();
await page.keyboard.press("Enter");
note((await page.locator("#gw-gallery-dialog-body").innerText()).includes("does not represent the current six-record portfolio"), "keyboard-historical", "");
await page.keyboard.press("Escape");

await page.goto(pageUrl("museum.html"), { waitUntil: "domcontentloaded" });
const mBody = await page.locator("body").innerText();
note(mBody.includes("LOCAL WORKING PROTOTYPE"), "museum-type", "");
note(mBody.includes("PUBLIC SERVICE") && mBody.includes("NO"), "not-public-service", "");
note(mBody.includes("This exhibit demonstrates the current local Golden Website"), "museum-explain", "");
note(mBody.includes("Additional prototypes remain behind sanitization"), "gated-generic", "");
note(!mBody.includes("Knowledge Ask") && !mBody.includes("Living Ecosphere"), "museum-no-gated", "");
note((await page.locator("#gw-museum-exhibit a[href='index.html']").count()) > 0, "link-home", "");
note((await page.locator("#gw-museum-exhibit a[href='gallery.html']").count()) > 0, "link-gallery", "");
await page.screenshot({ path: path.join(OUT_DIR, "02-museum-desktop.png") });

await page.evaluate(() => sessionStorage.removeItem("gwEvidenceMode"));
await page.goto(pageUrl("gallery.html"), { waitUntil: "domcontentloaded" });
await page.keyboard.press("Tab");
note(await page.evaluate(() => document.activeElement && document.activeElement.classList.contains("skip")), "skip-focus", "");

const overflowRows = [];
for (const vp of [
  { name: "desktop", width: 1440, height: 900 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "mobile", width: 390, height: 844 },
]) {
  await page.setViewportSize({ width: vp.width, height: vp.height });
  for (const file of ["gallery.html", "museum.html"]) {
    await page.goto(pageUrl(file), { waitUntil: "domcontentloaded" });
    const m = await page.evaluate(() => ({
      overflowX: document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
    }));
    overflowRows.push({ file, ...vp, ...m });
    note(!m.overflowX, `overflow-${file}-${vp.name}`, m.overflowX ? "horizontal overflow" : "");
  }
  await page.screenshot({ path: path.join(OUT_DIR, `03-gallery-${vp.name}.png`) });
}

await browser.close();
fs.writeFileSync(
  METRICS,
  JSON.stringify({ generated_at: new Date().toISOString(), phase: "GW-7", findings, overflow: overflowRows, pass: errors.length === 0 }, null, 2),
);
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log("GW-7 visual pass: PASS");
