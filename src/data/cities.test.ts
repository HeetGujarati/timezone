import { describe, expect, it } from 'vitest';
import { CITIES, TIER_A, TIER_B, TOP_HUBS, cityBySlug, citiesByContinent, cityZones } from './cities.ts';
import { isValidTimeZone, getOffsetMinutes } from '~/lib/time/offset.ts';
import { canonicalZoneId } from './zones.ts';

describe('the city dataset', () => {
  it('holds exactly 80 cities in the two tiers the page plan assumes', () => {
    expect(CITIES).toHaveLength(80);
    expect(TIER_A).toHaveLength(24);
    expect(TIER_B).toHaveLength(56);
  });

  it('has unique slugs', () => {
    const slugs = CITIES.map((city) => city.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('uses URL-safe ASCII slugs even where the name is not ASCII', () => {
    for (const city of CITIES) {
      expect(city.slug, city.name).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    }
    expect(cityBySlug('sao-paulo')?.name).toBe('São Paulo');
    expect(cityBySlug('bogota')?.name).toBe('Bogotá');
  });

  it('names a time zone the runtime can actually resolve', () => {
    for (const city of CITIES) {
      expect(isValidTimeZone(city.timeZone), `${city.name}: ${city.timeZone}`).toBe(true);
    }
  });

  it('uses modern zone names, not the ones renamed decades ago', () => {
    const zones = CITIES.map((city) => city.timeZone);
    expect(zones).toContain('Asia/Kolkata');
    expect(zones).toContain('Europe/Kyiv');
    expect(zones).toContain('Asia/Ho_Chi_Minh');
    expect(zones).not.toContain('Asia/Calcutta');
    expect(zones).not.toContain('Europe/Kiev');
  });

  it('places every city inside real coordinates', () => {
    for (const city of CITIES) {
      expect(Math.abs(city.lat), city.name).toBeLessThanOrEqual(90);
      expect(Math.abs(city.lon), city.name).toBeLessThanOrEqual(180);
      expect(city.lat === 0 && city.lon === 0, `${city.name} is at null island`).toBe(false);
    }
  });

  it('puts southern-hemisphere cities south of the equator', () => {
    for (const slug of ['sydney', 'sao-paulo', 'johannesburg', 'auckland', 'santiago', 'lima']) {
      expect(cityBySlug(slug)!.lat, slug).toBeLessThan(0);
    }
  });

  it('uses valid ISO 3166-1 alpha-2 country codes', () => {
    const displayNames = new Intl.DisplayNames(['en'], { type: 'region' });
    for (const city of CITIES) {
      expect(city.countryCode).toMatch(/^[A-Z]{2}$/);
      expect(displayNames.of(city.countryCode), city.countryCode).toBeTruthy();
    }
  });

  it('covers the offsets that break naive converters', () => {
    const instant = Date.UTC(2026, 0, 15, 12);
    const offsets = new Set(CITIES.map((city) => getOffsetMinutes(city.timeZone, instant)));
    // Half-hour, 45-minute, and the far east and west of the map.
    expect([...offsets].some((offset) => offset % 60 === 30)).toBe(true);
    expect([...offsets].some((offset) => offset % 60 === 45)).toBe(true);
    expect(Math.max(...offsets)).toBeGreaterThanOrEqual(13 * 60);
    expect(Math.min(...offsets)).toBeLessThanOrEqual(-8 * 60);
  });

  it('includes the six cities the brief names explicitly', () => {
    for (const slug of ['kathmandu', 'kolkata', 'tehran', 'adelaide', 'chatham-islands', 'st-johns']) {
      expect(cityBySlug(slug), slug).toBeDefined();
    }
  });

  it('includes Lord Howe Island, the only 30-minute daylight shift on earth', () => {
    expect(cityBySlug('lord-howe-island')?.timeZone).toBe('Australia/Lord_Howe');
  });

  it('spans every inhabited continent', () => {
    const continents = citiesByContinent().map((group) => group.continent);
    for (const continent of ['Africa', 'Americas', 'Asia', 'Australia', 'Europe', 'Pacific']) {
      expect(continents, continent).toContain(continent);
    }
  });

  it('lists every city exactly once across the continent groups', () => {
    const grouped = citiesByContinent().flatMap((group) => group.cities);
    expect(grouped).toHaveLength(CITIES.length);
  });

  it('names eight hub cities that all exist and are Tier A', () => {
    expect(TOP_HUBS).toHaveLength(8);
    for (const hub of TOP_HUBS) expect(hub.tier).toBe('A');
  });

  it('reports distinct zones without counting aliases twice', () => {
    const zones = cityZones();
    expect(new Set(zones).size).toBe(zones.length);
    for (const zone of zones) expect(canonicalZoneId(zone)).toBe(zone);
  });

  it('gives every city a positive population for link ordering', () => {
    for (const city of CITIES) expect(city.population, city.name).toBeGreaterThan(0);
  });
});
