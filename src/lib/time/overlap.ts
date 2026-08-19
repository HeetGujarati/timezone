import { toZonedDateTime } from './offset.ts';
import type { Instant, OverlapWindow, ZonedDateTime } from './types.ts';

const MINUTE_MS = 60_000;
const DAY_MS = 86_400_000;

/**
 * 15 minutes is the finest resolution any real offset needs: Nepal is at :45,
 * India and half a dozen others at :30, Chatham at :45. Anything coarser would
 * misreport an overlap boundary for a quarter of the world.
 */
const SLOT_MINUTES = 15;

export type ZoneWorkingHours = {
  timeZone: string;
  /** Local hour work starts, 0–23. */
  startHour: number;
  /** Local hour work ends, 1–24. 24 means midnight at the end of the day. */
  endHour: number;
};

export type OverlapResult = {
  windows: OverlapWindow[];
  /** True when no instant in the searched day works for everyone. */
  none: boolean;
  /** Total overlapping minutes across all windows. */
  totalMinutes: number;
};

function isWithinWorkingHours(zoned: ZonedDateTime, startHour: number, endHour: number): boolean {
  const minutesIntoDay = zoned.hour * 60 + zoned.minute;
  const start = startHour * 60;
  const end = endHour * 60;
  if (start <= end) return minutesIntoDay >= start && minutesIntoDay < end;
  // An overnight shift, e.g. 22:00–06:00.
  return minutesIntoDay >= start || minutesIntoDay < end;
}

/**
 * Every window in the 24 hours after `startInstant` where all zones are inside
 * their working hours at once.
 *
 * Returns an empty list rather than a nearest-fit guess when there is no overlap:
 * Los Angeles and Mumbai genuinely share no minute of 09:00–18:00, and the page
 * says so instead of inventing a compromise.
 *
 * New York and Sydney show why this is computed per instant rather than stored per
 * pair: they share exactly one hour in the northern winter, when the gap is 16
 * hours, and nothing at all in the northern summer, when it is 14. Same two cities,
 * different answer, depending only on the date.
 */
export function getWorkingHoursOverlap(
  zones: readonly ZoneWorkingHours[],
  startInstant: Instant,
  durationMs: number = DAY_MS,
): OverlapResult {
  if (zones.length === 0) {
    return { windows: [], none: true, totalMinutes: 0 };
  }

  const slotMs = SLOT_MINUTES * MINUTE_MS;
  const slotCount = Math.ceil(durationMs / slotMs);

  const windows: OverlapWindow[] = [];
  let windowStart: Instant | null = null;

  for (let slot = 0; slot <= slotCount; slot += 1) {
    const instant = startInstant + slot * slotMs;
    const everyoneWorking =
      slot < slotCount &&
      zones.every((zone) =>
        isWithinWorkingHours(toZonedDateTime(instant, zone.timeZone), zone.startHour, zone.endHour),
      );

    if (everyoneWorking && windowStart === null) {
      windowStart = instant;
    } else if (!everyoneWorking && windowStart !== null) {
      windows.push({
        start: windowStart,
        end: instant,
        durationMinutes: Math.round((instant - windowStart) / MINUTE_MS),
      });
      windowStart = null;
    }
  }

  const totalMinutes = windows.reduce((sum, window) => sum + window.durationMinutes, 0);
  return { windows, none: windows.length === 0, totalMinutes };
}

/**
 * The single best window: the longest one, breaking ties toward the earliest.
 * Null when there is no overlap at all.
 */
export function bestOverlapWindow(result: OverlapResult): OverlapWindow | null {
  let best: OverlapWindow | null = null;
  for (const window of result.windows) {
    if (best === null || window.durationMinutes > best.durationMinutes) best = window;
  }
  return best;
}

/**
 * When there is no shared working window, the least-bad options: the windows where
 * the most people are inside working hours, so a page can say "the closest you get
 * is 07:00 in London, which is 18:00 in Tokyo".
 */
export function nearestWorkableWindows(
  zones: readonly ZoneWorkingHours[],
  startInstant: Instant,
  durationMs: number = DAY_MS,
): { start: Instant; end: Instant; zonesInside: number }[] {
  const slotMs = SLOT_MINUTES * MINUTE_MS;
  const slotCount = Math.ceil(durationMs / slotMs);

  let bestCount = 0;
  const counts: number[] = [];

  for (let slot = 0; slot < slotCount; slot += 1) {
    const instant = startInstant + slot * slotMs;
    const inside = zones.filter((zone) =>
      isWithinWorkingHours(toZonedDateTime(instant, zone.timeZone), zone.startHour, zone.endHour),
    ).length;
    counts.push(inside);
    if (inside > bestCount) bestCount = inside;
  }

  const windows: { start: Instant; end: Instant; zonesInside: number }[] = [];
  let windowStart: number | null = null;

  for (let slot = 0; slot <= slotCount; slot += 1) {
    const atBest = slot < slotCount && counts[slot] === bestCount && bestCount > 0;
    if (atBest && windowStart === null) {
      windowStart = slot;
    } else if (!atBest && windowStart !== null) {
      windows.push({
        start: startInstant + windowStart * slotMs,
        end: startInstant + slot * slotMs,
        zonesInside: bestCount,
      });
      windowStart = null;
    }
  }

  return windows;
}
