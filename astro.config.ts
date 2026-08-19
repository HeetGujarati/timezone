import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { LOCALES, DEFAULT_LOCALE } from './src/config/locales.ts';
import { sitemapEntryFor } from './src/lib/seo/sitemap-policy.ts';

const site = process.env['PUBLIC_SITE_URL'] ?? 'https://meridiem.app';

/**
 * Astro's i18n block is fed the lowercase URL segments ('pt-br', 'zh-hans'), because
 * that is what appears in a path. The BCP-47 tags used for `<html lang>`, hreflang and
 * `Intl` live in src/config/locales.ts and are derived from the same records, so the
 * two representations cannot drift.
 */
const i18nLocales: string[] = LOCALES.map((l) => (l.segment === '' ? l.code : l.segment));

/** URL segments only (no root locale), used to detect a locale prefix in a path. */
const localeSegments: string[] = LOCALES.map((l) => l.segment).filter((s) => s !== '');

export default defineConfig({
  site,
  output: 'static',
  trailingSlash: 'always',
  build: {
    format: 'directory',
    // Never inline stylesheets: the CSP forbids inline <style> and carries no
    // 'unsafe-inline'. See SECURITY.md.
    inlineStylesheets: 'never',
    assets: '_assets',
  },
  i18n: {
    defaultLocale: DEFAULT_LOCALE,
    locales: i18nLocales,
    routing: {
      prefixDefaultLocale: false,
      redirectToDefaultLocale: false,
    },
  },
  integrations: [
    sitemap({
      // Keeps every child sitemap far below the 45,000-URL ceiling.
      entryLimit: 20000,
      // 404 is the only route that must never appear in a sitemap.
      filter: (page) => !page.includes('/404'),
      i18n: {
        defaultLocale: DEFAULT_LOCALE,
        locales: Object.fromEntries(
          LOCALES.map((l) => [l.segment === '' ? l.code : l.segment, l.hreflang]),
        ),
      },
      serialize(item) {
        const { pathname } = new URL(item.url);
        const firstSegment = /^\/([^/]+)\//.exec(pathname)?.[1];
        const isDefaultLocale =
          firstSegment === undefined || !localeSegments.includes(firstSegment);
        const { priority, changefreq } = sitemapEntryFor(pathname, localeSegments, isDefaultLocale);
        // `sitemap` types changefreq as a string enum whose members are exactly these
        // literals, so the cast is a naming formality, not a widening.
        return {
          ...item,
          priority,
          changefreq: changefreq as unknown as NonNullable<typeof item.changefreq>,
        };
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    build: {
      // Small, predictable chunks — the JS budget is enforced per page.
      assetsInlineLimit: 0,
    },
  },
  devToolbar: { enabled: false },
});
