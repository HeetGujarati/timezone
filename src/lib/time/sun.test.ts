import { describe, expect, it } from 'vitest';
import { getSunTimes } from './sun.ts';

function localHhMm(instant: number, timeZone: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).format(new Date(instant));
}

/** Published times vary by a minute or two depending on the horizon model used. */
function expectWithinMinutes(actual: string, expected: string, tolerance = 3): void {
  const toMinutes = (value: string): number => {
    const [hours, minutes] = value.split(':').map(Number);
    return (hours ?? 0) * 60 + (minutes ?? 0);
  };
  expect(Math.abs(toMinutes(actual) - toMinutes(expected))).toBeLessThanOrEqual(tolerance);
}

describe('getSunTimes against published values', () => {
  it('matches London on the summer solstice', () => {
    const times = getSunTimes(Date.UTC(2026, 5, 21, 12), 'Europe/London', 51.5074, -0.1278);
    expectWithinMinutes(localHhMm(times.sunrise!, 'Europe/London'), '04:43');
    expectWithinMinutes(localHhMm(times.sunset!, 'Europe/London'), '21:21');
    expect(times.daylightMinutes).toBeGreaterThan(16 * 60);
  });

  it('matches London on the winter solstice', () => {
    const times = getSunTimes(Date.UTC(2026, 11, 21, 12), 'Europe/London', 51.5074, -0.1278);
    expectWithinMinutes(localHhMm(times.sunrise!, 'Europe/London'), '08:04');
    expectWithinMinutes(localHhMm(times.sunset!, 'Europe/London'), '15:53');
    expect(times.daylightMinutes).toBeLessThan(8 * 60);
  });

  it('gives an equinox day close to twelve hours', () => {
    const times = getSunTimes(Date.UTC(2026, 2, 20, 16), 'America/New_York', 40.7128, -74.006);
    expect(Math.abs(times.daylightMinutes - 720)).toBeLessThan(20);
  });

  it('barely varies at the equator', () => {
    const june = getSunTimes(Date.UTC(2026, 5, 21, 4), 'Asia/Singapore', 1.3521, 103.8198);
    const december = getSunTimes(Date.UTC(2026, 11, 21, 4), 'Asia/Singapore', 1.3521, 103.8198);
    expect(Math.abs(june.daylightMinutes - december.daylightMinutes)).toBeLessThan(20);
  });

  it('carries a 45-minute zone offset into the local reading', () => {
    const times = getSunTimes(Date.UTC(2026, 5, 21, 6), 'Asia/Kathmandu', 27.7172, 85.324);
    const sunrise = localHhMm(times.sunrise!, 'Asia/Kathmandu');
    expect(sunrise).toMatch(/^0[45]:/);
  });
});

describe('polar day and polar night', () => {
  it('reports polar day above the Arctic Circle in June', () => {
    const times = getSunTimes(Date.UTC(2026, 5, 21, 12), 'Europe/Oslo', 69.6496, 18.956);
    expect(times.polarDay).toBe(true);
    expect(times.sunrise).toBeNull();
    expect(times.sunset).toBeNull();
    expect(times.daylightMinutes).toBe(1440);
  });

  it('reports polar night above the Arctic Circle in December', () => {
    const times = getSunTimes(Date.UTC(2026, 11, 21, 12), 'Europe/Oslo', 69.6496, 18.956);
    expect(times.polarNight).toBe(true);
    expect(times.daylightMinutes).toBe(0);
  });

  it('inverts the two at the opposite pole', () => {
    const antarcticJune = getSunTimes(
      Date.UTC(2026, 5, 21, 12),
      'Antarctica/McMurdo',
      -77.85,
      166.67,
    );
    const antarcticDecember = getSunTimes(
      Date.UTC(2026, 11, 21, 12),
      'Antarctica/McMurdo',
      -77.85,
      166.67,
    );
    expect(antarcticJune.polarNight).toBe(true);
    expect(antarcticDecember.polarDay).toBe(true);
  });
});

describe('sunrise always precedes sunset', () => {
  it('holds across a spread of cities and dates', () => {
    const cities: [string, number, number][] = [
      ['America/New_York', 40.7128, -74.006],
      ['Asia/Tokyo', 35.6762, 139.6503],
      ['Australia/Sydney', -33.8688, 151.2093],
      ['America/Sao_Paulo', -23.5505, -46.6333],
      ['Africa/Cairo', 30.0444, 31.2357],
      ['Pacific/Auckland', -36.8485, 174.7633],
    ];
    for (const [zone, lat, lon] of cities) {
      for (const month of [0, 3, 6, 9]) {
        const times = getSunTimes(Date.UTC(2026, month, 15, 12), zone, lat, lon);
        expect(times.sunrise).not.toBeNull();
        expect(times.sunset!).toBeGreaterThan(times.sunrise!);
        expect(times.daylightMinutes).toBeGreaterThan(0);
        expect(times.daylightMinutes).toBeLessThan(1440);
      }
    }
  });
});
