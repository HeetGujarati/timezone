import { describe, expect, it } from 'vitest';
import { isRewritable, localeFromPath, localiseHref } from './localise-links.ts';

describe('localeFromPath', () => {
  it('reads the locale from the containing directory', () => {
    expect(localeFromPath('/repo/src/content/pages/de/about.md')).toBe('de');
    expect(localeFromPath('/repo/src/content/guides/zh-Hans/what-utc-really-is.md')).toBe('zh-Hans');
  });

  it('returns undefined for English, which needs no prefix', () => {
    expect(localeFromPath('/repo/src/content/pages/en/about.md')).toBeUndefined();
  });

  it('returns undefined for a directory that is not a locale', () => {
    expect(localeFromPath('/repo/README.md')).toBeUndefined();
    expect(localeFromPath(undefined)).toBeUndefined();
  });

  it('handles Windows separators', () => {
    expect(localeFromPath('C:\\repo\\src\\content\\pages\\fr\\terms.md')).toBe('fr');
  });
});

describe('isRewritable', () => {
  it('accepts a root-relative site path', () => {
    expect(isRewritable('/contact/')).toBe(true);
  });

  it('rejects anything that leaves the site', () => {
    expect(isRewritable('https://example.com/')).toBe(false);
    expect(isRewritable('//cdn.example.com/x')).toBe(false);
    expect(isRewritable('mailto:hello@example.com')).toBe(false);
    expect(isRewritable('#section')).toBe(false);
    expect(isRewritable(undefined)).toBe(false);
  });

  it('rejects site-wide paths that exist once for the whole site', () => {
    // RFC 8615 fixes the location of /.well-known/; a localised copy would not
    // be found. Root files are single artefacts for the same reason.
    expect(isRewritable('/.well-known/security.txt')).toBe(false);
    expect(isRewritable('/robots.txt')).toBe(false);
    expect(isRewritable('/llms.txt')).toBe(false);
    expect(isRewritable('/sitemap-index.xml')).toBe(false);
    expect(isRewritable('/og/convert/new-york-to-london.png')).toBe(false);
  });

  it('still accepts page paths, which have no extension', () => {
    expect(isRewritable('/guides/what-utc-really-is/')).toBe(true);
    expect(isRewritable('/time-in/tokyo/')).toBe(true);
  });

  it('rejects a path that already carries a locale segment', () => {
    expect(isRewritable('/de/contact/')).toBe(false);
    expect(isRewritable('/zh-hans/contact/')).toBe(false);
  });
});

describe('localiseHref', () => {
  it('uses the lowercase URL segment, not the locale code', () => {
    expect(localiseHref('zh-Hans', '/guides/')).toBe('/zh-hans/guides/');
    expect(localiseHref('pt-BR', '/guides/')).toBe('/pt-br/guides/');
    expect(localiseHref('de', '/contact/')).toBe('/de/contact/');
  });
});
