/**
 * Dev-only: one heatmap / LPBS-style payload → GGAESP → V2 memory line (append-only JSONL).
 * Build (from ZSanctuary_Universe root): npm run ts:build:ggaesp
 * Run: node core_engine/dist_heatmap/ggaesp_heatmap_dev_sample.js
 *   or: node core_engine/browser/ggaesp_heatmap_dev_sample.js (shim)
 * Do not mount from UI or HODP.
 */
import { createHash } from "node:crypto";
import { appendGgaespZecrResult } from "../node/ggaesp_memory.js";
import { runGGAESP } from "../browser/ggaesp_pipeline.js";
function capsuleLineHash(line) {
    return createHash("sha256").update(line, "utf8").digest("hex");
}
const payload = runGGAESP({
    moduleId: "heatmap_ai_dev_sample",
    data: {
        profit: 64,
        risk: 38,
        noise: 32,
        build: true,
        collectiveAgreement: 68,
        herdRisk: 22,
        falseCorrelation: 18,
        stability: 55,
        momentum: 48,
    },
    humanState: { fatigue: 18, anxiety: 14, confidence: 58 },
});
const { memoryCapsule, ...rest } = payload;
const { path, bytes, line } = appendGgaespZecrResult({
    moduleId: payload.moduleId,
    timestamp: payload.timestamp,
    energyMode: payload.energyMode,
    branch: payload.branch,
    memoryCapsule,
}, { extra: { source: "core_engine/heatmap_dev/ggaesp_heatmap_dev_sample.ts", dev: true } });
console.log(JSON.stringify({
    decision: rest.decision,
    polarity: rest.polarity,
    metaScore: rest.metaScore,
    confidence: rest.confidence,
    capsuleLineBytes: bytes,
    capsuleLineSha256: capsuleLineHash(line),
    store: path,
}, null, 2));
console.log("GGAESP heatmap dev sample: one JSONL line appended (GGAESP_MEMORY_V2).");
