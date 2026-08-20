# Decisions

Every judgement call that shaped this build, with the reasoning. Newest phase last.

---

## Phase 1 — bootstrap

### D1. Build in the existing repository, at its root

**Brief said:** create a new local directory `timezone-tools` and `gh repo create timezone-tools --private`.

**What happened:** the build sandbox has no `gh` CLI, and its GitHub access is scoped to
`HITMAN5050/Timezone` alone. Creating a second repository is impossible, not merely inconvenient.

**Decision:** build at the root of `HITMAN5050/Timezone`, on branch `claude/lets-cook-7ann03`.
Root rather than a `timezone-tools/` subdirectory, because Cloudflare Pages and Netlify both then need
zero "root directory" configuration — one less thing for a first-time deployer to get wrong.

### D2. The repository is public and the agent cannot change that

Recorded in `BLOCKED.md` as owner action 1. No secret has ever been committed (`.env` is gitignored;
only `.env.example` exists), so the exposure is the source code itself, not credentials.

### D3. Astro 7.2.4, not Astro 5.x — forced by the security gate

**Brief said:** Astro 5.x, "use exactly this".

**Conflict:** the brief also requires `npm audit --audit-level=high` to fail the build (§12) and the
definition of done requires zero high or critical vulnerabilities (§17.8). Every Astro release
`<= 7.0.9` carries eight unfixed high-severity advisories:

- GHSA-j687-52p2-xcff — XSS in `define:vars` via incomplete `</script>` sanitisation
- GHSA-jrpj-wcv7-9fh9 / GHSA-f48w-9m4c-m7f5 — XSS via unescaped spread attribute names
- GHSA-7pw4-f3q4-r2p2 / GHSA-4g3v-8h47-v7g6 — XSS via unescaped `transition:*` / View Transition values
- GHSA-8hv8-536x-4wqp — reflected XSS via unescaped slot name
- GHSA-2pvr-wf23-7pc7 — host-header SSRF in the prerendered error page fetch
- GHSA-xr5h-phrj-8vxv — server-island parameter replay
- plus vulnerable transitive `esbuild` and `sharp`

Pinning 5.x would ship a public site on a framework with eight known XSS holes _and_ make the required
audit gate impossible to pass. The two instructions cannot both be satisfied.

**Decision:** Astro **7.2.4**. Nothing else in the brief changes — `output: 'static'`, islands, no SSR
adapter, no server runtime. `npm audit` now reports **0 vulnerabilities** across 505 packages.

### D4. ESLint 9.39.5 with `eslint-plugin-astro` 1.7.0

`eslint-plugin-astro` 2.x and 3.x declare `peerDependencies: { eslint: ">=10", eslint-plugin-jsx-a11y: ">=6.10.2" }`,
but the newest `eslint-plugin-jsx-a11y` (6.10.2) declares `eslint: "^3 … ^9"`. That combination cannot
resolve. The alternative was `--legacy-peer-deps`, which silently installs a tree npm considers broken
and would make `npm ci` in CI unreliable.

**Decision:** pin the last self-consistent set — ESLint 9.39.5 + `eslint-plugin-astro` 1.7.0 +
`eslint-plugin-jsx-a11y` 6.10.2 + `typescript-eslint` 8.67.0. Flat config throughout, as the brief
requires, and the tree resolves cleanly with no override flags.

### D5. Lighthouse CI is invoked with `npx`, not installed as a dependency

`@lhci/cli` drags in `puppeteer-core` → `@puppeteer/browsers` → `extract-zip`, plus `tmp` and `uuid` —
five high-severity advisories, none of which can reach the shipped artefact (the deploy output is
static HTML, CSS and a little JS). Keeping it in `devDependencies` would either fail the audit gate or
force the gate to be weakened to `--omit=dev`.

**Decision:** the Lighthouse job runs `npx @lhci/cli@0.15.1 autorun`. The production audit gate stays
`npm audit --audit-level=high` over the _whole_ tree with no exclusions, and it passes honestly.

### D6. Brand name: **Meridiem**

Chosen against the brief's constraint that the name must not be a generic exact-match domain string.
_Meridiem_ comes from _ante/post meridiem_ — it means time to a reader in almost any language without
being a keyword. Two syllables to say, one to remember, and it does not describe the tool, so the
brand can outgrow "time zone converter" later. Backups: **Zonely**, **Horaly**.

