import { CITIES } from './cities.ts';

/**
 * Editorial estimate of English-language time zone search demand, 1–10.
 *
 * Population is the wrong proxy and the ranking proved it: weighting by
 * population put Shanghai–Delhi at the top and pushed New York–London — by a wide
 * margin the most-searched conversion on the internet — to 117th, outside the
 * hundred pairs each non-English locale ships. Shanghai has three times New York's
 * population and a fraction of its English-language conversion intent.
 *
 * These are judgements, not measurements, and they are only used for ordering:
 * which pairs appear first on the hub, and which hundred each locale gets at
 * launch. No number here is ever presented to a reader as a fact. SEO.md documents
 * how to revise them once Search Console has real data.
 */
const DEMAND: Record<string, number> = {
  // The two ends of the most-travelled business axis on earth.
  london: 10,
  'new-york': 10,

  // Major hubs with heavy remote-work and outsourcing traffic.
  'los-angeles': 9,
  tokyo: 9,
  singapore: 9,
  sydney: 9,
  dubai: 9,
  delhi: 9,
  'san-francisco': 9,

  chicago: 8,
  toronto: 8,
  paris: 8,
  berlin: 8,
  'hong-kong': 8,
  mumbai: 8,
  bengaluru: 8,
  amsterdam: 8,

  dublin: 7,
  madrid: 7,
  seoul: 7,
  shanghai: 7,
  'sao-paulo': 7,
  denver: 7,
  moscow: 7,
  lisbon: 7,
  vancouver: 7,
  'mexico-city': 7,
  istanbul: 7,
  melbourne: 7,
  auckland: 7,

  rome: 6,
  zurich: 6,
  stockholm: 6,
  copenhagen: 6,
  oslo: 6,
  brussels: 6,
  vienna: 6,
  warsaw: 6,
  prague: 6,
  athens: 6,
  helsinki: 6,
  kyiv: 6,
  bucharest: 6,
  'tel-aviv': 6,
  riyadh: 6,
  doha: 6,
  cairo: 6,
  lagos: 6,
  nairobi: 6,
  johannesburg: 6,
  karachi: 6,
  dhaka: 6,
  bangkok: 6,
  jakarta: 6,
  manila: 6,
  'kuala-lumpur': 6,
  'ho-chi-minh-city': 6,
  taipei: 6,
  beijing: 6,
  brisbane: 6,
  perth: 6,
  phoenix: 6,
  honolulu: 6,
  kolkata: 6,

  // Genuinely lower demand, or interesting rather than busy.
  'st-johns': 4,
  'chatham-islands': 3,
  'lord-howe-island': 3,
  nuuk: 3,
  reykjavik: 5,
  anchorage: 5,
  casablanca: 5,
  almaty: 5,
  yangon: 5,
  kathmandu: 5,
  adelaide: 5,
  tehran: 5,
  santiago: 5,
  lima: 5,
  bogota: 5,
  'buenos-aires': 6,
};

/** Default for any city not named above. */
const DEFAULT_DEMAND = 5;

export function cityDemand(slug: string): number {
  return DEMAND[slug] ?? DEFAULT_DEMAND;
}

/** Every slug in the demand map must be a real city, or the map has drifted. */
export function unknownDemandSlugs(): string[] {
  const known = new Set(CITIES.map((city) => city.slug));
  return Object.keys(DEMAND).filter((slug) => !known.has(slug));
}
