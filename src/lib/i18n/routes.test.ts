import { describe, expect, it } from 'vitest';
import { hrefFor } from './routes.ts';

describe('hrefFor', () => {
  it('keeps a reader in their own locale when the page exists there', () => {
    expect(hrefFor('de', '/meeting-planner/')).toBe('/de/meeting-planner/');
    expect(hrefFor('ja', '/time-in/tokyo/')).toBe('/ja/time-in/tokyo/');
    expect(hrefFor('ar', '/guides/what-utc-really-is/')).toBe('/ar/guides/what-utc-really-is/');
  });

  it('falls back to English for pages that are English-only', () => {
    // Abbreviation pages and the paginated index ship in English alone.
    expect(hrefFor('de', '/convert/est-to-cet/')).toBe('/convert/est-to-cet/');
    expect(hrefFor('ja', '/convert/page/7/')).toBe('/convert/page/7/');
  });

  it('keeps high-value city pairs localised', () => {
    // new-york-to-london is comfortably inside the launch subset.
    expect(hrefFor('de', '/convert/new-york-to-london/')).toBe('/de/convert/new-york-to-london/');
  });

  it('falls back to English for a pair outside the launch subset', () => {
    // A pair between two small Tier B cities is not in the top 100.
    expect(hrefFor('de', '/convert/nuuk-to-london/')).toBe('/convert/nuuk-to-london/');
  });

  it('never returns a locale-prefixed path for English', () => {
    for (const path of ['/', '/convert/est-to-cet/', '/time-in/tokyo/']) {
      expect(hrefFor('en', path).startsWith('/en/')).toBe(false);
    }
  });

  it('always returns an absolute site path with a trailing slash', () => {
    for (const locale of ['en', 'de', 'ar'] as const) {
      const href = hrefFor(locale, '/time-in/tokyo/');
      expect(href.startsWith('/')).toBe(true);
      expect(href.endsWith('/')).toBe(true);
    }
  });
});
