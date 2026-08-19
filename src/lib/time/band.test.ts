import { describe, expect, it } from 'vitest';
import { buildBand, overlapColumns } from './band.ts';

const START = Date.UTC(2026, 0, 15, 0, 0, 0);

const ZONES = [
  { timeZone: 'Europe/London', label: 'London' },
  { timeZone: 'America/New_York', label: 'New York' },
];

describe('buildBand', () => {
  it('builds one row per zone, 24 columns wide', () => {
    const rows = buildBand(ZONES, START);
    expect(rows).toHaveLength(2);
    for (const row of rows) expect(row.cells).toHaveLength(24);
  });

  it('aligns every row on the same instants', () => {
    const rows = buildBand(ZONES, START);
    for (let column = 0; column < 24; column += 1) {
      const instants = rows.map((row) => row.cells[column]!.instant);
      expect(new Set(instants).size).toBe(1);
    }
  });

  it('keeps a 45-minute offset visible instead of rounding it away', () => {
    const rows = buildBand([{ timeZone: 'Asia/Kathmandu', label: 'Kathmandu' }], START);
    expect(rows[0]!.cells[0]!.minute).toBe(45);
  });

  it('marks the working day and its fringes', () => {
    const rows = buildBand([{ timeZone: 'UTC', label: 'UTC' }], START, 9, 18);
    const cells = rows[0]!.cells;
    expect(cells[9]!.state).toBe('working');
    expect(cells[17]!.state).toBe('working');
    expect(cells[18]!.state).toBe('fringe');
    expect(cells[8]!.state).toBe('fringe');
    expect(cells[3]!.state).toBe('asleep');
  });

  it('counts nine working hours in a nine-hour day', () => {
    const rows = buildBand([{ timeZone: 'UTC', label: 'UTC' }], START, 9, 18);
    expect(rows[0]!.workingHours).toBe(9);
  });

  it('reports the day delta against the reference zone', () => {
    const rows = buildBand(
      [
        { timeZone: 'America/New_York', label: 'New York' },
        { timeZone: 'Asia/Tokyo', label: 'Tokyo' },
      ],
      Date.UTC(2026, 0, 15, 20, 0, 0),
      9,
      18,
      'America/New_York',
    );
    const tokyo = rows[1]!;
    expect(tokyo.cells[0]!.dayDelta).toBe(1);
  });

  it('handles an overnight working day', () => {
    const rows = buildBand([{ timeZone: 'UTC', label: 'UTC' }], START, 22, 6);
    expect(rows[0]!.cells[23]!.state).toBe('working');
    expect(rows[0]!.cells[2]!.state).toBe('working');
    expect(rows[0]!.cells[12]!.state).toBe('asleep');
  });
});

describe('overlapColumns', () => {
  it('finds the four columns London and New York share', () => {
    const columns = overlapColumns(buildBand(ZONES, START));
    expect(columns).toEqual([14, 15, 16, 17]);
  });

  it('finds nothing for Los Angeles and Mumbai', () => {
    const rows = buildBand(
      [
        { timeZone: 'America/Los_Angeles', label: 'Los Angeles' },
        { timeZone: 'Asia/Kolkata', label: 'Mumbai' },
      ],
      START,
    );
    expect(overlapColumns(rows)).toEqual([]);
  });

  it('returns nothing for an empty band rather than every column', () => {
    expect(overlapColumns([])).toEqual([]);
  });
});
