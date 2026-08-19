import type { ZonedDateTime } from '~/lib/time/types.ts';

/**
 * Browser-side formatting. Everything goes through `Intl` with an explicit locale
 * and hour cycle, so a Japanese reader gets a 24-hour clock and an American reader
 * gets 12-hour without either being hardcoded.
 */

export type FormatContext = {
  locale: string;
  hourCycle: 'h12' | 'h23';
};

export function readFormatContext(element: HTMLElement): FormatContext {
  const locale = element.dataset['locale'] ?? document.documentElement.lang ?? 'en';
  const hourCycle = element.dataset['hourCycle'] === 'h12' ? 'h12' : 'h23';
  return { locale, hourCycle };
}

const cache = new Map<string, Intl.DateTimeFormat>();

function formatter(key: string, factory: () => Intl.DateTimeFormat): Intl.DateTimeFormat {
  let found = cache.get(key);
  if (found === undefined) {
    found = factory();
    cache.set(key, found);
  }
  return found;
}

export function formatTime(instant: number, timeZone: string, context: FormatContext): string {
  return formatter(
    `t|${timeZone}|${context.locale}|${context.hourCycle}`,
    () =>
      new Intl.DateTimeFormat(context.locale, {
        timeZone,
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: context.hourCycle,
      }),
  ).format(new Date(instant));
}

export function formatTimeWithSeconds(
  instant: number,
  timeZone: string,
  context: FormatContext,
): string {
  return formatter(
    `ts|${timeZone}|${context.locale}|${context.hourCycle}`,
    () =>
      new Intl.DateTimeFormat(context.locale, {
        timeZone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hourCycle: context.hourCycle,
      }),
  ).format(new Date(instant));
}

export function formatDate(instant: number, timeZone: string, context: FormatContext): string {
  return formatter(
    `d|${timeZone}|${context.locale}`,
    () =>
      new Intl.DateTimeFormat(context.locale, {
        timeZone,
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
  ).format(new Date(instant));
}

/** "2026-03-08" in a given zone, for prefilling a date input. */
export function toDateInputValue(zoned: ZonedDateTime): string {
  return `${String(zoned.year).padStart(4, '0')}-${String(zoned.month).padStart(2, '0')}-${String(zoned.day).padStart(2, '0')}`;
}

/** "09:30" in a given zone, for prefilling a time input. */
export function toTimeInputValue(zoned: ZonedDateTime): string {
  return `${String(zoned.hour).padStart(2, '0')}:${String(zoned.minute).padStart(2, '0')}`;
}
