# Content

How this site writes: the voice it is written in, what is hand-written and what is
generated, and the full inventory of sentence templates behind the 4,108 pages nobody wrote
one at a time.

---

## 1. Voice

The site's subject is a class of small, confident errors — "New York is five hours behind
London", "EST is Eastern time", "the day is 24 hours long". All three are wrong often enough
to cost someone a meeting. Everything here is written against that.

**Answer first.** The first sentence of every page answers the question in the URL. Context,
caveats and the interesting part come after. A reader who leaves after one line should leave
with the right answer.

**Say the uncomfortable thing.** "There is no hour where both cities are inside a working
day. Someone has to move." A page that pretends every problem has a tidy answer is a page
that gets ignored the first time it is wrong.

**No hedging as decoration.** "Roughly", "approximately" and "about" appear only where the
number really is approximate. Offsets are not approximate.

**No second person imperative stacks.** The guides explain a mechanism and let the reader
decide. They do not open with "Have you ever wondered…" and they do not close with a
call to action.

**Numbers are facts, and dated as such.** Anything computed at build time is written as a
fixed fact with its date visible. Anything that means _now_ is rendered in the browser.
No page says "currently" about something it computed three weeks ago.

**British-leaning international English**, in the English locale: "organisation", "-ise",
24-hour clocks in prose, ISO dates. The thirteen other locales are written to their own
conventions, not translated word-for-word from this one.

---

## 2. What is hand-written

| Content                 | Count                 | Where                                 |
| ----------------------- | --------------------- | ------------------------------------- |
| Guides                  | 12 × 14 locales = 168 | `src/content/guides/{locale}/`        |
| Tool page copy          | 10 tools × 14 locales | `src/content/tools/{en,locales/*}.ts` |
| Hub copy                | 3 hubs × 14 locales   | Same modules                          |
| UI strings              | 262 keys × 14 locales | `src/i18n/*.json`                     |
| Legal and support pages | 6 × 14 locales        | `src/pages/`                          |

The guides run 976–1,120 words, averaging 1,030. Each one exists because a specific wrong
belief is common enough to be worth dismantling:

| Guide                              | Title                                           | The belief it argues with                          |
| ---------------------------------- | ----------------------------------------------- | -------------------------------------------------- |
| `what-utc-really-is`               | What UTC really is, and how it differs from GMT | UTC is a time zone, and GMT is another word for it |
| `why-est-is-ambiguous`             | Why EST is ambiguous, and what to use instead   | An abbreviation identifies a zone                  |
| `how-time-zones-work`              | How time zones actually work                    | Zones follow lines of longitude                    |
| `why-daylight-saving-exists`       | Why daylight saving exists and who abolished it | It was for farmers                                 |
| `half-hour-offsets-explained`      | Why India runs half an hour off UTC             | Every offset is a whole hour                       |
| `offsets-that-are-not-whole-hours` | The UTC offsets that are not whole hours        | …and a 45-minute one cannot be real                |
| `the-international-date-line`      | The International Date Line, and why it bends   | It is a straight line down 180°                    |
| `iso-8601-explained`               | ISO 8601, and how to write a date unambiguously | Anything ISO-looking is ISO 8601                   |
| `the-2038-problem`                 | The 2038 problem, explained properly            | It went away with Y2K                              |
| `time-zones-in-code`               | Time zones in code, a practical guide           | Local time plus an offset is enough to store       |
| `scheduling-across-twelve-hours`   | Scheduling across a twelve-hour gap             | Someone can always be found awake                  |
| `how-to-run-a-global-standup`      | How to run a standup across many time zones     | A standup has to be synchronous                    |

`src/content/script-leak.test.ts` fails the build if a translated guide contains Latin text
that is not a product name, a standard, or an IANA identifier — so a partially translated
guide cannot ship.

---

## 3. What is generated

4,108 pages — city pairs, city pages and abbreviation pairs — are assembled from templates.
That is the only way 1,448 pair pages get written, and it is also the fastest way to make
1,448 pages that are worthless. Three rules keep them from being that.

**Every fact is computed, never written.** Offsets, differences, transition dates, hour
tables, daylight length and overlap windows all come from `Intl` reading the IANA database
at build time. No sentence contains a number a human typed.

