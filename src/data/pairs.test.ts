import { describe, expect, it } from 'vitest';
import {
  PAIRS,
  pairBySlug,
  pairsFromCity,
  rankedPairs,
  relatedPairs,
  reversePair,
} from './pairs.ts';
import { TIER_A, TIER_B, TOP_HUBS, cityBySlug } from './cities.ts';

describe('the pair set', () => {
  it('is exactly the size the page plan calls for', () => {
    // 24 x 23 Tier A pairs, plus 56 Tier B cities x 8 hubs x 2 directions.
    const tierAPairs = TIER_A.length * (TIER_A.length - 1);
    const tierBPairs = TIER_B.length * TOP_HUBS.length * 2;
    expect(tierAPairs).toBe(552);
    expect(tierBPairs).toBe(896);
    expect(PAIRS).toHaveLength(tierAPairs + tierBPairs);
    expect(PAIRS).toHaveLength(1448);
  });

  it('has unique slugs', () => {
    const slugs = PAIRS.map((pair) => pair.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('never pairs a city with itself', () => {
    for (const pair of PAIRS) expect(pair.from.slug).not.toBe(pair.to.slug);
  });

  it('builds slugs from the two city slugs', () => {
    expect(pairBySlug('new-york-to-london')).toBeDefined();
    expect(pairBySlug('london-to-new-york')).toBeDefined();
    expect(pairBySlug('london-to-atlantis')).toBeUndefined();
  });

  it('generates both directions of every Tier A pair', () => {
    for (const pair of PAIRS.filter((p) => p.from.tier === 'A' && p.to.tier === 'A')) {
      expect(reversePair(pair), pair.slug).toBeDefined();
    }
  });

  it('pairs every Tier B city with all eight hubs, both ways', () => {
    for (const city of TIER_B) {
      for (const hub of TOP_HUBS) {
        expect(
          pairBySlug(`${city.slug}-to-${hub.slug}`),
          `${city.slug}->${hub.slug}`,
        ).toBeDefined();
        expect(
          pairBySlug(`${hub.slug}-to-${city.slug}`),
          `${hub.slug}->${city.slug}`,
        ).toBeDefined();
      }
    }
  });

  it('does not generate the full 80x79 product', () => {
    // 6,320 pages, of which the extra 4,872 would be pages nobody searches for.
    expect(PAIRS.length).toBeLessThan(2000);
  });

  it('ranks the busiest pairs first', () => {
    const top = rankedPairs()
      .slice(0, 40)
      .map((pair) => pair.slug);
    expect(top.some((slug) => slug.includes('new-york') || slug.includes('london'))).toBe(true);
    const weights = rankedPairs().map((pair) => pair.weight);
    expect(weights).toEqual([...weights].sort((a, b) => b - a));
  });
});

describe('relatedPairs', () => {
  it('returns pairs sharing a city, excluding itself and its reverse', () => {
    const pair = pairBySlug('new-york-to-london')!;
    const related = relatedPairs(pair, 6);
    expect(related).toHaveLength(6);
    for (const candidate of related) {
      expect(candidate.slug).not.toBe('new-york-to-london');
      expect(candidate.slug).not.toBe('london-to-new-york');
      const shares =
        candidate.from.slug === 'new-york' ||
        candidate.to.slug === 'new-york' ||
        candidate.from.slug === 'london' ||
        candidate.to.slug === 'london';
      expect(shares, candidate.slug).toBe(true);
    }
  });

  it('is deterministic', () => {
    const pair = pairBySlug('tokyo-to-berlin')!;
    expect(relatedPairs(pair, 4).map((p) => p.slug)).toEqual(
      relatedPairs(pair, 4).map((p) => p.slug),
    );
  });
});

describe('pairsFromCity', () => {
  it('returns outbound pairs for a Tier A city', () => {
    const pairs = pairsFromCity(cityBySlug('tokyo')!, 12);
    expect(pairs).toHaveLength(12);
    for (const pair of pairs) expect(pair.from.slug).toBe('tokyo');
  });

  it('returns exactly the eight hub links for a Tier B city', () => {
    const pairs = pairsFromCity(cityBySlug('kathmandu')!, 12);
    expect(pairs).toHaveLength(8);
    for (const pair of pairs) expect(pair.to.tier).toBe('A');
  });
});
