import { formatDurationIn } from '~/lib/intl/duration.ts';

/**
 * "5 hours 45 minutes ahead", in the reader's language, built in the browser.
 *
 * The three sentence shapes are server-rendered onto the host element as
 * `data-diff-same`, `data-diff-ahead` and `data-diff-behind`, the last two
 * carrying a `{duration}` placeholder. The number of hours and minutes comes from
 * CLDR through `Intl`, so this ships no translated text and no plural rules — the
 * same guarantee the rest of the islands keep.
 */
export function describeDifferenceFrom(
  host: HTMLElement,
  differenceMinutes: number,
  locale: string,
): string {
  if (differenceMinutes === 0) return host.dataset['diffSame'] ?? '';

  const template =
    (differenceMinutes > 0 ? host.dataset['diffAhead'] : host.dataset['diffBehind']) ?? '';
  return template.replace('{duration}', formatDurationIn(locale, differenceMinutes));
}
