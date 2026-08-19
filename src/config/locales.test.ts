import { describe, expect, it } from 'vitest';
import {
  DEFAULT_LOCALE,
  LOCALES,
  LOCALE_CODES,
  PREFIXED_LOCALES,
  getLocale,
  isLocaleCode,
  localeFromSegment,
  localePath,
} from './locales.ts';

describe('locale registry', () => {
  it('ships the 14 launch locales', () => {
    expect(LOCALES).toHaveLength(14);
    expect(PREFIXED_LOCALES).toHaveLength(13);
  });

  it('has unique codes and unique URL segments', () => {
    expect(new Set(LOCALE_CODES).size).toBe(LOCALE_CODES.length);
    const segments = LOCALES.map((l) => l.segment);
    expect(new Set(segments).size).toBe(segments.length);
  });

  it('gives exactly one locale the site root', () => {
    const rootLocales = LOCALES.filter((l) => l.segment === '');
    expect(rootLocales).toHaveLength(1);
    expect(rootLocales[0]?.code).toBe(DEFAULT_LOCALE);
  });

  it('uses BCP-47 tags that Intl actually resolves', () => {
    for (const locale of LOCALES) {
      const resolved = new Intl.DateTimeFormat(locale.bcp47).resolvedOptions().locale;
      expect(resolved, `${locale.code} did not resolve`).toBeTruthy();
      expect(Intl.DateTimeFormat.supportedLocalesOf([locale.bcp47])).toHaveLength(1);
    }
  });

  it('uses lowercase ASCII URL segments', () => {
    for (const locale of PREFIXED_LOCALES.map(getLocale)) {
      expect(locale.segment).toMatch(/^[a-z-]+$/);
    }
  });

  it('marks Arabic as the only RTL locale', () => {
    expect(LOCALES.filter((l) => l.dir === 'rtl').map((l) => l.code)).toEqual(['ar']);
  });

  it('resolves segments back to their locale', () => {
    expect(localeFromSegment('pt-br')?.code).toBe('pt-BR');
    expect(localeFromSegment('zh-hans')?.code).toBe('zh-Hans');
    expect(localeFromSegment('nope')).toBeUndefined();
  });

  it('builds prefixed paths with leading and trailing slashes', () => {
    expect(localePath('en', '/meeting-planner/')).toBe('/meeting-planner/');
    expect(localePath('de', '/meeting-planner/')).toBe('/de/meeting-planner/');
    expect(localePath('zh-Hans', '/')).toBe('/zh-hans/');
    expect(localePath('ar')).toBe('/ar/');
  });

  it('rejects unknown locales loudly', () => {
    expect(() => getLocale('xx')).toThrow(/Unknown locale/);
    expect(isLocaleCode('xx')).toBe(false);
    expect(isLocaleCode('pt-BR')).toBe(true);
  });
});
