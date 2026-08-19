import { CITIES, TIER_A, TIER_B, TOP_HUBS, type City } from './cities.ts';

/**
 * The city-pair page set.
 *
 * Two clusters, sized exactly as planned rather than as large as possible:
 * - every ordered pair of the 24 highest-intent cities: 24 x 23 = 552
 * - each of the 56 second-tier cities against the 8 busiest hubs, both ways:
 *   56 x 8 x 2 = 896
 *
 * 1,448 pages. Generating the full 80 x 79 cartesian product would give 6,320,
 * and the extra 4,872 would be pages nobody searches for competing with the ones
 * people do. More thin pages hurt; the brief is right about that.
 */

export type CityPair = {
  from: City;
  to: City;
  /** URL slug fragment: "new-york-to-london". */
  slug: string;
  /** Rough search value, used only to rank which pairs non-English locales get. */
  weight: number;
};

function pairSlug(from: City, to: City): string {
  return `${from.slug}-to-${to.slug}`;
}

/**
 * A cheap proxy for search demand: both cities' populations, with a strong bonus
 * for Tier A on both ends. Used only to decide ordering and which 100 pairs each
 * non-English locale ships — never presented to a reader as a fact.
 */
function weightFor(from: City, to: City): number {
  const base = Math.log10(from.population + 1) * Math.log10(to.population + 1);
  const tierBonus = (from.tier === 'A' ? 1.4 : 1) * (to.tier === 'A' ? 1.4 : 1);
  return Number((base * tierBonus).toFixed(4));
}

function buildPairs(): CityPair[] {
  const pairs: CityPair[] = [];
  const seen = new Set<string>();

  const add = (from: City, to: City): void => {
    if (from.slug === to.slug) return;
    const slug = pairSlug(from, to);
    if (seen.has(slug)) return;
    seen.add(slug);
    pairs.push({ from, to, slug, weight: weightFor(from, to) });
  };

  // Cluster A: the full directional cartesian product of Tier A.
  for (const from of TIER_A) {
    for (const to of TIER_A) add(from, to);
  }

  // Cluster B: every Tier B city against the eight busiest hubs, both directions.
  for (const city of TIER_B) {
    for (const hub of TOP_HUBS) {
      add(city, hub);
      add(hub, city);
    }
  }

  return pairs;
}

export const PAIRS: readonly CityPair[] = buildPairs();

const BY_SLUG = new Map(PAIRS.map((pair) => [pair.slug, pair]));

export function pairBySlug(slug: string): CityPair | undefined {
  return BY_SLUG.get(slug);
}

/** The reverse of a pair, if that page exists. Always cross-linked when it does. */
export function reversePair(pair: CityPair): CityPair | undefined {
  return BY_SLUG.get(pairSlug(pair.to, pair.from));
}

/** Ranked by search value, for the pages non-English locales ship at launch. */
export function rankedPairs(): CityPair[] {
  return [...PAIRS].sort((a, b) =>
    b.weight === a.weight ? a.slug.localeCompare(b.slug) : b.weight - a.weight,
  );
}

/** Other pairs sharing either city, for the internal-link block. */
export function relatedPairs(pair: CityPair, limit: number): CityPair[] {
  const reverseSlug = pairSlug(pair.to, pair.from);
  return PAIRS.filter(
    (candidate) =>
      candidate.slug !== pair.slug &&
      candidate.slug !== reverseSlug &&
      (candidate.from.slug === pair.from.slug ||
        candidate.to.slug === pair.to.slug ||
        candidate.from.slug === pair.to.slug ||
        candidate.to.slug === pair.from.slug),
  )
    .sort((a, b) => b.weight - a.weight)
    .slice(0, limit);
}

/** The pairs a city page links out to, ranked. */
export function pairsFromCity(city: City, limit: number): CityPair[] {
  return PAIRS.filter((pair) => pair.from.slug === city.slug)
    .sort((a, b) => b.weight - a.weight)
    .slice(0, limit);
}

export function totalPairCount(): number {
  return PAIRS.length;
}

export { CITIES };
