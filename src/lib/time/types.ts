/**
 * An instant is always epoch milliseconds (UTC). Nothing in this engine stores a
 * "local time" as a number — a wall-clock reading only means something paired with
 * the zone it was read in, so those travel together as a ZonedDateTime.
 */
export type Instant = number;

export type ZonedDateTime = {
  /** Epoch milliseconds. The single source of truth for when this is. */
  instant: Instant;
  timeZone: string;
  year: number;
  /** 1–12, not the 0-based month JavaScript's Date uses. */
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  /** 1 = Monday … 7 = Sunday (ISO-8601). */
  weekday: number;
  /** Minutes east of UTC. Kolkata is +330, New York in winter is -300. */
  offsetMinutes: number;
};

export type DstDirection = 'forward' | 'backward';

export type DstTransition = {
  /** The exact instant the offset changes, resolved to the second. */
  instant: Instant;
  offsetBeforeMinutes: number;
  offsetAfterMinutes: number;
  /** Positive when clocks move forward. Usually 60, but 30 on Lord Howe Island. */
  deltaMinutes: number;
  direction: DstDirection;
  /** The last wall-clock second before the change, in local time. */
  localBefore: ZonedDateTime;
  /** The first wall-clock second after the change, in local time. */
  localAfter: ZonedDateTime;
};

/**
 * How a wall-clock reading was resolved to an instant.
 *
 * - `exact` — the local time existed once, unambiguously.
 * - `gap-shifted` — the local time never happened (clocks jumped forward over it),
 *   so it was shifted forward by the size of the gap.
 * - `ambiguous-earlier` — the local time happened twice (clocks fell back), and the
 *   first, earlier occurrence was chosen.
 */
export type ResolutionKind = 'exact' | 'gap-shifted' | 'ambiguous-earlier';

export type ResolvedLocalTime = {
  instant: Instant;
  resolution: ResolutionKind;
  /** For `gap-shifted`, how far forward the reading was moved. Otherwise 0. */
  shiftedByMinutes: number;
  /** For `ambiguous-earlier`, the instant of the second occurrence. */
  alternativeInstant?: Instant;
  zoned: ZonedDateTime;
};

export type OverlapWindow = {
  start: Instant;
  end: Instant;
  durationMinutes: number;
};
