# YourWorldTime

Time zone tools that tell you the truth: convert any zone to any zone, plan meetings across
continents, read a live world clock, and see exactly when the next DST transition will move your
calendar under you.

Static site. No backend, no database, no API routes, no server runtime, no third-party requests at
runtime. Every offset and DST rule comes from the IANA time zone database through the runtime `Intl`
API — there is not one hardcoded offset table in this repository.

## Stack

| Layer         | Choice                                                                               |
| ------------- | ------------------------------------------------------------------------------------ |
| Framework     | Astro 7 (`output: 'static'`, every page prerendered)                                 |
| Language      | TypeScript, `astro/tsconfigs/strictest`                                              |
| Styling       | Tailwind CSS v4 via `@tailwindcss/vite`, plus design tokens as CSS custom properties |
| Interactivity | Vanilla TypeScript custom elements as Astro islands — no React, Vue, Svelte or Solid |
| Time engine   | `Intl.DateTimeFormat` + `formatToParts`. Zero date libraries                         |
| Validation    | zod, at build time and for URL parameter parsing                                     |
| Tests         | Vitest (unit), Playwright (e2e smoke)                                                |
| Quality       | ESLint flat config, Prettier, `astro check`                                          |
| Host          | Cloudflare Pages (primary), Netlify (documented fallback)                            |

Every dependency is pinned to an exact version and the lockfile is committed.

## Local development

Requires **Node 22 or newer** — the time engine depends on full ICU, which Node 22 ships by default.

```bash
npm ci
cp .env.example .env     # then set PUBLIC_SITE_URL
npm run dev              # http://localhost:4321
```

### Working on a D: drive (Windows)

```powershell
git clone https://github.com/HITMAN5050/Timezone.git D:\Timezone
cd D:\Timezone
npm ci                   # node_modules lands on D:, not C:
npm run dev
```

## Scripts

| Script                  | What it does                                                     |
| ----------------------- | ---------------------------------------------------------------- |
| `npm run dev`           | Dev server with HMR                                              |
| `npm run build`         | Production build into `dist/`                                    |
| `npm run serve`         | Serve the built `dist/` the way a static host would              |
| `npm run check`         | `astro check` — TypeScript across `.ts` and `.astro`             |
| `npm run lint`          | ESLint, including the banned-API security rules                  |
| `npm run format:check`  | Prettier in check mode                                           |
| `npm run test`          | Vitest unit tests                                                |
| `npm run test:coverage` | Vitest with coverage; fails under 90% on `src/lib/time/`         |
| `npm run e2e`           | Playwright smoke suite against the built output                  |
| `npm run icons`         | Re-rasterise `public/favicon.svg` into the ICO and the PNG sizes |
| `npm run gate`          | The full local gate — everything CI runs, in CI's order          |

### Audits

Each reads the built output and prints real counts rather than "ok", so a passing run still
says how much was checked. All of them run in `npm run gate` and in CI.

| Script                   | What it fails on                                                                       |
| ------------------------ | -------------------------------------------------------------------------------------- |
| `npm run audit:i18n`     | A dictionary key missing, extra, or with mismatched placeholders                       |
| `npm run audit:i18nleak` | English prose on a translated page                                                     |
| `npm run audit:links`    | A broken internal link                                                                 |
| `npm run audit:seo`      | A duplicate title or description, a missing canonical, a broken hreflang               |
| `npm run audit:html`     | A duplicate id, a dangling ARIA reference, an unnamed control, a skipped heading level |
| `npm run audit:islands`  | A control an island looks for that the markup does not render                          |
| `npm run audit:headers`  | A missing security header, or a CSP that drifted between the three host configs        |
| `npm run audit:js`       | More than 30 KB of JavaScript sitewide, or 15 KB on one page                           |
| `npm run audit:sethtml`  | Any use of `set:html` or another banned API                                            |

Lighthouse runs in CI from `lighthouserc.json`, asserting 95 on all four categories across six
URLs. It is fetched with `npx` rather than declared as a dependency — see `DECISIONS.md` D31.

## Project structure

```
src/
  config/      site constants, the 14-locale registry, feature flags
  data/        curated city, zone and abbreviation datasets (zod-validated at build)
  lib/time/    the time engine — offsets, conversion, DST transitions, overlap, parsing
  lib/seo/     metadata, JSON-LD, OG images, deterministic copy templates
  i18n/        one JSON dictionary per locale; key parity enforced at build
  templates/   one shared template per page type
  pages/       English at the root, every other locale under [locale]/
  islands/     vanilla custom elements — the only JavaScript shipped to the browser
scripts/       build-time and CI audits: links, SEO uniqueness, i18n parity, JS budget
```

## Documentation

| Document       | For                                                                                  |
| -------------- | ------------------------------------------------------------------------------------ |
| `CLAUDE.md`    | The rules and the layout, for anyone — human or agent — changing this codebase       |
| `DEPLOY.md`    | Click-by-click first deploy, written for someone who has never used Cloudflare Pages |
| `BLOCKED.md`   | The short list of things only the repository owner can do                            |
| `DECISIONS.md` | Every judgement call, with reasoning                                                 |
| `SEO.md`       | Keyword-to-URL map, expansion playbook, what to monitor                              |
| `SECURITY.md`  | Threat model, CSP mechanism, reporting                                               |
| `DESIGN.md`    | Design tokens and the reasoning behind them                                          |
| `CONTENT.md`   | Voice, and the sentence-template inventory behind generated copy                     |
| `CHANGELOG.md` | Release history                                                                      |

## Licence

Private and unlicensed. All content is original.
