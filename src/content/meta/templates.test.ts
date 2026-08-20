import { describe, expect, it } from 'vitest';
import { LOCALES, type LocaleCode } from '~/config/locales.ts';
import { CITIES } from '~/data/cities.ts';
import { ABBREVIATIONS } from '~/data/abbreviations.ts';
import { PAIRS } from '~/data/pairs.ts';
import { countryName } from '~/lib/content/country.ts';
import { formatDuration } from '~/lib/content/duration.ts';
import {
  MAX_DESCRIPTION_LENGTH,
  MAX_TITLE_LENGTH,
  formatTitle,
  truncateDescription,
} from '~/lib/seo/metadata.ts';
import { getMetaTemplates } from './templates.ts';

const CODES = LOCALES.map((locale) => locale.code);

/** The pairing that costs the most characters, so the title budget is tested at its worst. */
const WIDEST_PAIR = [...PAIRS].sort(
  (a, b) => b.from.name.length + b.to.name.length - (a.from.name.length + a.to.name.length),
)[0]!;

const WIDEST_CITY = [...CITIES].sort((a, b) => b.name.length - a.name.length)[0]!;

function pairInput(locale: LocaleCode, from: string, to: string) {
  return {
    from,
    to,
    difference: formatDuration(locale, 765),
    targetAhead: false,
    sameZone: false,
    sameTime: false,
  };
}

