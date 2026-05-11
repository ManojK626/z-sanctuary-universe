// core_engine/ggaesp_pipeline.ts
// GGAESP-360 v11→v19 unified safe pipeline (Z-ECR binding: energy + lineage)

export type Polarity = "negative" | "neutral" | "positive" | "verified";
export type Decision = "GO" | "PREPARE" | "HOLD" | "BLOCK";

/** Z-ECR — Energy classification (discipline layer). */
export type EnergyMode = "LOW" | "MEDIUM" | "HIGH";

/** Z-ECR — Z-Lineage branch record, carried with GGAESP runs. */
export interface ZECRBranch {
  origin_id: string;
  parent_context?: string;
  purpose: string;
  energy_mode: EnergyMode;
  guardian_status: "CLEAR" | "ELEVATED" | "BLOCKED";
  memory_return_path: string;
  created_at: string;
}

export interface GGAESPInput {
  moduleId: string;
  timestamp?: string;
  data: Record<string, any>;
  humanState?: {
    calm?: number;
    focus?: number;
    fatigue?: number;
    anxiety?: number;
    confidence?: number;
    frustration?: number;
    disengagement?: number;
    grounded?: number;
  };
}

export interface GGAESPOutput {
  moduleId: string;
  timestamp: string;
  metaScore: number;
  polarity: Polarity;
  decision: Decision;
  confidence: number;
  energyMode: EnergyMode;
  branch: ZECRBranch;
  reasons: string[];
  guardianNotes: string[];
  ethicsNotes: string[];
  memoryCapsule: Record<string, any>;
}

function clamp(n: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, n));
}

