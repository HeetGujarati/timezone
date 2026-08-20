# Working on Meridiem

Read this before changing anything. It is the short version of the rules the build
already enforces — breaking one of them fails `npm run gate` rather than shipping.

## What this is

A static, fourteen-language time zone tools site. 4,570 prerendered pages, no
backend, no database, no API routes, no runtime dependencies. Astro 7 with
`output: 'static'`, TypeScript at `astro/tsconfigs/strictest`, Tailwind v4, and
vanilla custom elements as islands.

Requires **Node 22+** — the time engine depends on full ICU.

```bash
npm ci
npm run dev      # http://localhost:4321, hot reload
npm run build    # ~2 minutes, writes dist/ (1,791 OG images take 90s of it)
npm run serve    # serve dist/ exactly as a static host would
```

## The five rules that are not negotiable

These are the ones a well-meaning change breaks most often.

**1. Never write a time zone fact by hand.** Every offset, abbreviation,
transition date and daylight-saving rule comes from the IANA database through
`Intl` at build time. There is not one hardcoded offset table in this repository
and there must never be. No `moment`, `date-fns`, `luxon`, `dayjs` or any other
date library — `npm run lint` has a rule that rejects them. If you need a time
fact, get it from `src/lib/time/`.

**2. Never put English on a translated page.** Every user-visible string is a key
in `src/i18n/{locale}.json`, in all fourteen. `npm run audit:i18n` fails on a key
that is missing, extra, or whose `{placeholders}` do not match English.
`npm run audit:i18nleak` renders all 2,756 translated pages and fails if it finds
English prose. Adding an English string without thirteen translations does not
ship.

**3. Never assign HTML.** No `innerHTML`, no `outerHTML`, no `set:html`, no
`eval`, no `document.write`. Everything reaches the DOM through `textContent` and
`createElement`. That is what lets the Content Security Policy stay at
`default-src 'none'` with no `'unsafe-inline'`. ESLint and
`npm run audit:sethtml` both enforce it.

**4. Islands find their controls by `data-role`.** An island that queries
`[data-role="from"]` needs markup that renders it, or `connectedCallback` returns
at its first guard and the tool silently does nothing — no error, no warning, just
a dead page. This shipped once and cost 3,002 pages. `npm run audit:islands`
reads the roles out of the island sources and checks them against every built
page. `ZoneSelect` takes a required `islandRole` prop.

**5. Prerendered HTML carries only durable facts.** Offsets, transition dates,
hour tables, overlap windows — things that are true until tzdata changes.
Anything that means _now_ renders in the browser, in an island. A page must never
say "currently" about something computed at build time three weeks ago.

## Where things live

```
src/config/      site constants, the 14-locale registry, feature flags
src/data/        curated city, zone and abbreviation datasets (validated at build)
src/lib/time/    the time engine — offsets, conversion, DST, overlap, parsing
src/lib/seo/     metadata, JSON-LD, deterministic copy-variant picker
src/lib/content/ the generated-copy layer for pair and city pages
src/i18n/        one flat JSON dictionary per locale
src/content/     guides (markdown) and long-form tool copy (typed modules)
src/templates/   one shared template per page type
src/pages/       English at the root, every other locale under [locale]/
src/islands/     vanilla custom elements — the only JavaScript shipped
src/components/  Astro components
scripts/         the build-time audits
```

**Routing.** Every route exists twice: `src/pages/x.astro` for English at the root
and `src/pages/[locale]/x.astro` for the other thirteen. Both are thin wrappers
that render the same `src/templates/X.astro` with a `locale` prop. Put logic in
the template, never in the page.

## How to make the common changes

**Change a piece of UI text** — edit the key in `src/i18n/en.json`, then the same
key in the other thirteen files. Do not add an English string to a template.

**Change long-form copy on a tool page** — `src/content/tools/en.ts` and
`src/content/tools/locales/*.ts`. The type is the contract: a locale missing a
field fails to compile.

**Change the wording of a generated pair or city page** — those sentences are
dictionary keys with two variants each (`pair.summary.ahead.1` / `.2`), picked by
a hash of the page's own slug so the wording is stable between builds. The full
inventory is in `CONTENT.md` §3.

**Add a city** — add a record to `src/data/cities.ts`. The zone is validated
against `Intl.supportedValuesOf('timeZone')` at build time, so a typo fails the
build. Pairs, hub entries and hreflang clusters follow automatically.

**Add a guide** — `src/content/guides/en/{slug}.md` plus thirteen translations.
Front matter schema is in `src/content.config.ts`. Title under 60 characters,
description under 155 — both have tests.

**Change a colour, size or spacing** — `src/styles/tokens.css`. Never a raw hex in
a component. `src/styles/contrast.test.ts` fails the build if a text pairing drops
below WCAG AA 4.5:1.

