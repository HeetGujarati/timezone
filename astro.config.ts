import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { LOCALES, DEFAULT_LOCALE } from './src/config/locales.ts';

const site = process.env['PUBLIC_SITE_URL'] ?? 'https://meridiem.app';

/**
 * Astro's i18n block is fed the lowercase URL segments ('pt-br', 'zh-hans'), because
 * that is what appears in a path. The BCP-47 tags used for `<html lang>`, hreflang and
 * `Intl` live in src/config/locales.ts and are derived from the same records, so the
 * two representations cannot drift.
 */
const i18nLocales: string[] = LOCALES.map((l) => (l.segment === '' ? l.code : l.segment));

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
      // Section/locale-aware splitting is handled by scripts/build-sitemaps; this
      // keeps every child sitemap far below the 45,000-URL ceiling regardless.
      entryLimit: 20000,
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
