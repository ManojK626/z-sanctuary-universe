#!/usr/bin/env node
/** GW-12 file:// visual pass: integrity page, Challenge the AI, viewports, no network. */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "@playwright/test";

const ROOT = process.cwd();
const SHELL = path.join(ROOT, "docs", "golden-website", "shell");
const OUT_DIR = path.join(ROOT, "docs", "golden-website", "gw-12", "screenshots");
const METRICS = path.join(ROOT, "docs", "golden-website", "gw-12", "visual_pass_metrics.json");
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
await page.goto(pageUrl("ai-integrity.html"), { waitUntil: "domcontentloaded" });
const body = await page.locator("body").innerText();
note(/HOW WE HANDLE AI FAILURE/.test(body), "title", "");
note(/AI can be wrong/i.test(body) && /sound confident while wrong/i.test(body), "failure-facts", "");
note(/does not claim that it never hallucinates|treats AI output as a proposal/i.test(body), "credible-answer", "");
note(/approved corpus/i.test(body) && /claim guard/i.test(body), "defense-stack", "");
note(/metaphor/i.test(body) && /implemented capability/i.test(body), "metaphor-law", "");
note(!(await page.locator("form").count()), "no-form", "");
note(!(await page.locator("a[href^='mailto:']").count()), "no-mailto", "");
await page.keyboard.press("Tab");
note(await page.evaluate(() => document.activeElement && document.activeElement.classList.contains("skip")), "skip-focus", "");
await page.screenshot({ path: path.join(OUT_DIR, "01-integrity-desktop.png") });

await page.goto(pageUrl("guide-sandbox.html"), { waitUntil: "domcontentloaded" });
note((await page.locator("#gw-mode-integrity").evaluate((el) => el.getBoundingClientRect().height >= 44)), "integrity-44px", "");
await page.locator("#gw-mode-integrity").click();
note((await page.locator("#gw-mode-integrity").getAttribute("aria-checked")) === "true", "integrity-mode-on", "");
note(await page.locator("#gw-integrity-banner").isVisible(), "integrity-banner", "");
await page.locator("#gw-guide-question").fill("Why should I believe an AI that can hallucinate?");
await page.locator("#gw-guide-submit").click();
await page.waitForSelector("#gw-guide-result:not([hidden])");
const ans = await page.locator("#gw-guide-answer").innerText();
note(/proposal|approved evidence|does not claim that it never hallucinates/i.test(ans), "hallucination-answer", ans.slice(0, 180));
note((await page.locator("#gw-guide-routes a[href='ai-integrity.html']").count()) > 0, "guide-routes-integrity", "");
note(!(/K-FAKE/i.test(ans)), "no-fake-citation", "");
await page.screenshot({ path: path.join(OUT_DIR, "02-challenge-ai-desktop.png") });

const overflowRows = [];
for (const vp of [
  { name: "desktop", width: 1440, height: 900 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "mobile", width: 390, height: 844 },
]) {
  await page.setViewportSize({ width: vp.width, height: vp.height });
  await page.goto(pageUrl("ai-integrity.html"), { waitUntil: "domcontentloaded" });
  const m = await page.evaluate(() => ({
    overflowX: document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
  }));
  overflowRows.push({ file: "ai-integrity.html", ...vp, ...m });
  note(!m.overflowX, `overflow-integrity-${vp.name}`, m.overflowX ? "horizontal overflow" : "");
  await page.screenshot({ path: path.join(OUT_DIR, `03-integrity-${vp.name}.png`) });
}

note(net.length === 0, "external-calls", net.slice(0, 3).join(" | "));
await browser.close();
fs.writeFileSync(
  METRICS,
  JSON.stringify({ generated_at: new Date().toISOString(), phase: "GW-12", findings, overflow: overflowRows, external_http_https: net, pass: errors.length === 0 }, null, 2),
);
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log("GW-12 visual pass: PASS");
