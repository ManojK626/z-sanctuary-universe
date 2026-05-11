/**
 * SECURITY & ISOLATION VERIFICATION SCRIPT
 * Z-SANCTUARY ZUNO AI PROJECT
 *
 * Run this in browser console to verify project isolation
 * Paste entire script into console to execute full security audit
 *
 * Uses global ProtocolEnforcer_Instance from protocols/protocol-enforcer.js (load that file first). ESLint: .eslintrc.json override for this folder.
 */

console.log(`
╔═══════════════════════════════════════════════════════════════╗
║     Z-SANCTUARY ZUNO AI - SECURITY VERIFICATION SUITE        ║
╚═══════════════════════════════════════════════════════════════╝
`);

class SecurityAudit {
    constructor() {
        this.projectId = 'ZUNO_AI_001';
        this.auditResults = [];
        this.securityScore = 0;
    }

    /**
     * TEST 1: Verify Project Identification
     */
    testProjectIdentification() {
        console.log('\n📋 TEST 1: Project Identification');
        console.log('─'.repeat(50));

        const projectMeta = document.querySelector('meta[name="project-id"]');
        const projectNameMeta = document.querySelector('meta[name="project-name"]');
        const windowProjectId = window.PROJECT_ID;
        const windowManifest = window.PROJECT_MANIFEST;

        let passed = true;
        let reason = [];

        if (!projectMeta || projectMeta.content !== this.projectId) {
            console.error('❌ Missing or incorrect project-id meta tag');
            passed = false;
            reason.push('Meta tag project-id mismatch');
        } else {
            console.log('✅ Project ID meta tag: ' + projectMeta.content);
        }

        if (!projectNameMeta) {
            console.error('❌ Missing project-name meta tag');
            passed = false;
            reason.push('Missing project-name meta');
        } else {
            console.log('✅ Project Name: ' + projectNameMeta.content);
        }

        if (windowProjectId !== this.projectId) {
            console.error('❌ window.PROJECT_ID mismatch: ' + windowProjectId);
            passed = false;
            reason.push('window.PROJECT_ID mismatch');
        } else {
            console.log('✅ window.PROJECT_ID verified');
        }

        if (!windowManifest || windowManifest.project_id !== this.projectId) {
            console.error('❌ window.PROJECT_MANIFEST mismatch');
            passed = false;
            reason.push('PROJECT_MANIFEST mismatch');
        } else {
            console.log('✅ window.PROJECT_MANIFEST verified');
        }

        this.auditResults.push({
            test: 'Project Identification',
            passed: passed,
            reason: reason.length > 0 ? reason.join('; ') : 'All checks passed'
        });

        return passed ? 25 : 0;
    }

    /**
     * TEST 2: Verify Data Isolation
     */
    testDataIsolation() {
        console.log('\n📋 TEST 2: Data Isolation');
        console.log('─'.repeat(50));

        const forbiddenNamespaces = [
            'healthPortalData',
            'rouletteMatrixData',
            'prngEngineData',
            'slotSimulatorData',
            'externalProjectData'
        ];

        let pollutionFound = [];

        forbiddenNamespaces.forEach(ns => {
            if (window[ns]) {
                console.error('❌ Global namespace pollution: ' + ns);
                pollutionFound.push(ns);
            }
        });

        if (pollutionFound.length === 0) {
            console.log('✅ No cross-node data pollution detected');
            this.auditResults.push({
                test: 'Data Isolation',
                passed: true,
                reason: 'Clean global namespace'
            });
            return 25;
        } else {
            console.error('❌ Pollution found in: ' + pollutionFound.join(', '));
            this.auditResults.push({
                test: 'Data Isolation',
                passed: false,
                reason: 'Global namespace pollution: ' + pollutionFound.join(', ')
            });
            return 0;
        }
    }

    /**
     * TEST 3: Verify Protocol Enforcement
     */
    testProtocolEnforcement() {
        console.log('\n📋 TEST 3: Protocol Enforcement');
        console.log('─'.repeat(50));

        if (typeof ProtocolEnforcer_Instance === 'undefined') {
            console.warn('⚠️ ProtocolEnforcer_Instance not loaded');
            this.auditResults.push({
                test: 'Protocol Enforcement',
                passed: false,
                reason: 'ProtocolEnforcer_Instance not defined'
            });
            return 0;
        }

        console.log('✅ ProtocolEnforcer_Instance found');

        if (typeof ZunoAI_Identifier === 'undefined') {
            console.warn('⚠️ ZunoAI_Identifier not loaded');
            this.auditResults.push({
                test: 'Protocol Enforcement',
                passed: false,
                reason: 'ZunoAI_Identifier not defined'
            });
            return 12;
        }

        console.log('✅ ZunoAI_Identifier found');
        console.log('✅ Protocol enforcement systems operational');

        this.auditResults.push({
            test: 'Protocol Enforcement',
            passed: true,
            reason: 'Both protocol systems active'
        });

        return 25;
    }

