import { describe, expect, it } from 'vitest';
import { LOCALES } from '~/config/locales.ts';
import { CITIES } from '~/data/cities.ts';
import { countryName } from './country.ts';

describe('countryName', () => {
  it('returns the reader’s own name for a country', () => {
    expect(countryName('en', 'JP', 'Japan')).toBe('Japan');
    expect(countryName('ja', 'JP', 'Japan')).toBe('日本');
    expect(countryName('ru', 'DE', 'Germany')).toBe('Германия');
    expect(countryName('ar', 'EG', 'Egypt')).toBe('مصر');
  });

  it('accepts a lowercase code', () => {
    expect(countryName('fr', 'gb', 'United Kingdom')).toBe(countryName('fr', 'GB', 'x'));
  });

  it('falls back rather than passing through a bare code', () => {
    expect(countryName('en', 'QQ', 'Nowhere')).toBe('Nowhere');
  });

  it('never lets CLDR’s "Unknown Region" placeholder reach a page', () => {
    // ZZ is a real CLDR entry, translated in every locale, so a naive
    // pass-through check misses it and the page reads "Unknown Region".
    for (const { code } of LOCALES) {
      expect(countryName(code, 'ZZ', 'Nowhere'), `${code} let ZZ through`).toBe('Nowhere');
    }
  });

  it('resolves every country in the dataset, in every locale', () => {
    for (const city of CITIES) {
      for (const { code } of LOCALES) {
        const sentinel = '<<unresolved>>';
        const name = countryName(code, city.countryCode, sentinel);
        expect(name, `${city.countryCode} unresolved in ${code}`).not.toBe(sentinel);
      }
    }
  });
});
