import { describe, expect, it } from 'vitest';
import {
  formatOffset,
  formatOffsetShort,
  getOffsetMinutes,
  getOffsetSeconds,
  getWallParts,
  getZoneAbbreviation,
  isValidTimeZone,
  toZonedDateTime,
} from './offset.ts';

/** Mid-January and mid-July, so both hemispheres are sampled in and out of DST. */
const JANUARY = Date.UTC(2026, 0, 15, 12, 0, 0);
const JULY = Date.UTC(2026, 6, 15, 12, 0, 0);

describe('whole-hour offsets', () => {
  it.each([
    ['UTC', JANUARY, 0],
    ['Etc/UTC', JANUARY, 0],
    ['America/New_York', JANUARY, -300],
    ['America/New_York', JULY, -240],
    ['Europe/London', JANUARY, 0],
    ['Europe/London', JULY, 60],
    ['Asia/Tokyo', JANUARY, 540],
    ['Asia/Tokyo', JULY, 540],
  ])('%s at %d is %d minutes', (zone, instant, expected) => {
    expect(getOffsetMinutes(zone, instant)).toBe(expected);
  });
});

describe('half-hour and 45-minute offsets', () => {
  it('reads India at +05:30 year round', () => {
    expect(getOffsetMinutes('Asia/Kolkata', JANUARY)).toBe(330);
    expect(getOffsetMinutes('Asia/Kolkata', JULY)).toBe(330);
    expect(formatOffset(330)).toBe('+05:30');
  });

  it('reads Nepal at +05:45', () => {
    expect(getOffsetMinutes('Asia/Kathmandu', JANUARY)).toBe(345);
    expect(formatOffset(345)).toBe('+05:45');
  });

  it('reads the Chatham Islands at +12:45 standard and +13:45 daylight', () => {
    // Southern hemisphere: July is standard time, January is daylight time.
    expect(getOffsetMinutes('Pacific/Chatham', JULY)).toBe(765);
    expect(getOffsetMinutes('Pacific/Chatham', JANUARY)).toBe(825);
    expect(formatOffset(765)).toBe('+12:45');
  });

  it('reads Iran at +03:30 with no seasonal change', () => {
    expect(getOffsetMinutes('Asia/Tehran', JANUARY)).toBe(210);
    expect(getOffsetMinutes('Asia/Tehran', JULY)).toBe(210);
  });

  it('reads Newfoundland at -03:30 standard and -02:30 daylight', () => {
    expect(getOffsetMinutes('America/St_Johns', JANUARY)).toBe(-210);
    expect(getOffsetMinutes('America/St_Johns', JULY)).toBe(-150);
  });

  it('reads South Australia at +09:30 standard and +10:30 daylight', () => {
    expect(getOffsetMinutes('Australia/Adelaide', JULY)).toBe(570);
    expect(getOffsetMinutes('Australia/Adelaide', JANUARY)).toBe(630);
  });
});

describe('extreme offsets', () => {
  it('reads Kiritimati at +14, the furthest ahead any inhabited place gets', () => {
    expect(getOffsetMinutes('Pacific/Kiritimati', JANUARY)).toBe(840);
  });

  it('reads Etc/GMT+12 as -12:00, honouring the inverted POSIX sign', () => {
    expect(getOffsetMinutes('Etc/GMT+12', JANUARY)).toBe(-720);
    expect(getOffsetMinutes('Etc/GMT-14', JANUARY)).toBe(840);
  });

  it('spans 26 hours between the two extremes', () => {
    const ahead = getOffsetMinutes('Pacific/Kiritimati', JANUARY);
    const behind = getOffsetMinutes('Etc/GMT+12', JANUARY);
    expect((ahead - behind) / 60).toBe(26);
  });
});

