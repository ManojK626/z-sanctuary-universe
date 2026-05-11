import { runGGAESP } from "./ggaesp_pipeline.js";
// MEDIUM energy (Z-ECR): build: true
const result = runGGAESP({
    moduleId: "roulette_ai",
    data: {
        profit: 72,
        risk: 48,
        noise: 26,
        build: true,
        collectiveAgreement: 70,
        herdRisk: 20,
        falseCorrelation: 15,
    },
    humanState: {
        calm: 70,
        focus: 64,
        fatigue: 20,
        anxiety: 15,
        confidence: 65,
        frustration: 12,
        disengagement: 8,
    },
});
console.log("--- MEDIUM (build) ---\n" + JSON.stringify(result, null, 2));
// HIGH energy (Z-ECR): heavy: true; ethics may HOLD if risk > 70, so use risk: 30 for illustration
const high = runGGAESP({
    moduleId: "heavy_verify",
    data: {
        heavy: true,
        profit: 75,
        risk: 30,
        noise: 20,
        collectiveAgreement: 60,
        herdRisk: 15,
        falseCorrelation: 10,
    },
    humanState: { fatigue: 20, anxiety: 15, confidence: 60 },
});
console.log("\n--- HIGH (heavy) ---\n" + JSON.stringify(high, null, 2));
