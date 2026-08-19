/**
 * URL and storage parsing for the browser.
 *
 * zod does the validation at build time, but it is 12KB gzipped — a third of the
 * entire site's JavaScript budget — so the browser gets these hand-written guards
 * instead. Same discipline, no dependency: every value is length-capped, pattern-
 * checked and range-checked before it reaches anything.
 */

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

/** Longest input any parameter here may carry, before pattern checks even run. */
const MAX_PARAM_LENGTH = 64;

export function readParam(params: URLSearchParams, key: string): string | null {
  const value = params.get(key);
  if (value === null || value.length === 0 || value.length > MAX_PARAM_LENGTH) return null;
  return value;
}

/** "2026-03-08", and a real date — 2026-02-30 is rejected. */
export function parseDateParam(value: string | null): string | null {
  if (value === null || !DATE_PATTERN.test(value)) return null;
  const [year, month, day] = value.split('-').map(Number);
  if (year === undefined || month === undefined || day === undefined) return null;
  const probe = new Date(Date.UTC(year, month - 1, day));
  if (
    probe.getUTCFullYear() !== year ||
    probe.getUTCMonth() !== month - 1 ||
    probe.getUTCDate() !== day
  ) {
    return null;
  }
  return value;
}

/** "09:30" on a 24-hour clock. */
export function parseTimeParam(value: string | null): string | null {
  return value !== null && TIME_PATTERN.test(value) ? value : null;
}

/** An integer inside an inclusive range, or null. Rejects NaN, Infinity and floats. */
export function parseIntParam(value: string | null, min: number, max: number): number | null {
  if (value === null || !/^-?\d{1,15}$/.test(value)) return null;
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed < min || parsed > max) return null;
  return parsed;
}

/** Read a JSON value from localStorage, treating whatever comes back as hostile. */
export function readStoredJson<T>(key: string, validate: (value: unknown) => T | null): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null || raw.length > 20_000) return null;
    return validate(JSON.parse(raw) as unknown);
  } catch {
    return null;
  }
}

export function writeStoredJson(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* Storage denied or full. The feature degrades to this page view only. */
  }
}

/** Replace the query string without adding a history entry for every keystroke. */
export function syncUrl(params: Record<string, string>): void {
  const url = new URL(window.location.href);
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);
  window.history.replaceState(null, '', url);
}
