import Ajv2020 from 'ajv/dist/2020';
import type { ErrorObject, ValidateFunction } from 'ajv';
import addFormats from 'ajv-formats';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { ObservabilityEvent } from '../types/observability-event';

const packageRoot = join(__dirname, '..', '..');
const schemaPath = join(packageRoot, 'schemas', 'v1', 'observability-event.schema.json');

let compiledValidator: ValidateFunction | undefined;

function getValidator(): ValidateFunction {
  if (compiledValidator) {
    return compiledValidator;
  }
  const ajv = new Ajv2020({ allErrors: true, strict: true, allowUnionTypes: true });
  addFormats(ajv);
  const schema = JSON.parse(readFileSync(schemaPath, 'utf8')) as object;
  compiledValidator = ajv.compile(schema);
  return compiledValidator;
}

export interface ValidationSuccess {
  readonly ok: true;
  readonly value: ObservabilityEvent;
}

export interface ValidationFailure {
  readonly ok: false;
  readonly errors: readonly ErrorObject[];
}

export type ValidationResult = ValidationSuccess | ValidationFailure;

export function validateObservabilityEvent(data: unknown): ValidationResult {
  const validate = getValidator();
  if (validate(data)) {
    return { ok: true, value: data as ObservabilityEvent };
  }
  return { ok: false, errors: validate.errors ?? [] };
}

export function assertObservabilityEvent(data: unknown): ObservabilityEvent {
  const result = validateObservabilityEvent(data);
  if (!result.ok) {
    const detail = result.errors.map((e) => e.message ?? 'invalid').join('; ');
    throw new Error(`Invalid ObservabilityEvent: ${detail}`);
  }
  return result.value;
}

export function getCanonicalSchemaPath(): string {
  return schemaPath;
}
