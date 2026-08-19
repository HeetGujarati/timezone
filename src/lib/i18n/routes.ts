import { localePath, type LocaleCode } from '~/config/locales.ts';
import { localesForPath, type PairLocaleContext } from '~/config/rollout.ts';
import { pairRank } from '~/data/pairs.ts';

/**
 * A link to `path` that is guaranteed to resolve.
 *
 * Not every page exists in every locale: abbreviation pages and the paginated
 * conversion index are English-only, and non-English locales ship only the
 * highest-value city pairs at launch. Linking a Japanese page to a Japanese URL
 * that was never built produces a 404 for the reader and a broken internal link
 * for a crawler, so this falls back to the English URL instead.
 *
 * scripts/link-check.mjs walks every built page and fails the build if any link
 * still misses.
 */
export function hrefFor(locale: LocaleCode, path: string): string {
  const context: PairLocaleContext = {};

  if (path.startsWith('/convert/')) {
    const rank = pairRank(path.replace('/convert/', '').replace(/\/$/, ''));
    // exactOptionalPropertyTypes: assign only when there is a rank to assign.
    if (rank !== undefined) context.pairRank = rank;
  }

  const available = localesForPath(path, context);
  return available.includes(locale) ? localePath(locale, path) : localePath('en', path);
}
