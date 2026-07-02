import { SENSITIVE_FIELD_PATTERNS } from '../constants/classifications';

function normalizeFieldName(name: string): string {
  return name.toLowerCase().replace(/[-\s]/g, '_');
}

function isSensitiveFieldName(field: string): boolean {
  const normalized = normalizeFieldName(field);
  return SENSITIVE_FIELD_PATTERNS.some((pattern) => normalized.includes(pattern));
}

/**
 * Heuristic sensitive-field detection by key name — does not inspect values.
 * Not a substitute for field-level encryption (out of scope).
 */
export function detectSensitiveFields(
  data: Record<string, unknown>,
  options?: { deep?: boolean },
): readonly string[] {
  const found: string[] = [];
  const deep = options?.deep ?? false;

  function walk(obj: Record<string, unknown>, prefix: string): void {
    for (const [key, value] of Object.entries(obj)) {
      const path = prefix ? `${prefix}.${key}` : key;
      if (isSensitiveFieldName(key)) {
        found.push(path);
      }
      if (deep && value !== null && typeof value === 'object' && !Array.isArray(value)) {
        walk(value as Record<string, unknown>, path);
      }
    }
  }

  walk(data, '');
  return found;
}

export function containsSensitiveFieldNames(
  data: Record<string, unknown>,
): boolean {
  return detectSensitiveFields(data).length > 0;
}
