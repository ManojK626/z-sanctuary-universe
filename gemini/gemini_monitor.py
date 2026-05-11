#!/usr/bin/env python3
"""
Gemini Project Health Monitor
Automated system checks and status reporting for Gemini PRNG Simulator
Similar to Zuno AI monitoring infrastructure
"""

import os
import json
import time
from datetime import datetime

class GeminiHealthMonitor:
    def __init__(self):
        self.project_root = os.path.dirname(os.path.abspath(__file__))
        self.status_file = os.path.join(self.project_root, 'gemini_health.json')
        self.log_file = os.path.join(self.project_root, 'gemini_health.log')

    def check_files(self):
        """Verify all critical project files exist"""
        files_to_check = {
            'slot_engine.html': 'PRNG Simulator UI',
            'gemini_monitor.py': 'Health monitoring script',
        }

        results = {}
        for filename, description in files_to_check.items():
            filepath = os.path.join(self.project_root, filename)
            exists = os.path.exists(filepath)
            results[filename] = {
                'exists': exists,
                'description': description,
                'status': '✅ OK' if exists else '❌ MISSING'
            }
        return results

    def check_prng_logic(self):
        """Verify PRNG simulator file integrity"""
        prng_file = os.path.join(self.project_root, 'slot_engine.html')

        checks = {
            'file_exists': os.path.exists(prng_file),
            'has_prng_logic': False,
            'has_rtp_target': False,
            'has_volatility_selector': False,
            'file_size_kb': 0
        }

        if checks['file_exists']:
            with open(prng_file, 'r') as f:
                content = f.read()
                checks['file_size_kb'] = len(content) / 1024
                checks['has_prng_logic'] = 'processMath' in content
                checks['has_rtp_target'] = '0.965' in content or '96.5%' in content
                checks['has_volatility_selector'] = 'setVol' in content

        return checks

    def generate_report(self):
        """Generate comprehensive health report"""
        timestamp = datetime.now().isoformat()

        file_check = self.check_files()
        prng_check = self.check_prng_logic()

        # Determine overall status
        all_files_ok = all(f['exists'] for f in file_check.values())
        prng_ok = all(prng_check.values())
        overall_status = 'HEALTHY' if (all_files_ok and prng_ok) else 'DEGRADED'

        report = {
            'timestamp': timestamp,
            'overall_status': overall_status,
            'file_integrity': file_check,
            'prng_integrity': prng_check,
            'suggestions': self.generate_suggestions(all_files_ok, prng_ok)
        }

        return report

    def generate_suggestions(self, files_ok, prng_ok):
        """AI suggestions for system improvement"""
        suggestions = []

        if not files_ok:
            suggestions.append("⚠️ Missing project files detected. Rebuild recommended.")

        if not prng_ok:
            suggestions.append("⚠️ PRNG logic validation failed. Check slot_engine.html integrity.")

        if files_ok and prng_ok:
            suggestions.append("✅ All systems nominal. Ready for simulation.")
            suggestions.append("💡 Tip: Use volatility selector to test different RTP distributions.")
            suggestions.append("💡 Tip: Run 1000-spin simulations to observe mathematical convergence.")

        return suggestions

    def save_report(self, report):
        """Save health report to JSON"""
        with open(self.status_file, 'w') as f:
            json.dump(report, f, indent=2)

    def log_report(self, report):
        """Append report to log file"""
        with open(self.log_file, 'a', encoding='utf-8') as f:
            f.write(f"\n{'='*80}\n")
            f.write(f"Health Check: {report['timestamp']}\n")
            f.write(f"Status: {report['overall_status']}\n")
            f.write(f"Files OK: {all(f['exists'] for f in report['file_integrity'].values())}\n")
            f.write(f"PRNG OK: {all(report['prng_integrity'].values())}\n")
            f.write(f"\nSuggestions:\n")
            for suggestion in report['suggestions']:
                f.write(f"  {suggestion}\n")

def main():
    monitor = GeminiHealthMonitor()
    report = monitor.generate_report()

    # Display report
    print("\n" + "="*80)
    print("GEMINI PROJECT HEALTH MONITOR")
    print("="*80)
    print(f"\nTimestamp: {report['timestamp']}")
    print(f"Overall Status: {report['overall_status']}")

    print("\n📁 File Integrity:")
    for filename, check in report['file_integrity'].items():
        print(f"  {check['status']} {filename}")

    print("\n⚙️ PRNG Logic:")
    for check, result in report['prng_integrity'].items():
        status = '✅' if result else '❌'
        print(f"  {status} {check}: {result}")

    print("\n💡 Suggestions:")
    for suggestion in report['suggestions']:
        print(f"  {suggestion}")

    print("\n" + "="*80)

    # Save reports
    monitor.save_report(report)
    monitor.log_report(report)

    print(f"\n✅ Reports saved to:")
    print(f"  {monitor.status_file}")
    print(f"  {monitor.log_file}")

if __name__ == '__main__':
    main()