Availability could not be verified: the sandbox egress proxy blocks RDAP and WHOIS
(`curl` exit 56, `WebFetch` → `EGRESS_BLOCKED`). Registering is owner action 3 in `BLOCKED.md`.

### D7. Astro's `i18n.locales` is fed URL segments; BCP-47 tags live in the app

Astro's config types derive `defaultLocale` from the literal element types of `locales`, so a
`.map()`-produced array of mixed `string | { path, codes }` collapses the inferred type to `never`.
Writing the 14 locales out a second time in `astro.config.ts` would create exactly the drift risk the
single source of truth exists to prevent.

**Decision:** Astro receives lowercase URL segments (`'pt-br'`, `'zh-hans'`), derived from
`src/config/locales.ts` by `.map()`. The BCP-47 tags used for `<html lang>`, hreflang clusters and
every `Intl` call are read from that same file. One record per locale, two representations, no
duplication.

### D8. Node 22.22.2 with full ICU — verified, not assumed

`process.versions.icu` reports 78.2 and `Intl.supportedValuesOf('timeZone')` returns 418 zones.
Spot-checked the hardest case first: `Asia/Kathmandu` formats as GMT+05:30 at the Unix epoch and
GMT+05:45 today, which is correct — Nepal moved to +05:45 in 1986. The `Intl`-only time engine the
brief requires is viable on this runtime.

---

## SEO architecture (brought forward from Phase 8 at the owner's request)

The owner supplied a second brief — a Next.js App Router SEO architecture from a previous
project — and asked for the same strategy here. It is implemented in full, ported to Astro.

### D9. The Next.js `Metadata` convention becomes an explicit engine

Next resolves metadata through an exported `Metadata` object per route. Astro has no such
convention, so the same guarantees are enforced structurally instead: `src/lib/seo/types.ts`
defines `ResolvedMetadata` with **every field required and already absolute**, and
`src/components/SeoHead.astro` is the only `<head>` renderer on the site. A page template
physically cannot ship without a canonical, an hreflang cluster, a robots policy or an OG image —
there is no code path that omits them.

`sitemap.ts` and `robots.ts` route handlers become: `@astrojs/sitemap` driven by a pure,
unit-tested policy module (`src/lib/seo/sitemap-policy.ts`), and `src/pages/robots.txt.ts`, a
prerendered endpoint so the sitemap URL follows `PUBLIC_SITE_URL`.

### D10. No fabricated `AggregateRating` — this is the one part of the spec not followed literally

The spec asked for `AggregateRating` with "e.g. 4.8 rating from 1000+ reviews". Emitting a rating
for reviews that do not exist is a direct violation of Google's structured-data policy, and on a
brand-new domain with no ranking history a manual action would be terminal — you would lose the
rich result _and_ the trust that the rest of this SEO work is built to earn. The master brief also
says plainly: never invent data.

`softwareApplicationSchema()` takes an optional `aggregateRating` and validates it: the field is
emitted only when `reviewCount > 0` and the value is inside 1–5. At launch nothing is passed, so
the property is absent from the JSON-LD entirely rather than present-and-false. When a genuine
review source exists, one argument turns it on. Tests assert all three behaviours.

### D11. `HowTo` schema is generated, with expectations set

Google removed HowTo rich results from Search in 2023, so this will not produce a visual rich
result today. It remains valid schema.org, it is read by other consumers, and the generator costs
nothing to keep — so it is built as asked, with steps deep-linked to page anchors. Just do not
expect a SERP change from it.

### D12. Description ceiling is 155, not 157

The spec said truncate at 157; the master brief asserts ≤ 155 across every built page. 155 satisfies
both, and the ellipsis counts _toward_ the limit rather than pushing past it. Truncation breaks at a
word boundary unless doing so would discard more than 40% of the snippet.

### D13. `keywords` meta is emitted, with no illusions

Google has ignored the keywords meta tag since 2009. It is emitted because the spec asked for it,
it is genuinely read by some smaller engines, and it costs a few bytes. The merge is
case-insensitively de-duplicated so page and global keyword sets cannot double up.

### D14. `set:html` is confined to one component and enforced by a script

`src/components/JsonLd.astro` is the only file allowed to use `set:html`. It serialises with
`JSON.stringify` and then escapes `<`, `>` and `&` to their `\u00xx` forms, closing the classic
JSON-LD breakout where a value containing `</script>` terminates the block early. A test asserts
the escape holds against `</script><img src=x onerror=alert(1)>`, and
`scripts/audit-set-html.mjs` fails the build if `set:html` appears anywhere else in `src/`.

