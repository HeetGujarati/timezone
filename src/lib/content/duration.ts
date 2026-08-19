import { getLocale, type LocaleCode } from '~/config/locales.ts';

/**
 * Localised durations, from CLDR rather than from hand-written plural rules.
 *
 * A time difference is "4 hours 30 minutes" in English, "4 часа 30 минут" in
 * Russian and "4 ساعات و30 دقيقة" in Arabic — three plural systems with three,
 * six and one form respectively. Writing those tables by hand across fourteen
 * locales would be inventing data the platform already holds correctly, so this
 * composes `Intl.NumberFormat` unit output with `Intl.ListFormat` instead. Both
 * read CLDR, so 4 часа and 5 часов come out right without a rule in this file.
 */

/**
 * Japanese CLDR renders the long hour unit as "4 時間" — a space the language
 * does not use between a numeral and its counter. Everything else joins cleanly.
 */
const JA_UNIT_SPACE = /(\d)\s+(時間|分)/gu;

function unit(bcp47: string, value: number, name: 'hour' | 'minute'): string {
  return new Intl.NumberFormat(bcp47, {
    style: 'unit',
    unit: name,
    unitDisplay: 'long',
  }).format(value);
}

/**
 * Format a whole number of minutes as hours and minutes in the locale's own words.
 *
 * Zero-valued components are dropped rather than rendered — "5 hours", not
 * "5 hours 0 minutes" — because a page states the difference in a sentence.
 */
export function formatDuration(locale: LocaleCode, totalMinutes: number): string {
  const { bcp47 } = getLocale(locale);
  const total = Math.abs(Math.trunc(totalMinutes));
  const hours = Math.floor(total / 60);
  const minutes = total % 60;

  const parts: string[] = [];
  if (hours > 0) parts.push(unit(bcp47, hours, 'hour'));
  if (minutes > 0 || hours === 0) parts.push(unit(bcp47, minutes, 'minute'));

  const joined =
    parts.length === 1
      ? (parts[0] ?? '')
      : new Intl.ListFormat(bcp47, { type: 'unit', style: 'narrow' }).format(parts);

  return locale === 'ja' ? joined.replace(JA_UNIT_SPACE, '$1$2') : joined;
}
