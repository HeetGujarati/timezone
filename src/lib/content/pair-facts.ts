import type { City } from '~/data/cities.ts';
import { getOffsetMinutes, getZoneAbbreviation, formatOffsetShort } from '~/lib/time/offset.ts';
import { describeDifference, buildHourTable, type HourTableRow } from '~/lib/time/convert.ts';
import {
  findDstTransitions,
  findNextTransition,
  getStandardOffsetMinutes,
  getDaylightOffsetMinutes,
} from '~/lib/time/dst.ts';
import { getWorkingHoursOverlap, nearestWorkableWindows } from '~/lib/time/overlap.ts';
import { toZonedDateTime } from '~/lib/time/offset.ts';

/**
 * Everything a city-pair page states, computed once from the IANA data.
 *
 * These are durable facts — offsets, transition dates, overlap windows — not live
 * readings, which is what makes them safe to prerender. The one thing that is not
 * durable, the current time, is rendered client-side by the converter island.
 */

export type ZoneFacts = {
  timeZone: string;
  abbreviation: string;
  offsetMinutes: number;
  offsetLabel: string;
  standardOffsetLabel: string;
  daylightOffsetLabel: string | null;
  observesDst: boolean;
  nextChange: {
    isoDate: string;
    direction: 'forward' | 'backward';
    deltaMinutes: number;
    newOffsetLabel: string;
  } | null;
  changesThisYear: number;
};

export type CallWindow = {
  /** Local range in the source city, e.g. "09:00–12:00". */
  fromRange: string;
  toRange: string;
  minutes: number;
};

export type PairFacts = {
  differenceMinutes: number;
  differenceLabel: string;
  /** True when the target city is ahead of the source. */
  targetAhead: boolean;
  sameTime: boolean;
  from: ZoneFacts;
  to: ZoneFacts;
  hourTable: HourTableRow[];
  callWindows: CallWindow[];
  /** Set when there is no shared 09:00–18:00 window at all. */
  nearestWorkable: CallWindow[];
  /** True when the two cities are on the same IANA zone — same clock, always. */
  sameZone: boolean;
};

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

function localRange(startInstant: number, endInstant: number, timeZone: string): string {
  const start = toZonedDateTime(startInstant, timeZone);
  const end = toZonedDateTime(endInstant, timeZone);
  return `${pad(start.hour)}:${pad(start.minute)}–${pad(end.hour)}:${pad(end.minute)}`;
}

function zoneFactsFor(timeZone: string, instant: number, year: number): ZoneFacts {
  const transitions = findDstTransitions(timeZone, year);
  const next = findNextTransition(timeZone, instant);
  const daylight = getDaylightOffsetMinutes(timeZone, year);

  return {
    timeZone,
    abbreviation: getZoneAbbreviation(timeZone, instant),
    offsetMinutes: getOffsetMinutes(timeZone, instant),
    offsetLabel: formatOffsetShort(getOffsetMinutes(timeZone, instant)),
    standardOffsetLabel: formatOffsetShort(getStandardOffsetMinutes(timeZone, year)),
    daylightOffsetLabel: daylight === null ? null : formatOffsetShort(daylight),
    observesDst: transitions.length > 0,
    nextChange:
      next === null
        ? null
        : {
            isoDate: `${next.localAfter.year}-${pad(next.localAfter.month)}-${pad(next.localAfter.day)}`,
            direction: next.direction,
            deltaMinutes: Math.abs(next.deltaMinutes),
            newOffsetLabel: formatOffsetShort(next.offsetAfterMinutes),
          },
    changesThisYear: transitions.length,
  };
}

export function buildPairFacts(from: City, to: City, instant: number): PairFacts {
  const year = new Date(instant).getUTCFullYear();
  const dayStart = Date.UTC(
    new Date(instant).getUTCFullYear(),
    new Date(instant).getUTCMonth(),
    new Date(instant).getUTCDate(),
  );

  const differenceMinutes =
    getOffsetMinutes(to.timeZone, instant) - getOffsetMinutes(from.timeZone, instant);

  const overlap = getWorkingHoursOverlap(
    [
      { timeZone: from.timeZone, startHour: 9, endHour: 18 },
      { timeZone: to.timeZone, startHour: 9, endHour: 18 },
    ],
    dayStart,
  );

  const callWindows = overlap.windows.map((window) => ({
    fromRange: localRange(window.start, window.end, from.timeZone),
    toRange: localRange(window.start, window.end, to.timeZone),
    minutes: window.durationMinutes,
  }));

  const nearestWorkable = overlap.none
    ? nearestWorkableWindows(
        [
          { timeZone: from.timeZone, startHour: 9, endHour: 18 },
          { timeZone: to.timeZone, startHour: 9, endHour: 18 },
        ],
        dayStart,
      )
        .slice(0, 2)
        .map((window) => ({
          fromRange: localRange(window.start, window.end, from.timeZone),
          toRange: localRange(window.start, window.end, to.timeZone),
          minutes: Math.round((window.end - window.start) / 60000),
        }))
    : [];

  return {
    differenceMinutes,
    differenceLabel: describeDifference(differenceMinutes),
    targetAhead: differenceMinutes > 0,
    sameTime: differenceMinutes === 0,
    from: zoneFactsFor(from.timeZone, instant, year),
    to: zoneFactsFor(to.timeZone, instant, year),
    hourTable: buildHourTable(from.timeZone, to.timeZone, dayStart),
    callWindows,
    nearestWorkable,
    sameZone: from.timeZone === to.timeZone,
  };
}
