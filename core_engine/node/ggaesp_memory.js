// core_engine/ggaesp_memory.ts
// Node-only: append-only JSONL for GGAESP memory capsules (Phase 2).
import { appendFileSync, existsSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
/** Default path under hub root. */
export const REL_MEMORY_CAPSULES = "data/ggaesp/memory_capsules.jsonl";
export function getMemoryStorePath(hubRoot = process.cwd()) {
    return resolve(hubRoot, REL_MEMORY_CAPSULES);
}
export function ensureGgaespDataDir(hubRoot = process.cwd()) {
    const dir = resolve(hubRoot, "data/ggaesp");
    if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
    }
}
/**
 * Appends one JSONL line: envelope + memoryCapsule from runGGAESP output.
 */
export function appendMemoryCapsule(memoryCapsule, options) {
    const hubRoot = options?.hubRoot ?? process.cwd();
    ensureGgaespDataDir(hubRoot);
    const path = getMemoryStorePath(hubRoot);
    const envelope = {
        written_at: new Date().toISOString(),
        schema: "GGAESP_MEMORY_V1",
        source: "core_engine/ggaesp_memory.ts",
        memoryCapsule,
        ...options?.extra,
    };
    const line = JSON.stringify(envelope) + "\n";
    appendFileSync(path, line, "utf8");
    return { path, bytes: Buffer.byteLength(line, "utf8"), line };
}
export function appendGgaespZecrResult(payload, options) {
    const hubRoot = options?.hubRoot ?? process.cwd();
    ensureGgaespDataDir(hubRoot);
    const path = getMemoryStorePath(hubRoot);
    const relStore = REL_MEMORY_CAPSULES.replace(/\\/g, "/");
    const envelope = {
        written_at: new Date().toISOString(),
        schema: "GGAESP_MEMORY_V2",
        source: "core_engine/ggaesp_memory.ts#appendGgaespZecrResult",
        store_file: relStore,
        moduleId: payload.moduleId,
        timestamp: payload.timestamp,
        energyMode: payload.energyMode,
        branch: payload.branch,
        zecr_memory_return_hint: payload.branch?.memory_return_path ?? null,
        memoryCapsule: payload.memoryCapsule,
        ...options?.extra,
    };
    const line = JSON.stringify(envelope) + "\n";
    appendFileSync(path, line, "utf8");
    return { path, bytes: Buffer.byteLength(line, "utf8"), line };
}
