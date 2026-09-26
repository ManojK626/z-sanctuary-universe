#!/usr/bin/env node
/** GW-5 file:// visual pass: six-node map, keyboard, evidence mode. */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "@playwright/test";

const ROOT = process.cwd();
const SHELL = path.join(ROOT, "docs", "golden-website", "shell");
const OUT_DIR = path.join(ROOT, "docs", "golden-website", "gw-5", "screenshots");
const METRICS = path.join(ROOT, "docs", "golden-website", "gw-5", "visual_pass_metrics.json");
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
await page.goto(pageUrl("universe-map.html"), { waitUntil: "domcontentloaded" });
const body = await page.locator("body").innerText();
note(body.includes("Foundation Preview — six approved public-safe capabilities only."), "foundation-line", "");
note(body.includes("This is not the complete Z-Sanctuary Universe."), "incomplete-line", "");
note((await page.locator(".map-node").count()) === 6, "six-nodes", String(await page.locator(".map-node").count()));
note((await page.locator("#gw-map-legend li").count()) === 5, "five-relationships", String(await page.locator("#gw-map-legend li").count()));
note(body.includes("governed_with") && body.includes("observed_with") && body.includes("coordinated_with"), "relationship-labels", "");
note((await page.locator(".map-node-evidence").allTextContents()).every((t) => !/Evidence:\s*VERIFIED/.test(t)), "no-verified-nodes", "");

await page.locator('.map-node[data-id="z_sanctuary_core"]').click();
note(await page.locator("#gw-map-panel").evaluate((el) => !el.hidden), "click-opens-panel", "");
note((await page.locator("#gw-map-panel-body").innerText()).includes("governed multi-project"), "core-details", "");
note(!(await page.locator("#gw-map-panel-body").innerText()).includes("C:\\"), "no-private-path", "");
await page.screenshot({ path: path.join(OUT_DIR, "01-map-desktop-core.png") });

await page.keyboard.press("Escape");
note(await page.locator("#gw-map-panel").evaluate((el) => el.hidden), "escape-closes", "");

await page.locator('.map-node[data-id="fourteen_drp_protocols"]').focus();
await page.keyboard.press("Enter");
note((await page.locator("#gw-map-panel-body").innerText()).includes("not evidence that every AI automatically behaves perfectly") ||
  (await page.locator("#gw-map-panel-body").innerText()).includes("Humans remain authoritative"), "keyboard-enter-drp", "");
await page.keyboard.press("Escape");

await page.locator('.map-node[data-id="cycle_observe"]').focus();
await page.keyboard.press("Space");
note((await page.locator("#gw-map-panel-body").innerText()).includes("does not autonomously intervene"), "keyboard-space-observe", "");
await page.keyboard.press("Escape");

await page.locator("#gw-evidence-toggle").click();
note(await page.locator("body").evaluate((el) => el.classList.contains("evidence-mode")), "evidence-mode", "");
note((await page.locator(".map-node").count()) === 6, "evidence-keeps-six", "");
note((await page.locator("#gw-evidence-board").innerText()).includes("QUALIFIED"), "evidence-board-qualified", "");
await page.screenshot({ path: path.join(OUT_DIR, "02-map-desktop-evidence.png") });

await page.evaluate(() => sessionStorage.removeItem("gwEvidenceMode"));
await page.goto(pageUrl("universe-map.html"), { waitUntil: "domcontentloaded" });
await page.keyboard.press("Tab");
note(await page.evaluate(() => document.activeElement && document.activeElement.classList.contains("skip")), "skip-focus", "");

const overflowRows = [];
for (const vp of [
  { name: "desktop", width: 1440, height: 900 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "mobile", width: 390, height: 844 },
]) {
  await page.setViewportSize({ width: vp.width, height: vp.height });
  await page.goto(pageUrl("universe-map.html"), { waitUntil: "domcontentloaded" });
  const m = await page.evaluate(() => ({
    overflowX: document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
    nodeCount: document.querySelectorAll(".map-node").length,
  }));
  overflowRows.push({ ...vp, ...m });
  note(!m.overflowX, `overflow-${vp.name}`, m.overflowX ? "horizontal overflow" : "");
  note(m.nodeCount === 6, `nodes-${vp.name}`, String(m.nodeCount));
  await page.screenshot({ path: path.join(OUT_DIR, `03-map-${vp.name}.png`) });
}

await page.setViewportSize({ width: 390, height: 844 });
await page.locator('.map-node[data-id="univ_workstation_navigator"]').click();
note((await page.locator("#gw-map-panel-body").innerText()).includes("read-only"), "mobile-nav-details", "");
await page.screenshot({ path: path.join(OUT_DIR, "04-map-mobile-panel.png") });

await browser.close();
fs.writeFileSync(
  METRICS,
  JSON.stringify(
    {
      generated_at: new Date().toISOString(),
      phase: "GW-5",
      findings,
      overflow: overflowRows,
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
console.log("GW-5 visual pass: PASS");