---

## Phase 2 — the time engine

### D15. Offsets are measured, not parsed from a formatted string

`getOffsetSeconds` reads the wall clock in a zone with `formatToParts` and measures how
far it sits from UTC, rather than parsing the `timeZoneName: 'longOffset'` string. Both
approaches appear in the brief. Measuring wins on three counts: it is exact for the
sub-minute local-mean-time offsets in pre-1900 data, it does not depend on ICU's
formatting of the offset string, and the wall parts are needed anyway — so it is one
`Intl` call instead of two.

`hourCycle: 'h23'` is set explicitly because some ICU versions report midnight as hour 24
under `en-US`, which silently shifts the date by a day.

### D16. Ambiguous and non-existent local times: shift forward, take the earlier

Two days a year a wall-clock reading has no single correct answer.

- **Spring forward** deletes an hour. 02:30 on the US change-over date never happens.
  Policy: shift forward by the size of the gap, so 02:30 becomes 03:30. The alternative —
  clamping to the transition instant — collapses every vanished minute onto the same
  answer, which loses the user's intent entirely.
- **Fall back** repeats an hour. 01:30 happens twice. Policy: the first, earlier
  occurrence, still on daylight time. This matches ECMAScript's own `Temporal`
  `disambiguation: 'compatible'` default, so the site agrees with the platform.

Neither is applied silently. `parseLocalTimeInZone` returns a `resolution` of `exact`,
`gap-shifted` or `ambiguous-earlier` alongside the instant, and for the ambiguous case it
also returns the second occurrence — so a page can say what it did and offer the other one.

The gap size is read from the transition rather than assumed to be an hour, because Lord
Howe Island moves 30 minutes. A test asserts exactly that.

### D17. Daylight saving is detected by comparing against the year's minimum offset

There is no `Intl` API that answers "is DST active". The abbreviation is not reliable —
most zones have none, and ICU returns `GMT+5:45` for Kathmandu. So `isDstActive` compares
the offset at the instant against the smallest offset the zone uses that year: daylight
saving always moves clocks forward, so the minimum is standard time. This is correct in
the southern hemisphere, where that minimum falls mid-year, and it is correct for Lord
Howe, where the gap is half an hour rather than a whole one.

### D18. Transitions are found by a six-hour scan, then bisected to the second

A coarse probe every six hours across the year cannot step over a transition — no zone in
the IANA database has ever changed offset twice within six hours — and each hit is then
halved down to a one-second interval, which is the finest granularity the database
expresses. Roughly 12ms per zone-year, memoised per `(zone, year)`, so the 80-city build
pays it once.

Verified against the real 2026 calendar: US 8 March and 1 November; EU 29 March and
25 October at 01:00 UTC in every member zone simultaneously; Sydney and Auckland inverted;
Lord Howe ±30 minutes; Tehran, Mexico City and São Paulo with zero transitions.

### D19. Sunrise and sunset are computed, not fetched

The NOAA solar position algorithm in `src/lib/time/sun.ts` is about 120 lines of
arithmetic and needs no API, which keeps the "zero third-party calls" constraint intact
and means city pages cannot be broken by someone else's rate limit. Verified against
published values: London 04:43/21:21 on the summer solstice and 08:04/15:53 on the winter
one, both exact to the minute. Polar day and polar night are returned as explicit states
rather than as a null that a template might render as "--".

---

## Phase 5 — the programmatic layer

### D20. City zones are validated by construction, not by `supportedValuesOf`

**Brief said:** verify each city's IANA identifier against `Intl.supportedValuesOf('timeZone')`.

**What that would have done:** rejected `Asia/Kolkata`. This runtime's `supportedValuesOf` returns
the _legacy_ primary identifier for eighteen zones — `Asia/Calcutta`, `Europe/Kiev`,
`Asia/Katmandu`, `Asia/Saigon`, `America/Godthab` and others — because ECMA-402 leaves the choice
of primary identifier to the implementation. `Asia/Kolkata` is not in the list, yet it is the
correct modern name and the one every developer expects.

**Decision:** validate by constructing an `Intl.DateTimeFormat`, which accepts both the modern name
and the legacy alias. Zone _identity_ comparisons go through `canonicalZoneId()` rather than string
equality, so `Asia/Kolkata` and `Asia/Calcutta` compare equal. The picker maps the eighteen legacy
identifiers to their modern names, and tests assert each modern name still resolves to the same
zone as its legacy form — if a future ICU breaks that, the build fails rather than the site quietly
offering "Calcutta" to a reader in 2026.

