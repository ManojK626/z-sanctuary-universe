#!/usr/bin/env node
/**
 * GW-6 hub-scoped discovery only. Does not copy assets into the public shell.
 * Does not scan NAS, lottery, ICIS natural-image custody, or sibling PC folders.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const FLAG = {
  fetch: /\bfetch\s*\(/i,
  localhost: /localhost:\d+|127\.0\.0\.1/i,
  winPath: /[A-Za-z]:\\/,
  iframe: /<iframe/i,
  env: /process\.env|API_KEY|sk-[A-Za-z0-9]{20,}/i,
};

function walk(dir, acc = [], ext = null) {
  if (!fs.existsSync(dir)) return acc;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === "node_modules" || e.name === ".git") continue;
      walk(p, acc, ext);
    } else if (!ext || e.name.toLowerCase().endsWith(ext)) acc.push(p);
  }
  return acc;
}

const htmlRoots = [
  path.join(ROOT, "dashboard"),
  path.join(ROOT, "docs", "public"),
  path.join(ROOT, "docs", "golden-website", "shell"),
];
const html = [];
for (const root of htmlRoots) {
  for (const file of walk(root, [], ".html")) {
    const rel = path.relative(ROOT, file).replace(/\\/g, "/");
    if (rel.includes("ZSanctuary_Labs/copies")) continue;
    const text = fs.readFileSync(file, "utf8");
    html.push({
      rel,
      flags: {
        fetch: FLAG.fetch.test(text),
        localhost: FLAG.localhost.test(text),
        winPath: FLAG.winPath.test(text),
        iframe: FLAG.iframe.test(text),
        envLike: FLAG.env.test(text),
      },
    });
  }
}

const pngRoots = [path.join(ROOT, "docs", "golden-website")];
const images = [];
for (const root of pngRoots) {
  for (const ext of [".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg"]) {
    for (const file of walk(root, [], ext)) {
      images.push(path.relative(ROOT, file).replace(/\\/g, "/"));
    }
  }
}

const icisFixtures = walk(path.join(ROOT, "data", "z_icis_visual_assets"), [], ".svg").map((f) =>
  path.relative(ROOT, f).replace(/\\/g, "/"),
);

const out = {
  schema: "gw6_discovery_scan_v1",
  phase: "GW-6",
  html_count: html.length,
  golden_website_image_count: images.length,
  icis_fixture_svg_count: icisFixtures.length,
  html_with_fetch: html.filter((h) => h.flags.fetch).length,
  html_with_localhost: html.filter((h) => h.flags.localhost).length,
  html_with_win_path: html.filter((h) => h.flags.winPath).length,
  html_with_iframe: html.filter((h) => h.flags.iframe).length,
  html,
  golden_website_images: images,
  icis_fixture_svgs: icisFixtures,
};
process.stdout.write(JSON.stringify(out, null, 2));
