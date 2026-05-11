/**
 * Dev-only: LOW energy, low risk/noise, high stability + collective agreement → clean GO path.
 * Z-ECR: build false + heavy false → LOW; Guardian v15 CLEAR; Ethics v18 pass; GGAESP_MEMORY_V2 append.
 * Build: npm run ts:build:ggaesp
 * Run: npm run ts:run:ggaesp:heatmap:go
 * Do not mount from UI or HODP.
 */
import { createHash } from "node:crypto";
import { appendGgaespZecrResult } from "../node/ggaesp_memory.js";
import { runGGAESP } from "../browser/ggaesp_pipeline.js";
function capsuleLineHash(line) {
    return createHash("sha256").update(line, "utf8").digest("hex");
}
const payload = runGGAESP({
    moduleId: "heatmap_ai_go_dev_sample",
    data: {
        profit: 88,
        risk: 18,
        noise: 10,
        build: false,
        heavy: false,
        collectiveAgreement: 86,
        herdRisk: 6,
        falseCorrelation: 5,
        stability: 90,
        momentum: 82,
    },
    humanState: { calm: 85, fatigue: 8, anxiety: 6, confidence: 72 },
});
const { memoryCapsule, ...rest } = payload;
const { path, bytes, line } = appendGgaespZecrResult({
    moduleId: payload.moduleId,
    timestamp: payload.timestamp,
    energyMode: payload.energyMode,
    branch: payload.branch,
    memoryCapsule,
}, { extra: { source: "core_engine/heatmap_dev/ggaesp_heatmap_go_dev_sample.ts", dev: true, goLowEnergy: true } });
console.log(JSON.stringify({
    decision: rest.decision,
    polarity: rest.polarity,
    metaScore: rest.metaScore,
    confidence: rest.confidence,
    energyMode: rest.energyMode,
    capsuleLineBytes: bytes,
    capsuleLineSha256: capsuleLineHash(line),
    store: path,
}, null, 2));
console.log("GGAESP heatmap GO (LOW) dev sample: one JSONL line appended (GGAESP_MEMORY_V2).");
