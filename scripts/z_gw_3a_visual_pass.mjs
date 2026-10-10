#!/usr/bin/env node
/**
 * GW-3A local visual pass: file:// Golden Foundation Shell.
 * No deploy, no private registry reads, no Twin insert.
 */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "@playwright/test";

const ROOT = process.cwd();
const SHELL = path.join(ROOT, "docs", "golden-website", "shell");
const OUT_DIR = path.join(ROOT, "docs", "golden-website", "gw-3a", "screenshots");
const METRICS = path.join(ROOT, "docs", "golden-website", "gw-3a", "visual_pass_metrics.json");
const findings = [];
const errors = [];

function pageUrl(file) {
  return pathToFileURL(path.join(SHELL, file)).href;
}

function note(ok, id, detail) {
  const row = { ok, id, detail };
  findings.push(row);
  const mark = ok ? "PASS" : "FAIL";
  console.log(`${mark}  ${id}${detail ? ` — ${detail}` : ""}`);
  if (!ok) errors.push(`${id}: ${detail}`);
}

fs.mkdirSync(OUT_DIR, { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ reducedMotion: "reduce" });
const page = await context.newPage();

async function overflow(label) {
  const m = await page.evaluate(() => {
    const doc = document.documentElement;
    return {
      scrollWidth: doc.scrollWidth,
      clientWidth: doc.clientWidth,
      overflowX: doc.scrollWidth > doc.clientWidth + 2,
    };
  });
  note(!m.overflowX, `overflow:${label}`, JSON.stringify(m));
  return m;
}

await page.setViewportSize({ width: 1440, height: 900 });
await page.goto(pageUrl("index.html"), { waitUntil: "domcontentloaded" });
note(
  (await page.locator("html").getAttribute("data-disable-auto-compass")) !== null,
  "compass-opt-out",
  "data-disable-auto-compass present",
);
note((await page.locator("h1").textContent())?.trim() === "The Golden Website", "home-title", await page.locator("h1").textContent());
const homeText = await page.locator("body").innerText();
note(homeText.includes("Gateway to the Z-Sanctuary Universe"), "subtitle", "");
note(homeText.includes("governed multi-project AI development ecosystem"), "approved-core-sentence", "");
note(homeText.includes("QUALIFIED is not VERIFIED"), "qualified-not-verified", "");
note(homeText.includes("Explore Z-Sanctuary"), "cta-explore-core", "");
note(homeText.includes("Show Me What's Real"), "cta-evidence", "");
note(homeText.includes("Explore the Navigator"), "cta-navigator", "");
note(!(await page.locator("#gw-evidence-board").isVisible()), "evidence-hidden-by-default", "");
await page.screenshot({ path: path.join(OUT_DIR, "01-home-desktop.png") });

await page.locator("#gw-evidence-cta").click();
note(await page.locator("body").evaluate((el) => el.classList.contains("evidence-mode")), "evidence-mode-on", "");
note(await page.locator("#gw-evidence-board").isVisible(), "evidence-board-visible", "");
const board = await page.locator("#gw-evidence-board").innerText();
note(
  board.includes("Z-Sanctuary Core") && board.includes("QUALIFIED") && board.includes("PASS") && /Open Z-Sanctuary Core/.test(board),
  "core-evidence-card",
  board.slice(0, 220),
);
note(
  board.includes("Universal Workstation Navigator") && board.includes("SEALED") && board.includes("WORKING LOCAL") && board.includes("Public production: NO"),
  "navigator-evidence-card",
  "",
);
note((await page.locator("#gw-evidence-toggle").getAttribute("aria-pressed")) === "true", "aria-pressed", "");
await page.locator("#gw-evidence-board").screenshot({ path: path.join(OUT_DIR, "02-home-evidence-board.png") });
await page.screenshot({ path: path.join(OUT_DIR, "03-home-evidence-desktop.png") });

const lockedCount = await page.locator("#gw-locked li").count();
note(lockedCount === 9, "locked-count", String(lockedCount));
note((await page.locator("#gw-locked button").count()) === 0, "locked-not-dead-buttons", "");
note(homeText.includes("These are not broken links") || (await page.locator("body").innerText()).includes("These are not broken links"), "locked-explained", "");
note(!(await page.locator("body").innerText()).match(/dashboard\/Html/i), "no-hodp-html", "");
await page.locator("#gw-locked").screenshot({ path: path.join(OUT_DIR, "10-home-locked-doors.png") });

await page.goto(pageUrl("core.html"), { waitUntil: "domcontentloaded" });
const coreText = await page.locator("body").innerText();
note(coreText.includes("Evidence state: QUALIFIED"), "core-qualified", "");
note(coreText.includes("Public evidence gate: PASS"), "core-gate-pass", "");
note(coreText.includes("Not VERIFIED"), "core-not-verified-pill", "");
note(!/Evidence state:\s*VERIFIED/.test(coreText), "core-not-rewritten-verified", "");
await page.screenshot({ path: path.join(OUT_DIR, "04-core-desktop.png") });

