# Security

Meridiem is a static site: prerendered HTML, CSS, a little JavaScript, and no server of its
own. That shape removes most of the usual attack surface — there is no database to inject
into, no session to steal, no API to abuse, no user accounts to compromise — and concentrates
what remains into three places.

## Threat model

### 1. Supply chain — the realistic one

The build runs npm packages with full filesystem access on a machine that then publishes to
production. A compromised dependency is the single most plausible way this site ships something
malicious, and it would not look like an attack from the outside.

Controls:

- **Every dependency is pinned to an exact version.** No `^`, no `~`, no surprise minor
  releases. The lockfile is committed and CI runs `npm ci`, never `npm install`.
- **`npm audit --audit-level=high` fails the build**, across the whole tree with no
  `--omit=dev`. That gate is why this site runs Astro 7 rather than the Astro 5 the original
  brief specified — every release up to 7.0.9 carries eight unfixed high-severity advisories,
  and shipping them would have made the gate impossible to pass honestly. See `DECISIONS.md` D3.
- **Lighthouse CI is invoked with `npx`, not installed.** It drags in five high-severity
  advisories through `puppeteer-core`, none of which can reach the published artefact. Keeping
  it out of the dependency tree means the audit gate stays honest rather than being weakened
  to accommodate a CI-only tool.
- **Dependabot** proposes weekly npm and GitHub Actions updates; each is a reviewable pin change.
- **gitleaks** scans every push. **CodeQL** runs weekly with `security-extended`.
- **Every GitHub Action is pinned to a full commit SHA**, not a tag. A tag can be moved; a SHA
  cannot. Workflows declare `permissions: contents: read` and elevate only per job.

### 2. Injection through URL parameters

Several tools read state from the query string: the converter's zones and date, the meeting
planner's zone list, the countdown's title. Those values arrive from a URL that someone else may
have written and sent.

Controls:

- **Nothing reaches the DOM as HTML.** Islands build nodes with `createElement` and set
  `textContent`. ESLint bans `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `eval`,
  `new Function` and string-bodied `setTimeout`/`setInterval`, and the build fails on any of them.
- **`set:html` is confined to one component.** `src/components/JsonLd.astro` is the only file
  permitted to use it. `scripts/audit-set-html.mjs` fails the build if it appears anywhere else
  in `src/`, and that check runs before the tests.
- **Zone identifiers are validated against the IANA list** before use. An unrecognised zone is
  discarded, not passed through.
- **Dates and times are pattern-checked and calendar-checked.** `2026-02-30` is rejected.
- **The countdown title** — the only free-text value on the site — is stripped of control,
  zero-width and line-separator characters and capped at 80 characters. It is then written with
  `textContent`. Both defences are tested.
- **`localStorage` is treated as hostile input.** Every read is wrapped in try/catch and
  schema-validated; a tampered value is discarded rather than trusted.

### 3. Third-party scripts, if advertising is ever enabled

The site currently loads nothing from another origin — not a font, not an analytics beacon, not
an image. That is what allows `connect-src 'self'` and `default-src 'none'`.

Turning on advertising would mean widening the CSP for a script that runs arbitrary code from a
network the site does not control. `DEPLOY.md` documents exactly which directives that requires
so the decision is explicit rather than incremental.

## The Content Security Policy

```
default-src 'none'; script-src 'self' 'sha256-…'; style-src 'self'; img-src 'self' data:;
font-src 'self'; connect-src 'self'; manifest-src 'self'; form-action 'none';
frame-ancestors 'none'; base-uri 'none'; object-src 'none'; upgrade-insecure-requests
```

**No `'unsafe-inline'`. No `'unsafe-eval'`. No exceptions.**

### How the inline script is permitted without weakening the policy

The site emits exactly one inline script: the theme setter, which reads a stored preference and
stamps `data-theme` on `<html>` before first paint. It must be inline and it must run before
paint, or a reader who chose dark mode gets a white flash on every navigation.

`src/integrations/csp-hashes.ts` runs on `astro:build:done`. It walks every built HTML file,
extracts each inline `<script>` that is _not_ a data block, computes its SHA-256, and rewrites
the `__CSP_SCRIPT_SRC__` placeholder in `dist/_headers` with `'self'` plus those hashes. It then
emits the identical policy into `dist/netlify.toml` and `dist/vercel.json`, generated rather than
hand-maintained so the three can never disagree.

Two properties follow:

- **The hash tracks the script.** Change one byte of the theme script and the hash changes with
  it. An attacker who could inject a script into the HTML cannot make it match an existing hash.
- **The build fails loudly rather than shipping an open policy.** If the placeholder is missing,
  the integration throws. If the placeholder survives into `dist`, `scripts/audit-headers.mjs`
  catches it. Both run before deploy.

### Why JSON-LD blocks are not hashed

`<script type="application/ld+json">` is a _data block_ under the HTML specification: the
"prepare the script element" algorithm returns early for a non-JavaScript type, before the CSP
check ever runs. Browsers never execute it and never CSP-check it.

Hashing all 4,570 unique JSON-LD blocks into one header would produce an unusable policy for no
security benefit. Instead the risk is closed at the source: `JsonLd.astro` serialises with
`JSON.stringify` and then escapes `<`, `>` and `&` to their `\u00xx` forms, so a value containing
`</script>` cannot terminate the block early. A test asserts this against
`</script><img src=x onerror=alert(1)>`.

## Other headers

| Header                         | Value                                                                   | Why                                                                              |
| ------------------------------ | ----------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `Strict-Transport-Security`    | `max-age=63072000; includeSubDomains; preload`                          | Two years, subdomains included, preload-list eligible                            |
| `X-Content-Type-Options`       | `nosniff`                                                               | Stops a `.txt` being executed as script                                          |
| `Referrer-Policy`              | `strict-origin-when-cross-origin`                                       | Never leaks a path to another origin                                             |
| `Permissions-Policy`           | geolocation, camera, microphone, payment, usb, interest-cohort all `()` | The site needs none of them; denying them means an injected script cannot either |
| `Cross-Origin-Opener-Policy`   | `same-origin`                                                           | Isolates the browsing context                                                    |
| `Cross-Origin-Resource-Policy` | `same-origin`                                                           | Stops other origins embedding the resources                                      |
| `X-Frame-Options`              | `DENY`                                                                  | Belt and braces alongside `frame-ancestors 'none'`                               |

`scripts/audit-headers.mjs` checks all of them against the built output on every CI run, and
verifies the policy is byte-identical across the three host formats.

## What this site does not do

- No cookies. None at all, first- or third-party.
- No analytics, no tracking, no fingerprinting.
- No network requests to any origin but its own, at build time or at runtime.
- No user accounts, no authentication, no sessions.
- No form submissions — `form-action 'none'` means the browser refuses them.
- No user-generated content that persists anywhere.

## Reporting a vulnerability

Email the address in [`/.well-known/security.txt`](public/.well-known/security.txt). Please
include what you did, what happened, and what you expected.

**In scope:** anything that achieves script execution on the origin, anything that makes the site
emit a response it should not, and dependency compromise affecting the published artefact.

**Out of scope:** missing headers on third-party hosts, scanner output with no demonstrated
impact, and social engineering.

There is no bug bounty. Reports are read and acted on regardless.