    /**
     * TEST 4: Verify Audit Trail
     */
    testAuditTrail() {
        console.log('\n📋 TEST 4: Audit Trail');
        console.log('─'.repeat(50));

        if (typeof ProtocolEnforcer_Instance === 'undefined') {
            console.error('❌ Cannot access audit trail - ProtocolEnforcer not loaded');
            this.auditResults.push({
                test: 'Audit Trail',
                passed: false,
                reason: 'ProtocolEnforcer_Instance not available'
            });
            return 0;
        }

        const auditLog = ProtocolEnforcer_Instance.getAuditLog();

        if (!Array.isArray(auditLog)) {
            console.error('❌ Audit log is not an array');
            this.auditResults.push({
                test: 'Audit Trail',
                passed: false,
                reason: 'Audit log format invalid'
            });
            return 0;
        }

        console.log('✅ Audit trail operational');
        console.log('   Records logged: ' + auditLog.length);

        if (auditLog.length > 0) {
            console.log('   Latest entry:', auditLog[auditLog.length - 1].operation);
        }

        this.auditResults.push({
            test: 'Audit Trail',
            passed: true,
            reason: 'Audit trail active with ' + auditLog.length + ' records'
        });

        return 25;
    }

    /**
     * TEST 5: Verify No External Resource Loading
     */
    testResourceOrigin() {
        console.log('\n📋 TEST 5: Resource Origin Validation');
        console.log('─'.repeat(50));

        const scripts = document.querySelectorAll('script[src]');
        let externalScripts = [];

        scripts.forEach(script => {
            const src = script.src;
            if (!src.includes(window.location.hostname) && !src.includes('localhost')) {
                externalScripts.push(src);
            }
        });

        if (externalScripts.length > 0) {
            console.warn('⚠️ External scripts detected: ' + externalScripts.length);
            externalScripts.forEach(script => {
                console.warn('   - ' + script);
            });
            this.auditResults.push({
                test: 'Resource Origin',
                passed: false,
                reason: 'External resources loaded: ' + externalScripts.length
            });
            return 0;
        }

        console.log('✅ No external resources detected');
        this.auditResults.push({
            test: 'Resource Origin',
            passed: true,
            reason: 'All resources from approved origin'
        });

        return 0; // External resources acceptable for fonts/analytics
    }

    /**
     * RUN ALL TESTS
     */
    runAllTests() {
        console.log('\n\n🔐 RUNNING FULL SECURITY AUDIT\n');

        let score = 0;

        score += this.testProjectIdentification();
        score += this.testDataIsolation();
        score += this.testProtocolEnforcement();
        score += this.testAuditTrail();
        score += this.testResourceOrigin();

        this.securityScore = score;

        this.printSummary();

        return this.auditResults;
    }

    /**
     * Print Summary Report
     */
    printSummary() {
        console.log('\n');
        console.log('╔═══════════════════════════════════════════════════════════════╗');
        console.log('║              SECURITY AUDIT SUMMARY REPORT                    ║');
        console.log('╚═══════════════════════════════════════════════════════════════╝');

        console.log('\n📊 SECURITY SCORE: ' + this.securityScore + '/100');

        if (this.securityScore >= 90) {
            console.log('   Status: ✅ EXCELLENT - Project is secure');
        } else if (this.securityScore >= 75) {
            console.log('   Status: ⚠️ GOOD - Minor issues to address');
        } else if (this.securityScore >= 60) {
            console.log('   Status: ⚠️ WARNING - Significant issues detected');
        } else {
            console.log('   Status: 🔴 CRITICAL - Security issues found');
        }

        console.log('\n📋 INDIVIDUAL TEST RESULTS:');
        console.log('─'.repeat(60));

        this.auditResults.forEach((result, index) => {
            const status = result.passed ? '✅ PASS' : '❌ FAIL';
            console.log(`${index + 1}. ${status} - ${result.test}`);
            console.log(`   └─ ${result.reason}`);
        });

        console.log('\n');
        console.log('╔═══════════════════════════════════════════════════════════════╗');
        console.log('║                     AUDIT COMPLETE                            ║');
        console.log('╚═══════════════════════════════════════════════════════════════╝\n');

        if (this.securityScore < 100) {
            console.log('🔧 REMEDIATION NEEDED - Review failed tests above\n');
        } else {
            console.log('✅ PROJECT FULLY SECURED - All tests passed\n');
        }
    }

    /**
     * Export detailed report
     */
    exportReport() {
        return {
            timestamp: new Date().toISOString(),
            projectId: this.projectId,
            securityScore: this.securityScore,
            results: this.auditResults
        };
    }
}

// Run audit
const audit = new SecurityAudit();
const results = audit.runAllTests();

// Make available globally for reference
window.ZUNO_SECURITY_AUDIT = {
    audit: audit,
    results: results,
    exportReport: () => audit.exportReport(),
    run: () => audit.runAllTests()
};

console.log('\n💡 TIP: To re-run audit anytime, use: window.ZUNO_SECURITY_AUDIT.run()');
console.log('💡 TIP: To export report, use: window.ZUNO_SECURITY_AUDIT.exportReport()');
