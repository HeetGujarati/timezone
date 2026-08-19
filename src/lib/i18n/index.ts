import en from '~/i18n/en.json' with { type: 'json' };
import type { LocaleCode } from '~/config/locales.ts';

/**
 * Translation lookup.
 *
 * English is the shape of the contract: every other dictionary is checked against
 * its key set by scripts/i18n-parity.mjs, and the build fails on a missing key
 * rather than shipping a half-translated page. At runtime a missing key still
 * falls back to English cleanly, so a mistake degrades to the wrong language
 * rather than to a raw key or an empty element.
 */
export type TranslationKey = keyof typeof en;
export type Dictionary = Record<string, string>;

const dictionaries = import.meta.glob<{ default: Dictionary }>('~/i18n/*.json', { eager: true });

function dictionaryFor(locale: LocaleCode): Dictionary {
  const entry = dictionaries[`/src/i18n/${locale}.json`];
  return entry?.default ?? (en as Dictionary);
}

/**
 * Substitute `{name}` placeholders. Values are inserted as plain text by Astro's
 * own escaping wherever this lands in a template — no interpolation ever produces
 * markup.
 */
function interpolate(template: string, params: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, name: string) => {
    const value = params[name];
    return value === undefined ? match : String(value);
  });
}

export type Translate = (key: TranslationKey, params?: Record<string, string | number>) => string;

export function useTranslations(locale: LocaleCode): Translate {
  const dictionary = dictionaryFor(locale);
  const fallback = en as Dictionary;

  return (key, params) => {
    const template = dictionary[key] ?? fallback[key];
    if (template === undefined) {
      // Only reachable if a key is used that does not exist in English at all,
      // which the type system already prevents. Surface it loudly in dev.
      throw new Error(`Missing translation key: ${key}`);
    }
    return params === undefined ? template : interpolate(template, params);
  };
}

/** The English dictionary, exported for the parity check and for tests. */
export const englishDictionary = en as Dictionary;
