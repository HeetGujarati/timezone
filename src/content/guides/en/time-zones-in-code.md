---
title: Time zones in code, a practical guide
description: Store UTC, keep the zone identifier, convert on display, never build an offset table. The rules and the reasoning behind each.
summary: Almost every time zone bug traces to one of four mistakes. This is what to do instead, in JavaScript, Python, Java, Go and SQL, with the reasoning rather than just the rule.
publishedAt: '2026-01-15'
updatedAt: '2026-01-15'
order: 9
keywords: ['time zones in code', 'datetime best practices', 'storing timestamps', 'utc in database']
related: ['what-utc-really-is', 'iso-8601-explained', 'the-2038-problem']
---

Almost every time zone bug in production traces to one of four mistakes: storing a local time, storing an offset instead of a zone, converting at the wrong layer, or building an offset table by hand. Everything below follows from avoiding those.

## Rule 1: store instants in UTC

An instant is a point on the timeline. A local time is a wall-clock reading, which needs a zone and a disambiguation policy before it means anything.

```sql
-- Good: an instant
created_at TIMESTAMPTZ NOT NULL

-- Bad: a wall-clock reading with no zone
created_at TIMESTAMP NOT NULL
```

PostgreSQL's `TIMESTAMPTZ` does not store a zone — it normalises to UTC on write and converts on read. That is exactly what you want for "when did this happen".

## Rule 2: store the zone identifier, not the offset

If you need to know _where_ — for a recurring event, a user preference, a business's opening hours — store `Europe/London`, not `+01:00`.

An offset is a fact about one instant. A zone is a rule set that survives a government changing its mind. Britain is `+00:00` in January and `+01:00` in July; storing either one and calling it "the user's zone" is wrong for half the year.

```sql
event_start_local  TIMESTAMP   NOT NULL,  -- the wall-clock time they chose
event_time_zone    TEXT        NOT NULL,  -- 'Europe/London'
event_start_utc    TIMESTAMPTZ NOT NULL   -- resolved instant, recomputed if rules change
```

For a recurring event, the local time and the zone are the source of truth; the UTC instant is a derived index. If tzdata changes — and it does, several times a year — the derived column is regenerated and the user's 09:00 stays 09:00.

## Rule 3: convert at the edge

Business logic works in instants. Conversion to a human-readable local time happens at the last possible moment, in the layer that knows who is reading.

The corollary matters more: **never let the server's own zone leak into behaviour**. Set `TZ=UTC` in your deployment environment and treat any code path whose result depends on the server's locale as a bug. This is the class of failure that only appears when someone deploys to a second region.

## Rule 4: never build an offset table

Every runtime ships the IANA database. Use it.

**JavaScript**

```js
// Format in a zone
new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Kathmandu',
  dateStyle: 'medium',
  timeStyle: 'short',
}).format(new Date());

// Get an offset without a library: compare the zone's wall clock to UTC
function offsetMinutes(timeZone, instant) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(new Date(instant));
  const get = (type) => Number(parts.find((p) => p.type === type).value);
  const asUtc = Date.UTC(
    get('year'),
    get('month') - 1,
    get('day'),
    get('hour'),
    get('minute'),
    get('second'),
  );
  return (asUtc - Math.floor(instant / 1000) * 1000) / 60000;
}
```

Set `hourCycle: 'h23'` explicitly. Some ICU versions report midnight as hour 24 under `en-US`, which shifts the date by a day and is a genuinely miserable bug to find.

**Python**

```python
from datetime import datetime, timezone
from zoneinfo import ZoneInfo  # standard library since 3.9

now = datetime.now(timezone.utc)
local = now.astimezone(ZoneInfo("Asia/Kathmandu"))
```

Never use `datetime.utcnow()`. It returns a naive datetime that _looks_ like UTC but carries no zone, and mixing it with aware datetimes raises at the worst moment. `datetime.now(timezone.utc)` is the correct call.

**Java**

```java
Instant now = Instant.now();
ZonedDateTime local = now.atZone(ZoneId.of("Asia/Kathmandu"));
```

`java.time` is well designed: `Instant` for points on the timeline, `LocalDateTime` for wall-clock readings with no zone, `ZonedDateTime` for both together. The type system enforces the distinction this guide keeps insisting on.

**Go**

```go
loc, _ := time.LoadLocation("Asia/Kathmandu")
local := time.Now().In(loc)
```

`LoadLocation` reads the system tzdata. In a scratch container there is none — import `_ "time/tzdata"` to embed it in the binary, or every zone lookup silently falls back to UTC.

## The two days a year

Spring forward deletes an hour; fall back repeats one. Pick a policy, apply it consistently, and tell the user what you did:

- **Non-existent local time** (02:30 on the US spring date): shift forward by the size of the gap, so 02:30 becomes 03:30.
- **Ambiguous local time** (01:30 on the US autumn date): take the first, earlier occurrence.

Those are the policies this site uses, and they match ECMAScript `Temporal`'s `disambiguation: 'compatible'` default — worth matching so your behaviour agrees with the platform.

The gap is not always an hour. Lord Howe Island shifts by 30 minutes, so read the size from the transition rather than assuming.

## Testing

Four cases catch most of it:

1. **A half-hour zone** — `Asia/Kolkata` (+05:30). Catches integer-hour assumptions.
2. **A 45-minute zone** — `Asia/Kathmandu` (+05:45). Catches half-hour assumptions.
3. **A southern-hemisphere zone** — `Australia/Sydney`. Catches "summer means June".
4. **Lord Howe Island** — `Australia/Lord_Howe`. Catches the hardcoded 60-minute shift, and nothing else will.

Add a spring-forward and a fall-back date for each zone your users are actually in, and pin the tzdata version in CI so a database update does not fail a build for the wrong reason.

## Recurring events are a different problem

A one-off event is an instant. A recurring event is a rule, and the two need different storage.

"Every Tuesday at 09:00 in Europe/London" is not "every 604800 seconds from this instant". The two diverge the moment Britain changes its clocks: the rule keeps the meeting at 09:00 local, while the interval drifts it to 08:00 or 10:00.

Store the rule — local time, zone identifier, recurrence pattern — and materialise instants from it. When tzdata changes, regenerate the materialised instants; do not migrate them. The rule is what the user agreed to.

The awkward cases follow from the two annual discontinuities. A meeting at 02:30 every day will find that on one spring day the time does not exist, and on one autumn day it happens twice. Pick a policy, apply it consistently, and be aware that different calendar systems have picked different ones — which is why the same recurring event can appear an hour apart in two people's calendars on exactly two days a year.

## A note on `Temporal`

ECMAScript's `Temporal` API replaces `Date` with types that distinguish instants, wall-clock times and zoned date-times, in the manner of `java.time`. `Temporal.ZonedDateTime` carries a zone identifier; `Temporal.Instant` is a point on the timeline; `Temporal.PlainDateTime` is a wall-clock reading with no zone, and the type system stops you confusing them.

Its `disambiguation` option exposes exactly the two-days-a-year policy this guide keeps returning to: `'compatible'` (the default — shift forward through gaps, take the earlier of an ambiguous pair), `'earlier'`, `'later'` and `'reject'`. The last one is worth considering for anything where being silently an hour out is worse than an error.
