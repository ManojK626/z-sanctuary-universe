#!/usr/bin/env node
/** GW-11 file:// visual pass: gateway pathways, proving section, viewports, no network. */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "@playwright/test";

const ROOT = process.cwd();
const SHELL = path.join(ROOT, "docs", "golden-website", "shell");
const OUT_DIR = path.join(ROOT, "docs", "golden-website", "gw-11", "screenshots");
const METRICS = path.join(ROOT, "docs", "golden-website", "gw-11", "visual_pass_metrics.json");
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
const net = [];
page.on("request", (req) => {
  if (/^https?:/i.test(req.url())) net.push(req.url());
});

await page.setViewportSize({ width: 1440, height: 900 });
await page.goto(pageUrl("gateway.html"), { waitUntil: "domcontentloaded" });
const body = await page.locator("body").innerText();
note(/BUILD WITH Z-SANCTUARY/.test(body), "title", "");
note(body.includes("PILOT WITH US") && body.includes("INVESTOR EXPLORATION") && body.includes("CONTRIBUTE EXPERTISE"), "five-pathways", "");
note(/What still needs proving/i.test(body) && /screenshot is not backend proof/i.test(body), "proving", "");
note(/not a solicitation/i.test(body) && /data room/i.test(body), "not-solicitation", "");
note(!(await page.locator("form").count()), "no-form", "");
note(!(await page.locator("a[href^='mailto:']").count()), "no-mailto", "");
await page.keyboard.press("Tab");
note(await page.evaluate(() => document.activeElement && document.activeElement.classList.contains("skip")), "skip-focus", "");
await page.screenshot({ path: path.join(OUT_DIR, "01-gateway-desktop.png") });

await page.goto(pageUrl("guide-sandbox.html"), { waitUntil: "domcontentloaded" });
await page.locator("#gw-guide-question").fill("What is the valuation?");
await page.locator("#gw-guide-submit").click();
await page.waitForSelector("#gw-guide-result:not([hidden])");
note((await page.locator("#gw-guide-routes a[href='gateway.html']").count()) > 0, "guide-routes-gateway", "");

const overflowRows = [];
for (const vp of [
  { name: "desktop", width: 1440, height: 900 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "mobile", width: 390, height: 844 },
]) {
  await page.setViewportSize({ width: vp.width, height: vp.height });
  await page.goto(pageUrl("gateway.html"), { waitUntil: "domcontentloaded" });
  const m = await page.evaluate(() => ({
    overflowX: document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
  }));
  overflowRows.push({ file: "gateway.html", ...vp, ...m });
  note(!m.overflowX, `overflow-gateway-${vp.name}`, m.overflowX ? "horizontal overflow" : "");
  await page.screenshot({ path: path.join(OUT_DIR, `02-gateway-${vp.name}.png`) });
}

note(net.length === 0, "external-calls", net.slice(0, 3).join(" | "));
await browser.close();
fs.writeFileSync(
  METRICS,
  JSON.stringify({ generated_at: new Date().toISOString(), phase: "GW-11", findings, overflow: overflowRows, external_http_https: net, pass: errors.length === 0 }, null, 2),
);
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log("GW-11 visual pass: PASS");