describe('getWallParts', () => {
  it('reports a 24-hour clock with midnight as hour 0, never hour 24', () => {
    const midnight = Date.UTC(2026, 0, 15, 0, 0, 0);
    expect(getWallParts(midnight, 'UTC').hour).toBe(0);
    expect(getWallParts(midnight, 'UTC').day).toBe(15);
  });

  it('uses 1-based months, unlike Date', () => {
    expect(getWallParts(JANUARY, 'UTC').month).toBe(1);
    expect(getWallParts(JULY, 'UTC').month).toBe(7);
  });

  it('reports ISO weekdays with Monday as 1 and Sunday as 7', () => {
    // 2026-01-15 is a Thursday; 2026-01-18 is a Sunday.
    expect(getWallParts(Date.UTC(2026, 0, 15, 12), 'UTC').weekday).toBe(4);
    expect(getWallParts(Date.UTC(2026, 0, 18, 12), 'UTC').weekday).toBe(7);
  });

  it('rolls the calendar date forward across the date line', () => {
    const parts = getWallParts(Date.UTC(2026, 0, 15, 20, 0, 0), 'Pacific/Auckland');
    expect(parts.day).toBe(16);
  });

  it('ignores sub-second precision rather than leaking it into the offset', () => {
    expect(getOffsetSeconds('Asia/Kathmandu', JANUARY + 999)).toBe(345 * 60);
  });
});

describe('formatting', () => {
  it.each([
    [0, '+00:00', 'UTC+0'],
    [330, '+05:30', 'UTC+5:30'],
    [345, '+05:45', 'UTC+5:45'],
    [-300, '-05:00', 'UTC-5'],
    [-210, '-03:30', 'UTC-3:30'],
    [840, '+14:00', 'UTC+14'],
  ])('formats %d as %s and %s', (minutes, iso, short) => {
    expect(formatOffset(minutes)).toBe(iso);
    expect(formatOffsetShort(minutes)).toBe(short);
  });
});

describe('getZoneAbbreviation', () => {
  it('returns the real abbreviation for American zones', () => {
    expect(getZoneAbbreviation('America/New_York', JANUARY)).toBe('EST');
    expect(getZoneAbbreviation('America/New_York', JULY)).toBe('EDT');
    expect(getZoneAbbreviation('America/Los_Angeles', JANUARY)).toBe('PST');
  });

  it('reaches beyond en-US for zones it does not name', () => {
    // en-US calls these "GMT+1" and "GMT+10"; the locale cascade finds the letters.
    expect(getZoneAbbreviation('Europe/London', JULY)).toBe('BST');
    expect(getZoneAbbreviation('Europe/Berlin', JULY)).toBe('CEST');
    expect(getZoneAbbreviation('Australia/Sydney', JULY)).toBe('AEST');
    expect(getZoneAbbreviation('Pacific/Auckland', JULY)).toBe('NZST');
    expect(getZoneAbbreviation('Asia/Kolkata', JULY)).toBe('IST');
  });

  it('surfaces the IST collision rather than hiding it', () => {
    // Ireland and India both abbreviate to IST, three and a half hours apart.
    expect(getZoneAbbreviation('Europe/Dublin', JULY)).toBe('IST');
    expect(getZoneAbbreviation('Asia/Kolkata', JULY)).toBe('IST');
    expect(getOffsetMinutes('Europe/Dublin', JULY)).not.toBe(
      getOffsetMinutes('Asia/Kolkata', JULY),
    );
  });

  it('falls back to an offset form rather than inventing an abbreviation', () => {
    // No English locale has letters for these, and making some up would be worse.
    expect(getZoneAbbreviation('Asia/Kathmandu', JANUARY)).toBe('UTC+5:45');
    expect(getZoneAbbreviation('Asia/Tokyo', JANUARY)).toBe('UTC+9');
    expect(getZoneAbbreviation('America/Sao_Paulo', JANUARY)).toBe('UTC-3');
  });
});

describe('toZonedDateTime', () => {
  it('pairs the wall reading with the offset that produced it', () => {
    const zoned = toZonedDateTime(JANUARY, 'Asia/Kolkata');
    expect(zoned).toMatchObject({
      timeZone: 'Asia/Kolkata',
      year: 2026,
      month: 1,
      day: 15,
      hour: 17,
      minute: 30,
      offsetMinutes: 330,
    });
    expect(zoned.instant).toBe(JANUARY);
  });
});

describe('isValidTimeZone', () => {
  it('accepts real IANA identifiers and rejects invented ones', () => {
    expect(isValidTimeZone('America/New_York')).toBe(true);
    expect(isValidTimeZone('Asia/Kathmandu')).toBe(true);
    expect(isValidTimeZone('Mars/Olympus_Mons')).toBe(false);
    expect(isValidTimeZone('')).toBe(false);
  });
});