**Every sentence has two forms, chosen by the slug.** `pickVariant(variants, slug, slot)`
hashes the page's own slug with the name of the sentence slot (FNV-1a plus a MurmurHash3
finalizer) and picks one. The same page therefore gets the same wording on every build —
diffs stay readable, and Google sees a stable page — while neighbouring pages differ.

**Every sentence is a dictionary key in all fourteen languages.** Generated copy is not
English with the nouns swapped. It is `t('pair.summary.ahead.1', { from, to, gap, landing })`
in the reader's language, with the duration formatted by `Intl.NumberFormat` unit style so
Russian's three plural forms and Japanese's missing space between numeral and counter come
out right without a rule in this repository.

### The slot inventory

Eleven slots carry two variants each, chosen per slug:

| Slot                  | Used on                              | Varies                             |
| --------------------- | ------------------------------------ | ---------------------------------- |
| `pair.summary.ahead`  | Pair pages where the target is ahead | The opening sentence               |
| `pair.summary.behind` | Pair pages where it is behind        | The opening sentence               |
| `pair.summary.same`   | Pair pages sharing a zone            | The opening sentence               |
| `pair.tableIntro`     | Every pair page                      | The line above the 24-hour table   |
| `pair.dst.both`       | Pairs where both observe DST         | The daylight-saving paragraph      |
| `pair.dst.one`        | Pairs where one does                 | The daylight-saving paragraph      |
| `pair.dst.neither`    | Pairs where neither does             | The daylight-saving paragraph      |
| `pair.call.some`      | Pairs with a shared working window   | The call-window paragraph          |
| `pair.call.none`      | Pairs with none                      | The call-window paragraph          |
| `pair.factsIntro`     | Every pair page                      | The line above the reference table |
| `city.summary`        | Every city page                      | The opening sentence               |

Two further slots vary by fact rather than by hash, because the fact is the sentence:
`city.summary.clause.dst` / `.noDst`, and `pair.landing.*` — the five words
(`morning`, `afternoon`, `evening`, `late night`, `small hours`) that name where midday in
one city lands in the other.

### FAQs

Pair pages carry five questions with ten answer forms — several questions have a different
answer depending on whether the cities share a zone, whether either observes daylight
saving, and whether their working days overlap. City pages carry four questions with eight
answers on the same principle. The answers are selected by the computed facts, not by hash:
a wrong answer chosen at random would be worse than no page.

---

## 4. Adding content

**A guide.** Write `src/content/guides/en/{slug}.md` with `title`, `description`, `summary`,
`publishedAt`, `updatedAt`, `order` and `keywords` front matter — the schema is in
`src/content.config.ts`, and a missing field fails the build rather than rendering blank. Then write the other thirteen. `npm run build` fails if any
locale is missing the file, and `script-leak.test.ts` fails if a translation is not one.
Keep the title under 60 characters and the description under 155 — there are tests for both.

**A city.** Add a record to `src/data/cities.ts`. The zone is validated against
`Intl.supportedValuesOf('timeZone')` at build time, so a typo fails the build rather than
producing a page about a place with no clock. Pairs, hub entries and hreflang clusters
follow automatically.

**A sentence variant.** Add `{slot}.3` to `src/i18n/en.json`, then to all thirteen others —
`scripts/i18n-parity.mjs` fails on a missing _or_ extra key, and on a placeholder that does
not match English. Then widen the `variants()` range in `src/lib/content/pair-copy.ts`. Do
not add a third English variant without thirteen translations: a page in Korean with an
English sentence in the middle is worse than a Korean page that repeats itself.

**A UI string.** Same rule. English is the contract; the parity script is the enforcement.

---

## 5. What is deliberately not written

- **No blog.** A dated post rots. The guides are undated in the body and rebuilt monthly.
- **No "top 10 cities" listicles.** They would rank, and they would be filler.
- **No AI-written filler to pad a thin page.** If a generated page has nothing to say beyond
  its table, the table is the page.
- **No testimonials, no counters, no "trusted by".** Nothing on this site claims a fact
  about the world that the site cannot compute.
