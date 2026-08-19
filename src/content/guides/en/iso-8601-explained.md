---
title: ISO 8601, and how to write a date unambiguously
description: 03/04/2026 means two different dates depending on who reads it. ISO 8601 fixes that, and its rules are worth knowing exactly.
summary: ISO 8601 exists because 03/04/2026 is March in America and April everywhere else. Writing 2026-04-03 removes the ambiguity, sorts correctly as text, and is what every API should accept.
publishedAt: '2026-01-15'
updatedAt: '2026-01-15'
order: 7
keywords: ['iso 8601', 'date format standard', 'timestamp format', 'rfc 3339']
related: ['what-utc-really-is', 'time-zones-in-code', 'the-2038-problem']
---

`03/04/2026` is 3 April in most of the world and 4 March in the United States. There is no way to tell which was meant from the string alone, and both readings are entirely reasonable. Every year, this ambiguity produces missed deadlines, double bookings and at least one memorable outage.

ISO 8601 is the international standard that removes it.

## The core format

```
2026-04-03T14:30:00Z
```

Reading left to right, largest unit to smallest:

- `2026-04-03` — year, month, day, each zero-padded, always in that order
- `T` — the separator between date and time, required in the strict form
- `14:30:00` — hours, minutes, seconds on a 24-hour clock
- `Z` — the zone designator. `Z` means UTC exactly

The ordering is the point. Because the components run from most significant to least, **an ISO 8601 string sorts correctly as plain text**. `2026-04-03` sorts before `2026-04-10` under simple string comparison, which no other common format manages. That property alone justifies the standard.

## Zone designators

Three forms are valid, and they mean different things:

| Form                        | Meaning                                                    |
| --------------------------- | ---------------------------------------------------------- |
| `2026-04-03T14:30:00Z`      | 14:30 UTC. Unambiguous                                     |
| `2026-04-03T14:30:00+05:45` | 14:30 local time in a zone 5h45m ahead of UTC. Unambiguous |
| `2026-04-03T14:30:00`       | 14:30 in an unspecified zone. **Not a timestamp**          |

The third form is the one that causes trouble. It is a _local date-time_ — a wall-clock reading with no way to place it on a timeline. Passing one across a system boundary and hoping the other side assumes the same zone you did is a bug waiting for a deployment to a different region.

Note also what an offset is not: `+05:45` tells you Nepal's offset, not that the timestamp is in Nepal. Offsets are not zones — the same offset is shared by several zones, and a zone's offset changes. Store the identifier alongside if you need to know where.

## RFC 3339, the profile you probably want

ISO 8601 is large. It permits week dates (`2026-W14-5`), ordinal dates (`2026-093`), fractional units, and a truncated form that omits the century. Most of that is not what you want in an API.

RFC 3339 is a tightened profile for internet protocols. It requires the full date, requires a zone designator, and permits either `T` or a space as the separator. When someone says "ISO format" in the context of an API, they almost always mean RFC 3339.

**A useful rule:** accept anything a good parser will take; emit only strict RFC 3339 with a `Z`.

## Durations and intervals

Less used, and worth knowing when you meet them.

**Durations** start with `P` for period, and `T` separates date parts from time parts:

- `P3Y6M4D` — three years, six months, four days
- `PT1H30M` — one hour thirty minutes
- `P1DT12H` — one day twelve hours

The `T` is not optional: `P1M` is one month, `PT1M` is one minute. This is the classic ISO 8601 duration bug.

**Intervals** join two points with a solidus: `2026-04-03T14:00Z/2026-04-03T16:00Z`, or a point and a duration: `2026-04-03T14:00Z/PT2H`.

The `HowTo` structured data on this site uses duration syntax — `PT2M` for a two-minute task — because schema.org specifies ISO 8601 durations.

## Week dates, and the trap in them

`2026-W14-5` is Friday of the fourteenth ISO week of 2026. ISO weeks start on Monday, and week 1 is the week containing the first Thursday of January.

The consequence people trip over: **the ISO week year is not always the calendar year**. 1 January 2027 falls in ISO week 53 of 2026. Formatting code that pairs an ISO week number with a calendar year produces a date that is wrong for a few days every year — and in most languages the format specifiers look almost identical (`YYYY` versus `GGGG`, or `%Y` versus `%G`).

## Practical rules

1. **Store UTC, emit `Z`.** `2026-04-03T14:30:00Z` has exactly one meaning everywhere.
2. **Never emit a naive local date-time across a boundary.** If you cannot attach a zone, you do not have a timestamp.
3. **Zero-pad everything.** `2026-4-3` is not valid ISO 8601, even though most parsers accept it.
4. **Use `-` and `:` separators.** The compact form (`20260403T143000Z`) is legal but unfriendly, and some parsers reject it.
5. **Keep the zone identifier separately** when you need to know _where_, not just _what offset_. `Europe/London` survives a rule change; `+01:00` does not.

## Parsing pitfalls

Even with a standard, parsing is where things go wrong.

**JavaScript's `Date` constructor is inconsistent for non-ISO input.** `new Date('2026-04-03')` is parsed as UTC midnight. `new Date('2026-04-03T00:00:00')` — no zone designator — is parsed as _local_ midnight. The two differ by your offset, which means the same code produces different days depending on where it runs. Always include a zone designator.

**Two-digit years are ambiguous and should be rejected.** ISO 8601 permits a truncated form; almost nothing should accept it. `26-04-03` could be 1926 or 2026, and the sliding window that resolves it is a policy decision hiding in a parser.

**Fractional seconds vary in precision.** `14:30:00.5`, `14:30:00.500` and `14:30:00.500000` are all valid and all the same instant. A parser that compares strings rather than instants will disagree.

**The comma is legal.** ISO 8601 permits `14:30:00,5` — a decimal comma — and prefers it. Most parsers reject it. If you are consuming data from a European system, be ready.

**Midnight has two spellings.** `24:00:00` on one day is the same instant as `00:00:00` on the next, and both are valid ISO 8601. Emit the second form; accept both.

## A note on sorting

The sortability of ISO 8601 holds only for strings in the same zone representation. `2026-04-03T14:00:00Z` and `2026-04-03T10:00:00-05:00` are the same instant, but as strings the second sorts earlier.

If you are sorting timestamps as text — in a log file, a filename, a database column typed as text — normalise them all to UTC with a `Z` first. Otherwise the ordering is a property of the formatting, not of time.