await page.goto(pageUrl("navigator.html"), { waitUntil: "domcontentloaded" });
const navText = await page.locator("body").innerText();
note(navText.includes("WORKING local UI"), "nav-working-local", "");
note(navText.includes("Public production: NO"), "nav-no-production", "");
note(/not Golden Universe Map/i.test(navText), "nav-not-map", "");
note(/no execution authority/i.test(navText), "nav-no-execution", "");
note((await page.locator("#gw-preview-rail button").count()) === 2, "preview-two-records", "");
await page.locator("#gw-preview-rail button").nth(1).click();
const panel = await page.locator("#gw-preview-panel").innerText();
note(panel.includes("Universal Workstation Navigator"), "preview-switch", "");
note(/not a public production service/i.test(panel), "preview-not-production", "");
await page.screenshot({ path: path.join(OUT_DIR, "05-navigator-desktop.png") });

await page.goto(pageUrl("index.html"), { waitUntil: "domcontentloaded" });
await page.evaluate(() => sessionStorage.removeItem("gwEvidenceMode"));
await page.reload({ waitUntil: "domcontentloaded" });
await page.keyboard.press("Tab");
const skipFocused = await page.evaluate(() => document.activeElement && document.activeElement.classList.contains("skip"));
note(skipFocused, "keyboard-skip-first", await page.evaluate(() => document.activeElement && document.activeElement.tagName));
await page.screenshot({ path: path.join(OUT_DIR, "06-home-skip-focus.png") });
await page.keyboard.press("Enter");
note((await page.evaluate(() => location.hash)) === "#main", "skip-jumps-main", await page.evaluate(() => location.hash));
note((await page.evaluate(() => document.activeElement && document.activeElement.id)) === "main", "skip-focuses-main", await page.evaluate(() => document.activeElement && document.activeElement.id));
const beforeToggle = await page.locator("body").evaluate((el) => el.classList.contains("evidence-mode"));
note(beforeToggle === false, "keyboard-evidence-starts-off", String(beforeToggle));
await page.locator("#gw-evidence-toggle").focus();
await page.keyboard.press("Enter");
const afterToggle = await page.locator("body").evaluate((el) => el.classList.contains("evidence-mode"));
note(afterToggle === true, "keyboard-evidence-toggle", `${beforeToggle} -> ${afterToggle}`);

await page.goto(pageUrl("navigator.html"), { waitUntil: "domcontentloaded" });
await page.locator("#gw-preview-rail button").first().focus();
await page.keyboard.press("ArrowDown");
note(
  ((await page.locator("#gw-preview-panel h3").textContent()) || "").includes("Universal Workstation Navigator"),
  "keyboard-rail-arrow",
  await page.locator("#gw-preview-panel h3").textContent(),
);

const overflowRows = [];
for (const vp of [
  { name: "desktop", width: 1440, height: 900 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "mobile", width: 390, height: 844 },
]) {
  await page.setViewportSize({ width: vp.width, height: vp.height });
  for (const file of ["index.html", "core.html", "navigator.html"]) {
    await page.goto(pageUrl(file), { waitUntil: "domcontentloaded" });
    overflowRows.push({ viewport: vp.name, page: file, ...(await overflow(`${file}@${vp.name}`)) });
  }
}

await page.setViewportSize({ width: 768, height: 1024 });
await page.goto(pageUrl("index.html"), { waitUntil: "domcontentloaded" });
await page.screenshot({ path: path.join(OUT_DIR, "07-home-tablet.png") });
await page.setViewportSize({ width: 390, height: 844 });
await page.goto(pageUrl("index.html"), { waitUntil: "domcontentloaded" });
await page.screenshot({ path: path.join(OUT_DIR, "08-home-mobile.png") });
await page.goto(pageUrl("navigator.html"), { waitUntil: "domcontentloaded" });
await page.screenshot({ path: path.join(OUT_DIR, "09-navigator-mobile.png") });

const unnamed = await page.evaluate(() => {
  const bad = [];
  for (const el of document.querySelectorAll("button, a[href], [role='button']")) {
    const name = el.getAttribute("aria-label") || el.getAttribute("title") || (el.textContent || "").trim();
    if (!name) bad.push(el.tagName + (el.id ? `#${el.id}` : ""));
  }
  return bad;
});
note(unnamed.length === 0, "named-controls", unnamed.join(", "));

const twin = await page.evaluate(() => ({
  n: window.GW_APPROVED && window.GW_APPROVED.records.length,
  pub: window.GW_APPROVED && window.GW_APPROVED.publication_authorized,
  live: window.GW_APPROVED && window.GW_APPROVED.twin_live_records,
}));
note(twin.n === 2, "two-records-only", String(twin.n));
note(twin.pub === false, "publication-unauthorized", String(twin.pub));
note(twin.live === 0, "twin-live-zero", String(twin.live));

await browser.close();

const report = {
  generated_at: new Date().toISOString(),
  phase: "GW-3A",
  method: "playwright-chromium file:// (not deployed)",
  findings,
  overflow: overflowRows,
  unnamed_controls: unnamed,
  screenshots: fs.readdirSync(OUT_DIR),
  pass: errors.length === 0,
};
fs.writeFileSync(METRICS, JSON.stringify(report, null, 2));
console.log(`wrote ${METRICS}`);
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log("GW-3A visual pass: PASS");
