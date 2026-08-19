import { describe, expect, it } from 'vitest';
import { LOCALISED_LOCALES, localesForPath } from './rollout.ts';
import { LOCALE_CODES } from './locales.ts';

describe('localesForPath', () => {
  it('gives every locale to the core tools', () => {
    for (const path of ['/', '/meeting-planner/', '/world-clock/', '/dst-changes/']) {
      expect(localesForPath(path), path).toEqual([...LOCALISED_LOCALES]);
    }
  });

  it('gives every locale to city pages, guides and support pages', () => {
    for (const path of ['/time-in/tokyo/', '/guides/what-utc-really-is/', '/privacy/']) {
      expect(localesForPath(path), path).toEqual([...LOCALISED_LOCALES]);
    }
  });

  it('keeps abbreviation pages English-only', () => {
    // "EST" is an English abbreviation; a Japanese page explaining it serves nobody.
    for (const path of ['/convert/est-to-cet/', '/convert/ist-to-jst/', '/convert/utc-to-gmt/']) {
      expect(localesForPath(path), path).toEqual(['en']);
    }
  });

  it('keeps paginated index pages English-only', () => {
    expect(localesForPath('/convert/page/7/')).toEqual(['en']);
  });

  it('localises only the highest-value city pairs at launch', () => {
    expect(localesForPath('/convert/new-york-to-london/', { pairRank: 0 })).toEqual([
      ...LOCALISED_LOCALES,
    ]);
    expect(localesForPath('/convert/new-york-to-london/', { pairRank: 99 })).toEqual([
      ...LOCALISED_LOCALES,
    ]);
    expect(localesForPath('/convert/suva-to-nuuk/', { pairRank: 100 })).toEqual(['en']);
  });

  it('defaults a city pair with no rank to English only', () => {
    expect(localesForPath('/convert/a-to-b/')).toEqual(['en']);
  });

  it('never returns a locale that is not in the registry', () => {
    for (const path of ['/', '/time-in/tokyo/', '/convert/est-to-cet/']) {
      for (const locale of localesForPath(path)) {
        expect(LOCALE_CODES).toContain(locale);
      }
    }
  });

  it('always includes English', () => {
    for (const path of ['/', '/time-in/tokyo/', '/convert/est-to-cet/', '/convert/page/3/']) {
      expect(localesForPath(path), path).toContain('en');
    }
  });
});