### D21. Zone abbreviations come from a locale cascade

`en-US` knows EDT and PDT but calls London "GMT+1". `en-GB` knows BST and CEST but calls New York
"GMT-4". No single English locale covers the world, so `getZoneAbbreviation` tries `en-US`,
`en-GB`, `en-AU`, `en-IN`, `en-IE`, `en-NZ` in order and takes the first that returns letters.

Where none does — Tokyo, Shanghai, São Paulo — it returns the offset form. Inventing "JST" because
it looks plausible would break the one promise this site makes about its data.

A useful side effect: the cascade surfaces the IST collision. Europe/Dublin and Asia/Kolkata both
abbreviate to IST, four and a half hours apart, which is exactly the ambiguity the abbreviation
pages exist to warn about. A test asserts the collision is real rather than folklore.

### D22. Page counts are exactly as planned, not as large as possible

1,448 city pairs (552 Tier A cartesian + 896 Tier B against the eight busiest hubs, both
directions), 80 city pages, 240 abbreviation pairs. The full 80 × 79 city product would be 6,320
pages; the extra 4,872 would be pages nobody searches for, competing for crawl budget with the ones
people do. A test asserts the set stays under 2,000 so a future "why not add more" cannot pass
review silently.

### D23. Deterministic copy variants, and the hash bug that nearly broke them

Every generated slot has at least four phrasings, selected by hashing `slug + slot`. FNV-1a alone
has weak avalanche in its low bits, and `hash % 4` reads only those two bits — the first
implementation collapsed to a single variant, which would have shipped 1,448 pages sharing one
sentence. Adding MurmurHash3's finalizer before the modulo fixed it, and a distribution test now
fails if any variant is chosen fewer than 60 or more than 140 times in 400 draws.

Two grammar bugs surfaced the same way and are now covered by tests: "Singapore ahead of." (the word
"ahead" needs "of" before a city name and nothing after it at the end of a clause) and "a 5 hours
shift". Verified output: 1,448 unique titles and 1,448 unique opening sentences.

### D24. Abbreviation pages compute at a date the abbreviation actually exists

EST does not exist in July. A page converting EST to CEST computed "today" would produce an offset
that is wrong for half the year, every year. Each abbreviation page picks a representative instant —
January or July, depending on hemisphere and whether the abbreviation is a daylight or standard
form — and says so on the page.

### D25. City and abbreviation names stay in Latin script in every locale

Transliterating eighty city names into thirteen writing systems means inventing 1,040 proper nouns
with nothing to check them against, and the brief forbids inventing data. `Intl.DisplayNames` covers
countries — those are real CLDR data and are localised — but it has no city vocabulary. So a Japanese
pair page reads "東京とベルリンの時差" only where CLDR supplies the name and keeps the Latin form
otherwise; the surrounding sentence, the country, the offsets and the durations are all localised.
A reader searching for a city types its Latin name at least as often as its transliteration, so the
cost is small and the alternative is fabricated data on 1,120 pages.

### D26. The brand suffix yields to the title when sixty characters will not hold both

`formatTitle` appends " | Meridiem" — eleven characters — leaving forty-nine for the title itself.
English guide titles fit; German, Russian and Turkish ones frequently do not, because the same
thought takes longer to say. Truncating the title to keep the brand would cut the words the reader
searched for and keep the word the search result already shows under the URL. So the suffix is
dropped whenever appending it would exceed sixty characters, and `src/content/title-length.test.ts`
fails if any raw title exceeds sixty on its own. One Turkish guide title was shortened to comply;
no other content changed.

### D27. Open Graph cards are per entity and carry English wording

Generating one card per URL means 4,570 renders; generating one per entity means 1,791, because all
fourteen locales of `/convert/tokyo-to-berlin/` reference the same `/og/convert/tokyo-to-berlin.png`.
The build takes 79 seconds for the entity set and would take over three minutes for the URL set,
for a picture most readers never see at full size.

The consequence is that a shared card can only be in one language, and it is English: the integration
takes the wording from the page whose path has no locale prefix. A Japanese reader who shares a
Japanese page gets a Japanese title in the link text and an English card beneath it. That is a real
cost, accepted deliberately. Should it become worth paying for, the fix is one line — key the card
map on the page path rather than the image path — plus a locale segment in the `ogImage` templates
and a Devanagari/Arabic/CJK font in the Satori font stack, which is the part that actually costs.

