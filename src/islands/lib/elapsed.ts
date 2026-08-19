/**
 * Elapsed-time arithmetic, kept pure so it can be tested without a DOM.
 *
 * Everything is derived from the difference between two instants, never from
 * subtracting wall-clock readings — across a daylight-saving boundary a calendar
 * day is 23 or 25 hours, and only the instant difference knows that.
 */

export type Elapsed = {
  negative: boolean;
  totalSeconds: number;
  totalMinutes: number;
  totalHours: number;
  totalDays: number;
  /** Broken down: "2 days, 3 hours, 15 minutes". */
  headline: string;
};

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

function plural(value: number, unit: string): string {
  return `${value} ${unit}${value === 1 ? '' : 's'}`;
}

export function describeElapsed(startInstant: number, endInstant: number): Elapsed {
  const signed = endInstant - startInstant;
  const magnitude = Math.abs(signed);

  const days = Math.floor(magnitude / DAY);
  const hours = Math.floor((magnitude % DAY) / HOUR);
  const minutes = Math.floor((magnitude % HOUR) / MINUTE);
  const seconds = Math.floor((magnitude % MINUTE) / SECOND);

  const parts: string[] = [];
  if (days > 0) parts.push(plural(days, 'day'));
  if (hours > 0) parts.push(plural(hours, 'hour'));
  if (minutes > 0) parts.push(plural(minutes, 'minute'));
  if (parts.length === 0) parts.push(plural(seconds, 'second'));

  return {
    negative: signed < 0,
    totalSeconds: Math.floor(magnitude / SECOND),
    totalMinutes: Math.floor(magnitude / MINUTE),
    totalHours: Math.floor(magnitude / HOUR),
    totalDays: Math.floor(magnitude / DAY),
    headline: parts.join(', '),
  };
}

/** Countdown parts for a target instant, clamped at zero once it has passed. */
export function countdownParts(
  nowInstant: number,
  targetInstant: number,
): {
  finished: boolean;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
} {
  const remaining = targetInstant - nowInstant;
  if (remaining <= 0) return { finished: true, days: 0, hours: 0, minutes: 0, seconds: 0 };

  return {
    finished: false,
    days: Math.floor(remaining / DAY),
    hours: Math.floor((remaining % DAY) / HOUR),
    minutes: Math.floor((remaining % HOUR) / MINUTE),
    seconds: Math.floor((remaining % MINUTE) / SECOND),
  };
}
