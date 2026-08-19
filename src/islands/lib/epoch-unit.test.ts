import { describe, expect, it } from 'vitest';
import { MAX_INSTANT, detectUnit, toInstant } from './epoch-unit.ts';

describe('detectUnit', () => {
  it('reads a ten-digit value as seconds', () => {
    expect(detectUnit(1_767_225_600)).toBe('seconds');
  });

  it('reads a thirteen-digit value as milliseconds', () => {
    expect(detectUnit(1_767_225_600_000)).toBe('milliseconds');
  });

  it('treats zero and small values as seconds', () => {
    expect(detectUnit(0)).toBe('seconds');
    expect(detectUnit(1)).toBe('seconds');
  });

  it('handles negative timestamps before 1970 symmetrically', () => {
    expect(detectUnit(-1_000_000_000)).toBe('seconds');
    expect(detectUnit(-1_000_000_000_000)).toBe('milliseconds');
  });

  it('puts the boundary far beyond any plausible second count', () => {
    // 1e11 seconds is the year 5138 — no real second-based timestamp reaches it.
    expect(detectUnit(99_999_999_999)).toBe('seconds');
    expect(detectUnit(100_000_000_000)).toBe('milliseconds');
  });
});

describe('toInstant', () => {
  it('scales seconds up to milliseconds', () => {
    expect(toInstant(1_767_225_600)).toBe(1_767_225_600_000);
  });

  it('leaves milliseconds alone', () => {
    expect(toInstant(1_767_225_600_123)).toBe(1_767_225_600_123);
  });

  it('round-trips the 2038 boundary that breaks 32-bit systems', () => {
    const instant = toInstant(2_147_483_647);
    expect(instant).toBe(2_147_483_647_000);
    expect(new Date(instant!).toISOString()).toBe('2038-01-19T03:14:07.000Z');
  });

  it('rejects anything outside the range Date supports', () => {
    expect(toInstant(MAX_INSTANT * 2)).toBeNull();
    expect(toInstant(Number.POSITIVE_INFINITY)).toBeNull();
  });

  it('maps the epoch itself to zero', () => {
    expect(toInstant(0)).toBe(0);
  });
});