Cards are enumerated from the built HTML rather than from a route list, so an image is generated
exactly when a page asks for one. `scripts/seo-audit.mjs` fails if any referenced card is missing.

### D28. Generated page copy lives in the dictionaries, two variants per slot

City-pair and city pages carry generated prose: an opening sentence, a table introduction, a
daylight-saving paragraph, a call-window sentence and five or six FAQ answers, all built from the
pair's computed facts. That copy was written in English inside `pair-copy.ts`, which meant all
fourteen locales rendered it in English — 2,340 pages of it, behind a green type check, a green
parity check and a green SEO audit, because none of those three can see a string a template never
looked up.

The shapes now live in the flat i18n dictionaries. Two reasons rather than one. The parity script
already fails the build when a locale lacks a key, so a half-translated pair page cannot ship. And
the grammar differs: English needs "ahead of" before a city name and "behind" bare, Japanese glues
the direction to the duration with no space, Chinese puts it first, Russian marks the city's role
with a preposition. A template per locale gets that right; an English template with a substituted
direction word gets it wrong in thirteen languages.

Each slot has **two** phrasings per locale rather than English's four. The variants exist to stop
the _shape_ repeating across pages; the facts interpolated into them differ per pair, so with a
hundred pairs per locale no two rendered sentences are alike either way. Two shapes over a hundred
pages is enough, and it halves a translation set that already runs to some six hundred strings.

`scripts/i18n-leak.mjs` now compares every translated page's rendered text against its English
counterpart and fails on any shared sentence. It found 3,475 distinct English strings on the first
run. What it deliberately does not compare: city names and zone identifiers, which stay Latin by
D25; code blocks, because code is code; the zone pickers, which list 400 IANA locations by their
English exonym; and the owner's unfilled legal placeholders.

## D29 — Islands find their controls by `data-role`, and a build audit proves it

The converter shipped for several days with its two `<select>` elements missing
`data-role="from"` and `data-role="to"`. The island's `connectedCallback` returned
at its first guard, so the site's headline tool sat inert on 3,002 pages. Nothing
in the toolchain noticed: TypeScript was satisfied, the bundle loaded, no console
error was raised, the HTML validated, and every audit passed. The page simply did
nothing when you used it.

Two things follow from that.

The contract stays `data-role` rather than `id`: an island can appear more than
once on a page, and roles scope to the element while ids do not. `ZoneSelect` now
takes an `islandRole` prop and is required to be given one. The prop is not called
`role` because a linter reasonably reads that as the ARIA attribute.

And `scripts/island-audit.mjs` reads both halves of the contract on every build.
It extracts the roles each island actually queries — the literal
`data-role="…"` selectors plus the arguments of the two helpers that take a role
as a string — and checks them against every page that carries the island's tag.
The roles are read out of the sources rather than listed in the script, so the
audit cannot fall out of step with the code it guards: an island that starts
looking for a new role fails the build until the markup grows one. `dst-filter`
mounts itself on a marker element it creates, so its tag never appears in the
built HTML; the audit recognises that pattern and checks its roles against the
pages that carry them instead.

## D30 — Browser-side wording travels as data, never as strings in the bundle

The converter and the difference tool both wrote "5 hours 45 minutes ahead" into
the page from JavaScript, in English, in all fourteen locales. It never showed up
in the i18n leak audit because that audit reads built HTML, and this text does not
exist until the reader types something.

The fix keeps the rule the rest of the islands already follow: no translated
string ships inside a bundle. The three sentence shapes are server-rendered onto
the host element as `data-diff-same`, `data-diff-ahead` and `data-diff-behind`,
the last two carrying a `{duration}` placeholder, and the island fills in a
duration formatted from CLDR through `Intl`. Russian's three plural forms and
Japanese's missing space between numeral and counter come out right without a
rule in the island, and the JavaScript budget carries no dictionary.

`describeDifference` — the English-only version in `src/lib/time/convert.ts` —
was deleted rather than left for something to fall back on.

## D31 — Lighthouse CI is fetched at run time, not declared as a dependency

