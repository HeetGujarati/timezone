import { describe, expect, it } from 'vitest';
import { LOCALES, type LocaleCode } from '~/config/locales.ts';
import { MAX_DESCRIPTION_LENGTH } from '~/lib/seo/metadata.ts';
import { en } from './en.ts';
import { getPageCopy, hasPageCopy } from './index.ts';
import type { PageCopy, ToolCopy, ToolKey } from './types.ts';

const LOCALE_CODES = LOCALES.map((locale) => locale.code);

/**
 * Scripts that must not appear in a locale's copy.
 *
 * A locale file is written in one pass, and a sentence borrowed from the wrong
 * language survives type-checking, the build, and review — it only fails in
 * front of a reader. One did: a Russian clause reached the Japanese converter
 * FAQ. These ranges catch that class of mistake mechanically.
 *
 * Latin is deliberately absent: every locale legitimately carries UTC, IANA,
 * NOAA and the zone identifiers.
 */
const SCRIPTS = {
  cyrillic: /[Ѐ-ӿ]/u,
  arabic: /[؀-ۿ]/u,
  devanagari: /[ऀ-ॿ]/u,
  hangul: /[가-힯ᄀ-ᇿ]/u,
  kana: /[぀-ゟ゠-ヿ]/u,
  han: /[一-鿿]/u,
} as const;

type Script = keyof typeof SCRIPTS;

/** The scripts each locale is allowed to use. Japanese uses han for kanji. */
const ALLOWED: Partial<Record<LocaleCode, readonly Script[]>> = {
  ru: ['cyrillic'],
  ar: ['arabic'],
  hi: ['devanagari'],
  ko: ['hangul'],
  ja: ['kana', 'han'],
  'zh-Hans': ['han'],
};

/** Every string in a copy object, flattened, with a path for the failure message. */
function walk(value: unknown, path: string): Array<[string, string]> {
  if (typeof value === 'string') return [[path, value]];
  if (Array.isArray(value)) {
    return value.flatMap((entry, index) => walk(entry, `${path}[${index}]`));
  }
  if (value !== null && typeof value === 'object') {
    return Object.entries(value).flatMap(([key, entry]) => walk(entry, `${path}.${key}`));
  }
  return [];
}

const TOOL_KEYS = Object.keys(en.tools) as ToolKey[];

describe('page copy', () => {
  it('is written for every locale other than the source', () => {
    // English is the source module, not a locale override, so it has no file
    // under locales/ — getPageCopy('en') reaches it through the same fallback
    // that an unwritten locale would use.
    for (const code of LOCALE_CODES.filter((locale) => locale !== 'en')) {
      expect(hasPageCopy(code), `${code} falls back to English`).toBe(true);
    }
    expect(getPageCopy('en')).toBe(en);
  });

  describe.each(LOCALE_CODES)('%s', (code) => {
    const copy: PageCopy = getPageCopy(code);
    const strings = walk(copy, code);

    it('uses only the scripts of its own language', () => {
      const allowed = ALLOWED[code] ?? [];
      const forbidden = (Object.keys(SCRIPTS) as Script[]).filter(
        (script) => !allowed.includes(script),
      );

      for (const [path, text] of strings) {
        for (const script of forbidden) {
          const match = SCRIPTS[script].exec(text);
          expect(match, `${path} contains ${script}: ${match?.[0] ?? ''}`).toBeNull();
        }
      }
    });

    it('has no empty strings', () => {
      for (const [path, text] of strings) {
        expect(text.trim(), `${path} is empty`).not.toBe('');
      }
    });

    it('keeps every meta description within the tag limit', () => {
      const described = [
        ...TOOL_KEYS.map((key) => [`tools.${key}`, copy.tools[key]] as const),
        ...Object.entries(copy.hubs),
      ] satisfies Array<readonly [string, Pick<ToolCopy, 'description'>]>;

      for (const [path, entry] of described) {
        expect(
          entry.description.length,
          `${path} description is ${entry.description.length} characters`,
        ).toBeLessThanOrEqual(MAX_DESCRIPTION_LENGTH);
      }
    });

    it('gives every tool and hub a distinct meta title', () => {
      const titles = [
        ...TOOL_KEYS.map((key) => copy.tools[key].metaTitle),
        ...Object.values(copy.hubs).map((hub) => hub.metaTitle),
      ];
      expect(new Set(titles).size, `${titles.length} titles, some repeated`).toBe(titles.length);
    });

    it('translates away from English except where a term is shared', () => {
      if (code === 'en') return;
      const englishStrings = new Map(walk(en, code));
      const untranslated = strings.filter(([path, text]) => {
        // Short strings legitimately match: UTC, IANA, NOAA and the like.
        if (text.length < 24) return false;
        return englishStrings.get(path) === text;
      });
      expect(untranslated.map(([path]) => path)).toEqual([]);
    });
  });
});
