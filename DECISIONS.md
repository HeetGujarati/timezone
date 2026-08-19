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
