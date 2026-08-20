# Deploy

Written for someone who has never used Cloudflare Pages. Follow it top to bottom and the site
is live. Nothing here assumes prior knowledge of the platform.

**Before you start**, there are two things only you can do — they are in [`BLOCKED.md`](BLOCKED.md)
and take about a minute between them. The most urgent is making the repository private.

---

## Part 1 — the 15-minute placeholder checklist

Fifteen things carry placeholder values. Fill them in before the first production build, or the
site goes live claiming to be operated by `[LEGAL ENTITY NAME]`.

| #   | What                     | Where                                                       | Currently                      |
| --- | ------------------------ | ----------------------------------------------------------- | ------------------------------ |
| 1   | Your domain              | `.env` → `PUBLIC_SITE_URL`                                  | `https://meridiem.app`         |
| 2   | Legal entity name        | `src/content/pages/en/privacy.md`, `terms.md`, `cookies.md` | `[LEGAL ENTITY NAME]`          |
| 3   | Jurisdiction             | same three files                                            | `[JURISDICTION]`               |
| 4   | Contact email            | `src/config/site.ts` → `contactEmail`                       | `hello@example.com`            |
| 5   | Security email           | `src/config/site.ts` → `securityEmail`                      | `security@example.com`         |
| 6   | Security email again     | `public/.well-known/security.txt`                           | `security@example.com`         |
| 7   | security.txt expiry      | `public/.well-known/security.txt` → `Expires`               | `2027-01-15`                   |
| 8   | security.txt canonical   | `public/.well-known/security.txt` → `Canonical`             | `https://meridiem.app/…`       |
| 9   | X / Twitter handle       | `src/config/site.ts` → `creator.x`                          | `@meridiemapp`                 |
| 10  | Creator URL              | `src/config/site.ts` → `creator.url`                        | `https://meridiem.app`         |
| 11  | AdSense publisher ID     | `public/ads.txt`                                            | comment only, no ID            |
| 12  | Site name, if you rename | `src/config/site.ts` → `name`                               | `Meridiem`                     |
| 13  | Legal page dates         | `src/content/pages/en/*.md` → `updatedAt`                   | `2026-01-15`                   |
| 14  | Guide dates              | `src/content/guides/en/*.md`                                | `2026-01-15`                   |
| 15  | Repository visibility    | GitHub settings                                             | **public — change this first** |

Find every remaining placeholder at any time:

```bash
grep -rn "LEGAL ENTITY NAME\|JURISDICTION\|example.com\|meridiem.app" src public --include="*.ts" --include="*.md" --include="*.txt"
```

---

## Part 2 — register a domain

Domain availability could not be checked from the build environment: its network proxy blocks
RDAP and WHOIS. Check these at any registrar and buy one:

| Preference | Domain                           | Why                                                           |
| ---------- | -------------------------------- | ------------------------------------------------------------- |
| 1          | `meridiem.app` or `meridiem.com` | The brand the site is built around. From _ante/post meridiem_ |
| 2          | `zonely.com`                     | Backup                                                        |
| 3          | `horaly.com`                     | Backup                                                        |

If you pick a different name, change `SITE.name` in `src/config/site.ts` and search the codebase
for `Meridiem`. The name appears in titles, JSON-LD and the footer; it is one constant, but it
does propagate.

`.app` is on the HSTS preload list, which means browsers require HTTPS for it before ever
contacting the server. That is a small security win and costs nothing.

---

## Part 3 — deploy to Cloudflare Pages

### 3.1 Create the account

1. Go to <https://dash.cloudflare.com/sign-up> and create an account if you do not have one.
2. Verify your email address.

### 3.2 Connect the repository

3. In the left sidebar, click **Workers & Pages**.
4. Click **Create application**, then the **Pages** tab, then **Connect to Git**.
5. Click **Connect GitHub**. A GitHub authorisation page opens.
6. Choose **Only select repositories**, pick `Timezone`, and click **Install & Authorize**.
7. Back in Cloudflare, select the `Timezone` repository and click **Begin setup**.

### 3.3 Configure the build