function average(values: number[]): number {
  if (!values.length) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

type CollectiveSource = {
  signal?: number;
  accuracy_history?: number;
  stability?: number;
  context_match?: number;
  bias_level?: number;
  recency?: number;
};

function toSignal01(n: unknown, fallback = 0.5): number {
  return clamp(typeof n === "number" ? n : fallback, 0, 100) / 100;
}

function sourceQualityWeight(src: CollectiveSource): number {
  const accuracy = toSignal01(src.accuracy_history, 60);
  const stability = toSignal01(src.stability, 60);
  const contextMatch = toSignal01(src.context_match, 60);
  const biasPenalty = toSignal01(src.bias_level, 35);
  const recency = toSignal01(src.recency, 60);
  const raw = (accuracy * 0.3 + stability * 0.2 + contextMatch * 0.25 + recency * 0.25) * (1 - biasPenalty * 0.6);
  return clamp(raw, 0.05, 1);
}

/**
 * Z-ECR: classify call energy from input hints (read-only, no I/O).
 */
function classifyEnergy(input: GGAESPInput): EnergyMode {
  const data = input.data || {};
  if (data.heavy === true || data.fullVerify === true) {
    return "HIGH";
  }
  if (data.build === true || data.update === true) {
    return "MEDIUM";
  }
  return "LOW";
}

/**
 * v11 — Base GGAESP engine
 */
function runV11(input: GGAESPInput) {
  const values = Object.values(input.data).filter((v) => typeof v === "number") as number[];

  const structure = values.length ? 70 : 40;
  const growth = values.length ? clamp(average(values)) : 50;
  const analysis = 65;
  const movement = values.length > 1 ? 60 : 45;
  const stability = values.length ? clamp(100 - Math.abs(50 - average(values))) : 50;
  const profit = typeof input.data.profit === "number" ? clamp(input.data.profit) : 50;

  const risk = typeof input.data.risk === "number" ? clamp(input.data.risk) : 40;
  const noise = typeof input.data.noise === "number" ? clamp(input.data.noise) : 30;
  const falseCorrelation =
    typeof input.data.falseCorrelation === "number" ? clamp(input.data.falseCorrelation) : 20;

  const baseScore = clamp(
    (structure + growth + analysis + movement + stability + profit) / 6 - ((risk + noise + falseCorrelation) / 3) * 0.35
  );

  return {
    structure,
    growth,
    analysis,
    movement,
    stability,
    profit,
    risk,
    noise,
    falseCorrelation,
    score: baseScore,
    reasons: [
      "v11: base structure/growth/analysis/movement/stability/profit calculated.",
      "v11: risk/noise/false-correlation penalties applied.",
    ],
  };
}

/**
 * v12 — Awareness + adaptation
 */
function runV12(v11: ReturnType<typeof runV11>, _input: GGAESPInput) {
  const awarenessFactor = v11.noise > 60 ? 0.85 : 1.0;
  const adaptationFactor = v11.stability < 45 ? 0.9 : 1.05;

  const score = clamp(v11.score * awarenessFactor * adaptationFactor);

  return {
    ...v11,
    score,
    awarenessFactor,
    adaptationFactor,
    reasons: [...v11.reasons, "v12: awareness/adaptation factors applied."],
  };
}

/**
 * v13 — Collective intelligence (bounded CSC-lite)
 */
function runV13(v12: ReturnType<typeof runV12>, input: GGAESPInput) {
  const fallbackAgreement = typeof input.data.collectiveAgreement === "number" ? clamp(input.data.collectiveAgreement) / 100 : 0.5;
  const fallbackHerdRisk = typeof input.data.herdRisk === "number" ? clamp(input.data.herdRisk) : 20;
  const maybeSources = Array.isArray(input.data.collectiveSources) ? (input.data.collectiveSources as CollectiveSource[]) : [];

  let collectiveAgreement = fallbackAgreement;
  let herdRisk = fallbackHerdRisk;
  let consensusSignal = collectiveAgreement;
  let minorityWarning = 0;
  let divergenceAlert = 0;

  if (maybeSources.length > 0) {
    const weighted = maybeSources.map((src) => {
      const signal = toSignal01(src.signal, fallbackAgreement * 100);
      const weight = sourceQualityWeight(src);
      return { signal, weight };
    });
    const totalWeight = weighted.reduce((acc, x) => acc + x.weight, 0) || 1;
    const weightedSignal = weighted.reduce((acc, x) => acc + x.signal * x.weight, 0) / totalWeight;
    const weightedVariance =
      weighted.reduce((acc, x) => {
        const d = x.signal - weightedSignal;
        return acc + x.weight * d * d;
      }, 0) / totalWeight;
    const stdDev = Math.sqrt(weightedVariance);
    const bestSignal = weighted.reduce((best, x) => (x.signal > best.signal ? x : best), weighted[0]);
    const contrarianGap = Math.max(0, bestSignal.signal - weightedSignal);

    collectiveAgreement = clamp((1 - stdDev) * 100, 0, 100) / 100;
    consensusSignal = clamp(weightedSignal * 100, 0, 100) / 100;
    minorityWarning = clamp(contrarianGap * 100, 0, 100) / 100;
    divergenceAlert = clamp(stdDev * 100, 0, 100) / 100;
    herdRisk = clamp(fallbackHerdRisk + collectiveAgreement * 15 - minorityWarning * 10 + divergenceAlert * 20, 0, 100);
  }

  const score = clamp(v12.score * (0.9 + collectiveAgreement * 0.2 + minorityWarning * 0.05) - herdRisk * 0.1);

  return {
    ...v12,
    score,
    collectiveAgreement,
    consensusSignal,
    minorityWarning,
    divergenceAlert,
    herdRisk,
    reasons: [
      ...v12.reasons,
      maybeSources.length > 0
        ? "v13: weighted collective synthesis applied (consensus/minority/divergence)."
        : "v13: collective agreement and herd-risk adjustment applied.",
    ],
  };
}

/**
 * v14 — Human emotional adaptation
 */
function runV14(v13: ReturnType<typeof runV13>, input: GGAESPInput) {
  const calm = clamp(input.humanState?.calm ?? 60);
  const focus = clamp(input.humanState?.focus ?? 55);
  const fatigue = clamp(input.humanState?.fatigue ?? 20);
  const anxiety = clamp(input.humanState?.anxiety ?? 20);
  const confidence = clamp(input.humanState?.confidence ?? 50);
  const frustration = clamp(input.humanState?.frustration ?? 20);
  const disengagement = clamp(input.humanState?.disengagement ?? 15);
  const grounded = clamp(input.humanState?.grounded ?? calm);

  const overload = (fatigue + anxiety + frustration + disengagement) / 4;
  const positiveAnchor = (calm + focus + grounded) / 3;
  const confidenceOverheat = Math.max(0, confidence - 80);
  const emotionalBiasPenalty = clamp(overload * 0.14 + confidenceOverheat * 0.1 - positiveAnchor * 0.05, 0, 30);
  const humanStabilityFactor = clamp(1 - emotionalBiasPenalty / 100 + positiveAnchor / 500, 0.75, 1.1);
  const score = clamp(v13.score * humanStabilityFactor - emotionalBiasPenalty * 0.35);

  return {
    ...v13,
    score,
    emotionalBiasPenalty,
    humanStabilityFactor,
    humanState: input.humanState ?? {},
    reasons: [
      ...v13.reasons,
      emotionalBiasPenalty > 8
        ? "v14: human-state dampening applied (stability factor + emotional bias penalty)."
        : "v14: human-state safety adjustment applied.",
    ],
  };
}

/**
 * v15 — Guardian enforcement (Z-ECR: binds branch.guardian_status)
 */
function runV15(v14: ReturnType<typeof runV14>, branch: ZECRBranch) {
  const guardianNotes: string[] = [];
  let score = v14.score;
  let decision: Decision = "GO";
  const triggerFlags = {
    highRisk: v14.risk >= 65,
    highNoise: v14.noise >= 65,
    emotionalOverload: v14.emotionalBiasPenalty >= 12,
    lowHumanStability: v14.humanStabilityFactor < 0.9,
    lowScore: v14.score < 56,
  };
  const triggerCount = Object.values(triggerFlags).filter(Boolean).length;
  const irreversibleRiskPenalty = clamp(
    Math.max(0, v14.risk - 60) * 0.45 + Math.max(0, v14.noise - 60) * 0.35 + v14.emotionalBiasPenalty * 0.8,
    0,
    40
  );
  const guardianSafetyFactor = clamp(1 - irreversibleRiskPenalty / 120 + triggerCount * 0.01, 0.7, 1);
  score = clamp(score * guardianSafetyFactor - irreversibleRiskPenalty * 0.15);

  if (v14.risk >= 85 || v14.noise >= 85) {
    decision = "BLOCK";
    score = Math.min(score, 25);
    branch.guardian_status = "BLOCKED";
    guardianNotes.push("Guardian: critical risk/noise detected. BLOCK enforced.");
  } else if (triggerCount >= 2 || v14.risk >= 65 || v14.emotionalBiasPenalty >= 15) {
    decision = "HOLD";
    score = Math.min(score, 55);
    branch.guardian_status = "ELEVATED";
    guardianNotes.push("Guardian: multi-trigger elevated risk detected. HOLD enforced.");
  } else if (score < 56) {
    decision = "PREPARE";
    branch.guardian_status = "ELEVATED";
    guardianNotes.push("Guardian: score below action threshold. PREPARE only.");
  } else {
    branch.guardian_status = "CLEAR";
    guardianNotes.push("Guardian: no critical safety issue detected.");
  }
  const nearMissFlag = decision !== "GO" && (v14.risk >= 60 || v14.noise >= 60 || v14.emotionalBiasPenalty >= 12);
  const guardianIntegrityScore = clamp(
    Math.round(70 + (nearMissFlag ? 12 : 0) + triggerCount * 4 - Math.max(0, irreversibleRiskPenalty - 25) * 0.5),
    40,
    98
  );
  if (nearMissFlag) {
    guardianNotes.push("Guardian: near-miss prevented (risk escalation intercepted).");
  }
  guardianNotes.push(
    `Guardian: safetyFactor=${guardianSafetyFactor.toFixed(2)} irreversibleRiskPenalty=${Math.round(irreversibleRiskPenalty)} GIS=${guardianIntegrityScore}`
  );

  return {
    ...v14,
    score,
    decision,
    guardianSafetyFactor,
    irreversibleRiskPenalty,
    guardianIntegrityScore,
    nearMissFlag,
    guardianNotes,
    reasons: [...v14.reasons, "v15: guardian safety gate completed."],
  };
}

/**
 * v16 — Legacy memory capsule (includes Z-ECR branch trace)
 */
function runV16(v15: ReturnType<typeof runV15>, input: GGAESPInput, branch: ZECRBranch) {
  const memoryCapsule = {
    capsuleType: "GGAESP_MEMORY",
    moduleId: input.moduleId,
    timestamp: input.timestamp ?? new Date().toISOString(),
    inputContext: input.data,
    metaScore: v15.score,
    decision: v15.decision,
    branch,
    guardianNotes: v15.guardianNotes,
    guardianIntegrityScore: v15.guardianIntegrityScore,
    nearMissFlag: v15.nearMissFlag,
    laterOutcome: null,
    confidenceDelta: null,
  };

  return {
    ...v15,
    memoryCapsule,
    reasons: [...v15.reasons, "v16: memory capsule prepared."],
  };
}

/**
 * v17 — Network/collective safety placeholder
 */
function runV17(v16: ReturnType<typeof runV16>) {
  return {
    ...v16,
    reasons: [...v16.reasons, "v17: network safety layer acknowledged."],
  };
}

/**
 * v18 — Ethics check
 */
function runV18(v17: ReturnType<typeof runV17>) {
  const ethicsNotes: string[] = [];

  if (v17.decision === "GO" && v17.risk > 70) {
    ethicsNotes.push("Ethics: GO downgraded because risk exceeds dignity/safety preference.");
    return {
      ...v17,
      decision: "HOLD" as Decision,
      score: Math.min(v17.score, 55),
      ethicsNotes,
      reasons: [...v17.reasons, "v18: ethics layer downgraded output."],
    };
  }

  ethicsNotes.push("Ethics: no violation detected.");

  return {
    ...v17,
    ethicsNotes,
    reasons: [...v17.reasons, "v18: ethics layer completed."],
  };
}

/**
 * v19 — Co-evolution output shaping (includes Z-ECR on output)
 */
function runV19(
  v18: ReturnType<typeof runV18>,
  input: GGAESPInput,
  energyMode: EnergyMode,
  branch: ZECRBranch
): GGAESPOutput {
  let polarity: Polarity = "neutral";

  if (v18.score >= 76) polarity = "positive";
  if (v18.score >= 91) polarity = "verified";
  if (v18.score < 40) polarity = "negative";

  return {
    moduleId: input.moduleId,
    timestamp: input.timestamp ?? new Date().toISOString(),
    metaScore: Math.round(v18.score),
    polarity,
    decision: v18.decision,
    confidence: clamp(Math.round(100 - v18.noise - v18.falseCorrelation * 0.3)),
    energyMode,
    branch,
    reasons: [...v18.reasons, "v19: final human-readable output shaped."],
    guardianNotes: v18.guardianNotes,
    ethicsNotes: v18.ethicsNotes,
    memoryCapsule: v18.memoryCapsule,
  };
}

/**
 * MAIN PIPELINE
 */
export function runGGAESP(input: GGAESPInput): GGAESPOutput {
  const safeInput: GGAESPInput = {
    ...input,
    timestamp: input.timestamp ?? new Date().toISOString(),
    data: input.data ?? {},
  };

  const energyMode = classifyEnergy(safeInput);
  const requireBuildGate = energyMode === "HIGH";

  const branch: ZECRBranch = {
    origin_id: "ggaesp_pipeline",
    parent_context: safeInput.moduleId,
    purpose: safeInput.moduleId,
    energy_mode: energyMode,
    guardian_status: "CLEAR",
    memory_return_path: "memory_vault/ggaesp_capsules",
    created_at: safeInput.timestamp as string,
  };

  const v11 = runV11(safeInput);
  const v12 = runV12(v11, safeInput);
  const v13 = runV13(v12, safeInput);
  const v14 = runV14(v13, safeInput);
  let v15 = runV15(v14, branch);

  if (requireBuildGate && v15.decision === "GO") {
    v15 = {
      ...v15,
      decision: "PREPARE",
      guardianNotes: [...v15.guardianNotes, "Z-ECR: HIGH energy requires Build Gate approval."],
    };
  }

  const v16 = runV16(v15, safeInput, branch);
  const v17 = runV17(v16);
  const v18 = runV18(v17);
  return runV19(v18, safeInput, energyMode, branch);
}
