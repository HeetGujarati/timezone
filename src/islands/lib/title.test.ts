import { describe, expect, it } from 'vitest';
import { sanitiseTitle } from './title.ts';

describe('sanitiseTitle', () => {
  it('keeps ordinary text intact', () => {
    expect(sanitiseTitle('Launch day')).toBe('Launch day');
  });

  it('keeps non-Latin text intact', () => {
    expect(sanitiseTitle('\u6253\u3061\u4e0a\u3052')).toBe('\u6253\u3061\u4e0a\u3052');
    expect(sanitiseTitle('\u062d\u0641\u0644\u0629')).toBe('\u062d\u0641\u0644\u0629');
  });

  it('strips control characters that could break out of a text node', () => {
    expect(sanitiseTitle('a\u0000b\u001fc')).toBe('abc');
  });

  it('strips zero-width and line-separator characters used to hide payloads', () => {
    expect(sanitiseTitle('launch\u200bday\u2028now')).toBe('launchdaynow');
  });

  it('caps length so a URL cannot flood the page', () => {
    expect(sanitiseTitle('x'.repeat(500))).toHaveLength(80);
  });

  it('trims surrounding whitespace', () => {
    expect(sanitiseTitle('   spaced   ')).toBe('spaced');
  });

  it('returns an empty string for a missing parameter', () => {
    expect(sanitiseTitle(null)).toBe('');
  });

  it('leaves markup as literal text, because it is written with textContent', () => {
    // These characters are harmless as text. The guarantee is not that they are
    // removed, but that this value never reaches innerHTML anywhere in the site —
    // enforced by the ESLint ban and scripts/audit-set-html.mjs.
    expect(sanitiseTitle('<img src=x onerror=alert(1)>')).toBe('<img src=x onerror=alert(1)>');
  });
});
