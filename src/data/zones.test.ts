import { describe, expect, it } from 'vitest';
import {
  MODERN_ZONE_NAMES,
  ZONES,
  ZONE_IDS,
  canonicalZoneId,
  isKnownZone,
  sameZone,
  toDisplayZone,
  zoneGroups,
} from './zones.ts';

describe('the zone dataset', () => {
  it('is read from the runtime rather than hardcoded', () => {
    expect(ZONES.length).toBeGreaterThan(300);
    expect(ZONES.length).toBe(new Set(ZONES.map((z) => z.id)).size);
  });

  it('labels a zone by its city, not its identifier', () => {
    const newYork = ZONES.find((z) => z.id === 'America/New_York');
    expect(newYork?.label).toBe('New York');
  });

  it('disambiguates three-segment identifiers', () => {
    const indianapolis = ZONES.find((z) => z.id === 'America/Indiana/Indianapolis');
    expect(indianapolis?.label).toBe('Indianapolis, Indiana');
  });

  it('reaches every zone the runtime reports', () => {
    expect(ZONES.length).toBe(Intl.supportedValuesOf('timeZone').length + 1);
  });

  it('puts UTC first rather than burying it under Etc', () => {
    const groups = zoneGroups();
    expect(groups[0]?.region).toBe('UTC');
    expect(groups[0]?.zones[0]?.id).toBe('UTC');
  });

  it('lists every zone exactly once across all groups', () => {
    const grouped = zoneGroups().flatMap((group) => group.zones.map((zone) => zone.id));
    expect(new Set(grouped).size).toBe(grouped.length);
    expect(grouped).toHaveLength(ZONES.length);
  });

  it('sorts zones alphabetically inside each group', () => {
    for (const group of zoneGroups()) {
      const labels = group.zones.map((zone) => zone.label);
      expect(labels).toEqual([...labels].sort((a, b) => a.localeCompare(b, 'en')));
    }
  });

  it('guards untrusted input', () => {
    expect(isKnownZone('America/New_York')).toBe(true);
    expect(isKnownZone('Mars/Base')).toBe(false);
    expect(isKnownZone(null)).toBe(false);
    expect(isKnownZone(42)).toBe(false);
    expect(isKnownZone('x'.repeat(200))).toBe(false);
    expect(ZONE_IDS.has('Asia/Kathmandu')).toBe(true);
  });

  it('accepts a legacy alias a reader may have bookmarked', () => {
    expect(isKnownZone('Asia/Calcutta')).toBe(true);
    expect(toDisplayZone('Asia/Calcutta')).toBe('Asia/Kolkata');
    expect(toDisplayZone('Europe/Kiev')).toBe('Europe/Kyiv');
    expect(toDisplayZone('Mars/Base')).toBeNull();
  });
});

describe('modern zone naming', () => {
  it('ships the modern name, never the renamed-decades-ago one', () => {
    const ids = new Set(ZONES.map((zone) => zone.id));
    for (const [legacy, modern] of Object.entries(MODERN_ZONE_NAMES)) {
      expect(ids.has(modern), `${modern} missing`).toBe(true);
      expect(ids.has(legacy), `${legacy} should not be offered`).toBe(false);
    }
  });

  it('every mapped modern name resolves to the same zone as its legacy form', () => {
    for (const [legacy, modern] of Object.entries(MODERN_ZONE_NAMES)) {
      expect(sameZone(legacy, modern), `${legacy} != ${modern}`).toBe(true);
      expect(canonicalZoneId(modern)).toBe(canonicalZoneId(legacy));
    }
  });

  it('offers Kolkata and Kyiv rather than Calcutta and Kiev', () => {
    const labels = ZONES.map((zone) => zone.label);
    expect(labels).toContain('Kolkata');
    expect(labels).toContain('Kyiv');
    expect(labels).not.toContain('Calcutta');
    expect(labels).not.toContain('Kiev');
  });

  it('includes UTC even though supportedValuesOf omits it', () => {
    expect(ZONE_IDS.has('UTC')).toBe(true);
  });
});
