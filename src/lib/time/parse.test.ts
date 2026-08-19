import { describe, expect, it } from 'vitest';
import { InvalidLocalTimeError, parseLocalTimeInZone } from './parse.ts';
import { getWallParts } from './offset.ts';

describe('the spring-forward gap', () => {
  it('shifts a time that never happened forward by the size of the gap', () => {
    // 2026-03-08 02:30 does not exist in New York: 01:59:59 is followed by 03:00:00.
    const result = parseLocalTimeInZone('2026-03-08', '02:30', 'America/New_York');
    expect(result.resolution).toBe('gap-shifted');
    expect(result.shiftedByMinutes).toBe(60);
    expect(result.zoned.hour).toBe(3);
    expect(result.zoned.minute).toBe(30);
  });

  it('applies the same policy to the European change-over', () => {
    const result = parseLocalTimeInZone('2026-03-29', '01:30', 'Europe/London');
    expect(result.resolution).toBe('gap-shifted');
    expect(result.zoned.hour).toBe(2);
    expect(result.zoned.minute).toBe(30);
  });

  it('reports a 30-minute shift on Lord Howe Island, not 60', () => {
    // Lord Howe jumps 02:00 -> 02:30, so 02:15 is the only vanished quarter-hour.
    const result = parseLocalTimeInZone('2026-10-04', '02:15', 'Australia/Lord_Howe');
    expect(result.resolution).toBe('gap-shifted');
    expect(result.shiftedByMinutes).toBe(30);
  });

  it('treats the first instant after the gap as an ordinary time', () => {
    const result = parseLocalTimeInZone('2026-03-08', '03:00', 'America/New_York');
    expect(result.resolution).toBe('exact');
    expect(result.zoned.hour).toBe(3);
  });

  it('treats the last instant before the gap as an ordinary time', () => {
    const result = parseLocalTimeInZone('2026-03-08', '01:59', 'America/New_York');
    expect(result.resolution).toBe('exact');
    expect(result.zoned.hour).toBe(1);
  });
});

describe('the fall-back repeat', () => {
  it('picks the first, earlier occurrence and reports the second', () => {
    // 2026-11-01 01:30 happens twice in New York: once on EDT, once on EST.
    const result = parseLocalTimeInZone('2026-11-01', '01:30', 'America/New_York');
    expect(result.resolution).toBe('ambiguous-earlier');
    expect(result.alternativeInstant).toBeDefined();
    expect(result.alternativeInstant! - result.instant).toBe(3_600_000);
    // The chosen instant is still on daylight time: UTC-4.
    expect(result.zoned.offsetMinutes).toBe(-240);
  });

  it('reads back as the requested wall time either way', () => {
    const result = parseLocalTimeInZone('2026-11-01', '01:30', 'America/New_York');
    for (const instant of [result.instant, result.alternativeInstant!]) {
      const parts = getWallParts(instant, 'America/New_York');
      expect(parts.hour).toBe(1);
      expect(parts.minute).toBe(30);
    }
  });

  it('handles the European fall-back the same way', () => {
    // The EU changes at 01:00 UTC, which is 03:00 in Berlin — so Berlin's repeated
    // hour is 02:00-02:59, not 01:00-01:59 as it is in London.
    const result = parseLocalTimeInZone('2026-10-25', '02:30', 'Europe/Berlin');
    expect(result.resolution).toBe('ambiguous-earlier');
    expect(result.zoned.offsetMinutes).toBe(120);

    const london = parseLocalTimeInZone('2026-10-25', '01:30', 'Europe/London');
    expect(london.resolution).toBe('ambiguous-earlier');
    expect(london.zoned.offsetMinutes).toBe(60);
  });

  it('leaves an hour outside the repeat unambiguous', () => {
    const result = parseLocalTimeInZone('2026-11-01', '03:30', 'America/New_York');
    expect(result.resolution).toBe('exact');
    expect(result.alternativeInstant).toBeUndefined();
  });
});

describe('ordinary readings', () => {
  it.each([
    ['2026-06-15', '09:00', 'America/New_York', -240],
    ['2026-01-15', '09:00', 'America/New_York', -300],
    ['2026-01-15', '09:00', 'Asia/Kathmandu', 345],
    ['2026-01-15', '09:00', 'Asia/Kolkata', 330],
    ['2026-01-15', '09:00', 'Pacific/Kiritimati', 840],
  ])('resolves %s %s in %s exactly', (date, time, zone, expectedOffset) => {
    const result = parseLocalTimeInZone(date, time, zone);
    expect(result.resolution).toBe('exact');
    expect(result.zoned.offsetMinutes).toBe(expectedOffset);
  });

  it('accepts seconds', () => {
    const result = parseLocalTimeInZone('2026-06-15', '09:30:45', 'UTC');
    expect(result.zoned.second).toBe(45);
  });

  it('accepts a single-digit hour', () => {
    expect(parseLocalTimeInZone('2026-06-15', '9:30', 'UTC').zoned.hour).toBe(9);
  });

  it('round-trips midnight without rolling the date', () => {
    const result = parseLocalTimeInZone('2026-06-15', '00:00', 'Asia/Tokyo');
    expect(result.zoned.day).toBe(15);
    expect(result.zoned.hour).toBe(0);
  });
});

describe('rejecting nonsense', () => {
  it.each([
    ['15/06/2026', '09:00', 'a date in the wrong format'],
    ['2026-6-15', '09:00', 'a date without zero padding'],
    ['2026-02-30', '09:00', 'a day that does not exist'],
    ['2026-13-01', '09:00', 'a month that does not exist'],
    ['2026-06-15', '25:00', 'an hour beyond the clock'],
    ['2026-06-15', '09:60', 'a minute beyond the clock'],
    ['2026-06-15', '9am', 'a time in the wrong format'],
  ])('rejects %s %s (%s)', (date, time) => {
    expect(() => parseLocalTimeInZone(date, time, 'UTC')).toThrow(InvalidLocalTimeError);
  });

  it('explains what went wrong rather than throwing a bare error', () => {
    expect(() => parseLocalTimeInZone('2026-02-30', '09:00', 'UTC')).toThrow(/not a real date/);
    expect(() => parseLocalTimeInZone('nope', '09:00', 'UTC')).toThrow(/Date must look like/);
  });

  it('accepts 29 February in a leap year and rejects it otherwise', () => {
    expect(() => parseLocalTimeInZone('2028-02-29', '09:00', 'UTC')).not.toThrow();
    expect(() => parseLocalTimeInZone('2026-02-29', '09:00', 'UTC')).toThrow(InvalidLocalTimeError);
  });
});
