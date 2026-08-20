import { describe, expect, it } from 'vitest';
import { TOOLS } from './tools.ts';
import { localesForPath } from '~/config/rollout.ts';
import { LOCALE_CODES } from '~/config/locales.ts';
import en from '~/i18n/en.json' with { type: 'json' };

/**
 * The registry has to agree with the rest of the site or `/llms.txt` starts
 * advertising pages that do not exist. Three things are checked: the count the
 * brief specifies, that every path ships in every locale, and that every label
 * key resolves — a typo'd key would render as the key itself in the navigation.
 */
describe('the tool registry', () => {
  it('lists exactly the ten core tools', () => {
    expect(TOOLS).toHaveLength(10);
  });

  it('has no duplicate paths or names', () => {
    expect(new Set(TOOLS.map((tool) => tool.path)).size).toBe(TOOLS.length);
    expect(new Set(TOOLS.map((tool) => tool.name)).size).toBe(TOOLS.length);
  });

  it('uses trailing-slash paths, matching the site-wide convention', () => {
    for (const tool of TOOLS) expect(tool.path.endsWith('/')).toBe(true);
  });

  it('lists only paths that ship in every locale', () => {
    for (const tool of TOOLS) {
      expect(localesForPath(tool.path)).toHaveLength(LOCALE_CODES.length);
    }
  });

  it('names an i18n key that exists', () => {
    const keys = new Set(Object.keys(en as Record<string, string>));
    for (const tool of TOOLS) expect(keys.has(tool.label)).toBe(true);
  });

  it('gives every tool a summary that is a sentence, not a fragment', () => {
    for (const tool of TOOLS) {
      expect(tool.summary.length).toBeGreaterThan(40);
      expect(tool.summary.endsWith('.')).toBe(true);
    }
  });
});
