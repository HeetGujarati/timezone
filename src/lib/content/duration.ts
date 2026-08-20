import { getLocale, type LocaleCode } from '~/config/locales.ts';
import { formatDurationIn } from '~/lib/intl/duration.ts';

/**
 * Format a whole number of minutes as hours and minutes in the reader's language.
 *
 * The formatting itself is in `~/lib/intl/duration.ts`, which takes a BCP-47 tag
 * and imports nothing so the islands can share it. This wrapper is the one the
 * pages use, taking the site's own locale code.
 */
export function formatDuration(locale: LocaleCode, totalMinutes: number): string {
  return formatDurationIn(getLocale(locale).bcp47, totalMinutes);
}
