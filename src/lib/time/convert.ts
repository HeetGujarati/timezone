import { getOffsetMinutes, toZonedDateTime } from './offset.ts';
import { parseLocalTimeInZone } from './parse.ts';
import type { Instant, ResolutionKind, ZonedDateTime } from './types.ts';

const DAY_MS = 86_400_000;

export type ConversionResult = {
  instant: Instant;
  from: ZonedDateTime;
  to: ZonedDateTime;
  /**
   * Calendar days the target is ahead of the source: -1, 0 or +1. This is what makes
   * "10pm Tuesday in New York is 3pm Wednesday in Tokyo" legible rather than alarming.
   */
  dayDelta: number;
  /** Minutes the target zone is ahead of the source. Negative means behind. */
  differenceMinutes: number;
};

/** Express one instant as wall-clock readings in two zones at once. */
export function convert(instant: Instant, fromZone: string, toZone: string): ConversionResult {
  const from = toZonedDateTime(instant, fromZone);
  const to = toZonedDateTime(instant, toZone);

  return {
    instant,
    from,
    to,
    dayDelta: calendarDayDelta(from, to),
    differenceMinutes: to.offsetMinutes - from.offsetMinutes,
  };
}

/**
 * Convert a wall-clock reading, not an instant — which is what a person actually
 * asks for. Carries through how the source reading was resolved, so a page can say
 * "02:30 does not exist on this date; showing 03:30" instead of silently answering
 * a different question.
 */
export function convertWallTime(
  dateString: string,
  timeString: string,
  fromZone: string,
  toZone: string,
): ConversionResult & { resolution: ResolutionKind; shiftedByMinutes: number } {
  const resolved = parseLocalTimeInZone(dateString, timeString, fromZone);
  return {
    ...convert(resolved.instant, fromZone, toZone),
    resolution: resolved.resolution,
    shiftedByMinutes: resolved.shiftedByMinutes,
  };
}

function toOrdinalDay(zoned: ZonedDateTime): number {
  return Date.UTC(zoned.year, zoned.month - 1, zoned.day) / DAY_MS;
}

function calendarDayDelta(from: ZonedDateTime, to: ZonedDateTime): number {
  return toOrdinalDay(to) - toOrdinalDay(from);
}

/**
 * How far ahead `toZone` is of `fromZone` at an instant, in minutes.
 *
 * Time-zone difference is not a constant: it changes when either zone shifts, and
 * for a few weeks each spring and autumn the usual answer is wrong. Always ask at
 * a specific instant.
 */
export function getZoneDifferenceMinutes(
  fromZone: string,
  toZone: string,
  instant: Instant,
): number {
  return getOffsetMinutes(toZone, instant) - getOffsetMinutes(fromZone, instant);
}

export type HourTableRow = {
  /** Wall-clock hour in the source zone, 0–23. */
  fromHour: number;
  fromMinute: number;
  toHour: number;
  toMinute: number;
  /** -1, 0 or +1 — whether the target has already turned the page on the calendar. */
  dayDelta: number;
  instant: Instant;
};

/**
 * The 24-row quick-reference table every conversion page carries.
 *
 * Built from real instants on a real date rather than by adding a fixed offset, so
 * a date that contains a transition produces a table that bends where the clocks do.
 */
export function buildHourTable(
  fromZone: string,
  toZone: string,
  referenceInstant: Instant,
): HourTableRow[] {
  const reference = toZonedDateTime(referenceInstant, fromZone);
  const dateString = `${String(reference.year).padStart(4, '0')}-${String(reference.month).padStart(2, '0')}-${String(reference.day).padStart(2, '0')}`;

  const rows: HourTableRow[] = [];
  for (let hour = 0; hour < 24; hour += 1) {
    const timeString = `${String(hour).padStart(2, '0')}:00`;
    const result = convertWallTime(dateString, timeString, fromZone, toZone);
    rows.push({
      fromHour: result.from.hour,
      fromMinute: result.from.minute,
      toHour: result.to.hour,
      toMinute: result.to.minute,
      dayDelta: result.dayDelta,
      instant: result.instant,
    });
  }
  return rows;
}
