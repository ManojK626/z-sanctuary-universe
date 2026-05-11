export function getSystemState() {

    return {

        formulaVault: window.ZVaultStatus || "UNKNOWN",
        chronicleServer: window.ZChronicleStatus || "OFFLINE",
        storageIntegrity: window.ZStorageIntegrity || "OK"

    };
}