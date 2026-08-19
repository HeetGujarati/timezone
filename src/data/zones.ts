import { isValidTimeZone } from '~/lib/time/offset.ts';

/**
 * Every IANA zone the runtime knows, grouped for a picker.
 *
 * Read from `Intl.supportedValuesOf('timeZone')` at build time rather than kept as a
 * list in this repository — a hand-maintained copy would drift from the tzdata the
 * engine actually computes with, which is the exact class of bug this site exists
 * to avoid.
 *
 * One correction is applied on top. This runtime's `supportedValuesOf` returns the
 * *legacy* identifier for eighteen zones — `Asia/Calcutta`, `Europe/Kiev`,
 * `Asia/Katmandu`, `Asia/Saigon` and friends — because ECMA-402 leaves the choice of
 * primary identifier to the implementation. Shipping those would mean labelling a
 * picker with city names that were renamed decades ago, and offering `Asia/Calcutta`
 * as the value a developer copies into their own code. So each is mapped to the
 * modern IANA name, which `Intl` accepts as input and resolves to the same zone. The
 * mapping is asserted in tests: a modern name that stopped resolving identically to
 * its legacy form fails the build.
 *
 * Option labels carry no offset. An offset baked into prerendered HTML goes stale
 * the moment the zone changes its clocks; the live offset is shown in the result
 * region instead, computed in the browser.
 */

/**
 * Legacy identifier as reported by this runtime -> the modern IANA name.
 * Only entries this runtime actually reports are listed; each is verified in tests.
 */
export const MODERN_ZONE_NAMES: Readonly<Record<string, string>> = {
  'Africa/Asmera': 'Africa/Asmara',
  'America/Buenos_Aires': 'America/Argentina/Buenos_Aires',
  'America/Catamarca': 'America/Argentina/Catamarca',
  'America/Cordoba': 'America/Argentina/Cordoba',
  'America/Godthab': 'America/Nuuk',
  'America/Indianapolis': 'America/Indiana/Indianapolis',
  'America/Jujuy': 'America/Argentina/Jujuy',
  'America/Louisville': 'America/Kentucky/Louisville',
  'America/Mendoza': 'America/Argentina/Mendoza',
  'Asia/Calcutta': 'Asia/Kolkata',
  'Asia/Katmandu': 'Asia/Kathmandu',
  'Asia/Rangoon': 'Asia/Yangon',
  'Asia/Saigon': 'Asia/Ho_Chi_Minh',
  'Atlantic/Faeroe': 'Atlantic/Faroe',
  'Europe/Kiev': 'Europe/Kyiv',
  'Pacific/Enderbury': 'Pacific/Kanton',
  'Pacific/Ponape': 'Pacific/Pohnpei',
  'Pacific/Truk': 'Pacific/Chuuk',
};

/**
 * Two identifiers name the same zone when they resolve to the same primary id.
 * `Asia/Kolkata` and `Asia/Calcutta` are the same place; string equality says they
 * are not, and every downstream comparison would be subtly wrong.
 */
export function canonicalZoneId(timeZone: string): string {
  try {
    return new Intl.DateTimeFormat('en', { timeZone }).resolvedOptions().timeZone;
  } catch {
    return timeZone;
  }
}

export function sameZone(a: string, b: string): boolean {
  return canonicalZoneId(a) === canonicalZoneId(b);
}

export type ZoneOption = {
  /** IANA identifier, e.g. "America/New_York". */
  id: string;
  /** Human label, e.g. "New York". */
  label: string;
  /** Region grouping, e.g. "America". */
  region: string;
};

export type ZoneGroup = {
  region: string;
  zones: ZoneOption[];
};

const REGION_LABELS: Record<string, string> = {
  Africa: 'Africa',
  America: 'Americas',
  Antarctica: 'Antarctica',
  Arctic: 'Arctic',
  Asia: 'Asia',
  Atlantic: 'Atlantic',
  Australia: 'Australia',
  Etc: 'UTC offsets',
  Europe: 'Europe',
  Indian: 'Indian Ocean',
  Pacific: 'Pacific',
};

function labelFor(id: string): string {
  const parts = id.split('/');
  const last = parts[parts.length - 1] ?? id;
  const middle = parts.length === 3 ? parts[1] : undefined;
  const name = last.replaceAll('_', ' ');
  return middle === undefined ? name : `${name}, ${middle.replaceAll('_', ' ')}`;
}

function buildZones(): ZoneOption[] {
  // `UTC` is valid input everywhere but is absent from supportedValuesOf on this
  // runtime, and it is the single most-wanted entry in the list.
  const ids = ['UTC', ...Intl.supportedValuesOf('timeZone')]
    .map((id) => MODERN_ZONE_NAMES[id] ?? id)
    .filter(isValidTimeZone);

  return [...new Set(ids)]
    .map((id) => {
      const region = id.includes('/') ? (id.split('/')[0] ?? 'Other') : 'Other';
      return { id, label: labelFor(id), region };
    })
    .sort((a, b) => a.id.localeCompare(b.id, 'en'));
}

export const ZONES: readonly ZoneOption[] = buildZones();

export const ZONE_IDS: ReadonlySet<string> = new Set(ZONES.map((zone) => zone.id));

/**
 * Grouped for `<optgroup>`. UTC leads the list because it is the single most
 * commonly wanted entry and hunting for it under "Etc" is a small daily cruelty.
 */
export function zoneGroups(): ZoneGroup[] {
  const byRegion = new Map<string, ZoneOption[]>();
  for (const zone of ZONES) {
    if (zone.id === 'UTC') continue;
    const list = byRegion.get(zone.region);
    if (list === undefined) byRegion.set(zone.region, [zone]);
    else list.push(zone);
  }

  const groups: ZoneGroup[] = [
    { region: 'UTC', zones: [{ id: 'UTC', label: 'UTC', region: 'UTC' }] },
  ];

  for (const [region, zones] of [...byRegion.entries()].sort((a, b) =>
    a[0].localeCompare(b[0], 'en'),
  )) {
    groups.push({
      region: REGION_LABELS[region] ?? region,
      zones: zones.sort((a, b) => a.label.localeCompare(b.label, 'en')),
    });
  }

  return groups;
}

/** Resolve any accepted spelling to the identifier this site displays and links with. */
export function toDisplayZone(value: string): string | null {
  if (ZONE_IDS.has(value)) return value;
  if (!isValidTimeZone(value)) return null;
  const canonical = canonicalZoneId(value);
  if (ZONE_IDS.has(canonical)) return canonical;
  const modern = MODERN_ZONE_NAMES[canonical];
  return modern !== undefined && ZONE_IDS.has(modern) ? modern : null;
}

/**
 * Guard for anything arriving from a URL parameter or localStorage.
 *
 * Accepts a legacy alias as well as the modern name — a bookmark saved as
 * `Asia/Calcutta` still works — by comparing canonical forms rather than strings.
 */
export function isKnownZone(value: unknown): value is string {
  if (typeof value !== 'string' || value.length === 0 || value.length > 64) return false;
  return toDisplayZone(value) !== null;
}
