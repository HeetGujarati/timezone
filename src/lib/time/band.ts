import { toZonedDateTime } from './offset.ts';
import type { Instant } from './types.ts';

/**
 * The 24-hour band.
 *
 * One pure function builds the data for both renderers: Astro renders it into the
 * prerendered page, and the browser island rebuilds it with `createElement` when
 * zones change. Sharing the computation rather than the markup means the two can
 * never disagree about which hours are working hours.
 */

export type BandState = 'working' | 'fringe' | 'asleep';

export type BandCell = {
  /** The instant this column represents, identical across every row. */
  instant: Instant;
  /** Local wall-clock hour in this row's zone, 0-23. */
  hour: number;
  /** Local minutes, non-zero for the half-hour and 45-minute zones. */
  minute: number;
  state: BandState;
  /** Calendar days ahead of the reference zone: -1, 0 or +1. */
  dayDelta: number;
};

export type BandRow = {
  timeZone: string;
  label: string;
  offsetMinutes: number;
  cells: BandCell[];
  /** Hours in this row that fall inside working hours. Used for the summary line. */
  workingHours: number;
};

const HOUR_MS = 3_600_000;
const DAY_MS = 86_400_000;

function stateFor(hour: number, startHour: number, endHour: number): BandState {
  const inside = startHour <= endHour ? hour >= startHour && hour < endHour : hour >= startHour || hour < endHour;
  if (inside) return 'working';

  // The hour either side of the working day: reachable, but you are asking a favour.
  const fringeStart = (startHour + 23) % 24;
  const fringeEnd = endHour % 24;
  return hour === fringeStart || hour === fringeEnd ? 'fringe' : 'asleep';
}

function ordinalDay(year: number, month: number, day: number): number {
  return Date.UTC(year, month - 1, day) / DAY_MS;
}

/**
 * Build one row per zone, 24 columns wide, starting at `startInstant`.
 *
 * Columns are instants, not hours, so every row is genuinely aligned — a zone on a
 * 45-minute offset shows 09:45 in the column where another shows 09:00, which is
 * the truth a naive hour-shifted grid hides.
 */
export function buildBand(
  zones: readonly { timeZone: string; label: string }[],
  startInstant: Instant,
  workStartHour = 9,
  workEndHour = 18,
  referenceZone?: string,
): BandRow[] {
  const reference = referenceZone ?? zones[0]?.timeZone ?? 'UTC';

  return zones.map((zone) => {
    const cells: BandCell[] = [];
    let workingHours = 0;

    for (let column = 0; column < 24; column += 1) {
      const instant = startInstant + column * HOUR_MS;
      const local = toZonedDateTime(instant, zone.timeZone);
      const referenceLocal = toZonedDateTime(instant, reference);
      const state = stateFor(local.hour, workStartHour, workEndHour);
      if (state === 'working') workingHours += 1;

      cells.push({
        instant,
        hour: local.hour,
        minute: local.minute,
        state,
        dayDelta:
          ordinalDay(local.year, local.month, local.day) -
          ordinalDay(referenceLocal.year, referenceLocal.month, referenceLocal.day),
      });
    }

    const first = cells[0];
    return {
      timeZone: zone.timeZone,
      label: zone.label,
      offsetMinutes: toZonedDateTime(first?.instant ?? startInstant, zone.timeZone).offsetMinutes,
      cells,
      workingHours,
    };
  });
}

/** Columns where every row is inside working hours — the answer the page exists for. */
export function overlapColumns(rows: readonly BandRow[]): number[] {
  if (rows.length === 0) return [];
  const columns: number[] = [];
  for (let column = 0; column < 24; column += 1) {
    if (rows.every((row) => row.cells[column]?.state === 'working')) columns.push(column);
  }
  return columns;
}
