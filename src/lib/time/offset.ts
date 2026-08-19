import type { Instant, ZonedDateTime } from './types.ts';

/**
 * Every offset in this codebase is derived from the runtime's IANA data through
 * `Intl`, never from a table. Constructing an `Intl.DateTimeFormat` is expensive
 * relative to using one, and the programmatic pages call these functions tens of
 * thousands of times per build, so formatters are cached per zone.
 */
const partsFormatterCache = new Map<string, Intl.DateTimeFormat>();
const abbreviationFormatterCache = new Map<string, Intl.DateTimeFormat>();

function partsFormatter(timeZone: string): Intl.DateTimeFormat {
  let formatter = partsFormatterCache.get(timeZone);
  if (formatter === undefined) {
    formatter = new Intl.DateTimeFormat('en-US', {
      timeZone,
      hourCycle: 'h23',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      weekday: 'short',
      era: 'short',
    });
    partsFormatterCache.set(timeZone, formatter);
  }
  return formatter;
}

const WEEKDAY_TO_ISO: Record<string, number> = {
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
  Sun: 7,
};

type WallParts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  weekday: number;
};

/**
 * The wall-clock reading a person in `timeZone` sees at `instant`.
 *
 * `hour` is 0–23: `hourCycle: 'h23'` is set explicitly because 'en-US' otherwise
 * reports midnight as hour 24 in some ICU versions, which silently shifts a date.
 */
export function getWallParts(instant: Instant, timeZone: string): WallParts {
  const parts = partsFormatter(timeZone).formatToParts(new Date(instant));

  let year = 0;
  let month = 0;
  let day = 0;
  let hour = 0;
  let minute = 0;
  let second = 0;
  let weekday = 1;
  let isBce = false;

  for (const part of parts) {
    switch (part.type) {
      case 'year':
        year = Number(part.value);
        break;
      case 'month':
        month = Number(part.value);
        break;
      case 'day':
        day = Number(part.value);
        break;
      case 'hour':
        hour = Number(part.value) % 24;
        break;
      case 'minute':
        minute = Number(part.value);
        break;
      case 'second':
        second = Number(part.value);
        break;
      case 'weekday':
        weekday = WEEKDAY_TO_ISO[part.value] ?? 1;
        break;
      case 'era':
        isBce = part.value === 'BC';
        break;
      default:
        break;
    }
  }

  return { year: isBce ? 1 - year : year, month, day, hour, minute, second, weekday };
}

/** The same wall reading expressed as a UTC timestamp, for offset arithmetic. */
function wallAsUtcMillis(parts: WallParts): number {
  const utc = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second,
  );
  // Date.UTC maps years 0–99 into 1900–1999. Undo that for the rare historical case.
  if (parts.year >= 0 && parts.year < 100) {
    const corrected = new Date(utc);
    corrected.setUTCFullYear(parts.year);
    return corrected.getTime();
  }
  return utc;
}

/**
 * Seconds east of UTC in `timeZone` at `instant`.
 *
 * Derived by reading the wall clock in the zone and measuring how far it sits from
 * the UTC clock — which is exact for every offset the IANA database contains,
 * including the 45-minute ones and the sub-minute local-mean-time offsets that
 * predate standardisation.
 */
export function getOffsetSeconds(timeZone: string, instant: Instant): number {
  const parts = getWallParts(instant, timeZone);
  const wallUtc = wallAsUtcMillis(parts);
  // The wall reading has no sub-second component, so compare against the instant
  // floored to its second, or the remainder leaks into the offset.
  const flooredInstant = Math.floor(instant / 1000) * 1000;
  return (wallUtc - flooredInstant) / 1000;
}

/**
 * Minutes east of UTC. Kolkata is +330, Kathmandu +345, Chatham +765 or +825,
 * New York -300 or -240.
 */
export function getOffsetMinutes(timeZone: string, instant: Instant): number {
  return Math.round(getOffsetSeconds(timeZone, instant) / 60);
}

/** "+05:45", "-04:00", "+00:00" — the ISO-8601 form used in copy and in JSON-LD. */
export function formatOffset(offsetMinutes: number): string {
  const sign = offsetMinutes < 0 ? '-' : '+';
  const total = Math.abs(offsetMinutes);
  const hours = Math.floor(total / 60);
  const minutes = total % 60;
  return `${sign}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

/** "UTC+5:45", "UTC-4" — the shorter form used in headings and tables. */
export function formatOffsetShort(offsetMinutes: number): string {
  const sign = offsetMinutes < 0 ? '-' : '+';
  const total = Math.abs(offsetMinutes);
  const hours = Math.floor(total / 60);
  const minutes = total % 60;
  return minutes === 0
    ? `UTC${sign}${hours}`
    : `UTC${sign}${hours}:${String(minutes).padStart(2, '0')}`;
}

/**
 * English locales, in cascade order, for resolving a zone abbreviation.
 *
 * ICU only carries letter abbreviations for zones its locale's own region cares
 * about: `en-US` knows EDT and PDT but calls London "GMT+1", while `en-GB` knows
 * BST and CEST but calls New York "GMT-4". No single locale covers the world, so
 * each is tried until one returns letters.
 *
 * The order matters only where two locales both name a zone, and they agree in
 * every such case. It also surfaces a genuine collision worth knowing about:
 * Europe/Dublin and Asia/Kolkata both abbreviate to IST, three and a half hours
 * apart.
 */
const ABBREVIATION_LOCALES = ['en-US', 'en-GB', 'en-AU', 'en-IN', 'en-IE', 'en-NZ'] as const;

/** A real abbreviation is letters; "GMT+5:45" is ICU saying it has none. */
const LETTER_ABBREVIATION = /^[A-Z]{2,6}$/;

function abbreviationFrom(locale: string, timeZone: string, instant: Instant): string | null {
  const key = `${locale}|${timeZone}`;
  let formatter = abbreviationFormatterCache.get(key);
  if (formatter === undefined) {
    formatter = new Intl.DateTimeFormat(locale, { timeZone, timeZoneName: 'short' });
    abbreviationFormatterCache.set(key, formatter);
  }
  const value = formatter
    .formatToParts(new Date(instant))
    .find((part) => part.type === 'timeZoneName')?.value;
  return value !== undefined && LETTER_ABBREVIATION.test(value) ? value : null;
}

/**
 * The abbreviation a zone is using at an instant: "EST", "PDT", "BST", "AEDT".
 *
 * Where no English locale has letters — Tokyo, Shanghai and São Paulo among them —
 * the offset form is returned instead. Inventing "JST" because it looks plausible
 * would be worse than an honest "UTC+9": the point of this site is that its data
 * comes from the tzdata rather than from guesswork.
 */
export function getZoneAbbreviation(timeZone: string, instant: Instant): string {
  for (const locale of ABBREVIATION_LOCALES) {
    const abbreviation = abbreviationFrom(locale, timeZone, instant);
    if (abbreviation !== null) return abbreviation;
  }
  return formatOffsetShort(getOffsetMinutes(timeZone, instant));
}

/** Full wall-clock reading plus the offset that produced it. */
export function toZonedDateTime(instant: Instant, timeZone: string): ZonedDateTime {
  const parts = getWallParts(instant, timeZone);
  return {
    instant,
    timeZone,
    ...parts,
    offsetMinutes: getOffsetMinutes(timeZone, instant),
  };
}

/** Whether the runtime's IANA database knows this identifier. */
export function isValidTimeZone(timeZone: string): boolean {
  try {
    new Intl.DateTimeFormat('en-US', { timeZone });
    return true;
  } catch {
    return false;
  }
}
