import { describe, expect, it } from 'vitest';
import { cityDemand, unknownDemandSlugs } from './demand.ts';
import { rankedPairs, pairRank } from './pairs.ts';
import { LOCALISED_PAIR_LIMIT } from '~/config/flags.ts';

describe('the demand map', () => {
  it('names only real cities', () => {
    expect(unknownDemandSlugs()).toEqual([]);
  });

  it('stays inside the 1-10 scale', () => {
    for (const slug of ['london', 'new-york', 'chatham-islands', 'not-a-city']) {
      expect(cityDemand(slug)).toBeGreaterThanOrEqual(1);
      expect(cityDemand(slug)).toBeLessThanOrEqual(10);
    }
  });

  it('ranks the busiest conversion on the internet first', () => {
    // Weighting by population put this pair 117th, outside the localised subset.
    // That was the bug this map exists to fix.
    const rank = pairRank('new-york-to-london');
    expect(rank).toBeDefined();
    expect(rank!).toBeLessThan(4);
  });

  it('puts the pairs people actually search for inside the localised subset', () => {
    const localised = new Set(
      rankedPairs()
        .slice(0, LOCALISED_PAIR_LIMIT)
        .map((pair) => pair.slug),
    );
    for (const slug of [
      'new-york-to-london',
      'london-to-new-york',
      'london-to-tokyo',
      'new-york-to-los-angeles',
      'london-to-delhi',
      'new-york-to-tokyo',
      'london-to-sydney',
    ]) {
      expect(localised.has(slug), slug).toBe(true);
    }
  });

  it('leaves genuinely obscure pairs out of the localised subset', () => {
    const localised = new Set(
      rankedPairs()
        .slice(0, LOCALISED_PAIR_LIMIT)
        .map((pair) => pair.slug),
    );
    for (const slug of ['nuuk-to-london', 'chatham-islands-to-dubai']) {
      expect(localised.has(slug), slug).toBe(false);
    }
  });
});
