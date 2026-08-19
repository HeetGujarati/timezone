/**
 * Unix timestamp unit detection.
 *
 * Kept out of the custom-element module so it can be unit-tested in Node without a
 * DOM, and because getting this wrong is a factor-of-1000 error — a timestamp read
 * as seconds when it was milliseconds lands in 1970.
 */

/** 1e11 seconds is the year 5138. Nothing real reaches it, so above this is ms. */
export const MILLISECOND_THRESHOLD = 1e11;

/** The widest instant JavaScript's Date supports, in milliseconds. */
export const MAX_INSTANT = 8.64e15;

export function detectUnit(value: number): 'seconds' | 'milliseconds' {
  return Math.abs(value) >= MILLISECOND_THRESHOLD ? 'milliseconds' : 'seconds';
}

/** Normalise a raw timestamp to milliseconds, or null if it is out of range. */
export function toInstant(value: number): number | null {
  const instant = detectUnit(value) === 'milliseconds' ? value : value * 1000;
  if (!Number.isFinite(instant) || Math.abs(instant) > MAX_INSTANT) return null;
  return instant;
}
