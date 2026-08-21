# Blocked — actions only the repository owner can take

Everything in this file is outside what the build agent can do from its sandbox. Nothing here
blocks development; each item blocks a _launch_ requirement. Items are ordered by urgency.

---

## 1. Make the repository private — REQUIRED BEFORE THE NEXT PUSH

**Why it is blocked:** the sandbox has no `gh` CLI and the GitHub tools available to it cannot
change repository settings. The repository was created public.

**Exact steps (about 30 seconds):**

1. Open <https://github.com/HITMAN5050/Timezone/settings>
2. Scroll to **Danger Zone** → **Change repository visibility** → **Change to private**
3. Type `HITMAN5050/Timezone` to confirm.

**Verify:**

```bash
gh repo view HITMAN5050/Timezone --json visibility
# expected: {"visibility":"PRIVATE"}
```

No credentials, tokens or `.env` files have ever been committed, so nothing sensitive was exposed
while it was public — but the brief requires private, and page templates plus the curated city
dataset are the product.

---

## 2. Enable repository hardening

Same reason: settings API is not reachable from the sandbox.

At <https://github.com/HITMAN5050/Timezone/settings/security_analysis>, turn on:

- **Secret scanning**
- **Push protection**
- **Dependabot alerts**
- **Dependabot security updates**

(`.github/dependabot.yml` is already committed and configures the weekly npm + Actions update
schedule. It does not enable _alerts_ — that is the switch above.)

---

## 3. Register the domain

**Why it is blocked:** this sandbox's egress proxy blocks RDAP and WHOIS, so availability could not
be checked programmatically. `curl https://rdap.verisign.com/...` fails with exit 56 and
`WebFetch` returns `EGRESS_BLOCKED`.

Candidates in preference order — check availability at any registrar and register one:

| Preference | Domain                          | Note                                     |
| ---------- | ------------------------------- | ---------------------------------------- |
| 1          | `YourWorldTime.app` / `YourWorldTime.com` | Chosen brand. From _ante/post YourWorldTime_. |
| 2          | `zonely.com`                    | Backup.                                  |
| 3          | `horaly.com`                    | Backup.                                  |

Then set `PUBLIC_SITE_URL` to the real origin — see `DEPLOY.md`. Until that happens, every canonical,
hreflang and sitemap URL points at the `https://YourWorldTime.app` fallback.

---

## 4. Create the `v1.0.0` tag

**Why it is blocked:** the sandbox's git credential is scoped to the working branch. A branch
push succeeds; `git push origin v1.0.0` is refused with `HTTP 403`, and `git ls-remote --tags`
comes back empty. The GitHub tools available here are read-only for tags and releases.

The tag was written locally with its message and then lost with the sandbox, so it has to be
made again from a machine with push rights. The commit it belongs on is the branch head.

```bash
git fetch origin claude/lets-cook-7ann03
git tag -a v1.0.0 origin/claude/lets-cook-7ann03 -m "YourWorldTime 1.0.0"
git push origin v1.0.0
```

`CHANGELOG.md` already links `v1.0.0` to the release page that tag creates, so the link is
dead until this is done.

---

## 5. `gitleaks` licence (only if this repo moves to an organisation)

`gitleaks-action` is free for personal accounts and public repositories. If `HITMAN5050/Timezone`
is ever transferred to a GitHub organisation, the action requires a `GITLEAKS_LICENSE` repository
secret or the **Secret scan** CI job will fail.
