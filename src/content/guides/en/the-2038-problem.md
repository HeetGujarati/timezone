---
title: The 2038 problem, explained properly
description: At 03:14:07 UTC on 19 January 2038, signed 32-bit Unix time overflows. Here is what actually breaks, and what has already been fixed.
summary: Systems storing time as a signed 32-bit second count run out of room in January 2038 and wrap to December 1901. Most modern platforms fixed this years ago; the exposure now is embedded, legacy and serialised data.
publishedAt: '2026-01-15'
updatedAt: '2026-01-15'
order: 6
keywords: ['2038 problem', 'year 2038 bug', 'unix timestamp overflow', 'y2038']
related: ['time-zones-in-code', 'iso-8601-explained', 'what-utc-really-is']
---

At 03:14:07 UTC on 19 January 2038, the number of seconds since 1 January 1970 reaches 2,147,483,647. That is the largest value a signed 32-bit integer can hold. One second later it wraps to −2,147,483,648, which those systems read as 13 December 1901.

This is a real problem with a firm date, which makes it unusual among software problems.

## Why 32 bits

Unix time was designed in the early 1970s, when a 32-bit integer was a natural word size and 68 years of headroom seemed generous. The `time_t` type on those systems was a signed 32-bit integer, and that choice propagated into C, into every language that wrapped C, into file formats, into network protocols and into database schemas.

The signedness is what gives the wrap its distinctive symptom. An unsigned 32-bit count would last until 2106; a signed one splits its range around 1970, so overflow lands in 1901 rather than at zero.

## What has already happened

The 2038 problem has been failing in production for years, because software routinely computes dates in the future.

- Thirty-year mortgage calculations began crossing the boundary in 2008.
- Certificate expiry dates, cache TTLs and scheduled jobs have hit it repeatedly.
- In 2006 a bug in AOLserver's default database timeout — set to one billion seconds, which was fine until it was not — took the software down when the computed expiry overflowed.

The pattern is that the failure arrives long before the date, in whatever code looks furthest ahead.

## What is already fixed

The situation is considerably better than the panic implies.

- **64-bit systems**: `time_t` is 64 bits on essentially every 64-bit platform. That runs out in roughly 292 billion years.
- **Linux on 32-bit**: kernel 5.6 (March 2020) introduced 64-bit `time_t` on 32-bit architectures, and the major distributions have shipped the corresponding userspace.
- **JavaScript**: uses a double-precision float for milliseconds, valid to about 275,000 years either side of 1970. It has never had this problem.
- **Java**: `Instant` uses a 64-bit second count plus nanoseconds.
- **Python**: integers are arbitrary precision; the constraint is the platform's C library.
- **PostgreSQL, MySQL 8.0.28+, SQL Server**: 64-bit timestamp storage.

## Where the exposure remains

**Embedded systems.** Industrial controllers, medical devices, vehicle electronics, meters and sensors, many designed for 20- or 30-year service lives, many with no update path, many already deployed. This is the bulk of the real risk, and it is not centrally tracked.

**MySQL's `TIMESTAMP` type before 8.0.28.** It is a 32-bit second count and its documented maximum is 2038-01-19 03:14:07. `DATETIME` was never affected. A great deal of production data sits in the affected column type.

**Serialised data and file formats.** Anything that wrote a 32-bit time field is still a 32-bit time field however new the reader is. Old archive formats, binary protocols and on-disk structures carry the constraint forward.

**32-bit builds still in service.** Some routers, set-top boxes and long-lived appliances run 32-bit userspace against an unpatched kernel.

## What to do about it

**Audit storage types.** Look for `int(11)` columns holding timestamps, MySQL `TIMESTAMP` on old versions, and any binary format with a 32-bit time field. These are where the data outlives the code.

**Test with dates past 2038.** Set a test fixture to 2040 and run your suite. Most 2038 bugs are trivially reproducible once someone tries.

**Prefer 64-bit integers or ISO 8601 strings.** A `BIGINT` of milliseconds or a `TIMESTAMPTZ` column has no horizon worth thinking about. An ISO 8601 string has none at all, at the cost of size and comparison speed.

**Do not store dates as 32-bit anything, ever again.** The storage saving is meaningless on modern hardware and the horizon is now inside the service life of ordinary software.

## The other date horizons

2038 is the near one, not the only one.

- **2036**: NTP's 32-bit era field rolls over on 7 February. NTPv4 handles it, but deployments vary.
- **2106**: unsigned 32-bit second counts wrap.
- **2262**: 64-bit _nanosecond_ counts overflow — which is Go's `time.Time` in its nanosecond representation, and pandas' default datetime64[ns].

That last one is closer than it sounds for anyone writing data-processing code, and it is the same mistake at a different scale: a unit fine enough to be useful, in a width that seemed generous at the time.

## How to check your own systems

Four checks, in increasing order of effort.

**Check your database column types.** In PostgreSQL, `SELECT column_name, data_type FROM information_schema.columns WHERE data_type LIKE '%timestamp%'` tells you what you have; `timestamp with time zone` is 64-bit and safe. In MySQL, look for `TIMESTAMP` columns on servers before 8.0.28 — those are the exposed ones, and `DATETIME` never was.

**Set a clock forward.** In a disposable container, set the system date to 2040 and run your test suite. This is crude and finds a surprising amount, because most 2038 bugs are not subtle once the date is past the boundary.

**Grep for 32-bit time types.** In C and C++, any explicit `int` or `long` holding a time value on a 32-bit target. In serialisation schemas, any 4-byte time field. In application code, any place a timestamp is cast to a 32-bit integer for storage or transmission.

**Test the far future in fixtures, not just the near future.** A test that uses "now plus a day" will pass until 2038 and then fail on a Tuesday. A test that uses an explicit 2040 date fails today, while someone is available to fix it.

## What not to do

Do not "solve" this by switching to unsigned 32-bit integers. It buys 68 years, loses the ability to represent any date before 1970, and pushes the same conversation onto whoever maintains the system in 2106. The storage difference between 4 and 8 bytes is not worth a second migration.

Do not assume a modern language protects you. Application code can be perfectly safe while the data it reads was written by something that was not — file formats and wire protocols carry the constraint across every rewrite.
