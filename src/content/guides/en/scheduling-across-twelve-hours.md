---
title: Scheduling across a twelve-hour gap
description: When two teams share no working hours at all, the fix is structural rather than a cleverer calendar. Here is what actually works.
summary: A twelve-hour gap has no good meeting time, and no amount of grid-shading changes that. The teams that manage it well stop trying to find one and change how they work instead.
publishedAt: '2026-01-15'
updatedAt: '2026-01-15'
order: 4
keywords:
  [
    'scheduling across time zones',
    'remote team time zones',
    'twelve hour time difference',
    'async work',
  ]
related: ['how-to-run-a-global-standup', 'why-daylight-saving-exists', 'how-time-zones-work']
---

San Francisco and Bengaluru are twelve and a half hours apart. A 09:00–18:00 day in one ends before the other begins. There is no clever arrangement of the calendar that produces a shared working hour, because there is no shared working hour to find.

Most teams discover this by trying anyway, settling on 21:00 for one side, and then quietly resenting it for eighteen months. What follows is what the teams that handle it well do instead.

## First, be honest about the arithmetic

Before you negotiate, work out the actual numbers, because they are often worse than people assume — and occasionally better.

The difference is not fixed. New York and Sydney are 16 hours apart in the northern winter and 14 in the northern summer, because both observe daylight saving in opposite seasons. That two-hour swing is the difference between "one shared hour" and "none at all", and it arrives without anyone changing anything.

Two cities that both keep the same offset all year — India and Japan, say — have a difference you can memorise. Two cities where only one observes daylight saving have a difference that moves twice a year. Two cities that both observe it but on different dates have a difference that is wrong for about four weeks a year.

## The four honest options

There are only four, and every workable arrangement is a combination of them.

**1. One side moves permanently.** Somebody's working day shifts by two or three hours. This works, it is stable, and it is only fair if it comes with something in return — a shorter core day, compensation, or a genuine choice. Imposing it on the junior team is how attrition starts.

**2. Alternate the pain.** The awkward call rotates: this month it is early for Bengaluru, next month late for San Francisco. Fairer in principle, harder in practice, because it requires someone to keep track and enforce it. It works best for a small number of high-value meetings.

**3. Overlap deliberately and narrowly.** Both sides agree to be available for one specific hour, close to one end of their day, and nothing else is scheduled across the gap. Everything in that hour is decisions; everything else is written.

**4. Stop meeting.** The gap becomes a feature: work is handed off at the end of each day and picked up at the start of the other's. This is the only option that scales past two locations, and it is the one that requires the most change to how the team actually works.

## What handing off well requires

Option four is where twelve-hour teams either thrive or fall apart, and the difference is almost entirely about writing.

**Decisions go in writing, with their reasoning.** Not "we decided to use Postgres" but "we decided Postgres over DynamoDB because the query patterns are relational and the operational cost of a second datastore outweighed the write throughput we would gain". The second version survives a handoff; the first generates a meeting.

**Questions are asked with enough context to answer while you sleep.** "What do you think about the schema?" costs a full day round trip. "The schema needs to support X and Y; option A does X better, option B does Y better; I lean A because Z — please say if you disagree by your morning" resolves in one cycle.

**Blockers are flagged before the handoff, not at it.** The worst pattern in an asynchronous team is discovering at 09:00 that the other side was stuck at 17:00 yesterday and said nothing for eleven hours.

**Status is visible without asking.** A board, a channel, a document — anything that answers "what happened while I was asleep" without requiring anyone to be awake.

## The recurring-meeting trap

If you do schedule a recurring call across a wide gap, be aware that it will drift. When one side changes its clocks and the other does not, a meeting anchored to one calendar shifts by an hour on the other. Twice a year, for a few weeks, it lands somewhere nobody agreed to.

Calendar software handles this correctly when the event is stored with a zone — which is another argument for choosing an anchor zone explicitly, saying so in the invitation, and letting everyone else's calendar do the conversion.

The other trap is the meeting that was scheduled when the team was in three zones and is still running now that it is in six. Wide-gap meetings accrete attendees for whom the time is much worse than it was for the original group, and nobody ever proposes moving it because moving it is somebody else's inconvenience.

## When there is genuinely nothing

Los Angeles and Mumbai share no minute of a 09:00–18:00 day, in either season. If your team spans that gap and needs synchronous decisions, someone is working outside their day — the only question is who, how often, and whether they agreed to it.

That is a management problem rather than a scheduling one, and tools cannot solve it. What tools can do is stop you discovering it in the invitation.

## A note on fairness

The arrangement that emerges is usually the one that suits whoever has the most organisational power, and it usually emerges without anyone deciding it.

Watch for the pattern where the newest, most junior or most remote team consistently takes the awkward hour. It is rarely a decision; it is the accumulation of small defaults, each individually reasonable. Once established it is invisible to the people it favours and extremely visible to everyone else.

The practical countermeasure is to write down who takes the cost, review it on a fixed schedule, and treat it as a real budget line rather than goodwill. The daylight saving change-over dates are a convenient prompt for that review, since the numbers move then anyway.
