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
