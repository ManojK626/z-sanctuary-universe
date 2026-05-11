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
/**
 * MAIN PIPELINE
 */
export declare function runGGAESP(input: GGAESPInput): GGAESPOutput;
