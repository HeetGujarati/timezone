import { getOffsetMinutes, getWallParts } from './offset.ts';
import type { Instant } from './types.ts';

/**
 * Sunrise and sunset from latitude and longitude, by the NOAA solar position
 * algorithm. Pure arithmetic — no API call, no network, nothing to rate-limit or
 * go down. Accurate to roughly a minute for the latitudes any city sits at.
 */

const DEG = Math.PI / 180;
const DAY_MS = 86_400_000;

/** Standard refraction-corrected solar zenith for sunrise and sunset. */
const SUNRISE_ZENITH = 90.833;

export type SunTimes = {
  /** Null at latitudes and dates where the sun does not rise or set that day. */
  sunrise: Instant | null;
  sunset: Instant | null;
  /** True during polar day, when the sun stays up for the whole 24 hours. */
  polarDay: boolean;
  /** True during polar night, when the sun never clears the horizon. */
  polarNight: boolean;
  /** Minutes between sunrise and sunset, or 1440 / 0 at the poles. */
  daylightMinutes: number;
};

function toJulianDay(year: number, month: number, day: number): number {
  let y = year;
  let m = month;
  if (m <= 2) {
    y -= 1;
    m += 12;
  }
  const a = Math.floor(y / 100);
  const b = 2 - a + Math.floor(a / 4);
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + b - 1524.5;
}

function solarDeclination(julianCentury: number): number {
  const geomMeanLongSun =
    (280.46646 + julianCentury * (36000.76983 + julianCentury * 0.0003032)) % 360;
  const geomMeanAnomSun = 357.52911 + julianCentury * (35999.05029 - 0.0001537 * julianCentury);
  const sunEqOfCtr =
    Math.sin(geomMeanAnomSun * DEG) *
      (1.914602 - julianCentury * (0.004817 + 0.000014 * julianCentury)) +
    Math.sin(2 * geomMeanAnomSun * DEG) * (0.019993 - 0.000101 * julianCentury) +
    Math.sin(3 * geomMeanAnomSun * DEG) * 0.000289;

  const sunTrueLong = geomMeanLongSun + sunEqOfCtr;
  const sunAppLong =
    sunTrueLong - 0.00569 - 0.00478 * Math.sin((125.04 - 1934.136 * julianCentury) * DEG);

  const meanObliqEcliptic =
    23 +
    (26 +
      (21.448 - julianCentury * (46.815 + julianCentury * (0.00059 - julianCentury * 0.001813))) /
        60) /
      60;
  const obliqCorr =
    meanObliqEcliptic + 0.00256 * Math.cos((125.04 - 1934.136 * julianCentury) * DEG);

  return Math.asin(Math.sin(obliqCorr * DEG) * Math.sin(sunAppLong * DEG)) / DEG;
}

function equationOfTime(julianCentury: number): number {
  const geomMeanLongSun =
    (280.46646 + julianCentury * (36000.76983 + julianCentury * 0.0003032)) % 360;
  const geomMeanAnomSun = 357.52911 + julianCentury * (35999.05029 - 0.0001537 * julianCentury);
  const eccentEarthOrbit =
    0.016708634 - julianCentury * (0.000042037 + 0.0000001267 * julianCentury);

  const meanObliqEcliptic =
    23 +
    (26 +
      (21.448 - julianCentury * (46.815 + julianCentury * (0.00059 - julianCentury * 0.001813))) /
        60) /
      60;
  const obliqCorr =
    meanObliqEcliptic + 0.00256 * Math.cos((125.04 - 1934.136 * julianCentury) * DEG);
  const varY = Math.tan((obliqCorr / 2) * DEG) ** 2;

  const eqTime =
    (4 *
      (varY * Math.sin(2 * geomMeanLongSun * DEG) -
        2 * eccentEarthOrbit * Math.sin(geomMeanAnomSun * DEG) +
        4 *
          eccentEarthOrbit *
          varY *
          Math.sin(geomMeanAnomSun * DEG) *
          Math.cos(2 * geomMeanLongSun * DEG) -
        0.5 * varY * varY * Math.sin(4 * geomMeanLongSun * DEG) -
        1.25 * eccentEarthOrbit * eccentEarthOrbit * Math.sin(2 * geomMeanAnomSun * DEG))) /
    DEG;

  return eqTime;
}

/**
 * Sunrise and sunset for the local calendar day containing `instant` in `timeZone`.
 *
 * The zone matters twice: it decides which calendar day is meant, and it converts
 * the result back into a timestamp. Latitude and longitude decide everything else.
 */
export function getSunTimes(
  instant: Instant,
  timeZone: string,
  latitude: number,
  longitude: number,
): SunTimes {
  const { year, month, day } = getWallParts(instant, timeZone);
  const julianDay = toJulianDay(year, month, day);
  const julianCentury = (julianDay - 2451545) / 36525;

  const declination = solarDeclination(julianCentury);
  const eqTime = equationOfTime(julianCentury);

  const latRad = latitude * DEG;
  const declRad = declination * DEG;

  const cosHourAngle =
    (Math.cos(SUNRISE_ZENITH * DEG) - Math.sin(latRad) * Math.sin(declRad)) /
    (Math.cos(latRad) * Math.cos(declRad));

  if (cosHourAngle > 1) {
    return { sunrise: null, sunset: null, polarDay: false, polarNight: true, daylightMinutes: 0 };
  }
  if (cosHourAngle < -1) {
    return {
      sunrise: null,
      sunset: null,
      polarDay: true,
      polarNight: false,
      daylightMinutes: 1440,
    };
  }

  const hourAngle = Math.acos(cosHourAngle) / DEG;

  // Minutes past local midnight, in the zone's own offset.
  const solarNoonMinutes = 720 - 4 * longitude - eqTime;
  const offsetMinutes = getOffsetMinutes(timeZone, instant);
  const sunriseMinutes = solarNoonMinutes - hourAngle * 4 + offsetMinutes;
  const sunsetMinutes = solarNoonMinutes + hourAngle * 4 + offsetMinutes;

  const localMidnightUtc = Date.UTC(year, month - 1, day) - offsetMinutes * 60_000;

  return {
    sunrise: localMidnightUtc + Math.round(sunriseMinutes) * 60_000,
    sunset: localMidnightUtc + Math.round(sunsetMinutes) * 60_000,
    polarDay: false,
    polarNight: false,
    daylightMinutes: Math.round(sunsetMinutes - sunriseMinutes),
  };
}

/** Length of the local day, formatted as "9h 42m". */
export function formatDaylight(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  return `${hours}h ${minutes % 60}m`;
}

export { DAY_MS };
