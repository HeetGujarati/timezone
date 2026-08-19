import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { contrastRatio, meetsAA, meetsAANonText } from '~/lib/color.ts';

/**
 * The palette is read out of tokens.css rather than duplicated here, so this test
 * fails when someone changes a colour — which is the entire point of having it.
 */
const css = readFileSync(new URL('./tokens.css', import.meta.url), 'utf8');

function paletteFromBlock(selector: string): Record<string, string> {
  const index = css.indexOf(selector);
  if (index === -1) throw new Error(`Block not found in tokens.css: ${selector}`);
  const block = css.slice(index, css.indexOf('}', index));
  const palette: Record<string, string> = {};
  for (const match of block.matchAll(/--([a-z-]+):\s*(#[0-9a-fA-F]{3,6});/g)) {
    const [, name, value] = match;
    if (name !== undefined && value !== undefined) palette[name] = value;
  }
  return palette;
}

const light = paletteFromBlock(':root {');
const dark = paletteFromBlock(":root[data-theme='dark'] {");

describe('the palette is fully defined', () => {
  it.each([
    ['light', light],
    ['dark', dark],
  ])('%s defines all six named colours', (_name, palette) => {
    for (const token of ['ink', 'paper', 'graphite', 'accent', 'signal', 'rule']) {
      expect(palette[token], `${token} missing`).toMatch(/^#[0-9a-fA-F]{6}$/);
    }
  });

  it('keeps the light and dark palettes genuinely distinct', () => {
    expect(light['ink']).not.toBe(dark['ink']);
    expect(light['accent']).not.toBe(dark['accent']);
  });
});

describe('WCAG 2.2 AA: body text reaches 4.5:1', () => {
  it('light theme text on the page background', () => {
    const background = light['paper']!;
    for (const token of ['ink', 'graphite', 'accent', 'signal']) {
      const ratio = contrastRatio(light[token]!, background);
      expect(meetsAA(light[token]!, background), `${token} on paper is ${ratio.toFixed(2)}:1`).toBe(
        true,
      );
    }
  });

  it('dark theme text on the page background', () => {
    const background = dark['ink']!;
    for (const token of ['paper', 'graphite', 'accent', 'signal']) {
      const ratio = contrastRatio(dark[token]!, background);
      expect(meetsAA(dark[token]!, background), `${token} on ink is ${ratio.toFixed(2)}:1`).toBe(
        true,
      );
    }
  });

  it('white text on the accent and signal fills used for buttons and badges', () => {
    expect(meetsAA('#FFFFFF', light['accent']!)).toBe(true);
    expect(meetsAA('#FFFFFF', light['signal']!)).toBe(true);
  });

  it('dark theme fills invert to dark text without losing contrast', () => {
    expect(meetsAA(dark['ink']!, dark['accent']!)).toBe(true);
    expect(meetsAA(dark['ink']!, dark['signal']!)).toBe(true);
  });
});

describe('WCAG 2.2 AA: non-text contrast reaches 3:1', () => {
  it('the focus ring is visible against both page backgrounds', () => {
    expect(meetsAANonText(light['accent']!, light['paper']!)).toBe(true);
    expect(meetsAANonText(dark['accent']!, dark['ink']!)).toBe(true);
  });
});

describe('the 24-hour band stays readable', () => {
  function bandColour(theme: 'light' | 'dark', token: string): string {
    const selector = theme === 'light' ? ':root {' : ":root[data-theme='dark'] {";
    const index = css.indexOf(selector);
    const block = css.slice(index, css.indexOf('}', index));
    const match = new RegExp(`--color-band-${token}:\\s*(#[0-9a-fA-F]{6})`).exec(block);
    if (match?.[1] === undefined) throw new Error(`band token missing: ${theme} ${token}`);
    return match[1];
  }

  it('carries body text at 4.5:1 over every band state', () => {
    for (const token of ['working', 'fringe', 'asleep']) {
      expect(meetsAA(light['ink']!, bandColour('light', token)), `light ${token}`).toBe(true);
      expect(meetsAA(dark['paper']!, bandColour('dark', token)), `dark ${token}`).toBe(true);
    }
  });

  it('separates the working band from the sleeping band clearly enough to read as a shape', () => {
    // The band is the site's one signature element and is scanned, not read. A
    // 1.06:1 separation — which an earlier palette had — is invisible to a
    // low-vision reader. The component also marks working hours with a border,
    // so the distinction never rests on colour alone.
    for (const theme of ['light', 'dark'] as const) {
      expect(
        contrastRatio(bandColour(theme, 'working'), bandColour(theme, 'asleep')),
        `${theme} band separation`,
      ).toBeGreaterThan(1.35);
    }
  });
});
