/**
 * The time engine.
 *
 * Everything here derives from the runtime's IANA time zone database through the
 * `Intl` API. There is no offset table, no DST rule list and no date library in
 * this directory — when the tzdata ships a change, a rebuild picks it up and the
 * site is correct again without a code change.
 */
export {
  formatOffset,
  formatOffsetShort,
  getOffsetMinutes,
  getOffsetSeconds,
  getWallParts,
  getZoneAbbreviation,
  isValidTimeZone,
  toZonedDateTime,
} from './offset.ts';

export {
  clearTransitionCache,
  findDstTransitions,
  findNextTransition,
  getDaylightOffsetMinutes,
  getStandardOffsetMinutes,
  isDstActive,
  observesDst,
} from './dst.ts';

export { InvalidLocalTimeError, parseLocalTimeInZone } from './parse.ts';

export {
  buildHourTable,
  convert,
  convertWallTime,
  describeDifference,
  getZoneDifferenceMinutes,
  type ConversionResult,
  type HourTableRow,
} from './convert.ts';

export {
  bestOverlapWindow,
  getWorkingHoursOverlap,
  nearestWorkableWindows,
  type OverlapResult,
  type ZoneWorkingHours,
} from './overlap.ts';

export { getSunTimes, type SunTimes } from './sun.ts';

export type {
  DstDirection,
  DstTransition,
  Instant,
  OverlapWindow,
  ResolutionKind,
  ResolvedLocalTime,
  ZonedDateTime,
} from './types.ts';
