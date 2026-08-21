import { defineConfig } from "@playwright/test";
export default defineConfig({ testDir: ".", testMatch: "bare.spec.js", reporter: "line", workers: 1 });
