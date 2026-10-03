export type ValidationResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: string };

export function validateString(
  value: unknown,
  field: string,
  opts: { min?: number; max?: number; required?: boolean } = {}
): ValidationResult<string | null> {
  const { min = 0, max = Infinity, required = false } = opts;

  if (value === null || value === undefined) {
    if (required) return { ok: false, error: `${field} is required.` };
    return { ok: true, value: null };
  }

  if (typeof value !== 'string') {
    return { ok: false, error: `${field} must be text.` };
  }

  const trimmed = value.trim();

  if (required && trimmed.length === 0) {
    return { ok: false, error: `${field} is required.` };
  }

  if (trimmed.length > 0 && trimmed.length < min) {
    return { ok: false, error: `${field} must be at least ${min} characters.` };
  }

  if (trimmed.length > max) {
    return { ok: false, error: `${field} must be ${max} characters or fewer.` };
  }

  return { ok: true, value: trimmed.length > 0 ? trimmed : null };
}

export function validateInt(
  value: unknown,
  field: string,
  opts: { min?: number; max?: number } = {}
): ValidationResult<number> {
  const { min = 0, max = Infinity } = opts;

  const num = typeof value === 'string' ? Number(value) : value;

  if (typeof num !== 'number' || !Number.isFinite(num)) {
    return { ok: false, error: `${field} must be a number.` };
  }

  if (!Number.isInteger(num)) {
    return { ok: false, error: `${field} must be a whole number.` };
  }

  if (num < min) {
    return { ok: false, error: `${field} must be at least ${min}.` };
  }

  if (num > max) {
    return { ok: false, error: `${field} must be ${max} or less.` };
  }

  return { ok: true, value: num };
}

export function validateEnum<T extends string>(
  value: unknown,
  field: string,
  allowed: readonly T[]
): ValidationResult<T> {
  if (typeof value !== 'string') {
    return { ok: false, error: `${field} is required.` };
  }

  if (!allowed.includes(value as T)) {
    return { ok: false, error: `${field} must be one of: ${allowed.join(', ')}.` };
  }

  return { ok: true, value: value as T };
}

export function minutesSince(date: Date): number {
  return Math.floor((Date.now() - date.getTime()) / 60000);
}

export function formatCooldown(minutes: number): string {
  if (minutes < 1) return 'less than a minute';
  if (minutes === 1) return '1 minute';
  return `${minutes} minutes`;
}