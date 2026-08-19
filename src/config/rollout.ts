import { DEFAULT_LOCALE, LOCALE_CODES, type LocaleCode } from './locales.ts';
import { FULL_PROGRAMMATIC_LOCALES, LOCALISED_PAIR_LIMIT } from './flags.ts';

/**
 * Which locales a given path actually exists in.
 *
 * hreflang is a promise: every URL in the cluster must resolve. Pointing at a page
 * that was never built is worse than emitting no cluster at all, because Google
 * treats the whole set as unreliable. So this is derived from the same rules the
 * routes are generated from, and scripts/seo-audit.mjs fails the build if any
 * emitted hreflang target is missing from dist/.
 *
 * `LOCALISED_LOCALES` is the switch. It stays at English-only until the localised
 * routes exist; flipping it is what turns the other thirteen on.
 */
export const LOCALISED_LOCALES: readonly LocaleCode[] = LOCALE_CODES;

/** Page types that ship in every locale. */
const UNIVERSAL_PREFIXES = [
  '/',
  '/meeting-planner/',
  '/world-clock/',
  '/time-difference/',
  '/working-hours-overlap/',
  '/unix-timestamp-converter/',
  '/duration-calculator/',
  '/countdown/',
  '/utc-time/',
  '/dst-changes/',
  '/about/',
  '/contact/',
  '/privacy/',
  '/terms/',
  '/cookies/',
  '/accessibility/',
  '/time-in/',
  '/guides/',
  '/convert/',
];

/**
 * Abbreviation pages are English-only at launch. "EST" is an English abbreviation;
 * a Japanese page explaining that EST means Eastern Standard Time serves nobody,
 * and 240 of them would spend crawl budget that the city pages need more.
 */
const ABBREVIATION_CODES = 'est|edt|cst|cdt|mst|pst|pdt|utc|gmt|bst|cet|cest|eet|ist|jst|aest';
const ABBREVIATION_PATH = new RegExp(
  `^/convert/(${ABBREVIATION_CODES})-to-(${ABBREVIATION_CODES})/$`,
);

function isAbbreviationPath(path: string): boolean {
  return ABBREVIATION_PATH.test(path);
}

/** Paginated conversion index pages beyond the first are English-only. */
function isPaginatedPath(path: string): boolean {
  return path.startsWith('/convert/page/');
}

export type PairLocaleContext = {
  /** Rank of this pair by search value, 0-based. Only the top N are localised. */
  pairRank?: number;
};

/**
 * The locales a path exists in.
 *
 * `pairRank` is supplied for city-pair pages: at launch each non-English locale
 * ships only the top {@link LOCALISED_PAIR_LIMIT} pairs, to protect crawl budget
 * on a new domain. SEO.md documents how to widen that.
 */
export function localesForPath(path: string, context: PairLocaleContext = {}): LocaleCode[] {
  if (isAbbreviationPath(path) || isPaginatedPath(path)) return [DEFAULT_LOCALE];

  if (UNIVERSAL_PREFIXES.includes(path)) return [...LOCALISED_LOCALES];
  if (path.startsWith('/time-in/') || path.startsWith('/guides/')) return [...LOCALISED_LOCALES];

  if (path.startsWith('/convert/')) {
    const rank = context.pairRank;
    if (rank === undefined) return [DEFAULT_LOCALE];
    if (rank < LOCALISED_PAIR_LIMIT) return [...LOCALISED_LOCALES];
    // Beyond the launch subset: English, plus any locale switched to full scope.
    return [DEFAULT_LOCALE, ...FULL_PROGRAMMATIC_LOCALES];
  }

  return [DEFAULT_LOCALE];
}
