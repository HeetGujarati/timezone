import { getLocale, type LocaleCode } from '~/config/locales.ts';

/**
 * Country names in the reader's language, from CLDR.
 *
 * The city dataset stores English country names because that is what the
 * editorial record holds. Translating them by hand across fourteen locales
 * would be inventing data; `Intl.DisplayNames` already knows them, keyed by
 * ISO 3166-1 alpha-2, which the dataset also carries.
 *
 * Formatters are cached because a build asks for the same fourteen of them
 * across 1,120 city pages.
 */

const cache = new Map<LocaleCode, Intl.DisplayNames>();

function displayNames(locale: LocaleCode): Intl.DisplayNames {
  const cached = cache.get(locale);
  if (cached !== undefined) return cached;

  // fallback: 'none' makes an unmatched code return undefined rather than the
  // code itself, so "VN" can never reach a page as though it were a name.
  const created = new Intl.DisplayNames([getLocale(locale).bcp47], {
    type: 'region',
    fallback: 'none',
  });
  cache.set(locale, created);
  return created;
}

/**
 * CLDR's own placeholder. `ZZ` is a real entry meaning "Unknown Region", which
 * resolves to a translated string in every locale and would otherwise sail
 * through as a country name. Comparing against it catches that by value, in
 * whichever language the reader would have seen it.
 */
function unknownRegionName(locale: LocaleCode): string | undefined {
  return displayNames(locale).of('ZZ');
}

/**
 * The localised name for an ISO 3166-1 alpha-2 code.
 *
 * Falls back to the English name the dataset already holds rather than to the
 * bare code — CLDR covers every country in the dataset, but a page that somehow
 * missed should read "Vietnam", not "VN" and not "Unknown Region".
 */
export function countryName(locale: LocaleCode, countryCode: string, fallback: string): string {
  const resolved = displayNames(locale).of(countryCode.toUpperCase());
  if (resolved === undefined || resolved === unknownRegionName(locale)) return fallback;
  return resolved;
}
