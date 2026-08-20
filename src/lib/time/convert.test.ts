import { describe, expect, it } from 'vitest';
import { buildHourTable, convert, convertWallTime, getZoneDifferenceMinutes } from './convert.ts';
import { getOffsetMinutes } from './offset.ts';
import { isValidTimeZone } from './offset.ts';

describe('date-line crossings', () => {
  it('lands New York Tuesday evening on Tokyo Wednesday afternoon', () => {
    const result = convertWallTime('2026-01-13', '22:00', 'America/New_York', 'Asia/Tokyo');
    expect(result.to.day).toBe(14);
    expect(result.to.hour).toBe(12);
    expect(result.dayDelta).toBe(1);
  });

  it('lands Kathmandu morning on Los Angeles the previous evening', () => {
    const result = convertWallTime('2026-01-15', '09:00', 'Asia/Kathmandu', 'America/Los_Angeles');
    expect(result.dayDelta).toBe(-1);
    expect(result.to.hour).toBe(19);
    expect(result.to.minute).toBe(15);
  });

  it('spans two calendar days between the extremes of the map', () => {
    const result = convertWallTime('2026-01-15', '23:00', 'Pacific/Kiritimati', 'Etc/GMT+12');
    expect(result.dayDelta).toBe(-1);
    expect(result.differenceMinutes).toBe(-26 * 60);
  });

  it('reports no day change when both zones share a calendar date', () => {
    expect(convertWallTime('2026-01-15', '12:00', 'Europe/London', 'Europe/Berlin').dayDelta).toBe(
      0,
    );
  });
});

describe('convert', () => {
  it('describes one instant as two wall readings', () => {
    const instant = Date.UTC(2026, 0, 15, 12, 0, 0);
    const result = convert(instant, 'UTC', 'Asia/Kolkata');
    expect(result.from.hour).toBe(12);
    expect(result.to.hour).toBe(17);
    expect(result.to.minute).toBe(30);
    expect(result.differenceMinutes).toBe(330);
  });

  it('carries the resolution through when a wall time is ambiguous', () => {
    const result = convertWallTime('2026-11-01', '01:30', 'America/New_York', 'Europe/London');
    expect(result.resolution).toBe('ambiguous-earlier');
  });

  it('carries the resolution through when a wall time never happened', () => {
    const result = convertWallTime('2026-03-08', '02:30', 'America/New_York', 'UTC');
    expect(result.resolution).toBe('gap-shifted');
    expect(result.shiftedByMinutes).toBe(60);
  });
});

describe('getZoneDifferenceMinutes', () => {
  it('changes across the year when only one zone observes DST', () => {
    const winter = getZoneDifferenceMinutes(
      'America/New_York',
      'Asia/Kolkata',
      Date.UTC(2026, 0, 15),
    );
    const summer = getZoneDifferenceMinutes(
      'America/New_York',
      'Asia/Kolkata',
      Date.UTC(2026, 6, 15),
    );
    expect(winter).toBe(630);
    expect(summer).toBe(570);
    expect(winter).not.toBe(summer);
  });

  it('stays constant between two zones that change together', () => {
    const winter = getZoneDifferenceMinutes(
      'Europe/London',
      'Europe/Berlin',
      Date.UTC(2026, 0, 15),
    );
    const summer = getZoneDifferenceMinutes(
      'Europe/London',
      'Europe/Berlin',
      Date.UTC(2026, 6, 15),
    );
    expect(winter).toBe(60);
    expect(summer).toBe(60);
  });
});

describe('buildHourTable', () => {
  it('produces one row per hour of the source day', () => {
    const table = buildHourTable('America/New_York', 'Asia/Kolkata', Date.UTC(2026, 0, 15, 12));
    expect(table).toHaveLength(24);
    expect(table.map((row) => row.fromHour)).toEqual([...Array(24).keys()]);
  });

  it('carries the half-hour offset into every row', () => {
    const table = buildHourTable('UTC', 'Asia/Kolkata', Date.UTC(2026, 0, 15, 12));
    expect(table[0]).toMatchObject({ fromHour: 0, toHour: 5, toMinute: 30 });
    expect(table[23]).toMatchObject({ fromHour: 23, toHour: 4, toMinute: 30, dayDelta: 1 });
  });

  it('bends where the clocks bend on a transition day', () => {
    // On the US spring-forward date, 02:00 local does not exist, so the row for
    // hour 2 resolves to 03:00 and the table has a duplicate reading rather than
    // a fictional one.
    const table = buildHourTable('America/New_York', 'UTC', Date.UTC(2026, 2, 8, 12));
    const hours = table.map((row) => row.fromHour);
    expect(hours).not.toContain(2);
    expect(hours.filter((hour) => hour === 3)).toHaveLength(2);
  });
});

describe('round-trip property: A -> B -> A returns the original instant', () => {
  it('holds for 200 random zone pairs and instants', () => {
    const zones = Intl.supportedValuesOf('timeZone').filter(isValidTimeZone);
    expect(zones.length).toBeGreaterThan(100);

    // A fixed linear congruential generator: random coverage, reproducible builds.
    let seed = 20260819;
    const next = (): number => {
      seed = (seed * 1103515245 + 12345) % 2147483648;
      return seed / 2147483648;
    };

    const START = Date.UTC(2020, 0, 1);
    const RANGE = Date.UTC(2032, 0, 1) - START;

    for (let i = 0; i < 200; i += 1) {
      const from = zones[Math.floor(next() * zones.length)]!;
      const to = zones[Math.floor(next() * zones.length)]!;
      const instant = Math.floor(START + (next() * RANGE) / 1000) * 1000;

      const forward = convert(instant, from, to);
      const back = convert(forward.instant, to, from);

      // `back.to` is the reading in the original zone, so that is what must match.
      expect(back.instant).toBe(instant);
      expect(back.to.hour).toBe(forward.from.hour);
      expect(back.to.minute).toBe(forward.from.minute);
      expect(back.to.day).toBe(forward.from.day);
      expect(forward.differenceMinutes).toBe(
        getOffsetMinutes(to, instant) - getOffsetMinutes(from, instant),
      );
    }
  });

  it('holds for wall-clock round trips outside transition windows', () => {
    const pairs: [string, string][] = [
      ['America/New_York', 'Asia/Tokyo'],
      ['Asia/Kathmandu', 'Pacific/Chatham'],
      ['Europe/London', 'Australia/Lord_Howe'],
      ['Etc/GMT+12', 'Pacific/Kiritimati'],
    ];
    for (const [from, to] of pairs) {
      const there = convertWallTime('2026-06-15', '14:00', from, to);
      const back = convert(there.instant, to, from);
      expect(back.to.hour).toBe(14);
      expect(back.to.minute).toBe(0);
    }
  });
});
