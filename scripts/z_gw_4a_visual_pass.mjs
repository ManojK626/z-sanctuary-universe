#!/usr/bin/env node
/** GW-4A file:// visual pass: six-record local portfolio. */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "@playwright/test";

const ROOT = process.cwd();
const SHELL = path.join(ROOT, "docs", "golden-website", "shell");
const OUT_DIR = path.join(ROOT, "docs", "golden-website", "gw-4a", "screenshots");
const METRICS = path.join(ROOT, "docs", "golden-website", "gw-4a", "visual_pass_metrics.json");
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
await page.goto(pageUrl("index.html"), { waitUntil: "domcontentloaded" });
note((await page.locator("#gw-portfolio article").count()) === 6, "home-portfolio-six", String(await page.locator("#gw-portfolio article").count()));
note((await page.locator("body").innerText()).includes("public-safety review"), "disclaimer", "");
await page.locator("#gw-evidence-cta").click();
const board = await page.locator("#gw-evidence-board").innerText();
note((board.match(/Evidence:/g) || []).length === 6, "evidence-six", "");
note(board.includes("QUALIFIED") && board.includes("SEALED") && !/Evidence:\s*VERIFIED/.test(board), "no-verified-promotion", "");
await page.screenshot({ path: path.join(OUT_DIR, "01-home-portfolio.png") });

await page.goto(pageUrl("portfolio.html"), { waitUntil: "domcontentloaded" });
note((await page.locator("#gw-portfolio article").count()) === 6, "portfolio-six", "");
note((await page.locator("#gw-relationships li").count()) === 5, "five-relationships", String(await page.locator("#gw-relationships li").count()));
note((await page.locator("body").innerText()).includes("Not Golden Universe Map"), "not-map", "");
await page.screenshot({ path: path.join(OUT_DIR, "02-portfolio-desktop.png") });

await page.goto(pageUrl("drp.html"), { waitUntil: "domcontentloaded" });
note((await page.locator("body").innerText()).includes("not evidence that every AI automatically behaves perfectly"), "drp-lock", "");
await page.screenshot({ path: path.join(OUT_DIR, "03-drp-desktop.png") });

await page.goto(pageUrl("eaii.html"), { waitUntil: "domcontentloaded" });
note((await page.locator("body").innerText()).includes("not an unrestricted autonomous super-intelligence"), "eaii-lock", "");
await page.screenshot({ path: path.join(OUT_DIR, "04-eaii-desktop.png") });

await page.goto(pageUrl("qadp.html"), { waitUntil: "domcontentloaded" });
note(/QADP ≠ Golden Guide AI/.test(await page.locator("body").innerText()) || (await page.locator("body").innerText()).includes("QADP is not Golden Guide AI"), "qadp-not-guide", "");
await page.screenshot({ path: path.join(OUT_DIR, "05-qadp-desktop.png") });

await page.goto(pageUrl("observe.html"), { waitUntil: "domcontentloaded" });
note((await page.locator("body").innerText()).includes("does not autonomously intervene"), "observe-lock", "");
await page.screenshot({ path: path.join(OUT_DIR, "06-observe-desktop.png") });

await page.evaluate(() => sessionStorage.removeItem("gwEvidenceMode"));
await page.goto(pageUrl("index.html"), { waitUntil: "domcontentloaded" });
await page.keyboard.press("Tab");
note(await page.evaluate(() => document.activeElement && document.activeElement.classList.contains("skip")), "skip-focus", "");
await page.locator("#gw-evidence-toggle").focus();
await page.keyboard.press("Enter");
note(await page.locator("body").evaluate((el) => el.classList.contains("evidence-mode")), "keyboard-evidence", "");

const overflowRows = [];
for (const vp of [
  { name: "desktop", width: 1440, height: 900 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "mobile", width: 390, height: 844 },
]) {
  await page.setViewportSize({ width: vp.width, height: vp.height });
  for (const file of ["index.html", "portfolio.html", "drp.html", "qadp.html", "navigator.html"]) {
    await page.goto(pageUrl(file), { waitUntil: "domcontentloaded" });
    const m = await page.evaluate(() => ({
      overflowX: document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
    }));
    overflowRows.push({ viewport: vp.name, page: file, ...m });
    note(!m.overflowX, `overflow:${file}@${vp.name}`, JSON.stringify(m));
  }
}

await page.setViewportSize({ width: 390, height: 844 });
await page.goto(pageUrl("portfolio.html"), { waitUntil: "domcontentloaded" });
await page.screenshot({ path: path.join(OUT_DIR, "07-portfolio-mobile.png") });

const n = await page.evaluate(() => window.GW_APPROVED && window.GW_APPROVED.records.length);
note(n === 6, "adapter-six", String(n));
note(await page.evaluate(() => window.GW_APPROVED.publication_authorized) === false, "not-published", "");

await browser.close();
fs.writeFileSync(METRICS, JSON.stringify({ generated_at: new Date().toISOString(), phase: "GW-4A", findings, overflow: overflowRows, pass: errors.length === 0 }, null, 2));
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log("GW-4A visual pass: PASS");
