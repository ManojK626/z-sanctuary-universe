/** Default path under hub root. */
export declare const REL_MEMORY_CAPSULES = "data/ggaesp/memory_capsules.jsonl";
export declare function getMemoryStorePath(hubRoot?: string): string;
export declare function ensureGgaespDataDir(hubRoot?: string): void;
export type AppendMemoryOptions = {
    hubRoot?: string;
    extra?: Record<string, unknown>;
};
/**
 * Appends one JSONL line: envelope + memoryCapsule from runGGAESP output.
 */
export declare function appendMemoryCapsule(memoryCapsule: Record<string, unknown>, options?: AppendMemoryOptions): {
    path: string;
    bytes: number;
    line: string;
};
/**
 * Payload shape: full or partial result from runGGAESP (Z-ECR bound) for disk.
 * Schema V2: top-level `energyMode` and `branch` for replay, audit, and grep without
 * only parsing the nested memoryCapsule. `store_file` is the actual append path.
 */
export type GgaespZecrStorePayload = {
    moduleId: string;
    timestamp: string;
    energyMode: string;
    branch: Record<string, unknown>;
    memoryCapsule: Record<string, unknown>;
};
export declare function appendGgaespZecrResult(payload: GgaespZecrStorePayload, options?: AppendMemoryOptions): {
    path: string;
    bytes: number;
    line: string;
};
