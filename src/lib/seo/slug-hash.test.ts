import { describe, expect, it } from 'vitest';
import { hashString, pickDistinct, pickVariant } from './slug-hash.ts';

const VARIANTS = ['one', 'two', 'three', 'four'] as const;

describe('hashString', () => {
  it('is stable across calls', () => {
    expect(hashString('new-york-to-london')).toBe(hashString('new-york-to-london'));
  });

  it('separates similar inputs', () => {
    expect(hashString('new-york-to-london')).not.toBe(hashString('london-to-new-york'));
  });

  it('always returns an unsigned 32-bit integer', () => {
    for (const input of ['', 'a', 'zurich-to-sao-paulo', '🕰️']) {
      const hash = hashString(input);
      expect(Number.isInteger(hash)).toBe(true);
      expect(hash).toBeGreaterThanOrEqual(0);
      expect(hash).toBeLessThanOrEqual(0xffffffff);
    }
  });
});

describe('pickVariant', () => {
  it('is deterministic — the same page reads the same way every build', () => {
    expect(pickVariant(VARIANTS, 'tokyo-to-berlin', 'summary')).toBe(
      pickVariant(VARIANTS, 'tokyo-to-berlin', 'summary'),
    );
  });

  it('varies by slug', () => {
    const picks = new Set(
      ['a-to-b', 'c-to-d', 'e-to-f', 'g-to-h', 'i-to-j', 'k-to-l'].map((slug) =>
        pickVariant(VARIANTS, slug, 'summary'),
      ),
    );
    expect(picks.size).toBeGreaterThan(1);
  });

  it('varies by slot, so one page does not read like a form letter', () => {
    const slug = 'new-york-to-london';
    const picks = new Set(
      ['summary', 'callWindow', 'dstNote', 'facts'].map((slot) =>
        pickVariant(VARIANTS, slug, slot),
      ),
    );
    expect(picks.size).toBeGreaterThan(1);
  });

  it('spreads reasonably evenly across a realistic slug set', () => {
    const counts = new Map<string, number>();
    for (let index = 0; index < 400; index += 1) {
      const chosen = pickVariant(VARIANTS, `city-${index}-to-other-${index}`, 'summary');
      counts.set(chosen, (counts.get(chosen) ?? 0) + 1);
    }
    expect(counts.size).toBe(VARIANTS.length);
    for (const count of counts.values()) {
      // Perfectly even would be 100; anything inside 60-140 is fine for prose.
      expect(count).toBeGreaterThan(60);
      expect(count).toBeLessThan(140);
    }
  });

  it('refuses an empty variant list rather than returning undefined', () => {
    expect(() => pickVariant([], 'slug', 'slot')).toThrow(/No variants/);
  });
});

describe('pickDistinct', () => {
  it('returns the requested number without repeats', () => {
    const picked = pickDistinct(['a', 'b', 'c', 'd', 'e', 'f'], 'slug', 'related', 3);
    expect(picked).toHaveLength(3);
    expect(new Set(picked).size).toBe(3);
  });

  it('never returns more than it was given', () => {
    expect(pickDistinct(['a', 'b'], 'slug', 'related', 5)).toHaveLength(2);
  });

  it('is deterministic', () => {
    const first = pickDistinct(['a', 'b', 'c', 'd'], 'slug', 'related', 2);
    const second = pickDistinct(['a', 'b', 'c', 'd'], 'slug', 'related', 2);
    expect(first).toEqual(second);
  });

  it('handles an empty pool', () => {
    expect(pickDistinct([], 'slug', 'related', 3)).toEqual([]);
  });
});