8. **Project name** — this becomes `your-project.pages.dev`. Use `meridiem`.
9. **Production branch** — `main`. (The work is currently on `claude/lets-cook-7ann03`; merge it
   to `main` first, or set this to that branch.)
10. **Framework preset** — select **Astro**. If it is not listed, leave it as _None_.
11. **Build command** — `npm run build`
12. **Build output directory** — `dist`
13. **Root directory** — leave empty. The project is at the repository root, deliberately.

### 3.4 Set the environment variable — do not skip this

14. Expand **Environment variables (advanced)**.
15. Click **Add variable**:
    - **Variable name**: `PUBLIC_SITE_URL`
    - **Value**: your real origin, with `https://` and **no trailing slash** — e.g. `https://meridiem.app`
16. Make sure it is set for **Production**. Add it for **Preview** too, pointing at the
    `.pages.dev` URL, so preview builds do not emit production canonicals.

> **This is the single most consequential setting on the page.** Every canonical URL, every
> hreflang link, every sitemap entry and every Open Graph URL is built from it. Get it wrong and
> 4,570 pages point a search engine at a host that is not yours. There is no runtime fallback
> that can fix it — the URLs are baked into the HTML at build time.

17. Click **Save and Deploy**.

The first build takes three to five minutes: it installs dependencies, generates 4,570 pages, and
renders the Open Graph images.

### 3.5 Attach your domain

18. When the build finishes, open the project and go to the **Custom domains** tab.
19. Click **Set up a custom domain**, enter your domain, and click **Continue**.
20. If the domain is already on Cloudflare, the DNS record is created for you — click
    **Activate domain**.
21. If it is registered elsewhere, Cloudflare shows a `CNAME` record to add at your registrar.
    Add it exactly as shown. Propagation is usually minutes.
22. Repeat for the `www` subdomain if you want it. Cloudflare redirects it automatically.

HTTPS is provisioned automatically. It can take up to fifteen minutes for the certificate to
issue; until then you may see a warning. That is expected.

---

## Part 4 — verify the deployment

Run these against your real domain. All four should pass.

### 4.1 Security headers

```bash
curl -sI https://your-domain.com/ | grep -iE "content-security-policy|strict-transport|x-frame|x-content-type|referrer-policy|permissions-policy"
```

You should see a `Content-Security-Policy` containing `script-src 'self' 'sha256-…'` and
**no `unsafe-inline`**. If the header is missing entirely, Cloudflare did not pick up
`dist/_headers` — confirm the build output directory is `dist` and redeploy.

### 4.2 Canonicals point at your domain

```bash
curl -s https://your-domain.com/ | grep -o '<link rel="canonical" href="[^"]*"'
```

If this shows `meridiem.app` and that is not your domain, `PUBLIC_SITE_URL` was not set at build
time. Fix it in the Cloudflare settings and **redeploy** — changing the variable alone does not
rebuild.

### 4.3 The sitemap is reachable

```bash
curl -s https://your-domain.com/sitemap-index.xml | head -5
curl -s https://your-domain.com/robots.txt
```

### 4.4 The site works with JavaScript disabled

Open the site in a browser with JavaScript turned off. The converter's live output shows an em
dash — that is correct and deliberate — but every offset, transition date, hour table and
explanation must be there and readable.

---

## Part 5 — submit to search engines

### Google Search Console

1. Go to <https://search.google.com/search-console> and sign in.
2. Click **Add property** → **Domain** → enter your domain (no `https://`, no `www`).
3. Google shows a `TXT` record. Add it in Cloudflare: **DNS** → **Add record** → type `TXT`,
   name `@`, content as shown.
4. Back in Search Console, click **Verify**. This can take a few minutes.
5. Open **Sitemaps** in the sidebar, enter `sitemap-index.xml`, click **Submit**.
6. Under **Settings → International targeting**, confirm no country is set. This site targets
   fourteen languages, not one country.

Indexing 4,570 pages takes weeks, not days. Do not resubmit the sitemap repeatedly; it does not
help.

### Bing Webmaster Tools