`@lhci/cli` pulls in Puppeteer, which pulls in `extract-zip`, `tmp` and `uuid`
versions carrying seven high-severity advisories. Adding it to `devDependencies`
turns `npm audit --audit-level=high` from "found 0 vulnerabilities" into ten
findings, and the only offered fix is a downgrade to `@lhci/cli@0.1.0`.

Lighthouse is an instrument for measuring the site, not something the site is
built from — the same category as the Chromium binary the tests drive, which is
also not in `package.json`. So CI fetches it with `npx --yes @lhci/cli@0.15.1`,
version-pinned, and it never enters the lockfile. Nothing it brings with it is
installed on a contributor's machine by `npm ci`, and nothing reaches the
published site, which is a directory of static files.

This is stated here rather than left to be discovered, because a clean
`npm audit` that quietly excludes a tool is worth less than one that says which
tool it excludes and why.

## D32 — "Start" was too generic a word for the German home link

Lighthouse scored `/de/world-clock/` at 0.92 for SEO on one audit: `link-text`,
against the breadcrumb reading "Start". The word is on the list of link texts
that describe nothing — the German sibling of "click here" — and it appeared on
every German page.

It is now "Startseite", which names the destination. The other thirteen locales
already used a word that does: Início, Accueil, Ana sayfa, 首页.

## D33 — The site has a mark, because the browser was going to ask for one anyway

Meridiem shipped without a favicon of any kind. Every visit, in every browser,
requested `/favicon.ico`, got a 404, and logged it — which is how the site scored
96 rather than 100 on Lighthouse's best-practices category, and why the tab
showed a blank page icon next to a page about telling the time accurately.

The mark is a meridian: a circle divided down the middle, one half filled and one
half hollow, for the _ante_ and the _post_ of _ante meridiem_. It is two shapes
and one colour, drawn to survive being rendered sixteen pixels wide.

`public/favicon.svg` is the source; `scripts/make-icons.mjs` rasterises it into
the formats browsers still ask for — an ICO holding 16, 32 and 48 pixel images, a
180-pixel Apple touch icon, and the 192 and 512 the manifest names. Nothing is
hand-drawn twice, so changing the mark means changing one file and re-running the
script. The manifest carries a name and icons and nothing else: there is no
description in it to leave sitting in English on a Japanese page.

## D34 — Script fonts are named per language, not stacked globally

Arabic and Devanagari were listed in `dependencies` and imported nowhere, so `/ar/`
and `/hi/` — a seventh of the site — were set in whatever the reader's system
offered. Importing them and appending the two families to the default stacks
fixed those pages and quietly broke the others: a browser fetches a face the
moment its family is reached in the search for a glyph, even when it finds
nothing usable there. IBM Plex Sans Condensed ships no Cyrillic block, so every
Russian heading walked through Arabic and Devanagari on its way to the system
font, downloading 124KB it could not draw a single character with.

The stacks are now scoped with `:lang()`. Each script is named only on pages
written in it, so a German page loads five faces and a Hindi page loads seven,
and none of them loads a face it has no glyph for. Measured after the change:
122KB on `/de/`, 111KB on `/ru/`, 209KB on `/ar/`, 275KB on `/hi/`.

Two absences are deliberate rather than pending. Russian headings are set in the
variable family instead of the condensed one, because the condensed cut has no
Cyrillic and the alternative was a system font in the middle of the brand. And
Japanese, Korean and Chinese are left to the system font entirely: a CJK face
runs to megabytes, which no heading on a page about what time it is can justify.

## D35 — The analytics switch had to become real or stop being documented

`DEPLOY.md` told the owner to set `PUBLIC_CF_ANALYTICS_TOKEN` and redeploy, and said
"the snippet loads only when that variable is non-empty". There was no snippet. The
flag was read into `src/config/flags.ts` and consumed by nothing, so the documented
procedure would have produced a redeploy and no analytics — the worst kind of
missing feature, the kind that looks done.

It is now real: `src/components/Analytics.astro` renders the beacon when the token
is set and nothing at all when it is not, and the CSP integration widens
`script-src` and `connect-src` for exactly that one origin from the same
environment variable. Both halves read the same value, so a build cannot ship a
script its own policy blocks. Verified in both directions — with a token, the
policy names the origin and the page carries the beacon; without one, the policy
reads `connect-src 'self'` and the string "cloudflareinsights" appears nowhere in
`dist/`.

Cloudflare's beacon rather than any of the alternatives, because it sets no cookie
and stores no identifier. That keeps the cookie policy true and means analytics
does not drag the consent banner into the default build.