**Fix a bug in an island** — `src/islands/*.ts`. Remember rule 4: if you add a
control, add its `data-role`. Remember rule 2: no translated strings in the
bundle — server-render the wording onto the element as a `data-` attribute and
fill in the number, the way `src/islands/lib/difference.ts` does.

## Verifying a change

Fast loop, seconds:

```bash
npm run check     # TypeScript across .ts and .astro
npm run lint      # ESLint, including the banned-API rules
npm test          # 605 unit tests
```

Before saying a change is done, the full gate — about 6 minutes:

```bash
npm run gate
```

That runs check, lint, format, the `set:html` audit, tests with coverage, a full
build, and then nine audits over the built output. Every audit prints real counts
rather than "ok", so a passing run says how much it checked. It must exit 0.

Browser checks, after a build:

```bash
npm run e2e       # 40 Playwright tests, desktop and mobile
```

Lighthouse, if you touched anything that could affect performance or markup:

```bash
CHROME_PATH=$(which chrome) npx --yes @lhci/cli@0.15.1 autorun
```

It asserts 95 on all four categories across six URLs. The site currently scores
100 on every one, so any drop is something you did.

## What the audits will tell you

| Command                  | Fails on                                                                                                              |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| `npm run audit:i18n`     | A dictionary key missing, extra, or with mismatched placeholders                                                      |
| `npm run audit:i18nleak` | English prose on a translated page                                                                                    |
| `npm run audit:links`    | A broken internal link, out of 267,366                                                                                |
| `npm run audit:seo`      | A duplicate title or description, a missing canonical, a broken hreflang                                              |
| `npm run audit:html`     | A duplicate id, a dangling ARIA reference, an unnamed control, a skipped heading level, an unrendered `\uXXXX` escape |
| `npm run audit:islands`  | A control an island looks for that the markup does not render                                                         |
| `npm run audit:headers`  | A missing security header, or a CSP that drifted between the three host configs                                       |
| `npm run audit:js`       | More than 30 KB of JavaScript sitewide, or 15 KB on one page                                                          |
| `npm run audit:sethtml`  | Any use of `set:html` or another banned API                                                                           |

They read `dist/`, so build first.

## Conventions

- **Commits**: Conventional Commits — `fix(islands): …`, `feat(seo): …`,
  `docs: …`. The body says what was wrong and why the fix is the right one, not
  what files changed.
- **Branch**: `claude/lets-cook-7ann03` is the repository's default branch. There
  is no `main`.
- **Comments**: explain _why_, never _what_. The existing code sets the density —
  match it rather than adding a comment to every line or none at all.
- **No TODOs, no stubs, no placeholder implementations.** If something cannot be
  finished, say so in the reply rather than leaving a marker in the code. The one
  exception is the owner's details (legal entity, contact email, domain), which
  are deliberate placeholders tracked in `DEPLOY.md` Part 1.
- **Dependencies are exact-pinned** with no `^` or `~`, and `npm audit
--audit-level=high` must stay at zero. Adding a dependency is a real decision —
  say why in the reply.

## Where the reasoning is written down

- `DECISIONS.md` — every judgement call, numbered, with the reasoning. Read the
  relevant entry before reversing something; several of them record a fix that
  looked obvious and was wrong.
- `DESIGN.md` — tokens, type, the 24-hour band, dark mode, accessibility.
- `CONTENT.md` — voice, and the sentence-template inventory behind the generated
  pages.
- `SEO.md` — the metadata rules and which audit enforces each.
- `SECURITY.md` — the threat model and how the CSP hash is computed.
- `DEPLOY.md` — first deploy, and the fifteen placeholders to fill before launch.
- `BLOCKED.md` — the things only the repository owner can do.

## Things that will surprise you

- **The content collection lowercases entry ids.** `pt-BR/x` is on disk as
  `pt-br/x`. Use `findLocaleEntry`, not a string comparison.
- **`astro preview` daemonises**, which breaks Playwright's `webServer`. Use
  `scripts/serve-dist.mjs` — that is what `npm run serve` and the e2e config run.
- **satori reads `.ttf`, `.otf` and `.woff`, but not `.woff2`.** The OG image
  integration depends on that.
- **The English locale renders a 12-hour clock.** `09:00` in London converts to
  `01:45 PM`, not `13:45`, on `/`. German and Japanese render 24-hour.
- **An escape sequence in an `.astro` template is text.** `◆` renders as six
  characters, not a diamond. Paste the character itself.
- **Most zones have no letter abbreviation.** ICU reports `GMT+9` for
  `Asia/Tokyo`, not `JST`. `zoneAbbreviation()` returns null in that case and the
  copy adapts. Never invent one.
