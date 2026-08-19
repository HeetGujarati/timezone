import { getOffsetSeconds, getWallParts, toZonedDateTime } from './offset.ts';
import type { Instant, ResolvedLocalTime } from './types.ts';

const DAY_MS = 86_400_000;

const DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const TIME_PATTERN = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/;

export class InvalidLocalTimeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidLocalTimeError';
  }
}

type WallReading = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
};

function parseStrings(dateString: string, timeString: string): WallReading {
  const dateMatch = DATE_PATTERN.exec(dateString.trim());
  if (dateMatch === null) {
    throw new InvalidLocalTimeError(`Date must look like 2026-03-08, got "${dateString}".`);
  }
  const timeMatch = TIME_PATTERN.exec(timeString.trim());
  if (timeMatch === null) {
    throw new InvalidLocalTimeError(`Time must look like 09:30 or 09:30:00, got "${timeString}".`);
  }

  const year = Number(dateMatch[1]);
  const month = Number(dateMatch[2]);
  const day = Number(dateMatch[3]);
  const hour = Number(timeMatch[1]);
  const minute = Number(timeMatch[2]);
  const second = Number(timeMatch[3] ?? '0');

  if (month < 1 || month > 12) throw new InvalidLocalTimeError(`Month ${month} does not exist.`);
  if (day < 1 || day > 31) throw new InvalidLocalTimeError(`Day ${day} does not exist.`);
  if (hour > 23) throw new InvalidLocalTimeError(`Hour ${hour} does not exist on a 24-hour clock.`);
  if (minute > 59) throw new InvalidLocalTimeError(`Minute ${minute} does not exist.`);
  if (second > 59) throw new InvalidLocalTimeError(`Second ${second} does not exist.`);

  // Reject 31 February and friends by round-tripping through the calendar.
  const probe = new Date(Date.UTC(year, month - 1, day));
  if (probe.getUTCMonth() !== month - 1 || probe.getUTCDate() !== day) {
    throw new InvalidLocalTimeError(`${dateString} is not a real date.`);
  }

  return { year, month, day, hour, minute, second };
}

function asUtcMillis(reading: WallReading): number {
  const utc = Date.UTC(
    reading.year,
    reading.month - 1,
    reading.day,
    reading.hour,
    reading.minute,
    reading.second,
  );
  if (reading.year >= 0 && reading.year < 100) {
    const corrected = new Date(utc);
    corrected.setUTCFullYear(reading.year);
    return corrected.getTime();
  }
  return utc;
}

function readsBackAs(instant: Instant, timeZone: string, reading: WallReading): boolean {
  const parts = getWallParts(instant, timeZone);
  return (
    parts.year === reading.year &&
    parts.month === reading.month &&
    parts.day === reading.day &&
    parts.hour === reading.hour &&
    parts.minute === reading.minute &&
    parts.second === reading.second
  );
}

/**
 * Turn a wall-clock reading in a zone into an instant.
 *
 * Two days a year this has no single right answer, and pretending otherwise is how
 * scheduling tools quietly book meetings an hour out:
 *
 * - **Spring forward** creates a gap. 02:30 on the US change-over date simply never
 *   happens. Policy: shift forward by the size of the gap, so 02:30 becomes 03:30 —
 *   the same distance past the transition that the reading was past the old time.
 * - **Fall back** repeats an hour. 01:30 happens twice. Policy: take the first,
 *   earlier occurrence — the one still on daylight time.
 *
 * Both policies are surfaced in the UI as a note rather than applied silently, and
 * the resolution is reported on the result so a caller can say what it did.
 */
export function parseLocalTimeInZone(
  dateString: string,
  timeString: string,
  timeZone: string,
): ResolvedLocalTime {
  const reading = parseStrings(dateString, timeString);
  const wallUtc = asUtcMillis(reading);

  // Probe a day either side so both the pre- and post-transition offsets are seen,
  // whichever direction the change went.
  const offsetBefore = getOffsetSeconds(timeZone, wallUtc - DAY_MS);
  const offsetAfter = getOffsetSeconds(timeZone, wallUtc + DAY_MS);

  const candidates = [wallUtc - offsetBefore * 1000, wallUtc - offsetAfter * 1000];
  const valid = [...new Set(candidates)].filter((candidate) =>
    readsBackAs(candidate, timeZone, reading),
  );
  valid.sort((a, b) => a - b);

  const first = valid[0];

  if (first === undefined) {
    // The reading falls in a gap. Shifting by the gap size lands the same distance
    // past the transition as the reading was past the vanished time.
    const gapMinutes = Math.round((offsetAfter - offsetBefore) / 60);
    const shifted = wallUtc - offsetBefore * 1000;
    return {
      instant: shifted,
      resolution: 'gap-shifted',
      shiftedByMinutes: Math.abs(gapMinutes),
      zoned: toZonedDateTime(shifted, timeZone),
    };
  }

  const second = valid[1];
  if (second !== undefined) {
    return {
      instant: first,
      resolution: 'ambiguous-earlier',
      shiftedByMinutes: 0,
      alternativeInstant: second,
      zoned: toZonedDateTime(first, timeZone),
    };
  }

  return {
    instant: first,
    resolution: 'exact',
    shiftedByMinutes: 0,
    zoned: toZonedDateTime(first, timeZone),
  };
}
