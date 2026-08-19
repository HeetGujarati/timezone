---
title: About Meridiem
description: Why this site exists, how it computes what it shows, and what it deliberately does not do.
order: 1
updatedAt: '2026-01-15'
---

Meridiem is a set of time zone tools built on one principle: never state a time fact that was not computed from the IANA time zone database at the moment it was needed.

## Why it exists

Most time zone tools are built on a stored table of offsets. That table is correct until a government changes its mind — which happens several times a year — and then it is silently wrong, in a way that looks like a human scheduling mistake rather than a software bug.

Every offset, transition date and conversion on this site is derived from the runtime's copy of the IANA database through the `Intl` API. There is no offset table in this codebase. When the database updates, a rebuild picks it up and the site is correct again with no code change.

## How it is built

- Every page is prerendered. There is no server, no database and no API.
- Absolute current times render in your browser, never in the page. A prerendered page cannot honestly claim to know what time it is now, so it does not try.
- Durable facts — offsets, transition dates, overlap windows — are computed at build time and stated as of that build.
- The site is rebuilt monthly, and on the first of March, April, October and November, so that database updates land before the dates they affect.

## What is here

Ten tools, 80 city pages, 1,448 city-pair conversions, 240 abbreviation conversions and twelve guides. Every generated page carries facts computed for that specific pair — the hour table, both cities' daylight saving dates, and the hours the two places genuinely share.

## What it deliberately does not do

- **No tracking.** No analytics, no cookies, no third-party scripts.
- **No accounts.** Countdowns and meeting plans live in the URL, so sharing a link is the whole feature.
- **No invented data.** Where a zone has no abbreviation in the IANA data, the offset is shown instead of a plausible-looking guess. Where no review data exists, no rating is claimed.
- **No network calls at runtime.** Sunrise and sunset are computed from latitude and longitude with the NOAA solar position algorithm rather than fetched.

## Corrections

If something here is wrong, it matters — the entire value of a reference is that it is right. Contact details are on the [contact page](/contact/).
