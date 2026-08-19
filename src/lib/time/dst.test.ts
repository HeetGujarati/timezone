import { describe, expect, it } from 'vitest';
import {
  findDstTransitions,
  findNextTransition,
  getDaylightOffsetMinutes,
  getStandardOffsetMinutes,
  isDstActive,
  observesDst,
} from './dst.ts';

const YEAR = 2026;

function isoDate(instant: number): string {
  return new Date(instant).toISOString();
}

describe('northern hemisphere transitions', () => {
  it('finds both US transitions on the right dates, to the second', () => {
    const transitions = findDstTransitions('America/New_York', YEAR);
    expect(transitions).toHaveLength(2);
    // Second Sunday in March, 02:00 local; first Sunday in November, 02:00 local.
    expect(isoDate(transitions[0]!.instant)).toBe('2026-03-08T07:00:00.000Z');
    expect(isoDate(transitions[1]!.instant)).toBe('2026-11-01T06:00:00.000Z');
    expect(transitions[0]!.direction).toBe('forward');
    expect(transitions[1]!.direction).toBe('backward');
  });

  it('finds both EU transitions at 01:00 UTC, the same instant across the union', () => {
    const london = findDstTransitions('Europe/London', YEAR);
    const berlin = findDstTransitions('Europe/Berlin', YEAR);
    expect(london[0]!.instant).toBe(berlin[0]!.instant);
    expect(isoDate(london[0]!.instant)).toBe('2026-03-29T01:00:00.000Z');
    expect(isoDate(london[1]!.instant)).toBe('2026-10-25T01:00:00.000Z');
  });

  it('reports the local wall time either side of a spring-forward', () => {
    const [spring] = findDstTransitions('America/New_York', YEAR);
    expect(spring!.localBefore.hour).toBe(1);
    expect(spring!.localBefore.minute).toBe(59);
    expect(spring!.localAfter.hour).toBe(3);
    expect(spring!.localAfter.minute).toBe(0);
  });
});

describe('southern hemisphere runs opposite to the north', () => {
  it('moves Sydney backward in April and forward in October', () => {
    const transitions = findDstTransitions('Australia/Sydney', YEAR);
    expect(transitions).toHaveLength(2);
    expect(transitions[0]!.direction).toBe('backward');
    expect(transitions[0]!.localAfter.month).toBe(4);
    expect(transitions[1]!.direction).toBe('forward');
    expect(transitions[1]!.localAfter.month).toBe(10);
  });

  it('moves Auckland backward in April and forward in September', () => {
    const transitions = findDstTransitions('Pacific/Auckland', YEAR);
    expect(transitions[0]!.direction).toBe('backward');
    expect(transitions[1]!.direction).toBe('forward');
    expect(transitions[1]!.localAfter.month).toBe(9);
  });

  it('has Sydney on daylight time in January and standard time in July', () => {
    expect(isDstActive('Australia/Sydney', Date.UTC(2026, 0, 15))).toBe(true);
    expect(isDstActive('Australia/Sydney', Date.UTC(2026, 6, 15))).toBe(false);
    // Exactly inverted from New York, which is the whole point.
    expect(isDstActive('America/New_York', Date.UTC(2026, 0, 15))).toBe(false);
    expect(isDstActive('America/New_York', Date.UTC(2026, 6, 15))).toBe(true);
  });
});

describe('Lord Howe Island shifts by 30 minutes, not 60', () => {
  it('reports a half-hour delta in both directions', () => {
    const transitions = findDstTransitions('Australia/Lord_Howe', YEAR);
    expect(transitions).toHaveLength(2);
    expect(Math.abs(transitions[0]!.deltaMinutes)).toBe(30);
    expect(Math.abs(transitions[1]!.deltaMinutes)).toBe(30);
  });

  it('sits at +10:30 standard and +11:00 daylight', () => {
    expect(getStandardOffsetMinutes('Australia/Lord_Howe', YEAR)).toBe(630);
    expect(getDaylightOffsetMinutes('Australia/Lord_Howe', YEAR)).toBe(660);
  });
});

describe('zones that abolished daylight saving have no transitions', () => {
  it.each([
    'Asia/Tehran',
    'America/Mexico_City',
    'America/Sao_Paulo',
    'Asia/Kolkata',
    'Asia/Tokyo',
  ])('%s does not change its clocks in 2026', (zone) => {
    expect(findDstTransitions(zone, YEAR)).toEqual([]);
    expect(observesDst(zone, YEAR)).toBe(false);
    expect(isDstActive(zone, Date.UTC(2026, 0, 15))).toBe(false);
    expect(isDstActive(zone, Date.UTC(2026, 6, 15))).toBe(false);
  });

  it('still reports a standard offset for a zone with no transitions', () => {
    expect(getStandardOffsetMinutes('Asia/Kolkata', YEAR)).toBe(330);
    expect(getDaylightOffsetMinutes('Asia/Kolkata', YEAR)).toBeNull();
  });

  it('reports Brazil as unchanging, five years after it abolished DST', () => {
    expect(findDstTransitions('America/Sao_Paulo', YEAR)).toEqual([]);
    expect(getStandardOffsetMinutes('America/Sao_Paulo', YEAR)).toBe(-180);
  });
});

describe('findNextTransition', () => {
  it('looks into the following year from a December instant', () => {
    const next = findNextTransition('America/New_York', Date.UTC(2026, 11, 25));
    expect(next).not.toBeNull();
    expect(next!.instant).toBeGreaterThan(Date.UTC(2027, 0, 1));
    expect(next!.direction).toBe('forward');
  });

  it('returns null for a zone that never changes', () => {
    expect(findNextTransition('Asia/Kolkata', Date.UTC(2026, 0, 1))).toBeNull();
  });

  it('never returns a transition in the past', () => {
    const now = Date.UTC(2026, 5, 1);
    const next = findNextTransition('Europe/London', now);
    expect(next!.instant).toBeGreaterThan(now);
  });
});

describe('transition integrity', () => {
  it('every transition actually changes the offset, in the direction reported', () => {
    const zones = [
      'America/New_York',
      'Europe/London',
      'Australia/Sydney',
      'Pacific/Auckland',
      'Australia/Lord_Howe',
      'Pacific/Chatham',
      'America/Santiago',
      'Asia/Jerusalem',
    ];
    for (const zone of zones) {
      for (const transition of findDstTransitions(zone, YEAR)) {
        expect(transition.offsetAfterMinutes).not.toBe(transition.offsetBeforeMinutes);
        expect(transition.deltaMinutes).toBe(
          transition.offsetAfterMinutes - transition.offsetBeforeMinutes,
        );
        expect(transition.direction).toBe(transition.deltaMinutes > 0 ? 'forward' : 'backward');
        // Resolved to the second: the instant lands exactly on a second boundary.
        expect(transition.instant % 1000).toBe(0);
      }
    }
  });

  it('places every transition inside the year it is reported for', () => {
    for (const zone of ['America/New_York', 'Europe/Berlin', 'Australia/Sydney']) {
      for (const transition of findDstTransitions(zone, YEAR)) {
        expect(transition.localAfter.year).toBe(YEAR);
      }
    }
  });
});
