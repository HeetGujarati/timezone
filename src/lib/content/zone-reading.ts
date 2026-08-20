import type { LocaleCode } from '~/config/locales.ts';
import { useTranslations } from '~/lib/i18n/index.ts';
import { formatOffsetShort, getOffsetMinutes, getZoneAbbreviation } from '~/lib/time/offset.ts';
import type { Instant } from '~/lib/time/types.ts';

/**
 * What a zone reads right now: "UTC+9 (JST)", or just "UTC+9".
 *
 * Not every zone has a letter abbreviation. ICU reports "GMT+9" for Asia/Tokyo
 * rather than "JST", and the same is true across most of Asia, Africa and South
 * America — `getZoneAbbreviation` falls back to the offset label in those cases,
 * which is honest but made the copy read "UTC+9 (UTC+9)" and "currently
 * abbreviated UTC+9 at UTC+9" on 231 pages.
 *
 * Inventing "JST" where ICU does not report it is not an option: the site's whole
 * claim is that it never makes a time zone fact up. So the sentence adapts to the
 * data instead. One placeholder, filled by a template the dictionary owns, so the
 * parentheses and the separator follow each language's own conventions.
 */

/** The abbreviation, or null where the runtime only has an offset for this zone. */
export function zoneAbbreviation(timeZone: string, instant: Instant): string | null {
  const abbreviation = getZoneAbbreviation(timeZone, instant);
  const offset = formatOffsetShort(getOffsetMinutes(timeZone, instant));
  return abbreviation === offset ? null : abbreviation;
}

export function zoneReading(locale: LocaleCode, timeZone: string, instant: Instant): string {
  const offset = formatOffsetShort(getOffsetMinutes(timeZone, instant));
  const abbreviation = zoneAbbreviation(timeZone, instant);
  if (abbreviation === null) return offset;
  return useTranslations(locale)('zone.reading', { offset, abbr: abbreviation });
}

/** The same, for a reading whose parts are already to hand. */
export function formatZoneReading(
  locale: LocaleCode,
  abbreviation: string,
  offset: string,
): string {
  if (abbreviation === offset) return offset;
  return useTranslations(locale)('zone.reading', { offset, abbr: abbreviation });
}
