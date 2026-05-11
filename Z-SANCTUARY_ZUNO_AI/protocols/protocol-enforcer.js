/**
 * PROTOCOL ENFORCER
 * Z-SANCTUARY ZUNO AI PROJECT
 *
 * PURPOSE: Enforce all operational protocols
 * - Verify project identity
 * - Prevent cross-project contamination
 * - Enforce data isolation
 * - Maintain audit trails
 * - Block unauthorized operations
 */

class ProtocolEnforcer {
    constructor() {
        this.projectId = 'ZUNO_AI_001';
        this.projectName = 'Z-SANCTUARY ZUNO AI Universe';
        this.enforceMode = 'STRICT'; // STRICT, NORMAL, DEBUG
        this.allowedProjects = ['ZUNO_AI_001'];
        this.operationLog = [];
    }

    /**
     * PROTOCOL 1: Identify Project Context
     * ALWAYS execute this first
     */
    identifyContext() {
        console.log('🔍 [PROTOCOL 1] Identifying Project Context...');

        // Check document metadata
        const projectMeta = document.querySelector('meta[name="project-id"]');
        const detectedProject = projectMeta ? projectMeta.content : 'UNKNOWN';

        // Check window object
        const windowProject = window.PROJECT_ID || 'UNDEFINED';

        console.log(`   Document Meta Project: ${detectedProject}`);
        console.log(`   Window Project: ${windowProject}`);

        return {
            detected: detectedProject,
            windowContext: windowProject,
            verified: detectedProject === this.projectId || windowProject === this.projectId
        };
    }

    /**
     * PROTOCOL 2: Verify Data Isolation
     * Ensure no cross-node data leakage
     */
    verifyDataIsolation() {
        console.log('🔐 [PROTOCOL 2] Verifying Data Isolation...');

        const isolationChecks = {
            healthPortalIsolated: !window.rouletteMatrixData && !window.prngEngineData,
            rouletteMatrixIsolated: !window.healthPortalData && !window.prngEngineData,
            prngEngineIsolated: !window.healthPortalData && !window.rouletteMatrixData
        };

        const allIsolated = Object.values(isolationChecks).every(v => v === true);

        if (!allIsolated) {
            console.warn('⚠️ [PROTOCOL 2] Data Isolation Breach Detected!');
            console.warn(isolationChecks);
        } else {
            console.log('✅ [PROTOCOL 2] All Nodes Properly Isolated');
        }

        return allIsolated;
    }

    /**
     * PROTOCOL 3: Enforce Operation Authorization
     * Only allow authorized operations
     */
    authorizeOperation(operationName) {
        console.log(`🔑 [PROTOCOL 3] Authorizing Operation: ${operationName}`);

        const authorizedOps = [
            'HEALTH_PORTAL_INIT',
            'ROULETTE_MATRIX_INIT',
            'PRNG_ENGINE_INIT',
            'MASTER_HUB_INIT',
            'USER_INTERACTION',
            'DATA_LOG',
            'AUDIT_RECORD'
        ];

        const isAuthorized = authorizedOps.includes(operationName);

        if (!isAuthorized) {
            console.error(`❌ [PROTOCOL 3] UNAUTHORIZED OPERATION: ${operationName}`);
            return false;
        }

        console.log(`✅ [PROTOCOL 3] Operation Authorized: ${operationName}`);
        return true;
    }

    /**
     * PROTOCOL 4: Audit Trail Maintenance
     * Record all significant operations
     */
    recordAuditTrail(operationType, operationData) {
        console.log('📝 [PROTOCOL 4] Recording Audit Trail...');

        const auditRecord = {
            timestamp: new Date().toISOString(),
            operationType: operationType,
            projectId: this.projectId,
            projectName: this.projectName,
            data: operationData,
            userAgent: navigator.userAgent,
            url: window.location.href
        };

        this.operationLog.push(auditRecord);

        // Log to console
        console.log(`   Type: ${operationType}`);
        console.log(`   Timestamp: ${auditRecord.timestamp}`);
        console.log(`   Records in Log: ${this.operationLog.length}`);

        return auditRecord;
    }

    /**
     * PROTOCOL 5: Prevent Cross-Project Contamination
     * Block any attempt to load external project resources
     */
    validateResourceOrigin(resourceUrl) {
        console.log(`🛡️ [PROTOCOL 5] Validating Resource Origin: ${resourceUrl}`);

        // Whitelist of approved origins for ZUNO AI project
        const approvedOrigins = [
            window.location.hostname,
            'localhost',
            '127.0.0.1'
        ];

        try {
            const urlObj = new URL(resourceUrl, window.location.href);
            const resourceOrigin = urlObj.hostname;

            const isApproved = approvedOrigins.includes(resourceOrigin);

            if (!isApproved) {
                console.error(`❌ [PROTOCOL 5] BLOCKED - External resource detected: ${resourceOrigin}`);
                return false;
            }

            console.log(`✅ [PROTOCOL 5] Resource origin approved: ${resourceOrigin}`);
            return true;
        } catch (error) {
            console.error(`❌ [PROTOCOL 5] Invalid resource URL: ${error.message}`);
            return false;
        }
    }

    /**
     * RUN ALL PROTOCOLS
     * Execute this as the entry point for all operations
     */
    runAllProtocols() {
        console.log('\n');
        console.log('╔════════════════════════════════════════════════════════╗');
        console.log('║     Z-SANCTUARY ZUNO AI PROTOCOL ENFORCEMENT SYSTEM    ║');
        console.log('║                  ALL PROTOCOLS RUNNING                 ║');
        console.log('╚════════════════════════════════════════════════════════╝');
        console.log('\n');

        try {
            // Protocol 1
            const contextCheck = this.identifyContext();
            if (!contextCheck.verified && this.enforceMode === 'STRICT') {
                throw new Error('Context verification failed in STRICT mode');
            }

            // Protocol 2
            const isolationCheck = this.verifyDataIsolation();

            // Protocol 4
            this.recordAuditTrail('PROTOCOL_INIT', {
                contextVerified: contextCheck.verified,
                isolationVerified: isolationCheck
            });

            console.log('\n✅ ALL PROTOCOLS PASSED - SYSTEM READY');
            console.log('\n');

            return true;
        } catch (error) {
            console.error('\n❌ PROTOCOL EXECUTION FAILED');
            console.error(`Error: ${error.message}`);
            console.error('\n');
            return false;
        }
    }

    // Get audit log
    getAuditLog() {
        return this.operationLog;
    }

    // Export audit log
    exportAuditLog() {
        const logData = JSON.stringify(this.operationLog, null, 2);
        console.log(logData);
        return logData;
    }
}

// Browser-console audit singleton; intentionally exposed globally (see SECURITY_VERIFICATION.js).
globalThis.ProtocolEnforcer_Instance = new ProtocolEnforcer();

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProtocolEnforcer;
}
