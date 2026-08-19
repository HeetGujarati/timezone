import type { LocaleCode } from '~/config/locales.ts';

/**
 * Find a collection entry for a locale, keyed the way the loader stores it.
 *
 * Astro's glob loader slugifies entry IDs, so `src/content/pages/pt-BR/about.md`
 * loads as `pt-br/about` — lowercased. Looking it up by the locale *code*
 * therefore misses for the only two locales whose codes are not already
 * lowercase, `pt-BR` and `zh-Hans`.
 *
 * That failed silently, because a missing translation is supposed to fall back
 * to English: the pages built, the build was clean, and every Brazilian
 * Portuguese and Simplified Chinese support page quietly rendered in English.
 * `entries.test.ts` asserts the round trip for every locale so it cannot recur.
 */

type Entry = { id: string };

/**
 * The prefix an entry ID carries for a locale: 'pt-BR' → 'pt-br/'.
 *
 * This is the content *directory* name lowercased, which is what the loader
 * slugifies — deliberately not the URL segment. English has no URL segment at
 * all (`prefixDefaultLocale: false`), but its content still lives in `en/`.
 */
export function entryPrefix(locale: LocaleCode): string {
  return `${locale.toLowerCase()}/`;
}

/** The locale-independent part of an entry ID: 'pt-br/about' → 'about'. */
export function entrySlug(id: string): string {
  return id.slice(id.indexOf('/') + 1);
}

export function isLocaleEntry(entry: Entry, locale: LocaleCode): boolean {
  return entry.id.startsWith(entryPrefix(locale));
}

/**
 * The entry for this locale, or undefined when it has not been translated.
 * Callers supply their own English fallback, so this stays honest about absence.
 */
export function findLocaleEntry<T extends Entry>(
  entries: readonly T[],
  locale: LocaleCode,
  slug: string,
): T | undefined {
  const wanted = `${entryPrefix(locale)}${slug}`;
  return entries.find((entry) => entry.id === wanted);
}
