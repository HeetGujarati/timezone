---
title: What UTC really is, and how it differs from GMT
description: UTC is a time standard kept by atomic clocks. GMT is a time zone kept by the earth. They usually agree, and the difference still matters.
summary: UTC is not a time zone. It is the reference standard every time zone is defined against, maintained by around 450 atomic clocks, and it never changes for daylight saving — which is exactly why systems use it.
publishedAt: '2026-01-15'
updatedAt: '2026-01-15'
order: 2
keywords: ['what is utc', 'utc vs gmt', 'coordinated universal time', 'utc explained']
related: ['how-time-zones-work', 'iso-8601-explained', 'time-zones-in-code']
---

People use "UTC" and "GMT" as if they were the same thing. Most of the time nothing goes wrong, because most of the time they show the same reading. But they are different kinds of object, and the difference explains why one of them is the right thing to store in your database and the other is not.

## UTC is a standard, not a place

Coordinated Universal Time is maintained by the International Bureau of Weights and Measures from a weighted average of around 450 atomic clocks in about 85 institutions worldwide. Those clocks measure the resonance frequency of caesium-133 atoms, which is stable to roughly one second in 100 million years.

Nobody's local time is UTC by law. Even Britain, which sits on the prime meridian, is on UTC+1 for seven months of the year. UTC is the fixed point from which every local time is described — the zero on the ruler, not a mark on the map.

The most important property, for anyone building software: **UTC never shifts for daylight saving**. It has no seasonal variation, no political history and no exceptions. That is the entire reason aviation, shipping, financial settlement and every distributed system in existence use it.

## GMT is a time zone with a job history

Greenwich Mean Time is the mean solar time at the Royal Observatory in Greenwich. It is defined by the earth's rotation, which is not a precision instrument: the planet wobbles, slows unevenly, and occasionally speeds up.

From 1884 until 1972, GMT was the world's time standard. It was replaced by UTC precisely because atomic clocks turned out to be a better reference than a planet. GMT survives as the name of a time zone — the one Britain uses in winter, and the one several West African countries use year-round.

So: **UTC never observes daylight saving. GMT, as used in the UK, does** — Britain leaves it every March for British Summer Time and returns every October. If a British colleague says "3pm GMT" in July, they almost certainly mean 3pm BST, which is 2pm UTC. This is a common enough error that it is worth asking rather than assuming.

## Why it is abbreviated UTC

Neither the English nor the French acronym won. English speakers proposed CUT for "coordinated universal time". French speakers proposed TUC for "temps universel coordonné". The International Telecommunication Union settled on UTC, which matches neither language and therefore offends both equally. It is, in its way, a perfect diplomatic outcome.

## Leap seconds, and their coming abolition

The earth does not rotate at a constant rate. To stop UTC drifting away from solar time, extra seconds have occasionally been inserted: 27 of them between 1972 and 2016. During a leap second, a UTC clock reads 23:59:60 — a real time that most software cannot represent.

Leap seconds have caused genuine outages. In 2012 a leap second took down Reddit, Mozilla's services and several airline booking systems, all through the same Linux kernel bug. In 2017 Cloudflare's DNS broke because a duration calculation went negative across the insertion.

In November 2022, the General Conference on Weights and Measures voted to stop adding leap seconds by 2035. UTC will then be allowed to drift from solar time, and the problem will be revisited when the gap becomes inconvenient — likely in a century or so.

Your browser does not expose leap seconds. JavaScript's clock pretends they never happened, which means a duration spanning one is reported a second short. For almost every purpose this is the right trade; if you are doing satellite navigation, you already knew.

## What to actually do

**Store timestamps in UTC.** Not in the user's zone, not in the server's zone, not in the zone the business happens to be headquartered in. A UTC instant is unambiguous, sortable and immune to a government changing its mind.

**Convert to local time at the moment of display**, using the reader's zone and the runtime's copy of the IANA database.

**Say UTC when you mean UTC.** Writing "GMT" in a specification invites someone to interpret it as UK local time, and in summer that is an hour out. "12:00 UTC" has exactly one meaning on every day of the year.

**Use the Z suffix in ISO 8601.** `2026-03-08T14:30:00Z` is UTC and cannot be read as anything else. `2026-03-08T14:30:00` is a local time in an unspecified zone, which is to say it is not a timestamp at all.

## The family of time scales

UTC is one of several related standards, and the differences occasionally matter.

**TAI** — International Atomic Time. The raw atomic timescale, with no leap seconds. TAI is currently 37 seconds ahead of UTC, and the gap grows each time a leap second is added. GPS satellites run on a scale offset from TAI.

**UT1** — the real rotation of the earth, measured against distant quasars. This is what UTC's leap seconds have been chasing. UTC is kept within 0.9 seconds of UT1, or was, until the 2035 decision to stop.

**GPS time** — began aligned with UTC in January 1980 and has ignored leap seconds since. It is currently 18 seconds ahead of UTC. Receivers correct for this; systems reading raw GPS time sometimes do not.

**Unix time** — the count of seconds since 1970, which pretends leap seconds do not exist by repeating a second rather than counting it. This makes it not quite a count of elapsed seconds, which is a subtlety that has bitten people measuring durations across an insertion.

For almost all software, UTC is the right answer and the rest is trivia. For anything involving satellites, high-frequency trading timestamps or scientific instrumentation, the distinctions are load-bearing.

## Why "UTC time" is redundant, and why we still write it

The T stands for time, so "UTC time" is "coordinated universal time time". Purists object.

The pages on this site say "UTC time" anyway, in headings and titles, because that is what people search for and what they type. There is a version of correctness that costs you the reader, and pedantry about an acronym is squarely in it. In the body text, where the reader is already here, it is just UTC.