describe('generated page metadata templates', () => {
  it('covers every locale', () => {
    for (const code of CODES) {
      expect(getMetaTemplates(code), `${code} has no templates`).toBeDefined();
    }
  });

  describe.each(CODES)('%s', (code) => {
    const meta = getMetaTemplates(code);

    it('keeps the widest real pair title inside the SERP limit', () => {
      const title = formatTitle(
        meta.pairTitle(pairInput(code, WIDEST_PAIR.from.name, WIDEST_PAIR.to.name)),
      );
      expect(
        title.length,
        `${WIDEST_PAIR.from.name} → ${WIDEST_PAIR.to.name} renders ${title.length} chars: ${title}`,
      ).toBeLessThanOrEqual(MAX_TITLE_LENGTH);
    });

    it('keeps every real pair title inside the SERP limit', () => {
      const overlong = PAIRS.map((pair) =>
        formatTitle(meta.pairTitle(pairInput(code, pair.from.name, pair.to.name))),
      ).filter((title) => title.length > MAX_TITLE_LENGTH);
      expect(overlong.slice(0, 3)).toEqual([]);
    });

    it('keeps the widest city title inside the SERP limit', () => {
      const input = {
        city: WIDEST_CITY.name,
        country: countryName(code, WIDEST_CITY.countryCode, WIDEST_CITY.country),
        hasTransitions: true,
      };
      const title = formatTitle(meta.cityTitle(input));
      expect(title.length, title).toBeLessThanOrEqual(MAX_TITLE_LENGTH);
    });

    it('keeps every abbreviation title inside the SERP limit', () => {
      const overlong = ABBREVIATIONS.flatMap((from) =>
        ABBREVIATIONS.filter((to) => to.code !== from.code).map((to) =>
          formatTitle(
            meta.abbreviationTitle({
              from: from.code,
              to: to.code,
              difference: formatDuration(code, 330),
              targetAhead: true,
              sameTime: false,
            }),
          ),
        ),
      ).filter((title) => title.length > MAX_TITLE_LENGTH);
      expect(overlong.slice(0, 3)).toEqual([]);
    });

    it('writes pair descriptions that survive without truncation', () => {
      // A truncated description ends in an ellipsis mid-thought, which reads as
      // carelessness in the SERP. Every pair and every branch is checked, because
      // the worst case is a long city name meeting a long localised duration —
      // not something arithmetic on one sample would catch.
      const tooLong: string[] = [];
      for (const pair of PAIRS) {
        const base = pairInput(code, pair.from.name, pair.to.name);
        const branches = [
          meta.pairDescription(base),
          meta.pairDescription({ ...base, targetAhead: true }),
          meta.pairDescription({ ...base, sameZone: true }),
          meta.pairDescription({ ...base, sameTime: true }),
        ];
        for (const description of branches) {
          if (description.length > MAX_DESCRIPTION_LENGTH) {
            tooLong.push(`${description.length}: ${description}`);
          }
        }
      }
      expect(tooLong.slice(0, 2)).toEqual([]);
    });

    it('writes city descriptions that survive without truncation', () => {
      // Localised country names differ in length by a lot — "US" is seven
      // characters in English and seventeen in Russian — so every city is
      // measured against the name this locale will actually print.
      const tooLong: string[] = [];
      for (const city of CITIES) {
        const country = countryName(code, city.countryCode, city.country);
        for (const hasTransitions of [true, false]) {
          const description = meta.cityDescription({ city: city.name, country, hasTransitions });
          if (description.length > MAX_DESCRIPTION_LENGTH) {
            tooLong.push(`${description.length}: ${description}`);
          }
        }
      }
      expect(tooLong.slice(0, 2)).toEqual([]);
    });

    it('writes abbreviation descriptions that survive without truncation', () => {
      const tooLong: string[] = [];
      for (const from of ABBREVIATIONS) {
        for (const to of ABBREVIATIONS) {
          if (to.code === from.code) continue;
          const base = {
            from: from.code,
            to: to.code,
            difference: formatDuration(code, 1125),
            targetAhead: false,
            sameTime: false,
          };
          for (const description of [
            meta.abbreviationDescription(base),
            meta.abbreviationDescription({ ...base, targetAhead: true }),
            meta.abbreviationDescription({ ...base, sameTime: true }),
          ]) {
            if (description.length > MAX_DESCRIPTION_LENGTH) {
              tooLong.push(`${description.length}: ${description}`);
            }
          }
        }
      }
      expect(tooLong.slice(0, 2)).toEqual([]);
    });

    it('leaves descriptions short enough that nothing is cut', () => {
      // Not an equality check: truncateDescription also collapses whitespace,
      // and French number formatting carries U+202F, so an identical-length
      // string can still differ by one code point. The ellipsis is the signal
      // that something was actually thrown away.
      const sample = meta.pairDescription(pairInput(code, 'Tokyo', 'Berlin'));
      expect(truncateDescription(sample).endsWith('…')).toBe(false);
      expect(truncateDescription(sample).length).toBe(sample.length);
    });

    it('states the direction, not just the magnitude', () => {
      const ahead = meta.pairDescription({
        ...pairInput(code, 'Tokyo', 'Berlin'),
        targetAhead: true,
      });
      const behind = meta.pairDescription({
        ...pairInput(code, 'Tokyo', 'Berlin'),
        targetAhead: false,
      });
      expect(ahead, 'ahead and behind read identically').not.toBe(behind);
    });

    it('names both cities in the pair title and description', () => {
      const input = pairInput(code, 'Tokyo', 'Berlin');
      for (const text of [meta.pairTitle(input), meta.pairDescription(input)]) {
        expect(text).toContain('Tokyo');
        expect(text).toContain('Berlin');
      }
    });
  });

  it('gives each locale a distinct pair title for the same two cities', () => {
    const titles = CODES.map((code) =>
      getMetaTemplates(code).pairTitle(pairInput(code, 'Tokyo', 'Berlin')),
    );
    // Duplicate titles across locales are exactly what the SEO audit rejects.
    expect(new Set(titles).size).toBe(titles.length);
  });

  it('gives each locale a distinct city title for the same city', () => {
    const titles = CODES.map((code) =>
      getMetaTemplates(code).cityTitle({ city: 'Tokyo', country: 'Japan', hasTransitions: false }),
    );
    expect(new Set(titles).size).toBe(titles.length);
  });
});
