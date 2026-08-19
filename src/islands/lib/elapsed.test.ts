import { describe, expect, it } from 'vitest';
import { countdownParts, describeElapsed } from './elapsed.ts';
import { parseLocalTimeInZone } from '~/lib/time/parse.ts';

describe('describeElapsed', () => {
  it('breaks a span into days, hours and minutes', () => {
    const start = Date.UTC(2026, 0, 1, 0, 0, 0);
    const end = Date.UTC(2026, 0, 3, 3, 15, 0);
    expect(describeElapsed(start, end).headline).toBe('2 days, 3 hours, 15 minutes');
  });

  it('falls back to seconds for a span under a minute', () => {
    expect(describeElapsed(0, 42_000).headline).toBe('42 seconds');
  });

  it('uses the singular where it should', () => {
    expect(describeElapsed(0, 86_400_000 + 3_600_000 + 60_000).headline).toBe(
      '1 day, 1 hour, 1 minute',
    );
  });

  it('reports a backwards span as negative without flipping the numbers', () => {
    const result = describeElapsed(Date.UTC(2026, 0, 3), Date.UTC(2026, 0, 1));
    expect(result.negative).toBe(true);
    expect(result.totalDays).toBe(2);
  });

  it('counts a spring-forward day as 23 hours, not 24', () => {
    // 8 March 2026 in New York loses an hour.
    const start = parseLocalTimeInZone('2026-03-08', '00:00', 'America/New_York').instant;
    const end = parseLocalTimeInZone('2026-03-09', '00:00', 'America/New_York').instant;
    expect(describeElapsed(start, end).totalHours).toBe(23);
  });

  it('counts a fall-back day as 25 hours', () => {
    const start = parseLocalTimeInZone('2026-11-01', '00:00', 'America/New_York').instant;
    const end = parseLocalTimeInZone('2026-11-02', '00:00', 'America/New_York').instant;
    expect(describeElapsed(start, end).totalHours).toBe(25);
  });

  it('measures across zones from the instants, not the wall clocks', () => {
    const start = parseLocalTimeInZone('2026-06-15', '09:00', 'America/New_York').instant;
    const end = parseLocalTimeInZone('2026-06-15', '09:00', 'Europe/London').instant;
    // London's 09:00 happened 5 hours before New York's that day.
    expect(describeElapsed(start, end).negative).toBe(true);
    expect(describeElapsed(start, end).totalHours).toBe(5);
  });
});

describe('countdownParts', () => {
  it('breaks the remaining time down', () => {
    const now = Date.UTC(2026, 0, 1, 0, 0, 0);
    const target = Date.UTC(2026, 0, 2, 3, 4, 5);
    expect(countdownParts(now, target)).toEqual({
      finished: false,
      days: 1,
      hours: 3,
      minutes: 4,
      seconds: 5,
    });
  });

  it('reports finished rather than counting up past the target', () => {
    expect(countdownParts(1000, 0).finished).toBe(true);
    expect(countdownParts(0, 0).finished).toBe(true);
  });
});
