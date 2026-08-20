import type { LocaleCode } from '~/config/locales.ts';
import { useTranslations } from '~/lib/i18n/index.ts';
import { formatDuration } from './duration.ts';

/**
 * "6 hours behind", in the reader's language.
 *
 * `describeDifference` in src/lib/time/convert.ts builds the same phrase in
 * English by concatenating a number, a pluralised noun and a direction. None of
 * those three survives translation: Russian pluralises on three forms, Japanese
 * puts the direction after the duration with no space, and Chinese puts it
 * before. So the phrase is assembled from CLDR data for the number part and a
 * dictionary template for the shape, and neither is guessed here.
 */
export function describeDifferenceIn(locale: LocaleCode, differenceMinutes: number): string {
  const t = useTranslations(locale);
  if (differenceMinutes === 0) return t('diff.same');

  const duration = formatDuration(locale, differenceMinutes);
  return differenceMinutes > 0 ? t('diff.ahead', { duration }) : t('diff.behind', { duration });
}
