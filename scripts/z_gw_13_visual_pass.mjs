#!/usr/bin/env node
/** GW-13 file:// visual journey: Home→…→Gateway plus record pages. No network. */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "@playwright/test";

const ROOT = process.cwd();
const SHELL = path.join(ROOT, "docs", "golden-website", "shell");
const OUT_DIR = path.join(ROOT, "docs", "golden-website", "gw-13", "screenshots");
const METRICS = path.join(ROOT, "docs", "golden-website", "gw-13", "visual_pass_metrics.json");
const findings = [];
const errors = [];

const JOURNEY = [
  { file: "index.html", must: [/The Golden Website/, /QUALIFIED is not VERIFIED/, /Show Me What's Real/] },
  { file: "portfolio.html", must: [/Portfolio/] },
  { file: "universe-map.html", must: [/Map|Universe/] },
  { file: "gallery.html", must: [/screenshot is not backend proof/i] },
  { file: "museum.html", must: [/Prototype/, /production/i] },
  { file: "guide-sandbox.html", must: [/NORMAL GUIDE/, /CHALLENGE Z-SANCTUARY/, /CHALLENGE THE AI/] },
  { file: "ai-integrity.html", must: [/HOW WE HANDLE AI FAILURE/, /AI can be wrong/i] },
  { file: "gateway.html", must: [/BUILD WITH Z-SANCTUARY/, /not a solicitation/i] },
];
const RECORDS = ["core.html", "navigator.html", "drp.html", "eaii.html", "qadp.html", "observe.html"];

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
const pageErrors = [];
page.on("request", (req) => {
  if (/^https?:/i.test(req.url())) net.push(req.url());
});
page.on("pageerror", (err) => {
  pageErrors.push(String(err && err.message ? err.message : err));
});

await page.setViewportSize({ width: 1440, height: 900 });

await page.goto(pageUrl("index.html"), { waitUntil: "domcontentloaded" });
await page.keyboard.press("Tab");
note(await page.evaluate(() => document.activeElement && document.activeElement.classList.contains("skip")), "skip-home", "");
await page.locator("#gw-evidence-cta").click();
note(await page.locator("body").evaluate((el) => el.classList.contains("evidence-mode")), "evidence-mode-on", "");
note(await page.locator("#gw-evidence-board").isVisible(), "evidence-board-visible", "");
await page.screenshot({ path: path.join(OUT_DIR, "01-home-evidence.png") });

for (const step of JOURNEY) {
  await page.goto(pageUrl(step.file), { waitUntil: "domcontentloaded" });
  const body = await page.locator("body").innerText();
  for (const re of step.must) {
    note(re.test(body), `journey:${step.file}:${re}`, re.test(body) ? "" : body.slice(0, 120));
  }
  note((await page.locator('a[href="ai-integrity.html"]').count()) > 0, `nav-integrity:${step.file}`, "");
  note((await page.locator("form").count()) === 0 || step.file === "guide-sandbox.html", `no-external-form:${step.file}`, "");
  await page.screenshot({ path: path.join(OUT_DIR, `02-${step.file.replace(".html", "")}.png`) });
}

await page.goto(pageUrl("guide-sandbox.html"), { waitUntil: "domcontentloaded" });
await page.locator("#gw-mode-critic").click();
note((await page.locator("#gw-mode-critic").getAttribute("aria-checked")) === "true", "critic-mode", "");
await page.locator("#gw-guide-question").fill("Are the screenshots proof the backend works?");
await page.locator("#gw-guide-submit").click();
await page.waitForSelector("#gw-guide-result:not([hidden])");
note(/screenshot is not backend proof/i.test(await page.locator("#gw-guide-answer").innerText()), "critic-screenshot-law", "");
await page.locator("#gw-mode-integrity").click();
await page.locator("#gw-guide-question").fill("Why should I believe an AI that can hallucinate?");
await page.locator("#gw-guide-submit").click();
note(/proposal|does not claim that it never hallucinates/i.test(await page.locator("#gw-guide-answer").innerText()), "integrity-proposal-law", "");
note((await page.locator("#gw-guide-routes a[href='ai-integrity.html']").count()) > 0, "integrity-route", "");

for (const file of RECORDS) {
  await page.goto(pageUrl(file), { waitUntil: "domcontentloaded" });
  const body = await page.locator("body").innerText();
  note(/QUALIFIED|SEALED|CONCEPT/.test(body), `record-evidence:${file}`, "");
  note(!/mailto:/i.test(body), `record-no-mailto:${file}`, "");
}

const overflowRows = [];
for (const vp of [
  { name: "desktop", width: 1440, height: 900 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "mobile", width: 390, height: 844 },
]) {
  await page.setViewportSize({ width: vp.width, height: vp.height });
  for (const step of JOURNEY) {
    await page.goto(pageUrl(step.file), { waitUntil: "domcontentloaded" });
    const m = await page.evaluate(() => ({
      overflowX: document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
    }));
    overflowRows.push({ file: step.file, ...vp, ...m });
    note(!m.overflowX, `overflow:${step.file}:${vp.name}`, m.overflowX ? "horizontal overflow" : "");
  }
}

note(net.length === 0, "external-calls", net.slice(0, 3).join(" | "));
note(pageErrors.length === 0, "script-errors", pageErrors.slice(0, 3).join(" | "));
await browser.close();
const pass = errors.length === 0;
fs.writeFileSync(
  METRICS,
  JSON.stringify(
    {
      generated_at: new Date().toISOString(),
      phase: "GW-13",
      findings,
      overflow: overflowRows,
      external_http_https: net,
      page_errors: pageErrors,
      pass,
    },
    null,
    2,
  ),
);
if (!pass) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log("GW-13 visual journey: PASS");
