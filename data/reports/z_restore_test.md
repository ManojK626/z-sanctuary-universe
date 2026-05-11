# Z-Vault Restore Test Report

Generated: ``Owner:`Z-Sanctuary`Scope:`Integrity validation for snapshot + restore path`

## Restore Source

- Source type: `snapshot / backup / offsite mirror`
- Source timestamp:
- Dataset:
- Signature check required: `yes/no`

## Restore Target

- Target location:
- Target mode: `read-only validation / full restore`
- Overwrite allowed: `yes/no`

## Procedure

1. Select restore point and verify metadata.
2. Verify signature/hash where applicable.
3. Restore selected dataset to target path.
4. Validate file count and checksums.
5. Confirm service compatibility (reports + audit readers).

## Validation Checks

- [ ] Restore completed without errors
- [ ] Restored files readable
- [ ] File count matches expected
- [ ] Checksum/signature verification passed
- [ ] Critical reports accessible after restore
- [ ] No unintended writes to production paths

## Results

- Expected file count:
- Restored file count:
- Checksum pass rate:
- Signature verification:
- Total restore time:

## Incidents

| Time | Severity | Step | Symptom | Action | Result |
| ---- | -------- | ---- | ------- | ------ | ------ |
| --- | --- | --- | --- | --- | --- |

## Verdict

- Restore status: `PASS / HOLD / FAIL`
- Public-launch impact: `none / block`
- Remediation required:

## Sign-off

- Reviewer:
- Date:
