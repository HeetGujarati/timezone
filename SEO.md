# SEO

What this site is built to rank for, how the metadata is generated and enforced, and what
to watch once it is live.

Everything here is either a rule the build enforces or a fact you can read out of `dist/`.
Nothing on this page is a projection: there are no traffic estimates, no search volumes and
no difficulty scores, because this repository has no access to a keyword tool and inventing
those numbers would make the document worse than useless.

---

## 1. What exists

Counted from a real build (`npm run build`, then `node scripts/seo-audit.mjs`):

| Type                |   English | Other 13 locales |     Total |
| ------------------- | --------: | ---------------: | --------: |
| Core tools and home |        10 |              143 |       153 |
| City pairs          |     1,448 |            1,300 |     2,748 |
| City pages          |        80 |            1,040 |     1,120 |
| Abbreviation pairs  |       240 |                0 |       240 |
| Guides              |        12 |              156 |       168 |
| Hubs                |        17 |               39 |        56 |
| Support and 404     |         7 |               78 |        85 |
| **Total**           | **1,814** |        **2,756** | **4,570** |

4,556 of those are in the sitemap. The 14 that are not are the per-locale 404 pages, which
carry `noindex` and should never be crawled as destinations.

Abbreviation pairs (`/convert/est-to-pst/` and its 239 siblings) are English-only by
design: they exist because people type "EST to PST", and that query is typed in English
regardless of where it is typed from. Translating the page would not translate the query.

---

## 2. The query → URL map

The twenty shapes the site is built around, each with the URL that answers it and what a
searcher gets in the first screen. "Head" means a single high-volume query; "pattern" means
a family of thousands.

| #   | Query shape                                 | URL                                         | What the page answers above the fold                                         |
| --- | ------------------------------------------- | ------------------------------------------- | ---------------------------------------------------------------------------- |
| 1   | time zone converter (head)                  | `/`                                         | A working converter, prefilled, with the result and the difference           |
| 2   | `{city} to {city} time` (pattern, 1,448 EN) | `/convert/london-to-new-york/`              | The current difference, a 24-row hour table, the next transition             |
| 3   | `time in {city}` (pattern, 80 EN)           | `/time-in/tokyo/`                           | Current offset, abbreviation, whether DST applies, sunrise and sunset        |
| 4   | `{abbr} to {abbr}` (pattern, 240)           | `/convert/est-to-pst/`                      | The gap, the IANA zones behind both letters, and what each is ambiguous with |
| 5   | meeting planner across time zones (head)    | `/meeting-planner/`                         | A 24-hour band for five zones, working hours shaded                          |
| 6   | world clock (head)                          | `/world-clock/`                             | 80 cities, live, filterable, pinnable                                        |
| 7   | time difference calculator (head)           | `/time-difference/`                         | Live difference plus every date in the next year it changes                  |
| 8   | working hours overlap (head)                | `/working-hours-overlap/`                   | The hours that work for a team, and a plain statement when none do           |
| 9   | unix timestamp converter (head)             | `/unix-timestamp-converter/`                | Both directions, live epoch, milliseconds and seconds                        |
| 10  | duration calculator (head)                  | `/duration-calculator/`                     | Elapsed time between two zoned date-times, DST-correct                       |
| 11  | countdown timer (head)                      | `/countdown/`                               | A running countdown with a shareable URL                                     |
| 12  | utc time now (head)                         | `/utc-time/`                                | A ticking UTC clock and what UTC is not                                      |
| 13  | when do the clocks change (head)            | `/dst-changes/`                             | Every 2026 and 2027 transition, filterable                                   |
| 14  | what is UTC (head)                          | `/guides/what-utc-really-is/`               | The answer in the first paragraph                                            |
| 15  | why EST is ambiguous (long tail)            | `/guides/why-est-is-ambiguous/`             | Which EST, and why the abbreviation cannot be trusted                        |
| 16  | how to run a global standup (long tail)     | `/guides/how-to-run-a-global-standup/`      | A method, not a listicle                                                     |
| 17  | ISO 8601 format (head)                      | `/guides/iso-8601-explained/`               | The format, its traps, and the offset suffix                                 |
| 18  | the 2038 problem (long tail)                | `/guides/the-2038-problem/`                 | What breaks, when, and what to do                                            |
| 19  | half-hour and 45-minute offsets (long tail) | `/guides/offsets-that-are-not-whole-hours/` | Which zones, and why                                                         |
| 20  | time zones in code (long tail)              | `/guides/time-zones-in-code/`               | Store UTC, render local, never trust an abbreviation                         |

Every one of those URLs exists in all fourteen locales except the abbreviation pattern.

**The bet.** Rows 2–4 are 2,988 pages against a pattern of queries nobody types twice. That
is the whole strategy: a generated page earns its place only if it answers the query better
than a generic converter would, which is why each one carries a real hour table, a real
transition date and a pair-specific FAQ rather than a swapped-in city name.

---

## 3. Metadata rules the build enforces

These are not conventions. `scripts/seo-audit.mjs` fails the build when any of them breaks.

| Rule                                            | Enforced how                                                                                                              |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Title ≤ 60 characters, after the brand suffix   | `formatTitle` drops the suffix rather than overflow; `src/content/title-length.test.ts` fails on any source title over 60 |
| Description ≤ 155 characters                    | `truncateDescription`, cutting on a word boundary                                                                         |
| Titles unique within a locale                   | SEO audit: 4,556 unique titles across 4,556 indexable pages                                                               |
| Descriptions unique within a locale             | Same audit, same count                                                                                                    |
| One `<h1>` per page                             | SEO audit                                                                                                                 |
| Absolute canonical on every page                | SEO audit                                                                                                                 |
| Every `hreflang` target exists and reciprocates | SEO audit — 0 broken across 41,356 alternate links                                                                        |
| No English text on a translated page            | `scripts/i18n-leak.mjs` — 97,982 prose segments compared                                                                  |
| No broken internal link                         | `scripts/link-check.mjs` — 267,366 links                                                                                  |

The brand suffix rule is worth stating plainly: a title becomes `Something | YourWorldTime` only
when that fits in 60 characters. Thirty-seven titles across the locales do not fit, and they
ship without the brand rather than truncated. A reader searching for the page is looking for
the page.

---

## 4. hreflang

Every page carries a complete self-referencing cluster: one `<link rel="alternate">` per
locale the page exists in, plus `x-default` pointing at the English URL. The cluster is
built from the same function that generates the routes, so a page can only ever advertise a
translation that was actually built.

Two consequences worth knowing:

- **Abbreviation pages have a cluster of one.** They exist only in English, so they carry
  their own self-reference and `x-default`, and nothing else. That is correct, not a gap.
- **The language switcher is built from the cluster**, not from the locale list. A page that
  ships in one language shows no switcher rather than fourteen dead ends.

---

## 5. Structured data

Emitted through `JSON.stringify` — never string-concatenated — from
`src/lib/seo/structured-data.ts`.

| Schema                        | Where                                             |
| ----------------------------- | ------------------------------------------------- |
| `Organization`                | Every page                                        |
| `WebSite` with `SearchAction` | Home page only, per locale                        |
| `SoftwareApplication`         | Every tool page                                   |
| `BreadcrumbList`              | Every page below the root                         |
| `FAQPage`                     | Every tool page, every pair page, every city page |
| `HowTo`                       | Tool pages that describe a procedure              |
| `Article`                     | Every guide                                       |

The `SearchAction` points at `/world-clock/?q={search_term_string}`, and the world clock
reads that parameter. Structured data that describes a capability the site does not have is
a liability, so the two are held together by a smoke test.

---

## 6. Sitemaps and robots

- `sitemap-index.xml` → `sitemap-0.xml`, 4,556 URLs, 4.5 MB. Well inside the 50,000-URL and
  50 MB limits, so it stays one file until the page count roughly triples.
- Each entry carries `xhtml:link` alternates for every locale — 41,356 of them.
- Priority and change frequency come from `src/lib/seo/sitemap-policy.ts`, which is unit
  tested: tools above pairs, pairs above support pages, translations one notch below the
  English original.
- `robots.txt` disallows nothing. Blocking CSS or JavaScript would stop a crawler rendering
  the tools, which is the opposite of what this site needs.
- `llms.txt` describes the corpus for language models, and states which figures are computed
  at build time and which are computed in the reader's browser.

---

## 7. Internal linking

Every page is within three clicks of the home page.

- **Hubs**: `/convert/` (paginated, 14 pages), `/time-in/`, `/guides/`.
- **Pair pages** link to both city pages, to the reverse pair, and to six related pairs
  chosen deterministically from the same slug hash that picks the copy variants — so the
  graph is stable between builds rather than reshuffling on every deploy.
- **City pages** link to their most-searched pairs and to the guides that explain their
  quirks.
- **Guides** link to the tools that do what the guide describes.

No page is orphaned: the link checker walks every internal link on all 4,570 pages, and the
hub pages reach every generated URL.

---

## 8. What to monitor after launch

In Search Console, in the order they will actually matter:

1. **Indexed vs. discovered.** 4,556 submitted URLs will not all be indexed, and should not
   be expected to be. Watch the ratio, not the absolute. A pattern of "Crawled — currently
   not indexed" concentrated in one page type is the signal that type is too thin.
2. **`hreflang` errors.** Should be zero, and the build asserts it, but Search Console sees
   the deployed origin rather than `dist/`. A mismatch here means `PUBLIC_SITE_URL` is wrong.
3. **Core Web Vitals, field data.** Lab scores are 100 across all four Lighthouse categories
   on six URLs; field data is the one that counts and takes 28 days to appear.
4. **Which pair pages get impressions.** This tells you which of the 1,448 pairs deserve
   more than generated copy — and which of the 80 cities should not have been included.
5. **Queries the site ranks for that have no page.** The expansion playbook below.

---

## 9. Expansion playbook

In priority order, with the reason each is not already done:

1. **More cities.** `src/data/cities.ts` is validated against
   `Intl.supportedValuesOf('timeZone')` at build time, so adding a city is adding a record.
   80 was chosen because each new city adds itself plus its pairs plus fourteen locales; the
   marginal page is cheap and the marginal _good_ page is not.
2. **More pairs per city.** The pair set is A×A over the top 24 plus B×top-A. Widening B is
   a one-line change to `src/data/pairs.ts` and roughly 900 pages per step.
3. **More guides.** Twelve exist. The gap list, in the order a searcher would want them:
   leap seconds, why India is at +05:30, what happened to Kyiv's zone name, and how to test
   DST logic.
4. **Programmatic locales.** Non-English locales currently get 100 pairs each rather than
   all 1,448 — `LOCALISED_PAIR_LIMIT` in `src/config/flags.ts`. Raising it is a one-number
   change, and should follow evidence that the existing translated pages are being indexed,
   not precede it.
5. **A search endpoint.** The site has no backend, so the world clock's filter is the whole
   of it. A real search would need either a client-side index or a service, and neither is
   worth its weight until the corpus is being found.

Each of these adds pages. None of them adds a reason for someone to visit, which is what the
guides are for.
