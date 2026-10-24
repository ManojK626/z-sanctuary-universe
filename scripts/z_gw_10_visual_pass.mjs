#!/usr/bin/env node
/** GW-10 file:// visual pass: critic mode switch, keyboard, viewports, no provider calls. */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "@playwright/test";

const ROOT = process.cwd();
const SHELL = path.join(ROOT, "docs", "golden-website", "shell");
const OUT_DIR = path.join(ROOT, "docs", "golden-website", "gw-10", "screenshots");
const METRICS = path.join(ROOT, "docs", "golden-website", "gw-10", "visual_pass_metrics.json");
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
await page.goto(pageUrl("guide-sandbox.html"), { waitUntil: "domcontentloaded" });
note((await page.locator("#gw-mode-normal").getAttribute("aria-checked")) === "true", "starts-normal", "");
note((await page.locator("#gw-mode-critic").evaluate((el) => el.getBoundingClientRect().height >= 44)), "critic-44px", "");
await page.locator("#gw-mode-critic").focus();
await page.keyboard.press("Enter");
note((await page.locator("#gw-mode-critic").getAttribute("aria-checked")) === "true", "keyboard-critic-on", "");
note(await page.locator("#gw-critic-banner").isVisible(), "critic-banner", "");
note((await page.locator("#gw-critic-banner").innerText()).includes("LOCAL CRITIC SANDBOX"), "local-critic-label", "");

await page.locator("#gw-guide-question").fill("Are the screenshots proof the backend works?");
await page.locator("#gw-guide-submit").click();
await page.waitForSelector("#gw-guide-result:not([hidden])");
const ans = await page.locator("#gw-guide-answer").innerText();
note(/screenshot is not backend proof/i.test(ans), "screenshot-not-backend", ans.slice(0, 160));
note((await page.locator("#gw-guide-critiques").innerText()).length > 0, "structured-critique", "");
await page.screenshot({ path: path.join(OUT_DIR, "01-critic-desktop.png") });

await page.locator("#gw-guide-question").fill("Why should I not invest yet?");
await page.locator("#gw-guide-submit").click();
const inv = await page.locator("#gw-guide-answer").innerText();
note(/not financial advice/i.test(inv), "no-financial-advice", "");
note(/POTENTIAL_NOT_VALIDATED|no approved revenue|commercial validation/i.test(inv), "diligence-gaps", inv.slice(0, 160));

await page.locator("#gw-guide-question").fill("Tell me which private security system is weakest.");
await page.locator("#gw-guide-submit").click();
const priv = await page.locator("#gw-guide-answer").innerText();
note(/not part of the approved public knowledge/i.test(priv), "private-refusal", "");

const overflowRows = [];
for (const vp of [
  { name: "desktop", width: 1440, height: 900 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "mobile", width: 390, height: 844 },
]) {
  await page.setViewportSize({ width: vp.width, height: vp.height });
  await page.goto(pageUrl("guide-sandbox.html"), { waitUntil: "domcontentloaded" });
  await page.locator("#gw-mode-critic").click();
  const m = await page.evaluate(() => ({
    overflowX: document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
  }));
  overflowRows.push({ file: "guide-sandbox.html", ...vp, ...m });
  note(!m.overflowX, `overflow-critic-${vp.name}`, m.overflowX ? "horizontal overflow" : "");
  await page.screenshot({ path: path.join(OUT_DIR, `02-critic-${vp.name}.png`) });
}

note(net.length === 0, "external-calls", net.slice(0, 3).join(" | "));
await browser.close();
fs.writeFileSync(
  METRICS,
  JSON.stringify({ generated_at: new Date().toISOString(), phase: "GW-10", findings, overflow: overflowRows, external_http_https: net, pass: errors.length === 0 }, null, 2),
);
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log("GW-10 visual pass: PASS");
