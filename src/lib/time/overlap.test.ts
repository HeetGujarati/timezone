import { describe, expect, it } from 'vitest';
import {
  bestOverlapWindow,
  getWorkingHoursOverlap,
  nearestWorkableWindows,
  type ZoneWorkingHours,
} from './overlap.ts';

const DAY_START = Date.UTC(2026, 0, 15, 0, 0, 0);

function nineToSix(timeZone: string): ZoneWorkingHours {
  return { timeZone, startHour: 9, endHour: 18 };
}

function utcHours(instant: number): string {
  return new Date(instant).toISOString().slice(11, 16);
}

describe('getWorkingHoursOverlap', () => {
  it('finds the four-hour London and New York window', () => {
    const result = getWorkingHoursOverlap(
      [nineToSix('Europe/London'), nineToSix('America/New_York')],
      DAY_START,
    );
    expect(result.none).toBe(false);
    expect(result.totalMinutes).toBe(240);
    expect(utcHours(result.windows[0]!.start)).toBe('14:00');
    expect(utcHours(result.windows[0]!.end)).toBe('18:00');
  });

  it('finds no overlap at all between Los Angeles and Mumbai', () => {
    const result = getWorkingHoursOverlap(
      [nineToSix('America/Los_Angeles'), nineToSix('Asia/Kolkata')],
      DAY_START,
    );
    expect(result.none).toBe(true);
    expect(result.windows).toEqual([]);
    expect(result.totalMinutes).toBe(0);
  });

  it('finds the single hour New York and Sydney do share', () => {
    const result = getWorkingHoursOverlap(
      [nineToSix('America/New_York'), nineToSix('Australia/Sydney')],
      DAY_START,
    );
    expect(result.totalMinutes).toBe(60);
  });

  it('respects a 45-minute offset at the window boundary', () => {
    // Kathmandu is +05:45, so its 09:00 is 03:15 UTC — a quarter-hour boundary
    // that a 30-minute-resolution scan would round away.
    const result = getWorkingHoursOverlap(
      [nineToSix('Asia/Kathmandu'), { timeZone: 'UTC', startHour: 0, endHour: 24 }],
      DAY_START,
    );
    expect(utcHours(result.windows[0]!.start)).toBe('03:15');
  });

  it('handles an overnight shift that wraps past midnight', () => {
    const result = getWorkingHoursOverlap(
      [
        { timeZone: 'UTC', startHour: 22, endHour: 6 },
        { timeZone: 'UTC', startHour: 0, endHour: 24 },
      ],
      DAY_START,
    );
    expect(result.none).toBe(false);
    expect(result.totalMinutes).toBeGreaterThan(0);
  });

  it('returns nothing for an empty team rather than pretending everyone is free', () => {
    const result = getWorkingHoursOverlap([], DAY_START);
    expect(result.none).toBe(true);
  });

  it('narrows as zones are added, never widens', () => {
    const two = getWorkingHoursOverlap(
      [nineToSix('Europe/London'), nineToSix('America/New_York')],
      DAY_START,
    );
    const three = getWorkingHoursOverlap(
      [nineToSix('Europe/London'), nineToSix('America/New_York'), nineToSix('Asia/Kolkata')],
      DAY_START,
    );
    expect(three.totalMinutes).toBeLessThanOrEqual(two.totalMinutes);
  });

  it('gives a ten-zone team an honest zero rather than a compromise', () => {
    const zones = [
      'America/Los_Angeles',
      'America/New_York',
      'Europe/London',
      'Europe/Berlin',
      'Asia/Kolkata',
      'Asia/Singapore',
      'Asia/Tokyo',
      'Australia/Sydney',
      'Pacific/Auckland',
      'America/Sao_Paulo',
    ].map(nineToSix);
    expect(getWorkingHoursOverlap(zones, DAY_START).none).toBe(true);
  });
});

describe('bestOverlapWindow', () => {
  it('picks the longest window', () => {
    const result = getWorkingHoursOverlap(
      [nineToSix('Europe/London'), nineToSix('America/New_York')],
      DAY_START,
    );
    expect(bestOverlapWindow(result)?.durationMinutes).toBe(240);
  });

  it('returns null when nothing overlaps', () => {
    const result = getWorkingHoursOverlap(
      [nineToSix('America/Los_Angeles'), nineToSix('Asia/Kolkata')],
      DAY_START,
    );
    expect(bestOverlapWindow(result)).toBeNull();
  });
});

describe('nearestWorkableWindows', () => {
  it('offers the least-bad windows when there is no shared time', () => {
    const windows = nearestWorkableWindows(
      [nineToSix('America/Los_Angeles'), nineToSix('Asia/Kolkata')],
      DAY_START,
    );
    expect(windows.length).toBeGreaterThan(0);
    for (const window of windows) {
      expect(window.zonesInside).toBe(1);
      expect(window.end).toBeGreaterThan(window.start);
    }
  });
});