7. Go to <https://www.bing.com/webmasters> and sign in.
8. Click **Import from Google Search Console** — it copies the property and the sitemap in one
   step. Otherwise add the site manually and submit `sitemap-index.xml`.

Bing powers DuckDuckGo and ChatGPT search, so this is worth the two minutes.

---

## Part 6 — the Netlify alternative

Everything works identically on Netlify. `dist/netlify.toml` is generated at build time with the
same headers and the same CSP hash.

1. <https://app.netlify.com> → **Add new site** → **Import an existing project** → **GitHub**.
2. Authorise and select `Timezone`.
3. **Build command**: `npm run build` — **Publish directory**: `dist`
4. Click **Show advanced** → **New variable** → `PUBLIC_SITE_URL` = your origin.
5. **Deploy site**.
6. **Domain management** → **Add custom domain** → follow the DNS instructions.

Netlify reads `dist/netlify.toml` from the publish directory, so the headers apply automatically.
Verify with the same `curl -sI` as above.

---

## Part 7 — keeping it correct

### The rebuild schedule matters

`.github/workflows/rebuild.yml` triggers a fresh build monthly and on **1 March, 1 April,
1 October and 1 November**. Those dates are not arbitrary: they sit just before the northern and
southern daylight saving change-overs, so a tzdata update lands before the dates it affects.

For that to actually redeploy, Cloudflare must be watching the branch — which it is by default,
since the workflow pushes a commit. If you deploy manually instead, run the workflow and then
trigger a deploy yourself.

### When a country changes its rules

Nothing needs editing. The offsets come from the IANA database inside the Node runtime the build
uses; a rebuild picks up whatever version that runtime ships. That is the whole design.

### What to watch in Search Console

- **Coverage**: pages _discovered but not indexed_ is normal early on for a large programmatic
  site. Pages _excluded by noindex_ should be zero except `/404`.
- **International targeting**: hreflang errors here mean a locale URL is not resolving. The build
  gate should make that impossible — `npm run audit:seo` fails on it — so an error here means
  something diverged after deploy.
- **Core Web Vitals**: should be green from day one. If not, check that Cloudflare is serving the
  immutable cache headers on `/_assets/*`.

---

## Part 8 — enabling advertising

The site reserves ad slots but serves nothing. Before switching `PUBLIC_ADS_ENABLED` to `true`:

1. **Fill in `public/ads.txt`** with your AdSense publisher ID. AdSense will not approve the site
   without it.
2. **Get a certified CMP.** Google requires a Consent Management Platform certified under its
   own programme for EEA, UK and Swiss traffic before serving personalised ads. The consent
   banner in this repository is a functional placeholder, not a certified CMP — it gates script
   loading correctly but it is not on Google's list.
3. **Widen the CSP.** Advertising needs these directives added in `public/_headers`:

   ```
   script-src … https://pagead2.googlesyndication.com https://partner.googleadservices.com https://tpc.googlesyndication.com
   img-src 'self' data: https://pagead2.googlesyndication.com https://www.google.com
   frame-src https://googleads.g.doubleclick.net https://tpc.googlesyndication.com
   connect-src 'self' https://pagead2.googlesyndication.com
   ```

   Note what this costs: `default-src 'none'` and `connect-src 'self'` are the reason this site
   currently cannot exfiltrate anything. Adding an ad network's script means running code you do
   not control on your origin. That is the trade — make it deliberately.

4. **Update `/privacy/` and `/cookies/`** _before_ the first ad renders, not after. Both pages
   already describe what will change; move that text from future tense to present.

---

## Part 9 — optional cookieless analytics

Cloudflare Web Analytics is free, needs no cookie, and collects no personal data.

1. Cloudflare dashboard → **Analytics & Logs** → **Web Analytics** → **Add a site**.
2. Copy the token.
3. Add `PUBLIC_CF_ANALYTICS_TOKEN` as an environment variable and redeploy.

The snippet loads only when that variable is non-empty, and the CSP needs
`https://static.cloudflareinsights.com` added to `script-src` and `connect-src`. Leave it unset
and the site remains entirely free of third-party requests, which is the default and the
recommendation.
