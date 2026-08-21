# Changelog

Notable changes to YourWorldTime. Follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)
and [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Dates are the date the work landed on the branch, not a deploy date — this site has not been
deployed yet. `DEPLOY.md` is the first deploy; `BLOCKED.md` is what only the repository owner
can do.

---

## [1.0.0] — 2026-08-20

The first complete build: 4,570 pages across fourteen languages, no backend, no runtime
dependencies, and no date library.

### Added

**The time engine.** Every offset, abbreviation and transition read from the IANA database
through `Intl` at build time — no `moment`, no `date-fns`, no `luxon`, no hand-maintained
table that could drift from tzdata. Daylight-saving transitions are found by a coarse month
scan narrowed to the second by binary search. The gap and ambiguity policy is explicit and
surfaced to the reader: a local time that does not exist shifts forward by the size of the
gap, and one that happens twice resolves to the earlier.

**Ten tools**, each usable above the fold at 360 pixels and operable from the keyboard: a
converter, a meeting planner with a 24-hour band, a world clock over 80 cities, a difference
calculator that lists every date the difference changes, a working-hours overlap finder, a
Unix timestamp converter, a duration calculator, a countdown, a UTC clock and a
daylight-saving change table.

**4,108 generated pages** — 2,748 city pairs, 1,120 city pages, 240 abbreviation pairs —
each carrying computed facts rather than written ones, and copy assembled from two variants
per sentence slot chosen by a hash of the page's own slug, so wording is stable between
builds and different between neighbours.

**Twelve guides**, 976–1,120 words each, in all fourteen languages: 168 articles, each
arguing with a specific belief that costs people meetings.

**Fourteen locales** — en, es, pt-BR, fr, de, it, ru, tr, ar, hi, id, ja, ko, zh-Hans —
with a complete self-referencing `hreflang` cluster on every page, locale-correct hour
cycles and first day of week, right-to-left Arabic built with logical properties, and a
language switcher that offers only pages that were actually built.

**The SEO layer**: unique titles and descriptions asserted at build time, `Organization`,
`WebSite` with a working `SearchAction`, `SoftwareApplication`, `BreadcrumbList`, `FAQPage`,
`HowTo` and `Article` structured data, a sitemap index with per-locale alternates, 1,791
Open Graph cards rendered at build with satori and resvg, `llms.txt`, and an RSS feed for
the guides.

**Security**: a Content Security Policy with `default-src 'none'` and no `'unsafe-inline'`,
whose `script-src` hash is computed from the built output by an `astro:build:done`
integration, plus HSTS, `Cross-Origin-*`, `Permissions-Policy`, a `security.txt` and a
threat model in `SECURITY.md`. CodeQL, Dependabot and gitleaks run in CI.

**Legal and monetisation scaffolding**: real privacy, terms, cookie and accessibility pages
with the owner's details marked as placeholders; a consent banner and fixed-height ad slots
that render nothing at all until `PUBLIC_ADS_ENABLED` is set; and an `ads.txt` that is
deliberately empty of records, which is a positive statement rather than an omission.

**Ten build-time audits**, each printing real counts rather than "ok", all wired into
`npm run gate` and into CI: dictionary parity, untranslated-copy detection, internal links,
SEO uniqueness, HTML and accessibility, island wiring, security headers, the JavaScript
budget, `set:html` usage, and Lighthouse.

### Fixed

Defects found and closed during the build, each of which had shipped silently:

- **The converter did nothing.** `ZoneSelect` never rendered the `data-role` its island
  looks controls up by, so `connectedCallback` returned at its first guard on 3,002 pages.
  The meeting planner, difference tool, duration calculator, countdown and epoch converter
  had the same break. `scripts/island-audit.mjs` now reads the roles out of the island
  sources and checks them against every page.
- **3,475 English strings on translated pages**, from generated copy and UI chrome that had
  never been routed through the dictionary. Now zero, asserted across 97,982 prose segments.
- **English written into translated pages by JavaScript.** The converter and the difference
  tool built "5 hours 45 minutes ahead" in the browser, in English, in every locale — text
  that did not exist until a reader interacted, and so was invisible to an audit that reads
  HTML. The wording now travels as data on the element and the duration comes from CLDR.
- **Arabic and Hindi pages were set in a system font.** The two script families were
  declared as dependencies and imported nowhere. Importing them naively then cost every
  Russian page 124KB of fonts it could not draw a character with; the stacks are now scoped
  with `:lang()`.
- **Thirty-seven titles ran past 60 characters** once the brand suffix was appended. The
  suffix is now dropped rather than the title truncated.
- **Every page 404ed on `/favicon.ico`.** The site had no mark at all.
- **`WebSite` structured data was written, tested and rendered nowhere**, and its
  `SearchAction` pointed at a parameter the world clock ignored. Both are now real.
- **Tool pages rendered their explainer section twice**, once hardcoded in English.
- Three guides used a word in a translation that happened to be identical to its English
  form, tripping the script-leak audit; they were reworded rather than the audit relaxed.

### Measured

From a real build, not a target:

| Check                       | Result                                                                                             |
| --------------------------- | -------------------------------------------------------------------------------------------------- |
| Pages                       | 4,570 across 14 locales                                                                            |
| Unit tests                  | 605 across 36 files                                                                                |
| Coverage on `src/lib/time/` | 97.13% statements, 97.8% lines                                                                     |
| Smoke tests                 | 40, desktop and mobile                                                                             |
| Lighthouse                  | 100 / 100 / 100 / 100 on 6 URLs, 3 runs each                                                       |
| JavaScript                  | 16.0 KB gzipped sitewide; 2.7 KB on the heaviest page                                              |
| Internal links              | 267,366 checked, 0 broken                                                                          |
| Titles and descriptions     | 4,556 unique of 4,556 indexable pages                                                              |
| `hreflang`                  | 41,356 alternates, 0 broken                                                                        |
| Untranslated copy           | 97,982 segments checked, 0 English found                                                           |
| Dictionary parity           | 262 keys × 14 locales, 0 missing, 0 extra                                                          |
| Accessibility               | 18,650 ids unique per page, 260,738 controls named, 61,188 headings with no skipped level          |
| Islands                     | 9 islands, every control they look for present on all 4,570 pages                                  |
| Security headers            | 8 present, CSP with 1 inline hash and no unsafe directive, identical across all three host configs |
| `npm audit`                 | 0 vulnerabilities                                                                                  |

### Known and deliberate

- The site has no search. The world clock's filter is the whole of it.
- Non-English locales carry 100 city pairs each rather than all 1,448 —
  `LOCALISED_PAIR_LIMIT` in `src/config/flags.ts`.
- Abbreviation pages are English-only: "EST to PST" is an English query wherever it is typed.
- Japanese, Korean and Chinese headings use the reader's system font. A CJK face runs to
  megabytes.
- The owner's legal entity, contact address and domain are placeholders. `BLOCKED.md` lists
  them, and `DEPLOY.md` Part 1 is the checklist.

[1.0.0]: https://github.com/HITMAN5050/Timezone/releases/tag/v1.0.0
