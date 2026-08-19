import { describe, expect, it } from 'vitest';
import { englishDictionary, useTranslations } from './index.ts';

describe('useTranslations', () => {
  it('returns the English string for the default locale', () => {
    const t = useTranslations('en');
    expect(t('common.convert')).toBe('Convert');
  });

  it('substitutes named placeholders', () => {
    const t = useTranslations('en');
    expect(t('dst.clocksForward', { minutes: 30 })).toBe('Clocks go forward 30 minutes');
  });

  it('leaves an unsupplied placeholder visible rather than printing undefined', () => {
    const t = useTranslations('en');
    expect(t('dst.clocksForward')).toContain('{minutes}');
  });

  it('loads each locale its own dictionary rather than English', () => {
    // Every locale now has one. When this suite was written none did, and the
    // test asserted the fallback — which quietly became a test that Japanese
    // was untranslated.
    expect(useTranslations('ja')('common.convert')).toBe('変換');
    expect(useTranslations('de')('common.convert')).toBe('Umrechnen');
    expect(useTranslations('ar')('common.convert')).toBe('حوِّل');
  });

  it('still falls back to English for a locale with no dictionary', () => {
    // The fallback path is what keeps a new locale from rendering blank while
    // its dictionary is being written.
    const t = useTranslations('xx' as never);
    expect(t('common.convert')).toBe('Convert');
  });

  it('throws on a key that exists in no dictionary at all', () => {
    const t = useTranslations('en');
    // @ts-expect-error — deliberately invalid key, to prove the runtime guard.
    expect(() => t('does.not.exist')).toThrow(/Missing translation key/);
  });
});

describe('the English dictionary', () => {
  it('has no empty strings', () => {
    for (const [key, value] of Object.entries(englishDictionary)) {
      expect(value.trim(), `${key} is empty`).not.toBe('');
    }
  });

  it('uses only balanced placeholders', () => {
    for (const [key, value] of Object.entries(englishDictionary)) {
      const opens = (value.match(/\{/g) ?? []).length;
      const closes = (value.match(/\}/g) ?? []).length;
      expect(opens, `${key} has unbalanced braces`).toBe(closes);
    }
  });
});
