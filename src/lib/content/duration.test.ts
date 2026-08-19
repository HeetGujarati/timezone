import { describe, expect, it } from 'vitest';
import { LOCALES } from '~/config/locales.ts';
import { formatDuration } from './duration.ts';

describe('formatDuration', () => {
  it('renders whole hours without a minutes component', () => {
    expect(formatDuration('en', 300)).toBe('5 hours');
    expect(formatDuration('de', 300)).toBe('5 Stunden');
  });

  it('renders the half- and three-quarter-hour offsets exactly', () => {
    expect(formatDuration('en', 330)).toBe('5 hours 30 minutes');
    expect(formatDuration('en', 345)).toBe('5 hours 45 minutes');
    expect(formatDuration('en', 765)).toBe('12 hours 45 minutes');
  });

  it('renders a sub-hour difference as minutes alone', () => {
    expect(formatDuration('en', 30)).toBe('30 minutes');
    expect(formatDuration('en', 45)).toBe('45 minutes');
  });

  it('renders zero as zero minutes rather than an empty string', () => {
    expect(formatDuration('en', 0)).toBe('0 minutes');
  });

  it('ignores the sign — direction is the caller’s to phrase', () => {
    expect(formatDuration('en', -330)).toBe(formatDuration('en', 330));
  });

  it('applies the locale’s own plural forms', () => {
    // Russian: 4 takes the paucal form, 5 the genitive plural. A hand-written
    // rule would get one of these wrong; CLDR gets both right.
    expect(formatDuration('ru', 240)).toBe('4 часа');
    expect(formatDuration('ru', 300)).toBe('5 часов');
    expect(formatDuration('ru', 60)).toBe('1 час');
  });

  it('closes the numeral–counter gap Japanese CLDR leaves open', () => {
    expect(formatDuration('ja', 270)).toBe('4時間30分');
    expect(formatDuration('ja', 300)).toBe('5時間');
  });

  it('produces a non-empty, digit-bearing string in every locale', () => {
    for (const { code } of LOCALES) {
      const result = formatDuration(code, 330);
      expect(result.trim(), `${code} produced nothing`).not.toBe('');
      // Arabic drops the numeral only for the singular; 5 always carries one.
      expect(result, `${code} lost its numerals`).toMatch(/\d/u);
    }
  });

  it('gives a different reading per locale for the same difference', () => {
    const rendered = LOCALES.map(({ code }) => formatDuration(code, 330));
    // Spanish and Brazilian Portuguese genuinely coincide here ("5 horas 30
    // minutos"), so this asserts breadth rather than total uniqueness.
    expect(new Set(rendered).size).toBeGreaterThanOrEqual(10);
  });
});
