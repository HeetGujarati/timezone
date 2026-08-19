import { getOffsetMinutes, getWallParts, toZonedDateTime } from './offset.ts';
import type { DstTransition, Instant } from './types.ts';

const HOUR_MS = 3_600_000;
const DAY_MS = 86_400_000;

/**
 * Coarse scan step. No zone in the IANA database has ever had two offset changes
 * less than six hours apart, so a six-hour probe cannot step over a transition,
 * and each hit is then resolved to the exact second by binary search.
 */
const SCAN_STEP_MS = 6 * HOUR_MS;

const transitionCache = new Map<string, DstTransition[]>();

function cacheKey(timeZone: string, year: number): string {
  return `${timeZone}|${year}`;
}

/**
 * The exact instant the offset changes, to the second.
 *
 * `before` is known to sit on the old offset and `after` on the new one; the
 * interval is halved until it is one second wide, which is the finest granularity
 * the IANA database expresses.
 */
function bisectTransition(
  timeZone: string,
  before: Instant,
  after: Instant,
  offsetBefore: number,
): Instant {
  let lo = Math.floor(before / 1000) * 1000;
  let hi = Math.ceil(after / 1000) * 1000;

  while (hi - lo > 1000) {
    const mid = Math.floor((lo + hi) / 2 / 1000) * 1000;
    if (mid <= lo || mid >= hi) break;
    if (getOffsetMinutes(timeZone, mid) === offsetBefore) {
      lo = mid;
    } else {
      hi = mid;
    }
  }

  return hi;
}

/**
 * Every offset change in `timeZone` during local year `year`.
 *
 * Returns the instant, the offsets either side, and the direction. A zone that
 * does not observe daylight saving returns an empty array — which is a fact worth
 * stating on the page, not an absence to hide.
 *
 * This finds *offset changes*, not only daylight saving: a country permanently
 * moving its clocks shows up here too, which is the honest answer to "does my
 * time zone change this year".
 */
export function findDstTransitions(timeZone: string, year: number): DstTransition[] {
  const key = cacheKey(timeZone, year);
  const cached = transitionCache.get(key);
  if (cached !== undefined) return cached;

  // Widen by a day either side so a transition near a local year boundary is seen
  // regardless of the zone's distance from UTC.
  const scanStart = Date.UTC(year, 0, 1) - DAY_MS;
  const scanEnd = Date.UTC(year + 1, 0, 1) + DAY_MS;

  const transitions: DstTransition[] = [];
  let previousInstant = scanStart;
  let previousOffset = getOffsetMinutes(timeZone, scanStart);

  for (let instant = scanStart + SCAN_STEP_MS; instant <= scanEnd; instant += SCAN_STEP_MS) {
    const offset = getOffsetMinutes(timeZone, instant);
    if (offset !== previousOffset) {
      const exact = bisectTransition(timeZone, previousInstant, instant, previousOffset);
      const offsetBeforeMinutes = getOffsetMinutes(timeZone, exact - 1000);
      const offsetAfterMinutes = getOffsetMinutes(timeZone, exact);
      const deltaMinutes = offsetAfterMinutes - offsetBeforeMinutes;

      if (getWallParts(exact, timeZone).year === year && deltaMinutes !== 0) {
        transitions.push({
          instant: exact,
          offsetBeforeMinutes,
          offsetAfterMinutes,
          deltaMinutes,
          direction: deltaMinutes > 0 ? 'forward' : 'backward',
          localBefore: toZonedDateTime(exact - 1000, timeZone),
          localAfter: toZonedDateTime(exact, timeZone),
        });
      }

      previousOffset = offset;
    }
    previousInstant = instant;
  }

  transitionCache.set(key, transitions);
  return transitions;
}

/**
 * The zone's standard (winter) offset for a local year: the smallest offset it
 * uses. Daylight saving always moves clocks forward, so the minimum is standard
 * time — including in the southern hemisphere, where that minimum happens to fall
 * in the middle of the calendar year.
 */
export function getStandardOffsetMinutes(timeZone: string, year: number): number {
  const transitions = findDstTransitions(timeZone, year);
  if (transitions.length === 0) {
    return getOffsetMinutes(timeZone, Date.UTC(year, 0, 15));
  }
  return Math.min(...transitions.flatMap((t) => [t.offsetBeforeMinutes, t.offsetAfterMinutes]));
}

/** The zone's daylight offset for a local year, or null if it does not observe one. */
export function getDaylightOffsetMinutes(timeZone: string, year: number): number | null {
  const transitions = findDstTransitions(timeZone, year);
  if (transitions.length === 0) return null;
  return Math.max(...transitions.flatMap((t) => [t.offsetBeforeMinutes, t.offsetAfterMinutes]));
}

/** Whether daylight saving is in force in `timeZone` at `instant`. */
export function isDstActive(timeZone: string, instant: Instant): boolean {
  const year = getWallParts(instant, timeZone).year;
  const standard = getStandardOffsetMinutes(timeZone, year);
  return getOffsetMinutes(timeZone, instant) > standard;
}

/** Whether the zone changes its clocks at all during a local year. */
export function observesDst(timeZone: string, year: number): boolean {
  return findDstTransitions(timeZone, year).length > 0;
}

/**
 * The next offset change at or after `instant`, looking into the following year so
 * a December query still finds a March transition. Null when the zone has none.
 */
export function findNextTransition(timeZone: string, instant: Instant): DstTransition | null {
  const startYear = getWallParts(instant, timeZone).year;
  for (const year of [startYear, startYear + 1, startYear + 2]) {
    const next = findDstTransitions(timeZone, year).find((t) => t.instant > instant);
    if (next !== undefined) return next;
  }
  return null;
}

/** Test seam: the transition scan memoises aggressively across a build. */
export function clearTransitionCache(): void {
  transitionCache.clear();
}
