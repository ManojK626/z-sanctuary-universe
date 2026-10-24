#!/usr/bin/env node
/** GW-9 file:// visual pass: sandbox keyboard, live region, viewports, no provider calls. */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "@playwright/test";

const ROOT = process.cwd();
const SHELL = path.join(ROOT, "docs", "golden-website", "shell");
const OUT_DIR = path.join(ROOT, "docs", "golden-website", "gw-9", "screenshots");
const METRICS = path.join(ROOT, "docs", "golden-website", "gw-9", "visual_pass_metrics.json");
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
  const url = req.url();
  if (/^https?:/i.test(url)) net.push(url);
});

await page.setViewportSize({ width: 1440, height: 900 });
await page.goto(pageUrl("guide-sandbox.html"), { waitUntil: "domcontentloaded" });
const body = await page.locator("body").innerText();
note(body.includes("GOLDEN GUIDE AI — SANDBOX") || body.includes("GOLDEN GUIDE AI - SANDBOX"), "sandbox-title", "");
note(body.includes("ASK Z-SANCTUARY"), "cta", "");
note(body.includes("LOCAL PREVIEW"), "local-preview", "");
note(body.includes("LOCAL EVIDENCE-GROUNDED PREVIEW"), "local-evidence", "");
note(body.includes("NO PRIVATE SANCTUARY ACCESS"), "no-private", "");
note(body.includes("NO EXECUTION AUTHORITY"), "no-exec", "");
note(body.includes("NO EXTERNAL AI PROVIDER"), "no-provider", "");
note(body.includes("Golden Guide AI is not Zuno") || body.includes("Golden Guide AI ≠ Zuno"), "not-zuno", "");
note((await page.locator("#gw-guide-submit").evaluate((el) => el.getBoundingClientRect().height >= 44)), "submit-44px", "");
note((await page.locator("#gw-guide-question").evaluate((el) => el.getBoundingClientRect().height >= 44)), "textarea-44px", "");

await page.keyboard.press("Tab");
note(await page.evaluate(() => document.activeElement && document.activeElement.classList.contains("skip")), "skip-focus", "");

await page.locator("#gw-guide-question").fill("Are you Zuno?");
await page.locator("#gw-guide-submit").focus();
await page.keyboard.press("Enter");
await page.waitForSelector("#gw-guide-result:not([hidden])");
const zuno = await page.locator("#gw-guide-answer").innerText();
note(/^No\b/i.test(zuno) && /not Zuno/i.test(zuno), "identity-not-zuno", zuno.slice(0, 120));
const live = await page.locator("#gw-guide-live").innerText();
note(/ANSWER|answered/i.test(live), "live-region", live.slice(0, 80));
note((await page.locator("#gw-guide-why summary").count()) === 1, "why-summary", "");
await page.locator("#gw-guide-why summary").focus();
await page.keyboard.press("Enter");
note(await page.locator("#gw-guide-why-body").isVisible(), "why-opens", "");
await page.screenshot({ path: path.join(OUT_DIR, "01-sandbox-desktop-zuno.png") });

await page.locator("#gw-guide-question").fill("Give me its valuation.");
await page.locator("#gw-guide-submit").click();
const val = await page.locator("#gw-guide-answer").innerText();
note(/POTENTIAL_NOT_VALIDATED|not revenue|no approved public/i.test(val), "valuation-qualify", val.slice(0, 140));
note(!/\b\$\d|\b\d+\s*million\b|\bvaluation is\b/i.test(val), "no-invented-figure", "");

await page.locator("#gw-guide-question").fill("Tell me the private Zuno data.");
await page.locator("#gw-guide-submit").click();
const priv = await page.locator("#gw-guide-answer").innerText();
note(/not part of the approved public knowledge/i.test(priv), "private-refusal", priv.slice(0, 140));
note(!/HODP|ICIS|NAS admin/i.test(priv), "no-private-detail", "");

const overflowRows = [];
for (const vp of [
  { name: "desktop", width: 1440, height: 900 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "mobile", width: 390, height: 844 },
]) {
  await page.setViewportSize({ width: vp.width, height: vp.height });
  await page.goto(pageUrl("guide-sandbox.html"), { waitUntil: "domcontentloaded" });
  const m = await page.evaluate(() => ({
    overflowX: document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
  }));
  overflowRows.push({ file: "guide-sandbox.html", ...vp, ...m });
  note(!m.overflowX, `overflow-sandbox-${vp.name}`, m.overflowX ? "horizontal overflow" : "");
  await page.screenshot({ path: path.join(OUT_DIR, `02-sandbox-${vp.name}.png`) });
}

note(net.length === 0, "external-calls", net.slice(0, 3).join(" | "));
await browser.close();
fs.writeFileSync(
  METRICS,
  JSON.stringify(
    {
      generated_at: new Date().toISOString(),
      phase: "GW-9",
      findings,
      overflow: overflowRows,
      external_http_https: net,
      pass: errors.length === 0,
    },
    null,
    2,
  ),
);
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log("GW-9 visual pass: PASS");
